// ═══════════════════════════════════════════════════════════════
// KUNUZEE STORE — CUSTOM JAVASCRIPT
// Platform: Easy Orders
// ═══════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════
// INSTANT FOUC PREVENTION — يشتغل قبل ما البودي يتعرض
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
// GLOBAL: Governorate Flags Data
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

// ───────────────────────────────────────────────────────────────
// FUNCTION 1: fixHeader — تعديل الهيدر
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixHeader);
} else {
    fixHeader();
}

// Lazy check: only run if header exists
setInterval(function() {
    if (document.querySelector('.default_header_container')) {
        fixHeader();
    }
}, 1000);

// ───────────────────────────────────────────────────────────────
// FUNCTION 2: Governorate Flags — أعلام المحافظات (React Select Override)
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    const GOVERNORATES = KUNUZEE_GOVERNORATES;

    const GROUPS = [
        { title: '', items: ['من فضلك قم باختيار محافظتك من القائمة'] },
        { title: '', items: ['القاهرة', 'الجيزة', 'الإسكندرية'] },
        { title: 'محافظات الوجه البحري ومطروح', items: ['القليوبية', 'المنوفية', 'الشرقية', 'الغربية', 'البحيرة', 'دمياط', 'الدقهلية', 'كفر الشيخ', 'مطروح'] },
        { title: 'محافظات القناة وسيناء', items: ['بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء', 'جنوب سيناء'] },
        { title: 'محافظات الوجه القبلي والبحر الأحمر', items: ['الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'البحر الأحمر', 'الوادي الجديد', 'أسوان'] }
    ];

    function getFlag(name) {
        return GOVERNORATES[name.trim()]?.img || '';
    }

    function getGroupInfo(name) {
        for (let i = 0; i < GROUPS.length; i++) {
            const idx = GROUPS[i].items.indexOf(name.trim());
            if (idx !== -1) {
                return { index: i, title: GROUPS[i].title, innerIndex: idx };
            }
        }
        return { index: 999, title: '', innerIndex: 999 };
    }

    function fixSingleValue() {
        const sv = document.querySelector('.select__single-value');
        if (!sv) return;

        const text = sv.textContent.trim();
        const flag = getFlag(text);
        if (!flag) {
            const existing = sv.querySelector('.gov-flag');
            if (existing) existing.remove();
            return;
        }

        const existing = sv.querySelector('.gov-flag');
        if (existing) {
            if (existing.src !== flag) existing.src = flag;
            return;
        }

        const img = document.createElement('img');
        img.src = flag;
        img.className = 'gov-flag';
        img.alt = text;
        sv.insertBefore(img, sv.firstChild);
    }

    function fixMenuOptions() {
        const menu = document.querySelector('.select__menu');
        if (!menu) return;
        if (menu.dataset.govFixed === 'true') return;

        menu.dataset.govFixed = 'true';
        menu.querySelectorAll('.gov-group-header').forEach(h => h.remove());

        const menuList = menu.querySelector('.select__menu-list') || menu;
        let allOptions = Array.from(menuList.querySelectorAll('.select__option'));

        allOptions.forEach(opt => {
            if (opt.querySelector('.gov-flag')) return;
            const text = opt.textContent.trim();
            const flag = getFlag(text);
            if (!flag) return;

            const img = document.createElement('img');
            img.src = flag;
            img.className = 'gov-flag';
            img.alt = text;
            opt.insertBefore(img, opt.firstChild);
        });

        const mapped = allOptions.map(opt => {
            const text = opt.textContent.trim();
            const info = getGroupInfo(text);
            return { opt, text, groupIndex: info.index, title: info.title, innerIndex: info.innerIndex };
        });

        mapped.sort((a, b) => {
            if (a.groupIndex !== b.groupIndex) return a.groupIndex - b.groupIndex;
            return a.innerIndex - b.innerIndex;
        });

        let currentGroup = -1;
        mapped.forEach(({ opt, groupIndex, title }) => {
            if (groupIndex !== currentGroup && title) {
                const header = document.createElement('div');
                header.className = 'gov-group-header';
                header.textContent = title;
                header.setAttribute('aria-hidden', 'true');
                menuList.appendChild(header);
            }
            currentGroup = groupIndex;
            menuList.appendChild(opt);
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

    const observer = new MutationObserver(function(mutations) {
        let needSingle = false;
        let needMenu = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType !== 1) return;
                    if (node.classList?.contains('select__menu')) {
                        node.dataset.govFixed = '';
                        needMenu = true;
                    }
                    if (node.querySelector?.('.select__menu')) needMenu = true;
                    if (node.classList?.contains('select__option')) needMenu = true;
                    if (node.classList?.contains('select__single-value')) needSingle = true;
                });
            }
            if (mutation.type === 'characterData') {
                const parent = mutation.target.parentElement;
                if (parent && parent.classList?.contains('select__single-value')) needSingle = true;
            }
        });

        if (needSingle) fixSingleValue();
        if (needMenu) {
            setTimeout(fixMenuOptions, 0);
            setTimeout(fixMenuOptions, 50);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        characterDataOldValue: true
    });

    function runAll() {
        fixSingleValue();
        fixMenuOptions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAll);
    } else {
        runAll();
    }

    // Lazy check: only run if select exists
    setInterval(function() {
        if (document.querySelector('.select__control, .select__menu, .select__single-value')) {
            runAll();
        }
    }, 1000);

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(runAll, 600);
        }
    }, 1000);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 3: fixDropdownPosition — تثبيت القائمة تحت منتصف زر القسم
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

    var observer = new MutationObserver(function(mutations) {
        var hasPanel = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.id && node.id.includes('headlessui-popover-panel')) {
                    hasPanel = true;
                }
            });
        });
        if (hasPanel) {
            setTimeout(fixDropdownPosition, 0);
            setTimeout(fixDropdownPosition, 50);
            setTimeout(fixDropdownPosition, 150);
            setTimeout(fixDropdownPosition, 300);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Lazy check: only run if any panel is visible
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

    // Lazy check: only run if ql-editor exists
    function runCloneIfNeeded() {
        if (document.querySelector('div.ql-editor, div[class*="ql-editor"]')) {
            cloneDescription();
        }
    }
    runCloneIfNeeded();

    var observer = new MutationObserver(function(mutations) {
        var hasEditor = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.classList?.contains('ql-editor') ||
                    node.querySelector?.('.ql-editor')
                )) {
                    hasEditor = true;
                }
            });
        });
        if (hasEditor) cloneDescription();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            var oldClone = document.querySelector('.ql-editor-clone');
            if (oldClone) oldClone.remove();
            setTimeout(runCloneIfNeeded, 300);
        }
    }, 1000);
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

    // Lazy check: only run if featured cards exist
    function runBadgeIfNeeded() {
        if (document.querySelector('.default_product_featured_card')) {
            fixDiscountBadge();
        }
    }
    runBadgeIfNeeded();
    setTimeout(runBadgeIfNeeded, 300);
    setTimeout(runBadgeIfNeeded, 600);

    var observer = new MutationObserver(function(mutations) {
        var hasBadge = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.classList?.contains('default_product_featured_card') ||
                    node.querySelector?.('.default_product_featured_card')
                )) {
                    hasBadge = true;
                }
            });
        });
        if (hasBadge) {
            setTimeout(fixDiscountBadge, 0);
            setTimeout(fixDiscountBadge, 300);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(runBadgeIfNeeded, 300);
            setTimeout(runBadgeIfNeeded, 600);
        }
    }, 1000);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 6: fixThankYouSvg — تغيير ألوان أنيميشن صفحة الشكر
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    function norm(c) {
        return c ? c.replace(/\s*,\s*/g, ',').trim().toLowerCase() : '';
    }

    const COLOR_MAP = {
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

    function fixThankYouSvg() {
        frameCount++;
        // Run only every 5th frame (12fps) — enough for color changes
        if (frameCount % 5 !== 0) return;

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

    function loop() {
        fixThankYouSvg();
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    var observer = new MutationObserver(function() {
        fixThankYouSvg();
    });
    observer.observe(document.body, { childList: true, subtree: true });
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

    fixBackHomeButton();

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    if (node.classList?.contains('thanks_container') ||
                        node.querySelector?.('.thanks_container') ||
                        node.matches?.('.thanks_container a[href="/"]') ||
                        node.querySelector?.('a[href="/"]')) {
                        setTimeout(fixBackHomeButton, 0);
                        setTimeout(fixBackHomeButton, 100);
                        setTimeout(fixBackHomeButton, 300);
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(fixBackHomeButton, 300);
            setTimeout(fixBackHomeButton, 600);
        }
    }, 500);

    window.addEventListener('load', fixBackHomeButton);
})();

