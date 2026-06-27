/* ===================================================================
   ROMANTIC BIRTHDAY WEBSITE — SCRIPT
   Organized into clearly labeled sections. Search for "CONFIG" to
   set the birthday date — that is the only required edit.
=================================================================== */

/* =========================== CONFIG =========================== */
const CONFIG = {
  // Set the exact birthday moment here (local time of the visitor).
  // Format: new Date(YYYY, MONTH_INDEX (0-11), DAY, HOUR, MINUTE, SECOND)
  // Example below is set for September 14th at 12:00 AM.
  birthdayDate: new Date(2026, 7, 21, 0, 0, 0),

  // Personalized love letter shown in the "Open My Letter" modal.
  // Edit this freely — it will type itself out automatically.
  letterText:
    "From the very first day I met you, I knew my life was about to change for the better. " +
    "Every laugh, every quiet moment, every little adventure with you has made me fall for you " +
    "more than I thought was possible.\n\n" +
    "On your special day, I just want you to know how deeply loved and cherished you are. " +
    "You make ordinary days feel like magic, and you make my heart feel safe.\n\n" +
    "Here's to celebrating you today, and to all the birthdays I get to spend by your side. " +
    "I love you more than words can hold.",

  letterSignoff: "— Yours, always & completely",
};

/* =========================== UTILITIES =========================== */

/** Returns true if the current time is at/after the configured birthday. */
function isBirthdayNow() {
  return Date.now() >= CONFIG.birthdayDate.getTime();
}

/** Pads a number to 2 digits, e.g. 4 -> "04" */
function pad2(num) {
  return String(Math.max(0, num)).padStart(2, "0");
}

/* =========================== CUSTOM CURSOR =========================== */
(function initCursor() {
  const cursor = document.getElementById("cursorHeart");
  if (!cursor) return;

  // Only enable on devices that actually have a mouse (desktop).
  const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!hasHover) return;

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smoothly trail the cursor for a softer, floaty feel.
  function animateCursor() {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Slight pulse on click for a satisfying tactile cue.
  window.addEventListener("mousedown", () => {
    cursor.style.transform += " scale(1.4)";
  });
})();

/* =========================== AMBIENT FLOATING HEARTS =========================== */
(function initFloatingHearts() {
  const container = document.getElementById("floatingHearts");
  if (!container) return;

  const HEART_COUNT = window.innerWidth < 600 ? 10 : 18;
  const symbols = ["❤", "💕", "💗"];

  for (let i = 0; i < HEART_COUNT; i++) {
    spawnHeart();
  }

  function spawnHeart() {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const size = 12 + Math.random() * 22;
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 10;
    const delay = Math.random() * duration;
    const drift = (Math.random() * 80 - 40) + "px";

    heart.style.left = left + "vw";
    heart.style.fontSize = size + "px";
    heart.style.animationDuration = duration + "s";
    heart.style.animationDelay = "-" + delay + "s";
    heart.style.setProperty("--drift", drift);

    container.appendChild(heart);
  }
})();

/* =========================== AMBIENT SPARKLES =========================== */
(function initSparkles() {
  const layer = document.getElementById("sparkleLayer");
  if (!layer) return;

  const SPARKLE_COUNT = window.innerWidth < 600 ? 12 : 22;

  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.style.top = Math.random() * 100 + "vh";
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDelay = Math.random() * 3 + "s";
    s.style.animationDuration = 1.8 + Math.random() * 2.2 + "s";
    layer.appendChild(s);
  }
})();

/* =========================== BACKGROUND MUSIC =========================== */
(function initMusic() {
  const btn = document.getElementById("musicToggle");
  const audio = document.getElementById("bgMusic");
  if (!btn || !audio) return;

  let isPlaying = false;

  btn.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
    } else {
      // play() returns a promise; catch errors quietly (e.g. missing audio file).
      audio.play().catch(() => {
        console.warn("Music could not play — check that audio/romantic-music.mp3 exists.");
      });
    }
    isPlaying = !isPlaying;
    btn.setAttribute("aria-pressed", String(isPlaying));
    btn.setAttribute("aria-label", isPlaying ? "Pause music" : "Play romantic music");
    btn.querySelector(".music-icon").textContent = isPlaying ? "🎶" : "🎵";
  });
})();

