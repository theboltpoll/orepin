// app.js — портфолио

// --- Utilities ---
const once = (fn) => {
  let ran = false;
  return (...args) => {
    if (ran) return;
    const result = fn(...args);
    if (result !== false) {
      ran = true;
    }
    return result;
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
  if (!lb) return false;
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
    // Open lightbox only for explicitly marked images
    if (target && target.matches('img.zoomable')) {
      e.preventDefault();
      e.stopPropagation();
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
  if (!burger || !menu) return false;

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

// --- Home link (idempotent init) ---
const initHomeLink = once(function homeLink() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    // Treat brand/logo/home-marked links as "go home"
    const isHome =
      link.matches('a.brand') ||
      link.matches('.brand a') ||
      link.hasAttribute('data-home') ||
      link.matches('a[href="/"], a[href="./"], a[href="./index.html"], a[href="/index.html"]');

    if (!isHome) return;

    e.preventDefault();

    // Compute site root for both local dev and production (GitHub Pages + custom domain)
    const { hostname, pathname } = window.location;

    // If running locally (localhost/127.*) the first path segment is the project folder (e.g. /githubpages/)
    if (hostname === 'localhost' || hostname.startsWith('127.')) {
      const segments = pathname.split('/').filter(Boolean); // ["githubpages", "html", ...]
      const projectRoot = segments.length ? `/${segments[0]}/` : '/';
      window.location.assign(`${projectRoot}index.html`);
      return;
    }

    // In production (custom domain or user/org pages) home is the root
    window.location.assign('/');
  });
});

// --- Boot sequence: init immediately (for inline markup) and after partials ---
document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
  initMobileMenu();
  initHomeLink();
});

document.addEventListener('partials:ready', () => {
  initLightbox();
  initMobileMenu();
  initHomeLink();
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