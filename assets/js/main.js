(() => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const closeAllDropdowns = () => {
    qsa('[data-dropdown].open').forEach((d) => d.classList.remove('open'));
    qsa('[data-mobile-item].open').forEach((b) => b.classList.remove('open'));
  };

  const initDropdowns = () => {
    qsa('[data-dropdown-toggle]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-dropdown-toggle');
        const dropdown = qs(`[data-dropdown="${id}"]`);
        if (!dropdown) return;

        const isOpen = dropdown.classList.contains('open');
        closeAllDropdowns();
        dropdown.classList.toggle('open', !isOpen);
      });
    });

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-dropdown]')) return;
      closeAllDropdowns();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllDropdowns();
    });
  };

  const initMobileDrawer = () => {
    const drawer = qs('[data-mobile-drawer]');
    if (!drawer) return;

    const openBtn = qs('[data-mobile-open]');
    const closeBtn = qs('[data-mobile-close]');
    const backdrop = qs('[data-mobile-backdrop]');

    const open = () => {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      closeAllDropdowns();
    };

    openBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
    closeBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      close();
    });
    backdrop?.addEventListener('click', close);

    qsa('[data-mobile-item]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const isOpen = btn.classList.contains('open');
        qsa('[data-mobile-item].open').forEach((b) => b.classList.remove('open'));
        btn.classList.toggle('open', !isOpen);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  };

  const initSlider = () => {
    qsa('[data-slider]').forEach((root) => {
      const track = qs('[data-slider-track]', root);
      const slides = qsa('[data-slide]', root);
      const prev = qs('[data-prev]', root);
      const next = qs('[data-next]', root);
      if (!track || slides.length === 0) return;

      let index = 0;
      const update = () => {
        slides.forEach((s, i) => {
          s.style.transform = `translateX(${(i - index) * 100}%)`;
        });
      };
      const go = (dir) => {
        index = (index + dir + slides.length) % slides.length;
        update();
      };

      slides.forEach((s, i) => {
        s.style.transform = `translateX(${(i - index) * 100}%)`;
        s.style.transition = 'transform 420ms ease';
      });

      prev?.addEventListener('click', (e) => {
        e.preventDefault();
        go(-1);
      });
      next?.addEventListener('click', (e) => {
        e.preventDefault();
        go(1);
      });

      let timer = window.setInterval(() => go(1), 6500);
      root.addEventListener('mouseenter', () => {
        window.clearInterval(timer);
      });
      root.addEventListener('mouseleave', () => {
        timer = window.setInterval(() => go(1), 6500);
      });

      update();
    });
  };

  const initBlog = () => {
    const root = qs('[data-blog]');
    if (!root) return;

    const pills = qsa('[data-filter]', root);
    const search = qs('[data-search]', root);
    const list = qs('[data-posts]', root);
    const pager = qs('[data-pager]', root);

    const raw = root.getAttribute('data-posts-json');
    let posts = [];
    try {
      posts = raw ? JSON.parse(raw) : [];
    } catch {
      posts = [];
    }

    let activeCategory = 'All';
    let query = '';
    let page = 1;
    const pageSize = 6;

    const render = () => {
      if (!list) return;
      const filtered = posts
        .filter((p) => activeCategory === 'All' || p.category === activeCategory)
        .filter((p) => {
          if (!query) return true;
          const hay = `${p.title} ${p.excerpt} ${p.category}`.toLowerCase();
          return hay.includes(query.toLowerCase());
        });

      const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      page = Math.min(page, totalPages);
      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);

      list.innerHTML = items
        .map(
          (p) => `
            <article class="card hover">
              <div class="badge">${p.category}</div>
              <h3 class="h3" style="margin-top:10px">${p.title}</h3>
              <p class="small">${p.excerpt}</p>
              <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:12px">
                <span class="small">${p.date}</span>
                <a class="btn sm" href="#">Read</a>
              </div>
            </article>
          `
        )
        .join('');

      if (pager) {
        pager.innerHTML = `
          <button class="btn sm" ${page <= 1 ? 'disabled' : ''} data-page="prev">Prev</button>
          <span class="small">Page ${page} of ${totalPages}</span>
          <button class="btn sm" ${page >= totalPages ? 'disabled' : ''} data-page="next">Next</button>
        `;

        qsa('[data-page]', pager).forEach((btn) => {
          btn.addEventListener('click', () => {
            const dir = btn.getAttribute('data-page');
            if (dir === 'prev') page = Math.max(1, page - 1);
            if (dir === 'next') page = page + 1;
            render();
          });
        });
      }
    };

    pills.forEach((p) => {
      p.addEventListener('click', () => {
        pills.forEach((x) => x.classList.remove('active'));
        p.classList.add('active');
        activeCategory = p.getAttribute('data-filter') || 'All';
        page = 1;
        render();
      });
    });

    search?.addEventListener('input', (e) => {
      query = e.target.value || '';
      page = 1;
      render();
    });

    render();
  };

  const initActiveNav = () => {
    const path = (location.pathname || '/').replace(/\/index\.html$/, '/');
    qsa('[data-nav]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href) return;
      const normalized = href.replace(/\/index\.html$/, '/');
      if (normalized === '/' && path === '/') a.classList.add('active');
      else if (normalized !== '/' && path.startsWith(normalized.replace(/\.html$/, ''))) a.classList.add('active');
    });
  };

  const initTestiSlider = () => {
    const slider = qs('[data-testi-slider]');
    if (!slider) return;
    const slides = qsa('[data-testi-slide]', slider);
    const dotsContainer = qs('[data-testi-dots]', slider);
    if (!slides.length) return;

    let current = 0;

    const dots = slides.map((_, i) => {
      const d = document.createElement('button');
      d.className = 'testi-dot';
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(d);
      return d;
    });

    const goTo = (idx) => {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    };

    goTo(0);

    qs('[data-testi-prev]', slider)?.addEventListener('click', () => goTo(current - 1));
    qs('[data-testi-next]', slider)?.addEventListener('click', () => goTo(current + 1));

    // Auto-advance every 6 seconds
    setInterval(() => goTo(current + 1), 6000);
  };

  const initHeroSlideshow = () => {
    const slides = qsa('.hero-slide');
    if (slides.length <= 1) return;

    let currentIndex = 0;

    const nextSlide = () => {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
    };

    setInterval(nextSlide, 6000);
  };

  const initStatCounters = () => {
    const counters = qsa('.stat-box-number');
    const speed = 200; // Animation duration in ms

    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const increment = target / speed;
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      };

      updateCounter();
    };

    // Start animation when page loads
    setTimeout(() => {
      counters.forEach(counter => {
        // Start with 0
        counter.textContent = '0';
        
        // Start animation
        animateCounter(counter);
      });
    }, 500); // Small delay to ensure page is loaded
  };

  const initStatCircleAnimation = () => {
    const cards = qsa('.stat-circle-card');
    if (!cards.length) return;

    const animateRing = (card, delay = 0) => {
      const ring = qs('.stat-circle-ring', card);
      if (!ring) return;

      const progressRaw = card.style.getPropertyValue('--progress').trim();
      const target = Math.max(0, Math.min(100, Number(progressRaw || 0)));

      ring.style.setProperty('--p', '0');

      const duration = 1400;
      const startAt = performance.now() + delay;

      const tick = (now) => {
        if (now < startAt) {
          requestAnimationFrame(tick);
          return;
        }

        const elapsed = now - startAt;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        ring.style.setProperty('--p', String(target * eased));

        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const runAll = () => {
      cards.forEach((card, i) => animateRing(card, i * 120));
    };

    if (!('IntersectionObserver' in window)) {
      runAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runAll();
          obs.disconnect();
        });
      },
      { threshold: 0.25 }
    );

    const section = qs('.stats-section');
    if (section) observer.observe(section);
    else runAll();
  };

  initDropdowns();
  initMobileDrawer();
  initSlider();
  initTestiSlider();
  initBlog();
  initActiveNav();
  initHeroSlideshow();
  initStatCounters();
  initStatCircleAnimation();
})();
