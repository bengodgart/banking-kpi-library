---
type: Product
title: banking-kpi-library
description: 'A formula-precise reference for 31 core banking and financial-services KPIs, each with a plain-English definition, the exact formula, its numerator and denominator, common gotchas, a benchmark range and a source citation.'
domain: Finance & Accounting
users: 'Analysts in banking and financial services who re-derive the same KPIs at every job and need a definition precise enough to drop into a metric doc.'
lifecycle: shipped
live_url: https://bengodgart.github.io/banking-kpi-library/
pricing: 'Free. MIT licensed, no sign-up.'
generated:
  by: claude-opus-5
  at: '2026-07-29T04:00:00+00:00'
status: stable
resource: https://github.com/bengodgart/banking-kpi-library.git
---

# banking-kpi-library

A formula-precise reference for 31 core banking and financial-services KPIs, each with a
plain-English definition, the exact formula, its numerator and denominator, common gotchas,
a benchmark range and a source citation.

## Who it is for

Analysts in banking and financial services who re-derive the same KPIs at every job and need
a definition precise enough to drop into a metric doc.

## What problem it solves

New analysts re-derive net interest margin, ROA, the efficiency ratio and CET1 at every job.
The comprehensive references are paywalled, and the free lists give a name and a one-line
description without the exact formula or the edge cases that actually matter.

It is deliberately not 700 metrics. The value is a trusted, formula-precise core you can
bookmark. 31 KPIs across six categories, searchable by name, acronym or concept, filterable
by category, with a copy button that drops a clean plain-text version of any metric into the
clipboard ready to paste into a metric doc or an email.

Honesty about definitions is built in. The capital adequacy ratios and both regulatory
liquidity ratios are standardised by Basel III and US rules and are not open to
interpretation. The profitability, efficiency, risk and growth metrics use the most common
formulation and can vary by institution, and where they do, the metric gotchas say so.

## Current state

Shipped and public on GitHub Pages. Two metrics, net interest margin and the efficiency
ratio, are hand-verified against worked examples in the README.

The metric content lives in `data/kpis.json` as structured, valid JSON, so it is reusable
outside this page: it can seed a metric-definition document, feed another tool, or serve as
the definitions layer for a dashboard project.
