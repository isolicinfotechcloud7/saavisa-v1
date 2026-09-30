/* ===== SAAVISA UNIVERSAL FOREGROUND ENTRY TRANSITION R79 ===== */
(() => {
  const init = () => {
    const main = document.querySelector('#main') || document.querySelector('main');
    if (!main) return;

    const reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sectionShells = Array.from(main.children).filter((el) => {
      if (!(el.matches('section') || el.matches('.comm-section.steps-section'))) return false;

      if (el.matches(
        '.hero, .saa-inner-hero, .contact-hero, .country-hero, .page-hero'
      )) return false;

      if (el.matches('#google-reviews, .google-reviews-section')) return false;
      if (el.matches('.review-modal-overlay, [role="dialog"]')) return false;

      return true;
    });

    if (!sectionShells.length) return;

    sectionShells.forEach((section) => {
      section.classList.remove('saa-entry-reveal', 'saa-entry-visible');
      section.style.opacity = '';
      section.style.transform = '';
      section.style.transition = '';
      section.style.willChange = '';
    });

    const foregroundTargets = [];

    sectionShells.forEach((section) => {
      const directContainers = Array.from(section.children).filter((child) =>
        child.matches('.container')
      );

      if (directContainers.length) {
        foregroundTargets.push(...directContainers);
        return;
      }

      const children = Array.from(section.children).filter((child) => {
        return !child.matches(
          'style, script, picture, .section-bg, .background, .bg, .decor, .decoration, .shape, .pattern, .overlay'
        );
      });

      foregroundTargets.push(...children);
    });

    const uniqueTargets = [...new Set(foregroundTargets)];

    if (reduceMotion || !('IntersectionObserver' in window)) {
      uniqueTargets.forEach((el) => {
        el.classList.add('saa-entry-foreground', 'saa-entry-visible');
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
      {
        threshold: 0.08,
        rootMargin: '0px 0px -9% 0px'
      }
    );

    uniqueTargets.forEach((el) => {
      if (el.dataset.saaEntryR79 === '1') return;

      [...el.attributes].forEach((attr) => {
        if (attr.name === 'data-aos' || attr.name.startsWith('data-aos-')) {
          el.removeAttribute(attr.name);
        }
      });

      el.dataset.saaEntryR79 = '1';
      el.classList.add('saa-entry-foreground');
      observer.observe(el);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
