// ═══════════════════════════════════════════════════════════════
// KUNUZEE STORE — OPTIMISED CUSTOM JAVASCRIPT
// Platform: Easy Orders
// Architecture: Core System + Plugin Registry
// ═══════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // CORE SYSTEM
  // ═══════════════════════════════════════════════════════════════
  const K = {
    plugins: {},
    observer: null,
    mutationQueue: [],
    mutationTimer: null,
    route: '',
    lastUrl: '',
    isSlow: false,

    // Route detection
    detectRoute() {
      const p = location.pathname;
      if (p.includes('/checkout')) this.route = 'checkout';
      else if (p.includes('/thanks')) this.route = 'thanks';
      else if (p.includes('/products/')) this.route = 'product';
      else if (p.includes('/collections/')) this.route = 'category';
      else this.route = 'home';
    },

    // Register plugin
    register(name, config) {
      this.plugins[name] = config;
    },

    // Check if plugin should run
    shouldRun(config) {
      if (config.routes && !config.routes.includes(this.route) && !config.routes.includes('all')) return false;
      if (config.condition && !config.condition()) return false;
      return true;
    },

    // Init applicable plugins
    initPlugins() {
      Object.entries(this.plugins).forEach(([name, cfg]) => {
        if (!this.shouldRun(cfg)) return;
        try {
          if (cfg.init) cfg.init();
          if (cfg.run) cfg.run(); // immediate run
        } catch (e) {
          console.warn('Kunuzee plugin error:', name, e);
        }
      });
    },

    // Master MutationObserver — debounced batch processing
    initObserver() {
      this.observer = new MutationObserver((mutations) => {
        this.mutationQueue.push(...mutations);
        if (this.mutationTimer) return;
        this.mutationTimer = setTimeout(() => {
          this.processMutations();
          this.mutationQueue = [];
          this.mutationTimer = null;
        }, 50); // 50ms batching
      });
      this.observer.observe(document.body, { childList: true, subtree: true });
    },

    processMutations() {
      const mutations = this.mutationQueue;
      Object.entries(this.plugins).forEach(([name, cfg]) => {
        if (!this.shouldRun(cfg) || !cfg.onMutate) return;
        try {
          cfg.onMutate(mutations);
        } catch (e) {
          console.warn('Kunuzee mutate error:', name, e);
        }
      });
    },

    // Throttled viewport events
    onViewport(cb, ms = 100) {
      let t;
      const fn = () => { if (!t) t = setTimeout(() => { t = null; cb(); }, ms); };
      window.addEventListener('scroll', fn, true);
      window.addEventListener('resize', fn);
    },

    // SPA detection
    initSPA() {
      this.lastUrl = location.href;
      setInterval(() => {
        if (location.href !== this.lastUrl) {
          this.lastUrl = location.href;
          this.detectRoute();
          this.initPlugins();
        }
      }, 500);
    },

    // Old device detection
    checkSlow() {
      this.isSlow = (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 2)
      );
    },

    // Boot
    init() {
      this.checkSlow();
      this.detectRoute();
      this.initObserver();
      this.initPlugins();
      this.initSPA();
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // GLOBAL DATA
  // ═══════════════════════════════════════════════════════════════
  const GOVS = {
    'القاهرة': { img: 'https://i.ibb.co/rqD9363/CAI.png' },
    'الجيزة': { img: 'https://i.ibb.co/67zy1sZc/GIZ.png' },
    'الإسكندرية': { img: 'https://i.ibb.co/CpGvzDjZ/ALX.png' },
    'البحيرة': { img: 'https://i.ibb.co/gZgXzWns/BEH.png' },
    'الدقهلية': { img: 'https://i.ibb.co/60j1Dmdr/DKL.png' },
    'الشرقية': { img: 'https://i.ibb.co/pr435136/SRQ.png' },
    'الغربية': { img: 'https://i.ibb.co/602dBkc4/GRB.png' },
    'القليوبية': { img: 'https://i.ibb.co/4gXy2Q50/QLB.png' },
    'المنوفية': { img: 'https://i.ibb.co/7Jg3W44f/MNF.png' },
    'بورسعيد': { img: 'https://i.ibb.co/SDYRqw9M/PRS.png' },
    'الإسماعيلية': { img: 'https://i.ibb.co/358V0nQr/ISM.png' },
    'السويس': { img: 'https://i.ibb.co/whJhxDwc/SUZ.png' },
    'شمال سيناء': { img: 'https://i.ibb.co/0RH1WMb0/NSN.png' },
    'جنوب سيناء': { img: 'https://i.ibb.co/xq93nStH/SSN.png' },
    'كفر الشيخ': { img: 'https://i.ibb.co/zHxrWmpn/KSH.png' },
    'بني سويف': { img: 'https://i.ibb.co/JwVGS8bf/BSF.png' },
    'دمياط': { img: 'https://i.ibb.co/fY7HRFYZ/DMT.png' },
    'سوهاج': { img: 'https://i.ibb.co/4R8v03sn/SOH.png' },
    'أسيوط': { img: 'https://i.ibb.co/pvS7XCnv/AST.png' },
    'الفيوم': { img: 'https://i.ibb.co/ZRnHMzy2/FYM.png' },
    'أسوان': { img: 'https://i.ibb.co/4nysjVxC/ASN.png' },
    'قنا': { img: 'https://i.ibb.co/gLd1jt9K/QNA.png' },
    'المنيا': { img: 'https://i.ibb.co/yFBQSvG0/MNA.png' },
    'مطروح': { img: 'https://i.ibb.co/5W7bj7hF/MTR.png' },
    'الأقصر': { img: 'https://i.ibb.co/RkTBC7xH/LUX.png' },
    'البحر الأحمر': { img: 'https://i.ibb.co/Kc9Cs8bY/RDS.png' },
    'الوادي الجديد': { img: 'https://i.ibb.co/23WFRW9X/NVA.png' }
  };

  const GROUPS = [
    { title: '', items: ['من فضلك قم باختيار محافظتك من القائمة'] },
    { title: '', items: ['القاهرة', 'الجيزة', 'الإسكندرية'] },
    { title: 'محافظات الوجه البحري ومطروح', items: ['القليوبية', 'المنوفية', 'الشرقية', 'الغربية', 'البحيرة', 'دمياط', 'الدقهلية', 'كفر الشيخ', 'مطروح'] },
    { title: 'محافظات القناة وسيناء', items: ['بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء', 'جنوب سيناء'] },
    { title: 'محافظات الوجه القبلي والبحر الأحمر', items: ['الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'البحر الأحمر', 'الوادي الجديد', 'أسوان'] }
  ];

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 1: Header Fix
  // ═══════════════════════════════════════════════════════════════
  K.register('fixHeader', {
    routes: ['all'],
    init() {
      const fix = () => {
        const borderDiv = document.querySelector('.default_header_container > div.border-b');
        const row = document.querySelector('.default_header_container > div > div.h-14.flex.items-center');
        const logoDiv = document.querySelector('.default_header_logo a > div');
        const logoImg = document.querySelector('.default_header_logo img');
        if (borderDiv) borderDiv.setAttribute('style', 'height:auto!important;min-height:auto!important;overflow:visible!important;');
        if (row) {
          row.classList.remove('h-14');
          row.setAttribute('style', 'height:auto!important;min-height:auto!important;max-height:none!important;padding-top:12px!important;padding-bottom:12px!important;overflow:visible!important;display:flex!important;align-items:center!important;');
        }
        if (logoDiv) {
          logoDiv.classList.remove('h-8', 'overflow-hidden');
          logoDiv.setAttribute('style', 'height:auto!important;min-height:auto!important;max-height:none!important;overflow:visible!important;display:flex!important;align-items:center!important;');
        }
        if (logoImg) {
          logoImg.classList.remove('h-8', 'h-full', 'w-full');
          logoImg.setAttribute('style', 'height:65px!important;min-height:65px!important;max-height:none!important;max-width:none!important;width:auto!important;object-fit:contain!important;display:block!important;');
        }
      };
      fix();
      K.onViewport(fix, 500);
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 2: Governorate Flags
  // ═══════════════════════════════════════════════════════════════
  K.register('govFlags', {
    routes: ['checkout', 'thanks', 'all'],
    condition() { return !!document.querySelector('.select__control'); },
    init() {
      const getFlag = (n) => GOVS[n.trim()]?.img || '';
      const getGroup = (n) => {
        for (let i = 0; i < GROUPS.length; i++) {
          const idx = GROUPS[i].items.indexOf(n.trim());
          if (idx !== -1) return { index: i, title: GROUPS[i].title, innerIndex: idx };
        }
        return { index: 999, title: '', innerIndex: 999 };
      };

      const fixSingle = () => {
        const sv = document.querySelector('.select__single-value');
        if (!sv) return;
        const text = sv.textContent.trim();
        const flag = getFlag(text);
        let img = sv.querySelector('.gov-flag');
        if (!flag) { if (img) img.remove(); return; }
        if (!img) {
          img = document.createElement('img');
          img.className = 'gov-flag';
          sv.insertBefore(img, sv.firstChild);
        }
        if (img.src !== flag) img.src = flag;
        img.alt = text;
      };

      const fixMenu = () => {
        const menu = document.querySelector('.select__menu');
        if (!menu || menu.dataset.govFixed === 'true') return;
        menu.dataset.govFixed = 'true';
        menu.querySelectorAll('.gov-group-header').forEach(h => h.remove());

        const list = menu.querySelector('.select__menu-list') || menu;
        let opts = Array.from(list.querySelectorAll('.select__option'));
        opts.forEach(opt => {
          if (opt.querySelector('.gov-flag')) return;
          const text = opt.textContent.trim();
          const flag = getFlag(text);
          if (!flag) return;
          const img = document.createElement('img');
          img.src = flag; img.className = 'gov-flag'; img.alt = text;
          opt.insertBefore(img, opt.firstChild);
        });

        const mapped = opts.map(opt => {
          const text = opt.textContent.trim();
          const info = getGroup(text);
          return { opt, text, groupIndex: info.index, title: info.title, innerIndex: info.innerIndex };
        });
        mapped.sort((a, b) => {
          if (a.groupIndex !== b.groupIndex) return a.groupIndex - b.groupIndex;
          return a.innerIndex - b.innerIndex;
        });

        let cur = -1;
        mapped.forEach(({ opt, groupIndex, title }) => {
          if (groupIndex !== cur && title) {
            const h = document.createElement('div');
            h.className = 'gov-group-header';
            h.textContent = title;
            h.setAttribute('aria-hidden', 'true');
            list.appendChild(h);
          }
          cur = groupIndex;
          list.appendChild(opt);
        });

        setTimeout(() => {
          const sel = list.querySelector('.select__option--is-selected');
          if (!sel) return;
          const mr = list.getBoundingClientRect();
          const sr = sel.getBoundingClientRect();
          list.scrollTop += sr.top - mr.top - mr.height / 2 + sr.height / 2;
        }, 0);
      };

      const run = () => { fixSingle(); fixMenu(); };
      run();

      K.onMutations((mutations) => {
        let need = false;
        mutations.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.nodeType !== 1) return;
            if (n.classList?.contains('select__menu')) { n.dataset.govFixed = ''; need = true; }
            if (n.querySelector?.('.select__menu') || n.classList?.contains('select__option') || n.classList?.contains('select__single-value')) need = true;
          });
          if (m.type === 'characterData' && m.target.parentElement?.classList?.contains('select__single-value')) need = true;
        });
        if (need) setTimeout(run, 0);
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 3: Dropdown Position
  // ═══════════════════════════════════════════════════════════════
  K.register('fixDropdown', {
    routes: ['all'],
    init() {
      const GAP = 12;
      const MIN_W = 220;

      const getPanelW = (panel) => {
        const wasHidden = panel.style.display === 'none' || getComputedStyle(panel).display === 'none';
        if (wasHidden) {
          panel.style.setProperty('visibility', 'hidden', 'important');
          panel.style.setProperty('display', 'block', 'important');
        }
        let w = panel.getBoundingClientRect().width;
        if (w <= 0) {
          const c = panel.querySelector(':scope > div');
          if (c) w = c.getBoundingClientRect().width;
        }
        if (wasHidden) { panel.style.display = ''; panel.style.visibility = ''; }
        return w > 0 ? w : MIN_W;
      };

      const findBtn = (panel) => {
        const btnId = panel.id.replace('panel', 'button');
        let btn = document.getElementById(btnId);
        if (btn) return btn;
        btn = document.querySelector('[aria-controls="' + panel.id + '"]');
        if (btn) return btn;
        const parent = panel.parentElement;
        if (parent) btn = parent.querySelector('button[id*="headlessui-popover-button"]');
        if (btn) return btn;
        const all = document.querySelectorAll('button[id*="headlessui-popover-button"][aria-expanded="true"]');
        return all.length === 1 ? all[0] : null;
      };

      const fix = () => {
        document.querySelectorAll('[id*="headlessui-popover-panel"]').forEach(panel => {
          const style = getComputedStyle(panel);
          if (style.display === 'none' || style.visibility === 'hidden') return;
          const btn = findBtn(panel);
          if (!btn) return;
          const br = btn.getBoundingClientRect();
          const pw = getPanelW(panel);
          let top = br.bottom + GAP;
          let left = br.left + br.width / 2 - pw / 2;
          if (left < 10) left = 10;
          if (left + pw > window.innerWidth - 10) left = window.innerWidth - pw - 10;
          panel.style.setProperty('top', top + 'px', 'important');
          panel.style.setProperty('left', left + 'px', 'important');
          panel.style.setProperty('right', 'auto', 'important');
          panel.style.setProperty('transform', 'none', 'important');
          panel.style.setProperty('margin', '0', 'important');
        });
      };

      // Run on mutations when panels appear
      K.onMutations((mutations) => {
        let hasPanel = false;
        mutations.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1 && n.id?.includes('headlessui-popover-panel')) hasPanel = true;
          });
        });
        if (hasPanel) {
          setTimeout(fix, 0);
          setTimeout(fix, 50);
          setTimeout(fix, 150);
          setTimeout(fix, 300);
        }
      });

      // Click handler
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('button[id*="headlessui-popover-button"]');
        if (btn) {
          setTimeout(fix, 0);
          setTimeout(fix, 50);
          setTimeout(fix, 150);
          setTimeout(fix, 300);
        }
      });

      K.onViewport(fix, 100);
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 4: Clone Description
  // ═══════════════════════════════════════════════════════════════
  K.register('cloneDesc', {
    routes: ['home', 'category', 'product'],
    init() {
      const clone = () => {
        const orig = document.querySelector('div.ql-editor:not(.ql-editor-clone), div[class*="ql-editor"]:not(.ql-editor-clone)');
        const header = document.querySelector('.category_section_header, [class*="category_section_header"]');
        if (!orig || !header) return;
        orig.style.display = 'none';
        const existing = header.parentNode.querySelector('.ql-editor-clone');
        if (existing) {
          if (existing.innerHTML !== orig.innerHTML) existing.innerHTML = orig.innerHTML;
          return;
        }
        const c = orig.cloneNode(true);
        c.classList.add('ql-editor-clone');
        c.style.cssText = 'color:var(--k-orange)!important;margin-top:12px!important;display:block!important;width:100%!important;';
        header.parentNode.insertBefore(c, header.nextSibling);
      };
      clone();
      K.onMutations((mutations) => {
        let has = false;
        mutations.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1 && (n.classList?.contains('ql-editor') || n.querySelector?.('.ql-editor'))) has = true;
          });
        });
        if (has) clone();
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 5: Discount Badge
  // ═══════════════════════════════════════════════════════════════
  K.register('discountBadge', {
    routes: ['home', 'category'],
    init() {
      const fix = () => {
        document.querySelectorAll('.default_product_featured_card > span.absolute').forEach(badge => {
          const text = badge.textContent.trim();
          if (!text.includes('%')) return;
          const num = parseInt(text);
          if (isNaN(num)) return;
          badge.textContent = 'خصم ' + num + '%';
          badge.classList.add('featured-discount-badge');
        });
      };
      fix();
      setTimeout(fix, 300);
      setTimeout(fix, 600);
      K.onMutations((mutations) => {
        let has = false;
        mutations.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1 && (n.classList?.contains('default_product_featured_card') || n.querySelector?.('.default_product_featured_card'))) has = true;
          });
        });
        if (has) setTimeout(fix, 300);
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 6: Thank You SVG (Optimised)
  // ═══════════════════════════════════════════════════════════════
  K.register('thankYouSvg', {
    routes: ['thanks'],
    init() {
      const MAP = {
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

      const norm = (c) => c ? c.replace(/\s*,\s*/g, ',').trim().toLowerCase() : '';

      const fix = () => {
        const svg = document.querySelector('.thanks_container svg');
        if (!svg) return;
        let changed = false;
        svg.querySelectorAll('*').forEach(el => {
          const fa = norm(el.getAttribute('fill'));
          const sa = norm(el.getAttribute('stroke'));
          if (MAP[fa]) { el.setAttribute('fill', MAP[fa]); changed = true; }
          if (MAP[sa]) { el.setAttribute('stroke', MAP[sa]); changed = true; }

          const fs = norm(el.style.fill);
          const ss = norm(el.style.stroke);
          if (MAP[fs]) { el.style.fill = MAP[fs]; changed = true; }
          if (MAP[ss]) { el.style.stroke = MAP[ss]; changed = true; }

          const st = el.getAttribute('style');
          if (st) {
            const ns = st.replace(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/gi, m => MAP[norm(m)] || m);
            if (ns !== st) { el.setAttribute('style', ns); changed = true; }
          }
        });
        if (changed) {
          const c = document.querySelector('.thanks_container');
          if (c && !c.classList.contains('kunuzee-svg-ready')) c.classList.add('kunuzee-svg-ready');
        }
      };

      // Run once immediately, then observe SVG subtree only
      fix();
      const svgObs = new MutationObserver(fix);
      const svg = document.querySelector('.thanks_container svg');
      if (svg) svgObs.observe(svg, { childList: true, subtree: true, attributes: true, attributeFilter: ['fill', 'stroke', 'style'] });

      // Also check via master observer for SVG injection
      K.onMutations(() => {
        const svg = document.querySelector('.thanks_container svg');
        if (svg && !svg.dataset.kunuzeeObserved) {
          svg.dataset.kunuzeeObserved = '1';
          svgObs.observe(svg, { childList: true, subtree: true, attributes: true, attributeFilter: ['fill', 'stroke', 'style'] });
          fix();
        }
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 7: Back Home Button
  // ═══════════════════════════════════════════════════════════════
  K.register('backHome', {
    routes: ['thanks'],
    init() {
      const fix = () => {
        const link = document.querySelector('.thanks_container a[href="/"]');
        if (!link) return;
        const span = link.querySelector('span[aria-hidden="true"]');
        if (!span || span.dataset.arrowFixed === 'true') return;
        span.textContent = '→';
        link.insertBefore(span, link.firstChild);
        span.style.marginLeft = '0.5rem';
        span.style.marginRight = '0';
        span.style.display = 'inline-block';
        span.dataset.arrowFixed = 'true';
      };
      fix();
      K.onMutations(() => setTimeout(fix, 100));
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 8: Swap Refund & Timeline
  // ═══════════════════════════════════════════════════════════════
  K.register('swapRefund', {
    routes: ['thanks'],
    init() {
      const findRefund = (container) => {
        const buttons = container.querySelectorAll('button');
        for (let i = 0; i < buttons.length; i++) {
          if (buttons[i].querySelector('img[alt="refund"]')) {
            return buttons[i].closest('div.rounded-lg, div.rounded-xl, div.border');
          }
        }
        return null;
      };

      const swap = () => {
        const container = document.querySelector('.order_invoice_container .flex.flex-col.gap-5');
        if (!container) return;
        const refundBox = findRefund(container);
        const timelineBox = container.querySelector('ul.rounded-lg.border, ul.border');
        if (!refundBox || !timelineBox) return;
        const children = Array.from(container.children);
        const rIdx = children.indexOf(refundBox);
        const tIdx = children.indexOf(timelineBox);
        if (tIdx < rIdx) return;
        container.insertBefore(timelineBox, refundBox);
      };
      swap();
      K.onMutations(() => setTimeout(swap, 100));
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 9: Kunuzee Box
  // ═══════════════════════════════════════════════════════════════
  K.register('kunuzeeBox', {
    routes: ['thanks'],
    init() {
      const fix = () => {
        const address = document.querySelector('.order_invoice_container address');
        if (!address || address.dataset.kunuzeeFixed === 'true') return;

        const phoneLink = address.querySelector('a[href^="tel:"], a[href="tel:undefined"]');
        if (phoneLink) phoneLink.style.display = 'none';

        address.querySelectorAll('span').forEach(span => {
          if (span.textContent.includes('العنوان:')) {
            const next = span.nextElementSibling;
            if (!next || next.textContent.trim() === '') {
              span.style.display = 'none';
              if (next) next.style.display = 'none';
            }
          }
        });

        const emailLink = address.querySelector('a[href^="mailto:"]');
        if (emailLink) {
          const emailAddress = 'kunuzeestore@gmail.com';
          const wrapper = document.createElement('span');
          wrapper.className = 'flex items-center gap-2 flex-wrap';
          wrapper.innerHTML = '<span>البريد الإلكتروني: </span><a href="mailto:' + emailAddress + '">' + emailAddress + '</a>';
          emailLink.parentNode.replaceChild(wrapper, emailLink);
        }

        const emailWrapper = address.querySelector('span:has(> a[href^="mailto:"])');
        if (emailWrapper) {
          const addrWrapper = document.createElement('span');
          addrWrapper.className = 'flex items-center gap-2 flex-wrap';
          addrWrapper.innerHTML = '<span>العنوان: </span><a href="https://kunuzee.com" target="_blank" rel="noopener noreferrer">kunuzee.com</a>';
          emailWrapper.parentNode.insertBefore(addrWrapper, emailWrapper);
        }

        address.dataset.kunuzeeFixed = 'true';
      };
      fix();
      K.onMutations(() => setTimeout(fix, 100));
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 10: Delivery Info Box
  // ═══════════════════════════════════════════════════════════════
  K.register('deliveryInfo', {
    routes: ['thanks'],
    init() {
      const fix = () => {
        const allBoxes = document.querySelectorAll('.order_invoice_container .border.p-4.rounded-lg.shadow-sm');
        let deliveryBox = null;
        for (let i = 0; i < allBoxes.length; i++) {
          const h3 = allBoxes[i].querySelector('h3');
          if (h3 && h3.textContent.includes('بيانات التوصيل')) {
            deliveryBox = allBoxes[i];
            break;
          }
        }
        if (!deliveryBox || deliveryBox.dataset.deliveryFixed === 'true') return;

        const dl = deliveryBox.querySelector('div.flex.flex-col.gap-2');
        if (!dl) return;
        const items = dl.querySelectorAll('dt');
        if (items.length < 4) return;

        items.forEach(dt => {
          const labelSpan = dt.querySelector('span:first-child');
          const valueSpan = dt.querySelector('span:last-child');
          if (!labelSpan) return;
          const label = labelSpan.textContent.trim();

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

            if (!dt.querySelector('.gov-value') && typeof GOVS !== 'undefined') {
              let textNode = null;
              for (let j = 0; j < dt.childNodes.length; j++) {
                if (dt.childNodes[j].nodeType === 3 && dt.childNodes[j].textContent.trim()) {
                  textNode = dt.childNodes[j];
                  break;
                }
              }
              if (textNode) {
                const govName = textNode.textContent.trim();
                const govData = GOVS[govName];
                if (govData && govData.img) {
                  const valueWrapper = document.createElement('span');
                  valueWrapper.className = 'gov-value';
                  const img = document.createElement('img');
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
              const val = valueSpan.textContent.trim();
              if (val.toLowerCase() === 'kashier') valueSpan.textContent = ' Kashier';
            }
          }
        });

        dl.classList.add('delivery-info-reordered');
        deliveryBox.dataset.deliveryFixed = 'true';
      };
      fix();
      K.onMutations(() => setTimeout(fix, 100));
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 11: Timeline Time (24h)
  // ═══════════════════════════════════════════════════════════════
  K.register('timelineTime', {
    routes: ['thanks'],
    init() {
      const convert = (timeStr) => {
        const match = timeStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return null;
        const month = match[1].padStart(2, '0');
        const day = match[2].padStart(2, '0');
        const year = match[3];
        let hour = parseInt(match[4], 10);
        const minute = match[5];
        const second = match[6];
        const period = match[7].toUpperCase();
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        return day + '/' + month + '/' + year + ', ' + hour.toString().padStart(2, '0') + ':' + minute + ':' + second;
      };

      const fix = () => {
        const timeline = document.querySelector('.order_invoice_container ul.rounded-lg.border');
        if (!timeline || timeline.dataset.timeFixed === 'true') return;
        timeline.querySelectorAll('li').forEach(li => {
          const timeSpan = li.querySelector('span.text-gray-500, span:last-child');
          if (!timeSpan) return;
          const original = timeSpan.textContent.trim();
          const converted = convert(original);
          if (converted) {
            if (!timeSpan.dataset.originalTime) timeSpan.dataset.originalTime = original;
            timeSpan.textContent = converted;
          }
        });
        timeline.dataset.timeFixed = 'true';
      };
      fix();
      K.onMutations(() => setTimeout(fix, 100));
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 12: Product Total
  // ═══════════════════════════════════════════════════════════════
  K.register('productTotal', {
    routes: ['thanks'],
    init() {
      const fix = () => {
        document.querySelectorAll('.order_invoice_container .col-span-2 > div.flex.flex-col.gap-6 > div.flex.flex-col.gap-4.md\\:flex-row').forEach(product => {
          const totalP = product.querySelector('p.text-lg');
          if (!totalP || totalP.dataset.totalFixed === 'true') return;
          const text = totalP.textContent.trim();
          const match = text.match(/(\d[\d,]*)\s*ج\.م/);
          if (!match) return;
          const price = match[1];

          totalP.innerHTML = '';
          totalP.style.cssText = 'display:flex;align-items:baseline;gap:4px;color:var(--k-orange);font-weight:700;font-size:1.5rem;font-family:"Tajawal",sans-serif;';

          const numSpan = document.createElement('span');
          numSpan.textContent = price;
          totalP.appendChild(numSpan);

          const egpSpan = document.createElement('span');
          egpSpan.textContent = 'EGP';
          egpSpan.style.cssText = 'font-size:0.8rem;font-weight:500;color:var(--k-orange);position:relative;top:-0.3rem;margin-right:0.05rem;font-family:"Tajawal",sans-serif;';
          totalP.appendChild(egpSpan);

          totalP.dataset.totalFixed = 'true';
        });
      };
      fix();
      K.onMutations(() => setTimeout(fix, 100));
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 13: Product Labels for Downloads
  // ═══════════════════════════════════════════════════════════════
  K.register('downloadLabels', {
    routes: ['thanks'],
    init() {
      const add = () => {
        const container = document.querySelector('.order_invoice_container');
        if (!container) return;
        const names = [];
        container.querySelectorAll('h4').forEach(h4 => {
          const name = h4.textContent.trim();
          if (name) names.push(name);
        });
        const linkContainers = container.querySelectorAll('div.bg-gray-50.rounded-lg');
        for (let i = 0; i < linkContainers.length; i++) {
          const lc = linkContainers[i];
          if (!lc.querySelector('a[href]')) continue;
          if (lc.getAttribute('data-label-fixed') === 'true') continue;
          if (i >= names.length) break;
          const label = document.createElement('span');
          label.className = 'download-product-label';
          label.textContent = names[i];
          lc.parentNode.insertBefore(label, lc);
          lc.setAttribute('data-label-fixed', 'true');
        }
      };
      add();
      K.onMutations(() => setTimeout(add, 100));
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 14: Coupon Code Color
  // ═══════════════════════════════════════════════════════════════
  K.register('couponCode', {
    routes: ['thanks'],
    init() {
      const fix = () => {
        document.querySelectorAll('.order_invoice_container .col-span-2 > div.p-5.border.rounded-lg.shadow-sm:last-child div.font-medium > dt').forEach(dt => {
          const span = dt.querySelector('span:first-child');
          if (!span || span.dataset.couponFixed === 'true') return;
          const text = span.textContent.trim();
          if (!text.includes('كود الخصم:')) return;
          const parts = text.split(':');
          if (parts.length < 2) return;
          const label = parts[0] + ':';
          const code = parts.slice(1).join(':').trim();

          span.innerHTML = '';
          const labelSpan = document.createElement('span');
          labelSpan.textContent = label;
          labelSpan.style.color = 'var(--k-teal)';
          const codeSpan = document.createElement('span');
          codeSpan.textContent = ' ' + code;
          codeSpan.style.color = 'var(--k-orange)';
          span.appendChild(labelSpan);
          span.appendChild(codeSpan);
          span.dataset.couponFixed = 'true';
        });
      };
      fix();
      K.onMutations(() => setTimeout(fix, 100));
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 15: Governorate Placeholder
  // ═══════════════════════════════════════════════════════════════
  K.register('govPlaceholder', {
    routes: ['checkout', 'thanks'],
    condition() { return !!document.querySelector('.select__control'); },
    init() {
      const PLACEHOLDER = 'من فضلك قم باختيار محافظتك من القائمة';
      const fix = () => {
        document.querySelectorAll('.select__single-value').forEach(sv => {
          if (sv.textContent.trim() === PLACEHOLDER) {
            sv.style.setProperty('color', 'var(--k-gold)', 'important');
            sv.style.setProperty('font-family', '"Tajawal", sans-serif', 'important');
          }
        });
        document.querySelectorAll('.select__option').forEach(opt => {
          if (opt.textContent.trim() === PLACEHOLDER) {
            opt.style.setProperty('color', 'var(--k-gold)', 'important');
            opt.style.setProperty('font-family', '"Tajawal", sans-serif', 'important');
          }
        });
      };
      fix();
      K.onMutations(() => setTimeout(fix, 0));
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 16: Prevent Body Shift (Optimised)
  // ═══════════════════════════════════════════════════════════════
  K.register('preventBodyShift', {
    routes: ['all'],
    init() {
      const origSetProperty = CSSStyleDeclaration.prototype.setProperty;
      const origSetAttribute = Element.prototype.setAttribute;

      CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
        if (property === 'padding-right' && value && value.indexOf && value.indexOf('px') !== -1) {
          const el = this.parentElement || this.element;
          if (el && el.tagName === 'BODY') return;
        }
        return origSetProperty.apply(this, arguments);
      };

      Element.prototype.setAttribute = function(name, value) {
        if (this.tagName === 'BODY' && name === 'style' && value && value.indexOf('padding-right') !== -1) {
          value = value.replace(/padding-right:\s*[^;]+;?/g, '');
        }
        return origSetAttribute.apply(this, arguments);
      };

      const obs = new MutationObserver((mutations) => {
        mutations.forEach(m => {
          if (m.type === 'attributes' && m.attributeName === 'style') {
            const body = document.body;
            if (body && body.style.paddingRight) {
              body.style.paddingRight = '';
              body.style.removeProperty('padding-right');
            }
          }
        });
      });

      if (document.body) {
        obs.observe(document.body, { attributes: true, attributeFilter: ['style'] });
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          obs.observe(document.body, { attributes: true, attributeFilter: ['style'] });
        });
      }
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 17: Governorate Color
  // ═══════════════════════════════════════════════════════════════
  K.register('govColor', {
    routes: ['checkout', 'thanks'],
    condition() { return !!document.querySelector('.select__control'); },
    init() {
      const DEFAULT = 'من فضلك قم باختيار محافظتك من القائمة';
      let lastText = '';

      const fix = () => {
        const sv = document.querySelector('.select__single-value');
        if (!sv) return;
        const text = sv.textContent.trim();
        if (text === lastText) return;
        lastText = text;
        const hasFlag = sv.querySelector('.gov-flag');
        const color = (hasFlag || text !== DEFAULT) ? 'var(--k-orange)' : 'var(--k-gold)';
        sv.style.setProperty('color', color, 'important');
      };

      fix();
      document.addEventListener('click', (e) => {
        if (e.target.closest('.select__option, .select__control')) {
          setTimeout(fix, 50);
          setTimeout(fix, 150);
        }
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 18: Default Category Cards
  // ═══════════════════════════════════════════════════════════════
  K.register('categoryCards', {
    routes: ['home', 'category'],
    init() {
      const fix = () => {
        document.querySelectorAll('.default_category_card').forEach(card => {
          const overlay = card.querySelector('.absolute.top.left.bg-black');
          if (overlay) overlay.style.display = 'none';

          const iconContainer = card.querySelector('.absolute.top.left.h-full.w-full.flex.items-center.justify-center');
          if (iconContainer) iconContainer.style.display = 'none';

          const imgContainer = card.querySelector('.default_category_card_img');
          if (imgContainer) {
            imgContainer.style.borderRadius = '9999px';
            imgContainer.classList.remove('rounded-md');
            imgContainer.classList.add('rounded-full');
          }

          const img = card.querySelector('.default_category_card_img img');
          if (img) {
            img.style.borderRadius = '9999px';
            img.classList.remove('rounded-md');
            img.classList.add('rounded-full');
          }

          const parent = card.querySelector('.relative.inline-flex');
          if (parent) {
            parent.style.borderRadius = '9999px';
            parent.style.overflow = 'hidden';
            parent.classList.remove('rounded-md');
            parent.classList.add('rounded-full');
          }
        });
      };
      fix();
      K.onMutations(() => setTimeout(fix, 0));
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 19: Scroll to Top on Navigation
  // ═══════════════════════════════════════════════════════════════
  K.register('scrollTop', {
    routes: ['all'],
    init() {
      let isFromProduct = false;
      document.addEventListener('click', (e) => {
        const card = e.target.closest('.default_product_featured_card, .default_product_list_card, .home_products_grid_card');
        if (card) isFromProduct = true;
      });

      K.initSPADetection = (function() {
        const orig = K.initSPADetection;
        return function() {
          orig.call(K);
          // Override the interval to also handle scroll
          const check = setInterval(() => {
            if (location.href !== K.lastUrl) {
              K.lastUrl = location.href;
              K.detectRoute();
              K.initPlugins();
              if (isFromProduct && location.pathname.includes('/products/')) {
                isFromProduct = false;
                setTimeout(() => window.scrollTo(0, 0), 50);
                setTimeout(() => window.scrollTo(0, 0), 150);
                setTimeout(() => window.scrollTo(0, 0), 300);
              } else {
                isFromProduct = false;
              }
            }
          }, 100);
        };
      })();
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 20: Marquee Animations (Checkout + FAQ)
  // ═══════════════════════════════════════════════════════════════
  K.register('marquees', {
    routes: ['all'],
    condition() { return !K.isSlow; }, // Disable on old devices
    init() {
      const items = [];
      let styleInjected = false;

      const injectStyles = () => {
        if (styleInjected) return;
        styleInjected = true;
        const style = document.createElement('style');
        style.textContent = [
          '.kph-wrap, .kfq-wrap { display:inline-block; overflow:hidden; vertical-align:middle; position:relative; }',
          '.kph-wrap { position:absolute; top:0; left:0; right:0; bottom:0; pointer-events:none; z-index:10; direction:rtl; padding:0.5rem 0.75rem; box-sizing:border-box; height:100%; display:flex; align-items:center; }',
          '.kph-text, .kfq-text { display:inline-block; white-space:nowrap; direction:rtl; font-family:"Tajawal",sans-serif; font-size:1rem; color:var(--k-gold); opacity:0.9; line-height:1.25; }',
          '.kph-wrap.kph-hidden { display:none!important; }',
          '.kfq-text { padding-right:0.7rem; padding-left:1.5rem; }'
        ].join(' ');
        document.head.appendChild(style);
      };

      // FAQ Marquee
      const initFAQ = () => {
        document.querySelectorAll('.szh-accordion__item-btn:not([data-kfq])').forEach(btn => {
          btn.dataset.kfq = '1';
          let textNode = null;
          for (let i = 0; i < btn.childNodes.length; i++) {
            if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
              textNode = btn.childNodes[i];
              break;
            }
          }
          if (!textNode) return;
          const svg = btn.querySelector('svg');
          const svgWidth = svg ? svg.getBoundingClientRect().width + 4 : 28;

          const wrap = document.createElement('span');
          wrap.className = 'kfq-wrap';
          const span = document.createElement('span');
          span.className = 'kfq-text';
          span.textContent = textNode.textContent.trim();
          wrap.appendChild(span);
          btn.replaceChild(wrap, textNode);
          if (svg) svg.style.flexShrink = '0';

          setTimeout(() => {
            const btnPad = 16;
            const wrapWidth = btn.clientWidth - svgWidth - btnPad;
            if (wrapWidth < 80) return;
            wrap.style.width = wrapWidth + 'px';
            const mask = 'linear-gradient(to left, transparent 0%, black 3%, black 93%, transparent 100%)';
            wrap.style.webkitMaskImage = mask;
            wrap.style.maskImage = mask;
            const overflow = span.scrollWidth - wrapWidth;
            if (overflow > 0) items.push({ span, overflow, pos: 0, dir: 1, wait: 0, pause: 120 });
          }, 500);
        });
      };

      // Checkout Placeholders Marquee
      const initCheckout = () => {
        if (!document.querySelector('.checkout_form, .checkout_container, .contact-info-heading')) return;
        injectStyles();

        document.querySelectorAll('.checkout_form input.global_input, .checkout_container input.global_input, .contact-info-heading input.global_input').forEach(input => {
          if (input.dataset.kph === '1') return;
          input.dataset.kph = '1';

          const originalPlaceholder = input.getAttribute('placeholder') || '';
          if (!originalPlaceholder || originalPlaceholder.length < 10) return;

          let relativeParent = input.closest('div.relative, div[class*="relative"]');
          if (!relativeParent) relativeParent = input.parentElement;

          input.dataset.originalPlaceholder = originalPlaceholder;
          input.setAttribute('placeholder', '');

          const wrap = document.createElement('span');
          wrap.className = 'kph-wrap';
          const span = document.createElement('span');
          span.className = 'kph-text';
          span.textContent = originalPlaceholder;
          wrap.appendChild(span);
          relativeParent.appendChild(wrap);

          const measure = () => {
            const wrapWidth = relativeParent.offsetWidth;
            if (wrapWidth < 80) return;
            wrap.style.boxSizing = 'border-box';
            wrap.style.width = wrapWidth + 'px';
            const mask = 'linear-gradient(to left, transparent 0%, black 3%, black 93%, transparent 100%)';
            wrap.style.webkitMaskImage = mask;
            wrap.style.maskImage = mask;
            void span.offsetWidth;
            const cs = getComputedStyle(wrap);
            const padL = parseFloat(cs.paddingLeft) || 0;
            const padR = parseFloat(cs.paddingRight) || 0;
            const available = wrapWidth - padL - padR;
            const overflow = span.scrollWidth - available;
            if (overflow > 0) items.push({ span, overflow, pos: 0, dir: 1, wait: 0, pause: 120, wrap, input });
          };

          if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => setTimeout(measure, 100));
          } else {
            setTimeout(measure, 600);
          }

          const updateVis = () => {
            if (input.value && input.value.trim().length > 0) wrap.classList.add('kph-hidden');
            else wrap.classList.remove('kph-hidden');
          };
          input.addEventListener('input', updateVis);
          input.addEventListener('focus', updateVis);
          input.addEventListener('blur', updateVis);
          updateVis();
        });
      };

      const initAll = () => { initFAQ(); initCheckout(); };
      initAll();

      K.onMutations(() => initAll());

      // Animation loop
      const animate = () => {
        items.forEach(item => {
          if (item.wait > 0) { item.wait--; return; }
          const speed = 0.35;
          if (item.dir === 1) {
            item.pos += speed;
            if (item.pos >= item.overflow) { item.pos = item.overflow; item.dir = -1; item.wait = item.pause; }
          } else {
            item.pos -= speed;
            if (item.pos <= 0) { item.pos = 0; item.dir = 1; item.wait = item.pause; }
          }
          item.span.style.transform = 'translateX(' + item.pos + 'px)';
        });
        requestAnimationFrame(animate);
      };
      animate();
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 21: Governorate List Tajawal
  // ═══════════════════════════════════════════════════════════════
  K.register('govTajawal', {
    routes: ['checkout', 'thanks'],
    condition() { return !!document.querySelector('.select__control'); },
    init() {
      const apply = () => {
        const menuList = document.querySelector('.select__menu-list, [class*="select__menu-list"]');
        if (!menuList) return;
        menuList.querySelectorAll('.select__option, [class*="select__option"]').forEach(opt => {
          opt.style.setProperty('font-family', '"Tajawal", sans-serif', 'important');
        });
        menuList.querySelectorAll('.gov-group-header').forEach(h => {
          h.style.setProperty('font-family', '"Tajawal", sans-serif', 'important');
        });
      };

      K.onMutations((mutations) => {
        let opened = false;
        mutations.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1 && (
              n.classList?.contains('select__menu') ||
              n.querySelector?.('.select__menu-list') ||
              n.classList?.contains('select__menu-list')
            )) opened = true;
          });
        });
        if (opened) {
          setTimeout(apply, 0);
          setTimeout(apply, 50);
          setTimeout(apply, 150);
        }
      });

      const style = document.createElement('style');
      style.textContent = [
        '.select__menu-list .select__option, .select__menu-list [class*="select__option"], .select__menu .gov-group-header {',
        '  font-family: "Tajawal", sans-serif !important;',
        '}',
        '.select__menu-list .select__option--is-selected, .select__menu-list [class*="select__option--is-selected"] {',
        '  font-family: "Tajawal", sans-serif !important;',
        '}',
        '.select__menu-list .select__option--is-focused, .select__menu-list [class*="select__option--is-focused"] {',
        '  font-family: "Tajawal", sans-serif !important;',
        '}'
      ].join(' ');
      document.head.appendChild(style);
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 22: Instant FOUC Prevention
  // ═══════════════════════════════════════════════════════════════
  K.register('foucFix', {
    routes: ['thanks'],
    init() {
      const style = document.createElement('style');
      style.id = 'kunuzee-instant-fouc-fix';
      style.textContent = [
        '.thanks_content p:not(.underline):not([class*="underline"]) { display:none!important; }',
        '.thanks_content .mt-6 > div:not(.mb-12) { display:none!important; }',
        '.thanks_content > div:not(:has(svg)):not(.mt-6) { display:none!important; }'
      ].join(' ');
      if (document.head) document.head.appendChild(style);
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PLUGIN 23: Hide Order Received Text
  // ═══════════════════════════════════════════════════════════════
  K.register('hideOrderText', {
    routes: ['thanks'],
    init() {
      const KEYWORDS = ['لقد استلمنا طلبك', 'استلمنا طلبك', 'سنتواصل معك', 'مكالمتنا', 'يرجى الانتظار'];
      const shouldHide = (el) => {
        const text = (el.textContent || '').trim();
        if (!text || text.length > 200) return false;
        return KEYWORDS.some(kw => text.indexOf(kw) !== -1);
      };
      const hide = () => {
        const container = document.querySelector('.thanks_content');
        if (!container) return;
        container.querySelectorAll('p, div, span, h2, h3, h4, h5, h6').forEach(el => {
          if (shouldHide(el)) el.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;';
        });
      };
      hide();
      const container = document.querySelector('.thanks_content');
      if (container) {
        const obs = new MutationObserver(hide);
        obs.observe(container, { childList: true, subtree: true });
      }
      const interval = setInterval(hide, 50);
      setTimeout(() => clearInterval(interval), 3000);
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // BOOT
  // ═══════════════════════════════════════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => K.init());
  } else {
    K.init();
  }

})();
