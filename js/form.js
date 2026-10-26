(function () {
  "use strict";
  var form = document.getElementById("order-form");
  var confirmation = document.getElementById("order-confirmation");
  if (!form || !confirmation) { return; }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      confirmation.hidden = true;
      var firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) { firstInvalid.focus(); }
      return;
    }

    var name = form.elements.fullName.value.trim();
    var colourwayInput = document.querySelector(".colourway-input:checked");
    var colourway = colourwayInput ? colourwayInput.value : null;
    var colourwaySuffix = colourway ? " in " + colourway : "";
    confirmation.textContent =
      "Thanks, " + name + ". Your Crusher 1080 ANC" + colourwaySuffix +
      " is on its way. This is a coursework demo, so no order was placed.";
    confirmation.hidden = false;
    confirmation.focus();
  });
})();
