(() => {
  const init = () => {
    const wrap = document.getElementById('saaMemberCarousel');
    const source = document.getElementById('saaMemberLogoSource');
    if (!wrap || !source) return;

    const row1 = wrap.querySelector('.saa-members-v2__row--one');
    const row2 = wrap.querySelector('.saa-members-v2__row--two');
    if (!row1 || !row2) return;

    const items = Array.from(
      source.content.querySelectorAll('img[data-member-source]')
    ).map(img => ({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || 'Professional association'
    }));

    if (items.length < 2) return;

    const splitAt = Math.ceil(items.length / 2);
    const lane1 = items.slice(0, splitAt);
    const lane2 = items.slice(splitAt);

    const makeCard = (item, duplicate = false) => {
      const card = document.createElement('div');
      card.className = 'saa-member-card';
      card.setAttribute('role', 'listitem');

      if (duplicate) {
        card.setAttribute('aria-hidden', 'true');
      } else {
        card.setAttribute('aria-label', item.alt);
      }

      const img = document.createElement('img');
      img.className = 'saa-member-card__img';
      img.src = item.src;
      img.alt = duplicate ? '' : item.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;

      const shine = document.createElement('span');
      shine.className = 'saa-member-card__shine';
      shine.setAttribute('aria-hidden', 'true');

      card.append(img, shine);
      return card;
    };

    const fillLane = (row, lane) => {
      const frag = document.createDocumentFragment();

      lane.forEach(item => frag.appendChild(makeCard(item, false)));
      lane.forEach(item => frag.appendChild(makeCard(item, true)));

      row.replaceChildren(frag);
    };

    fillLane(row1, lane1);
    fillLane(row2, lane2);

    const lane1Urls = new Set(lane1.map(item => item.src));
    const overlap = lane2.some(item => lane1Urls.has(item.src));

    if (overlap) {
      console.warn('SA Members: overlapping source detected between lanes.');
      return;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;

    let x1 = 0;
    let x2 = 0;
    let paused = false;
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const speed1 = 26;
    const speed2 = 20;
    const halfWidth = row => row.scrollWidth / 2;

    requestAnimationFrame(() => {
      const h1 = halfWidth(row1);
      const h2 = halfWidth(row2);

      if (h1) x1 = -(h1 * 0.08);
      if (h2) x2 = -(h2 * 0.42);

      row1.style.transform = `translate3d(${x1}px,0,0)`;
      row2.style.transform = `translate3d(${x2}px,0,0)`;
    });

    const loopLeft = (row, x) => {
      const half = halfWidth(row);
      if (!half) return x;

      while (x <= -half) x += half;
      while (x > 0) x -= half;

      return x;
    };

    const loopRight = (row, x) => {
      const half = halfWidth(row);
      if (!half) return x;

      while (x >= 0) x -= half;
      while (x < -half) x += half;

      return x;
    };

    const frame = now => {
      const dt = Math.min(now - last, 34) / 1000;
      last = now;

      if (!paused && visible) {
        x1 = loopLeft(row1, x1 - speed1 * dt);
        x2 = loopRight(row2, x2 + speed2 * dt);

        row1.style.transform = `translate3d(${x1}px,0,0)`;
        row2.style.transform = `translate3d(${x2}px,0,0)`;
      }

      raf = requestAnimationFrame(frame);
    };

    wrap.addEventListener('mouseenter', () => {
      paused = true;
    });

    wrap.addEventListener('mouseleave', () => {
      paused = false;
      last = performance.now();
    });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        visible = Boolean(entries[0]?.isIntersecting);
        last = performance.now();
      }, { threshold: 0.04 });

      io.observe(wrap);
    }

    let resizeTimer = 0;

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);

      resizeTimer = window.setTimeout(() => {
        x1 = loopLeft(row1, x1);
        x2 = loopRight(row2, x2);
        last = performance.now();
      }, 100);
    }, { passive:true });

    raf = requestAnimationFrame(frame);

    media.addEventListener?.('change', event => {
      if (!event.matches || !raf) return;

      cancelAnimationFrame(raf);
      raf = 0;
      row1.style.transform = '';
      row2.style.transform = '';
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();
