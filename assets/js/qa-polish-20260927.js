/* SA Associates QA behavior patch — 2026-09-27 */
(function(){
  'use strict';

  /* Any horizontally scrollable tab strip should keep its newly selected tab visible. */
  document.addEventListener('click', function(e){
    var tab=e.target.closest('.sa-faq-tab,.gtab,.map-tab-btn,.tabs-nav .tab-btn,[role="tab"]');
    if(!tab) return;
    var strip=tab.closest('.sa-faq-tabs,.gtab-strip,.map-tabs-nav,.tabs-nav,[role="tablist"]');
    if(!strip) return;
    requestAnimationFrame(function(){
      var left=tab.offsetLeft-(strip.clientWidth-tab.offsetWidth)/2;
      if(typeof strip.scrollTo==='function') strip.scrollTo({left:Math.max(0,left),behavior:'smooth'});
      else tab.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    });
  });

  /* Mobile Google reviews: arrows are hidden by CSS; expose compact dots and keep swipe as primary navigation. */
  function initReviewDots(){
    if(!matchMedia('(max-width:720px)').matches) return;
    var track=document.querySelector('.reviews-track');
    var carousel=document.querySelector('.reviews-carousel');
    var cards=track ? Array.prototype.slice.call(track.querySelectorAll('.review-card')) : [];
    if(!track || !carousel || !cards.length || carousel.querySelector('.reviews-mobile-dots')) return;
    var wrap=document.createElement('div');wrap.className='reviews-mobile-dots';wrap.setAttribute('aria-label','Review slides');
    cards.forEach(function(card,i){
      var dot=document.createElement('button');dot.type='button';dot.className='reviews-mobile-dot'+(i===0?' is-active':'');dot.setAttribute('aria-label','Go to review '+(i+1));
      dot.addEventListener('click',function(){
        var current=getIndex(); var delta=i-current; var btn=delta>0?document.querySelector('.reviews-next'):document.querySelector('.reviews-prev');
        for(var n=0;n<Math.abs(delta);n++) if(btn) btn.click();
      });
      wrap.appendChild(dot);
    });
    carousel.appendChild(wrap);
    function getIndex(){
      var tr=track.style.transform||''; var m=tr.match(/translateX\((-?[\d.]+)px\)/); if(!m)return 0;
      var cardW=cards[0].getBoundingClientRect().width; var gap=parseFloat(getComputedStyle(track).gap)||0; return Math.max(0,Math.min(cards.length-1,Math.round(Math.abs(parseFloat(m[1]))/(cardW+gap))));
    }
    function sync(){var i=getIndex();wrap.querySelectorAll('.reviews-mobile-dot').forEach(function(d,n){d.classList.toggle('is-active',n===i);});}
    new MutationObserver(sync).observe(track,{attributes:true,attributeFilter:['style']});
    addEventListener('resize',sync,{passive:true}); sync();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initReviewDots); else initReviewDots();
})();
