(function () {
  var input = document.getElementById('searchInput');
  var btn = document.getElementById('searchBtn');
  var clearBtn = document.getElementById('searchClear');
  var countEl = document.getElementById('searchCount');
  var content = document.getElementById('content');
  if (!input || !content) return;

  function clearHits() {
    var marks = content.querySelectorAll('mark.search-hit');
    marks.forEach(function (m) {
      var parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
    countEl.textContent = '';
  }

  function doSearch() {
    clearHits();
    var q = input.value.trim();
    if (!q) return;
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || node.nodeValue.indexOf(q) === -1) return NodeFilter.FILTER_REJECT;
        var p = node.parentNode;
        if (!p || p.tagName === 'SCRIPT' || p.tagName === 'STYLE' || p.tagName === 'MARK') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    var total = 0;
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var frag = document.createDocumentFragment();
      var idx = 0, pos;
      while ((pos = text.indexOf(q, idx)) !== -1) {
        frag.appendChild(document.createTextNode(text.slice(idx, pos)));
        var mark = document.createElement('mark');
        mark.className = 'search-hit';
        mark.textContent = q;
        frag.appendChild(mark);
        idx = pos + q.length;
        total++;
      }
      frag.appendChild(document.createTextNode(text.slice(idx)));
      node.parentNode.replaceChild(frag, node);
    });
    countEl.textContent = total > 0 ? ('共 ' + total + ' 处') : '未找到';
    var first = content.querySelector('mark.search-hit');
    if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });
  clearBtn.addEventListener('click', function () { input.value = ''; clearHits(); input.focus(); });
})();
