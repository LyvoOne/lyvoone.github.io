/* Newsletter-Anmeldung (Startseite)
   Zustände aus Figma: initial, Fehler (ungültige Adresse), erfolgreich.
   ========================================================================== */
(function () {
  var form = document.querySelector(".newsletter");
  if (!form) return;

  var input = form.querySelector("input[type=email]");
  var button = form.querySelector("button[type=submit]");
  var error = form.querySelector(".newsletter__error");
  var success = document.querySelector(".newsletter__success");
  var invalidMessage = error.textContent;

  // type="email" akzeptiert auch "name@domain" – wir verlangen eine Top-Level-Domain.
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
    input.setAttribute("aria-invalid", "true");
  }

  function clearError() {
    error.hidden = true;
    input.removeAttribute("aria-invalid");
  }

  function showSuccess(email) {
    success.textContent =
      "Die Anmeldung zu unserem Newsletter mit der E-Mail Adresse " + email + " war erfolgreich.";
    form.hidden = true;
    success.hidden = false;
  }

  input.addEventListener("input", clearError);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var email = input.value.trim();
    if (!EMAIL_PATTERN.test(email)) {
      showError(invalidMessage);
      input.focus();
      return;
    }

    // Bots füllen das versteckte Feld aus – dann nichts senden.
    if (form.elements.email_confirm.value) {
      showSuccess(email);
      return;
    }

    // CleverReach erlaubt keine CORS-Antwort: Die Anfrage wird gesendet,
    // das Ergebnis ist aber nicht lesbar. Nur Netzwerkfehler landen im catch.
    button.disabled = true;
    fetch(form.action, { method: "POST", mode: "no-cors", body: new URLSearchParams(new FormData(form)) })
      .then(function () {
        showSuccess(email);
      })
      .catch(function () {
        showError("Die Anmeldung hat leider nicht geklappt. Bitte versuche es später erneut.");
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
