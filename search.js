document.querySelectorAll('input.search').forEach(function(box){
  var table=document.getElementById(box.dataset.target);if(!table)return;
  box.addEventListener('input',function(){var q=box.value.trim().toLowerCase();
    table.querySelectorAll('tbody tr').forEach(function(tr){tr.style.display=(!q||tr.dataset.k.indexOf(q)>=0)?'':'none';});});
});
