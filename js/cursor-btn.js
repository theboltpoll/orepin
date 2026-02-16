(function () {
    const cursor = document.querySelector(".cursor-btn");
    if (!cursor) return;
  
    const hits = document.querySelectorAll(".case-end__hit");
    if (!hits.length) return;
  
    const OFFSET_X = 14;
    const OFFSET_Y = 14;
  
    let lastX = -9999;
    let lastY = -9999;
    let visible = false;
  
    function setPos(x, y) {
      cursor.style.transform = `translate3d(${x + OFFSET_X}px, ${y + OFFSET_Y}px, 0)`;
    }
  
    // Всегда запоминаем позицию мыши.
    // Если курсор уже видим — сразу двигаем SVG за мышью без плавания.
    window.addEventListener(
      "mousemove",
      (e) => {
        lastX = e.clientX;
        lastY = e.clientY;
        if (visible) setPos(lastX, lastY);
      },
      { passive: true }
    );
  
    function show(dir) {
      visible = true;
      cursor.classList.add("is-visible");
      cursor.classList.toggle("is-next", dir === "next");
  
      // Важно: ставим позицию сразу, чтобы не “проявлялся на клике”
      setPos(lastX, lastY);
    }
  
    function hide() {
      visible = false;
      cursor.classList.remove("is-visible");
      cursor.classList.remove("is-pressed");
    }
  
    hits.forEach((el) => {
      const dir = el.classList.contains("case-end__hit--next") ? "next" : "prev";
  
      el.addEventListener("mouseenter", () => show(dir));
      el.addEventListener("mouseleave", hide);
  
      el.addEventListener("mousedown", () => cursor.classList.add("is-pressed"));
      el.addEventListener("mouseup", () => cursor.classList.remove("is-pressed"));
    });
  
    window.addEventListener("mouseup", () => cursor.classList.remove("is-pressed"));
    window.addEventListener("blur", hide);
  })();