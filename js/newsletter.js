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

    var endpoint = form.dataset.endpoint;
    if (!endpoint) {
      // TODO Newsletter: Solange kein Anbieter angebunden ist, wird nur der Erfolgszustand gezeigt.
      console.warn("Newsletter: kein data-endpoint gesetzt – Anmeldung wird nicht übertragen.");
      showSuccess(email);
      return;
    }

    button.disabled = true;
    fetch(endpoint, { method: "POST", body: new FormData(form) })
      .then(function (response) {
        if (!response.ok) throw new Error(response.status);
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
