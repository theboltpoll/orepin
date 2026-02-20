document.querySelectorAll(".case-video").forEach((block) => {
    const video = block.querySelector("video");
    if (!video) return;
  
    const onReady = () => {
      block.classList.add("is-ready");
    };
  
    if (video.readyState >= 3) {
      onReady();
    } else {
      video.addEventListener("canplay", onReady, { once: true });
    }
  });