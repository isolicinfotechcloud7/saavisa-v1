/* ===== EXPERTS CERTIFICATIONS COLLAPSE R90 ===== */
(() => {
  const init = () => {
    const section =
      document.querySelector('#ex-certs') ||
      document.querySelector('section.ex-certs') ||
      Array.from(document.querySelectorAll('section')).find((el) =>
        /professional certifications/i.test(el.textContent || '')
      );

    if (!section || section.dataset.saaCertR90 === '1') return;

    const cards = Array.from(section.querySelectorAll('.cert-card'));
    if (cards.length <= 6) {
      section.dataset.saaCertR90 = '1';
      return;
    }

    const grid = section.querySelector('.cert-grid') || cards[0].parentElement;
    if (!grid) return;

    cards.slice(6).forEach((card) => {
      card.classList.add('saa-cert-collapsed');
      card.setAttribute('aria-hidden', 'true');
    });

    const actions = document.createElement('div');
    actions.className = 'saa-cert-actions';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'saa-cert-toggle';
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = `
      <span>Show All Certifications</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    `;

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';

      cards.slice(6).forEach((card) => {
        card.classList.toggle('saa-cert-collapsed', expanded);
        card.setAttribute('aria-hidden', expanded ? 'true' : 'false');
      });

      button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      button.querySelector('span').textContent =
        expanded ? 'Show All Certifications' : 'Show Less';

      if (expanded) {
        section.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    });

    actions.appendChild(button);
    grid.insertAdjacentElement('afterend', actions);
    section.dataset.saaCertR90 = '1';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();
