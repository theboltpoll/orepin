(() => {
    const init = () => {
      const burger = document.querySelector('.burger');
      const menu = document.querySelector('.toplinks');
      if (!burger || !menu) return;
  
      if (burger.dataset.bound) return;
      burger.dataset.bound = "1";
  
      const panel = menu.querySelector('.toplinks__panel');
  
      const open = () => {
        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false');
        burger.setAttribute('aria-expanded', 'true');
        burger.classList.add('is-open');
        document.body.classList.add('is-locked');
      };
  
      const close = () => {
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        burger.setAttribute('aria-expanded', 'false');
        burger.classList.remove('is-open');
        document.body.classList.remove('is-locked');
      };
  
      burger.addEventListener('click', () => {
        menu.classList.contains('is-open') ? close() : open();
      });
  
      menu.addEventListener('click', (e) => {
        if (panel && panel.contains(e.target)) return;
        close();
      });
  
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
    };
  
    document.addEventListener('DOMContentLoaded', () => {
      init();
      setTimeout(init, 50);
      setTimeout(init, 250);
      setTimeout(init, 800);
    });
  
    document.addEventListener('includes:loaded', init);
  })();

  