#!/usr/bin/env node
/**
 * ScrapingBee Google Ads scraper
 * Usage: node scraping-bee-ads.js [query] [city]
 * Or:    node scraping-bee-ads.js --preset
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// ── Config ────────────────────────────────────────────────────────────────────

// Load .env from this directory or project root
const envPaths = [
  path.join(__dirname, ".env"),
  path.join(__dirname, "..", ".env"),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    fs.readFileSync(p, "utf8")
      .split("\n")
      .forEach((line) => {
        const [k, ...v] = line.split("=");
        if (k && v.length) process.env[k.trim()] = v.join("=").trim();
      });
    break;
  }
}

const API_KEY = process.env.SCRAPINGBEE_API_KEY;
if (!API_KEY) {
  console.error(
    "Error: SCRAPINGBEE_API_KEY not set.\n" +
      "Create tools/.env with: SCRAPINGBEE_API_KEY=your_key_here"
  );
  process.exit(1);
}

// ── Preset queries ────────────────────────────────────────────────────────────

// All significant cities across Lorain, Cuyahoga, and Medina Counties
const CITIES = [
  // Lorain County
  "Avon OH", "Avon Lake OH", "North Ridgeville OH", "Elyria OH",
  "Lorain OH", "Amherst OH", "Sheffield Lake OH", "Vermilion OH",
  // Cuyahoga County
  "Westlake OH", "Rocky River OH", "Bay Village OH", "Lakewood OH",
  "Fairview Park OH", "North Olmsted OH", "Olmsted Falls OH",
  "Strongsville OH", "Berea OH", "Brook Park OH", "Middleburg Heights OH",
  "Parma OH", "Parma Heights OH", "Brooklyn OH", "Independence OH",
  "Seven Hills OH", "Brecksville OH", "Broadview Heights OH",
  "Euclid OH", "Cleveland Heights OH", "Shaker Heights OH",
  "Solon OH", "Beachwood OH", "Lyndhurst OH", "Mayfield Heights OH",
  // Medina County
  "Medina OH", "Brunswick OH", "Wadsworth OH", "Hinckley OH",
];

const PRESET_QUERIES = [
  // Kitchen remodeling — all cities
  ...CITIES.map((city) => ({ q: `kitchen remodeling ${city}` })),
  // Cabinet refacing — all cities
  ...CITIES.map((city) => ({ q: `cabinet refacing ${city}` })),
  // Cabinet painting — all cities
  ...CITIES.map((city) => ({ q: `cabinet painting ${city}` })),
];

// ── ScrapingBee API call ──────────────────────────────────────────────────────

function fetchAds(query) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    search_type: "ads",
    search: query,
    language: "en",
    country_code: "us",
    nb_results: "10",
  });

  const url = `https://app.scrapingbee.com/api/v1/store/google?${params}`;

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ query, status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ query, status: res.statusCode, body: data });
          }
        });
      })
      .on("error", reject);
  });
}

// ── Output formatter ──────────────────────────────────────────────────────────

function printResult({ query, status, body }) {
  const hr = "─".repeat(72);
  console.log(`\n${hr}`);
  console.log(`QUERY: ${query}  (HTTP ${status})`);
  console.log(hr);

  if (status !== 200) {
    console.log("Error response:", JSON.stringify(body, null, 2));
    return;
  }

  const topAds = body.top_ads || [];
  const bottomAds = body.bottom_ads || [];
  const ads = [...topAds, ...bottomAds];

  if (!ads.length) {
    console.log("  No paid ads running for this query.");
  } else {
    ads.forEach((ad, i) => {
      console.log(`\n  [Ad ${i + 1}]`);
      console.log(`  Headline : ${ad.title || ad.headline || "(none)"}`);
      console.log(`  Display  : ${ad.displayed_url || ad.display_url || "(none)"}`);
      console.log(`  Dest URL : ${ad.url || ad.destination_url || "(none)"}`);
      if (ad.description) console.log(`  Body     : ${ad.description}`);
      if (ad.sitelinks?.length) {
        console.log(`  Sitelinks:`);
        ad.sitelinks.forEach((s) =>
          console.log(`    • ${s.title || s.text} — ${s.url}`)
        );
      }
      if (ad.extensions?.length) {
        console.log(`  Extensions:`);
        ad.extensions.forEach((e) => console.log(`    • ${e}`));
      }
      console.log(`  Position : ${ad.position || "(unknown)"}`);
    });
  }

  const organic = body.organic_results || [];
  const local = body.local_results || [];

  if (organic.length) {
    console.log(`\n  Top organic results:`);
    organic.slice(0, 3).forEach((r, i) =>
      console.log(`    ${i + 1}. ${r.title}\n       ${r.url}`)
    );
  }

  if (local.length) {
    console.log(`\n  Local pack:`);
    local.forEach((r) =>
      console.log(`    • ${r.title || r.name}${r.rating ? "  ★" + r.rating : ""}`)
    );
  }

  console.log(`\n  Summary: ${topAds.length} top ads | ${bottomAds.length} bottom ads | ${organic.length} organic | ${local.length} local pack`);
}

// ── Save JSON output ──────────────────────────────────────────────────────────

function saveJSON(results) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(__dirname, `ads-results-${ts}.json`);
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nFull JSON saved to: ${outPath}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const usePresets = args.includes("--preset") || args.includes("-p");
  const saveJson = args.includes("--save") || args.includes("-s");

  let queries;

  if (usePresets) {
    queries = PRESET_QUERIES.map((p) => p.q);
    console.log(`Running ${queries.length} preset queries...`);
  } else if (args.filter((a) => !a.startsWith("-")).length >= 1) {
    // Free-form: join non-flag args as the query
    const freeArgs = args.filter((a) => !a.startsWith("-"));
    queries = [freeArgs.join(" ")];
  } else {
    console.log(
      "Usage:\n" +
        "  node scraping-bee-ads.js <query>        # single query\n" +
        "  node scraping-bee-ads.js --preset       # run all preset queries\n" +
        "  node scraping-bee-ads.js --preset --save  # also save JSON\n\n" +
        "Examples:\n" +
        '  node scraping-bee-ads.js "kitchen remodeling Westlake OH"\n' +
        '  node scraping-bee-ads.js cabinet refacing Cleveland OH'
    );
    process.exit(0);
  }

  const results = [];
  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    let result;
    try {
      result = await fetchAds(q);
    } catch (err) {
      console.log(`\n  [SKIP] ${q} — network error: ${err.message}`);
      results.push({ query: q, status: 0, body: { error: err.message } });
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }
    printResult(result);
    results.push(result);
    if (queries.length > 1) {
      const delay = (i + 1) % 10 === 0 ? 3000 : 1000; // longer pause every 10 queries
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  if (saveJson) saveJSON(results);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("\nInterrupted — run with --save next time to capture partial results.");
  process.exit(0);
});
