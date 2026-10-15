/* Newsletter-Anmeldung (Startseite)
   Zustände aus Figma: initial, Fehler (ungültige Adresse), erfolgreich.
   ========================================================================== */
(function () {
  var form = document.querySelector(".newsletter");
  if (!form) return;

  var input = form.querySelector("input[type=email]");
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
    var email = input.value.trim();
    if (!EMAIL_PATTERN.test(email)) {
      event.preventDefault();
      showError(invalidMessage);
      input.focus();
      return;
    }

    // Bots füllen das versteckte Feld aus – dann nichts senden.
    if (form.elements.email_confirm.value) {
      event.preventDefault();
      showSuccess(email);
      return;
    }

    // Gültige Adresse: Das Formular wird ganz normal an CleverReach gesendet,
    // wie im Branch "newsletter". Die Antwort lädt im unsichtbaren iframe
    // (target="newsletter-frame"), deshalb bleibt die Seite stehen.
    input.value = email;
    setTimeout(function () {
      showSuccess(email);
    }, 0);
  });
})();
