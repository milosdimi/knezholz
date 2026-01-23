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
   Boot
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  await includeHTML();     // Header/Footer zuerst laden
  initCookieBanner();      // dann Cookie Banner initialisieren
});
