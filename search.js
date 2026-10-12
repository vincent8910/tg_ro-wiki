document.querySelectorAll('input.search').forEach(function(box){
  var table=document.getElementById(box.dataset.target);if(!table)return;
  var filters=Array.from(document.querySelectorAll('select.filter')).filter(function(f){return f.dataset.target===table.id;});
  function apply(){var q=box.value.trim().toLowerCase();
    table.querySelectorAll('tbody tr').forEach(function(tr){
      var matches=(!q||tr.dataset.k.indexOf(q)>=0)&&filters.every(function(f){
        return !f.value||(tr.dataset[f.dataset.column]||'').split('、').indexOf(f.value)>=0;
      });tr.style.display=matches?'':'none';
    });
  }
  box.addEventListener('input',apply);filters.forEach(function(f){f.addEventListener('change',apply);});
});
