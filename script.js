document.addEventListener("DOMContentLoaded", () => {

  const menuToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector(".nav-list");
  const navLinks = document.querySelectorAll(".nav-list a");

  if (!menuToggle || !navList) return;

  const toggleMenu = () => {
    const isOpen = navList.classList.toggle("active");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
    
    // Trava o scroll da página enquanto o menu está aberto
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  menuToggle.addEventListener("click", toggleMenu);

  // Fecha o menu ao clicar em qualquer link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navList.classList.contains("active")) {
        toggleMenu();
      }
    });
  });


    /* ------------------------------------------------------------------------
     1. CARROSSÉIS (Festivais e Crítica)
     ------------------------------------------------------------------------ */

  document.querySelectorAll(".carousel-wrapper").forEach((wrapper) => {
    const track = wrapper.querySelector(".carousel-track");
    const prev = wrapper.querySelector(".prev");
    const next = wrapper.querySelector(".next");
    const dotsBox = wrapper.querySelector(".dots-group");
    const items = Array.from(track.children);

    if (!items.length) return;

    const getStep = () => items[0].offsetWidth + 24;

    const buildDots = () => {
      dotsBox.innerHTML = "";
      const step = getStep();
      const maxScroll = track.scrollWidth - track.clientWidth;
      const totalMoves = maxScroll > 0 ? Math.ceil(maxScroll / step) + 1 : 1;

      for (let idx = 0; idx < totalMoves; idx++) {
        const dot = document.createElement("button");
        dot.className = idx === 0 ? "dot-btn active" : "dot-btn";
        dot.setAttribute("aria-label", `Slide ${idx + 1}`);

        dot.addEventListener("click", () => {
          track.scrollTo({ left: step * idx, behavior: "smooth" });
        });

        dotsBox.appendChild(dot);
      }
      syncDots();
    };

    const syncDots = () => {
      const dots = Array.from(dotsBox.children);
      const step = getStep();
      const maxScroll = track.scrollWidth - track.clientWidth;
      let current = Math.round(track.scrollLeft / step);

      if (track.scrollLeft >= maxScroll - 5 && dots.length > 0) {
        current = dots.length - 1;
      }

      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    };

    track.addEventListener("scroll", syncDots, { passive: true });
    window.addEventListener("resize", buildDots);

    prev.addEventListener("click", () => {
      const step = getStep();
      if (track.scrollLeft <= 5) {
        track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
      } else {
        track.scrollBy({ left: -step, behavior: "smooth" });
      }
    });

    next.addEventListener("click", () => {
      const step = getStep();
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 5) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: step, behavior: "smooth" });
      }
    });

    buildDots();
  });


  // 2. CONTROLE DE ABERTURA E FECHAMENTO DO MODAL
  const thumbs = document.querySelectorAll(".gallery-banners .banner-slice img");
  const modal = document.getElementById("galleryModal");
  const modalTrack = modal.querySelector(".carousel-track");
  const closeBtn = modal.querySelector(".modal-close");

  thumbs.forEach((img, index) => {
    img.addEventListener("click", () => {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Força o recálculo dos dots e posiciona na imagem clicada
      window.dispatchEvent(new Event("resize"));
      const step = modalTrack.children[0].offsetWidth + 24;
      modalTrack.scrollTo({ left: step * index, behavior: "instant" });
    });
  });

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });

});
