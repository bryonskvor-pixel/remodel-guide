/* ============================================================
   remodel.guide — Em Underline JS Trigger
   Drop this script block just before </body>
   or add to your existing script block at the bottom of the page
   ============================================================ */

(function () {
  var emSections = document.querySelectorAll(
    '.hero, .section-dark, .section-cream, .dual-cta-section'
  );

  var emObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          /* Small delay so the fade-up lands first, then the line draws */
          setTimeout(function () {
            entry.target.classList.add('em-revealed');
          }, 280);
          emObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  emSections.forEach(function (el) {
    emObserver.observe(el);
  });

  /* Hero fires immediately on load — no scroll required */
  var hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(function () {
      hero.classList.add('em-revealed');
    }, 400);
  }
})();
