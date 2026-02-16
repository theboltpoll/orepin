(() => {
  const section = document.querySelector(".hobby-section");
  const target = section?.querySelector(".container");
  if (!section || !target) return;

  // CSS будет включаться только если JS реально запустился
  document.documentElement.classList.add("js");

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  // За сколько пикселей до низа начинаем проявлять контент
  const revealWindowPx = 420;

  let ticking = false;

  const setHobbyHeightVar = () => {
    // Важно: getBoundingClientRect надежнее, чем offsetHeight в моменты перестроения
    const h = section.getBoundingClientRect().height;
    document.documentElement.style.setProperty("--hobby-h", `${Math.ceil(h)}px`);
  };

  const updateReveal = () => {
    ticking = false;

    const doc = document.documentElement;
    const vh = window.innerHeight || doc.clientHeight;

    const scrollTop = window.pageYOffset || doc.scrollTop || 0;
    const maxScroll = Math.max(0, doc.scrollHeight - vh);

    const start = Math.max(0, maxScroll - revealWindowPx);

    const reveal =
      maxScroll === 0 ? 1 : clamp01((scrollTop - start) / (maxScroll - start));

    target.style.setProperty("--reveal", String(reveal));
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateReveal);
  };

  // Пересчитать всё “чуть позже”, когда DOM/CSS успели примениться
  const measureSoon = () => {
    requestAnimationFrame(() => {
      setHobbyHeightVar();
      updateReveal();
      requestAnimationFrame(() => {
        setHobbyHeightVar();
        updateReveal();
      });
    });
  };

  // Скролл нужен постоянно, он легкий
  window.addEventListener("scroll", onScroll, { passive: true });

  // Важно: НЕ вешаем resize постоянно (ты сам этого не хочешь).
  // Вместо этого пересчитываем в правильные моменты:

  // 1) после подгрузки partials (твое include.js диспатчит это событие)
  document.addEventListener("includes:loaded", measureSoon, { once: true });

  // 2) после полной загрузки (картинки и их размеры)
  window.addEventListener("load", measureSoon, { once: true });

  // 3) после загрузки шрифтов (если поддерживается)
  if (document.fonts?.ready) {
    document.fonts.ready.then(measureSoon);
  }

  // Фоллбек: на старте тоже попробуем
  measureSoon();
})();