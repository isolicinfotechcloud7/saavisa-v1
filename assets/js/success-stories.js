(function () {
  var PER_PAGE = 12;
  var MINI_COUNT = 6;
  var COUNTRY_FLAGS = {
    Canada: '/assets/destinations/canada-flag.webp',
    USA: '/assets/destinations/usa-flag.webp',
    UK: '/assets/destinations/uk-flag.webp',
    Europe: '/assets/destinations/europe-flag.webp',
    Australia: '/assets/destinations/australia-flag.webp'
  };

  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  var list   = document.querySelector('.story-list');
  var items  = [].slice.call(document.querySelectorAll('.story'));
  var pager  = document.getElementById('pager');
  var nums   = document.getElementById('pgNums');
  var mini   = document.getElementById('miniList');
  var bar    = document.getElementById('filterBar');
  var chips  = document.getElementById('fbChips');
  var none   = document.getElementById('noResults');
  var search = document.getElementById('ssSearch');

  if (!list || !items.length || !pager || !nums) return;

  var KIND = { sv: 'Student Visa', wv: 'Spouse / Work Permit', vv: 'Visitor Visa' };
  var active = { type: '', value: '' };
  var view = items.slice();
  var page = 1;
  var io = null;

  if ('IntersectionObserver' in window && !reduce) {
    io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  }

  function countriesOf(el) {
    return (el.dataset.countries || el.dataset.country || '').split('|').filter(Boolean);
  }

  function tallyKind() {
    var m = {};
    items.forEach(function (el) {
      var v = el.dataset.kind;
      if (v) m[v] = (m[v] || 0) + 1;
    });
    return m;
  }

  function tallyCountries() {
    var m = {};
    items.forEach(function (el) {
      countriesOf(el).forEach(function (v) {
        m[v] = (m[v] || 0) + 1;
      });
    });
    return m;
  }

  function setSingleFilter(type, value) {
    if (active.type === type && active.value === value) {
      active = { type: '', value: '' };
    } else {
      active = { type: type, value: value };
    }
    if (search) search.value = '';
    apply(true);
  }

  function buildKindList(el) {
    if (!el) return;
    var map = tallyKind();
    el.innerHTML = '';
    Object.keys(map).sort(function (a,b) { return map[b] - map[a]; }).forEach(function (v) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'w-item';
      b.dataset.type = 'kind';
      b.dataset.val = v;
      b.innerHTML = '<span class="w-item-label"></span>';
      b.querySelector('.w-item-label').textContent = KIND[v] || v;
      b.addEventListener('click', function () { setSingleFilter('kind', v); });
      li.appendChild(b);
      el.appendChild(li);
    });
  }

  function buildCountryList(el) {
    if (!el) return;
    var map = tallyCountries();
    var order = ['Canada','USA','UK','Europe','Australia'];
    el.innerHTML = '';
    Object.keys(map).sort(function (a,b) {
      var ai = order.indexOf(a), bi = order.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      return a.localeCompare(b);
    }).forEach(function (v) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'w-item w-country-item';
      b.dataset.type = 'country';
      b.dataset.val = v;

      var label = document.createElement('span');
      label.className = 'w-item-label w-country-label';
      var flagSrc = COUNTRY_FLAGS[v];
      if (flagSrc) {
        var img = document.createElement('img');
        img.className = 'w-country-flag';
        img.src = flagSrc;
        img.alt = v + ' flag';
        img.width = 24;
        img.height = 24;
        img.loading = 'lazy';
        img.decoding = 'async';
        label.appendChild(img);
      }
      var t = document.createElement('span');
      t.textContent = v;
      label.appendChild(t);
      b.appendChild(label);
      b.addEventListener('click', function () { setSingleFilter('country', v); });
      li.appendChild(b);
      el.appendChild(li);
    });
  }

  buildKindList(document.getElementById('wKinds'));
  buildCountryList(document.getElementById('wCountries'));

  (function buildTags() {
    var wrap = document.getElementById('wTags');
    if (!wrap) return;
    var counts = {};
    items.forEach(function (el) {
      var d = el.dataset.dest;
      if (d) counts[d] = (counts[d] || 0) + 1;
    });
    Object.keys(counts)
      .sort(function (a,b) { return counts[b] - counts[a] || a.localeCompare(b); })
      .slice(0,18)
      .forEach(function (d) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'w-tag';
        b.textContent = d;
        b.dataset.type = 'dest';
        b.dataset.val = d;
        b.addEventListener('click', function () { setSingleFilter('dest', d); });
        wrap.appendChild(b);
      });
  })();

  function matches(el) {
    if (!active.type) return true;
    if (active.type === 'kind') return el.dataset.kind === active.value;
    if (active.type === 'country') return countriesOf(el).indexOf(active.value) !== -1;
    if (active.type === 'dest') return el.dataset.dest === active.value;
    if (active.type === 'search') return (el.dataset.search || '').indexOf(active.value.toLowerCase()) !== -1;
    return true;
  }

  function activeLabel() {
    if (!active.type) return '';
    if (active.type === 'kind') return KIND[active.value] || active.value;
    if (active.type === 'search') return '“' + active.value + '”';
    return active.value;
  }

  function apply(reset) {
    view = items.filter(matches);
    if (reset) page = 1;

    document.querySelectorAll('.w-item, .w-tag').forEach(function (b) {
      b.classList.toggle('is-on', active.type === b.dataset.type && active.value === b.dataset.val);
    });

    if (chips) {
      chips.innerHTML = '';
      if (active.type) {
        var c = document.createElement('button');
        c.type = 'button';
        c.className = 'fb-chip';
        c.innerHTML = '<span></span>&times;';
        c.querySelector('span').textContent = activeLabel();
        c.addEventListener('click', clearAll);
        chips.appendChild(c);
      }
    }
    if (bar) bar.hidden = !active.type;
    render(false);
  }

  function clearAll() {
    active = { type: '', value: '' };
    if (search) search.value = '';
    apply(true);
  }

  var fbClear = document.getElementById('fbClear');
  if (fbClear) fbClear.addEventListener('click', clearAll);
  if (none) {
    var clearBtn = none.querySelector('[data-clear]');
    if (clearBtn) clearBtn.addEventListener('click', clearAll);
  }

  if (search) {
    var timer;
    search.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var q = search.value.trim();
        active = q ? { type: 'search', value: q } : { type: '', value: '' };
        apply(true);
      }, 200);
    });
    var searchBtn = document.getElementById('ssSearchBtn');
    if (searchBtn) searchBtn.addEventListener('click', function () {
      var q = search.value.trim();
      active = q ? { type: 'search', value: q } : { type: '', value: '' };
      apply(true);
    });
  }

  function numberList(pages) {
    var out = [], i;
    for (i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 1) out.push(i);
      else if (out[out.length - 1] !== '…') out.push('…');
    }
    return out;
  }

  function render(scroll) {
    var pages = Math.max(1, Math.ceil(view.length / PER_PAGE));
    if (page > pages) page = pages;
    var start = (page - 1) * PER_PAGE, end = start + PER_PAGE;

    items.forEach(function (el) { el.setAttribute('hidden', ''); });
    view.slice(start, end).forEach(function (el) {
      el.removeAttribute('hidden');
      if (io && !el.classList.contains('in')) io.observe(el);
      else if (!io) el.classList.add('in');
    });

    if (none) none.hidden = view.length > 0;
    list.hidden = view.length === 0;

    nums.innerHTML = '';
    numberList(pages).forEach(function (n) {
      if (n === '…') {
        var s = document.createElement('span');
        s.className = 'pg-gap';
        s.textContent = '…';
        nums.appendChild(s);
        return;
      }
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pg-btn' + (n === page ? ' is-current' : '');
      b.textContent = n;
      b.setAttribute('aria-label', 'Page ' + n);
      if (n === page) b.setAttribute('aria-current', 'page');
      b.addEventListener('click', function () { go(n); });
      nums.appendChild(b);
    });

    var first = pager.querySelector('[data-go=first]');
    var prev  = pager.querySelector('[data-go=prev]');
    var next  = pager.querySelector('[data-go=next]');
    var last  = pager.querySelector('[data-go=last]');
    if (first) first.disabled = page === 1;
    if (prev) prev.disabled = page === 1;
    if (next) next.disabled = page === pages;
    if (last) last.disabled = page === pages;
    pager.hidden = pages < 2;

    renderMini(start, end);
    if (scroll) {
      var top = list.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  function go(n) {
    var pages = Math.max(1, Math.ceil(view.length / PER_PAGE));
    page = Math.min(Math.max(1, n), pages);
    history.replaceState(null, '', page === 1 ? location.pathname + location.search : '#page-' + page);
    render(true);
  }

  pager.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]');
    if (!b || b.disabled) return;
    var pages = Math.max(1, Math.ceil(view.length / PER_PAGE)), g = b.dataset.go;
    go(g === 'first' ? 1 : g === 'last' ? pages : g === 'prev' ? page - 1 : page + 1);
  });

  function renderMini(start, end) {
    if (!mini) return;
    var onPage = view.slice(start, end);
    var pool = items.filter(function (el) { return onPage.indexOf(el) === -1; });
    var wrap = document.getElementById('wMoreWrap');
    mini.innerHTML = '';
    if (!pool.length) {
      if (wrap) wrap.hidden = true;
      return;
    }
    if (wrap) wrap.hidden = false;

    var step = Math.max(1, Math.floor(pool.length / MINI_COUNT));
    for (var k = 0, n = 0; k < pool.length && n < MINI_COUNT; k += step, n++) {
      (function (src) {
        var img  = src.querySelector('.story-media > img');
        var name = src.querySelector('h3').textContent;
        var dest = src.dataset.dest;
        var ie   = src.querySelector('.st-ielts strong');
        var parts = name.split(/\s+/);
        var firstName = parts.slice(0, parts[0].replace('.', '').length <= 2 ? 3 : 1).join(' ');
        var tail = src.dataset.kind === 'sv'
          ? (ie ? ' got IELTS ' + ie.textContent + ' and was admitted to ' + dest : ' was admitted to ' + dest)
          : src.dataset.kind === 'wv'
            ? ' received an Open Work Permit'
            : ' was granted a visitor visa';

        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'mini';
        var thumb = img
          ? '<img src="' + img.getAttribute('src') + '" alt="" loading="lazy" decoding="async">'
          : '<span class="mini-placeholder"></span>';
        b.innerHTML = thumb + '<span class="mini-txt"><span class="mini-line"><strong></strong><span class="mini-tail"></span></span></span>';
        b.querySelector('.mini-line strong').textContent = firstName;
        b.querySelector('.mini-tail').textContent = tail;
        b.title = firstName + tail;
        b.addEventListener('click', function () { jumpTo(src); });
        mini.appendChild(b);
      })(pool[k]);
    }
  }

  function jumpTo(el) {
    active = { type: '', value: '' };
    if (search) search.value = '';
    view = items.slice();
    page = Math.floor(view.indexOf(el) / PER_PAGE) + 1;
    history.replaceState(null, '', page === 1 ? location.pathname + location.search : '#page-' + page);
    render(false);
    var top = el.getBoundingClientRect().top + window.pageYOffset - 110;
    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    el.classList.add('in');
    el.classList.remove('is-flash');
    void el.offsetWidth;
    el.classList.add('is-flash');
  }

  var fromHash = parseInt((location.hash.match(/^#page-(\d+)$/) || [])[1], 10);
  if (fromHash) page = Math.max(1, fromHash);
  apply(false);
})();

/* ===== SUCCESS STORY IMAGE FALLBACK V1 START ===== */
(function () {
  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'SA';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function categoryLabel(kind) {
    if (kind === 'wv') return 'Spouse / Work Permit';
    if (kind === 'vv') return 'Visitor Visa';
    return 'Student Visa';
  }

  function ensureStoryFallback(story) {
    if (!story) return;
    var media = story.querySelector('.story-media');
    if (!media || media.dataset.fallbackReady === '1') return;
    media.dataset.fallbackReady = '1';

    var heading = story.querySelector('h3');
    var name = heading ? heading.textContent.trim() : 'Success Story';
    var country = (story.dataset.country || '').trim();
    var kind = categoryLabel(story.dataset.kind || '');

    /* Remove the old bare initials placeholder if this record has no image. */
    var old = media.querySelector('.story-placeholder');
    if (old) old.remove();

    var fallback = document.createElement('span');
    fallback.className = 'story-fallback';
    fallback.setAttribute('aria-hidden', 'true');

    var mark = document.createElement('span');
    mark.className = 'story-fallback-mark';
    mark.textContent = initials(name);

    var nm = document.createElement('span');
    nm.className = 'story-fallback-name';
    nm.textContent = name;

    var meta = document.createElement('span');
    meta.className = 'story-fallback-meta';
    meta.textContent = [country, kind].filter(Boolean).join(' · ') || 'SA Associates';

    fallback.appendChild(mark);
    fallback.appendChild(nm);
    fallback.appendChild(meta);
    media.insertBefore(fallback, media.firstChild);

    var img = media.querySelector(':scope > img');
    if (!img) {
      media.classList.add('is-missing');
      return;
    }

    function failed() {
      img.classList.add('is-broken');
      media.classList.add('is-missing');
      media.classList.remove('has-image');
    }
    function loaded() {
      if (img.naturalWidth > 0) {
        img.classList.remove('is-broken');
        media.classList.add('has-image');
        media.classList.remove('is-missing');
      } else {
        failed();
      }
    }

    img.addEventListener('error', failed, { once:true });
    img.addEventListener('load', loaded, { once:true });
    if (img.complete) {
      if (img.naturalWidth > 0) loaded(); else failed();
    }
  }

  document.querySelectorAll('.story').forEach(ensureStoryFallback);

  function ensureMiniFallback(mini) {
    if (!mini || mini.dataset.fallbackReady === '1') return;
    mini.dataset.fallbackReady = '1';

    var strong = mini.querySelector('.mini-line strong');
    var name = strong ? strong.textContent.trim() : 'SA';
    var img = mini.querySelector(':scope > img');
    var placeholder = mini.querySelector(':scope > .mini-placeholder');

    if (placeholder) {
      placeholder.textContent = initials(name);
      return;
    }
    if (!img) return;

    var thumb = document.createElement('span');
    thumb.className = 'mini-thumb';
    var fb = document.createElement('span');
    fb.className = 'mini-fallback';
    fb.setAttribute('aria-hidden', 'true');
    fb.textContent = initials(name);

    mini.insertBefore(thumb, img);
    thumb.appendChild(fb);
    thumb.appendChild(img);

    function failed() { img.classList.add('is-broken'); }
    function loaded() {
      if (img.naturalWidth > 0) img.classList.remove('is-broken');
      else failed();
    }
    img.addEventListener('error', failed, { once:true });
    img.addEventListener('load', loaded, { once:true });
    if (img.complete) {
      if (img.naturalWidth > 0) loaded(); else failed();
    }
  }

  var miniList = document.getElementById('miniList');
  function scanMini() {
    if (!miniList) return;
    miniList.querySelectorAll('.mini').forEach(ensureMiniFallback);
  }
  scanMini();

  if (miniList && 'MutationObserver' in window) {
    new MutationObserver(scanMini).observe(miniList, { childList:true, subtree:false });
  }
})();
/* ===== SUCCESS STORY IMAGE FALLBACK V1 END ===== */

/* ===== SUCCESS FILTER SCROLL V1 START ===== */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resultsSectionTop() {
    var intro = document.querySelector('.saa-success-page .ss-head--intro');
    if (intro) return intro;

    var list = document.querySelector('.saa-success-page .story-list');
    if (list) return list.closest('section') || list;

    return document.querySelector('.saa-success-page main') || document.querySelector('.saa-success-page');
  }

  function scrollBackToResults() {
    var target = resultsSectionTop();
    if (!target) return;
    var header = document.querySelector('header, .site-header, .main-header');
    var offset = header ? Math.min(Math.max(header.getBoundingClientRect().height, 68), 110) : 86;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset - 18;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
  }

  document.addEventListener('click', function (event) {
    var control = event.target.closest(
      '.saa-success-page .w-item, ' +
      '.saa-success-page .w-tag, ' +
      '.saa-success-page .fb-chip, ' +
      '.saa-success-page #fbClear, ' +
      '.saa-success-page [data-clear]'
    );
    if (!control) return;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(scrollBackToResults);
    });
  });
})();
/* ===== SUCCESS FILTER SCROLL V1 END ===== */
