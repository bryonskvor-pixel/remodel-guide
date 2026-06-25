#!/usr/bin/env node
/**
 * ScrapingBee flooring competitive research
 * Usage: node scraping-bee-flooring.js --preset --save
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

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
  console.error("Error: SCRAPINGBEE_API_KEY not set.\nCreate tools/.env with: SCRAPINGBEE_API_KEY=your_key_here");
  process.exit(1);
}

const CITIES = [
  "Westlake OH",
  "Amherst OH",
  "Broadview Heights OH",
  "Brunswick OH",
  "Medina OH",
  "North Ridgeville OH",
  "Strongsville OH",
  "Parma OH",
  "Independence OH",
  "Brecksville OH",
  "Vermilion OH",
  "Olmsted Falls OH",
];

const SERVICES = [
  "LVP flooring",
  "floor leveling",
  "vinyl flooring",
  "waterproof flooring",
  "flooring installation",
  "carpet installation",
  "tile installation",
  "custom shower",
];

const PRESET_QUERIES = CITIES.flatMap((city) =>
  SERVICES.map((service) => `${service} ${city}`)
);

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
        ad.sitelinks.forEach((s) => console.log(`    • ${s.title || s.text} — ${s.url}`));
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

function saveJSON(results) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(__dirname, `flooring-results-${ts}.json`);
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nFull JSON saved to: ${outPath}`);
}

async function main() {
  const args = process.argv.slice(2);
  const usePresets = args.includes("--preset") || args.includes("-p");
  const saveJson = args.includes("--save") || args.includes("-s");

  if (!usePresets) {
    console.log("Usage:\n  node scraping-bee-flooring.js --preset --save");
    process.exit(0);
  }

  console.log(`Running ${PRESET_QUERIES.length} flooring queries across ${CITIES.length} cities...`);
  console.log(`Services: ${SERVICES.join(", ")}\n`);

  const results = [];
  for (let i = 0; i < PRESET_QUERIES.length; i++) {
    const q = PRESET_QUERIES[i];
    console.log(`[${i + 1}/${PRESET_QUERIES.length}] ${q}`);
    let result;
    try {
      result = await fetchAds(q);
    } catch (err) {
      console.log(`  [SKIP] network error: ${err.message}`);
      results.push({ query: q, status: 0, body: { error: err.message } });
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }
    printResult(result);
    results.push(result);
    const delay = (i + 1) % 10 === 0 ? 3000 : 1000;
    await new Promise((r) => setTimeout(r, delay));
  }

  if (saveJson) saveJSON(results);

  console.log(`\nDone. ${results.length} queries completed.`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("\nInterrupted — run with --save to capture partial results.");
  process.exit(0);
});
