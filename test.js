// test.js — zero-dependency smoke test for the Banking KPI Library.
// Validates the dataset and exercises the search/filter/copy logic. Run: node test.js
var fs = require("fs");
var path = require("path");
var KPI = require("./kpi.js");

var data = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "kpis.json"), "utf8"));

var failures = 0;
var checks = 0;
function assert(name, cond) {
  checks++;
  if (cond) {
    console.log("  ok   " + name);
  } else {
    console.log("  FAIL " + name);
    failures++;
  }
}

// 1. Dataset loads and clears the validator (required fields, unique ids, known categories).
assert("dataset validates clean", KPI.validate(data).length === 0);
assert("has at least 25 KPIs (brief cap: 25-40)", data.kpis.length >= 25);
assert("has at most 40 KPIs (brief cap)", data.kpis.length <= 40);
assert("meta.count matches actual kpi count", data.meta.count === data.kpis.length);

// 2. Every KPI has a category that exists in the categories list.
var catIds = data.categories.map(function (c) { return c.id; });
assert(
  "every KPI category is defined",
  data.kpis.every(function (k) { return catIds.indexOf(k.category) !== -1; })
);

// 3. Every KPI carries 1-2 gotchas and a source citation (brief requirement).
assert(
  "every KPI has at least one gotcha",
  data.kpis.every(function (k) { return Array.isArray(k.gotchas) && k.gotchas.length >= 1; })
);
assert(
  "every KPI has a source citation",
  data.kpis.every(function (k) { return k.source && k.source.length > 0; })
);

// 4. Search works: a known metric and its acronym both resolve.
var nimByName = KPI.filterKpis(data.kpis, "all", "net interest margin");
assert("search 'net interest margin' finds NIM", nimByName.some(function (k) { return k.id === "nim"; }));
var cet1 = KPI.filterKpis(data.kpis, "all", "CET1");
assert("search 'CET1' finds the CET1 ratio", cet1.some(function (k) { return k.id === "cet1_ratio"; }));

// 5. AND-search narrows results (both terms must appear).
var narrow = KPI.filterKpis(data.kpis, "all", "risk weighted");
assert("AND-search 'risk weighted' returns capital ratios only", narrow.length > 0 &&
  narrow.every(function (k) { return k.category === "capital"; }));

// 6. Category filter isolates a single category.
var liq = KPI.filterKpis(data.kpis, "liquidity", "");
assert("category filter 'liquidity' returns only liquidity KPIs", liq.length > 0 &&
  liq.every(function (k) { return k.category === "liquidity"; }));

// 7. copyText produces clean, labeled text for the copy button.
var nim = data.kpis.filter(function (k) { return k.id === "nim"; })[0];
var text = KPI.copyText(nim);
assert("copyText includes the metric name", text.indexOf("Net Interest Margin") !== -1);
assert("copyText includes the formula", text.indexOf("Formula:") !== -1);
assert("copyText includes the source", text.indexOf("Source:") !== -1);

// 8. Formula spot-checks (hand-verified metrics, matching the README worked examples).
assert("NIM formula divides net interest income by earning assets",
  /Earning Assets/i.test(nim.formula) && /Interest Income - Interest Expense/i.test(nim.formula));
var eff = data.kpis.filter(function (k) { return k.id === "efficiency_ratio"; })[0];
assert("Efficiency ratio = non-interest expense over total revenue",
  /Non-Interest Expense/i.test(eff.formula) && /Net Interest Income \+ Non-Interest Income/i.test(eff.formula));

// 9. No em-dashes anywhere in the dataset (house copy rule).
var raw = JSON.stringify(data);
assert("dataset contains no em-dash", raw.indexOf("—") === -1);
assert("dataset contains no en-dash", raw.indexOf("–") === -1);

console.log("");
if (failures === 0) {
  console.log("All tests passed (" + checks + " assertions).");
  process.exit(0);
} else {
  console.log(failures + " of " + checks + " assertion(s) FAILED.");
  process.exit(1);
}
