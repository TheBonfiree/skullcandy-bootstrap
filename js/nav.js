(function () {
  "use strict";
  var here = location.pathname.split("/").pop() || "index.html";
  var links = document.querySelectorAll(".navbar .nav-link, .navbar .btn");
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute("href") === here) {
      links[i].classList.add("active");
      links[i].setAttribute("aria-current", "page");
    }
  }
})();
