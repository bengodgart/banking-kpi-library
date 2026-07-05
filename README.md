# Banking &amp; Financial Services KPI Library

A free, formula-precise reference for 31 core banking and financial-services KPIs. Each metric carries a plain-English definition, the exact formula, its numerator and denominator sources, one or two common gotchas, a typical benchmark range, and a source citation. Runs entirely in your browser, no sign-up, nothing leaves the page.

**Live:** https://bengodgart.github.io/banking-kpi-library/

## Why this exists

New analysts in banking re-derive the same KPIs at every job: net interest margin, ROA, the efficiency ratio, CET1. The comprehensive references are paywalled (OpsDog catalogs 700+ banking KPIs behind a product wall), and the free lists tend to give a name and a one-line description without the exact formula or the edge cases that actually matter in practice. This is the version I wanted: a curated core of the metrics that come up most, each one precise enough to drop straight into a metric-definition doc, and honest about where an institution might define things differently.

It is deliberately not 700 metrics. The value is a trusted, formula-precise core you can bookmark, not an exhaustive dump.

## What it does

- Browse 31 KPIs across six categories: Profitability, Efficiency, Risk &amp; Credit Quality, Capital Adequacy, Liquidity &amp; Funding, and Growth &amp; Customer.
- Search by name, acronym, or concept (both "net interest margin" and "NIM" resolve; search is AND-based, so "risk weighted" narrows to the capital ratios).
- Filter by category.
- "Copy definition" drops a clean, plain-text version of any metric (definition, formula, numerator, denominator, range, gotchas, source) into your clipboard, ready to paste into a metric doc or an email.

## Quickstart

No build step and no dependencies. Because the page reads `data/kpis.json`, serve the folder over a local web server rather than opening the file directly:

```
git clone https://github.com/bengodgart/banking-kpi-library.git
cd banking-kpi-library
python -m http.server 8000   # then open http://localhost:8000
```

To run the tests: `node test.js`.

## How these were verified

The formulas are the standard, widely published definitions used across banking analytics. Regulatory ratios (CET1, Tier 1, Total Capital, Leverage, LCR, NSFR) follow Basel III and US call-report conventions and are not open to interpretation. Profitability, efficiency, and customer metrics vary in practice; the exact numerator and denominator a given bank uses can differ (for example, whether average or period-end balances are used, or whether the efficiency ratio is adjusted for securities gains). Where that happens, the metric's gotchas call it out.

**Industry-standard (fixed definition):** all Capital Adequacy ratios and both regulatory Liquidity ratios (LCR, NSFR) are standardized by Basel III / US rules.

**Common baseline, institution-may-vary:** the Profitability, Efficiency, Risk, and Growth metrics use the most common formulation; confirm against your institution's own metric definitions before reporting.

Two metrics are hand-verified below against worked examples.

### Worked example 1: Net Interest Margin

Given a quarter with interest income of 120, interest expense of 40, and average earning assets of 4,000:

```
Net interest income = 120 - 40 = 80  (one quarter)
Annualized          = 80 x 4 = 320
NIM                 = 320 / 4,000 = 0.08 = 8.0%
```

Note the two things the gotchas warn about: annualize the quarterly figure, and divide by average *earning* assets (not total assets).

### Worked example 2: Efficiency Ratio

Given non-interest expense of 55, net interest income of 80, and non-interest income of 20:

```
Total revenue     = 80 + 20 = 100
Efficiency ratio  = 55 / 100 = 0.55 = 55%
```

Lower is better here (the opposite direction from most ratios): 55 cents of cost per dollar of revenue, a typical, healthy level.

## Reusing the data

The metric content lives in `data/kpis.json` as a structured, valid JSON file, so it is reusable outside this page. It can seed a metric-definition document, feed another tool, or serve as the definitions layer for a dashboard project. The schema is one `kpis` array of records, each with `id`, `name`, `category`, `definition`, `formula`, `numerator`, `denominator`, `gotchas` (array), `benchmark`, `source`, and an optional `sql` snippet.

## Privacy

Everything runs client-side. There is no backend, no analytics, no accounts, and nothing you type or copy leaves your browser.

## Tech notes

Plain HTML, CSS, and JavaScript, no framework and no build. The search, filter, and copy logic lives in `kpi.js` as a small module that runs in both the browser and Node, so the same code powers the page and the test suite (`test.js`, 18 assertions, including a validator and a no-em-dash sweep).

## License

MIT. See [LICENSE](LICENSE).
