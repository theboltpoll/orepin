// app.js — портфолио
// Вставка html-парциалов по атрибуту data-include
(function includePartials(){
  const nodes = document.querySelectorAll('[data-include]');
  nodes.forEach(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.statusText);
      el.outerHTML = await res.text();
    } catch (e) {
      console.warn('Не удалось подключить partial:', url, e);
    }
  });
})();

// Лайтбокс для изображений кейсов
(function lightbox(){
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const img = lb.querySelector('#lightboxImg');
  const closeBtn = lb.querySelector('.lightbox__close');

  const open = (src, alt='') => {
    img.src = src; img.alt = alt || '';
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lb.setAttribute('aria-hidden','true');
    img.src = '';
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (e) => {
    const target = e.target;
    // открываем по клику на изображения в .media img
    if (target.matches('.media img')) {
      e.preventDefault();
      open(target.src, target.alt || '');
    }
  });

  closeBtn && closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();