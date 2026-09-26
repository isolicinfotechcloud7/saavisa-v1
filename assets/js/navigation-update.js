/* Shared Study Abroad navigation interaction; existing site functionality is unchanged. */
(()=>{'use strict';
  const desktop=document.querySelector('[data-saa-study]');
  const desktopBtn=desktop?.querySelector('.saa-study-toggle');
  const mobileBtn=document.querySelector('.saa-mobile-study-toggle');
  const mobileLinks=document.getElementById('saa-mobile-study-links');
  let hoverOpened=false;
  let closeTimer=null;
  const finePointer=()=>window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  function cancelClose(){if(closeTimer!==null){window.clearTimeout(closeTimer);closeTimer=null;}}
  function setDesktop(open){if(!desktop || !desktopBtn)return;cancelClose();desktop.classList.toggle('is-open',open);desktopBtn.setAttribute('aria-expanded',String(open));}
  function scheduleClose(){cancelClose();closeTimer=window.setTimeout(()=>{closeTimer=null;hoverOpened=false;if(!desktop.contains(document.activeElement))setDesktop(false);},220);}
  desktopBtn?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();
    // Do not dismiss an already hover-open popover on the first click of its trigger.
    if(hoverOpened){hoverOpened=false;setDesktop(true);}else{setDesktop(!desktop.classList.contains('is-open'));}
  });
  desktop?.addEventListener('mouseenter',()=>{cancelClose();if(finePointer()){hoverOpened=true;setDesktop(true);}});
  desktop?.addEventListener('mouseleave',()=>{if(finePointer())scheduleClose();});
  // Covers diagonal entry/re-entry and keeps the menu open while its links receive focus.
  desktop?.querySelector('.saa-study-popover')?.addEventListener('mouseenter',cancelClose);
  desktop?.addEventListener('focusin',e=>{cancelClose();if(e.target!==desktopBtn)setDesktop(true);});
  desktop?.addEventListener('focusout',e=>{if(!desktop.contains(e.relatedTarget)){hoverOpened=false;setDesktop(false);}});
  document.addEventListener('pointerdown',e=>{if(desktop&&!desktop.contains(e.target)){hoverOpened=false;setDesktop(false);}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){hoverOpened=false;setDesktop(false);if(desktop.contains(document.activeElement))desktopBtn?.focus();}});
  if(location.pathname.startsWith('/countries/'))desktop?.classList.add('is-current');
  mobileBtn?.addEventListener('click',()=>{const open=mobileBtn.getAttribute('aria-expanded')!=='true';mobileBtn.setAttribute('aria-expanded',String(open));mobileLinks.hidden=!open});
  // Keep mobile submenu reset after drawer closes, including backdrop/Escape.
  const drawer=document.querySelector('[data-mobile-drawer]');
  if(drawer){new MutationObserver(()=>{drawer.setAttribute('aria-hidden',String(!drawer.classList.contains('open')));const burger=document.querySelector('[data-mobile-open]');burger?.setAttribute('aria-expanded',String(drawer.classList.contains('open')));if(!drawer.classList.contains('open')&&mobileBtn){mobileBtn.setAttribute('aria-expanded','false');if(mobileLinks)mobileLinks.hidden=true;}}).observe(drawer,{attributes:true,attributeFilter:['class']});
  drawer.setAttribute('aria-hidden',String(!drawer.classList.contains('open')));
  document.querySelector('[data-mobile-open]')?.setAttribute('aria-expanded',String(drawer.classList.contains('open')));
  }
})();
