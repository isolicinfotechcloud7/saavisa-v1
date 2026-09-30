/* ===== EXPERTS CERTIFICATIONS COLLAPSE R93 ===== */
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

    setExpanded(false);

    button.addEventListener('click', () => {
      setExpanded(button.getAttribute('aria-expanded') !== 'true');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();
