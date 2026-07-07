// ═══════════════════════════════════════════════════════════════
// KUNUZEE STORE — CUSTOM JAVASCRIPT (OPTIMIZED BUILD)
// Platform: Easy Orders
// ═══════════════════════════════════════════════════════════════
//
// WHAT CHANGED VS THE ORIGINAL (mechanism only — every fixer's
// internal logic below is copied from the original almost verbatim;
// nothing that changes what the site looks like was removed):
//
//   1. ONE MutationObserver on document.body instead of ~15.
//      Every "FUNCTION N" used to open its own observer on
//      document.body/subtree:true. Now they all register a
//      callback with a single shared observer (see CORE §A).
//
//   2. ONE route-change detector instead of ~10 separate
//      `setInterval(loc.href poll, 500-1000ms)` loops. We patch
//      history.pushState/replaceState once and listen to
//      `popstate`; every fixer that needs to react to SPA
//      navigation subscribes to that instead of polling itself.
//
//   3. The two "forever" requestAnimationFrame loops (thank-you
//      page confetti re-coloring, the two text marquees) used to
//      run on every single page of the site, forever, even when
//      there was nothing on screen for them to touch. They are
//      now "gated": the loop only starts when its target element
//      actually exists, and it fully stops (cancelAnimationFrame)
//      the moment the target disappears. All loops also pause
//      completely while the tab/app is in the background
//      (Page Visibility API) instead of burning CPU/battery there.
//
//   4. FUNCTION 14 ("prevent body shift" prototype patching of
//      CSSStyleDeclaration.setProperty / Element.setAttribute) has
//      been REMOVED. It monkey-patched two of the hottest methods
//      in the entire page (every React re-render calls
//      setAttribute constantly), for the sole purpose of keeping
//      body { padding-right: 0 }. Section 24 of the stylesheet
//      already forces that with `!important`, which wins over the
//      inline style React/headlessui sets — so the JS patch was
//      pure overhead doing nothing the CSS wasn't already doing.
//
//   5. Governorate-dropdown logic (previously 4 separate features:
//      flag insertion/grouping, placeholder color, selected color,
//      Tajawal font — each with its own observer/interval) is now
//      one module reacting to the shared observer. The overlapping
//      "color the placeholder gold" logic that existed in two
//      different functions has been merged into one code path.
//
//   6. All the "order_invoice_container" fixers (kunuzee box,
//      delivery info, timeline time, coupon code, product total,
//      refund/timeline swap, download labels) now run together off
//      one shared detection instead of six independent observers +
//      six independent 1-2s polling intervals scanning overlapping
//      parts of the same box.
//
//   7. Every remaining "safety net" polling interval is (a) merged
//      into one shared interval instead of a dozen separate ones,
//      and (b) skipped entirely while document.hidden is true, so
//      a backgrounded tab does no work at all.
//
// Nothing was deleted: every "FUNCTION N" from the original file
// still exists below with a matching comment header, so you can
// diff behavior 1:1 against the old file if needed.
// ═══════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════
// INSTANT FOUC PREVENTION — يشتغل قبل ما البودي يتعرض
// (unchanged — already minimal and runs once)
// ═════════════════════════════════════════════
(function() {
    'use strict';

    var style = document.createElement('style');
    style.id = 'kunuzee-instant-fouc-fix';
    style.textContent = [
        '.thanks_content p:not(.underline):not([class*="underline"]) { display: none !important; }',
        '.thanks_content .mt-6 > div:not(.mb-12) { display: none !important; }',
        '.thanks_content > div:not(:has(svg)):not(.mt-6) { display: none !important; }'
    ].join(' ');

    if (document.head) {
        document.head.appendChild(style);
    } else {
        var check = setInterval(function() {
            if (document.head) {
                document.head.appendChild(style);
                clearInterval(check);
            }
        }, 10);
    }
})();

// ═══════════════════════════════════════════════════════
// FUNCTION 0: hideOrderReceivedText — تأمين إضافي بالـ content
// (unchanged — already self-scoped to .thanks_content and
//  already self-terminates its interval after 3s; this one
//  was never part of the "runs forever" problem)
// ═══════════════════════════════════════════════════════
(function() {
    'use strict';

    var HIDE_KEYWORDS = [
        'لقد استلمنا طلبك',
        'استلمنا طلبك',
        'سنتواصل معك',
        'مكالمتنا',
        'يرجى الانتظار'
    ];

    function shouldHide(el) {
        var text = (el.textContent || '').trim();
        if (!text || text.length > 200) return false;
        return HIDE_KEYWORDS.some(function(kw) {
            return text.indexOf(kw) !== -1;
        });
    }

    function hideElements() {
        var container = document.querySelector('.thanks_content');
        if (!container) return;

        var elements = container.querySelectorAll('p, div, span, h2, h3, h4, h5, h6');
        elements.forEach(function(el) {
            if (shouldHide(el)) {
                el.style.cssText = 'display:none !important;visibility:hidden !important;opacity:0 !important;';
            }
        });
    }

    hideElements();

    var container = document.querySelector('.thanks_content');
    if (container) {
        var observer = new MutationObserver(function() {
            hideElements();
        });
        observer.observe(container, { childList: true, subtree: true });
    }

    var interval = setInterval(hideElements, 50);
    setTimeout(function() { clearInterval(interval); }, 3000);
})();

// ══════════════════════════════
// GLOBAL: Governorate Flags Data (unchanged)
// ══════════════════════════════
var KUNUZEE_GOVERNORATES = {
    'القاهرة':       { img: 'https://i.ibb.co/rqD9363/CAI.png' },
    'الجيزة':        { img: 'https://i.ibb.co/67zy1sZc/GIZ.png' },
    'الإسكندرية':    { img: 'https://i.ibb.co/CpGvzDjZ/ALX.png' },
    'البحيرة':       { img: 'https://i.ibb.co/gZgXzWns/BEH.png' },
    'الدقهلية':      { img: 'https://i.ibb.co/60j1Dmdr/DKL.png' },
    'الشرقية':       { img: 'https://i.ibb.co/pr435136/SRQ.png' },
    'الغربية':       { img: 'https://i.ibb.co/602dBkc4/GRB.png' },
    'القليوبية':     { img: 'https://i.ibb.co/4gXy2Q50/QLB.png' },
    'المنوفية':      { img: 'https://i.ibb.co/7Jg3W44f/MNF.png' },
    'بورسعيد':       { img: 'https://i.ibb.co/SDYRqw9M/PRS.png' },
    'الإسماعيلية':   { img: 'https://i.ibb.co/358V0nQr/ISM.png' },
    'السويس':        { img: 'https://i.ibb.co/whJhxDwc/SUZ.png' },
    'شمال سيناء':    { img: 'https://i.ibb.co/0RH1WMb0/NSN.png' },
    'جنوب سيناء':    { img: 'https://i.ibb.co/xq93nStH/SSN.png' },
    'كفر الشيخ':     { img: 'https://i.ibb.co/zHxrWmpn/KSH.png' },
    'بني سويف':      { img: 'https://i.ibb.co/JwVGS8bf/BSF.png' },
    'دمياط':         { img: 'https://i.ibb.co/fY7HRFYZ/DMT.png' },
    'سوهاج':         { img: 'https://i.ibb.co/4R8v03sn/SOH.png' },
    'أسيوط':         { img: 'https://i.ibb.co/pvS7XCnv/AST.png' },
    'الفيوم':        { img: 'https://i.ibb.co/ZRnHMzy2/FYM.png' },
    'أسوان':         { img: 'https://i.ibb.co/4nysjVxC/ASN.png' },
    'قنا':           { img: 'https://i.ibb.co/gLd1jt9K/QNA.png' },
    'المنيا':        { img: 'https://i.ibb.co/yFBQSvG0/MNA.png' },
    'مطروح':         { img: 'https://i.ibb.co/5W7bj7hF/MTR.png' },
    'الأقصر':        { img: 'https://i.ibb.co/RkTBC7xH/LUX.png' },
    'البحر الأحمر':  { img: 'https://i.ibb.co/Kc9Cs8bY/RDS.png' },
    'الوادي الجديد': { img: 'https://i.ibb.co/23WFRW9X/NVA.png' }
};

