'use strict';

// Base data for all 37 city pages (7 existing + 30 new).
// Prose lives in generate-pages.js — only lookup data here.

const ALL_CITIES = [
  // ── Existing (already built) ──────────────────────────────────────────────
  { name:'Westlake',          slug:'westlake',          county:'Cuyahoga County',
    nearby:[{name:'Rocky River',slug:'rocky-river'},{name:'Bay Village',slug:'bay-village'},{name:'North Olmsted',slug:'north-olmsted'},{name:'Avon',slug:'avon'},{name:'Fairview Park',slug:'fairview-park'}] },
  { name:'Amherst',           slug:'amherst',           county:'Lorain County',
    nearby:[{name:'North Ridgeville',slug:'north-ridgeville'},{name:'Elyria',slug:'elyria'},{name:'Avon',slug:'avon'},{name:'Sheffield Lake',slug:'sheffield-lake'},{name:'Lorain',slug:'lorain'}] },
  { name:'Broadview Heights', slug:'broadview-heights', county:'Cuyahoga County',
    nearby:[{name:'Brecksville',slug:'brecksville'},{name:'Strongsville',slug:'strongsville'},{name:'Seven Hills',slug:'seven-hills'},{name:'Independence',slug:'independence'},{name:'Brunswick',slug:'brunswick'}] },
  { name:'Brunswick',         slug:'brunswick',         county:'Medina County',
    nearby:[{name:'Medina',slug:'medina'},{name:'Strongsville',slug:'strongsville'},{name:'Brecksville',slug:'brecksville'},{name:'Hinckley',slug:'hinckley'},{name:'Wadsworth',slug:'wadsworth'}] },
  { name:'Medina',            slug:'medina',            county:'Medina County',
    nearby:[{name:'Brunswick',slug:'brunswick'},{name:'Wadsworth',slug:'wadsworth'},{name:'Hinckley',slug:'hinckley'},{name:'Strongsville',slug:'strongsville'},{name:'Brecksville',slug:'brecksville'}] },
  { name:'North Ridgeville',  slug:'north-ridgeville',  county:'Lorain County',
    nearby:[{name:'Avon',slug:'avon'},{name:'North Olmsted',slug:'north-olmsted'},{name:'Elyria',slug:'elyria'},{name:'Amherst',slug:'amherst'},{name:'Westlake',slug:'westlake'}] },
  { name:'Strongsville',      slug:'strongsville',      county:'Cuyahoga County',
    nearby:[{name:'Broadview Heights',slug:'broadview-heights'},{name:'Brunswick',slug:'brunswick'},{name:'Olmsted Falls',slug:'olmsted-falls'},{name:'Middleburg Heights',slug:'middleburg-heights'},{name:'Berea',slug:'berea'}] },

  // ── Lorain County (new) ───────────────────────────────────────────────────
  { name:'Avon',              slug:'avon',              county:'Lorain County',
    nearby:[{name:'Avon Lake',slug:'avon-lake'},{name:'North Ridgeville',slug:'north-ridgeville'},{name:'Westlake',slug:'westlake'},{name:'North Olmsted',slug:'north-olmsted'},{name:'Sheffield Lake',slug:'sheffield-lake'}] },
  { name:'Avon Lake',         slug:'avon-lake',         county:'Lorain County',
    nearby:[{name:'Avon',slug:'avon'},{name:'Sheffield Lake',slug:'sheffield-lake'},{name:'Westlake',slug:'westlake'},{name:'Bay Village',slug:'bay-village'},{name:'North Ridgeville',slug:'north-ridgeville'}] },
  { name:'Elyria',            slug:'elyria',            county:'Lorain County',
    nearby:[{name:'Amherst',slug:'amherst'},{name:'Lorain',slug:'lorain'},{name:'North Ridgeville',slug:'north-ridgeville'},{name:'Avon',slug:'avon'},{name:'Sheffield Lake',slug:'sheffield-lake'}] },
  { name:'Lorain',            slug:'lorain',            county:'Lorain County',
    nearby:[{name:'Elyria',slug:'elyria'},{name:'Amherst',slug:'amherst'},{name:'Sheffield Lake',slug:'sheffield-lake'},{name:'Vermilion',slug:'vermilion'},{name:'Avon Lake',slug:'avon-lake'}] },
  { name:'Sheffield Lake',    slug:'sheffield-lake',    county:'Lorain County',
    nearby:[{name:'Avon Lake',slug:'avon-lake'},{name:'Lorain',slug:'lorain'},{name:'Avon',slug:'avon'},{name:'Vermilion',slug:'vermilion'},{name:'Bay Village',slug:'bay-village'}] },
  { name:'Vermilion',         slug:'vermilion',         county:'Lorain County',
    nearby:[{name:'Sheffield Lake',slug:'sheffield-lake'},{name:'Lorain',slug:'lorain'},{name:'Amherst',slug:'amherst'},{name:'Elyria',slug:'elyria'},{name:'Avon Lake',slug:'avon-lake'}] },

  // ── Cuyahoga County (new) ─────────────────────────────────────────────────
  { name:'Rocky River',       slug:'rocky-river',       county:'Cuyahoga County',
    nearby:[{name:'Westlake',slug:'westlake'},{name:'Bay Village',slug:'bay-village'},{name:'Fairview Park',slug:'fairview-park'},{name:'Lakewood',slug:'lakewood'},{name:'North Olmsted',slug:'north-olmsted'}] },
  { name:'Bay Village',       slug:'bay-village',       county:'Cuyahoga County',
    nearby:[{name:'Westlake',slug:'westlake'},{name:'Avon Lake',slug:'avon-lake'},{name:'Rocky River',slug:'rocky-river'},{name:'Sheffield Lake',slug:'sheffield-lake'},{name:'Fairview Park',slug:'fairview-park'}] },
  { name:'Lakewood',          slug:'lakewood',          county:'Cuyahoga County',
    nearby:[{name:'Rocky River',slug:'rocky-river'},{name:'Fairview Park',slug:'fairview-park'},{name:'Cleveland Heights',slug:'cleveland-heights'},{name:'Brooklyn',slug:'brooklyn'},{name:'Parma Heights',slug:'parma-heights'}] },
  { name:'Fairview Park',     slug:'fairview-park',     county:'Cuyahoga County',
    nearby:[{name:'Rocky River',slug:'rocky-river'},{name:'North Olmsted',slug:'north-olmsted'},{name:'Olmsted Falls',slug:'olmsted-falls'},{name:'Lakewood',slug:'lakewood'},{name:'Brook Park',slug:'brook-park'}] },
  { name:'North Olmsted',     slug:'north-olmsted',     county:'Cuyahoga County',
    nearby:[{name:'Westlake',slug:'westlake'},{name:'Olmsted Falls',slug:'olmsted-falls'},{name:'Fairview Park',slug:'fairview-park'},{name:'North Ridgeville',slug:'north-ridgeville'},{name:'Avon',slug:'avon'}] },
  { name:'Olmsted Falls',     slug:'olmsted-falls',     county:'Cuyahoga County',
    nearby:[{name:'North Olmsted',slug:'north-olmsted'},{name:'Strongsville',slug:'strongsville'},{name:'Berea',slug:'berea'},{name:'Middleburg Heights',slug:'middleburg-heights'},{name:'Fairview Park',slug:'fairview-park'}] },
  { name:'Berea',             slug:'berea',             county:'Cuyahoga County',
    nearby:[{name:'Olmsted Falls',slug:'olmsted-falls'},{name:'Brook Park',slug:'brook-park'},{name:'Middleburg Heights',slug:'middleburg-heights'},{name:'Strongsville',slug:'strongsville'},{name:'Parma Heights',slug:'parma-heights'}] },
  { name:'Brook Park',        slug:'brook-park',        county:'Cuyahoga County',
    nearby:[{name:'Berea',slug:'berea'},{name:'Parma',slug:'parma'},{name:'Middleburg Heights',slug:'middleburg-heights'},{name:'Fairview Park',slug:'fairview-park'},{name:'North Olmsted',slug:'north-olmsted'}] },
  { name:'Middleburg Heights',slug:'middleburg-heights',county:'Cuyahoga County',
    nearby:[{name:'Berea',slug:'berea'},{name:'Brook Park',slug:'brook-park'},{name:'Strongsville',slug:'strongsville'},{name:'Olmsted Falls',slug:'olmsted-falls'},{name:'Parma Heights',slug:'parma-heights'}] },
  { name:'Parma',             slug:'parma',             county:'Cuyahoga County',
    nearby:[{name:'Parma Heights',slug:'parma-heights'},{name:'Brooklyn',slug:'brooklyn'},{name:'Brook Park',slug:'brook-park'},{name:'Seven Hills',slug:'seven-hills'},{name:'Independence',slug:'independence'}] },
  { name:'Parma Heights',     slug:'parma-heights',     county:'Cuyahoga County',
    nearby:[{name:'Parma',slug:'parma'},{name:'Middleburg Heights',slug:'middleburg-heights'},{name:'Berea',slug:'berea'},{name:'Lakewood',slug:'lakewood'},{name:'Brooklyn',slug:'brooklyn'}] },
  { name:'Brooklyn',          slug:'brooklyn',          county:'Cuyahoga County',
    nearby:[{name:'Parma Heights',slug:'parma-heights'},{name:'Parma',slug:'parma'},{name:'Lakewood',slug:'lakewood'},{name:'Independence',slug:'independence'},{name:'Seven Hills',slug:'seven-hills'}] },
  { name:'Independence',      slug:'independence',      county:'Cuyahoga County',
    nearby:[{name:'Seven Hills',slug:'seven-hills'},{name:'Parma',slug:'parma'},{name:'Brooklyn',slug:'brooklyn'},{name:'Brecksville',slug:'brecksville'},{name:'Broadview Heights',slug:'broadview-heights'}] },
  { name:'Seven Hills',       slug:'seven-hills',       county:'Cuyahoga County',
    nearby:[{name:'Independence',slug:'independence'},{name:'Parma',slug:'parma'},{name:'Brecksville',slug:'brecksville'},{name:'Broadview Heights',slug:'broadview-heights'},{name:'Parma Heights',slug:'parma-heights'}] },
  { name:'Brecksville',       slug:'brecksville',       county:'Cuyahoga County',
    nearby:[{name:'Broadview Heights',slug:'broadview-heights'},{name:'Seven Hills',slug:'seven-hills'},{name:'Independence',slug:'independence'},{name:'Strongsville',slug:'strongsville'},{name:'Brunswick',slug:'brunswick'}] },
  { name:'Euclid',            slug:'euclid',            county:'Cuyahoga County',
    nearby:[{name:'Lyndhurst',slug:'lyndhurst'},{name:'Cleveland Heights',slug:'cleveland-heights'},{name:'Mayfield Heights',slug:'mayfield-heights'},{name:'Beachwood',slug:'beachwood'},{name:'Shaker Heights',slug:'shaker-heights'}] },
  { name:'Cleveland Heights', slug:'cleveland-heights', county:'Cuyahoga County',
    nearby:[{name:'Euclid',slug:'euclid'},{name:'Lakewood',slug:'lakewood'},{name:'Lyndhurst',slug:'lyndhurst'},{name:'Shaker Heights',slug:'shaker-heights'},{name:'Mayfield Heights',slug:'mayfield-heights'}] },
  { name:'Shaker Heights',    slug:'shaker-heights',    county:'Cuyahoga County',
    nearby:[{name:'Cleveland Heights',slug:'cleveland-heights'},{name:'Beachwood',slug:'beachwood'},{name:'Lyndhurst',slug:'lyndhurst'},{name:'Solon',slug:'solon'},{name:'Independence',slug:'independence'}] },
  { name:'Solon',             slug:'solon',             county:'Cuyahoga County',
    nearby:[{name:'Beachwood',slug:'beachwood'},{name:'Shaker Heights',slug:'shaker-heights'},{name:'Lyndhurst',slug:'lyndhurst'},{name:'Mayfield Heights',slug:'mayfield-heights'},{name:'Brecksville',slug:'brecksville'}] },
  { name:'Beachwood',         slug:'beachwood',         county:'Cuyahoga County',
    nearby:[{name:'Solon',slug:'solon'},{name:'Lyndhurst',slug:'lyndhurst'},{name:'Shaker Heights',slug:'shaker-heights'},{name:'Mayfield Heights',slug:'mayfield-heights'},{name:'Cleveland Heights',slug:'cleveland-heights'}] },
  { name:'Lyndhurst',         slug:'lyndhurst',         county:'Cuyahoga County',
    nearby:[{name:'Beachwood',slug:'beachwood'},{name:'Mayfield Heights',slug:'mayfield-heights'},{name:'Euclid',slug:'euclid'},{name:'Shaker Heights',slug:'shaker-heights'},{name:'Solon',slug:'solon'}] },
  { name:'Mayfield Heights',  slug:'mayfield-heights',  county:'Cuyahoga County',
    nearby:[{name:'Lyndhurst',slug:'lyndhurst'},{name:'Beachwood',slug:'beachwood'},{name:'Euclid',slug:'euclid'},{name:'Solon',slug:'solon'},{name:'Cleveland Heights',slug:'cleveland-heights'}] },

  // ── Medina County (new) ───────────────────────────────────────────────────
  { name:'Wadsworth',         slug:'wadsworth',         county:'Medina County',
    nearby:[{name:'Medina',slug:'medina'},{name:'Brunswick',slug:'brunswick'},{name:'Strongsville',slug:'strongsville'},{name:'Brecksville',slug:'brecksville'},{name:'Hinckley',slug:'hinckley'}] },
  { name:'Hinckley',          slug:'hinckley',          county:'Medina County',
    nearby:[{name:'Brunswick',slug:'brunswick'},{name:'Medina',slug:'medina'},{name:'Brecksville',slug:'brecksville'},{name:'Strongsville',slug:'strongsville'},{name:'Wadsworth',slug:'wadsworth'}] },
];

// Slug → city lookup
const CITY_MAP = Object.fromEntries(ALL_CITIES.map(c => [c.slug, c]));

module.exports = { ALL_CITIES, CITY_MAP };
