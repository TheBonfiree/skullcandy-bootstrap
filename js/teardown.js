(function () {
  "use strict";
  var FRAME_COUNT = 121;
  var section = document.getElementById("teardown");
  var canvas = document.getElementById("teardown-canvas");
  var poster = document.getElementById("teardown-poster");
  if (!section || !canvas || !poster) { return; }

  var ctx = canvas.getContext("2d");
  var frames = [];
  var loaded = 0;

  function src(i) {
    return "assets/teardown/frame-" + String(i + 1).padStart(3, "0") + ".webp";
  }

  for (var i = 0; i < FRAME_COUNT; i++) {
    var img = new Image();
    img.decoding = "async";
    img.onload = onFrameLoad;
    img.onerror = onFrameError;
    img.src = src(i);
    frames.push(img);
  }

  var failed = false;

  function onFrameError() {
    failed = true;
  }

  function onFrameLoad() {
    loaded++;
    if (loaded === FRAME_COUNT && !failed) { start(); }
  }

  var current = -1;
  var ticking = false;

  function sizeCanvas() {
    var first = frames[0];
    canvas.width = first.naturalWidth;
    canvas.height = first.naturalHeight;
  }

  function draw(index) {
    if (index === current) { return; }
    current = index;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
  }

  function frameForScroll() {
    var rect = section.getBoundingClientRect();
    var travel = rect.height - window.innerHeight;
    if (travel <= 0) { return FRAME_COUNT - 1; }
    var progress = (-rect.top) / travel;
    progress = Math.min(1, Math.max(0, progress));
    return Math.round(progress * (FRAME_COUNT - 1));
  }

  function onScroll() {
    if (ticking) { return; }
    ticking = true;
    requestAnimationFrame(function () {
      draw(frameForScroll());
      ticking = false;
    });
  }

  function start() {
    sizeCanvas();
    canvas.hidden = false;
    poster.hidden = true;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      draw(FRAME_COUNT - 1);
      return;
    }

    draw(frameForScroll());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }
})();