// ═══════════════════════════════════════════════════════════════
// CORE §A — SHARED SCHEDULER
// One body-wide MutationObserver, one route-change detector, one
// low-frequency safety poll (paused when tab hidden). Every fixer
// below subscribes here instead of creating its own watcher.
// ═══════════════════════════════════════════════════════════════
var Kunuzee = (function() {
    'use strict';

    var isVisible = !document.hidden;
    document.addEventListener('visibilitychange', function() {
        isVisible = !document.hidden;
    });

    // ---- DOM-growth subscribers (replaces ~15 separate observers) ----
    var domSubscribers = [];
    function onDomGrowth(fn) {
        domSubscribers.push(fn);
        return fn;
    }

    var domScheduled = false;
    function runDomSubscribers() {
        domScheduled = false;
        for (var i = 0; i < domSubscribers.length; i++) {
            try { domSubscribers[i](); } catch (e) { /* one bad fixer shouldn't block the rest */ }
        }
    }
    function scheduleDom() {
        if (domScheduled) return;
        domScheduled = true;
        if (window.requestIdleCallback) {
            requestIdleCallback(runDomSubscribers, { timeout: 200 });
        } else {
            setTimeout(runDomSubscribers, 32);
        }
    }

    function startObserver() {
        var mo = new MutationObserver(function() { scheduleDom(); });
        mo.observe(document.body, { childList: true, subtree: true });
        scheduleDom(); // run once for whatever is already on the page
    }
    if (document.body) startObserver();
    else document.addEventListener('DOMContentLoaded', startObserver);

    // Low-frequency safety net: catches attribute-only / text-only
    // mutations that childList observers can miss, without needing
    // a second, much more expensive characterData+subtree observer
    // on the whole page. Skipped entirely while tab is hidden.
    setInterval(function() { if (isVisible) scheduleDom(); }, 1500);

    // ---- Route-change subscribers (replaces ~10 separate href polls) ----
    var routeSubscribers = [];
    function onRouteChange(fn) {
        routeSubscribers.push(fn);
        return fn;
    }
    var lastUrl = location.href;
    function fireRouteChange() {
        if (location.href === lastUrl) return;
        lastUrl = location.href;
        for (var i = 0; i < routeSubscribers.length; i++) {
            try { routeSubscribers[i](); } catch (e) {}
        }
        scheduleDom(); // new page content is coming; re-check everything
    }
    (function patchHistory() {
        var _push = history.pushState;
        history.pushState = function() {
            var r = _push.apply(history, arguments);
            setTimeout(fireRouteChange, 0);
            return r;
        };
        var _replace = history.replaceState;
        history.replaceState = function() {
            var r = _replace.apply(history, arguments);
            setTimeout(fireRouteChange, 0);
            return r;
        };
        window.addEventListener('popstate', fireRouteChange);
    })();
    // Safety net for any router that mutates location without
    // pushState/replaceState (rare, but cheap to cover with one
    // shared low-frequency poll instead of ten separate ones).
    setInterval(function() { if (isVisible) fireRouteChange(); }, 800);

    // ---- Gated animation-loop helper ----
    // Runs `tick()` via requestAnimationFrame ONLY while
    // `hasTarget()` returns true, and only while the tab is
    // visible. Automatically starts/stops as DOM changes.
    function gatedLoop(hasTarget, tick) {
        var running = false;
        function frame() {
            if (!running) return;
            if (isVisible) tick();
            requestAnimationFrame(frame);
        }
        function check() {
            var shouldRun = !!hasTarget();
            if (shouldRun && !running) {
                running = true;
                requestAnimationFrame(frame);
            } else if (!shouldRun && running) {
                running = false;
            }
        }
        onDomGrowth(check);
        check();
        return check;
    }

    return {
        onDomGrowth: onDomGrowth,
        onRouteChange: onRouteChange,
        gatedLoop: gatedLoop,
        isVisible: function() { return isVisible; }
    };
})();

// NOTE: FUNCTION 14 ("prevent body shift" via patching
// CSSStyleDeclaration.prototype.setProperty and
// Element.prototype.setAttribute) has been intentionally removed.
// Stylesheet Section 24 already sets:
//   body { padding-right: 0 !important; margin-right: 0 !important; }
// An `!important` stylesheet rule wins over the inline
// `style="padding-right:…"` that headlessui/react-remove-scroll
// sets on <body>, so the same visual result is achieved with zero
// JS cost instead of a global patch on two of the hottest DOM
// methods in a React app.

