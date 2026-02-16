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
  
    const update = () => {
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
      requestAnimationFrame(update);
    };
  
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  
    update();
  })();

  const hobby = document.querySelector('.hobby-section');
if (hobby) {
  const setH = () =>
    document.documentElement.style.setProperty('--hobby-h', hobby.offsetHeight + 'px');
  setH();
  window.addEventListener('resize', setH);
}