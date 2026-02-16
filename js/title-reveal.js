(() => {
    const el = document.querySelector("[data-word-reveal]");
    if (!el) return;
  
    const spans = [];
  
    const wrapTextNode = (node) => {
      const text = node.nodeValue;
      if (!text || !text.trim()) return;
  
      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);
  
      parts.forEach((part) => {
        if (!part) return;
  
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement("span");
          span.className = "w";
          span.textContent = part;
          span.style.setProperty("--w", "0");
          spans.push(span);
          frag.appendChild(span);
        }
      });
  
      node.parentNode.replaceChild(frag, node);
    };
  
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(wrapTextNode);
  
    if (!spans.length) return;
  
    document.documentElement.classList.add("js");
  
    const clamp01 = (v) => Math.max(0, Math.min(1, v));
  
    // Настройки
    const revealWindow = 260;     // за сколько px скролла всё закрасится
    const secondWordStart = 0.22; // стартовая "чернота" 2-го слова
  
    let ticking = false;
  
    const update = () => {
      ticking = false;
  
      // Прогресс от скролла страницы (для hero это то, что надо)
      const p = clamp01((window.scrollY || 0) / revealWindow);
  
      const n = spans.length;
  
      for (let i = 0; i < n; i++) {
        if (i === 0) {
          spans[i].style.setProperty("--w", "1"); // 1-е слово всегда чёрное
          continue;
        }
  
        const a = i / n;
        const b = (i + 1) / n;
        const wp = clamp01((p - a) / (b - a));
  
        if (i === 1) {
          spans[i].style.setProperty("--w", String(Math.max(secondWordStart, wp)));
        } else {
          spans[i].style.setProperty("--w", wp.toFixed(4));
        }
      }
    };
  
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
  
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  
    update();
  })();