// Überprüfen, ob Cookies bereits gesetzt sind
document.addEventListener("DOMContentLoaded", function () {
  // Cookie-Banner anzeigen, wenn noch keine Entscheidung getroffen wurde
  if (!getCookie("cookiesAccepted")) {
    document.getElementById("cookie-banner").style.display = "block";
  }

  // Event-Listener für "Akzeptieren" Button
  document
    .getElementById("accept-cookies")
    .addEventListener("click", function () {
      setCookie("cookiesAccepted", "true", 365);
      document.getElementById("cookie-banner").style.display = "none";
    });

  // Event-Listener für "Ablehnen" Button
  document
    .getElementById("decline-cookies")
    .addEventListener("click", function () {
      setCookie("cookiesAccepted", "false", 365);
      document.getElementById("cookie-banner").style.display = "none";
    });
});

// Funktion zum Setzen von Cookies
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Funktion zum Abrufen von Cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Mailer
function sendMail(event) {
  event.preventDefault();
  const data = new FormData(event.target);

  fetch("https://formspree.io/f/xpwzapnq", {
    method: "POST",
    body: new FormData(event.target),
    headers: {
      Accept: "application/json",
    },
  })
    .then(() => {
      window.location.href = "./send_mail.html";
    })
    .catch((error) => {
      console.log(error);
    });
}
