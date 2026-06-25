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

// ═══════════════════════════════════════════════════════════════
// FUNCTION 6: fixThankYouPage — تخصيص صفحة الشكر
// ═══════════════════════════════════════════════════════════════
(function() {
    'use strict';

    // ─── نفس Object المحافظات من checkout ───
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

    function getFlag(name) {
        return GOVERNORATES[name.trim()]?.img || '';
    }

    // ─── تحويل التاريخ الأمريكي لبريطاني ───
    function convertToBritishDate(usDateStr) {
        // Pattern: "M/D/YYYY, H:MM:SS AM/PM" or "MM/DD/YYYY, HH:MM:SS AM/PM"
        const match = usDateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}),\s+(\d{1,2}):(\d{2}):(\d{2})\s+(AM|PM)/i);
        if (!match) return usDateStr; // Return original if not matching

        let [, month, day, year, hour, minute, second, ampm] = match;
        let h = parseInt(hour, 10);

        // Convert to 24-hour
        if (ampm.toUpperCase() === 'PM' && h !== 12) h += 12;
        if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;

        // Pad with zeros
        const dd = day.padStart(2, '0');
        const mm = month.padStart(2, '0');
        const yyyy = year;
        const hh = h.toString().padStart(2, '0');
        const min = minute.padStart(2, '0');
        const ss = second.padStart(2, '0');

        return `${dd}/${mm}/${yyyy}, ${hh}:${min}:${ss}`;
    }

    // ─── الدالة الرئيسية ───
    function fixThankYouPage() {
        // ── 1: تغيير نص "شكرا لاتمامك الطلب" ──
        const h1Thanks = document.querySelector('.thanks_container h1.text-4xl.font-bold');
        if (h1Thanks && !h1Thanks.dataset.fixedThanks) {
            h1Thanks.dataset.fixedThanks = 'true';
            h1Thanks.textContent = 'شكراً لشرائكم من كنوزي';
        }

        // ── 2: إضافة السطر الإضافي تحت العنوان ──
        const thanksContent = document.querySelector('.thanks_content');
        if (thanksContent && !thanksContent.dataset.fixedSubtitle) {
            const existingSubtitle = thanksContent.querySelector('.thanks-subtitle');
            if (!existingSubtitle) {
                const subtitle = document.createElement('p');
                subtitle.className = 'thanks-subtitle';
                subtitle.textContent = 'سيصلكم إيميل لتحميل كنوزكم';
                subtitle.style.cssText = 'color: #bf6000; font-family: "Tajawal", sans-serif; font-size: 1.1rem; font-weight: 400; text-align: center; margin-top: 8px; margin-bottom: 16px;';
                if (h1Thanks && h1Thanks.nextElementSibling) {
                    h1Thanks.parentNode.insertBefore(subtitle, h1Thanks.nextElementSibling);
                } else if (h1Thanks) {
                    h1Thanks.parentNode.appendChild(subtitle);
                }
                thanksContent.dataset.fixedSubtitle = 'true';
            }
        }

        // ── 3: إخفاء "عرض أحدث العروض" ──
        const offerLink = document.querySelector('.thanks_container p.text-skin-primary.underline, .thanks_container p[class*="text-skin-primary"]');
        if (offerLink && offerLink.textContent.includes('عرض')) {
            offerLink.style.display = 'none';
        }

        // ── 4: إخفاء زر نسخ رابط التتبع ──
        const trackButton = document.querySelector('button[title*="track"], button[title*="تتبع"]');
        if (trackButton && !trackButton.dataset.hiddenTrack) {
            trackButton.dataset.hiddenTrack = 'true';
            trackButton.style.display = 'none';
        }

        // ── 5: تخصيص عنوان كنوزي ──
        const addressBlock = document.querySelector('.order_invoice_container address');
        if (addressBlock && !addressBlock.dataset.fixedAddress) {
            addressBlock.dataset.fixedAddress = 'true';
            
            // إخفاء الهاتف والعنوان
            const spans = addressBlock.querySelectorAll('span');
            spans.forEach(span => {
                const text = span.textContent.trim();
                if (text.includes('الهاتف:') || text.includes('العنوان:')) {
                    span.style.display = 'none';
                }
                // تعديل "البريد الالكتروني" لـ "البريد الإلكتروني"
                if (text.includes('البريد الالكتروني')) {
                    const emailSpan = span.querySelector('span.text-gray-600');
                    if (emailSpan) emailSpan.textContent = 'البريد الإلكتروني: ';
                }
            });

            // إخفاء رابط الهاتف غير المعرف
            const telLink = addressBlock.querySelector('a[href="tel:undefined"]');
            if (telLink) telLink.style.display = 'none';
        }

        // ── 6: تخصيص بيانات التوصيل ──
        const deliveryBlock = document.querySelector('.order_invoice_container .border.p-4.rounded-lg.shadow-sm:has(h3)');
        if (deliveryBlock && !deliveryBlock.dataset.fixedDelivery) {
            const dtElements = deliveryBlock.querySelectorAll('dt');
            const deliveryData = {};
            
            dtElements.forEach(dt => {
                const spans = dt.querySelectorAll('span');
                let label = '', value = '';
                spans.forEach(span => {
                    if (span.classList.contains('text-gray-500') || span.textContent.includes(':')) {
                        label = span.textContent.trim();
                    } else {
                        value = span.textContent.trim();
                    }
                });
                
                // Extract value from text content if spans didn't work
                const fullText = dt.textContent.trim();
                if (fullText.includes('الاسم:')) deliveryData.name = fullText.replace('الاسم:', '').trim();
                if (fullText.includes('الهاتف:')) deliveryData.phone = fullText.replace('الهاتف:', '').trim();
                if (fullText.includes('البريد')) deliveryData.email = fullText.replace(/البريد.*?:/, '').trim();
                if (fullText.includes('المدينة:')) deliveryData.city = fullText.replace('المدينة:', '').trim();
                if (fullText.includes('بيانات الدفع:')) deliveryData.payment = fullText.replace('بيانات الدفع:', '').trim();
            });

            // Also try alternative selectors
            dtElements.forEach(dt => {
                const text = dt.textContent;
                if (text.includes('الاسم:') && !deliveryData.name) deliveryData.name = text.split('الاسم:')[1]?.trim();
                if (text.includes('الهاتف:') && !deliveryData.phone) deliveryData.phone = text.split('الهاتف:')[1]?.trim();
                if (text.includes('البريد') && !deliveryData.email) deliveryData.email = text.split(':')[1]?.trim();
                if (text.includes('المدينة:') && !deliveryData.city) deliveryData.city = text.split('المدينة:')[1]?.trim();
                if (text.includes('بيانات الدفع:') && !deliveryData.payment) deliveryData.payment = text.split('بيانات الدفع:')[1]?.trim();
            });

            if (Object.keys(deliveryData).length > 0) {
                deliveryBlock.dataset.fixedDelivery = 'true';
                
                // Clear and rebuild
                const container = deliveryBlock.querySelector('.flex.flex-col.gap-2');
                if (container) {
                    container.innerHTML = '';

                    const fields = [
                        { label: 'المحافظة', value: deliveryData.city, isGov: true },
                        { label: 'الإسم', value: deliveryData.name },
                        { label: 'البريد الإلكتروني', value: deliveryData.email },
                        { label: 'رقم المحمول', value: deliveryData.phone },
                        { label: 'وسيلة الدفع', value: deliveryData.payment === 'kashier' ? 'Kashier' : deliveryData.payment }
                    ];

                    fields.forEach(field => {
                        if (!field.value) return;
                        
                        const dt = document.createElement('dt');
                        dt.className = 'flex flex-wrap justify-between';
                        dt.style.cssText = 'font-family: "Tajawal", sans-serif; color: #134f4f; font-weight: 500; padding: 4px 0;';

                        if (field.isGov) {
                            const flagUrl = getFlag(field.value);
                            dt.innerHTML = `
                                <span style="color: #134f4f; font-weight: 500;">${field.label}:</span>
                                <span style="display: flex; align-items: center; gap: 8px; color: #bf6000; font-weight: 600;">
                                    ${flagUrl ? `<img src="${flagUrl}" alt="${field.value}" style="height: 18px; width: auto; border-radius: 15%; display: inline-block; flex-shrink: 0;">` : ''}
                                    ${field.value}
                                </span>
                            `;
                        } else {
                            dt.innerHTML = `
                                <span style="color: #134f4f; font-weight: 500;">${field.label}:</span>
                                <span style="color: #bf6000; font-weight: 600; ${field.label === 'البريد الإلكتروني' ? 'direction: ltr; text-align: left;' : ''}">${field.value}</span>
                            `;
                        }

                        container.appendChild(dt);
                    });
                }
            }
        }

        // ── 7: سياسة الاسترداد — already handled by CSS, but ensure disclosure works ──
        const disclosureBtn = document.querySelector('[id*="headlessui-disclosure-button"]');
        if (disclosureBtn && !disclosureBtn.dataset.fixedDisclosure) {
            disclosureBtn.dataset.fixedDisclosure = 'true';
            // CSS handles styling, JS ensures text is correct
            const span = disclosureBtn.querySelector('span.flex');
            if (span) {
                span.style.cssText = 'display: flex; align-items: center; gap: 8px; font-family: "Tajawal", sans-serif;';
            }
        }

        // ── 8: تحويل تاريخ إنشاء الطلب ──
        const timelineItems = document.querySelectorAll('.order_invoice_container ul.list-disc li');
        timelineItems.forEach(item => {
            if (item.dataset.fixedDate) return;
            
            const spans = item.querySelectorAll('span');
            spans.forEach(span => {
                const text = span.textContent.trim();
                if (text.includes('تم انشاء') || text.includes('تم إنشاء')) {
                    span.textContent = 'تم إنشاء الطلب';
                    span.style.cssText = 'color: #134f4f; font-family: "Tajawal", sans-serif; font-weight: 600; font-size: 0.95rem;';
                }
                
                // Convert date
                if (text.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
                    const britishDate = convertToBritishDate(text);
                    if (britishDate !== text) {
                        span.textContent = britishDate;
                        span.style.cssText = 'color: #ce982e; font-family: "Tajawal", sans-serif; font-size: 0.85rem;';
                        item.dataset.fixedDate = 'true';
                    }
                }
            });
        });

        // ── 9: تخصيص كروت المنتجات ──
        const productCards = document.querySelectorAll('.order_invoice_container .flex.flex-col.gap-6 > .flex.flex-col.gap-4');
        productCards.forEach(card => {
            if (card.dataset.fixedProduct) return;
            card.dataset.fixedProduct = 'true';

            // إخفاء عدد القطع وسعر القطعة
            const details = card.querySelector('.flex.flex-col');
            if (details) {
                const paragraphs = details.querySelectorAll('p');
                paragraphs.forEach(p => {
                    const text = p.textContent.trim();
                    if (text.includes('عدد القطع:') || text.includes('سعر القطعة:')) {
                        p.style.display = 'none';
                    }
                });
            }

            // تخصيص "الإجمالي" — إخفاء النص وإبقاء السعر فقط
            const totalPrice = card.querySelector('p.text-lg.flex.items-baseline.gap-1');
            if (totalPrice) {
                // Get the numeric value
                const textNodes = Array.from(totalPrice.childNodes).filter(n => n.nodeType === 3);
                const currencySpan = totalPrice.querySelector('.font-\\[inherit\\]');
                
                let numericValue = '';
                textNodes.forEach(node => {
                    const text = node.textContent.trim();
                    if (text && !text.includes('الاجمالي')) {
                        numericValue = text;
                    }
                });

                // If no text node found, try to extract from full text
                if (!numericValue) {
                    const fullText = totalPrice.textContent.replace('الاجمالي', '').replace('الإجمالي', '').trim();
                    numericValue = fullText.replace(/[^\d]/g, '');
                }

                // Rebuild: show price only with EGP styling
                if (numericValue) {
                    totalPrice.innerHTML = '';
                    totalPrice.style.cssText = 'color: #bf6000; font-family: "Tajawal", sans-serif; font-weight: 700; font-size: 1.5rem; display: flex; align-items: baseline; gap: 4px;';
                    
                    const priceNum = document.createElement('span');
                    priceNum.textContent = numericValue;
                    priceNum.style.cssText = 'color: #bf6000; font-weight: 700;';
                    
                    const egpSpan = document.createElement('span');
                    egpSpan.className = 'font-[inherit]';
                    egpSpan.style.cssText = 'font-size: 0; position: relative;';
                    egpSpan.innerHTML = 'EGP';
                    // The CSS ::after will handle the actual display
                    
                    totalPrice.appendChild(priceNum);
                    totalPrice.appendChild(egpSpan);
                }
            }
        });

        // ── 10: تخصيص ملخص الفاتورة ──
        const summaryBlock = document.querySelector('.order_invoice_container .col-span-2.p-5.border.rounded-lg.shadow-sm, .order_invoice_container .col-span-2.col-start-2.p-5');
        if (summaryBlock && !summaryBlock.dataset.fixedSummary) {
            summaryBlock.dataset.fixedSummary = 'true';
            
            const summaryItems = summaryBlock.querySelectorAll('dt');
            summaryItems.forEach(dt => {
                const labelSpan = dt.querySelector('span:first-child');
                const valueContainer = dt.querySelector('.flex.items-center, .flex.items-center.gap-1');
                
                if (labelSpan) {
                    const text = labelSpan.textContent.trim();
                    if (text === 'اجمالي المنتجات:') {
                        labelSpan.textContent = 'إجمالي المنتجات:';
                        labelSpan.style.cssText = 'color: #134f4f; font-family: "Tajawal", sans-serif; font-weight: 600;';
                    }
                    if (text === 'الاجمالي:') {
                        labelSpan.textContent = 'الإجمالي:';
                        labelSpan.style.cssText = 'color: #134f4f; font-family: "Tajawal", sans-serif; font-weight: 700; font-size: 1.1rem;';
                    }
                    if (text.includes('كود الخصم')) {
                        labelSpan.style.cssText = 'color: #ce982e; font-family: "Tajawal", sans-serif;';
                    }
                }

                // Style values
                if (valueContainer) {
                    valueContainer.style.cssText = 'color: #bf6000; font-family: "Tajawal", sans-serif; font-weight: 700; font-size: 1.2rem; display: flex; align-items: center; gap: 4px;';
                    
                    // Ensure EGP styling
                    const egpSpan = valueContainer.querySelector('.font-\\[inherit\\]');
                    if (egpSpan) {
                        egpSpan.style.cssText = 'font-size: 0; position: relative;';
                    }
                }
            });

            // Final total row special styling
            const finalTotal = summaryBlock.querySelector('dt.flex.flex-wrap.justify-between.py-2.mt-2.border-t');
            if (finalTotal) {
                finalTotal.style.borderColor = '#ce982e';
                const value = finalTotal.querySelector('.flex.items-center');
                if (value) {
                    value.style.cssText = 'color: #bf6000; font-family: "Tajawal", sans-serif; font-weight: 700; font-size: 1.5rem; display: flex; align-items: center; gap: 4px;';
                }
            }
        }

        // ── 11: تخصيص حالة الطلب ──
        const statusRow = document.querySelector('.order_invoice_container dt:has-text("حالة الطلب")');
        if (statusRow && !statusRow.dataset.fixedStatus) {
            statusRow.dataset.fixedStatus = 'true';
            const spans = statusRow.querySelectorAll('span');
            if (spans[0]) spans[0].style.cssText = 'color: #134f4f; font-family: "Tajawal", sans-serif; font-weight: 600;';
            if (spans[1]) spans[1].style.cssText = 'color: #bf6000; font-family: "Tajawal", sans-serif; font-weight: 700;';
        }
    }

    // ─── Run on load ───
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixThankYouPage);
    } else {
        fixThankYouPage();
    }

    // ─── MutationObserver for dynamic content ───
    const observer = new MutationObserver(function(mutations) {
        let hasChanges = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.classList?.contains('thanks_container') ||
                    node.classList?.contains('order_invoice_container') ||
                    node.querySelector?.('.thanks_container') ||
                    node.querySelector?.('.order_invoice_container')
                )) {
                    hasChanges = true;
                }
            });
        });
        if (hasChanges) {
            setTimeout(fixThankYouPage, 0);
            setTimeout(fixThankYouPage, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ─── Run periodically for safety ───
    setInterval(fixThankYouPage, 500);

    // ─── URL change detection (SPA navigation) ───
    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (location.href.includes('/thanks') || location.href.includes('/thank') || document.querySelector('.thanks_container')) {
                setTimeout(fixThankYouPage, 0);
                setTimeout(fixThankYouPage, 300);
                setTimeout(fixThankYouPage, 600);
            }
        }
    }, 300);

})();

