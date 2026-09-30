/* ===== EXPERTS CERTIFICATIONS COLLAPSE R98 =====
   Same first-6 / Show All behavior as R93.
   New: clicking Show Less scrolls smoothly back to the top of #ex-certs.
*/
(() => {
  const init = () => {
    const section =
      document.querySelector('#ex-certs') ||
      document.querySelector('section.ex-certs');

    if (!section) return;

    const cards = Array.from(section.querySelectorAll('.cert-grid > .cert-card'));
    const button = section.querySelector('.saa-cert-toggle');
    const actions = section.querySelector('.saa-cert-actions');

    if (!button) return;

    if (cards.length <= 6) {
      if (actions) actions.hidden = true;
      return;
    }

    const setExpanded = (expanded) => {
      section.classList.toggle('saa-cert-expanded', expanded);
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');

      const label = button.querySelector('.saa-cert-toggle-label');
      if (label) {
        label.textContent = expanded ? 'Show Less' : 'Show All Certifications';
      }
    };

    const scrollBackToSectionTop = () => {
      const header =
        document.querySelector('header') ||
        document.querySelector('.site-header') ||
        document.querySelector('.header');

      const headerHeight = header
        ? Math.ceil(header.getBoundingClientRect().height)
        : 64;

      const y =
        section.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        14;

      window.scrollTo({
        top: Math.max(0, y),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth'
      });
    };

    setExpanded(false);

    button.addEventListener('click', () => {
      const willExpand = button.getAttribute('aria-expanded') !== 'true';

      setExpanded(willExpand);

      /* Only Show Less should move the viewport. */
      if (!willExpand) {
        requestAnimationFrame(() => {
          requestAnimationFrame(scrollBackToSectionTop);
        });
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();
