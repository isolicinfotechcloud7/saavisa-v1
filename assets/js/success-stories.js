
(function(){
  document.querySelectorAll('[data-success-browser]').forEach(function(browser){
    var cards=[].slice.call(browser.querySelectorAll('[data-success-card]'));
    var tabs=[].slice.call(browser.querySelectorAll('[data-success-filter]'));
    var search=browser.querySelector('[data-success-search]');
    var load=browser.querySelector('[data-success-load]');
    var empty=browser.querySelector('[data-success-empty]');
    var pageSize=parseInt(browser.getAttribute('data-page-size')||'18',10);
    var allowMore=browser.getAttribute('data-load-more')==='true';
    var filter=browser.getAttribute('data-default-filter')||'all';
    var limit=pageSize;
    function apply(){
      var q=(search&&search.value||'').trim().toLowerCase();
      var matched=cards.filter(function(c){return (filter==='all'||c.dataset.category===filter)&&(!q||(c.dataset.search||'').indexOf(q)!==-1);});
      cards.forEach(function(c){c.hidden=true;});
      matched.slice(0,allowMore?limit:matched.length).forEach(function(c){c.hidden=false;});
      if(empty) empty.hidden=matched.length!==0;
      if(load){load.hidden=!allowMore||matched.length<=limit;}
    }
    tabs.forEach(function(tab){tab.addEventListener('click',function(){
      filter=tab.dataset.successFilter;limit=pageSize;
      tabs.forEach(function(t){var on=t===tab;t.classList.toggle('is-active',on);t.setAttribute('aria-pressed',on?'true':'false');});
      apply();
    });});
    if(search) search.addEventListener('input',function(){limit=pageSize;apply();});
    if(load) load.addEventListener('click',function(){limit+=pageSize;apply();});
    apply();
  });
})();
