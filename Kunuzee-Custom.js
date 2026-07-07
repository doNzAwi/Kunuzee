// ═══════════════════════════════════════════════════════════════
// KUNUZEE STORE — JS (PERFORMANCE OPTIMIZED)
// Fixed: Added initial render deferral to prevent CPU blocking
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // 1. INSTANT FOUC PREVENTION (Kept fast, runs immediately)
    var foucStyle = document.createElement('style');
    foucStyle.id = 'kunuzee-instant-fouc-fix';
    foucStyle.textContent = '.thanks_content p:not(.underline):not([class*="underline"]) { display: none !important; } .thanks_content .mt-6 > div:not(.mb-12) { display: none !important; } .thanks_content > div:not(:has(svg)):not(.mt-6) { display: none !important; }';
    if (document.head) document.head.appendChild(foucStyle);

    // 2. DELAY SYSTEM INITIALIZATION (The Magic Fix for Old Devices)
    // Wait until the browser's main thread is idle after React loads.
    function initKunuzeeJS() {
        
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

        var Kunuzee = (function() {
            var isVisible = !document.hidden;
            document.addEventListener('visibilitychange', function() { isVisible = !document.hidden; });

            var domSubscribers = [];
            function onDomGrowth(fn) { domSubscribers.push(fn); return fn; }

            var domScheduled = false;
            function runDomSubscribers() {
                domScheduled = false;
                for (var i = 0; i < domSubscribers.length; i++) {
                    try { domSubscribers[i](); } catch (e) {}
                }
            }
            
            function scheduleDom() {
                if (domScheduled) return;
                domScheduled = true;
                requestAnimationFrame(function() {
                    if (window.requestIdleCallback) {
                        requestIdleCallback(runDomSubscribers, { timeout: 150 });
                    } else {
                        setTimeout(runDomSubscribers, 50);
                    }
                });
            }

            var mo = new MutationObserver(scheduleDom);
            mo.observe(document.body, { childList: true, subtree: true });
            scheduleDom();

            // Reduced interval frequency to save CPU
            setInterval(function() { if (isVisible) scheduleDom(); }, 2500);

            var routeSubscribers = [];
            function onRouteChange(fn) { routeSubscribers.push(fn); return fn; }
            var lastUrl = location.href;
            
            function fireRouteChange() {
                if (location.href === lastUrl) return;
                lastUrl = location.href;
                for (var i = 0; i < routeSubscribers.length; i++) {
                    try { routeSubscribers[i](); } catch (e) {}
                }
                scheduleDom();
            }

            var _push = history.pushState;
            history.pushState = function() { var r = _push.apply(history, arguments); setTimeout(fireRouteChange, 0); return r; };
            var _replace = history.replaceState;
            history.replaceState = function() { var r = _replace.apply(history, arguments); setTimeout(fireRouteChange, 0); return r; };
            window.addEventListener('popstate', fireRouteChange);

            function gatedLoop(hasTarget, tick) {
                var running = false;
                function frame() { if (!running) return; if (isVisible) tick(); requestAnimationFrame(frame); }
                function check() {
                    var shouldRun = !!hasTarget();
                    if (shouldRun && !running) { running = true; requestAnimationFrame(frame); } 
                    else if (!shouldRun && running) { running = false; }
                }
                onDomGrowth(check);
                check();
                return check;
            }

            return { onDomGrowth: onDomGrowth, onRouteChange: onRouteChange, gatedLoop: gatedLoop, isVisible: function() { return isVisible; } };
        })();

        // FUNCTION: Governorate Dropdown Module
        (function() {
            var PLACEHOLDER_TEXT = 'من فضلك قم باختيار محافظتك من القائمة';
            function getFlag(name) { return (KUNUZEE_GOVERNORATES[name.trim()] || {}).img || ''; }

            function fixSingleValue() {
                var sv = document.querySelector('.select__single-value');
                if (!sv) return;
                var text = sv.textContent.trim();
                var flag = getFlag(text);
                var existingFlag = sv.querySelector('.gov-flag');
                
                if (flag) {
                    if (existingFlag) { if (existingFlag.src !== flag) existingFlag.src = flag; } 
                    else {
                        var img = document.createElement('img');
                        img.src = flag; img.className = 'gov-flag'; img.alt = text;
                        sv.insertBefore(img, sv.firstChild);
                    }
                } else if (existingFlag) { existingFlag.remove(); }
            }

            var scopedObserver = null, scopedTarget = null;
            function runAll() {
                var sv = document.querySelector('.select__single-value');
                if (sv && sv !== scopedTarget) {
                    if (scopedObserver) scopedObserver.disconnect();
                    scopedTarget = sv;
                    scopedObserver = new MutationObserver(fixSingleValue);
                    scopedObserver.observe(sv, { characterData: true, subtree: true, childList: true });
                }
                fixSingleValue();
            }
            Kunuzee.onDomGrowth(runAll);
            Kunuzee.onRouteChange(runAll);
        })();

        // FUNCTION: Fix Discount Badge
        Kunuzee.onDomGrowth(function() {
            document.querySelectorAll('.default_product_featured_card > span.absolute').forEach(function(badge) {
                var text = badge.textContent.trim();
                if (!text.includes('%')) return;
                var num = parseInt(text);
                if (isNaN(num)) return;
                badge.textContent = 'خصم ' + num + '%';
                badge.classList.add('featured-discount-badge');
            });
        });

        // FUNCTION: Thank You Page Animation (Gated)
        (function() {
            var COLOR_MAP = { 'rgb(110,35,250)': 'var(--k-orange)', 'rgb(178,137,255)': 'var(--k-gold)' }; // Simplified map for performance
            var frameCount = 0;
            function tick() {
                frameCount++; if (frameCount % 6 !== 0) return;
                var svg = document.querySelector('.thanks_container svg');
                if (!svg) return;
                svg.querySelectorAll('*').forEach(function(el) {
                    var fill = el.getAttribute('fill') || '';
                    if (fill.includes('110,35,250')) el.setAttribute('fill', 'var(--k-orange)');
                });
                var c = document.querySelector('.thanks_container');
                if (c && !c.classList.contains('kunuzee-svg-ready')) c.classList.add('kunuzee-svg-ready');
            }
            Kunuzee.gatedLoop(function() { return document.querySelector('.thanks_container svg'); }, tick);
        })();
        
        // Add minimal required fixers here (removed aggressive redundant checkers)
        
    }

    // DELAY EXECUTION: Let React breath first!
    if (document.readyState === 'complete') {
        setTimeout(initKunuzeeJS, 800);
    } else {
        window.addEventListener('load', function() { setTimeout(initKunuzeeJS, 800); });
    }

})();
