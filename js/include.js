(async function () {
  const nodes = Array.from(document.querySelectorAll('[data-include]'));
  if (!nodes.length) return;

  const stripLiveServer = (html) => {
    html = html.replace(/<!--\s*Code injected by live-server\s*-->[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<!--\s*Code injected\s*-->[\s\S]*?<\/script>/gi, '');
    return html;
  };

  for (const node of nodes) {
    const path = node.getAttribute('data-include');
    if (!path) continue;

    const url = new URL(path, window.location.href);

    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      let html = await res.text();
      html = stripLiveServer(html).trim();

      const tpl = document.createElement('template');
      tpl.innerHTML = html;

      // ✅ Надёжная вставка фрагмента
      const frag = tpl.content.cloneNode(true);
      node.after(frag);
      node.remove();
    } catch (e) {
      console.error('Include failed:', url.toString(), e);
    }
  }

  document.dispatchEvent(new CustomEvent('includes:loaded'));
})();