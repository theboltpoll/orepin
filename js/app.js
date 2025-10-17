// app.js — портфолио

// --- Utilities ---
const once = (fn) => {
  let ran = false;
  return (...args) => {
    if (ran) return;
    ran = true;
    fn(...args);
  };
};

// --- Partials loader: wait for all inserts, then fire an event ---
(async function includePartials() {
  const nodes = Array.from(document.querySelectorAll('[data-include]'));
  if (!nodes.length) {
    // nothing to include — still notify that UI can init
    document.dispatchEvent(new CustomEvent('partials:ready'));
    return;
  }

  const jobs = nodes.map(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.statusText);
      const html = await res.text();
      el.outerHTML = html;
    } catch (e) {
      console.warn('Не удалось подключить partial:', url, e);
    }
  });

  try {
    await Promise.all(jobs);
  } finally {
    // Сообщаем, что все partials вставлены в DOM
    document.dispatchEvent(new CustomEvent('partials:ready'));
  }
})();

// --- Lightbox (idempotent init) ---
const initLightbox = once(function lightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const img = lb.querySelector('#lightboxImg');
  const closeBtn = lb.querySelector('.lightbox__close');

  const open = (src, alt = '') => {
    img.src = src;
    img.alt = alt || '';
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    img.src = '';
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.matches('.media img')) {
      e.preventDefault();
      open(target.src, target.alt || '');
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
});

// --- Mobile menu (idempotent init) ---
const initMobileMenu = once(function mobileMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.toplinks');
  if (!burger || !menu) return;

  const openMenu = () => {
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const toggleMenu = () => (menu.classList.contains('is-open') ? closeMenu() : openMenu());

  burger.setAttribute('aria-controls', menu.id || 'toplinks');
  burger.setAttribute('aria-expanded', 'false');
  burger.addEventListener('click', toggleMenu);

  // Закрывать по клику на пункт
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

  // Закрывать по Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
});

// --- Boot sequence: init immediately (for inline markup) and after partials ---
document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
  initMobileMenu();
});

document.addEventListener('partials:ready', () => {
  initLightbox();
  initMobileMenu();
});

// Fallback: observe DOM for late-inserted header/footer once, then init
const mo = new MutationObserver((mutations, obs) => {
  if (document.querySelector('.burger') && document.querySelector('.toplinks')) {
    initMobileMenu();
    obs.disconnect();
  }
  if (document.getElementById('lightbox')) {
    initLightbox();
  }
});
mo.observe(document.documentElement, { childList: true, subtree: true });