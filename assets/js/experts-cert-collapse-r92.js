/* ===== EXPERTS CERTIFICATIONS COLLAPSE R92 ===== */
(() => {
  const init = () => {
    const section =
      document.querySelector('#ex-certs') ||
      document.querySelector('section.ex-certs');

    if (!section) return;

    const cards = Array.from(section.querySelectorAll('.cert-grid > .cert-card'));
    const button = section.querySelector('.saa-cert-toggle');

    if (!button) return;

    if (cards.length <= 6) {
      const actions = button.closest('.saa-cert-actions');
      if (actions) actions.hidden = true;
      return;
    }

    const sync = (expanded) => {
      section.classList.toggle('saa-cert-expanded', expanded);
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');

      const label = button.querySelector('.saa-cert-toggle-label');
      if (label) {
        label.textContent = expanded ? 'Show Less' : 'Show All Certifications';
      }
    };

    sync(false);

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      sync(!expanded);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();
