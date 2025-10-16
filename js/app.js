// -------- simple client-side includes --------
async function includePartials() {
    const nodes = document.querySelectorAll('[data-include]');
    await Promise.all(Array.from(nodes).map(async node => {
      const url = node.getAttribute('data-include');
      try {
        const res = await fetch(url); // ✅ можно кэшировать (убрали no-cache)
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        node.outerHTML = await res.text();
      } catch (e) {
        node.outerHTML = `<!-- include failed: ${url} -->`;
        console.error('Include error:', url, e);
      }
    }));
  }
  
  // -------- header (burger) --------
  function initHeader() {
    const navToggle = document.getElementById('navToggle');
    const topLinks  = document.getElementById('topLinks');
    if (!navToggle || !topLinks) return;
  
    navToggle.addEventListener('click', () => {
      const open = topLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  
    topLinks.addEventListener('click', (e) => {
      if (e.target.closest('a') && topLinks.classList.contains('is-open')) {
        topLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && topLinks.classList.contains('is-open')) {
        topLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  // -------- lightbox --------
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.lightbox__close');
  
    function openLightbox(src, alt='') {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      if (!lightbox || !lightboxImg) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }
  
    document.addEventListener('click', (e) => {
      const img = e.target.closest('img.zoomable');
      if (!img) return;
      openLightbox(img.dataset.full || img.src, img.alt || '');
    });
  
    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === closeBtn) closeLightbox();
    });
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox?.classList.contains('is-open')) closeLightbox();
    });
  }
  
  // -------- boot --------
  (async function boot() {
    // 1) подставляем partials
    await includePartials();
  
    // 2) инициализируем поведение уже после вставки хедера/футера
    initHeader();
    initLightbox();
  
    // 3️⃣ 👉 вставь сюда код префетча 👇
    // Prefetch страниц и partials, чтобы при переходах загружались из кэша
    ['./case-link.html', './case-ranking.html', '../partials/header.html', '../partials/footer.html']
      .forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      });
  
    // 4️⃣ (опционально) — регистрация Service Worker, если используешь
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  })();