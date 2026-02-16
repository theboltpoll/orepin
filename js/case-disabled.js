document.querySelectorAll('.case-card--disabled').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
  
      card.classList.remove('is-bounce');
      void card.offsetWidth; // перезапуск анимации
      card.classList.add('is-bounce');
    });
  });