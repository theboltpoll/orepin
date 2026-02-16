(function () {
    const blocks = document.querySelectorAll("[data-ba]");
    if (!blocks.length) return;
  
    blocks.forEach((ba) => {
      const range = ba.querySelector(".ba__range");
      if (!range) return;
  
      const set = () => {
        ba.style.setProperty("--pos", `${range.value}%`);
      };
  
      range.addEventListener("input", set);
      set();
    });
  })();