/* =========================== NOTIFICATION PERMISSION =========================== */
(function initNotifications() {
  const notifyBtn = document.getElementById("notifyBtn");
  if (!notifyBtn) return;

  // Ask permission proactively on load (browsers may ignore this until a
  // user gesture; the button below provides that gesture as a fallback).
  if ("Notification" in window && Notification.permission === "default") {
    // Some browsers require a user gesture, so we attempt politely on load
    // and rely on the visible button for browsers that block silent requests.
    Notification.requestPermission().catch(() => {});
  }

  notifyBtn.addEventListener("click", () => {
    if (!("Notification" in window)) {
      alert("This browser doesn't support notifications, but don't worry — the surprise will still show right here on the page!");
      return;
    }
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        notifyBtn.querySelector("span").textContent = "🔔 We'll let you know!";
        new Notification("All set 💕", {
          body: "I'll notify you the moment the surprise is ready.",
        });
      } else {
        notifyBtn.querySelector("span").textContent = "🔕 Notifications blocked";
      }
    });
  });
})();

/** Fires the "it's midnight" browser notification, once. */
function sendBirthdayNotification() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification("🎉 Happy Birthday, My Love! ❤️", {
      body: "Your surprise is waiting. Open the website now!",
      requireInteraction: true,
    });
  }
}

/* =========================== COUNTDOWN / FLIP CLOCK =========================== */
(function initCountdown() {
  const countdownSection = document.getElementById("countdownSection");
  const birthdaySection = document.getElementById("birthdaySection");
  const dateNote = document.getElementById("countdownDate");

  if (!countdownSection || !birthdaySection) return;

  // Display the target date in the footnote, e.g. "Until Sep 14"
  if (dateNote) {
    const opts = { month: "long", day: "numeric" };
    dateNote.textContent = "Until " + CONFIG.birthdayDate.toLocaleDateString(undefined, opts);
  }

  // Cache tile elements per unit so we only touch the DOM when a value changes.
  const units = ["days", "hours", "minutes", "seconds"];
  const tileCache = {};
  units.forEach((unit) => {
    const wrap = document.querySelector(`.flip-digits[data-unit="${unit}"]`);
    tileCache[unit] = {
      tens: wrap.querySelector("[data-d1]"),
      ones: wrap.querySelector("[data-d2]"),
      lastValue: null,
    };
  });

  /** Updates one unit's tiles, applying a flip animation only on change. */
  function setUnit(unit, value) {
    const cache = tileCache[unit];
    if (cache.lastValue === value) return; // avoid redundant DOM writes/animations
    cache.lastValue = value;

    const str = pad2(value);
    const [tensDigit, onesDigit] = str.split("");

    updateTile(cache.tens, tensDigit);
    updateTile(cache.ones, onesDigit);
  }

  function updateTile(tile, newDigit) {
    if (tile.textContent === newDigit) return;
    tile.textContent = newDigit;
    tile.classList.remove("tile-flip");
    // restart animation reliably
    void tile.offsetWidth;
    tile.classList.add("tile-flip");
  }

  let triggered = false;

  function tick() {
    const now = Date.now();
    const diff = CONFIG.birthdayDate.getTime() - now;

    if (diff <= 0) {
      if (!triggered) {
        triggered = true;
        sendBirthdayNotification();
        revealBirthdaySurprise();
      }
      return; // stop ticking once revealed
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setUnit("days", days);
    setUnit("hours", hours);
    setUnit("minutes", minutes);
    setUnit("seconds", seconds);

    requestAnimationFrame(() => setTimeout(tick, 250));
  }

  // If the page loads after the birthday has already passed, skip straight
  // to the surprise instead of showing a countdown stuck at zero.
  if (isBirthdayNow()) {
    revealBirthdaySurprise(true);
  } else {
    tick();
  }

  /**
   * Hides the countdown, reveals the full-screen birthday surprise,
   * and kicks off confetti + balloons.
   * @param {boolean} immediate - skip transition delay if loading post-birthday
   */
  function revealBirthdaySurprise(immediate) {
    const doReveal = () => {
      countdownSection.style.transition = "opacity 0.6s ease";
      countdownSection.style.opacity = "0";
      setTimeout(() => {
        countdownSection.hidden = true;
        birthdaySection.hidden = false;
        document.title = "🎉 Happy Birthday, My Love!";
        startConfetti();
        startBalloons();
      }, immediate ? 0 : 600);
    };
    doReveal();
  }
})();

/* =========================== CONFETTI (canvas) =========================== */
let confettiAnimationId = null;

function startConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#ff6fa5", "#f4c77b", "#ffe1ad", "#ffffff", "#c0356e"];
  const PARTICLE_COUNT = window.innerWidth < 600 ? 70 : 140;

  const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle());

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      size: 5 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 1.5 + Math.random() * 3,
      speedX: -1 + Math.random() * 2,
      rotation: Math.random() * 360,
      spin: -6 + Math.random() * 12,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.spin;

      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    confettiAnimationId = requestAnimationFrame(draw);
  }

  draw();
}

