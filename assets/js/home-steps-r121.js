(() => {
  const BREAKPOINT = 835;
  const TRIGGER_ID = 'saaStepsR121';
  const SCROLL_DISTANCE = 1640;

  let timeline = null;
  let resizeTimer = 0;
  let bootTimer = null;
  let scene = null;

  /*
    R121 offset-only tune:
    let the sticky Steps canvas settle at the viewport top. The fixed header
    remains above it, while the section's existing 72px internal top gutter
    positions the heading at the approved visual pause point.
  */
  const getPinTop = () => 0;

  const ensureScene = section => {
    const parent = section.parentElement;

    if (
      parent &&
      parent.classList.contains('saa-steps-scroll-scene')
    ) {
      return parent;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'saa-steps-scroll-scene';

    section.parentNode.insertBefore(wrapper, section);
    wrapper.appendChild(section);

    return wrapper;
  };

  const unwrapScene = section => {
    const wrapper = section?.parentElement;

    if (
      !wrapper ||
      !wrapper.classList.contains('saa-steps-scroll-scene')
    ) return;

    wrapper.parentNode.insertBefore(section, wrapper);
    wrapper.remove();
  };

  const removeLegacyCaptions = section => {
    section
      ?.querySelectorAll('.saa-stack-caption')
      .forEach(caption => caption.remove());
  };

  const ensureOverlay = (cardWrap, cards) => {
    let overlay = cardWrap.querySelector(
      ':scope > .saa-r121-stack-overlay'
    );

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'saa-r121-stack-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      cardWrap.appendChild(overlay);
    }

    overlay.replaceChildren();

    cards.slice(0, 3).forEach((card, index) => {
      const item = document.createElement('div');
      item.className = 'saa-r121-stack-label';
      item.dataset.step = String(index + 1);
      item.style.setProperty('--saa-r121-label-opacity', '0');
      item.style.setProperty('--saa-r121-label-y', '-4px');

      const number = document.createElement('span');
      number.className = 'saa-r121-stack-number';
      number.dataset.number = String(index + 1).padStart(2, '0');
      number.textContent = number.dataset.number;

      const title = document.createElement('span');
      title.className = 'saa-r121-stack-title';

      const heading = card.querySelector('.comm-card-hdn');
      title.textContent = heading
        ? heading.textContent.trim()
        : `Step ${index + 1}`;

      item.append(number, title);
      overlay.appendChild(item);
    });

    return {
      overlay,
      items: Array.from(
        overlay.querySelectorAll(':scope > .saa-r121-stack-label')
      )
    };
  };

  const removeOverlay = section => {
    section
      ?.querySelector('.saa-r121-stack-overlay')
      ?.remove();
  };

  const killOwnTrigger = () => {
    if (typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.getAll()
      .filter(st => st.vars && st.vars.id === TRIGGER_ID)
      .forEach(st => st.kill(true));
  };

  const clearRuntime = section => {
    if (!section) return;

    const cards = Array.from(
      section.querySelectorAll('.steps-card-wrap > .steps-card')
    );

    const images = Array.from(
      section.querySelectorAll('.steps-img-wrap > .steps-img')
    );

    [...cards, ...images].forEach(el => {
      el.style.removeProperty('--saa-r121-shift');
      el.style.removeProperty('--saa-r116-shift');
    });

    cards.forEach(card => {
      card.style.removeProperty('--saa-r116-caption-opacity');
      card.style.removeProperty('--saa-r116-caption-y');
    });

    const cardWrap = section.querySelector('.steps-card-wrap');
    const imageWrap = section.querySelector('.steps-img-wrap');

    cardWrap?.style.removeProperty('--saa-r121-card-wrap-height');
    cardWrap?.style.removeProperty('--saa-r116-card-wrap-height');

    imageWrap?.style.removeProperty('--saa-r121-image-wrap-height');
    imageWrap?.style.removeProperty('--saa-r116-image-wrap-height');

    section.style.removeProperty('--saa-r121-pin-top');
    section.style.removeProperty('--saa-r121-section-pad');
    section.style.removeProperty('--saa-r116-pin-top');
    section.style.removeProperty('--saa-r116-section-pad');

    if (scene) {
      scene.style.removeProperty('height');
    }
  };

  const destroy = () => {
    if (timeline) {
      if (timeline.scrollTrigger) {
        timeline.scrollTrigger.kill(true);
      }

      timeline.kill();
      timeline = null;
    }

    killOwnTrigger();

    const section = document.querySelector('#main .steps-section');

    clearRuntime(section);
    removeOverlay(section);
    removeLegacyCaptions(section);

    if (section) {
      unwrapScene(section);
    }

    scene = null;

    document.documentElement.classList.remove('saa-r121-ready');
    document.documentElement.classList.remove('saa-r116-ready');
    document.documentElement.removeAttribute('data-saa-steps');
  };

  const build = () => {
    if (window.innerWidth < BREAKPOINT) {
      destroy();
      return;
    }

    if (
      typeof gsap === 'undefined' ||
      typeof ScrollTrigger === 'undefined'
    ) return;

    gsap.registerPlugin(ScrollTrigger);

    if (timeline) {
      if (timeline.scrollTrigger) timeline.scrollTrigger.kill(true);
      timeline.kill();
      timeline = null;
    }

    killOwnTrigger();

    const section = document.querySelector('#main .steps-section');
    if (!section) return;

    clearRuntime(section);
    removeLegacyCaptions(section);

    scene = ensureScene(section);

    const cardWrap = section.querySelector('.steps-card-wrap');
    const imageWrap = section.querySelector('.steps-img-wrap');

    if (!cardWrap || !imageWrap) return;

    const cards = Array.from(
      cardWrap.querySelectorAll(':scope > .steps-card')
    );

    const images = Array.from(
      imageWrap.querySelectorAll(':scope > .steps-img')
    );

    if (cards.length !== 4 || images.length !== 4) return;

    const stackOverlay = ensureOverlay(cardWrap, cards);
    const labels = stackOverlay.items;

    if (labels.length !== 3) return;

    document.documentElement.classList.remove('saa-r116-ready');
    document.documentElement.classList.add('saa-r121-ready');
    document.documentElement.setAttribute(
      'data-saa-steps',
      'r121-active'
    );

    const pinTop = getPinTop();

    section.style.setProperty(
      '--saa-r121-pin-top',
      `${pinTop}px`
    );

    requestAnimationFrame(() => {
      if (window.innerWidth < BREAKPOINT) {
        destroy();
        return;
      }

      const compact = 70;

      const cardWrapStart = cardWrap.getBoundingClientRect().height;
      const imageWrapStart = imageWrap.getBoundingClientRect().height;

      const cardRowStep =
        cards[1].offsetTop - cards[0].offsetTop;

      const imageRowStep =
        images[1].offsetTop - images[0].offsetTop;

      const cardOverlap = cardRowStep - compact;
      const imageOverlap = imageRowStep - compact;

      const getShift = (items, index) => {
        if (index === 0) return 0;

        const firstTop = items[0].offsetTop;
        const currentTop = items[index].offsetTop;
        const wantedTop = firstTop + (compact * index);

        return wantedTop - currentTop;
      };

      cardWrap.style.setProperty(
        '--saa-r121-card-wrap-height',
        `${cardWrapStart}px`
      );

      imageWrap.style.setProperty(
        '--saa-r121-image-wrap-height',
        `${imageWrapStart}px`
      );

      section.style.setProperty(
        '--saa-r121-section-pad',
        '82px'
      );

      cards.forEach(card => {
        card.style.setProperty('--saa-r121-shift', '0px');
      });

      images.forEach(image => {
        image.style.setProperty('--saa-r121-shift', '0px');
      });

      labels.forEach(label => {
        label.style.setProperty('--saa-r121-label-opacity', '0');
        label.style.setProperty('--saa-r121-label-y', '-4px');
      });

      /*
        R121 FINAL-HANDOFF GEOMETRY

        Measure both states before the timeline starts. The temporary final
        measurements are restored synchronously before the browser paints.
        This keeps the working visual sequence unchanged.
      */
      const fullSectionHeight =
        Math.ceil(section.getBoundingClientRect().height);

      const finalCardWrapHeight =
        cardWrapStart - (cardOverlap * 3);

      const finalImageWrapHeight =
        imageWrapStart - (imageOverlap * 3);

      cardWrap.style.setProperty(
        '--saa-r121-card-wrap-height',
        `${finalCardWrapHeight}px`
      );

      imageWrap.style.setProperty(
        '--saa-r121-image-wrap-height',
        `${finalImageWrapHeight}px`
      );

      section.style.setProperty(
        '--saa-r121-section-pad',
        '82px'
      );

      const finalSectionHeight =
        Math.ceil(section.getBoundingClientRect().height);

      /* Restore the untouched/full state before any frame is painted. */
      cardWrap.style.setProperty(
        '--saa-r121-card-wrap-height',
        `${cardWrapStart}px`
      );

      imageWrap.style.setProperty(
        '--saa-r121-image-wrap-height',
        `${imageWrapStart}px`
      );

      section.style.setProperty(
        '--saa-r121-section-pad',
        '82px'
      );

      /*
        Sticky release distance equals the ScrollTrigger distance at the FINAL
        compact height INCLUDING the established 82px bottom gutter.
        Reviews therefore follows immediately after that real gutter with
        no post-Step-4 dead-scroll runway.
      */
      scene.style.height =
        `${finalSectionHeight + SCROLL_DISTANCE}px`;

      timeline = gsap.timeline({
        defaults: {
          ease:'power2.inOut'
        },

        scrollTrigger: {
          id:TRIGGER_ID,
          trigger:scene,
          start:() => `top top+=${getPinTop()}`,
          end:`+=${SCROLL_DISTANCE}`,
          scrub:0.82,
          invalidateOnRefresh:false
        }
      });

      /* Initial untouched hold. */
      timeline.to({}, { duration:0.52 });

      /* STEP 1 -> compact. */
      timeline.to(cards[1], {
        '--saa-r121-shift':`${getShift(cards,1)}px`,
        duration:1
      });

      timeline.to(images[1], {
        '--saa-r121-shift':`${getShift(images,1)}px`,
        duration:1
      }, '<');

      timeline.to(cardWrap, {
        '--saa-r121-card-wrap-height':
          `${cardWrapStart - cardOverlap}px`,
        duration:1
      }, '<');

      timeline.to(imageWrap, {
        '--saa-r121-image-wrap-height':
          `${imageWrapStart - imageOverlap}px`,
        duration:1
      }, '<');

      timeline.to(labels[0], {
        '--saa-r121-label-opacity':1,
        '--saa-r121-label-y':'0px',
        duration:0.22,
        ease:'power1.out'
      }, '-=0.22');

      timeline.to({}, { duration:0.16 });

      /* STEP 2 -> compact. */
      timeline.to(cards[2], {
        '--saa-r121-shift':`${getShift(cards,2)}px`,
        duration:1
      });

      timeline.to(images[2], {
        '--saa-r121-shift':`${getShift(images,2)}px`,
        duration:1
      }, '<');

      timeline.to(cardWrap, {
        '--saa-r121-card-wrap-height':
          `${cardWrapStart - (cardOverlap * 2)}px`,
        duration:1
      }, '<');

      timeline.to(imageWrap, {
        '--saa-r121-image-wrap-height':
          `${imageWrapStart - (imageOverlap * 2)}px`,
        duration:1
      }, '<');

      timeline.to(labels[1], {
        '--saa-r121-label-opacity':1,
        '--saa-r121-label-y':'0px',
        duration:0.22,
        ease:'power1.out'
      }, '-=0.22');

      timeline.to({}, { duration:0.16 });

      /*
        STEP 3 -> compact.
        Step 4 and Image 4 move to the front but remain FULL.
      */
      timeline.to(cards[3], {
        '--saa-r121-shift':`${getShift(cards,3)}px`,
        duration:1
      });

      timeline.to(images[3], {
        '--saa-r121-shift':`${getShift(images,3)}px`,
        duration:1
      }, '<');

      timeline.to(cardWrap, {
        '--saa-r121-card-wrap-height':
          `${cardWrapStart - (cardOverlap * 3)}px`,
        duration:1
      }, '<');

      timeline.to(imageWrap, {
        '--saa-r121-image-wrap-height':
          `${imageWrapStart - (imageOverlap * 3)}px`,
        duration:1
      }, '<');

      /*
        R121: preserve the established 82px Steps bottom gutter.
        The gutter is already included in finalSectionHeight above, so it
        adds visual breathing room without adding any dead scroll runway.
      */

      timeline.to(labels[2], {
        '--saa-r121-label-opacity':1,
        '--saa-r121-label-y':'0px',
        duration:0.22,
        ease:'power1.out'
      }, '-=0.22');

      /* Final full Step 4 hold inside the animation. */
      timeline.to({}, { duration:0.72 });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  };

  const bootWhenReady = () => {
    let attempts = 0;

    const tryBoot = () => {
      attempts += 1;

      if (
        typeof gsap !== 'undefined' &&
        typeof ScrollTrigger !== 'undefined'
      ) {
        if (bootTimer) {
          clearInterval(bootTimer);
          bootTimer = null;
        }

        build();
        return;
      }

      if (attempts >= 200) {
        if (bootTimer) {
          clearInterval(bootTimer);
          bootTimer = null;
        }

        console.error(
          'SA Steps R121: GSAP/ScrollTrigger unavailable.'
        );
      }
    };

    tryBoot();

    if (
      typeof gsap === 'undefined' ||
      typeof ScrollTrigger === 'undefined'
    ) {
      bootTimer = window.setInterval(tryBoot, 50);
    }
  };

  let wasDesktop =
    window.innerWidth >= BREAKPOINT;

  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);

      resizeTimer = window.setTimeout(() => {
        const isDesktop =
          window.innerWidth >= BREAKPOINT;

        if (isDesktop !== wasDesktop) {
          wasDesktop = isDesktop;

          if (isDesktop) {
            bootWhenReady();
          } else {
            destroy();
          }

          return;
        }

        if (isDesktop) {
          build();
        }
      }, 180);
    },
    { passive:true }
  );

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      bootWhenReady,
      { once:true }
    );
  } else {
    bootWhenReady();
  }
})();
