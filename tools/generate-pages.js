#!/usr/bin/env node
/**
 * City page generator for remodel.guide
 * Usage: node tools/generate-pages.js [--dry-run]
 *
 * Reads Westlake templates, substitutes city data, writes new city pages.
 * Skips cities already built. Updates sitemap.xml when done.
 * Nav and footer come from tools/lib/partials.js — edit there to update all pages.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const { stampNav, stampFooter } = require('./lib/partials');

const ROOT     = path.join(__dirname, '..');
const DRY_RUN  = process.argv.includes('--dry-run');

// ── Already-built cities (skip these) ────────────────────────────────────────

const ALREADY_BUILT = new Set([
  'westlake','amherst','broadview-heights','brunswick',
  'medina','north-ridgeville','strongsville',
]);

// ── City data ─────────────────────────────────────────────────────────────────

const CITIES = [
  // ── Lorain County ──────────────────────────────────────────────────────────
  { name:'Avon', slug:'avon', county:'Lorain County',
    nearby:[{name:'Avon Lake',slug:'avon-lake'},{name:'North Ridgeville',slug:'north-ridgeville'},{name:'Westlake',slug:'westlake'},{name:'North Olmsted',slug:'north-olmsted'},{name:'Sheffield Lake',slug:'sheffield-lake'}],
    kitchenHood:'Stoney Ridge, Towne Center, Chester Road, Nagel Road...',
    flooringHood:'Stoney Ridge, Towne Center, Chester Road, Nagel Road...',
    kitchenProse:`<h3>New Construction Prices, Builder-Grade Finishes</h3>
      <p>Avon has become one of the fastest-growing communities in Lorain County, with developments along Stoney Ridge Road, Detroit Road, and the SR-254 corridor attracting families who expect a premium product. The problem is that production homebuilders delivering homes in the $350,000–$600,000 range are still fitting them with the same basic kitchen package that went into $220,000 houses fifteen years ago — medium-density MDF doors in a dated shaker style, laminate countertops, and stock tile backsplashes that look like a hotel renovation.</p>
      <p>Our process was built for exactly this situation. You shouldn't have to gut a five-year-old kitchen because the builder chose stock finishes — and you don't need to spend $80,000 on a full renovation to get the look you actually wanted when you moved in. We come to you, evaluate what's there honestly, and walk you through targeted upgrades that deliver a genuine designer result without a structural gut-job.</p>`,
    flooringProse:`<h3>Builder-Grade Floors Across Every Avon Development</h3>
      <p>Avon's rapid residential growth means thousands of homes built in the last decade with production-grade flooring that's already showing wear. Builder LVP in high-traffic zones. Carpet in bedrooms that wasn't specified for real use. Older subdivisions near Detroit Road with vinyl and carpet from the early 2000s that's past its useful life.</p>
      <p>Full-service installation means we handle it from the first visit through the final walkthrough — measure, select, prep, install, and clean up. You don't coordinate a flooring store, a separate installer, and a subfloor crew. One team, one point of contact, and a firm schedule.</p>`,
  },

  { name:'Avon Lake', slug:'avon-lake', county:'Lorain County',
    nearby:[{name:'Avon',slug:'avon'},{name:'Sheffield Lake',slug:'sheffield-lake'},{name:'Westlake',slug:'westlake'},{name:'Bay Village',slug:'bay-village'},{name:'North Ridgeville',slug:'north-ridgeville'}],
    kitchenHood:'Avon Beach, Moore Road, Lake Road, Walker Road...',
    flooringHood:'Avon Beach, Moore Road, Lake Road, Walker Road...',
    kitchenProse:`<h3>Established Lakefront Character, Dated Kitchen Finishes</h3>
      <p>Avon Lake's lakefront location and established residential neighborhoods have made it a consistently desirable address for decades. The housing stock reflects that — well-built homes from the 1970s through the 2000s on reasonable lots, many within walking distance of the lake. What most of them also share is a kitchen that hasn't been touched since original construction: basic wood-tone cabinetry in colors that were fashionable in 1995, laminate or tile countertops, and layouts that work fine but look a generation behind.</p>
      <p>A kitchen that looks dated in an Avon Lake home at an Avon Lake price point is a problem worth solving — and it doesn't require moving into a hotel while a contractor rebuilds your kitchen from the studs out. We come to you, assess your specific boxes and surfaces honestly, and walk you through every option without showroom pressure.</p>`,
    flooringProse:`<h3>Lakefront Homes with Twenty-Year-Old Floors</h3>
      <p>Avon Lake's residential neighborhoods were built primarily across three decades, and a significant portion of the housing stock is now at the point where original flooring — builder carpet, older vinyl, and early-generation laminate — is well past replacement time. Salt air and humidity from the lake accelerate wear on materials that weren't specified for coastal environments.</p>
      <p>We bring flooring samples to you, assess your subfloor on the first visit, and give you a written quote that includes everything: demo, haul away, subfloor prep, and installation. No surprises on install day, and a firm timeline.</p>`,
  },

  { name:'Elyria', slug:'elyria', county:'Lorain County',
    nearby:[{name:'Amherst',slug:'amherst'},{name:'Lorain',slug:'lorain'},{name:'North Ridgeville',slug:'north-ridgeville'},{name:'Avon',slug:'avon'},{name:'Sheffield Lake',slug:'sheffield-lake'}],
    kitchenHood:'Cascade, South Elyria, West River, Hickory Hills, Lake Avenue...',
    flooringHood:'Cascade, South Elyria, West River, Hickory Hills, Lake Avenue...',
    kitchenProse:`<h3>A Wide Range of Housing Eras, One Common Kitchen Problem</h3>
      <p>Elyria's housing stock spans nearly a century — from well-built early twentieth-century homes in the near-west neighborhoods to 1950s Cape Cods, 1970s split-levels in South Elyria, and the ranch and colonial developments that expanded the city through the 1980s and 90s. What runs across almost all of them is a kitchen that reflects the era it was built in: tile countertops from the 80s, golden oak cabinets from the 90s, or laminate that was installed during a quick flip and never updated since.</p>
      <p>The in-home visit is designed around your actual kitchen, not a showroom scenario. We look at the boxes honestly and walk you through every option without pressure. A written estimate based on what we actually found, not a national average from a website.</p>`,
    flooringProse:`<h3>Older Housing Stock, Real Flooring Needs</h3>
      <p>Elyria's diverse housing inventory — bungalows, ranches, split-levels, and colonials from multiple eras — means flooring situations that vary significantly from home to home. Original hardwood in need of refinishing. Vinyl over concrete that needs subfloor assessment before anything goes on top. Carpet that's been through multiple owners and isn't recoverable with cleaning.</p>
      <p>Full-service means we measure the space, assess the subfloor, bring samples to your home, and give you a written quote that covers everything from demo through installation.</p>`,
  },

  { name:'Lorain', slug:'lorain', county:'Lorain County',
    nearby:[{name:'Elyria',slug:'elyria'},{name:'Amherst',slug:'amherst'},{name:'Sheffield Lake',slug:'sheffield-lake'},{name:'Vermilion',slug:'vermilion'},{name:'Avon Lake',slug:'avon-lake'}],
    kitchenHood:'Lakeview, South Lorain, Riverside, Homewood, Broadway...',
    flooringHood:'Lakeview, South Lorain, Riverside, Homewood, Broadway...',
    kitchenProse:`<h3>Solid Bones, Outdated Finishes</h3>
      <p>Lorain's residential neighborhoods reflect the city's industrial history — well-built single-family homes from the 1920s through the 1960s in the lakeside and near-westside areas, and ranch and colonial development that expanded through the 70s and 80s. These are structurally sound properties with good layouts. The kitchens, in most cases, haven't been meaningfully updated since original construction: laminate cabinetry, tile counters, and flooring that's been layered and patched over the years.</p>
      <p>A targeted cosmetic update can transform the look and function of one of these kitchens without the cost and disruption of a structural gut job. The in-home visit lets us assess what's there honestly and give you a written estimate based on your actual space.</p>`,
    flooringProse:`<h3>Layered Floors and Subfloor Surprises</h3>
      <p>Lorain homes often have multiple generations of flooring — original hardwood under linoleum under vinyl, or concrete slabs with decades of patched tile. Getting the subfloor right before a new floor goes down is particularly important in this housing stock, and it requires an in-home assessment rather than a website quote.</p>
      <p>We assess the subfloor as part of every quote visit, include any necessary prep work in the written estimate, and don't discover surprises on install day.</p>`,
  },

  { name:'Sheffield Lake', slug:'sheffield-lake', county:'Lorain County',
    nearby:[{name:'Avon Lake',slug:'avon-lake'},{name:'Lorain',slug:'lorain'},{name:'Avon',slug:'avon'},{name:'Vermilion',slug:'vermilion'},{name:'Bay Village',slug:'bay-village'}],
    kitchenHood:'Lake Road, Harris Road, Abbe Road, Lake Shore Drive...',
    flooringHood:'Lake Road, Harris Road, Abbe Road, Lake Shore Drive...',
    kitchenProse:`<h3>Compact Lakefront Homes with Kitchens That Haven't Kept Up</h3>
      <p>Sheffield Lake sits on a compact stretch of Lake Erie shoreline, and its housing stock reflects the community's character — modest, well-maintained single-family homes from the 1950s through the 1980s, most on reasonable lots close to the water. These are homes that have been cared for, but the kitchens often haven't seen meaningful updates in decades: tile countertops, laminate cabinetry in dated tones, and layouts that are functional but look nothing like what a kitchen should in today's market.</p>
      <p>You don't need a full demolition to address this. A cabinet tune-up, new countertops, and updated finishes can completely change how these kitchens look and feel. We come to you, assess the boxes honestly, and walk you through every option from a targeted refresh to a full cosmetic overhaul.</p>`,
    flooringProse:`<h3>Older Homes, Aging Floors</h3>
      <p>Sheffield Lake's housing stock skews toward homes built in the postwar decades, and the flooring in most of these properties is at or past its useful life. Original hardwood that hasn't been refinished in years. Vinyl layered over tile layered over concrete. Carpet that's been through multiple owners.</p>
      <p>We measure the space, assess the subfloor, bring samples to your home, and include all necessary prep in the written estimate. No separate subfloor crew, no surprises on install day.</p>`,
  },

  { name:'Vermilion', slug:'vermilion', county:'Lorain County',
    nearby:[{name:'Sheffield Lake',slug:'sheffield-lake'},{name:'Lorain',slug:'lorain'},{name:'Amherst',slug:'amherst'},{name:'Elyria',slug:'elyria'},{name:'Avon Lake',slug:'avon-lake'}],
    kitchenHood:'Harbour Town, Lagoon Drive, Titus Road, Victory Road...',
    flooringHood:'Harbour Town, Lagoon Drive, Titus Road, Victory Road...',
    kitchenProse:`<h3>Two Distinct Housing Markets, One Common Kitchen Problem</h3>
      <p>Vermilion presents an unusual residential split — the historic Harbour Town district near the river mouth features older homes with genuine architectural character, while the city's south side has seen substantial newer residential development over the past two decades. What both areas share is a kitchen that typically hasn't kept pace with the rest of the home: dated cabinetry, tile or laminate counters, and finishes that read as the era they were installed in.</p>
      <p>We serve both sides of this market — the older homes that need careful assessment before any cosmetic work, and the newer construction that got builder-grade finishes at a premium price. The in-home visit starts with an honest look at the boxes and surfaces.</p>`,
    flooringProse:`<h3>Coastal Wear and Aging Residential Floors</h3>
      <p>Vermilion's proximity to Lake Erie creates a humidity and moisture environment that accelerates flooring wear — carpet holds odors, hardwood expands and contracts, and vinyl installed in the 1990s is typically well past its lifespan. The Harbour Town area's older homes often have original hardwood under multiple layers of patching.</p>
      <p>Subfloor assessment is part of every quote visit. We tell you what's there, what's needed, and what it costs — all in the written estimate before any work begins.</p>`,
  },

  // ── Cuyahoga County ─────────────────────────────────────────────────────────
  { name:'Rocky River', slug:'rocky-river', county:'Cuyahoga County',
    nearby:[{name:'Westlake',slug:'westlake'},{name:'Bay Village',slug:'bay-village'},{name:'Fairview Park',slug:'fairview-park'},{name:'Lakewood',slug:'lakewood'},{name:'North Olmsted',slug:'north-olmsted'}],
    kitchenHood:'Detroit Road, Wooster Road, Riverside Drive, Lake Road...',
    flooringHood:'Detroit Road, Wooster Road, Riverside Drive, Lake Road...',
    kitchenProse:`<h3>Established Riverside Character, Kitchens That Haven't Kept Up</h3>
      <p>Rocky River's established neighborhoods and riverside setting have made it one of Cuyahoga County's most sought-after addresses for decades. The housing stock reflects that history — well-built homes from the 1920s through the 1970s on tree-lined streets near the river. What many of these homes share is a kitchen that was last updated in a different design era: tile countertops from the 80s, raised-panel oak cabinets from the 90s, and layouts that work but look nothing like what the rest of the home deserves.</p>
      <p>We come to you, assess what's there honestly — whether the boxes are worth refacing, whether the countertop can be updated without a full demo — and walk you through every option without showroom pressure. A written estimate based on your actual kitchen.</p>`,
    flooringProse:`<h3>Older Homes, Original Floors</h3>
      <p>Rocky River's housing stock includes a significant number of homes built in the 1940s through the 1970s, many of which have original hardwood flooring in various states of condition, along with decades of overlay vinyl, older carpet, and tile in kitchens and baths. Getting a flooring project right in these homes starts with understanding what's actually under the existing surface.</p>
      <p>Full-service means we do the assessment on the first visit, include subfloor prep in the written quote, and handle the project from demo through installation with a firm timeline.</p>`,
  },

  { name:'Bay Village', slug:'bay-village', county:'Cuyahoga County',
    nearby:[{name:'Westlake',slug:'westlake'},{name:'Avon Lake',slug:'avon-lake'},{name:'Rocky River',slug:'rocky-river'},{name:'Sheffield Lake',slug:'sheffield-lake'},{name:'Fairview Park',slug:'fairview-park'}],
    kitchenHood:'Wolf Road, Dover Center Road, Lake Road, Bradley Road...',
    flooringHood:'Wolf Road, Dover Center Road, Lake Road, Bradley Road...',
    kitchenProse:`<h3>Well-Maintained Homes, Kitchens Left Behind</h3>
      <p>Bay Village is a compact lakefront community with some of Cuyahoga County's most consistently maintained housing stock — residents who stay for decades, homes that are cared for, and a community character that values quality. The kitchens in many of these homes, however, haven't been meaningfully updated since the 1980s or 1990s: tile countertops, older cabinetry in formats that read as dated, and finishes that don't match the care that's gone into the rest of the property.</p>
      <p>A home at Bay Village price points deserves a kitchen that matches. We come to you, evaluate the boxes and surfaces honestly, and walk you through every option from a cabinet refresh to a full cosmetic overhaul — without showroom pressure or structural demolition you don't need.</p>`,
    flooringProse:`<h3>Lakefront Humidity and Aging Original Floors</h3>
      <p>Bay Village's proximity to Lake Erie means a humidity environment that accelerates flooring wear — hardwood that expands seasonally, carpet that holds moisture and odors, and vinyl that delaminates at the edges over time. Many homes in the older neighborhoods near the lake are on their second or third generation of floor covering, with subfloors that need assessment before any new product goes down.</p>
      <p>We assess the subfloor as part of every quote visit, include all necessary prep in the written estimate, and schedule the project around your household.</p>`,
  },

  { name:'Lakewood', slug:'lakewood', county:'Cuyahoga County',
    nearby:[{name:'Rocky River',slug:'rocky-river'},{name:'Fairview Park',slug:'fairview-park'},{name:'Cleveland Heights',slug:'cleveland-heights'},{name:'Brooklyn',slug:'brooklyn'},{name:'Parma Heights',slug:'parma-heights'}],
    kitchenHood:'Gold Coast, Birdtown, Lake Avenue, Madison Avenue, Detroit Avenue...',
    flooringHood:'Gold Coast, Birdtown, Lake Avenue, Madison Avenue, Detroit Avenue...',
    kitchenProse:`<h3>Pre-War Architecture, Post-War Kitchen Finishes</h3>
      <p>Lakewood is one of Ohio's most densely populated cities, with the majority of its housing stock built between the 1920s and the 1950s. These are well-constructed homes with solid bones, original architectural detail in many cases, and kitchen spaces that have been updated — sometimes well, sometimes not — across multiple ownerships. The common situation: cabinetry from a 1980s or 90s update, laminate or tile countertops, and a layout that works fine but looks twenty years behind.</p>
      <p>Urban homes like these don't need a structural gut-job to look dramatically better. A cabinet refresh, new countertops, and a backsplash update can completely transform a Lakewood kitchen in a week. The in-home visit determines exactly what's possible in your specific space.</p>`,
    flooringProse:`<h3>Original Hardwood Under Everything</h3>
      <p>Lakewood's pre-war housing stock frequently has original hardwood flooring — in varying states of condition — under layers of vinyl, linoleum, and older carpet. The first question in almost every Lakewood flooring project is what's underneath, and that requires an in-person assessment before any product recommendation makes sense.</p>
      <p>We assess the full situation on the first visit — what's there, what's under it, what the subfloor looks like — and give you a written estimate that covers the actual scope of work.</p>`,
  },

  { name:'Fairview Park', slug:'fairview-park', county:'Cuyahoga County',
    nearby:[{name:'Rocky River',slug:'rocky-river'},{name:'North Olmsted',slug:'north-olmsted'},{name:'Olmsted Falls',slug:'olmsted-falls'},{name:'Lakewood',slug:'lakewood'},{name:'Brook Park',slug:'brook-park'}],
    kitchenHood:'Lorain Road, Mastick Road, West 220th, Brook Park Road...',
    flooringHood:'Lorain Road, Mastick Road, West 220th, Brook Park Road...',
    kitchenProse:`<h3>Postwar Suburb, Original-Era Kitchens</h3>
      <p>Fairview Park developed primarily during the postwar suburban expansion of the 1950s through the 1970s, and the housing stock reflects that era — solid ranch homes, split-levels, and colonials with well-established layouts. Many of these homes received a cosmetic update in the 1990s — laminate cabinetry, tile counters, vinyl flooring — and that update is now itself outdated.</p>
      <p>Two generations of cosmetic overlay doesn't require a structural gut-job to address. The in-home visit lets us see exactly what's there and walk you through every option, with a written estimate based on your actual kitchen.</p>`,
    flooringProse:`<h3>Split-Levels and Ranches with Layered Floors</h3>
      <p>Fairview Park's postwar housing stock typically has flooring histories that span several decades — original hardwood covered by vinyl covered by carpet, or concrete subfloors that have never been properly assessed before the latest layer went down. Getting a new floor right in these homes starts with the subfloor.</p>
      <p>We assess the subfloor on the first visit, include any leveling or prep work in the written estimate, and manage the project from demo through installation.</p>`,
  },

  { name:'North Olmsted', slug:'north-olmsted', county:'Cuyahoga County',
    nearby:[{name:'Westlake',slug:'westlake'},{name:'Olmsted Falls',slug:'olmsted-falls'},{name:'Fairview Park',slug:'fairview-park'},{name:'North Ridgeville',slug:'north-ridgeville'},{name:'Avon',slug:'avon'}],
    kitchenHood:'Great Northern, Lorain Road, Clague Road, Burns Road...',
    flooringHood:'Great Northern, Lorain Road, Clague Road, Burns Road...',
    kitchenProse:`<h3>Transitional Suburb, Kitchens from Three Different Eras</h3>
      <p>North Olmsted occupies the transitional zone between the established western Cuyahoga suburbs and the newer Lorain County developments, and its housing stock reflects that breadth — homes from the 1950s and 60s near the Great Northern corridor, 1970s and 80s development in the residential neighborhoods, and some newer construction on the outer edges. Kitchens across this range share a common characteristic: finishes that reflect the era they were installed in, not the era the homeowner is living in now.</p>
      <p>The in-home visit addresses exactly this. We look at the boxes and surfaces honestly, determine what's worth preserving and what needs updating, and walk you through every option at every price level — without a showroom trip or a structural gut-job.</p>`,
    flooringProse:`<h3>Multiple Housing Eras, Multiple Flooring Situations</h3>
      <p>North Olmsted's housing range means flooring situations that vary widely from block to block — original hardwood in older homes that may or may not be refinishable, production LVP in newer builds that was under-specified for actual use, and everything in between. Subfloor conditions vary accordingly.</p>
      <p>We measure, assess the subfloor, bring samples, and include all necessary prep in the written estimate. One team from the first visit through the final walkthrough.</p>`,
  },

  { name:'Olmsted Falls', slug:'olmsted-falls', county:'Cuyahoga County',
    nearby:[{name:'North Olmsted',slug:'north-olmsted'},{name:'Strongsville',slug:'strongsville'},{name:'Berea',slug:'berea'},{name:'Middleburg Heights',slug:'middleburg-heights'},{name:'Fairview Park',slug:'fairview-park'}],
    kitchenHood:'Downtown Olmsted Falls, Columbia Road, Bagley Road, Cook Road...',
    flooringHood:'Downtown Olmsted Falls, Columbia Road, Bagley Road, Cook Road...',
    kitchenProse:`<h3>Small-Town Character, Real Kitchen Needs</h3>
      <p>Olmsted Falls maintains a genuine small-town character while sitting directly adjacent to the major southwestern Cuyahoga corridor. The housing stock is a mix — older homes on the original village streets with genuine architectural character, and newer residential developments built for families who want a quieter setting. Both categories typically have kitchens that haven't been meaningfully updated in fifteen to twenty-five years.</p>
      <p>We come to you regardless of which side of the community you're in — assess the boxes honestly, walk through every option, and provide a written estimate based on what we actually found. No showroom required to get started.</p>`,
    flooringProse:`<h3>Village Character and Suburb Mix</h3>
      <p>Olmsted Falls' mix of original village homes and newer suburban development means flooring situations that span from original hardwood needing refinishing to builder-grade LVP in newer homes that wasn't specified for real use. The subfloor story differs significantly between the two — older homes frequently need leveling before new flooring goes down.</p>
      <p>Subfloor assessment is part of every quote visit, and any necessary prep is in the written estimate before you commit to anything.</p>`,
  },

  { name:'Berea', slug:'berea', county:'Cuyahoga County',
    nearby:[{name:'Olmsted Falls',slug:'olmsted-falls'},{name:'Brook Park',slug:'brook-park'},{name:'Middleburg Heights',slug:'middleburg-heights'},{name:'Strongsville',slug:'strongsville'},{name:'Parma Heights',slug:'parma-heights'}],
    kitchenHood:'Berea Triangle, West Bagley Road, Eastland Road, Barrett Road...',
    flooringHood:'Berea Triangle, West Bagley Road, Eastland Road, Barrett Road...',
    kitchenProse:`<h3>College Town Housing Stock with Real-World Kitchen Needs</h3>
      <p>Berea's housing market spans several distinct eras — the well-built older stock near Baldwin Wallace University dates to the early twentieth century, with craftsman bungalows and solid two-stories that have good bones and dated kitchens. The outlying neighborhoods added through the 1970s and 80s are predominantly ranch and split-level construction with original-era kitchen finishes in most cases.</p>
      <p>The services we offer here are identical to what we bring to any other community — a free in-home consultation, an honest assessment of what's there, and a written estimate across every scope level. The recommendation you get is based on your specific kitchen, not a national average.</p>`,
    flooringProse:`<h3>Pre-War Bungalows to Postwar Ranches</h3>
      <p>Berea's range of housing eras means flooring assessment is particularly important before product selection. Older homes near the university frequently have original hardwood — some refinishable, some not — under multiple overlay generations. Postwar ranch construction often has concrete subfloors in kitchens and lower levels that need moisture testing before any floating floor goes down.</p>
      <p>We assess the full situation on the first visit and put the necessary prep into the written estimate so there's no day-of-installation discovery of additional costs.</p>`,
  },

  { name:'Brook Park', slug:'brook-park', county:'Cuyahoga County',
    nearby:[{name:'Berea',slug:'berea'},{name:'Parma',slug:'parma'},{name:'Middleburg Heights',slug:'middleburg-heights'},{name:'Fairview Park',slug:'fairview-park'},{name:'North Olmsted',slug:'north-olmsted'}],
    kitchenHood:'Brook Park Road, Smith Road, Engle Road, Brookpark Road...',
    flooringHood:'Brook Park Road, Smith Road, Engle Road, Brookpark Road...',
    kitchenProse:`<h3>Working-Class Construction, Solid Bones</h3>
      <p>Brook Park's residential neighborhoods developed primarily to house the industrial workforce that settled near the airport and manufacturing corridor during the 1950s and 1960s — compact, well-built single-family homes with efficient layouts and durable construction. Kitchens in these homes reflect that era: functional layouts with original-era cabinetry, older countertop materials, and finishes that haven't been updated since the house was new or since a quick update in the 80s or 90s.</p>
      <p>A targeted cosmetic update can transform one of these kitchens completely without structural work. The in-home visit lets us see exactly what's there and walk you through every option — cabinet painting, refacing, new countertops — at every budget level, with a written estimate based on your actual space.</p>`,
    flooringProse:`<h3>Mid-Century Homes with Dated Floors</h3>
      <p>Brook Park's mid-century housing stock typically has original hardwood in living areas under carpet or vinyl, and concrete subfloors in kitchens that may have moisture concerns before new flooring goes down. Assessment before product selection matters more than in newer homes where the subfloor is a known quantity.</p>
      <p>Subfloor assessment is part of every quote visit, included at no charge, with any necessary prep built into the estimate before you commit.</p>`,
  },

  { name:'Middleburg Heights', slug:'middleburg-heights', county:'Cuyahoga County',
    nearby:[{name:'Berea',slug:'berea'},{name:'Brook Park',slug:'brook-park'},{name:'Strongsville',slug:'strongsville'},{name:'Olmsted Falls',slug:'olmsted-falls'},{name:'Parma Heights',slug:'parma-heights'}],
    kitchenHood:'Engle Road, Big Creek Parkway, Sheldon Road, Tiedeman Road...',
    flooringHood:'Engle Road, Big Creek Parkway, Sheldon Road, Tiedeman Road...',
    kitchenProse:`<h3>Suburban Construction at the Cosmetic Update Threshold</h3>
      <p>Middleburg Heights is a compact, well-established suburb that developed primarily through the 1970s and 1980s, and a significant portion of its housing stock is now reaching — or past — the point where the original kitchen finishes need addressing. Colonial and ranch homes on established lots with sound structural layouts and dated cosmetic finishes: raised-panel oak cabinetry, tile countertops, and vinyl flooring that was new when the house was built.</p>
      <p>This is exactly the situation where a cosmetic overhaul delivers the most value — the structural investment has already been made, and a targeted update to surfaces and finishes produces a result that reads as a completely transformed kitchen. The in-home visit determines exactly what that looks like in your specific space and budget.</p>`,
    flooringProse:`<h3>1970s and 80s Construction, Flooring at Replacement Time</h3>
      <p>Middleburg Heights homes built in the 1970s and 80s have flooring that is in most cases at or past the end of its useful life — carpet that's been cleaned but not improved, vinyl that's cracking at the seams, and older tile that has seen better decades. The subfloors under this generation of flooring often need leveling compound before a new floor lays correctly.</p>
      <p>We include subfloor prep in the written estimate and give you a firm project timeline before any work begins.</p>`,
  },

  { name:'Parma', slug:'parma', county:'Cuyahoga County',
    nearby:[{name:'Parma Heights',slug:'parma-heights'},{name:'Brooklyn',slug:'brooklyn'},{name:'Brook Park',slug:'brook-park'},{name:'Seven Hills',slug:'seven-hills'},{name:'Independence',slug:'independence'}],
    kitchenHood:'Ridgewood, Parma Crest, West Ridgewood, Pleasant Valley Road...',
    flooringHood:'Ridgewood, Parma Crest, West Ridgewood, Pleasant Valley Road...',
    kitchenProse:`<h3>Ohio's Largest Suburb Has a Kitchen Problem</h3>
      <p>Parma is the largest suburb in Ohio by population, and the majority of its housing stock was built during the 1950s and 1960s when the city grew explosively into a residential center for Cleveland's industrial workforce. These are well-constructed homes with solid structural bones — the kitchen layouts typically work fine. The problem is the surfaces: golden oak raised-panel cabinets from the late 80s and early 90s, tile countertops that were fashionable in 1988, and vinyl or linoleum flooring that has been layered over multiple times.</p>
      <p>Parma homeowners don't have to choose between living with a dated kitchen and spending $60,000 on a structural gut-job. A targeted cosmetic update delivers a dramatic result at a fraction of that cost. The in-home visit determines exactly what that scope looks like in your specific kitchen.</p>`,
    flooringProse:`<h3>Mid-Century Homes with Multiple Flooring Generations</h3>
      <p>Parma's vast mid-century housing stock means thousands of homes with flooring histories that span several decades — original hardwood under linoleum under vinyl, or concrete basement slabs that have never been properly evaluated before a floor went down.</p>
      <p>We assess the subfloor on the first visit, include all necessary prep in the written estimate, and schedule the project around your household. Firm timeline, one point of contact, no surprises.</p>`,
  },

  { name:'Parma Heights', slug:'parma-heights', county:'Cuyahoga County',
    nearby:[{name:'Parma',slug:'parma'},{name:'Middleburg Heights',slug:'middleburg-heights'},{name:'Berea',slug:'berea'},{name:'Lakewood',slug:'lakewood'},{name:'Brooklyn',slug:'brooklyn'}],
    kitchenHood:'York Road, Stumph Road, Pearl Road, Broadview Road...',
    flooringHood:'York Road, Stumph Road, Pearl Road, Broadview Road...',
    kitchenProse:`<h3>Southwest Suburb, Kitchens at the Update Point</h3>
      <p>Parma Heights sits at the center of the southwest suburban cluster, with a housing profile dominated by well-built but cosmetically dated 1960s and 1970s construction. The homes are solid — ranch and colonial footprints with good layout logic and durable construction — but the kitchens frequently haven't been meaningfully updated since a quick cosmetic refresh in the 1990s that now itself reads as dated.</p>
      <p>A targeted cosmetic update in a kitchen like this delivers a dramatic visual result without the structural cost. The in-home visit determines exactly what makes sense for your specific boxes and surfaces, and provides a written estimate across every scope level.</p>`,
    flooringProse:`<h3>Solid Postwar Homes with Dated Floor Surfaces</h3>
      <p>Parma Heights' postwar housing stock typically has original hardwood in living areas — in varying states — and a kitchen flooring history that involves multiple overlay generations. Subfloor assessment before product selection is particularly important in homes from this era.</p>
      <p>Assessment is part of every quote visit. Any necessary prep is in the written estimate before you make any decisions.</p>`,
  },

  { name:'Brooklyn', slug:'brooklyn', county:'Cuyahoga County',
    nearby:[{name:'Parma Heights',slug:'parma-heights'},{name:'Parma',slug:'parma'},{name:'Lakewood',slug:'lakewood'},{name:'Independence',slug:'independence'},{name:'Seven Hills',slug:'seven-hills'}],
    kitchenHood:'Tuxedo Avenue, Memphis Avenue, Ridge Road, Broadview Road...',
    flooringHood:'Tuxedo Avenue, Memphis Avenue, Ridge Road, Broadview Road...',
    kitchenProse:`<h3>Dense Urban Suburb, Honest Kitchen Assessments</h3>
      <p>Brooklyn's modest scale and location between Parma and Lakewood mean its housing stock is dense, older, and dominated by mid-century single-family homes. These are homes that get used hard and don't typically see major cosmetic investment — which means most kitchens are working from original or very early-update finishes. Solid structural bones, dated surfaces, and an opportunity for a targeted update that delivers far more visual impact than the cost suggests.</p>
      <p>We assess these kitchens the same way we assess any kitchen — honestly, in person, with a written estimate based on what's actually there. No minimum scope requirement, no showroom visit required.</p>`,
    flooringProse:`<h3>Original Mid-Century Floors</h3>
      <p>Brooklyn's mid-century housing stock frequently has original hardwood in living areas under whatever was installed on top of it — and that varies considerably. Assessment on the first visit determines what's actually there and what the subfloor needs before any new product goes down.</p>
      <p>We include all necessary prep in the written estimate and don't discover subfloor issues on installation day.</p>`,
  },

  { name:'Independence', slug:'independence', county:'Cuyahoga County',
    nearby:[{name:'Seven Hills',slug:'seven-hills'},{name:'Parma',slug:'parma'},{name:'Brooklyn',slug:'brooklyn'},{name:'Brecksville',slug:'brecksville'},{name:'Broadview Heights',slug:'broadview-heights'}],
    kitchenHood:'Hillside, Quarry Lane, Brecksville Road, Rockside Road...',
    flooringHood:'Hillside, Quarry Lane, Brecksville Road, Rockside Road...',
    kitchenProse:`<h3>Quality Construction, Kitchens That Haven't Kept Pace</h3>
      <p>Independence is one of Cuyahoga County's most commercially active suburban communities, and its residential neighborhoods — particularly in the hillside areas east of the freeway — feature quality construction from the 1970s through the 1990s. These are well-built homes at solid price points, and the kitchens in many of them haven't been meaningfully updated since original construction: raised-panel cabinetry, tile countertops, and layouts that work but read as a previous design era.</p>
      <p>A kitchen at an Independence price point deserves to look like one. The in-home visit lets us assess exactly what's there and walk you through every option — from a targeted cabinet refresh to a complete surface overhaul — with a written estimate that reflects your actual kitchen.</p>`,
    flooringProse:`<h3>Quality Homes with Original Floor Systems</h3>
      <p>Independence's residential construction from the 1970s through the 90s typically features solid subfloor construction and original hardwood in living areas in many properties. The question is often condition — hardwood that's been refinished once too many times, or LVP installed over a subfloor that wasn't properly assessed first.</p>
      <p>Assessment is part of every quote visit, and any preparation work is in the written estimate before installation begins.</p>`,
  },

  { name:'Seven Hills', slug:'seven-hills', county:'Cuyahoga County',
    nearby:[{name:'Independence',slug:'independence'},{name:'Parma',slug:'parma'},{name:'Brecksville',slug:'brecksville'},{name:'Broadview Heights',slug:'broadview-heights'},{name:'Parma Heights',slug:'parma-heights'}],
    kitchenHood:'Broadview Road, Wallings Road, Hillside Road, Smiley Road...',
    flooringHood:'Broadview Road, Wallings Road, Hillside Road, Smiley Road...',
    kitchenProse:`<h3>Hillside Community with 1960s-Era Kitchens</h3>
      <p>Seven Hills' hilly terrain and established neighborhoods were built out primarily in the 1960s and 1970s, resulting in a housing stock of colonial and ranch homes with solid structural integrity and kitchens that haven't been updated in decades. The characteristic situation: original raised-panel cabinetry in golden oak or white laminate tones, tile or laminate countertops, and flooring that's been patched or layered over the years.</p>
      <p>Updating the surfaces in these kitchens — without touching the structural layout that already works — is exactly what we do. The in-home visit determines the right scope for your specific kitchen and provides a written estimate across every option.</p>`,
    flooringProse:`<h3>Established Neighborhoods with Aging Floor Systems</h3>
      <p>Seven Hills' 1960s and 70s construction typically includes original hardwood in living areas under various overlay generations, and kitchen and lower-level concrete subfloors that need proper assessment before any floating floor goes down. The hilly terrain can also mean moisture management concerns in lower levels.</p>
      <p>We assess the full situation on the first visit, include any necessary prep in the written estimate, and give you a firm project schedule.</p>`,
  },

  { name:'Brecksville', slug:'brecksville', county:'Cuyahoga County',
    nearby:[{name:'Broadview Heights',slug:'broadview-heights'},{name:'Seven Hills',slug:'seven-hills'},{name:'Independence',slug:'independence'},{name:'Strongsville',slug:'strongsville'},{name:'Brunswick',slug:'brunswick'}],
    kitchenHood:'Brecksville Road, Snowville Road, Mill Road, Highland Drive...',
    flooringHood:'Brecksville Road, Snowville Road, Mill Road, Highland Drive...',
    kitchenProse:`<h3>Wooded Lots, Premium Homes, Finishes That Don't Match</h3>
      <p>Brecksville is one of Cuyahoga County's most desirable suburban addresses, with heavily wooded lots, strong school ratings, and residential construction that spans from the 1960s to the present. Homes here command premium valuations — and a kitchen that looks like it was last updated in 1997 doesn't match what the property is worth in today's market. The common situation: well-built colonial and ranch homes with dated raised-panel cabinetry, original or once-updated countertops, and a layout that works but reads as a previous design era.</p>
      <p>A targeted cosmetic overhaul — new cabinet fronts, quartz countertops, backsplash — delivers a dramatic result without structural demolition. The in-home visit determines exactly what that looks like in your specific kitchen and provides a written estimate across every scope level.</p>`,
    flooringProse:`<h3>Premium Community, Variable Floor Conditions</h3>
      <p>Brecksville homes range from 1960s colonials to newer custom construction, and the flooring situations vary accordingly — original hardwood in older homes that may need refinishing, builder-grade LVP in newer builds that wasn't specified for serious use, and everything in between.</p>
      <p>Assessment is part of every quote visit. Subfloor prep, if needed, is in the written estimate before you commit to any product or scope.</p>`,
  },

  { name:'Euclid', slug:'euclid', county:'Cuyahoga County',
    nearby:[{name:'Lyndhurst',slug:'lyndhurst'},{name:'Cleveland Heights',slug:'cleveland-heights'},{name:'Mayfield Heights',slug:'mayfield-heights'},{name:'Beachwood',slug:'beachwood'},{name:'Shaker Heights',slug:'shaker-heights'}],
    kitchenHood:'Euclid Beach, Lakeshore Blvd, East 222nd, Chardon Road...',
    flooringHood:'Euclid Beach, Lakeshore Blvd, East 222nd, Chardon Road...',
    kitchenProse:`<h3>Lakefront East Side Housing, Real Kitchen Needs</h3>
      <p>Euclid's housing stock reflects its history as an early twentieth-century industrial suburb with lakefront neighborhoods — well-built single-family homes from the 1920s through the 1960s, with solid structural bones and kitchens that haven't kept pace with design expectations. The characteristic situation in most Euclid kitchens: original or early-update cabinetry in dated finishes, tile countertops, and flooring that's been layered over the years.</p>
      <p>A targeted cosmetic update delivers far more visual impact here than the cost suggests — these are well-built homes with good bones, and updating the surfaces without touching the structure is exactly the right approach. The in-home visit determines the right scope and provides a written estimate based on your actual kitchen.</p>`,
    flooringProse:`<h3>Original Lakefront Housing with Deep Floor Histories</h3>
      <p>Euclid's older housing stock frequently has original hardwood under multiple generations of overlay flooring, and the lakefront location adds a humidity consideration that affects both subfloor conditions and product selection.</p>
      <p>We assess the full situation on the first visit and include any necessary subfloor prep in the written estimate before any product commitment.</p>`,
  },

  { name:'Cleveland Heights', slug:'cleveland-heights', county:'Cuyahoga County',
    nearby:[{name:'Euclid',slug:'euclid'},{name:'Lakewood',slug:'lakewood'},{name:'Lyndhurst',slug:'lyndhurst'},{name:'Shaker Heights',slug:'shaker-heights'},{name:'Mayfield Heights',slug:'mayfield-heights'}],
    kitchenHood:'Cedar Heights, Cedar-Fairmount, Noble, Coventry, Taylor Corridor...',
    flooringHood:'Cedar Heights, Cedar-Fairmount, Noble, Coventry, Taylor Corridor...',
    kitchenProse:`<h3>Architecturally Significant Homes with Kitchens from a Different Era</h3>
      <p>Cleveland Heights is one of the most architecturally distinct communities in the region, with large craftsman bungalows, Tudor revivals, and colonial homes built to genuine design standards in the 1920s through the 1940s. These homes have layouts and architectural detail that newer construction can't replicate — and kitchens that were added or updated in the 1970s through the 1990s that don't match the quality of the rest of the house. A kitchen that looks like a generic 1990s update in a home that deserves significantly better.</p>
      <p>A kitchen update in one of these homes requires care — the structural layout typically works well, and the goal is a surface update that actually fits the home's character. The in-home visit starts there and builds to a written estimate that reflects the actual scope needed.</p>`,
    flooringProse:`<h3>Pre-War Hardwood and Complex Subfloor Situations</h3>
      <p>Cleveland Heights' pre-war housing stock is one of the most complex flooring environments in the region — original hardwood in multiple species and installation patterns, subfloors from the 1920s and 30s with decades of repair, and moisture considerations that vary room by room. Flooring in these homes requires an assessment before any product recommendation is meaningful.</p>
      <p>We assess what's there, what's under it, and what the subfloor needs — on the first visit, in person, with a written estimate that covers the actual scope of work.</p>`,
  },

  { name:'Shaker Heights', slug:'shaker-heights', county:'Cuyahoga County',
    nearby:[{name:'Cleveland Heights',slug:'cleveland-heights'},{name:'Beachwood',slug:'beachwood'},{name:'Lyndhurst',slug:'lyndhurst'},{name:'Solon',slug:'solon'},{name:'Independence',slug:'independence'}],
    kitchenHood:'Shaker Square, Malvern Road, South Park, Van Aken District...',
    flooringHood:'Shaker Square, Malvern Road, South Park, Van Aken District...',
    kitchenProse:`<h3>Planned Community Homes with Original-Era Kitchen Challenges</h3>
      <p>Shaker Heights is one of the most deliberately planned residential communities in the country, with homes built between the 1910s and the 1960s to strict architectural standards and generous lot sizes. The architectural integrity is remarkable — and the kitchens in most of these homes are the weakest room in the house. Either original and significantly dated, or updated in the 1980s or 90s with finishes that now read as generic against the home's actual quality. A kitchen that was adequate in 1993 is not adequate in a home that commands Shaker Heights market prices today.</p>
      <p>Updating a kitchen in one of these homes requires a careful approach — preserving what's valuable, replacing what isn't, and achieving a result that fits the home's character. The in-home visit starts with an honest assessment of what's there and builds to a written estimate that reflects the actual scope needed.</p>`,
    flooringProse:`<h3>Historically Significant Homes with Complex Flooring</h3>
      <p>Shaker Heights homes have flooring situations that match their age and quality — original hardwood in multiple species and patterns, subfloors from the early twentieth century, and cosmetic overlays from multiple renovation eras. Getting the assessment right before any product selection is not optional in these homes.</p>
      <p>We assess the full situation on the first visit and provide a written estimate that reflects what the floors actually need — not a best-case scenario.</p>`,
  },

  { name:'Solon', slug:'solon', county:'Cuyahoga County',
    nearby:[{name:'Beachwood',slug:'beachwood'},{name:'Shaker Heights',slug:'shaker-heights'},{name:'Lyndhurst',slug:'lyndhurst'},{name:'Mayfield Heights',slug:'mayfield-heights'},{name:'Brecksville',slug:'brecksville'}],
    kitchenHood:'Aurora Road, SOM Center Road, Bainbridge Road, Harper Road...',
    flooringHood:'Aurora Road, SOM Center Road, Bainbridge Road, Harper Road...',
    kitchenProse:`<h3>High-Value Eastern Suburb, Builder-Grade Kitchen Finishes</h3>
      <p>Solon has become one of Cuyahoga County's most sought-after eastern suburbs over the past three decades, with residential development at premium price points continuing from the 1980s through the present. The problem that runs across a significant portion of this housing stock is the same one affecting new construction everywhere: homes built at $400,000–$700,000 price points that received production-grade kitchen packages. Medium-density cabinets, stock countertop materials, and tile or laminate choices that were value-engineered at the build stage.</p>
      <p>You shouldn't have to gut a ten-year-old kitchen to get the look that should have been there from the start. The in-home visit assesses exactly what's there and walks you through targeted upgrades that deliver a genuine designer result — without the structural demolition or the extended timeline.</p>`,
    flooringProse:`<h3>Newer Construction, Production-Grade Floors</h3>
      <p>Solon's newer housing stock frequently has production-grade LVP or builder carpet that wasn't specified for the actual use pattern of the household — looks fine when new, shows wear within five to eight years. Older homes on the city's western edges have original hardwood in varying condition. Both situations call for an assessment before product selection.</p>
      <p>We assess, measure, bring samples, and include all necessary prep in the written estimate. One team, firm timeline.</p>`,
  },

  { name:'Beachwood', slug:'beachwood', county:'Cuyahoga County',
    nearby:[{name:'Solon',slug:'solon'},{name:'Lyndhurst',slug:'lyndhurst'},{name:'Shaker Heights',slug:'shaker-heights'},{name:'Mayfield Heights',slug:'mayfield-heights'},{name:'Cleveland Heights',slug:'cleveland-heights'}],
    kitchenHood:'Chagrin Blvd, Richmond Road, Fairmount Blvd, Halburton Road...',
    flooringHood:'Chagrin Blvd, Richmond Road, Fairmount Blvd, Halburton Road...',
    kitchenProse:`<h3>Mid-Century and Newer Homes with the Same Kitchen Gap</h3>
      <p>Beachwood's well-maintained residential neighborhoods range from 1950s ranch homes near the city center to newer townhome and condominium developments along the eastern edge. Both categories present similar kitchen situations: mid-century homes with original or 1990s-update kitchens that read as their era, and newer construction with builder-grade packages that don't match what the property commands in the market.</p>
      <p>The in-home visit assesses exactly what's there — whether the boxes are worth refacing, whether the countertop can be updated without a full demo — and walks you through every option without showroom pressure or a structural commitment you don't need to make.</p>`,
    flooringProse:`<h3>Mid-Century Hardwood and Newer Production Floors</h3>
      <p>Beachwood's housing range means flooring situations that span from original 1950s hardwood in various conditions to newer production LVP that's showing wear sooner than expected. Subfloor conditions vary accordingly, and assessment before product selection saves cost and disruption later.</p>
      <p>Assessment is part of every quote visit. Any necessary prep is in the written estimate before any commitment is made.</p>`,
  },

  { name:'Lyndhurst', slug:'lyndhurst', county:'Cuyahoga County',
    nearby:[{name:'Beachwood',slug:'beachwood'},{name:'Mayfield Heights',slug:'mayfield-heights'},{name:'Euclid',slug:'euclid'},{name:'Shaker Heights',slug:'shaker-heights'},{name:'Solon',slug:'solon'}],
    kitchenHood:'Mayfield Road, Richmond Road, Anderson Road, Quilliams Road...',
    flooringHood:'Mayfield Road, Richmond Road, Anderson Road, Quilliams Road...',
    kitchenProse:`<h3>Postwar Eastern Suburb, Kitchens from the Last Update Cycle</h3>
      <p>Lyndhurst developed primarily in the postwar decades and features a compact, well-organized grid of residential streets lined with solid mid-century construction. The kitchens in most of these homes were last meaningfully updated in the 1980s or 1990s — which means laminate cabinetry in light tones, older countertop materials, and layouts that function but look significantly dated. These are well-built homes that deserve a kitchen update, and the structural layouts typically work well enough that a cosmetic overhaul is the right approach rather than a full demolition.</p>
      <p>The in-home visit determines the right scope for your specific kitchen and provides a written estimate that covers every option from a cabinet refresh to a complete surface overhaul.</p>`,
    flooringProse:`<h3>Postwar Hardwood and Mid-Century Subfloors</h3>
      <p>Lyndhurst's postwar housing stock frequently has original hardwood in living areas under overlay generations, with concrete kitchen subfloors that need proper assessment before new flooring goes down. The assessment on the first visit determines what's actually there and what the project actually requires.</p>
      <p>Subfloor prep is included in the written estimate when it's needed. No discoveries on installation day.</p>`,
  },

  { name:'Mayfield Heights', slug:'mayfield-heights', county:'Cuyahoga County',
    nearby:[{name:'Lyndhurst',slug:'lyndhurst'},{name:'Beachwood',slug:'beachwood'},{name:'Euclid',slug:'euclid'},{name:'Solon',slug:'solon'},{name:'Cleveland Heights',slug:'cleveland-heights'}],
    kitchenHood:'Mayfield Road, Bishop Road, SOM Center Road, Eastgate Road...',
    flooringHood:'Mayfield Road, Bishop Road, SOM Center Road, Eastgate Road...',
    kitchenProse:`<h3>Eastern Corridor Suburb with Mid-Century Kitchen Finishes</h3>
      <p>Mayfield Heights sits at the intersection of several major eastern Cuyahoga corridors and features a housing stock that spans from early postwar bungalows to newer condominium and townhome developments. The single-family homes that make up most of the residential inventory have kitchens that were last updated anywhere from the 1980s to the early 2000s — which means dated cabinetry, older countertop materials, and layouts that work but don't look the part.</p>
      <p>A cosmetic update rather than a structural gut-job is the right approach for most of these kitchens. The in-home visit assesses exactly what's there and provides a written estimate across every scope level — from a targeted cabinet refresh to a full surface overhaul.</p>`,
    flooringProse:`<h3>Mixed Housing Stock, Variable Floor Conditions</h3>
      <p>Mayfield Heights' range of housing eras means flooring assessment is important before product selection — original hardwood in older homes under overlay generations, newer production flooring in more recent construction that may not have been specified correctly for the household's actual use. Subfloor conditions vary accordingly.</p>
      <p>We assess on the first visit, include prep in the written estimate, and schedule around your household.</p>`,
  },

  // ── Medina County ───────────────────────────────────────────────────────────
  { name:'Wadsworth', slug:'wadsworth', county:'Medina County',
    nearby:[{name:'Medina',slug:'medina'},{name:'Brunswick',slug:'brunswick'},{name:'Strongsville',slug:'strongsville'},{name:'Brecksville',slug:'brecksville'},{name:'Hinckley',slug:'hinckley'}],
    kitchenHood:'High Street, Broad Street, Silvercreek Road, Akron Road...',
    flooringHood:'High Street, Broad Street, Silvercreek Road, Akron Road...',
    kitchenProse:`<h3>Small City Character, Real Kitchen Needs</h3>
      <p>Wadsworth is a compact, self-contained community at the northern end of Medina County, with a residential stock that ranges from historic downtown-area homes to newer suburban developments on the city's growing eastern edge. The housing inventory spans multiple eras and price points, but the common thread in the kitchens is the same: surfaces and finishes that haven't been meaningfully updated in fifteen to twenty-five years. Golden oak cabinetry, tile or laminate countertops, and flooring that reflects the era of the last cosmetic update.</p>
      <p>A targeted cosmetic update — new cabinet fronts, quartz countertops, and a backsplash — transforms the look of one of these kitchens completely without a structural gut-job. The in-home visit determines exactly what that looks like in your specific space and provides a written estimate across every scope level.</p>`,
    flooringProse:`<h3>Downtown to New Development — Different Floors, Same Need for Assessment</h3>
      <p>Wadsworth's housing range from historic downtown homes to newer suburban developments means flooring situations that vary significantly — original hardwood in older homes that may be refinishable, concrete subfloors in newer builds, and multiple generations of overlay in homes from the middle decades.</p>
      <p>We assess the subfloor on the first visit and include all necessary prep in the written estimate. No surprises, firm timeline.</p>`,
  },

  { name:'Hinckley', slug:'hinckley', county:'Medina County',
    nearby:[{name:'Brunswick',slug:'brunswick'},{name:'Medina',slug:'medina'},{name:'Brecksville',slug:'brecksville'},{name:'Strongsville',slug:'strongsville'},{name:'Wadsworth',slug:'wadsworth'}],
    kitchenHood:'Ridge Road, Center Road, Bellus Road, Stony Hill Road...',
    flooringHood:'Ridge Road, Center Road, Bellus Road, Stony Hill Road...',
    kitchenProse:`<h3>Semi-Rural Township, Varied Housing and Real Kitchen Needs</h3>
      <p>Hinckley Township is one of Medina County's most rural communities, with a housing mix that includes farmhouses on large lots, converted rural properties, and newer residential developments built for families seeking a semi-rural setting with reasonable access to the Cuyahoga and Medina county corridors. Kitchens across this range vary significantly in original quality — but most share a common characteristic: finishes that were installed at the build stage and haven't been meaningfully updated since.</p>
      <p>We serve Hinckley Township with the same free in-home visit that we bring to every other community in our service area. Written estimate based on your actual kitchen, across every scope level, without a showroom visit required to get started.</p>`,
    flooringProse:`<h3>Rural and Semi-Rural Homes with Unique Subfloor Situations</h3>
      <p>Hinckley's housing mix — from older farmhouses to newer residential developments — means flooring situations that require assessment before any product recommendation makes sense. Farmhouses frequently have original plank subfloors with moisture management considerations. Newer development homes often have production-grade flooring that wasn't specified for real use.</p>
      <p>Assessment is part of every quote visit. Subfloor prep, if needed, is in the written estimate. Firm timeline, one point of contact.</p>`,
  },
];

// ── FAQ data (from FAQ library) ───────────────────────────────────────────────

const FAQS = {
  kitchen: [
    { q:'How much does a kitchen remodel cost?',
      a:'The range is wide — and intentionally so. A cabinet refresh with new doors and hardware runs $3,000–$8,000. A mid-range remodel with refacing, new countertops, and updated fixtures runs $15,000–$35,000. A full gut renovation with layout changes starts at $50,000 and climbs from there. The number that matters is the one based on your actual kitchen, not a national average. That\'s what an in-home visit determines.' },
    { q:'What is the right order to remodel a kitchen?',
      a:'Sequence is where most kitchen remodels go wrong. The correct order is: layout decisions first, then cabinets (they have the longest lead times), then appliance specs, then countertop templating, then backsplash, then flooring, then fixtures and lighting. Making any of these decisions out of order causes delays, change orders, and rework.' },
    { q:'How long does a kitchen remodel take?',
      a:'A cabinet tune-up takes days. Refacing runs one to two weeks. Full cabinet replacement is two to four weeks. A complete renovation — layout changes, new cabinets, countertops, flooring — runs six to twelve weeks including lead times. The lead time on cabinets alone is six to sixteen weeks for semi-custom lines. Anyone quoting you a timeline without knowing your scope is guessing.' },
    { q:'Do I need a permit for a kitchen remodel?',
      a:'It depends on scope. Cosmetic work — cabinet refacing, painting, new countertops, backsplash — typically does not require a permit. Moving plumbing, relocating electrical, removing walls, or adding circuits does. In Ohio, work that touches structural elements, plumbing drain lines, or electrical panels requires a licensed contractor and a pulled permit. Skipping permits on permitted work creates problems at resale.' },
    { q:'What is the difference between kitchen remodeling and kitchen renovation?',
      a:'A renovation updates what\'s there — new finishes, new fixtures, new surfaces — without changing the layout or structure. A remodel changes the function or form — moving walls, relocating plumbing, reconfiguring the layout. Renovations are faster and less expensive. Remodels require more planning, more trades, and permits.' },
    { q:'How do I know what level of kitchen remodel I actually need?',
      a:'Most homeowners overbuild or underbuild because they haven\'t separated cosmetic problems from structural ones. If your cabinets are structurally sound but look dated, refacing or painting is the right level. If your layout doesn\'t work — not enough counter space, poor traffic flow, wrong appliance placement — that\'s a remodel, not a refresh. The decision starts with an honest assessment of what\'s actually broken versus what just looks old.' },
    { q:'What adds the most value to a kitchen remodel?',
      a:'Consistently: cabinet updates (refacing or replacement), countertop replacement, and improved lighting. These three elements define how a kitchen looks and feels more than anything else. Appliances get attention but contribute less to resale value than surfaces. In Northeast Ohio specifically, the return on a mid-range kitchen remodel runs 60–80% at resale.' },
    { q:'What should I ask a kitchen remodeling contractor before hiring them?',
      a:'Ask for a written scope of work before any contract is signed. Ask who pulls the permits. Ask which subcontractors they use and whether they\'re licensed. Ask for a payment schedule tied to milestones, not calendar dates. Ask for references from projects completed in the last twelve months specifically — not their best work from five years ago.' },
  ],

  'cabinet-refacing': [
    { q:'What is cabinet refacing?',
      a:'Cabinet refacing replaces the visible surfaces of your cabinets — the doors, drawer fronts, and hardware — while keeping the existing cabinet boxes in place. The box frames are wrapped in a matching veneer or laminate. The result looks like new cabinets at roughly 40–60% of the cost of full replacement. It\'s the right choice when your cabinet layout works and the boxes are structurally sound.' },
    { q:'How much does cabinet refacing cost?',
      a:'In Northeast Ohio, cabinet refacing typically runs $6,000–$18,000 depending on kitchen size, door style, and material selection. Thermofoil and laminate doors sit at the lower end. Wood veneer with soft-close hardware runs higher. It is almost always significantly less expensive than full cabinet replacement — which starts at $12,000 and climbs quickly. Any quote significantly below $6,000 for a full kitchen warrants scrutiny on what\'s being omitted.' },
    { q:'How long does cabinet refacing take?',
      a:'Most kitchen cabinet refacing projects are completed in two to five days. There is no demolition, no disposal of old cabinets, no waiting on new cabinet lead times. You lose use of your kitchen for a short window rather than weeks. This is one of the primary advantages over full replacement — the disruption is minimal.' },
    { q:'Is cabinet refacing worth it or should I just replace the cabinets?',
      a:'Refacing makes sense when three things are true: your cabinet boxes are in good structural condition, your kitchen layout works for how you actually use the space, and you want a significant visual upgrade without a full renovation budget. If your boxes are water damaged, your layout is genuinely dysfunctional, or you need to move anything — sink, range, pantry wall — replacement is the right call.' },
    { q:'What materials are used in cabinet refacing?',
      a:'The three most common options are wood veneer, rigid thermofoil (RTF), and laminate. Wood veneer looks the most like natural wood and can be stained to match new doors precisely. Thermofoil is durable, moisture resistant, and works well in a range of door styles. Laminate is the most budget-friendly and holds up well in high-use kitchens.' },
    { q:'Can I change the layout of my kitchen with cabinet refacing?',
      a:'No — and this is the most important limitation to understand. Refacing works with your existing cabinet footprint. You cannot add cabinets, remove cabinets, or move anything structural as part of a refacing project. Refacing is a surface update, not a layout change.' },
    { q:'Does cabinet refacing include new hardware?',
      a:'It should — and if a quote doesn\'t include it, ask specifically. New pulls, knobs, and hinges are part of what makes a refacing project look complete rather than patched. Soft-close hinges are typically available as an upgrade and are worth the cost if your current hinges are worn.' },
    { q:'Will refaced cabinets match my new countertops?',
      a:'Yes, if sequenced correctly. Door style and finish selection should happen in coordination with countertop material selection — not independently. Choosing your doors before your countertop is one of the most common sequencing mistakes in a kitchen update.' },
  ],

  'cabinet-painting': [
    { q:'How much does it cost to have kitchen cabinets professionally painted?',
      a:'In Northeast Ohio, professional cabinet painting typically runs $1,500–$5,000 depending on kitchen size, number of doors and drawer fronts, and finish quality. It is the most budget-friendly way to dramatically change how a kitchen looks. The range exists because prep work — cleaning, deglossing, priming, filling — is where quality is determined, and not every painter does it the same way.' },
    { q:'Is it better to paint cabinets yourself or hire a professional?',
      a:'DIY cabinet painting is possible but consistently underestimated. The visible difference between a professional finish and a brush-rolled DIY finish is significant — brush marks, uneven coverage, and paint adhesion failures are common in DIY attempts. Professionals spray in a controlled environment, use proper primer and bonding agents, and apply multiple thin coats.' },
    { q:'How long does professional cabinet painting take?',
      a:'A typical kitchen takes three to five days for professional cabinet painting. Doors and drawer fronts are usually removed and painted off-site or in a controlled spray environment. Boxes are painted in place. Plan for limited kitchen use for approximately one week start to finish.' },
    { q:'What kind of paint is used on kitchen cabinets?',
      a:'Professional cabinet painters use either an alkyd (oil-based) paint or a waterborne alkyd hybrid — both cure to a hard, durable surface that resists moisture and daily contact better than standard latex wall paint. The sheen is typically satin or semi-gloss. Using standard interior wall paint on cabinets is one of the most common DIY mistakes — it stays soft, marks easily, and doesn\'t hold up to kitchen use.' },
    { q:'How long do painted cabinets last?',
      a:'Professionally painted cabinets with proper prep and a quality finish typically last seven to ten years before showing meaningful wear at high-contact areas. The longevity is almost entirely determined by prep quality and paint choice. Cabinets painted without proper deglossing and priming will fail much sooner regardless of topcoat quality.' },
    { q:'Can you paint over oak cabinets?',
      a:'Yes — but oak requires more prep than any other cabinet material. Oak has a pronounced open grain that telegraphs through paint if it isn\'t filled first. The process requires a grain filler applied before priming, sanding between coats, and a high-build primer. Done correctly, painted oak cabinets look smooth and professional. Done without the grain filling step, you get a textured finish that looks unfinished even with multiple topcoats.' },
    { q:'Should I paint my cabinets or reface them?',
      a:'Painting is the right choice when your cabinet doors are in good condition and your primary goal is a color change or a lighter, brighter look. Refacing makes more sense when the door style itself is dated — because painting preserves the existing door style while refacing replaces it entirely. If you want a shaker door where you currently have a cathedral arch, painting won\'t get you there. Refacing will.' },
    { q:'Should kitchen cabinets be sprayed or rolled?',
      a:'Sprayed — for the finish quality. Spraying applies thin, even coats without brush or roller texture and produces the factory-smooth look most homeowners are after. Any professional cabinet painter worth hiring will remove the doors and spray them off-site or in a controlled environment. If a painter quotes you a cabinet job and plans to brush and roll everything in place, that\'s a red flag on the quality of the finished product.' },
  ],

  'countertop-replacement': [
    { q:'When should I choose my countertops during a kitchen remodel?',
      a:'Earlier than most homeowners expect. Countertop selection should happen alongside cabinet selection — not after. The countertop material affects the edge profile options, the sink cutout requirements, the backsplash tile choice, and in some cases the cabinet color decision. Waiting until cabinets are installed to start thinking about countertops adds weeks to your project unnecessarily.' },
    { q:'What is the difference between quartz, quartzite, and granite?',
      a:'Granite is natural stone cut directly from the earth — each slab is unique, it requires periodic sealing, and it handles heat well. Quartzite is also natural stone, harder than granite, with a marble-like appearance — it is not the same as quartz. Quartz (brands like Cambria, Silestone, Caesarstone) is an engineered product — non-porous, requires no sealing, and is highly consistent in appearance. Quartz is currently the most popular choice in Northeast Ohio kitchens.' },
    { q:'Should I look at actual slabs or is a sample enough?',
      a:'Always look at slabs — especially for natural stone. Granite and quartzite are cut from single pieces of stone and every slab is different. The 4x4 sample in a showroom tells you the general color family but not the actual movement, veining, or variation in the slab you\'ll be living with. Most stone yards will let you pull and reserve a specific slab.' },
    { q:'What happens at countertop templating and what do I need to have ready?',
      a:'Templating is when the countertop fabricator comes to your home after cabinets are set and takes precise measurements for cutting. Before the templater arrives you need to have your sink on-site and confirmed, your faucet selected and on-site, your cooktop or range confirmed if it\'s a drop-in, and any undermount accessories finalized. Showing up to templating without a confirmed sink is one of the most common and costly delays in a kitchen remodel.' },
    { q:'How long does it take to get countertops installed after cabinets are set?',
      a:'In a full remodel, plan for three to six weeks from cabinet installation to countertop completion. The sequence is: cabinets set and leveled, templating scheduled and completed, fabrication lead time of one to three weeks, then installation. For refacing and painting projects the timeline is much faster — countertop removal and replacement can often be completed the same day as the cabinet work.' },
    { q:'Does a countertop need to be sealed and how often?',
      a:'Natural stone countertops — granite, quartzite, marble — require sealing at installation and periodic resealing. Granite typically needs sealing every one to three years. Quartzite annually in a high-use kitchen. Quartz engineered stone never needs sealing — it is non-porous by manufacture.' },
    { q:'How do I choose the right countertop edge profile?',
      a:'An eased or straight edge reads clean and modern and works well with shaker cabinets. A beveled edge adds subtle detail without being ornate. An ogee or bullnose edge was common in the 90s and dates a kitchen quickly. Thicker countertops — a mitered edge that makes a standard slab look two inches thick — are a current trend worth considering on islands specifically.' },
    { q:'Is butcher block a good choice for kitchen countertops?',
      a:'It depends entirely on how you use your kitchen and your willingness to maintain it. Butcher block requires oiling several times a year and is vulnerable to standing water near the sink. A popular hybrid approach is butcher block on an island used for prep work and stone on the perimeter runs near the sink and range.' },
  ],

  backsplash: [
    { q:'Should my backsplash match my countertop material or be a different material?',
      a:'Both approaches work. Running the countertop material up the wall as a backsplash — slab backsplash — creates a seamless, high-end look. A tile backsplash against a stone countertop is the more common approach and gives you more design flexibility. The two materials need to coordinate, not match — similar undertones matter more than identical color.' },
    { q:'Is subway tile still a good choice for a kitchen backsplash?',
      a:'Subway tile is not going anywhere — but the standard 3x6 white ceramic gloss subway tile that peaked in the early 2010s reads dated now. Larger subway formats — 4x8, 4x12 — feel more current. Handmade or pressed subway tile with slight surface variation reads artisan rather than builder-grade. Colored subway tile in soft greens, warm whites, and muted blues is performing well right now in Northeast Ohio kitchens.' },
    { q:'Does a backsplash need to be sealed?',
      a:'It depends entirely on the material. Porcelain and ceramic tile do not need sealing. Natural stone tile — marble, travertine, granite, quartzite — does need sealing at installation and on a maintenance schedule thereafter. Grout is the more consistent sealing requirement — regardless of tile material, grout in a kitchen backsplash should be sealed to prevent staining from cooking grease and moisture.' },
    { q:'How do I choose the right grout color for a backsplash?',
      a:'Matching grout to the tile color minimizes the grid pattern and lets the tile read as a surface — the right choice when the tile itself has movement or pattern you want to showcase. Contrasting grout emphasizes the grid and adds graphic weight. White grout in a kitchen near the range is a maintenance decision as much as a design one — it will discolor over time. A warm gray or greige grout is the practical middle ground.' },
    { q:'Who installs a kitchen backsplash?',
      a:'Tile installation is a specialized trade. A qualified tile setter handles backsplash installation. In a full kitchen remodel the tile setter is typically subcontracted and scheduled after countertops are installed — backsplash tile runs to the underside of the upper cabinets and sits on top of the countertop, so both need to be in place first.' },
    { q:'What backsplash materials are low maintenance in a kitchen?',
      a:'Porcelain and ceramic tile are the lowest maintenance options — non-porous, easy to clean, no sealing required. Large format tile or slab porcelain minimizes grout lines. The range zone deserves extra thought — whatever material goes behind the range needs to handle grease, heat, and frequent wiping.' },
    { q:'Can I use natural stone tile for a backsplash?',
      a:'Yes — marble, travertine, and slate are all used as backsplash tile. Natural stone backsplash tile needs to be sealed at installation and periodically thereafter. Marble specifically will etch if acidic foods or cleaners contact it. If you love the look of natural stone but want lower maintenance, a porcelain tile that replicates the appearance performs identically without the sealing requirement.' },
    { q:'What is a slab backsplash and when does it make sense?',
      a:'A slab backsplash runs the countertop material — usually quartz or quartzite — up the wall as a single seamless surface rather than using tile. It eliminates grout lines entirely in that zone, photographs beautifully, and creates a high-end unified look. The tradeoff is cost — you\'re using an expensive material vertically where a less expensive tile would perform identically.' },
  ],

  'remodel-cost': [
    { q:'What does a kitchen remodel cost in Northeast Ohio?',
      a:'The range is wide and scope-dependent. A cabinet painting project runs $1,500–$5,000. Cabinet refacing runs $6,000–$18,000. A mid-range remodel — new cabinets, countertops, backsplash, updated fixtures — runs $25,000–$60,000. A full gut renovation with layout changes, new appliances, and premium materials starts at $60,000 and can exceed $150,000 in larger kitchens. Northeast Ohio labor costs run 10–20% below national averages.' },
    { q:'What is the biggest cost driver in a kitchen remodel?',
      a:'Cabinets — consistently. In a typical mid-range kitchen remodel, cabinets and their installation represent 30–40% of the total project budget. After cabinets, countertops are the second largest cost driver. Labor — across all trades — is the cost that surprises homeowners most because it\'s not visible in the material selections they\'re making at showrooms.' },
    { q:'Does moving plumbing or electrical significantly increase cost?',
      a:'Yes — and more than most homeowners expect. Moving a sink to a new location involves relocating drain lines, supply lines, and potentially venting, which can add $1,500–$4,000 depending on complexity. Adding a dedicated circuit for a new appliance runs $300–$800 per circuit. Layout changes that seem simple on paper consistently produce the largest cost surprises in kitchen remodels.' },
    { q:'What is a realistic contingency budget for a kitchen remodel?',
      a:'Ten to fifteen percent of the total project cost is the standard recommendation. Surprises behind walls — old plumbing that doesn\'t meet code, moisture damage from a slow leak, wiring that needs upgrading, a soffit hiding something structural — happen in a meaningful percentage of kitchen remodels, particularly in homes built before 1990. A contingency budget doesn\'t mean you\'ll spend it. It means you\'re not making decisions under financial pressure.' },
    { q:'What is the return on investment for a kitchen remodel in Ohio?',
      a:'A mid-range kitchen remodel in Ohio returns approximately 60–80% of its cost at resale. A minor kitchen remodel — cabinet refresh, new countertops, updated appliances — consistently outperforms a major remodel on ROI percentage. The full gut renovation with premium finishes rarely returns dollar for dollar at resale in Northeast Ohio\'s price range.' },
    { q:'How does the payment schedule for a kitchen remodel typically work?',
      a:'A standard payment schedule runs roughly: 30–50% at contract signing to fund material purchases, a second draw at a defined milestone, and the remaining balance at substantial completion. What matters is that the remaining draws are tied to milestones, not calendar dates, and that no more than a small final payment remains until you\'re satisfied.' },
  ],

  'local-contractor': [
    { q:'How do I find a reliable kitchen remodeling contractor in Northeast Ohio?',
      a:'Word of mouth from a neighbor who recently completed a kitchen remodel is still the strongest signal. Beyond that, look for contractors with verifiable local project history — not just reviews, but actual kitchens they\'ve done in your area that you can see or that the homeowner will let you walk through. The interview process matters more than the source — how a contractor communicates before you hire them is exactly how they\'ll communicate during the project.' },
    { q:'What licenses and insurance should a kitchen remodeling contractor carry in Ohio?',
      a:'In Ohio, general contractors are not required to hold a state-level general contractor license — licensing is handled at the municipal level and varies by city. What every contractor doing kitchen work should carry without exception is general liability insurance and workers\' compensation coverage. Ask for certificates of insurance, not verbal confirmation. Electrical and plumbing subcontractors must be licensed by the state of Ohio.' },
    { q:'How many bids should I get for a kitchen remodel?',
      a:'Three is the standard and it\'s the right number for a reason. One bid gives you no context. Two bids creates a binary choice that often defaults to the lower number without understanding why. Three bids gives you enough data to identify the outlier — either the low bid that\'s missing scope or the high bid that\'s padding margin.' },
    { q:'What should a kitchen remodeling contract include?',
      a:'A complete contract covers: detailed scope of work with line items, total project cost and payment schedule tied to milestones, start date and estimated completion date, who is responsible for pulling permits, which subcontractors will be used, how change orders are handled and priced, and warranty terms on labor and materials. A contract that says "kitchen remodel — $28,000" with no further detail is not a contract that protects the homeowner.' },
    { q:'What are red flags when interviewing a kitchen remodeling contractor?',
      a:'The most reliable red flags: pressure to sign quickly before the price expires, reluctance to provide references from recent projects, a bid significantly lower than the others without a clear explanation, vague scope language that doesn\'t specify materials or brands, and any suggestion to skip permits on work that requires them.' },
    { q:'Should I hire a general contractor or go directly to specialty trades for a kitchen remodel?',
      a:'For a cosmetic kitchen update — cabinet painting, new countertops, backsplash — hiring specialty trades directly is reasonable and often less expensive. For anything involving layout changes, permit work, multiple trades, or sequencing dependencies, a general contractor or kitchen remodeler who manages the project is worth the markup. Without it, the homeowner becomes the project manager.' },
    { q:'Why do so many kitchen contractors ask for 50% upfront?',
      a:'Smaller contractors often operate on thin working capital and use the deposit to fund material purchases before the project starts. Cabinet orders alone can run $8,000–$20,000 and most suppliers require payment upfront. So a 50% deposit on a $40,000 kitchen isn\'t necessarily a red flag — what matters is whether the payment schedule is tied to milestones after that deposit and whether the contractor has verifiable local references.' },
    { q:'What is the difference between using a remodeling concierge and calling a contractor directly?',
      a:'When you call a contractor, you\'re talking to someone with one answer. A remodeling concierge covers every level — from a cabinet refresh to a full gut renovation — so the recommendation you get is based on what your kitchen actually needs, not what a particular company happens to sell. With 20 years of construction experience, you\'re getting a real assessment before anyone shows up with a bid.' },
  ],

  flooring: [
    { q:'Is demo and haul away really included in the price?',
      a:'Yes. Demo and haul away of the existing flooring is included in every full-room installation quote — no separate line item, no "debris removal fee." We pull the old floor and take it with us. The only exception is if you specifically want to keep the old flooring for some reason, which occasionally happens.' },
    { q:'Do I need to move my furniture before you arrive?',
      a:'No. Furniture moving is included. We move everything out of the space before installation begins and put it back when the floor is done. You don\'t need to empty the room the night before or figure out where to stage your sectional during a two-day install.' },
    { q:'What if my subfloor needs leveling? Is that extra?',
      a:'Subfloor assessment is part of every quote visit. If your subfloor needs leveling compound, squeak repairs, or panel re-securing, we include that in the written quote — it\'s not something we discover on installation day and add to the bill. If you\'re experiencing subfloor problems without replacing the floor, we offer floor leveling as a standalone service too.' },
    { q:'What does waterproof flooring actually mean?',
      a:'Waterproof flooring means the plank or tile itself cannot be penetrated by water. What waterproof does not mean is that the entire flooring system is impervious to water damage. Water that gets under the floor — through gaps at transitions, through a subfloor moisture problem, or from a significant flood — can still cause buckling, mold, and subfloor damage. The plank is waterproof. The installation is not.' },
    { q:'What is the difference between laminate and luxury vinyl plank?',
      a:'Laminate has a wood fiber (HDF) core with a photographic layer on top — it is not waterproof in its traditional form. LVP has a plastic (PVC) core that is genuinely waterproof throughout. The practical differences: LVP is better for wet areas and pet households. New generation laminate is more scratch resistant and holds up better under large dogs and heavy furniture. For most Northeast Ohio households, the choice comes down to whether scratch resistance or moisture resistance is the higher priority.' },
    { q:'How long does flooring installation take?',
      a:'LVP in an average living area or kitchen takes one day. Whole-house LVP or carpet is typically two to three days. Engineered hardwood needs acclimation time in your home before installation — plan for a delivery window followed by a one to two day installation. We give you a firm schedule upfront, not a range we adjust as we go.' },
    { q:'Can new flooring be installed over existing tile?',
      a:'Yes — with one non-negotiable condition. Existing tile must be embossed before floating a new floor over it. Embossing means applying a floor-leveling compound over the tile surface to fill the grout lines and create a flat, smooth substrate. A floating floor installed directly over grout lines will eventually telegraph those lines through the new floor.' },
    { q:'Is polyester carpet fiber as good as nylon?',
      a:'No. Nylon is the superior fiber for durability, resilience, and long-term appearance retention. It springs back after compression better than any other fiber — meaning high-traffic areas stay looking better longer. Polyester is softer to the touch and less expensive, but mats and crushes in high-traffic areas and does not recover. Buy nylon for any area that gets real use.' },
    { q:'What are transitions and why do they matter?',
      a:'Transitions are the threshold pieces that bridge flooring changes — between two different floor materials, between rooms at different heights, or between flooring and a fixed surface like a door threshold or tile. They allow floating floors to expand and contract without buckling at doorways and cover the raw edge of the flooring at termination points. Poorly fitted or missing transitions are one of the leading causes of floating floor failure over time.' },
  ],

  carpet: [
    { q:'What carpet fiber is best for a household with pets?',
      a:'Nylon with a solution-dyed construction is the strongest choice for pet households. Solution-dyed means the color goes all the way through the fiber rather than being surface-applied — it resists staining from pet accidents and cleaning chemicals that would bleach surface-dyed carpet. Pair nylon fiber with a dense, low cut pile construction — frieze or textured saxony — which hides pet hair between cleanings better than a smooth, flat pile. Avoid loop pile entirely in pet households.' },
    { q:'What is the difference between cut pile and loop pile carpet?',
      a:'Cut pile carpet has the yarn loops cut at the top, creating individual fiber ends — this is the soft, familiar feel of most residential carpet. Loop pile leaves the yarn loops intact, creating a more structured, lower-profile surface — Berber is the most common loop pile style. Cut pile is softer and more forgiving of pet claws. Loop pile is more durable in commercial settings and hides footprints better.' },
    { q:'How do I know what carpet density and weight I should buy?',
      a:'Face weight — the weight of the fiber per square yard — is the number most commonly marketed. It matters, but density matters more. A carpet with high face weight but low density feels luxurious initially and mats quickly. For residential main areas, look for a face weight of 40 ounces or higher combined with a density rating above 3,000. Anything below that in a high-traffic area is a value compromise that shows up within two to three years.' },
    { q:'How long does residential carpet last?',
      a:'Quality nylon carpet with proper pad, installed in a normal household, lasts ten to fifteen years before replacement is worth considering. Budget polyester carpet in high-traffic areas may look worn in five to seven years. The leading accelerants of carpet wear are: inadequate pad density, failure to vacuum regularly which allows grit to cut fiber at the base, and delayed treatment of liquid spills.' },
    { q:'Does the carpet pad matter?',
      a:'The pad matters as much as the carpet — and in some cases more. Pad determines how the carpet feels underfoot, how well it holds up over time, and how long the carpet warranty remains valid. The standard recommendation for residential carpet is an 8-pound density pad at 7/16 inch thickness. Thicker is not always better — an overly thick, soft pad causes carpet to flex excessively underfoot and accelerates seam failure.' },
    { q:'What should I expect during carpet installation?',
      a:'Furniture must be moved before the installers arrive. Doors that swing over the carpet area may need to be trimmed after installation to clear the new surface height. Seams are inevitable in most rooms and their placement matters — a good installer places seams away from high-traffic paths and in less visible locations. Ask specifically where the seams will fall before installation begins.' },
  ],

  'vinyl-plank-flooring': [
    { q:'What is the wear layer on LVP and why does it matter?',
      a:'The wear layer is the clear protective coating on top of the LVP plank — it is the only thing standing between the decorative layer beneath and everything that contacts the floor. Residential light use: 6 mil minimum. Residential standard: 12 mil. Households with pets, kids, or high traffic: 20 mil. A 6 mil wear layer in a household with large dogs will show scratches within a year. Wear layer is the single number that most determines long-term product value — and most big box store LVP sits at 6 or 8 mil without clearly labeling it.' },
    { q:'What is the difference between rigid core and flexible LVP?',
      a:'Rigid core LVP has a solid, dense core — either WPC (wood plastic composite) or SPC (stone plastic composite) — that provides stability, resists denting, and bridges minor subfloor imperfections better than flexible vinyl. SPC is denser and more dimensionally stable than WPC — it handles temperature fluctuation better. For most Northeast Ohio installations, rigid core SPC is the right product.' },
    { q:'Can LVP or laminate be installed in a basement?',
      a:'LVP yes — with conditions. A basement concrete slab must be tested for moisture before any floating floor goes down. LVP with a waterproof core handles normal concrete moisture vapor well. Standard laminate in a basement is a mistake regardless of how dry it seems — the moisture environment at grade level will eventually cause swelling and delamination.' },
    { q:'How long does LVP or laminate flooring last?',
      a:'Quality LVP with a 20 mil wear layer installed correctly over a properly prepared subfloor will last 20 to 25 years in a residential setting. Budget LVP at 6 mil in a high-traffic household may show significant wear in five to eight years. The variables that shorten floor life fastest: improper subfloor prep, missing transitions that allow the floor to buckle, and pet households without adequate wear layer thickness.' },
    { q:'What underlayment does LVP or laminate need?',
      a:'Most quality LVP products come with underlayment pre-attached to the plank. If underlayment is not pre-attached, a 1–2mm foam or cork underlayment is appropriate. Do not add additional underlayment over pre-attached underlayment — doubling up creates excessive flex in the interlocking joints and causes click failures over time. On concrete, a vapor barrier is required under the underlayment regardless of whether the LVP is waterproof.' },
    { q:'Can LVP or laminate be repaired if a plank is damaged?',
      a:'Yes — individual planks can be replaced without disturbing the entire floor. The process requires disassembling the floor from the nearest wall to the damaged plank, replacing it, and reassembling. The condition: you must have matching replacement planks available. Flooring products are discontinued regularly — sometimes within one to two years of installation. Buying a small quantity of extra planks at installation and storing them is standard advice that many homeowners skip and consistently regret.' },
  ],

  'hardwood-flooring': [
    { q:'What is the difference between solid hardwood and engineered hardwood?',
      a:'Solid hardwood is a single piece of wood milled to 3/4 inch thickness — it can be sanded and refinished multiple times over its lifespan, which can exceed 100 years. Engineered hardwood has a thin veneer of real wood bonded to a plywood core — it is more dimensionally stable in environments with humidity fluctuation, can be installed in basements and over radiant heat where solid hardwood cannot, and can typically be refinished once or twice depending on veneer thickness. For most Northeast Ohio homes above grade, both are excellent options.' },
    { q:'How long does hardwood floor installation take?',
      a:'Hardwood requires acclimation time in your home before installation — typically three to seven days — so the wood adjusts to your specific humidity environment before being nailed or floated into place. Plan for a delivery window followed by a one to two day installation. Hardwood installed without proper acclimation expands, gaps, and buckles as it adjusts to the space after the fact.' },
    { q:'Can hardwood be installed over concrete?',
      a:'Solid hardwood cannot be installed directly on a concrete slab — the moisture environment is incompatible and there is no substrate for nailing. Engineered hardwood can be glued directly to concrete with the appropriate adhesive, or floated over an appropriate underlayment. Either approach requires a concrete moisture test first. This is a non-negotiable step that shortcuts consistently regret.' },
    { q:'How often can hardwood floors be refinished?',
      a:'Solid hardwood can typically be refinished six to eight times over its life, depending on the thickness of the wear layer above the tongue-and-groove joint. Engineered hardwood can typically be refinished once or twice, depending on veneer thickness. Before scheduling a refinish, a flooring professional should assess how much material remains above the joints.' },
    { q:'What hardwood species holds up best in a busy household?',
      a:'Janka hardness rating is the standard measure of wood\'s resistance to denting and wear. Species with higher Janka ratings hold up better under heavy use and pet traffic. Hickory and white oak are among the hardest domestic species and are excellent for households with dogs. Red oak is softer but refinishes beautifully. Softer species like pine and cherry look beautiful but show wear faster in high-traffic areas.' },
    { q:'Should I choose prefinished or site-finished hardwood?',
      a:'Prefinished hardwood comes from the factory with the finish already applied — installation is faster and the finish is harder and more durable than most site-applied finishes. Site-finished hardwood is sanded and finished after installation, which allows for a completely seamless surface with no beveled edges between planks and more flexibility in finish color and sheen level. Site finishing produces fumes and requires the space to be vacated for several days. For most occupied homes, prefinished is the more practical choice.' },
  ],

  'floor-leveling': [
    { q:'What is subfloor leveling and when is it needed?',
      a:'Subfloor leveling is the process of applying a self-leveling compound or grinding down high spots to create a flat, even surface before new flooring is installed. It is needed when the existing subfloor has dips, humps, or out-of-flat conditions that exceed the tolerance of the new flooring product — typically 3/16 inch over 10 feet for floating floors. An uneven subfloor causes floating floors to flex, creak, and eventually fail at the locking joints regardless of product quality.' },
    { q:'How do you know if a subfloor needs leveling?',
      a:'A simple straightedge test reveals most leveling issues — a 10-foot straightedge laid across the floor surface will show any gap between the straightedge and the subfloor. Any gap exceeding 3/16 inch is a leveling concern for most floating floor installations. Tile installation is more demanding — 1/8 inch over 10 feet is the standard for tile substrates. Our assessment visit includes this evaluation at no charge.' },
    { q:'Is floor leveling expensive?',
      a:'The cost of floor leveling varies by the extent of the problem. Minor leveling — filling low spots with self-leveling compound in a kitchen — typically runs $200–$500 as an add-on to a flooring project. More significant leveling across a large area, or grinding down high spots over a concrete slab, can run higher. We identify what\'s needed on the assessment visit and include the full prep cost in the written estimate.' },
    { q:'Can subfloor leveling fix squeaky floors?',
      a:'Squeaks are caused by wood-on-wood friction as subfloor panels or structural members move — usually because fasteners have loosened over time. Self-leveling compound fills surface voids but does not address the structural movement that causes squeaks. Squeaky subfloors are fixed by re-securing the subfloor panels to the joists with screws — typically done as part of a subfloor prep before new flooring goes down. We address both leveling and squeak repair in the same visit.' },
    { q:'Does floor leveling work on concrete slabs?',
      a:'Yes — self-leveling compound bonds directly to concrete and can fill low spots and smooth rough surfaces to a tolerance appropriate for any flooring product. Concrete leveling requires a primer coat before the compound is poured, and the slab must be clean, free of oil, and dry. A moisture test should be performed before any work — applying leveling compound to a slab with active moisture drive creates an adhesion failure at the compound-to-slab bond.' },
    { q:'How long does floor leveling take to dry?',
      a:'Most self-leveling compounds are walkable within two to four hours and ready for flooring installation within 24 hours. Thicker pours — filling a deep low spot — may need longer cure times. Grinding concrete high spots is immediate. We schedule leveling as a standalone service or coordinate it as the first phase of a flooring installation project, with the installation following the next business day.' },
  ],
};

// ── Sub-page prose templates ──────────────────────────────────────────────────

const KITCHEN_SUBPAGE_PROSE = {
  'cabinet-painting': (c) => `<h3>Professional Cabinet Painting in ${c.name}</h3>
      <p>${c.name} homes built over the past twenty to forty years frequently have cabinet doors in structurally sound condition that simply need a color and finish update rather than full replacement. Oak grain, dated profiles, and worn finishes are solvable with professional painting — done correctly, with proper grain filling, priming, and a spray-applied finish. The result is a smooth, durable surface that holds up to kitchen use for seven to ten years.</p>
      <p>We assess your specific cabinet material and door condition during the free in-home visit before any recommendation is made. Not all cabinets are good candidates for painting — if yours aren't, we'll tell you that before you spend anything, and walk you through the alternatives that make sense for your specific situation.</p>`,

  'cabinet-refacing': (c) => `<h3>Cabinet Refacing for ${c.name} Kitchens</h3>
      <p>Cabinet refacing makes sense when your layout works and your boxes are structurally sound — which is the case in the majority of ${c.name} homes we assess. The process replaces every visible surface: doors, drawer fronts, hardware, and the veneer on box faces, while leaving the existing structural framework in place. The result looks like new cabinets at roughly 40–60% of the replacement cost, in two to five days instead of the weeks a full replacement requires.</p>
      <p>The in-home visit determines whether your specific boxes are good refacing candidates. If they are, we walk you through door styles, materials, and hardware options. If they're not — water damage, poor alignment, structural issues — we tell you that honestly before any work begins.</p>`,

  'countertop-replacement': (c) => `<h3>Countertop Replacement in ${c.name}</h3>
      <p>Countertop replacement is one of the highest-impact updates in a kitchen and one of the most timing-sensitive. Material selection should happen in coordination with cabinet decisions — not after — because the countertop material affects the edge profile options, backsplash tile selection, and in some cases the cabinet color decision. Getting this sequence right prevents the most common and costly kitchen update mistakes.</p>
      <p>We coordinate countertop selection, templating, and installation as part of a complete kitchen update or as a standalone service for ${c.name} homeowners who want to upgrade the countertop without touching anything else. The in-home visit determines what's possible in your specific kitchen layout and gives you a written estimate based on what we actually found.</p>`,

  'backsplash': (c) => `<h3>Backsplash Installation in ${c.name}</h3>
      <p>A backsplash update is one of the most visually impactful and least disruptive updates in a kitchen — it changes the character of the space significantly without structural work or extended timelines. Material selection, grout color, and installation pattern all affect the result, and getting those decisions right requires seeing the kitchen in person alongside the existing or planned countertop and cabinet finishes.</p>
      <p>We handle backsplash installation as part of a complete kitchen update or as a standalone project for ${c.name} homeowners who want to change one element without a full renovation. The in-home visit determines the right approach for your specific layout and existing finishes, with a written estimate based on what's actually there.</p>`,

  'remodel-cost': (c) => `<h3>What Kitchen Remodels Actually Cost in ${c.name}</h3>
      <p>The range is intentionally wide because scope determines cost more than location does. A cabinet painting project runs $1,500–$5,000. Refacing runs $6,000–$18,000. A mid-range update with new cabinets, countertops, and backsplash runs $25,000–$60,000. A full gut renovation with layout changes starts at $60,000. Northeast Ohio labor costs run 10–20% below national averages, which makes ${c.name} kitchen projects particularly strong value compared to what the same scope costs in larger markets.</p>
      <p>The number that matters is the one based on your actual kitchen, not a national average or a range from a website. That's what the in-home visit produces — a written estimate specific to what we found in your space and budget.</p>`,

  'local-contractor': (c) => `<h3>Finding the Right Kitchen Contractor in ${c.name}</h3>
      <p>The contractor search in ${c.name} follows the same pattern as anywhere in Northeast Ohio: word of mouth from neighbors who've recently completed a project is the strongest signal, followed by verifiable local project history — actual kitchens in your area that you can see or that the homeowner will walk you through. Reviews matter less than references, and references from recent projects matter more than reviews from five years ago.</p>
      <p>The interview process reveals what the project will actually be like. A contractor who answers questions clearly before you sign tells you something. One who pushes for a quick decision before you've had a chance to compare tells you something else. We offer a free in-home consultation in ${c.name} with no commitment required — the visit is designed to give you enough information to make the right decision, whether that includes us or not.</p>`,
};

const FLOORING_SUBPAGE_PROSE = {
  'carpet': (c) => `<h3>Carpet Selection and Installation in ${c.name}</h3>
      <p>Carpet selection involves more decisions than most homeowners expect — fiber type, pile construction, face weight, density, and pad specification all affect long-term performance in ways that the showroom feel test doesn't reveal. Nylon outperforms polyester in high-traffic areas consistently, and pad density matters as much as carpet density for how the floor holds up over time. The most common mistake: choosing fiber and face weight without asking about density rating.</p>
      <p>We bring carpet samples to your ${c.name} home, assess the subfloor and existing conditions, and give you a written quote that includes pad, installation, demo of the existing floor, and any necessary subfloor repairs. No surprises on install day, no separate pad vendor, no undisclosed fees.</p>`,

  'hardwood-flooring': (c) => `<h3>Hardwood Flooring in ${c.name}</h3>
      <p>Hardwood flooring requires acclimation time in your home before installation — the material needs to adjust to your specific humidity environment before it's nailed or floated into place. This is a step that shortcuts consistently regret: hardwood installed without proper acclimation expands, gaps, and buckles as it adjusts to the space after the fact. Plan for a delivery window followed by the installation appointment, not a same-day drop-and-install.</p>
      <p>We assess your ${c.name} subfloor as part of every hardwood quote, determine whether engineered or solid hardwood is the right choice for your specific situation, and give you a written estimate that includes installation, transitions, and any necessary subfloor prep. One team from the first visit through the final walkthrough.</p>`,

  'vinyl-plank-flooring': (c) => `<h3>LVP and Vinyl Plank Flooring in ${c.name}</h3>
      <p>Luxury vinyl plank is the most versatile and most forgiving flooring choice for most ${c.name} households — genuinely waterproof, durable with an adequate wear layer, and installable over most existing surfaces when the subfloor is properly assessed first. The wear layer specification matters more than brand: 20 mil for households with pets, kids, or high traffic; 12 mil for moderate residential use. Most big box store product sits at 6 or 8 mil without making that clear on the label.</p>
      <p>We assess the subfloor, confirm the moisture conditions, and give you a written estimate that covers everything: demo of the existing floor, any necessary subfloor leveling, installation, and transitions. No separate subfloor crew, no day-of-installation surprises, and a firm project schedule before any work begins.</p>`,

  'floor-leveling': (c) => `<h3>Floor Leveling Services in ${c.name}</h3>
      <p>Subfloor leveling is the step that determines whether a new floor performs correctly over time. A floating floor installed over an uneven subfloor will creak, flex, and eventually fail at the locking joints — regardless of product quality. Most ${c.name} homes built before 1990 have subfloors with at least minor leveling needs, and homes with concrete subfloors at grade level frequently have moisture or pitch issues that need to be addressed before any new flooring goes down.</p>
      <p>We offer floor leveling as a standalone service for homeowners who aren't replacing the floor but are dealing with subfloor problems — squeaks, soft spots, unlevel surfaces that are a safety concern. Assessment is always the first step, and the written estimate covers the actual scope of work required, not a best-case approximation.</p>`,
};

// ── Helper functions ──────────────────────────────────────────────────────────

function faqHtml(faqs) {
  return faqs.map(({q, a}) =>
`      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)">
          ${q}
          <svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="faq-a">${a}</div>
      </div>`
  ).join('\n\n');
}

function replaceLocalProse(html, newProse) {
  const OPEN = '<div class="local-prose">';
  const start = html.indexOf(OPEN);
  if (start === -1) return html;
  // local-prose never has nested <div>s — first </div> closes it
  const end = html.indexOf('</div>', start + OPEN.length) + '</div>'.length;
  return html.slice(0, start) + OPEN + '\n      ' + newProse + '\n    </div>' + html.slice(end);
}

function replaceFaqList(html, newFaqHtml) {
  const faqStart = html.indexOf('<div class="faq-list"');
  if (faqStart === -1) return html;
  const divOpenEnd = html.indexOf('>', faqStart) + 1;
  const divOpenTag = html.slice(faqStart, divOpenEnd);

  // Find matching closing </div> by tracking nesting
  let pos = divOpenEnd;
  let depth = 1;
  while (pos < html.length && depth > 0) {
    const nextOpen  = html.indexOf('<div', pos);
    const nextClose = html.indexOf('</div>', pos);
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else if (nextClose !== -1) {
      depth--;
      if (depth === 0) { pos = nextClose; break; }
      pos = nextClose + 6;
    } else break;
  }
  const end = pos + '</div>'.length;
  return html.slice(0, faqStart) + divOpenTag + '\n\n' + newFaqHtml + '\n    </div>' + html.slice(end);
}

function replaceNearbyLinks(html, city, service) {
  // Footer nearby heading differs between kitchen ("Nearby Areas") and flooring ("Other Cities")
  const nearbyHeader = html.includes('<h4>Nearby Areas</h4>') ? '<h4>Nearby Areas</h4>' : '<h4>Other Cities</h4>';
  const headerIdx = html.indexOf(nearbyHeader);
  if (headerIdx === -1) return html;
  const ulStart = html.indexOf('<ul>', headerIdx);
  const ulEnd   = html.indexOf('</ul>', ulStart) + '</ul>'.length;
  const links = city.nearby.map(n =>
    `          <li><a href="/${service}/${n.slug}/">${n.name}</a></li>`
  ).join('\n');
  return html.slice(0, ulStart) + '<ul>\n' + links + '\n        </ul>' + html.slice(ulEnd);
}

function applyCommonReplacements(html, city, oldHood) {
  // Fix legacy footer slugs that differ from what we actually generate
  html = html.replaceAll('/cost-and-financing/', '/remodel-cost/');
  html = html.replaceAll('/contractors/', '/local-contractor/');
  // City name (title-case) and slug (lowercase)
  html = html.replaceAll('Westlake', city.name);
  html = html.replaceAll('westlake', city.slug);
  // County (only in "Ohio · Cuyahoga County" context)
  html = html.replace('Ohio · Cuyahoga County', `Ohio · ${city.county}`);
  // Font: Playfair Display → Cormorant Garamond
  html = html.replaceAll('Playfair+Display:ital,wght@0,700;0,900;1,700', 'Cormorant+Garamond:ital,wght@0,600;0,700;1,600');
  html = html.replaceAll("'Playfair Display',serif", "'Cormorant Garamond',serif");
  // Neighborhood placeholder
  if (oldHood) html = html.replaceAll(oldHood, city.kitchenHood);
  return html;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  if (DRY_RUN) {
    console.log(`  [dry-run] would write: ${filePath}`);
    return;
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  wrote: ${filePath.replace(ROOT, '')}`);
}

// ── Template cache ────────────────────────────────────────────────────────────

const templateCache = {};

function readTemplate(relPath) {
  if (!templateCache[relPath]) {
    const fullPath = path.join(ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`  [warn] template not found: ${fullPath}`);
      return null;
    }
    templateCache[relPath] = fs.readFileSync(fullPath, 'utf8');
  }
  return templateCache[relPath];
}

// ── Page generators ───────────────────────────────────────────────────────────

// Kitchen hub
function generateKitchenHub(city) {
  let html = readTemplate('kitchen/westlake/index.html');
  if (!html) return;
  const WESTLAKE_HOOD = 'Kingswood, Luxury Clusters, Detroit Rd Tracts, Crocker Woods...';
  html = applyCommonReplacements(html, city, WESTLAKE_HOOD);
  html = replaceLocalProse(html, city.kitchenProse);
  html = replaceFaqList(html, faqHtml(FAQS.kitchen));
  html = stampNav(html);
  html = stampFooter(html, city, 'kitchen');
  writeFile(path.join(ROOT, 'kitchen', city.slug, 'index.html'), html);
}

// Kitchen sub-pages
function generateKitchenSubpage(city, subpage) {
  const template = `kitchen/westlake/${subpage}/index.html`;
  let html = readTemplate(template);
  if (!html) return;
  html = applyCommonReplacements(html, city, null);
  const prose = KITCHEN_SUBPAGE_PROSE[subpage] ? KITCHEN_SUBPAGE_PROSE[subpage](city) : null;
  if (prose) html = replaceLocalProse(html, prose);
  const faqs = FAQS[subpage];
  if (faqs) html = replaceFaqList(html, faqHtml(faqs));
  html = stampNav(html);
  html = stampFooter(html, city, 'kitchen');
  writeFile(path.join(ROOT, 'kitchen', city.slug, subpage, 'index.html'), html);
}

// Flooring hub
function generateFlooringHub(city) {
  let html = readTemplate('flooring/westlake/index.html');
  if (!html) return;
  const FLOORING_HOOD = html.match(/placeholder="([^"]*Crocker[^"]*)"/) ?
    html.match(/placeholder="([^"]*Crocker[^"]*)"/)[1] : null;
  html = applyCommonReplacements(html, city, FLOORING_HOOD);
  if (city.flooringHood && FLOORING_HOOD) {
    html = html.replaceAll(FLOORING_HOOD, city.flooringHood);
  }
  html = replaceLocalProse(html, city.flooringProse);
  html = replaceFaqList(html, faqHtml(FAQS.flooring));
  html = stampNav(html);
  html = stampFooter(html, city, 'flooring');
  writeFile(path.join(ROOT, 'flooring', city.slug, 'index.html'), html);
}

// Flooring sub-pages
function generateFlooringSubpage(city, subpage) {
  const template = `flooring/westlake/${subpage}/index.html`;
  let html = readTemplate(template);
  if (!html) return;
  html = applyCommonReplacements(html, city, null);
  const prose = FLOORING_SUBPAGE_PROSE[subpage] ? FLOORING_SUBPAGE_PROSE[subpage](city) : null;
  if (prose) html = replaceLocalProse(html, prose);
  const faqs = FAQS[subpage];
  if (faqs) html = replaceFaqList(html, faqHtml(faqs));
  html = stampNav(html);
  html = stampFooter(html, city, 'flooring');
  writeFile(path.join(ROOT, 'flooring', city.slug, subpage, 'index.html'), html);
}

// ── Sitemap updater ───────────────────────────────────────────────────────────

function updateSitemap(newUrls) {
  if (DRY_RUN) {
    console.log(`\n[dry-run] would add ${newUrls.length} URLs to sitemap.xml`);
    return;
  }
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const insertBefore = '</urlset>';
  const entries = newUrls
    .filter(url => !sitemap.includes(`<loc>${url}</loc>`))
    .map(url => `  <url><loc>${url}</loc></url>`)
    .join('\n');
  if (entries) {
    sitemap = sitemap.replace(insertBefore, entries + '\n' + insertBefore);
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    console.log(`\nAdded ${newUrls.filter(u => !sitemap.includes(u)).length} new URLs to sitemap.xml`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const KITCHEN_SUBPAGES  = ['cabinet-painting','cabinet-refacing','countertop-replacement','backsplash','remodel-cost','local-contractor'];
const FLOORING_SUBPAGES = ['carpet','hardwood-flooring','vinyl-plank-flooring','floor-leveling'];

function main() {
  const newUrls = [];
  let pagesGenerated = 0;

  for (const city of CITIES) {
    if (ALREADY_BUILT.has(city.slug)) {
      console.log(`Skipping ${city.name} (already built)`);
      continue;
    }

    console.log(`\nGenerating ${city.name} (${city.county})...`);

    // Kitchen hub
    generateKitchenHub(city);
    newUrls.push(`https://remodel.guide/kitchen/${city.slug}/`);
    pagesGenerated++;

    // Kitchen sub-pages
    for (const sub of KITCHEN_SUBPAGES) {
      generateKitchenSubpage(city, sub);
      newUrls.push(`https://remodel.guide/kitchen/${city.slug}/${sub}/`);
      pagesGenerated++;
    }

    // Flooring hub
    generateFlooringHub(city);
    newUrls.push(`https://remodel.guide/flooring/${city.slug}/`);
    pagesGenerated++;

    // Flooring sub-pages
    for (const sub of FLOORING_SUBPAGES) {
      generateFlooringSubpage(city, sub);
      newUrls.push(`https://remodel.guide/flooring/${city.slug}/${sub}/`);
      pagesGenerated++;
    }
  }

  updateSitemap(newUrls);

  console.log(`\n✓ Done. ${pagesGenerated} pages ${DRY_RUN ? 'would be ' : ''}generated across ${CITIES.filter(c => !ALREADY_BUILT.has(c.slug)).length} cities.`);
}

main();