// ───────────────────────────────────────────────────────────────────
// FUNCTION 7: swapRefundAndTimeline — تبديل صندوقي سياسة الاسترداد والـ Timeline
// ───────────────────────────────────────────────────────────────────
(function() {
    'use strict';

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

        var children = Array.from(container.children);
        var refundIndex = children.indexOf(refundBox);
        var timelineIndex = children.indexOf(timelineBox);

        if (timelineIndex < refundIndex) return;
        container.insertBefore(timelineBox, refundBox);
    }

    // Lazy check: only run if invoice exists
    function runSwapIfNeeded() {
        if (document.querySelector('.order_invoice_container')) {
            swapRefundAndTimeline();
        }
    }
    runSwapIfNeeded();

    var observer = new MutationObserver(function(mutations) {
        var hasInvoice = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.classList?.contains('order_invoice_container') ||
                    node.querySelector?.('.order_invoice_container')
                )) {
                    hasInvoice = true;
                }
            });
        });
        if (hasInvoice) setTimeout(swapRefundAndTimeline, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(runSwapIfNeeded, 300);
        }
    }, 1000);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 8: fixKunuzeeBox — تعديل بوكس "كنوزي" في صفحة الشكر
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    function fixKunuzeeBox() {
        var address = document.querySelector('.order_invoice_container address');
        if (!address) return;
        if (address.dataset.kunuzeeFixed === 'true') return;

        var phoneLink = address.querySelector('a[href^="tel:"], a[href="tel:undefined"]');
        if (phoneLink) {
            phoneLink.style.display = 'none';
        }

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

        var emailWrapper = address.querySelector('span:has(> a[href^="mailto:"])');
        if (emailWrapper) {
            var addressWrapper = document.createElement('span');
            addressWrapper.className = 'flex items-center gap-2 flex-wrap';
            addressWrapper.innerHTML = 
                '<span>العنوان: </span>' +
                '<a href="https://kunuzee.com" target="_blank" rel="noopener noreferrer">kunuzee.com</a>';

            emailWrapper.parentNode.insertBefore(addressWrapper, emailWrapper);
        }

        address.dataset.kunuzeeFixed = 'true';
    }

    // Lazy check: only run if invoice exists
    function runKunuzeeIfNeeded() {
        if (document.querySelector('.order_invoice_container')) {
            fixKunuzeeBox();
        }
    }
    runKunuzeeIfNeeded();

    var observer = new MutationObserver(function(mutations) {
        var hasAddress = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.tagName === 'ADDRESS' ||
                    node.querySelector?.('address')
                )) {
                    hasAddress = true;
                }
            });
        });
        if (hasAddress) setTimeout(fixKunuzeeBox, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            var address = document.querySelector('.order_invoice_container address');
            if (address) address.dataset.kunuzeeFixed = '';
            setTimeout(runKunuzeeIfNeeded, 300);
        }
    }, 1000);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 9: fixDeliveryInfoBox — تعديل بوكس "بيانات التوصيل"
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    function fixDeliveryInfoBox() {
        var allBoxes = document.querySelectorAll('.order_invoice_container .border.p-4.rounded-lg.shadow-sm');
        var deliveryBox = null;
        for (var i = 0; i < allBoxes.length; i++) {
            var h3 = allBoxes[i].querySelector('h3');
            if (h3 && h3.textContent.includes('بيانات التوصيل')) {
                deliveryBox = allBoxes[i];
                break;
            }
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
                            if (txt) {
                                textNode = dt.childNodes[j];
                                break;
                            }
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
                    if (val.toLowerCase() === 'kashier') {
                        valueSpan.textContent = ' Kashier';
                    }
                }
            }
        });

        dl.classList.add('delivery-info-reordered');
        deliveryBox.dataset.deliveryFixed = 'true';
    }

    // Lazy check: only run if invoice exists
    function runDeliveryIfNeeded() {
        if (document.querySelector('.order_invoice_container')) {
            fixDeliveryInfoBox();
        }
    }
    runDeliveryIfNeeded();

    var observer = new MutationObserver(function(mutations) {
        var hasDelivery = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.querySelector?.('h3')?.textContent?.includes('بيانات التوصيل') ||
                    node.textContent?.includes('بيانات التوصيل')
                )) {
                    hasDelivery = true;
                }
            });
        });
        if (hasDelivery) setTimeout(fixDeliveryInfoBox, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            var allBoxes = document.querySelectorAll('.order_invoice_container .border.p-4.rounded-lg.shadow-sm');
            allBoxes.forEach(function(box) {
                var h3 = box.querySelector('h3');
                if (h3 && h3.textContent.includes('بيانات التوصيل')) {
                    box.dataset.deliveryFixed = '';
                }
            });
            setTimeout(runDeliveryIfNeeded, 300);
        }
    }, 1000);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 10: fixTimelineTime — تحويل وقت التايم لاين لـ 24 ساعة
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

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
                if (!timeSpan.dataset.originalTime) {
                    timeSpan.dataset.originalTime = original;
                }
                timeSpan.textContent = converted;
            }
        });

        timeline.dataset.timeFixed = 'true';
    }

    // Lazy check: only run if invoice exists
    function runTimelineIfNeeded() {
        if (document.querySelector('.order_invoice_container')) {
            fixTimelineTime();
        }
    }
    runTimelineIfNeeded();

    var observer = new MutationObserver(function(mutations) {
        var hasTimeline = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.tagName === 'UL' && node.classList.contains('rounded-lg') ||
                    node.querySelector?.('ul.rounded-lg.border')
                )) {
                    hasTimeline = true;
                }
            });
        });
        if (hasTimeline) {
            var timeline = document.querySelector('.order_invoice_container ul.rounded-lg.border');
            if (timeline) timeline.dataset.timeFixed = '';
            setTimeout(fixTimelineTime, 100);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            var timeline = document.querySelector('.order_invoice_container ul.rounded-lg.border');
            if (timeline) timeline.dataset.timeFixed = '';
            setTimeout(runTimelineIfNeeded, 300);
        }
    }, 1000);
})();

