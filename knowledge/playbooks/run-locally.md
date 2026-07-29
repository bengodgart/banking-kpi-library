---
type: Playbook
title: Run banking-kpi-library locally
description: 'How to serve banking-kpi-library and run its tests on a dev machine.'
generated:
  by: claude-opus-5
  at: '2026-07-29T04:31:42+00:00'
status: stable
---

# Steps

1. Clone the repo: `git clone https://github.com/bengodgart/banking-kpi-library.git`
2. `cd banking-kpi-library`
3. `python -m http.server 8000` then open `http://localhost:8000`.

## Available scripts

* `node test.js` runs the test suite, 18 assertions.

There is no build step and no dependencies.

## Common failures

* **Opening `index.html` directly from disk shows an empty page.** The page reads
  `data/kpis.json` with a fetch, which browsers block over `file://`. Serve the folder over
  a local web server instead, as in step 3. This is the one failure that actually bites here
  and is why the README leads with the server command rather than open the file.

## Deploying

It is a static page, so GitHub Pages hosts it for $0. `publish-guide.html` in the repo has
the click path.
