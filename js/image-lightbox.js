(() => {
    const lightbox = document.getElementById("imageLightbox");
    const lightboxImg = document.getElementById("imageLightboxImg");
    if (!lightbox || !lightboxImg) return;
  
    const selectors = [
      ".solution-item__media img",
      ".case-img img",
      ".results-block img",
      ".case-text-block img",
      ".case-video__inner img"
    ];
  
    const images = document.querySelectorAll(selectors.join(", "));
    if (!images.length) return;
  
    const openLightbox = (img) => {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    };
  
    const closeLightbox = () => {
      lightbox.hidden = true;
      lightboxImg.src = "";
      lightboxImg.alt = "";
      document.body.style.overflow = "";
    };
  
    images.forEach((img) => {
      img.addEventListener("click", () => openLightbox(img));
    });
  
    lightbox.addEventListener("click", closeLightbox);
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) {
        closeLightbox();
      }
    });
  })();