// ─── إخفاء "الاجمالي" وإظهار السعر بـ EGP يدوياً ───
(function() {
    'use strict';

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

    fixProductTotal();

    // Lazy check: only run if invoice container exists
    setInterval(function() {
        if (document.querySelector('.order_invoice_container')) {
            fixProductTotal();
        }
    }, 1000);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 11: addProductLabelsToDownloads — إضافة اسم المنتج فوق رابط التحميل
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

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

    addProductLabels();

    // Lazy check: only run if invoice container exists
    setInterval(function() {
        if (document.querySelector('.order_invoice_container')) {
            addProductLabels();
        }
    }, 2000);

    var observer = new MutationObserver(function(mutations) {
        var hasChanges = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.querySelector && 
                    (node.querySelector('h4') || node.querySelector('div.bg-gray-50'))) {
                    hasChanges = true;
                }
            });
        });
        if (hasChanges) setTimeout(addProductLabels, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 12: fixCouponCode — تلوين كود الخصم في بوكس الإجمالي
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

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

    fixCouponCode();

    // Lazy check: only run if invoice container exists
    setInterval(function() {
        if (document.querySelector('.order_invoice_container')) {
            fixCouponCode();
        }
    }, 2000);

    var observer = new MutationObserver(function(mutations) {
        var hasInvoice = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.classList?.contains('order_invoice_container') ||
                    node.querySelector?.('.order_invoice_container')
                )) {
                    hasInvoice = true;
                }
            });
        });
        if (hasInvoice) setTimeout(fixCouponCode, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(fixCouponCode, 300);
        }
    }, 500);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 13: fixGovPlaceholder — لون ذهبي + Tajawal للـ option الوهمي
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    var PLACEHOLDER_TEXT = 'من فضلك قم باختيار محافظتك من القائمة';

    function fixGovPlaceholder() {
        var singleValues = document.querySelectorAll('.select__single-value');
        singleValues.forEach(function(sv) {
            if (sv.textContent.trim() === PLACEHOLDER_TEXT) {
                sv.style.setProperty('color', 'var(--k-gold)', 'important');
                sv.style.setProperty('font-family', '"Tajawal", sans-serif', 'important');
            }
        });

        var options = document.querySelectorAll('.select__option');
        options.forEach(function(opt) {
            if (opt.textContent.trim() === PLACEHOLDER_TEXT) {
                opt.style.setProperty('color', 'var(--k-gold)', 'important');
                opt.style.setProperty('font-family', '"Tajawal", sans-serif', 'important');
            }
        });
    }

    // Lazy check: only run if select exists
    function runPlaceholderIfNeeded() {
        if (document.querySelector('.select__single-value, .select__option')) {
            fixGovPlaceholder();
        }
    }
    runPlaceholderIfNeeded();

    var observer = new MutationObserver(function(mutations) {
        var needsFix = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.classList?.contains('select__single-value') ||
                    node.classList?.contains('select__option') ||
                    node.querySelector?.('.select__single-value, .select__option')
                )) {
                    needsFix = true;
                }
            });
        });
        if (needsFix) setTimeout(fixGovPlaceholder, 0);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(runPlaceholderIfNeeded, 1000);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 14: preventBodyShift — منع React Select من زحزحة الصفحة
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    var originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
    var originalSetAttribute = Element.prototype.setAttribute;

    CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
        if (this.cssText && this.cssText.indexOf('body') !== -1 && property === 'padding-right') {
            return;
        }
        if (property === 'padding-right' && value && value.indexOf && value.indexOf('px') !== -1) {
            var el = this.parentElement || this.element;
            if (el && el.tagName === 'BODY') {
                return;
            }
        }
        return originalSetProperty.apply(this, arguments);
    };

    Element.prototype.setAttribute = function(name, value) {
        if (this.tagName === 'BODY' && name === 'style') {
            if (value && value.indexOf('padding-right') !== -1) {
                value = value.replace(/padding-right:\s*[^;]+;?/g, '');
            }
        }
        return originalSetAttribute.apply(this, arguments);
    };

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                var body = document.body;
                if (body && body.style.paddingRight) {
                    body.style.paddingRight = '';
                    body.style.removeProperty('padding-right');
                }
            }
        });
    });

    if (document.body) {
        observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
        });
    }
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 15: fixGovColor — لون المحافظة المختارة
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    var DEFAULT_TEXT = 'من فضلك قم باختيار محافظتك من القائمة';
    var lastText = '';

    function fixGovColor() {
        var sv = document.querySelector('.select__single-value');
        if (!sv) return;

        var text = sv.textContent.trim();
        if (text === lastText) return;
        lastText = text;

        var hasFlag = sv.querySelector('.gov-flag');
        var color = (hasFlag || text !== DEFAULT_TEXT) ? 'var(--k-orange)' : 'var(--k-gold)';

        sv.style.setProperty('color', color, 'important');
    }

    fixGovColor();

    document.addEventListener('click', function(e) {
        if (e.target.closest('.select__option, .select__control')) {
            setTimeout(fixGovColor, 50);
            setTimeout(fixGovColor, 150);
        }
    });
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

    // Lazy check: only run if cards exist
    function runCardsIfNeeded() {
        if (document.querySelector('.default_category_card')) {
            fixDefaultCategoryCards();
        }
    }
    runCardsIfNeeded();

    var observer = new MutationObserver(function(mutations) {
        var hasCards = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.classList?.contains('default_category_card') ||
                    node.querySelector?.('.default_category_card')
                )) {
                    hasCards = true;
                }
            });
        });
        if (hasCards) {
            setTimeout(fixDefaultCategoryCards, 0);
            setTimeout(fixDefaultCategoryCards, 300);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(runCardsIfNeeded, 300);
            setTimeout(runCardsIfNeeded, 600);
        }
    }, 1000);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 17: scrollToTopOnNavigation — سكرول لفوق عند التنقل
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    var lastUrl = location.href;
    var isFromHomeProduct = false;

    document.addEventListener('click', function(e) {
        var card = e.target.closest('.default_product_featured_card, .default_product_list_card, .home_products_grid_card');
        if (card) {
            isFromHomeProduct = true;
        }
    });

    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;

            if (isFromHomeProduct && location.pathname.includes('/products/')) {
                isFromHomeProduct = false;
                setTimeout(function() {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                }, 50);
                setTimeout(function() {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                }, 150);
                setTimeout(function() {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                }, 300);
            } else {
                isFromHomeProduct = false;
            }
        }
    }, 100);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 18: Checkout Placeholders Marquee — تأثير النص المتحرك على placeholders
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
            '    font-size: 0.875rem !important;',
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
        // Only run on checkout page
        if (!document.querySelector('.checkout_form, .checkout_container, .contact-info-heading, [class*="checkout"]')) {
            return;
        }

        injectStyles();

        // Target the exact structure: input inside div.relative.mt-1 inside label's parent
        var inputs = document.querySelectorAll('.checkout_form input.global_input, .checkout_container input.global_input, .contact-info-heading input.global_input, section.contact-info-heading input.global_input');

        inputs.forEach(function(input) {
            if (input.dataset.kph === '1') return;
            input.dataset.kph = '1';

            var originalPlaceholder = input.getAttribute('placeholder') || '';
            if (!originalPlaceholder || originalPlaceholder.length < 10) return;

            // Find the parent div.relative (the container that holds the input)
            var relativeParent = input.closest('div.relative, div[class*="relative"]');
            if (!relativeParent) {
                relativeParent = input.parentElement;
            }

            // Store original placeholder and clear it
            input.dataset.originalPlaceholder = originalPlaceholder;
            input.setAttribute('placeholder', '');

            // Create wrapper (same structure as FAQ kfq-wrap)
            var wrap = document.createElement('span');
            wrap.className = 'kph-wrap';

            // Create text span (same as FAQ kfq-text)
            var span = document.createElement('span');
            span.className = 'kph-text';
            span.textContent = originalPlaceholder;

            wrap.appendChild(span);
            relativeParent.appendChild(wrap);

            // Measure after layout settles
            setTimeout(function() {
                var wrapWidth = relativeParent.offsetWidth;
                if (wrapWidth < 80) wrapWidth = 80;

                // Set wrap width to match parent
                wrap.style.width = wrapWidth + 'px';

                // Blur fade mask — same gradient direction as FAQ (RTL)
                var mask = 'linear-gradient(to left, transparent 0%, black 3%, black 93%, transparent 100%)';
                wrap.style.webkitMaskImage = mask;
                wrap.style.maskImage = mask;

                var textWidth = span.scrollWidth;
                var overflow = textWidth - wrapWidth;

                if (overflow > 0) {
                    items.push({
                        span: span,
                        overflow: overflow,
                        pos: 0,
                        dir: 1,
                        wait: 0,
                        pause: 120,
                        wrap: wrap,
                        input: input
                    });
                }
            }, 300);

            // Show/hide based on input value
            function updateVisibility() {
                if (input.value && input.value.trim().length > 0) {
                    wrap.classList.add('kph-hidden');
                } else {
                    wrap.classList.remove('kph-hidden');
                }
            }

            input.addEventListener('input', updateVisibility);
            input.addEventListener('focus', updateVisibility);
            input.addEventListener('blur', updateVisibility);
            updateVisibility();
        });
    }

    function animate() {
        items.forEach(function(item) {
            if (item.wait > 0) {
                item.wait--;
                return;
            }

            var speed = 0.35;

            if (item.dir === 1) {
                item.pos += speed;
                if (item.pos >= item.overflow) {
                    item.pos = item.overflow;
                    item.dir = -1;
                    item.wait = item.pause;
                }
            } else {
                item.pos -= speed;
                if (item.pos <= 0) {
                    item.pos = 0;
                    item.dir = 1;
                    item.wait = item.pause;
                }
            }

            item.span.style.transform = 'translateX(' + item.pos + 'px)';
        });

        requestAnimationFrame(animate);
    }

    init();
    setInterval(init, 1000);

    var obs = new MutationObserver(function() {
        init();
    });
    obs.observe(document.body, { childList: true, subtree: true });

    animate();
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 19: Governorate List Tajawal — تطبيق خط Tajawal على قائمة المحافظات
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    function applyTajawalToGovList() {
        var menuList = document.querySelector('.select__menu-list, [class*="select__menu-list"]');
        if (!menuList) return;

        // Apply to all options in the menu
        var options = menuList.querySelectorAll('.select__option, [class*="select__option"]');
        options.forEach(function(opt) {
            opt.style.setProperty('font-family', '"Tajawal", sans-serif', 'important');
        });

        // Apply to group headers
        var headers = menuList.querySelectorAll('.gov-group-header');
        headers.forEach(function(header) {
            header.style.setProperty('font-family', '"Tajawal", sans-serif', 'important');
        });
    }

    // Run when menu opens
    var observer = new MutationObserver(function(mutations) {
        var menuOpened = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.classList?.contains('select__menu') ||
                    node.querySelector?.('.select__menu-list') ||
                    node.classList?.contains('select__menu-list')
                )) {
                    menuOpened = true;
                }
            });
        });
        if (menuOpened) {
            setTimeout(applyTajawalToGovList, 0);
            setTimeout(applyTajawalToGovList, 50);
            setTimeout(applyTajawalToGovList, 150);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also apply via CSS injection for persistent effect
    var style = document.createElement('style');
    style.textContent = [
        '.select__menu-list .select__option,',
        '.select__menu-list [class*="select__option"],',
        '.select__menu .gov-group-header {',
        '    font-family: "Tajawal", sans-serif !important;',
        '}',
        '.select__menu-list .select__option--is-selected,',
        '.select__menu-list [class*="select__option--is-selected"] {',
        '    font-family: "Tajawal", sans-serif !important;',
        '}',
        '.select__menu-list .select__option--is-focused,',
        '.select__menu-list [class*="select__option--is-focused"] {',
        '    font-family: "Tajawal", sans-serif !important;',
        '}'
    ].join(' ');
    document.head.appendChild(style);
})();

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //
// ───────────────────────────────────────────────────────────────
// FUNCTION 20: FAQ — Fixed Box + Smooth Marquee + Blur Fade (RTL)
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

            if (svg) {
                svg.style.flexShrink = '0';
            }

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
                    items.push({
                        span: span,
                        overflow: overflow,
                        pos: 0,
                        dir: 1,
                        wait: 0,
                        pause: 120
                    });
                }
            }, 500);
        });
    }

    function animate() {
        items.forEach(function(item) {
            if (item.wait > 0) {
                item.wait--;
                return;
            }

            var speed = 0.35;

            if (item.dir === 1) {
                item.pos += speed;
                if (item.pos >= item.overflow) {
                    item.pos = item.overflow;
                    item.dir = -1;
                    item.wait = item.pause;
                }
            } else {
                item.pos -= speed;
                if (item.pos <= 0) {
                    item.pos = 0;
                    item.dir = 1;
                    item.wait = item.pause;
                }
            }

            item.span.style.transform = 'translateX(' + item.pos + 'px)';
        });

        requestAnimationFrame(animate);
    }

    init();
    setInterval(init, 1000);

    var obs = new MutationObserver(function() {
        init();
    });
    obs.observe(document.body, { childList: true, subtree: true });

    animate();
})();
