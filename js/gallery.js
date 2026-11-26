(function () {
  const MAX = 10; // hard limit, anything after the 10th entry is ignored

  // put your images here (path + alt text)
  const images = [
    { src: "img/ELEVATOR.png",  alt: "Screenshot 1" },
    { src: "img/MainMenuu.png",  alt: "Screenshot 2" },
    { src: "img/JOB.png",  alt: "Screenshot 3" },
    { src: "img/MEH.png",  alt: "Screenshot 4" },
    { src: "img/AUGMENTOO.png",  alt: "Screenshot 5" },
    { src: "img/SHOPPER.png",  alt: "Screenshot 6" },
    { src: "img/SKILLTREE.png",  alt: "Screenshot 7" },
    { src: "img/UHOH.png",  alt: "Screenshot 8" },
    { src: "img/URTAX.png",  alt: "Screenshot 9" },
    { src: "img/HELLO.png", alt: "Screenshot 10" },
  ].slice(0, MAX);

  const grid = document.getElementById("gallery-grid");
  const box = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCount = document.getElementById("lb-count");
  let current = 0;
  let lastFocus = null;

  /* ---- build the tiles ---- */
  images.forEach((img, i) => {
    const btn = document.createElement("button");
    btn.className = "gallery-item";
    btn.type = "button";
    btn.style.setProperty("--i", i);
    btn.setAttribute("aria-label", "Open image " + (i + 1) + " of " + images.length);

    const el = document.createElement("img");
    el.src = img.src;
    el.alt = img.alt;
    el.loading = "lazy";

    btn.appendChild(el);
    btn.addEventListener("click", () => open(i));
    grid.appendChild(btn);
  });

  /* ---- viewer ---- */
  function show(i) {
    current = (i + images.length) % images.length;
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt;
    lbCount.textContent = current + 1 + " / " + images.length;
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add("open");
    document.body.style.overflow = "hidden";
    box.querySelector(".lb-close").focus();
  }

  function close() {
    box.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(current + 1));

  // clicking the dark backdrop closes it
  box.addEventListener("click", (e) => {
    if (e.target === box) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  /* ---- reveal: reuses the .in-view animations from reveal.css ---- */
  const section = document.querySelector(".section");
  requestAnimationFrame(() => section.classList.add("in-view"));
})();