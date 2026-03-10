(() => {
  const pad2 = (n) => String(n).padStart(2, "0");

  document.querySelectorAll("[data-slider]").forEach((root) => {
    const img = root.querySelector(".hover-slider__img");
    const hitPrev = root.querySelector(".hover-slider__hit--prev");
    const hitNext = root.querySelector(".hover-slider__hit--next");

    const visPrev = root.querySelector(".hover-slider__btn--prev");
    const visNext = root.querySelector(".hover-slider__btn--next");

    const prefix = root.getAttribute("data-prefix");
    const count = parseInt(root.getAttribute("data-count") || "0", 10);

    if (!img || !hitPrev || !hitNext || !prefix || !count) return;

    let i = 1;

    // Кэш заранее загруженных картинок
    const cache = new Map();

    const getSrc = (index) => `${prefix}${pad2(index)}.webp`;

    // предзагрузка всех слайдов
    const preloadAll = () => {
      for (let n = 1; n <= count; n++) {
        const src = getSrc(n);
        const preImg = new Image();
        preImg.src = src;
        cache.set(src, preImg);

        // если браузер поддерживает decode — просим декодировать заранее
        if (preImg.decode) {
          preImg.decode().catch(() => {});
        }
      }
    };

    const set = () => {
      img.src = getSrc(i);
    };

    const press = (el) => {
      if (!el) return;
      el.classList.remove("is-pressed");
      void el.offsetWidth;
      el.classList.add("is-pressed");
      setTimeout(() => el.classList.remove("is-pressed"), 140);
    };

    const prev = () => {
      i = i <= 1 ? count : i - 1;
      set();
      press(visPrev);
    };

    const next = () => {
      i = i >= count ? 1 : i + 1;
      set();
      press(visNext);
    };

    hitPrev.addEventListener("click", prev);
    hitNext.addEventListener("click", next);

    root.setAttribute("tabindex", "0");

    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    });

    // сначала ставим первый кадр
    set();

    // потом предзагружаем остальные
    preloadAll();
  });
})();