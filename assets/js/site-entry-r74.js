/* ===== SAAVISA UNIVERSAL ENTRY TRANSITION R74 ===== */
(() => {
  const init = () => {
    const main = document.querySelector('#main') || document.querySelector('main');
    if (!main) return;

    const reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targets = Array.from(main.children).filter((el) => {
      if (!(el.matches('section') || el.matches('.comm-section.steps-section'))) return false;
      if (el.matches('.hero, .saa-inner-hero, .contact-hero, .country-hero, .page-hero')) return false;
      if (el.matches('#google-reviews, .google-reviews-section')) return false;
      if (el.matches('.review-modal-overlay, [role="dialog"]')) return false;
      return true;
    });

    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => {
        el.classList.add('saa-entry-reveal', 'saa-entry-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('saa-entry-visible');
          obs.unobserve(entry.target);
          window.setTimeout(() => {
            entry.target.style.willChange = 'auto';
          }, 900);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
    );

    targets.forEach((el) => {
      if (el.dataset.saaEntryR74 === '1') return;
      el.dataset.saaEntryR74 = '1';
      el.classList.add('saa-entry-reveal');
      observer.observe(el);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
