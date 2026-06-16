# remodel.guide — Build Standards

## Every Page Checklist
Every new page must include all of the following before being considered done:

1. **Canonical tag** — self-referencing, trailing slash, inside `<head>`
   `<link rel="canonical" href="https://remodel.guide/path/to/page/" />`

2. **Google Analytics** — GA4 snippet, inside `<head>` before `</head>`
   Measurement ID: `G-668G89NRZE`

3. **LocalBusiness JSON-LD schema** — inside `<head>`, every page
   Business: Remodelry | Phone: 440-252-1053 | Service area: Lorain, Cuyahoga, Medina County OH

4. **Nav header** — must match site-wide canonical nav exactly

5. **Footer** — must match site-wide canonical footer exactly

6. **Sitemap** — add the new URL to sitemap.xml before pushing

---

## URL / Canonical Rules
- Always use `https://remodel.guide/` (no www)
- Always use trailing slashes: `/kitchen/westlake/` not `/kitchen/westlake`
- Canonical tag must match the sitemap URL exactly

---

## Boilerplate `<head>` Block
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>PAGE TITLE</title>
<meta name="description" content="DESCRIPTION" />
<link rel="canonical" href="https://remodel.guide/PATH/" />

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-668G89NRZE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-668G89NRZE');
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "GeneralContractor"],
  "name": "Remodelry",
  "telephone": "440-252-1053",
  "url": "https://remodel.guide/",
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Lorain County, Ohio" },
    { "@type": "AdministrativeArea", "name": "Cuyahoga County, Ohio" },
    { "@type": "AdministrativeArea", "name": "Medina County, Ohio" }
  ],
  "sameAs": ["https://remodel.guide/"]
}
</script>
```

---

## sitemap.xml
- Location: `/sitemap.xml`
- Format: `https://remodel.guide/path/` with trailing slash
- Submit to Google Search Console after any new pages are added
- robots.txt already configured correctly — do not modify

---

## Business Info
- Business name: Remodelry
- Phone: 440-252-1053
- Google Business Profile: verified
- Google Analytics: G-668G89NRZE
- Service area: Lorain County, Cuyahoga County, Medina County (Ohio)