/* =========================== BALLOONS =========================== */
function startBalloons() {
  const layer = document.getElementById("balloonLayer");
  if (!layer) return;

  const colors = [
    "linear-gradient(160deg, #ff6fa5, #c0356e)",
    "linear-gradient(160deg, #f4c77b, #d99a3f)",
    "linear-gradient(160deg, #ffe1ad, #ffb6cf)",
    "linear-gradient(160deg, #ffffff, #ffd2e3)",
  ];

  const BALLOON_COUNT = window.innerWidth < 600 ? 8 : 14;

  for (let i = 0; i < BALLOON_COUNT; i++) {
    spawnBalloon(i);
  }

  function spawnBalloon(i) {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.left = Math.random() * 92 + "vw";
    balloon.style.background = colors[i % colors.length];
    const duration = 10 + Math.random() * 8;
    balloon.style.animationDuration = duration + "s";
    balloon.style.animationDelay = Math.random() * 6 + "s";
    layer.appendChild(balloon);
  }
}

/* =========================== GALLERY SCROLL REVEAL =========================== */
(function initGalleryReveal() {
  const frames = document.querySelectorAll(".gallery-frame");
  if (!frames.length) return;

  if (!("IntersectionObserver" in window)) {
    frames.forEach((f) => f.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  frames.forEach((frame) => observer.observe(frame));
})();

/* =========================== LOVE LETTER MODAL + TYPING ANIMATION =========================== */
(function initLetterModal() {
  const openBtn = document.getElementById("openLetterBtn");
  const scrollToLetterBtn = document.getElementById("scrollToLetterBtn");
  const modal = document.getElementById("letterModal");
  const backdrop = document.getElementById("letterBackdrop");
  const closeBtn = document.getElementById("letterCloseBtn");
  const typedEl = document.getElementById("letterTypedText");
  const signoffEl = document.getElementById("letterSignoff");

  if (!modal) return;

  let hasTyped = false;
  let typingTimeoutId = null;

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    if (!hasTyped) {
      hasTyped = true;
      typeLetter();
    }
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function typeLetter() {
    const text = CONFIG.letterText;
    signoffEl.textContent = CONFIG.letterSignoff;
    let i = 0;

    const cursorSpan = document.createElement("span");
    cursorSpan.className = "cursor-blink";
    cursorSpan.textContent = "|";

    function typeChar() {
      if (i <= text.length) {
        typedEl.textContent = text.slice(0, i);
        typedEl.appendChild(cursorSpan);
        i++;
        // Slightly randomized speed for a more natural handwriting feel.
        const delay = 18 + Math.random() * 22;
        typingTimeoutId = setTimeout(typeChar, delay);
      } else {
        cursorSpan.remove();
        signoffEl.classList.add("show");
      }
    }
    typeChar();
  }

  if (openBtn) openBtn.addEventListener("click", openModal);

  if (scrollToLetterBtn) {
    scrollToLetterBtn.addEventListener("click", () => {
      document.getElementById("letter")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
})();
