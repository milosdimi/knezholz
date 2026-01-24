/* =========================
   HTML Includes (Header/Footer)
========================= */
async function includeHTML() {
  const nodes = document.querySelectorAll("[data-include]");
  for (const el of nodes) {
    const file = el.getAttribute("data-include");
    if (!file) continue;

    try {
      const res = await fetch(file, { cache: "no-cache" });
      el.innerHTML = res.ok ? await res.text() : "";
    } catch (err) {
      console.warn("Include failed:", file, err);
      el.innerHTML = "";
    }
  }
}
/*Carousel in Modal auf bestimmten Slide setzen*/

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-bs-target='#productGalleryModal'][data-bs-slide-to]");
  if (!btn) return;

  const index = Number(btn.getAttribute("data-bs-slide-to"));
  const modalEl = document.getElementById("productGalleryModal");
  const modalCarouselEl = document.getElementById("productCarouselModal");

  if (!modalEl || !modalCarouselEl || Number.isNaN(index)) return;

  modalEl.addEventListener(
    "shown.bs.modal",
    () => {
      const carousel = bootstrap.Carousel.getOrCreateInstance(modalCarouselEl, { interval: false });
      carousel.to(index);
    },
    { once: true }
  );
});

/* =========================
   Cookies (banner)
========================= */
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const c of cookies) {
    const [k, ...v] = c.split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

function initCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;

  const acceptBtn = document.getElementById("accept-cookies");
  const declineBtn = document.getElementById("decline-cookies");
  const resetBtn = document.getElementById("cookie-reset");

  // Banner anzeigen, wenn noch keine Entscheidung getroffen wurde
  if (getCookie("cookieConsent") === null) {
    banner.style.display = "block";
  }

  acceptBtn?.addEventListener("click", () => {
    setCookie("cookieConsent", "accepted", 365);
    banner.style.display = "none";
  });

  declineBtn?.addEventListener("click", () => {
    setCookie("cookieConsent", "declined", 365);
    banner.style.display = "none";
  });

  // Entscheidung zurücksetzen (optional)
  resetBtn?.addEventListener("click", () => {
    deleteCookie("cookieConsent");
    banner.style.display = "block";
  });
}


/* =========================
   Mail (Formspree)
========================= */
async function sendMail(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector("#submitBtn");
  const originalHTML = submitBtn.innerHTML;

  // Button sperren + Feedback
  submitBtn.disabled = true;
  submitBtn.innerHTML = "Senden…";

  try {
    const res = await fetch("https://formspree.io/f/xpwzapnq", {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error("Formspree request failed");

    window.location.href = "/pages/send_mail.html";
  } catch (error) {
    console.error(error);

    // Button wieder aktivieren
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;

    alert(
      "Senden fehlgeschlagen. Bitte später erneut versuchen oder per E-Mail kontaktieren."
    );
  }
}

/* =========================
   Scroll Reveal (Sortiment)
========================= */
function initSortimentReveal() {
  const items = document.querySelectorAll("#sortiment .col");
  if (!items.length) return;

  // Fallback: wenn Browser keinen IntersectionObserver kann
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target); // nur 1x animieren
      });
    },
    {
      root: null,
      threshold: 0.18,          // wann es auslöst
      rootMargin: "0px 0px -10% 0px", // etwas früher triggern
    }
  );

  items.forEach((el) => observer.observe(el));
}
/* =========================
   Scroll Reveal (Reusable)
========================= */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal-item");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
  );

  items.forEach((el) => observer.observe(el));
}
/* =========================
   Scroll To Top Button
========================= */
function initScrollTopButton() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return; // Button nicht vorhanden? Kein Problem.

  const toggle = () => {
    if (window.scrollY > 500) btn.classList.add("is-visible");
    else btn.classList.remove("is-visible");
  };

  window.addEventListener("scroll", toggle, { passive: true });
  toggle(); // initialer Zustand

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initWhatsAppButton() {
  const waBtn = document.getElementById("whatsappBtn");
  if (!waBtn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      waBtn.classList.add("is-visible");
    } else {
      waBtn.classList.remove("is-visible");
    }
  };

  window.addEventListener("scroll", toggleVisibility);
  toggleVisibility();
}


/* =========================
   Boot
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  await includeHTML();     // Header/Footer zuerst laden
  initCookieBanner();      // dann Cookie Banner initialisieren
  initSortimentReveal();
  initScrollReveal();
  initScrollTopButton();
  initWhatsAppButton();
});


