// ═══════════════════════════════════════════════════════════════
// KUNUZEE STORE — CUSTOM JAVASCRIPT
// Platform: Easy Orders
// ═══════════════════════════════════════════════════════════════

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
setInterval(fixHeader, 300);

// ───────────────────────────────────────────────────────────────
// FUNCTION 2: Governorate Flags — أعلام المحافظات (React Select Override)
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    const GOVERNORATES = {
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

    const GROUPS = [
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
    setInterval(runAll, 300);

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            runAll();
            setTimeout(runAll, 600);
        }
    }, 300);
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
    setInterval(fixDropdownPosition, 50);

    document.addEventListener('click', function(e) {
        var btn = e.target.closest('button[id*="headlessui-popover-button"]');
        if (btn) {
            setTimeout(fixDropdownPosition, 0);
            setTimeout(fixDropdownPosition, 50);
            setTimeout(fixDropdownPosition, 150);
            setTimeout(fixDropdownPosition, 300);
        }
    });

    window.addEventListener('scroll', fixDropdownPosition, true);
    window.addEventListener('resize', fixDropdownPosition);
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
        clone.style.cssText = 'color: #bf6000 !important; margin-top: 12px !important; display: block !important; width: 100% !important;';
        header.parentNode.insertBefore(clone, header.nextSibling);
    }

    cloneDescription();

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
            cloneDescription();
        }
    }, 100);
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

    fixDiscountBadge();
    setTimeout(fixDiscountBadge, 300);
    setTimeout(fixDiscountBadge, 600);

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
            fixDiscountBadge();
            setTimeout(fixDiscountBadge, 300);
            setTimeout(fixDiscountBadge, 600);
        }
    }, 300);
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
        'rgb(110,35,250)': '#bf6000', 'rgb(96,12,252)': '#bf6000',
        'rgb(134,69,255)': '#bf6000', 'rgb(105,25,255)': '#bf6000',
        'rgb(83,88,253)': '#bf6000', 'rgb(89,0,255)': '#bf6000',
        'rgb(115,42,249)': '#bf6000', 'rgb(92,17,232)': '#bf6000',
        'rgb(107,32,248)': '#bf6000', 'rgb(106,28,251)': '#bf6000',
        'rgb(93,8,251)': '#bf6000', 'rgb(90,2,252)': '#bf6000',
        'rgb(106,26,253)': '#bf6000',
        'rgb(178,137,255)': '#ce982e', 'rgb(139,96,220)': '#ce982e',
        'rgb(184,151,246)': '#ce982e', 'rgb(175,133,253)': '#ce982e',
        'rgb(0,182,255)': '#ce982e', 'rgb(2,181,252)': '#ce982e',
        'rgb(0,181,254)': '#ce982e',
        'rgb(0,193,162)': '#134f4f', 'rgb(44,195,170)': '#134f4f',
        'rgb(66,234,206)': '#134f4f', 'rgb(16,253,214)': '#134f4f',
        'rgb(26,253,215)': '#134f4f', 'rgb(0,221,179)': '#134f4f',
        'rgb(35,178,154)': '#134f4f', 'rgb(15,245,206)': '#134f4f',
        'rgb(4,244,204)': '#134f4f', 'rgb(2,252,210)': '#134f4f',
        'rgb(15,250,210)': '#134f4f', 'rgb(57,248,216)': '#134f4f',
        'rgb(20,255,215)': '#134f4f', 'rgb(89,92,185)': '#134f4f',
        'rgb(9,97,82)': '#134f4f', 'rgb(53,114,104)': '#134f4f',
        'rgb(216,216,216)': '#f2e4be'
    };

    function fixThankYouSvg() {
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

        // إظهار الأنيميشن بعد ما الألوان تتغير
        if (changed) {
            var container = document.querySelector('.thanks_container');
            if (container && !container.classList.contains('kunuzee-svg-ready')) {
                container.classList.add('kunuzee-svg-ready');
            }
        }
    }

    fixThankYouSvg();
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

        // Check if already in correct order (timeline before refund)
        var children = Array.from(container.children);
        var refundIndex = children.indexOf(refundBox);
        var timelineIndex = children.indexOf(timelineBox);

        if (timelineIndex < refundIndex) return; // Already correct

        container.insertBefore(timelineBox, refundBox);
    }

    swapRefundAndTimeline();

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
            setTimeout(swapRefundAndTimeline, 300);
        }
    }, 300);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 8: fixKunuzeeBox — تعديل بوكس "كنوزي" في صفحة الشكر
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    function fixKunuzeeBox() {
        var address = document.querySelector('.order_invoice_container address');
        if (!address) return;

        // ✅ لو اتعدل قبل كده، ماتعدلش تاني
        if (address.dataset.kunuzeeFixed === 'true') return;

        // 1. إخفاء الهاتف بالكامل
        var phoneLink = address.querySelector('a[href^="tel:"], a[href="tel:undefined"]');
        if (phoneLink) {
            phoneLink.style.display = 'none';
        }

        // 2. إخفاء العنوان الفارغ
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

        // 3. تعديل البريد الإلكتروني — نفصل الـ label عن الـ link
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

        // 4. إضافة "العنوان: kunuzee.com" قبل البريد الإلكتروني
        var emailWrapper = address.querySelector('span:has(> a[href^="mailto:"])');
        if (emailWrapper) {
            var addressWrapper = document.createElement('span');
            addressWrapper.className = 'flex items-center gap-2 flex-wrap';
            addressWrapper.innerHTML = 
                '<span>العنوان: </span>' +
                '<a href="https://kunuzee.com" target="_blank" rel="noopener noreferrer">kunuzee.com</a>';
            
            emailWrapper.parentNode.insertBefore(addressWrapper, emailWrapper);
        }

        // ✅ علّم إن الـ address اتعدل
        address.dataset.kunuzeeFixed = 'true';
    }

    fixKunuzeeBox();

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
            // ✅ لما الـ URL يتغير، شيل العلامة عشان يتعدل من جديد
            var address = document.querySelector('.order_invoice_container address');
            if (address) address.dataset.kunuzeeFixed = '';
            setTimeout(fixKunuzeeBox, 300);
        }
    }, 300);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 9: fixDeliveryInfoBox — تعديل بوكس "بيانات التوصيل" (آمن)
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
            }
            if (label.includes('الدفع')) {
                dt.classList.add('order-item-payment');
                labelSpan.textContent = 'وسيلة الدفع:';
                // capitalize Kashier
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

    fixDeliveryInfoBox();

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
            setTimeout(fixDeliveryInfoBox, 300);
        }
    }, 300);
})();

// ───────────────────────────────────────────────────────────────
// FUNCTION 10: fixTimelineTime — تحويل وقت التايم لاين لـ 24 ساعة
// ───────────────────────────────────────────────────────────────
(function() {
    'use strict';

    function convertTo24Hour(timeStr) {
        // النمط: "6/23/2026, 5:51:53 AM" أو "12/31/2025, 11:59:59 PM"
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

        // صيغة بريطانية: DD/MM/YYYY, HH:MM:SS
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
                // نحتفظ بالنص الأصلي في attribute عشان لو حبينا نرجعه
                if (!timeSpan.dataset.originalTime) {
                    timeSpan.dataset.originalTime = original;
                }
                timeSpan.textContent = converted;
            }
        });

        timeline.dataset.timeFixed = 'true';
    }

    fixTimelineTime();

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
            // نشيل العلامة عشان يتعادل على التايم لاين الجديد
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
            setTimeout(fixTimelineTime, 300);
        }
    }, 300);
})();
