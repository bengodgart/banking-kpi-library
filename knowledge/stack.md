---
type: Tech Stack
title: banking-kpi-library stack
description: 'Frameworks, storage and services banking-kpi-library runs on.'
runtime: Browser
framework: 'None. Plain HTML, CSS and JavaScript.'
build: 'None. No build step and no dependencies.'
storage: 'data/kpis.json, a static JSON file fetched by the page.'
hosting: GitHub Pages
tests: 'node test.js, 18 assertions'
generated:
  by: claude-opus-5
  at: '2026-07-29T04:24:12+00:00'
status: stable
---

# Stack

* **Runtime**: the browser. There is no backend, no analytics and no accounts.
* **Framework**: none. Plain HTML, CSS and JavaScript, no framework and no build.
* **Build**: none.
* **Files that carry the logic**: `kpi.js` is a small module holding the search, filter and
  copy logic. `app.js` is the DOM wiring, `index.html` and `styles.css` are the page.
* **Data**: `data/kpis.json`. One `kpis` array of records, each with `id`, `name`,
  `category`, `definition`, `formula`, `numerator`, `denominator`, `gotchas` as an array,
  `benchmark`, `source`, and an optional `sql` snippet.
* **Hosting**: GitHub Pages.
* **Tests**: `node test.js`, 18 assertions including a validator and a no-em-dash sweep.

## Notes

`kpi.js` runs in both the browser and Node, so the same code powers the page and the test
suite.
