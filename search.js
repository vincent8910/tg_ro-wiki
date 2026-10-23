// 玩家資料站的小工具（規格：docs/specs/wiki-site.md）。沒有外部框架；沒有 JS 時頁面仍可閱讀。
(function(){
  // 1. 手機卡片版：把表頭文字複製到每一格的 data-label（不寫進 HTML，避免道具總表多出數百 KB）
  // 清單表格（table.list）才改卡片；兩欄資料表（table.kv）維持原樣。沒有 JS 時不加 cards，退回橫向捲動。
  document.querySelectorAll('.tw>table.list').forEach(function(t){
    var heads=Array.from(t.querySelectorAll('thead th')).map(function(th){return th.textContent.trim();});
    t.querySelectorAll('tbody tr').forEach(function(tr){
      Array.from(tr.children).forEach(function(td,i){td.setAttribute('data-label',heads[i]||'');});
    });
    t.parentNode.classList.add('cards');
  });

  // 2. 搜尋與篩選：搜尋字比對整列文字＋data-k（英文代號等看不到的關鍵字）
  document.querySelectorAll('input.search').forEach(function(box){
    var table=document.getElementById(box.dataset.target);if(!table)return;
    var rows=Array.from(table.querySelectorAll('tbody tr'));
    var keys=rows.map(function(tr){return ((tr.dataset.k||'')+' '+tr.textContent).toLowerCase();});
    var filters=Array.from(document.querySelectorAll('select.filter')).filter(function(f){return f.dataset.target===table.id;});
    var count=document.querySelector('.count[data-target="'+table.id+'"]');
    function apply(){
      var q=box.value.trim().toLowerCase(),shown=0;
      rows.forEach(function(tr,i){
        var ok=(!q||keys[i].indexOf(q)>=0)&&filters.every(function(f){
          return !f.value||(tr.dataset[f.dataset.column]||'').split('、').indexOf(f.value)>=0;
        });
        tr.style.display=ok?'':'none';if(ok)shown++;
      });
      if(count)count.textContent='顯示 '+shown+'／'+rows.length+' 筆';
    }
    var kindFilter=filters.find(function(f){return f.dataset.column==='kind';});
  var weaponFilter=filters.find(function(f){return f.dataset.column==='weapon';});
  box.addEventListener('input',apply);
  filters.forEach(function(f){f.addEventListener('change',function(){
   // 先協調分類再篩選，避免選了單手劍卻被「防具」條件擋住。
   if(kindFilter&&weaponFilter){
    if(f===weaponFilter&&weaponFilter.value)kindFilter.value='武器';
    if(f===kindFilter&&kindFilter.value!=='武器')weaponFilter.value='';
   }
   apply();
  });});
    // 網址帶 ?q= 時直接搜尋（例如首頁卡片連到「道具 → 卡片」）
    var m=location.search.match(/[?&]q=([^&]*)/);if(m){box.value=decodeURIComponent(m[1]);}
    var k=location.search.match(/[?&]kind=([^&]*)/);
    if(k){filters.forEach(function(f){if(f.dataset.column==='kind')f.value=decodeURIComponent(k[1]);});}
    apply();
  });

  // 3. 可排序表格：點表頭排序，數字欄依數值
  document.querySelectorAll('table.sortable').forEach(function(t){
    t.querySelectorAll('thead th').forEach(function(th,i){
      var asc=true;
      th.addEventListener('click',function(){
        var body=t.tBodies[0],list=Array.from(body.rows);
        var val=function(tr){var s=tr.children[i]?tr.children[i].textContent.trim():'';var n=parseFloat(s.replace(/[^0-9.\-]/g,''));return /^[-\d.,%z ]+$/.test(s)&&!isNaN(n)?n:s;};
        list.sort(function(a,b){var x=val(a),y=val(b);var r=(typeof x==='number'&&typeof y==='number')?x-y:String(x).localeCompare(String(y),'zh-Hant');return asc?r:-r;});
        asc=!asc;list.forEach(function(tr){body.appendChild(tr);});
      });
    });
  });
})();
