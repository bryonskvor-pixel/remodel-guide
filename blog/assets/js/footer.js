/**
 * remodel.guide — Shared Blog Footer
 * 
 * Usage: Add this script tag to any blog post or blog index page:
 *   <script src="../../assets/js/footer.js"></script>   (from blog/post-slug/)
 *   <script src="../assets/js/footer.js"></script>       (from blog/)
 * 
 * To add a new post: update the FROM_THE_FIELD array below — newest post first.
 * All pages that include this script will update automatically on next load.
 */

(function() {

  // ─── UPDATE THIS LIST WITH EVERY NEW POST ───────────────────────────────
  // Add new posts at the TOP. Format: { href, label }
  var FROM_THE_FIELD = [
    { href: '/blog/kitchen-ventilation', label: 'Kitchen Ventilation — What Your Range Hood Isn\'t Doing' },
    { href: '/blog/smart-home-reality',  label: 'Smart Home in 2026 — What\'s Actually Being Used' },
    { href: '/blog/windows-replacement', label: 'Pella &amp; Andersen vs Factory Vinyl' },
    { href: '/blog/countertops',         label: 'Countertops — The Art and the Investment' },
    { href: '/blog/revwood-vs-coretec',  label: 'RevWood Premier vs COREtec' },
  ];
  // ────────────────────────────────────────────────────────────────────────

  var GUIDES = [
    { href: '/kitchen',   label: 'Kitchen Remodel' },
    { href: '/bathroom',  label: 'Bathroom Renovation' },
    { href: '/basement',  label: 'Basement Finishing' },
    { href: '/addition',  label: 'Home Addition' },
    { href: '/flooring',  label: 'Flooring' },
    { href: '/windows',   label: 'Window Replacement' },
    { href: '/roofing',   label: 'Roofing' },
    { href: '/painting',  label: 'Painting' },
    { href: '/millwork',  label: 'Millwork &amp; Built-Ins' },
    { href: '/demo',      label: 'Living Through a Renovation' },
  ];

  var REMODELRY = [
    { href: 'https://remodelry.guide',               label: 'remodelry.guide',        external: true },
    { href: 'https://remodelry.guide/remi',          label: 'Talk to Remi — Free',    external: true },
    { href: 'https://remodelry.guide/concierge',     label: 'The Concierge',          external: true },
    { href: 'https://remodelry.guide/after-clarity', label: 'After Clarity',          external: true },
    { href: 'https://remodelry.guide/pillars',       label: '10 Pillars',             external: true },
  ];

  function buildLinks(items) {
    return items.map(function(item) {
      var target = item.external ? ' target="_blank"' : '';
      return '<li><a href="' + item.href + '"' + target + '>' + item.label + '</a></li>';
    }).join('\n          ');
  }

  var year = new Date().getFullYear();

  var html = '\
<footer>\
  <div class="footer-inner">\
    <div class="footer-brand">\
      <img src="/assets/images/remodel-guide-logo.png" alt="remodel.guide">\
      <p class="footer-tagline">The Homeowner Protection Guide<br>for Residential Remodeling.<br><br>A free resource from <a href="https://remodelry.guide" target="_blank">Remodelry</a> —<br>Northeast Ohio\'s remodeling concierge service.</p>\
    </div>\
    <div class="footer-links">\
      <div class="footer-col">\
        <span class="footer-col-title">The Guides</span>\
        <ul>\
          ' + buildLinks(GUIDES) + '\
        </ul>\
      </div>\
      <div class="footer-col">\
        <span class="footer-col-title">From the Field</span>\
        <ul>\
          ' + buildLinks(FROM_THE_FIELD) + '\
        </ul>\
        <span class="footer-col-title" style="margin-top:24px;display:block;">Remodelry</span>\
        <ul>\
          ' + buildLinks(REMODELRY) + '\
        </ul>\
      </div>\
    </div>\
  </div>\
  <div class="footer-bottom">\
    <span class="footer-copy">&copy; ' + year + ' remodel.guide &middot; All rights reserved.</span>\
    <span class="footer-remodelry">A <a href="https://remodelry.guide" target="_blank">Remodelry</a> resource &middot; Serving Northeast Ohio</span>\
  </div>\
</footer>';

  // Replace existing <footer> if present, otherwise append to body
  var existing = document.querySelector('footer');
  if (existing) {
    existing.outerHTML = html;
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }

})();
