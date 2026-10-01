const IG = "https://www.instagram.com/maize.studios/";
const BOOK = "https://gymcatch.com/app/provider/11548";
const MAIL = "mailto:maizepilates@gmail.com";

const page = location.pathname.split("/").pop() || "index.html";

document.getElementById("site-header").innerHTML = `
  <div class="preview-banner">Preview mockup by <a href="https://halfpennydigital.co.uk/">Halfpenny Digital</a> — not the live site yet</div>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="index.html"><img src="photos/logo.png" alt="Maize Studios" /></a>
      <nav class="desk-nav">
        <a href="index.html">Home</a>
        <a href="#classes">Classes</a>
        <a href="#online">Online</a>
        <a href="#about">About</a>
        <a href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
      </nav>
      <button class="menu-btn" type="button" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-nav" hidden>
    <nav>
      <a href="index.html">Home</a>
      <a href="#classes">Classes</a>
      <a href="#online">Online</a>
      <a href="#about">About</a>
      <a href="${BOOK}" target="_blank" rel="noreferrer">Book</a>
      <a href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
    </nav>
  </div>
  <div class="mobile-cta">
    <a class="btn" href="${BOOK}" target="_blank" rel="noreferrer">Book</a>
    <a class="btn ghost" href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
  </div>
`;

document.getElementById("site-footer").innerHTML = `
  <footer>
    <div class="wrap footer-grid">
      <div>
        <p class="foot-name">Maize Studios</p>
        <p>Mat, barre and reformer with Talia. West Malling.</p>
        <p>Therapy & Fitness, Mill Yard.</p>
      </div>
      <div>
        <p><a href="${BOOK}" target="_blank" rel="noreferrer">Book a Saturday class</a></p>
        <p><a href="${MAIL}">maizepilates@gmail.com</a></p>
        <p><a href="#online">Online programmes</a></p>
      </div>
      <div>
        <p><a href="${IG}" target="_blank" rel="noreferrer">Instagram</a></p>
        <p><a href="#classes">Classes</a></p>
        <p><a href="#about">About</a></p>
      </div>
    </div>
    <div class="wrap credit">Website built by <a href="https://halfpennydigital.co.uk/">Halfpenny Digital</a></div>
  </footer>
`;

const btn = document.querySelector(".menu-btn");
const nav = document.querySelector(".mobile-nav");
btn.addEventListener("click", () => {
  const open = !nav.hasAttribute("hidden");
  if (open) nav.setAttribute("hidden", "");
  else nav.removeAttribute("hidden");
});
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => nav.setAttribute("hidden", ""));
});

(function dockAfterHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const sync = () => {
    if (window.innerWidth > 819) {
      document.body.classList.remove("dock-on");
      return;
    }
    if (hero.getBoundingClientRect().bottom < 90) document.body.classList.add("dock-on");
    else document.body.classList.remove("dock-on");
  };
  window.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  sync();
})();

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  document.querySelectorAll("[data-stagger]").forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      child.classList.add("reveal");
      child.style.transitionDelay = `${80 + i * 90}ms`;
      io.observe(child);
    });
  });
} else {
  document.querySelectorAll(".reveal, [data-stagger] > *").forEach((el) => el.classList.add("is-in"));
}

(function scrub() {
  const track = document.querySelector(".scrub");
  const video = document.querySelector(".scrub-video");
  if (!track || !video) return;
  video.muted = true;
  video.setAttribute("playsinline", "");
  const arm = () => {
    const play = video.play();
    if (play && play.then) play.then(() => video.pause()).catch(() => {});
  };
  video.addEventListener("loadeddata", arm, { once: true });
  window.addEventListener("touchstart", arm, { once: true, passive: true });
  window.addEventListener("click", arm, { once: true });
  let ticking = false;
  const update = () => {
    ticking = false;
    if (!video.duration) return;
    const rect = track.getBoundingClientRect();
    const run = track.offsetHeight - window.innerHeight;
    if (run <= 0) return;
    const scrolled = Math.min(Math.max(-rect.top, 0), run);
    const t = (scrolled / run) * Math.max(video.duration - 0.05, 0);
    if (Math.abs(video.currentTime - t) > 0.03) {
      try { video.currentTime = t; } catch (e) {}
    }
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  video.addEventListener("loadedmetadata", update);
})();