// ═══════════════════════════════════════════════════════════════
// FUNCTION 7: hideProductHoverButtons — إخفاء أزرار الهوفر
// ═══════════════════════════════════════════════════════════════
(function() {
    'use strict';

    function hideHoverButtons() {
        // Find all hover button containers
        const containers = document.querySelectorAll(
            '.group .absolute[class*="bottom-2"], ' +
            '.group [class*="group-hover:opacity-100"], ' +
            '.home_products_grid_card .absolute[class*="bottom-2"], ' +
            '.default_product_list_card .absolute[class*="bottom-2"], ' +
            '.default_product_featured_card .absolute[class*="bottom-2"], ' +
            '[class*="hover:shadow-product"] .absolute[class*="bottom-2"]'
        );

        containers.forEach(function(container) {
            // Check if it contains SVG buttons (eye or cart icons)
            const hasSvgButtons = container.querySelector('svg[viewBox="0 0 24 24"], svg[stroke-linecap], svg[fill="none"]');
            const hasActionButtons = container.querySelector('button[aria-label*="Add"], button:has(svg)');
            
            if (hasSvgButtons || hasActionButtons) {
                container.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; width: 0 !important; height: 0 !important; overflow: hidden !important; position: absolute !important; z-index: -9999 !important;';
            }
        });

        // Also directly hide buttons with specific aria-labels
        const buttons = document.querySelectorAll('button[aria-label="Add to cart"], button[aria-label*="Add"], button[aria-label*="cart"]');
        buttons.forEach(function(btn) {
            btn.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important;';
        });
    }

    // Run immediately
    hideHoverButtons();

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideHoverButtons);
    }

    // Run periodically for dynamic content
    setInterval(hideHoverButtons, 200);

    // Observer for new elements
    const observer = new MutationObserver(function(mutations) {
        let hasNew = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && (
                    node.classList?.contains('group') ||
                    node.querySelector?.('.group') ||
                    node.querySelector?.('.absolute')
                )) {
                    hasNew = true;
                }
            });
        });
        if (hasNew) hideHoverButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
