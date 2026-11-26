(function () {
  /* ---- 0. split the vertical labels into letters for the neon flicker ---- */
  document
    .querySelectorAll(".splice1-text p, .splice2-text p, .splice3-text p")
    .forEach((p) => {
      const label = p.textContent.trim();
      p.setAttribute("aria-label", label);
      p.textContent = "";
      [...label].forEach((ch, i) => {
        const s = document.createElement("span");
        s.className = "neon-letter";
        s.setAttribute("aria-hidden", "true");
        s.style.setProperty("--i", i);
        s.textContent = ch;
        p.appendChild(s);
      });
    });

  /* ---- 0b. slide 1: embers drifting up ---- */
  const slide1Bg = document.querySelector(".img1");
  const rand = (min, max) => Math.random() * (max - min) + min;

  for (let i = 0; i < 18; i++) {
    const e = document.createElement("span");
    e.className = "ember";
    e.setAttribute("aria-hidden", "true");
    e.style.setProperty("--x", rand(3, 97).toFixed(1) + "%");
    e.style.setProperty("--size", rand(2, 5).toFixed(1) + "px");
    e.style.setProperty("--dur", rand(6, 12).toFixed(1) + "s");
    e.style.setProperty("--delay", rand(0, 8).toFixed(1) + "s");
    e.style.setProperty("--drift", rand(-5, 5).toFixed(1) + "vw");
    e.style.setProperty("--rise", rand(40, 75).toFixed(0) + "vh");
    slide1Bg.appendChild(e);
  }

  /* ---- 0c. slide 2: destination title as neon letters ---- */
  const title = document.getElementById("destination-title");

  function splitTitle() {
    const text = title.textContent.trim();
    title.setAttribute("aria-label", text);
    title.textContent = "";

    let i = 0;
    text.split(/\s+/).forEach((word, w, all) => {
      const wordEl = document.createElement("span");
      wordEl.className = "title-word";
      wordEl.setAttribute("aria-hidden", "true");

      [...word].forEach((ch) => {
        const s = document.createElement("span");
        s.className = "title-letter";
        s.style.setProperty("--i", i++);
        s.textContent = ch;
        wordEl.appendChild(s);
      });

      title.appendChild(wordEl);
      if (w < all.length - 1) title.appendChild(document.createTextNode(" "));
    });
  }

  splitTitle();

  // gameplay.js replaces the text on left/right: split the new text again
  const titleObserver = new MutationObserver(() => {
    splitTitle();
    titleObserver.takeRecords(); // ignore the changes we just made ourselves
  });
  titleObserver.observe(title, { childList: true, characterData: true, subtree: true });

  /* ---- 1. footer: bars close in on the center ---- */
  const footer = document.getElementById("footer-sect");
  new IntersectionObserver(
    ([entry]) => document.body.classList.toggle("footer-focus", entry.isIntersecting),
    { threshold: 0.6 }
  ).observe(footer);

  /* ---- 2. slide 3: reset the menu to its default state ---- */
  const slide3 = document.querySelector(".splice-container").closest(".section");
  const worldText = document.getElementById("change-text-as");
  const initialText = worldText.innerHTML;
  const panelVars = ["--pos-s1", "--pos-s2", "--pos-s3", "--f-st1", "--f-st2", "--f-st3"];

  function resetWorld() {
    // removing the inline values falls back to the defaults in grid3.css
    panelVars.forEach((v) => document.documentElement.style.removeProperty(v));

    // clear the activated-panel effect
    document
      .querySelectorAll(".splice1, .splice2, .splice3")
      .forEach((m) => m.classList.remove("is-active"));

    // world.js state: stop any typing and zero the click counters
    try {
      clearTimeout(typeTimer);
      back1 = back2 = back3 = 0;
    } catch (err) {
      /* world.js not loaded, nothing to reset */
    }

    worldText.innerHTML = initialText;
  }

  /* ---- 3. slides: add/remove .in-view so animations replay each visit ---- */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        e.target.classList.toggle("in-view", e.isIntersecting);

        if (!e.isIntersecting) {
          e.target.classList.remove("cover-return");
          if (e.target === slide3) resetWorld();
        }
      });
    },
    { threshold: 0.45 }
  );
  document.querySelectorAll(".section").forEach((s) => sectionObserver.observe(s));

  /* ---- 4. left/right buttons: replay text + media ---- */
  const slide2 = document.querySelector(".img2").closest(".section");

  function replayReveal() {
    slide2.getAnimations({ subtree: true }).forEach((anim) => {
      const target = anim.effect && anim.effect.target;
      if (!target) return;
      if (target.closest(".page-name-grid")) return;
      if (target.classList.contains("media-cover")) return;
      anim.cancel();
      anim.play();
    });

    slide2.classList.remove("cover-return");
    void slide2.offsetWidth;
    slide2.classList.add("cover-return");
  }

  ["left-btn", "right-btn"].forEach((id) => {
    document.getElementById(id).addEventListener("click", replayReveal);
  });
})();