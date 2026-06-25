#!/usr/bin/env node
/**
 * Stamps the canonical nav and footer onto ALL existing city pages.
 * Usage: node tools/stamp-all.js [--dry-run]
 *
 * Run this whenever nav-city.html or lib/partials.js footer templates change.
 * Safe to run repeatedly — only touches nav and footer, leaves all page content alone.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const { CITY_MAP } = require('./lib/cities');
const { stampNav, stampFooter } = require('./lib/partials');

const ROOT    = path.join(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

// ── Find all city HTML pages ──────────────────────────────────────────────────

function findCityPages(serviceDir) {
  const pages = [];
  const serviceRoot = path.join(ROOT, serviceDir);
  if (!fs.existsSync(serviceRoot)) return pages;

  for (const citySlug of fs.readdirSync(serviceRoot)) {
    const cityDir = path.join(serviceRoot, citySlug);
    if (!fs.statSync(cityDir).isDirectory()) continue;

    // hub page
    const hubPage = path.join(cityDir, 'index.html');
    if (fs.existsSync(hubPage)) pages.push({ file: hubPage, citySlug, service: serviceDir });

    // sub-pages
    for (const sub of fs.readdirSync(cityDir)) {
      const subDir = path.join(cityDir, sub);
      if (!fs.statSync(subDir).isDirectory()) continue;
      const subPage = path.join(subDir, 'index.html');
      if (fs.existsSync(subPage)) pages.push({ file: subPage, citySlug, service: serviceDir });
    }
  }
  return pages;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const pages = [
    ...findCityPages('kitchen'),
    ...findCityPages('flooring'),
  ];

  let updated = 0;
  let skipped = 0;

  for (const { file, citySlug, service } of pages) {
    const city = CITY_MAP[citySlug];
    if (!city) {
      console.warn(`  [skip] no city data for slug "${citySlug}" — ${file.replace(ROOT, '')}`);
      skipped++;
      continue;
    }

    const html    = fs.readFileSync(file, 'utf8');
    const updated_html = stampFooter(stampNav(html), city, service);

    if (updated_html === html) {
      // Nothing changed (nav/footer already match — unlikely but possible)
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`  [dry-run] ${file.replace(ROOT, '')}`);
    } else {
      fs.writeFileSync(file, updated_html, 'utf8');
      console.log(`  stamped: ${file.replace(ROOT, '')}`);
    }
    updated++;
  }

  console.log(`\n✓ Done. ${updated} pages ${DRY_RUN ? 'would be ' : ''}updated, ${skipped} skipped.`);
}

main();