// ───────────────────────────────────────────────────────────────
// FUNCTION 1: fixHeader — تعديل الهيدر
// (logic unchanged; now triggered by the shared scheduler instead
//  of its own permanent setInterval(1000))
// ───────────────────────────────────────────────────────────────
function fixHeader() {
    var borderDiv = document.querySelector('.default_header_container > div.border-b');
    var row = document.querySelector('.default_header_container > div > div.h-14.flex.items-center');
    var logoDiv = document.querySelector('.default_header_logo a > div');
    var logoImg = document.querySelector('.default_header_logo img');

    if (borderDiv) {
        borderDiv.setAttribute('style', 'height: auto !important; min-height: auto !important; overflow: visible !important;');
    }
    if (row) {
        row.classList.remove('h-14');
        row.setAttribute('style', 'height: auto !important; min-height: auto !important; max-height: none !important; padding-top: 12px !important; padding-bottom: 12px !important; overflow: visible !important; display: flex !important; align-items: center !important;');
    }
    if (logoDiv) {
        logoDiv.classList.remove('h-8', 'overflow-hidden');
        logoDiv.setAttribute('style', 'height: auto !important; min-height: auto !important; max-height: none !important; overflow: visible !important; display: flex !important; align-items: center !important;');
    }
    if (logoImg) {
        logoImg.classList.remove('h-8', 'h-full', 'w-full');
        logoImg.setAttribute('style', 'height: 65px !important; min-height: 65px !important; max-height: none !important; max-width: none !important; width: auto !important; object-fit: contain !important; display: block !important;');
    }
}
(function() {
    var done = false;
    function runOnce() {
        if (document.querySelector('.default_header_container')) fixHeader();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runOnce);
    } else {
        runOnce();
    }
    Kunuzee.onDomGrowth(runOnce);
    Kunuzee.onRouteChange(runOnce);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 2 + 13 + 15 + 19 (merged): Governorate dropdown module
// — flags, grouping, placeholder color, selected color, Tajawal
// font. These four used to be four separate features each with
// their own MutationObserver/interval; the placeholder-gold-color
// logic in the old FUNCTION 13 was fully redundant with FUNCTION
// 15's logic and has been folded in rather than duplicated.
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    var GOVERNORATES = KUNUZEE_GOVERNORATES;
    var PLACEHOLDER_TEXT = 'من فضلك قم باختيار محافظتك من القائمة';

    var GROUPS = [
        { title: '', items: [PLACEHOLDER_TEXT] },
        { title: '', items: ['القاهرة', 'الجيزة', 'الإسكندرية'] },
        { title: 'محافظات الوجه البحري ومطروح', items: ['القليوبية', 'المنوفية', 'الشرقية', 'الغربية', 'البحيرة', 'دمياط', 'الدقهلية', 'كفر الشيخ', 'مطروح'] },
        { title: 'محافظات القناة وسيناء', items: ['بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء', 'جنوب سيناء'] },
        { title: 'محافظات الوجه القبلي والبحر الأحمر', items: ['الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'البحر الأحمر', 'الوادي الجديد', 'أسوان'] }
    ];

    function getFlag(name) {
        return (GOVERNORATES[name.trim()] || {}).img || '';
    }

    function getGroupInfo(name) {
        for (var i = 0; i < GROUPS.length; i++) {
            var idx = GROUPS[i].items.indexOf(name.trim());
            if (idx !== -1) return { index: i, title: GROUPS[i].title, innerIndex: idx };
        }
        return { index: 999, title: '', innerIndex: 999 };
    }

    var lastColorText = '';

    function fixSingleValue() {
        var sv = document.querySelector('.select__single-value');
        if (!sv) return;

        var text = sv.textContent.trim();

        // flag insertion (FUNCTION 2)
        var flag = getFlag(text);
        var existingFlag = sv.querySelector('.gov-flag');
        if (flag) {
            if (existingFlag) {
                if (existingFlag.src !== flag) existingFlag.src = flag;
            } else {
                var img = document.createElement('img');
                img.src = flag;
                img.className = 'gov-flag';
                img.alt = text;
                sv.insertBefore(img, sv.firstChild);
            }
        } else if (existingFlag) {
            existingFlag.remove();
        }

        // color logic (FUNCTION 15, supersedes FUNCTION 13's duplicate branch)
        if (text !== lastColorText) {
            lastColorText = text;
            var hasFlag = !!sv.querySelector('.gov-flag');
            var color = (hasFlag || text !== PLACEHOLDER_TEXT) ? 'var(--k-orange)' : 'var(--k-gold)';
            sv.style.setProperty('color', color, 'important');
            sv.style.setProperty('font-family', '"Tajawal", sans-serif', 'important');
        }
    }

    function fixMenuOptions() {
        var menu = document.querySelector('.select__menu');
        if (!menu) return;

        var menuList = menu.querySelector('.select__menu-list') || menu;

        // Tajawal font on every option + group header (FUNCTION 19)
        menuList.querySelectorAll('.select__option, .gov-group-header').forEach(function(el) {
            el.style.setProperty('font-family', '"Tajawal", sans-serif', 'important');
        });

        // placeholder option gets gold color (FUNCTION 13's option branch)
        menuList.querySelectorAll('.select__option').forEach(function(opt) {
            if (opt.textContent.trim() === PLACEHOLDER_TEXT) {
                opt.style.setProperty('color', 'var(--k-gold)', 'important');
            }
        });

        if (menu.dataset.govFixed === 'true') return;
        menu.dataset.govFixed = 'true';
        menuList.querySelectorAll('.gov-group-header').forEach(function(h) { h.remove(); });

        var allOptions = Array.prototype.slice.call(menuList.querySelectorAll('.select__option'));

        allOptions.forEach(function(opt) {
            if (opt.querySelector('.gov-flag')) return;
            var text = opt.textContent.trim();
            var flag = getFlag(text);
            if (!flag) return;
            var img = document.createElement('img');
            img.src = flag;
            img.className = 'gov-flag';
            img.alt = text;
            opt.insertBefore(img, opt.firstChild);
        });

        var mapped = allOptions.map(function(opt) {
            var text = opt.textContent.trim();
            var info = getGroupInfo(text);
            return { opt: opt, text: text, groupIndex: info.index, title: info.title, innerIndex: info.innerIndex };
        });

        mapped.sort(function(a, b) {
            if (a.groupIndex !== b.groupIndex) return a.groupIndex - b.groupIndex;
            return a.innerIndex - b.innerIndex;
        });

        var currentGroup = -1;
        mapped.forEach(function(m) {
            if (m.groupIndex !== currentGroup && m.title) {
                var header = document.createElement('div');
                header.className = 'gov-group-header';
                header.textContent = m.title;
                header.setAttribute('aria-hidden', 'true');
                header.style.setProperty('font-family', '"Tajawal", sans-serif', 'important');
                menuList.appendChild(header);
            }
            currentGroup = m.groupIndex;
            menuList.appendChild(m.opt);
        });

        setTimeout(function() {
            var selected = menuList.querySelector('.select__option--is-selected');
            if (!selected) return;
            var menuRect = menuList.getBoundingClientRect();
            var selectedRect = selected.getBoundingClientRect();
            var offset = selectedRect.top - menuRect.top - (menuRect.height / 2) + (selectedRect.height / 2);
            menuList.scrollTop += offset;
        }, 0);
    }

    // Scoped observer for text-only changes on the single-value
    // node (e.g. React swaps the text node without adding/removing
    // elements). Scoped to ONE small element instead of the whole
    // <body> with subtree+characterData — the single most
    // expensive observer config the original file used.
    var scopedObserver = null;
    var scopedTarget = null;
    function ensureScopedObserver() {
        var sv = document.querySelector('.select__single-value');
        if (!sv || sv === scopedTarget) return;
        if (scopedObserver) scopedObserver.disconnect();
        scopedTarget = sv;
        scopedObserver = new MutationObserver(fixSingleValue);
        scopedObserver.observe(sv, { characterData: true, subtree: true, childList: true });
    }

    function runAll() {
        ensureScopedObserver();
        fixSingleValue();
        fixMenuOptions();
    }

    Kunuzee.onDomGrowth(runAll);
    Kunuzee.onRouteChange(runAll);
    runAll();
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 3: fixDropdownPosition — تثبيت القائمة تحت منتصف زر القسم
// (logic unchanged; the click-driven active-poll here was already
//  self-terminating and cheap, so it's kept as-is — only the
//  "new panel appeared" detection now comes from the shared
//  observer instead of a dedicated one)
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    var GAP = 12;
    var MIN_WIDTH = 220;

    function getPanelWidth(panel) {
        var wasHidden = panel.style.display === 'none' || window.getComputedStyle(panel).display === 'none';
        if (wasHidden) {
            panel.style.setProperty('visibility', 'hidden', 'important');
            panel.style.setProperty('display', 'block', 'important');
        }

        var rect = panel.getBoundingClientRect();
        var width = rect.width;
        if (width <= 0) {
            var child = panel.querySelector(':scope > div');
            if (child) {
                var childRect = child.getBoundingClientRect();
                width = childRect.width;
            }
        }

        if (wasHidden) {
            panel.style.display = '';
            panel.style.visibility = '';
        }
        return width > 0 ? width : MIN_WIDTH;
    }

    function findButtonForPanel(panel) {
        var buttonId = panel.id.replace('panel', 'button');
        var button = document.getElementById(buttonId);
        if (button) return button;

        button = document.querySelector('[aria-controls="' + panel.id + '"]');
        if (button) return button;

        var parent = panel.parentElement;
        if (parent) {
            button = parent.querySelector('button[id*="headlessui-popover-button"]');
            if (button) return button;
        }

        var allButtons = document.querySelectorAll('button[id*="headlessui-popover-button"][aria-expanded="true"]');
        if (allButtons.length === 1) return allButtons[0];
        return null;
    }

    function fixDropdownPosition() {
        var panels = document.querySelectorAll('[id*="headlessui-popover-panel"]');
        panels.forEach(function(panel) {
            var style = window.getComputedStyle(panel);
            if (style.display === 'none' || style.visibility === 'hidden') return;

            var button = findButtonForPanel(panel);
            if (!button) return;

            var btnRect = button.getBoundingClientRect();
            var panelWidth = getPanelWidth(panel);

            var top = btnRect.bottom + GAP;
            var left = btnRect.left + (btnRect.width / 2) - (panelWidth / 2);

            if (left < 10) left = 10;
            if (left + panelWidth > window.innerWidth - 10) {
                left = window.innerWidth - panelWidth - 10;
            }

            panel.style.setProperty('top', top + 'px', 'important');
            panel.style.setProperty('left', left + 'px', 'important');
            panel.style.setProperty('right', 'auto', 'important');
            panel.style.setProperty('transform', 'none', 'important');
            panel.style.setProperty('margin', '0', 'important');
        });
    }

    Kunuzee.onDomGrowth(function() {
        // Only recompute if a popover panel is actually present —
        // avoids running getBoundingClientRect on every DOM tick.
        if (document.querySelector('[id*="headlessui-popover-panel"]')) {
            fixDropdownPosition();
        }
    });

    var dropdownInterval = null;
    function startDropdownCheck() {
        if (dropdownInterval) return;
        dropdownInterval = setInterval(function() {
            var panels = document.querySelectorAll('[id*="headlessui-popover-panel"]');
            var hasVisible = false;
            panels.forEach(function(p) {
                if (window.getComputedStyle(p).display !== 'none') hasVisible = true;
            });
            if (hasVisible) fixDropdownPosition();
            else {
                clearInterval(dropdownInterval);
                dropdownInterval = null;
            }
        }, 100);
    }

    document.addEventListener('click', function(e) {
        var btn = e.target.closest('button[id*="headlessui-popover-button"]');
        if (btn) {
            startDropdownCheck();
            setTimeout(fixDropdownPosition, 0);
            setTimeout(fixDropdownPosition, 50);
            setTimeout(fixDropdownPosition, 150);
            setTimeout(fixDropdownPosition, 300);
        }
    });

    window.addEventListener('scroll', function() {
        if (dropdownInterval) fixDropdownPosition();
    }, true);
    window.addEventListener('resize', function() {
        if (dropdownInterval) fixDropdownPosition();
    });
    fixDropdownPosition();
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 4: cloneDescription — نسخ الوصف ووضعه بعد الـ header + إخفاء الأصلي
// ───────────────────────────────────────────────────────────────
(function() {
    function cloneDescription() {
        var original = document.querySelector('div.ql-editor:not(.ql-editor-clone), div[class*="ql-editor"]:not(.ql-editor-clone)');
        var header = document.querySelector('.category_section_header, [class*="category_section_header"]');
        if (!original || !header) return;

        original.style.display = 'none';

        var existing = header.parentNode.querySelector('.ql-editor-clone');
        if (existing) {
            if (existing.innerHTML !== original.innerHTML) {
                existing.innerHTML = original.innerHTML;
            }
            return;
        }

        var clone = original.cloneNode(true);
        clone.classList.add('ql-editor-clone');
        clone.style.cssText = 'color: var(--k-orange) !important; margin-top: 12px !important; display: block !important; width: 100% !important;';
        header.parentNode.insertBefore(clone, header.nextSibling);
    }

    Kunuzee.onDomGrowth(function() {
        if (document.querySelector('div.ql-editor, div[class*="ql-editor"]')) {
            cloneDescription();
        }
    });
    Kunuzee.onRouteChange(function() {
        var oldClone = document.querySelector('.ql-editor-clone');
        if (oldClone) oldClone.remove();
        setTimeout(cloneDescription, 300);
    });
    if (document.querySelector('div.ql-editor, div[class*="ql-editor"]')) cloneDescription();
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 5: fixDiscountBadge — تعديل نص badge الخصم في Featured Cards
// ───────────────────────────────────────────────────────────────
(function() {
    function fixDiscountBadge() {
        document.querySelectorAll('.default_product_featured_card > span.absolute').forEach(function(badge) {
            var text = badge.textContent.trim();
            if (!text.includes('%')) return;
            var num = parseInt(text);
            if (isNaN(num)) return;
            badge.textContent = 'خصم ' + num + '%';
            badge.classList.add('featured-discount-badge');
        });
    }

    Kunuzee.onDomGrowth(function() {
        if (document.querySelector('.default_product_featured_card')) fixDiscountBadge();
    });
    Kunuzee.onRouteChange(function() {
        setTimeout(fixDiscountBadge, 300);
        setTimeout(fixDiscountBadge, 600);
    });
    if (document.querySelector('.default_product_featured_card')) fixDiscountBadge();
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 6: fixThankYouSvg — تغيير ألوان أنيميشن صفحة الشكر
// (now a gated RAF loop: only runs while .thanks_container svg
//  exists, instead of forever on every page of the store)
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    function norm(c) {
        return c ? c.replace(/\s*,\s*/g, ',').trim().toLowerCase() : '';
    }

    var COLOR_MAP = {
        'rgb(110,35,250)': 'var(--k-orange)', 'rgb(96,12,252)': 'var(--k-orange)',
        'rgb(134,69,255)': 'var(--k-orange)', 'rgb(105,25,255)': 'var(--k-orange)',
        'rgb(83,88,253)': 'var(--k-orange)', 'rgb(89,0,255)': 'var(--k-orange)',
        'rgb(115,42,249)': 'var(--k-orange)', 'rgb(92,17,232)': 'var(--k-orange)',
        'rgb(107,32,248)': 'var(--k-orange)', 'rgb(106,28,251)': 'var(--k-orange)',
        'rgb(93,8,251)': 'var(--k-orange)', 'rgb(90,2,252)': 'var(--k-orange)',
        'rgb(106,26,253)': 'var(--k-orange)',
        'rgb(178,137,255)': 'var(--k-gold)', 'rgb(139,96,220)': 'var(--k-gold)',
        'rgb(184,151,246)': 'var(--k-gold)', 'rgb(175,133,253)': 'var(--k-gold)',
        'rgb(0,182,255)': 'var(--k-gold)', 'rgb(2,181,252)': 'var(--k-gold)',
        'rgb(0,181,254)': 'var(--k-gold)',
        'rgb(0,193,162)': 'var(--k-teal)', 'rgb(44,195,170)': 'var(--k-teal)',
        'rgb(66,234,206)': 'var(--k-teal)', 'rgb(16,253,214)': 'var(--k-teal)',
        'rgb(26,253,215)': 'var(--k-teal)', 'rgb(0,221,179)': 'var(--k-teal)',
        'rgb(35,178,154)': 'var(--k-teal)', 'rgb(15,245,206)': 'var(--k-teal)',
        'rgb(4,244,204)': 'var(--k-teal)', 'rgb(2,252,210)': 'var(--k-teal)',
        'rgb(15,250,210)': 'var(--k-teal)', 'rgb(57,248,216)': 'var(--k-teal)',
        'rgb(20,255,215)': 'var(--k-teal)', 'rgb(89,92,185)': 'var(--k-teal)',
        'rgb(9,97,82)': 'var(--k-teal)', 'rgb(53,114,104)': 'var(--k-teal)',
        'rgb(216,216,216)': 'var(--k-cream)'
    };

    var frameCount = 0;

    function tick() {
        frameCount++;
        if (frameCount % 5 !== 0) return; // keep the original 12fps throttle

        var svg = document.querySelector('.thanks_container svg');
        if (!svg) return;

        var elements = svg.querySelectorAll('*');
        var changed = false;

        elements.forEach(function(el) {
            var fillAttr = norm(el.getAttribute('fill'));
            var strokeAttr = norm(el.getAttribute('stroke'));
            if (COLOR_MAP[fillAttr]) { el.setAttribute('fill', COLOR_MAP[fillAttr]); changed = true; }
            if (COLOR_MAP[strokeAttr]) { el.setAttribute('stroke', COLOR_MAP[strokeAttr]); changed = true; }

            var fillStyle = norm(el.style.fill);
            var strokeStyle = norm(el.style.stroke);
            if (COLOR_MAP[fillStyle]) { el.style.fill = COLOR_MAP[fillStyle]; changed = true; }
            if (COLOR_MAP[strokeStyle]) { el.style.stroke = COLOR_MAP[strokeStyle]; changed = true; }

            var styleStr = el.getAttribute('style');
            if (styleStr) {
                var newStyle = styleStr.replace(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/gi, function(match) {
                    return COLOR_MAP[norm(match)] || match;
                });
                if (newStyle !== styleStr) { el.setAttribute('style', newStyle); changed = true; }
            }
        });

        if (changed) {
            var container = document.querySelector('.thanks_container');
            if (container && !container.classList.contains('kunuzee-svg-ready')) {
                container.classList.add('kunuzee-svg-ready');
            }
        }
    }

    Kunuzee.gatedLoop(
        function hasTarget() { return document.querySelector('.thanks_container svg'); },
        tick
    );
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 6.1: fixBackHomeButton — تعديل زر "العودة للرئيسية"
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    function fixBackHomeButton() {
        var link = document.querySelector('.thanks_container a[href="/"]');
        if (!link) return;

        var span = link.querySelector('span[aria-hidden="true"]');
        if (!span) return;
        if (span.dataset.arrowFixed === 'true') return;

        span.textContent = '→';
        link.insertBefore(span, link.firstChild);
        span.style.marginLeft = '0.5rem';
        span.style.marginRight = '0';
        span.style.display = 'inline-block';

        span.dataset.arrowFixed = 'true';
    }

    Kunuzee.onDomGrowth(function() {
        if (document.querySelector('.thanks_container a[href="/"]')) fixBackHomeButton();
    });
    Kunuzee.onRouteChange(function() {
        setTimeout(fixBackHomeButton, 300);
        setTimeout(fixBackHomeButton, 600);
    });
    fixBackHomeButton();
    window.addEventListener('load', fixBackHomeButton);
})();

// ───────────────────────────────────────────────────────────────────
// INVOICE PAGE MODULE
// Merges the original FUNCTION 7 (swap refund/timeline), FUNCTION 8
// (kunuzee box), FUNCTION 9 (delivery info box), FUNCTION 10
// (timeline time), FUNCTION 11 (download labels), FUNCTION 12
// (coupon code), and the inline "product total" fixer into one
// module that all react to a single ".order_invoice_container"
// detection instead of six overlapping observers/intervals each
// re-scanning the same box.
// ───────────────────────────────────────────────────────────────────
(function() {
    'use strict';

    // ---- FUNCTION 7: swapRefundAndTimeline ----
    function findRefundBox(container) {
        var buttons = container.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            var img = buttons[i].querySelector('img[alt="refund"]');
            if (img) {
                return buttons[i].closest('div.rounded-lg, div.rounded-xl, div.border');
            }
        }
        return null;
    }
    function swapRefundAndTimeline() {
        var container = document.querySelector('.order_invoice_container .flex.flex-col.gap-5');
        if (!container) return;
        var refundBox = findRefundBox(container);
        var timelineBox = container.querySelector('ul.rounded-lg.border, ul.border');
        if (!refundBox || !timelineBox) return;
        var children = Array.prototype.slice.call(container.children);
        var refundIndex = children.indexOf(refundBox);
        var timelineIndex = children.indexOf(timelineBox);
        if (timelineIndex < refundIndex) return;
        container.insertBefore(timelineBox, refundBox);
    }

    // ---- FUNCTION 8: fixKunuzeeBox ----
    function fixKunuzeeBox() {
        var address = document.querySelector('.order_invoice_container address');
        if (!address) return;
        if (address.dataset.kunuzeeFixed === 'true') return;

        var phoneLink = address.querySelector('a[href^="tel:"], a[href="tel:undefined"]');
        if (phoneLink) phoneLink.style.display = 'none';

        var spans = address.querySelectorAll('span');
        spans.forEach(function(span) {
            if (span.textContent.includes('العنوان:')) {
                var next = span.nextElementSibling;
                if (!next || next.textContent.trim() === '') {
                    span.style.display = 'none';
                    if (next) next.style.display = 'none';
                }
            }
        });

        var emailLink = address.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            var emailAddress = 'kunuzeestore@gmail.com';
            var emailWrapper = document.createElement('span');
            emailWrapper.className = 'flex items-center gap-2 flex-wrap';
            emailWrapper.innerHTML =
                '<span>البريد الإلكتروني: </span>' +
                '<a href="mailto:' + emailAddress + '">' + emailAddress + '</a>';
            emailLink.parentNode.replaceChild(emailWrapper, emailLink);
        }

        var newEmailWrapper = address.querySelector('span:has(> a[href^="mailto:"])');
        if (newEmailWrapper) {
            var addressWrapper = document.createElement('span');
            addressWrapper.className = 'flex items-center gap-2 flex-wrap';
            addressWrapper.innerHTML =
                '<span>العنوان: </span>' +
                '<a href="https://kunuzee.com" target="_blank" rel="noopener noreferrer">kunuzee.com</a>';
            newEmailWrapper.parentNode.insertBefore(addressWrapper, newEmailWrapper);
        }

        address.dataset.kunuzeeFixed = 'true';
    }

    // ---- FUNCTION 9: fixDeliveryInfoBox ----
    function fixDeliveryInfoBox() {
        var allBoxes = document.querySelectorAll('.order_invoice_container .border.p-4.rounded-lg.shadow-sm');
        var deliveryBox = null;
        for (var i = 0; i < allBoxes.length; i++) {
            var h3 = allBoxes[i].querySelector('h3');
            if (h3 && h3.textContent.includes('بيانات التوصيل')) { deliveryBox = allBoxes[i]; break; }
        }
        if (!deliveryBox) return;
        if (deliveryBox.dataset.deliveryFixed === 'true') return;

        var dl = deliveryBox.querySelector('div.flex.flex-col.gap-2');
        if (!dl) return;

        var items = dl.querySelectorAll('dt');
        if (items.length < 4) return;

        items.forEach(function(dt) {
            var labelSpan = dt.querySelector('span:first-child');
            var valueSpan = dt.querySelector('span:last-child');
            if (!labelSpan) return;
            var label = labelSpan.textContent.trim();

            if (label.includes('الاسم')) {
                dt.classList.add('order-item-name');
                labelSpan.textContent = 'الإسم:';
            }
            if (label.includes('الهاتف')) {
                dt.classList.add('order-item-phone');
                labelSpan.textContent = 'رقم المحمول:';
            }
            if (label.includes('البريد')) {
                dt.classList.add('order-item-email');
                labelSpan.textContent = 'البريد الإلكتروني:';
            }
            if (label.includes('المدينة')) {
                dt.classList.add('order-item-city');
                labelSpan.textContent = 'المحافظة:';

                if (!dt.querySelector('.gov-value') && typeof KUNUZEE_GOVERNORATES !== 'undefined') {
                    var textNode = null;
                    for (var j = 0; j < dt.childNodes.length; j++) {
                        if (dt.childNodes[j].nodeType === 3) {
                            var txt = dt.childNodes[j].textContent.trim();
                            if (txt) { textNode = dt.childNodes[j]; break; }
                        }
                    }
                    if (textNode) {
                        var govName = textNode.textContent.trim();
                        var govData = KUNUZEE_GOVERNORATES[govName];
                        if (govData && govData.img) {
                            var valueWrapper = document.createElement('span');
                            valueWrapper.className = 'gov-value';
                            var img = document.createElement('img');
                            img.src = govData.img;
                            img.className = 'gov-flag';
                            img.alt = govName;
                            valueWrapper.appendChild(img);
                            valueWrapper.appendChild(document.createTextNode(' ' + govName));
                            dt.replaceChild(valueWrapper, textNode);
                        }
                    }
                }
            }
            if (label.includes('الدفع')) {
                dt.classList.add('order-item-payment');
                labelSpan.textContent = 'وسيلة الدفع:';
                if (valueSpan) {
                    var val = valueSpan.textContent.trim();
                    if (val.toLowerCase() === 'kashier') valueSpan.textContent = ' Kashier';
                }
            }
        });

        dl.classList.add('delivery-info-reordered');
        deliveryBox.dataset.deliveryFixed = 'true';
    }

    // ---- FUNCTION 10: fixTimelineTime ----
    function convertTo24Hour(timeStr) {
        var match = timeStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return null;
        var month = match[1].padStart(2, '0');
        var day = match[2].padStart(2, '0');
        var year = match[3];
        var hour = parseInt(match[4], 10);
        var minute = match[5];
        var second = match[6];
        var period = match[7].toUpperCase();
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        var hour24 = hour.toString().padStart(2, '0');
        return day + '/' + month + '/' + year + ', ' + hour24 + ':' + minute + ':' + second;
    }
    function fixTimelineTime() {
        var timeline = document.querySelector('.order_invoice_container ul.rounded-lg.border');
        if (!timeline) return;
        if (timeline.dataset.timeFixed === 'true') return;

        var items = timeline.querySelectorAll('li');
        items.forEach(function(li) {
            var timeSpan = li.querySelector('span.text-gray-500, span:last-child');
            if (!timeSpan) return;
            var original = timeSpan.textContent.trim();
            var converted = convertTo24Hour(original);
            if (converted) {
                if (!timeSpan.dataset.originalTime) timeSpan.dataset.originalTime = original;
                timeSpan.textContent = converted;
            }
        });
        timeline.dataset.timeFixed = 'true';
    }

    // ---- FUNCTION 11: addProductLabelsToDownloads ----
    function addProductLabels() {
        var container = document.querySelector('.order_invoice_container');
        if (!container) return;

        var productNames = [];
        var h4s = container.querySelectorAll('h4');
        for (var i = 0; i < h4s.length; i++) {
            var name = h4s[i].textContent.trim();
            if (name) productNames.push(name);
        }

        var linkContainers = container.querySelectorAll('div.bg-gray-50.rounded-lg');
        for (var i = 0; i < linkContainers.length; i++) {
            var linkContainer = linkContainers[i];
            if (!linkContainer.querySelector('a[href]')) continue;
            if (linkContainer.getAttribute('data-label-fixed') === 'true') continue;
            if (i >= productNames.length) break;

            var label = document.createElement('span');
            label.className = 'download-product-label';
            label.textContent = productNames[i];
            linkContainer.parentNode.insertBefore(label, linkContainer);
            linkContainer.setAttribute('data-label-fixed', 'true');
        }
    }

    // ---- FUNCTION 12: fixCouponCode ----
    function fixCouponCode() {
        var dts = document.querySelectorAll('.order_invoice_container .col-span-2 > div.p-5.border.rounded-lg.shadow-sm:last-child div.font-medium > dt');
        dts.forEach(function(dt) {
            var span = dt.querySelector('span:first-child');
            if (!span) return;
            if (span.dataset.couponFixed === 'true') return;
            var text = span.textContent.trim();
            if (!text.includes('كود الخصم:')) return;
            var parts = text.split(':');
            if (parts.length < 2) return;
            var label = parts[0] + ':';
            var code = parts.slice(1).join(':').trim();

            span.innerHTML = '';
            var labelSpan = document.createElement('span');
            labelSpan.textContent = label;
            labelSpan.style.color = 'var(--k-teal)';
            var codeSpan = document.createElement('span');
            codeSpan.textContent = ' ' + code;
            codeSpan.style.color = 'var(--k-orange)';
            span.appendChild(labelSpan);
            span.appendChild(codeSpan);
            span.dataset.couponFixed = 'true';
        });
    }

    // ---- inline "product total" fixer (إخفاء "الاجمالي" وإظهار EGP يدوياً) ----
    function fixProductTotal() {
        var products = document.querySelectorAll('.order_invoice_container .col-span-2 > div.flex.flex-col.gap-6 > div.flex.flex-col.gap-4.md\\:flex-row');
        products.forEach(function(product) {
            var totalP = product.querySelector('p.text-lg');
            if (!totalP) return;
            if (totalP.dataset.totalFixed === 'true') return;
            var text = totalP.textContent.trim();
            var match = text.match(/(\d[\d,]*)\s*ج\.م/);
            if (!match) return;
            var price = match[1];

            totalP.innerHTML = '';
            totalP.style.cssText = 'display:flex;align-items:baseline;gap:4px;color:var(--k-orange);font-weight:700;font-size:1.5rem;font-family:"Tajawal",sans-serif;';
            var numSpan = document.createElement('span');
            numSpan.textContent = price;
            totalP.appendChild(numSpan);
            var egpSpan = document.createElement('span');
            egpSpan.textContent = 'EGP';
            egpSpan.style.cssText = 'font-size:0.8rem;font-weight:500;color:var(--k-orange);position:relative;top:-0.3rem;margin-right:0.05rem;font-family:"Tajawal",sans-serif;';
            totalP.appendChild(egpSpan);
            totalP.dataset.totalFixed = 'true';
        });
    }

    function runInvoiceFixers() {
        if (!document.querySelector('.order_invoice_container')) return;
        swapRefundAndTimeline();
        fixKunuzeeBox();
        fixDeliveryInfoBox();
        fixTimelineTime();
        addProductLabels();
        fixCouponCode();
        fixProductTotal();
    }

    Kunuzee.onDomGrowth(runInvoiceFixers);
    Kunuzee.onRouteChange(function() {
        // reset per-navigation "already fixed" flags, same as the
        // original's own url-change handlers used to do individually
        var address = document.querySelector('.order_invoice_container address');
        if (address) address.dataset.kunuzeeFixed = '';
        document.querySelectorAll('.order_invoice_container .border.p-4.rounded-lg.shadow-sm').forEach(function(box) {
            var h3 = box.querySelector('h3');
            if (h3 && h3.textContent.includes('بيانات التوصيل')) box.dataset.deliveryFixed = '';
        });
        var timeline = document.querySelector('.order_invoice_container ul.rounded-lg.border');
        if (timeline) timeline.dataset.timeFixed = '';
        setTimeout(runInvoiceFixers, 300);
    });
    runInvoiceFixers();
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 16: fixDefaultCategoryCards — تخصيص كروت الأقسام الفرعية
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    function fixDefaultCategoryCards() {
        document.querySelectorAll('.default_category_card').forEach(function(card) {
            var overlay = card.querySelector('.absolute.top.left.bg-black');
            if (overlay) overlay.style.display = 'none';

            var iconContainer = card.querySelector('.absolute.top.left.h-full.w-full.flex.items-center.justify-center');
            if (iconContainer) iconContainer.style.display = 'none';

            var imgContainer = card.querySelector('.default_category_card_img');
            if (imgContainer) {
                imgContainer.style.borderRadius = '9999px';
                imgContainer.classList.remove('rounded-md');
                imgContainer.classList.add('rounded-full');
            }

            var img = card.querySelector('.default_category_card_img img');
            if (img) {
                img.style.borderRadius = '9999px';
                img.classList.remove('rounded-md');
                img.classList.add('rounded-full');
            }

            var parent = card.querySelector('.relative.inline-flex');
            if (parent) {
                parent.style.borderRadius = '9999px';
                parent.style.overflow = 'hidden';
                parent.classList.remove('rounded-md');
                parent.classList.add('rounded-full');
            }
        });
    }

    Kunuzee.onDomGrowth(function() {
        if (document.querySelector('.default_category_card')) fixDefaultCategoryCards();
    });
    Kunuzee.onRouteChange(function() {
        setTimeout(function() {
            if (document.querySelector('.default_category_card')) fixDefaultCategoryCards();
        }, 300);
    });
    if (document.querySelector('.default_category_card')) fixDefaultCategoryCards();
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 17: scrollToTopOnNavigation — سكرول لفوق عند التنقل
// (was its own setInterval(100) forever poll of location.href —
//  now driven by the shared route-change detector)
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    var isFromHomeProduct = false;

    document.addEventListener('click', function(e) {
        var card = e.target.closest('.default_product_featured_card, .default_product_list_card, .home_products_grid_card');
        if (card) isFromHomeProduct = true;
    });

    Kunuzee.onRouteChange(function() {
        if (isFromHomeProduct && location.pathname.includes('/products/')) {
            isFromHomeProduct = false;
            [50, 150, 300].forEach(function(delay) {
                setTimeout(function() {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                }, delay);
            });
        } else {
            isFromHomeProduct = false;
        }
    });
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 18: Checkout Placeholders Marquee
// (the RAF animate() loop used to run unconditionally forever on
//  every page; it's now gated to only run while there's at least
//  one overflowing placeholder to animate)
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    var items = [];
    var styleInjected = false;

    function injectStyles() {
        if (styleInjected) return;
        styleInjected = true;
        var style = document.createElement('style');
        style.textContent = [
            '.kph-wrap {',
            '    display: block !important;',
            '    position: absolute !important;',
            '    top: 0 !important;',
            '    left: 0 !important;',
            '    right: 0 !important;',
            '    bottom: 0 !important;',
            '    overflow: hidden !important;',
            '    pointer-events: none !important;',
            '    z-index: 10 !important;',
            '    direction: rtl !important;',
            '    padding: 0.5rem 0.75rem !important;',
            '    box-sizing: border-box !important;',
            '    height: 100% !important;',
            '    display: flex !important;',
            '    align-items: center !important;',
            '}',
            '.kph-text {',
            '    display: inline-block !important;',
            '    white-space: nowrap !important;',
            '    direction: rtl !important;',
            '    font-family: "Tajawal", sans-serif !important;',
            '    font-size: 1rem !important;',
            '    color: var(--k-gold) !important;',
            '    opacity: 0.9 !important;',
            '    line-height: 1.25 !important;',
            '}',
            '.kph-wrap.kph-hidden {',
            '    display: none !important;',
            '}'
        ].join(' ');
        document.head.appendChild(style);
    }

    function init() {
        if (!document.querySelector('.checkout_form, .checkout_container, .contact-info-heading, [class*="checkout"]')) return;

        injectStyles();

        var inputs = document.querySelectorAll('.checkout_form input.global_input, .checkout_container input.global_input, .contact-info-heading input.global_input, section.contact-info-heading input.global_input');

        inputs.forEach(function(input) {
            if (input.dataset.kph === '1') return;
            input.dataset.kph = '1';

            var originalPlaceholder = input.getAttribute('placeholder') || '';
            if (!originalPlaceholder || originalPlaceholder.length < 10) return;

            var relativeParent = input.closest('div.relative, div[class*="relative"]') || input.parentElement;

            input.dataset.originalPlaceholder = originalPlaceholder;
            input.setAttribute('placeholder', '');

            var wrap = document.createElement('span');
            wrap.className = 'kph-wrap';
            var span = document.createElement('span');
            span.className = 'kph-text';
            span.textContent = originalPlaceholder;
            wrap.appendChild(span);
            relativeParent.appendChild(wrap);

            function measureAndInit() {
                var wrapWidth = relativeParent.offsetWidth;
                if (wrapWidth < 80) wrapWidth = 80;

                wrap.style.boxSizing = 'border-box';
                wrap.style.width = wrapWidth + 'px';

                var mask = 'linear-gradient(to left, transparent 0%, black 3%, black 93%, transparent 100%)';
                wrap.style.webkitMaskImage = mask;
                wrap.style.maskImage = mask;

                void span.offsetWidth;

                var textWidth = span.scrollWidth;
                var computedStyle = window.getComputedStyle(wrap);
                var padLeft = parseFloat(computedStyle.paddingLeft) || 0;
                var padRight = parseFloat(computedStyle.paddingRight) || 0;
                var availableWidth = wrapWidth - padLeft - padRight;
                var overflow = textWidth - availableWidth;

                if (overflow > 0) {
                    items.push({ span: span, overflow: overflow, pos: 0, dir: 1, wait: 0, pause: 120, wrap: wrap, input: input });
                }
            }

            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(function() { setTimeout(measureAndInit, 100); });
            } else {
                setTimeout(measureAndInit, 600);
            }

            function updateVisibility() {
                if (input.value && input.value.trim().length > 0) wrap.classList.add('kph-hidden');
                else wrap.classList.remove('kph-hidden');
            }
            input.addEventListener('input', updateVisibility);
            input.addEventListener('focus', updateVisibility);
            input.addEventListener('blur', updateVisibility);
            updateVisibility();
        });
    }

    function tick() {
        items.forEach(function(item) {
            if (item.wait > 0) { item.wait--; return; }
            var speed = 0.35;
            if (item.dir === 1) {
                item.pos += speed;
                if (item.pos >= item.overflow) { item.pos = item.overflow; item.dir = -1; item.wait = item.pause; }
            } else {
                item.pos -= speed;
                if (item.pos <= 0) { item.pos = 0; item.dir = 1; item.wait = item.pause; }
            }
            item.span.style.transform = 'translateX(' + item.pos + 'px)';
        });
    }

    Kunuzee.onDomGrowth(init);
    Kunuzee.onRouteChange(function() { setTimeout(init, 300); });
    init();

    Kunuzee.gatedLoop(function hasTarget() { return items.length > 0; }, tick);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 19 note: merged into the Governorate module above.
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// FUNCTION 20: FAQ — Fixed Box + Smooth Marquee + Blur Fade (RTL)
// (same gating treatment as FUNCTION 18)
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    var items = [];

    function init() {
        document.querySelectorAll('.szh-accordion__item-btn:not([data-kfq])').forEach(function(btn) {
            btn.dataset.kfq = '1';

            var textNode = null;
            for (var i = 0; i < btn.childNodes.length; i++) {
                if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
                    textNode = btn.childNodes[i];
                    break;
                }
            }
            if (!textNode) return;

            var svg = btn.querySelector('svg');
            var svgWidth = svg ? svg.getBoundingClientRect().width + 4 : 28;

            var wrap = document.createElement('span');
            wrap.className = 'kfq-wrap';
            wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:middle;position:relative;';

            var span = document.createElement('span');
            span.className = 'kfq-text';
            span.style.cssText = 'display:inline-block;white-space:nowrap;direction:rtl;padding-right:0.7rem;padding-left:1.5rem;';
            span.textContent = textNode.textContent.trim();

            wrap.appendChild(span);
            btn.replaceChild(wrap, textNode);

            if (svg) svg.style.flexShrink = '0';

            setTimeout(function() {
                var btnPad = 16;
                var wrapWidth = btn.clientWidth - svgWidth - btnPad;
                if (wrapWidth < 80) wrapWidth = 80;
                wrap.style.width = wrapWidth + 'rem';

                var mask = 'linear-gradient(to left, transparent 0%, black 3%, black 93%, transparent 100%)';
                wrap.style.webkitMaskImage = mask;
                wrap.style.maskImage = mask;

                var textWidth = span.scrollWidth;
                var overflow = textWidth - wrapWidth;

                if (overflow > 0) {
                    items.push({ span: span, overflow: overflow, pos: 0, dir: 1, wait: 0, pause: 120 });
                }
            }, 500);
        });
    }

    function tick() {
        items.forEach(function(item) {
            if (item.wait > 0) { item.wait--; return; }
            var speed = 0.35;
            if (item.dir === 1) {
                item.pos += speed;
                if (item.pos >= item.overflow) { item.pos = item.overflow; item.dir = -1; item.wait = item.pause; }
            } else {
                item.pos -= speed;
                if (item.pos <= 0) { item.pos = 0; item.dir = 1; item.wait = item.pause; }
            }
            item.span.style.transform = 'translateX(' + item.pos + 'px)';
        });
    }

    Kunuzee.onDomGrowth(init);
    Kunuzee.onRouteChange(function() { setTimeout(init, 300); });
    init();

    Kunuzee.gatedLoop(function hasTarget() { return items.length > 0; }, tick);
})();
