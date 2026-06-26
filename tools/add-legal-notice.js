/**
 * Adds "By submitting, you agree to our Privacy Policy and Terms of Service"
 * to every HTML page that has a form submit button.
 *
 * Handles two patterns:
 *   1. City/sub pages: <button class="fsubmit"> + <p class="fnote">
 *   2. Guide pages:    <button class="btn-form-submit">
 *
 * Safe to run multiple times — skips files that already have the notice.
 * Run from the repo root: node tools/add-legal-notice.js
 */

const fs   = require('fs');
const path = require('path');

// Directories to skip entirely
const SKIP_DIRS = new Set(['node_modules', 'tools', '.git', '.vercel', 'assets']);

// The notice text appended inside .fnote paragraphs (city pages)
const FNOTE_SUFFIX = `\n            By submitting, you agree to our <a href="/privacy-policy/" style="color:inherit;text-decoration:underline;">Privacy Policy</a> and <a href="/terms/" style="color:inherit;text-decoration:underline;">Terms of Service</a>.`;

// The notice paragraph inserted after .btn-form-submit (guide pages)
const GUIDE_NOTICE = `\n          <p style="font-size:0.72rem;color:var(--muted,#8C8278);text-align:center;margin-top:8px;line-height:1.55;">By submitting, you agree to our <a href="/privacy-policy/" style="color:inherit;text-decoration:underline;">Privacy Policy</a> and <a href="/terms/" style="color:inherit;text-decoration:underline;">Terms of Service</a>.</p>`;

const ALREADY_PRESENT = 'By submitting, you agree to our';

let counts = { updated: 0, alreadyDone: 0, noForm: 0 };

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (entry === 'index.html') {
      process_file(full);
    }
  }
}

function process_file(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  const hasFnote  = html.includes('class="fnote"');
  const hasSubmit = html.includes('class="btn-form-submit"');

  if (!hasFnote && !hasSubmit) {
    counts.noForm++;
    return;
  }

  if (html.includes(ALREADY_PRESENT)) {
    counts.alreadyDone++;
    return;
  }

  let changed = false;

  // ── Pattern 1: city pages (.fnote) ────────────────────────────────────────
  if (hasFnote) {
    // Match each <p class="fnote"...>...</p> block (multiline)
    html = html.replace(
      /<p class="fnote"([^>]*)>([\s\S]*?)<\/p>/g,
      (match, attrs, inner) => {
        // Guard: skip if this specific fnote already has the notice
        if (match.includes(ALREADY_PRESENT)) return match;
        // Trim trailing whitespace from inner content then append notice
        const trimmed = inner.replace(/\s+$/, '');
        return `<p class="fnote"${attrs}>${trimmed}<br>${FNOTE_SUFFIX}\n          </p>`;
      }
    );
    changed = true;
  }

  // ── Pattern 2: guide pages (.btn-form-submit) ──────────────────────────────
  if (hasSubmit) {
    html = html.replace(
      /(<button[^>]*class="btn-form-submit"[^>]*>[\s\S]*?<\/button>)/,
      (match) => match + GUIDE_NOTICE
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    counts.updated++;
    console.log(`  updated  ${filePath.replace(process.cwd() + path.sep, '')}`);
  }
}

console.log('Adding legal notice to form pages...\n');
walk('.');
console.log(`\nDone.`);
console.log(`  ${counts.updated} pages updated`);
console.log(`  ${counts.alreadyDone} already had the notice (skipped)`);
console.log(`  ${counts.noForm} had no form (skipped)`);
