/* ═══════════════════════════════════════════════════════════════
   KUNOZY STORE - Custom JavaScript
   منصة إيزي أوردرز - تخصيص متجر كنوزي
   ═══════════════════════════════════════════════════════════════ */

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
