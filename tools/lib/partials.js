'use strict';

const fs   = require('fs');
const path = require('path');

const NAV_PATH = path.join(__dirname, '../partials/nav-city.html');

let _navCache = null;
function navHtml() {
  if (!_navCache) _navCache = fs.readFileSync(NAV_PATH, 'utf8').trim();
  return _navCache;
}

// ── Footer builders ───────────────────────────────────────────────────────────

function kitchenFooter(city) {
  const nearbyLinks = city.nearby.slice(0, 4).map(n =>
    `        <li><a href="/kitchen/${n.slug}/">${n.name}</a></li>`
  ).join('\n');

  return `<footer>
  <div class="footer-inner">
    <div>
      <div class="footer-brand"><div class="nav-dot"></div>remodel.guide</div>
      <p class="footer-tagline">Northeast Ohio's kitchen remodeling resource. Free in-home consultations across Cuyahoga, Medina, and Lorain counties. Every level of remodel, no showroom pressure.</p>
    </div>
    <div class="footer-col">
      <h4>${city.name}</h4>
      <ul>
        <li><a href="/kitchen/${city.slug}/">Kitchen Overview</a></li>
        <li><a href="/kitchen/${city.slug}/cabinet-refacing/">Cabinet Refacing</a></li>
        <li><a href="/kitchen/${city.slug}/cabinet-painting/">Cabinet Painting</a></li>
        <li><a href="/kitchen/${city.slug}/countertop-replacement/">Countertop Replacement</a></li>
        <li><a href="/kitchen/${city.slug}/remodel-cost/">Cost Guide</a></li>
        <li><a href="/kitchen/${city.slug}/local-contractor/">Find a Contractor</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Nearby Areas</h4>
      <ul>
${nearbyLinks}
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 remodel.guide · ${city.name}, Ohio · (440) 252-1053</p>
    <p>Powered by <a href="https://remodelry.guide">Remodelry</a></p>
  </div>
</footer>`;
}

function flooringFooter(city) {
  const nearbyLinks = city.nearby.slice(0, 4).map(n =>
    `        <li><a href="/flooring/${n.slug}/">${n.name}</a></li>`
  ).join('\n');

  return `<footer>
  <div class="footer-inner">
    <div>
      <div class="footer-brand"><div class="nav-dot"></div>remodel.guide</div>
      <p class="footer-tagline">Full-service flooring installation across Cuyahoga, Lorain, and Medina counties. Demo, furniture moving, leveling, and trim included.</p>
    </div>
    <div class="footer-col">
      <h4>${city.name} Flooring</h4>
      <ul>
        <li><a href="/flooring/${city.slug}/">Flooring Overview</a></li>
        <li><a href="/flooring/${city.slug}/vinyl-plank-flooring/">Vinyl Plank (LVP)</a></li>
        <li><a href="/flooring/${city.slug}/hardwood-flooring/">Hardwood Flooring</a></li>
        <li><a href="/flooring/${city.slug}/carpet/">Carpet</a></li>
        <li><a href="/flooring/${city.slug}/floor-leveling/">Floor Leveling</a></li>
        <li><a href="/kitchen/${city.slug}/">Kitchen Remodeling</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Other Cities</h4>
      <ul>
${nearbyLinks}
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 remodel.guide · ${city.name}, Ohio · (440) 252-1053</p>
    <p>Powered by <a href="https://remodelry.guide">Remodelry</a></p>
  </div>
</footer>`;
}

// ── Stamping functions ────────────────────────────────────────────────────────

function stampNav(html) {
  const start = html.indexOf('<nav');
  const end   = html.indexOf('</nav>') + 6;
  if (start === -1 || end < 6) return html;
  return html.slice(0, start) + navHtml() + html.slice(end);
}

function stampFooter(html, city, service) {
  const start = html.indexOf('<footer');
  const end   = html.indexOf('</footer>') + 9;
  if (start === -1 || end < 9) return html;
  const footer = service === 'flooring' ? flooringFooter(city) : kitchenFooter(city);
  return html.slice(0, start) + footer + html.slice(end);
}

module.exports = { stampNav, stampFooter, kitchenFooter, flooringFooter };
