// app.js — DOM wiring for the Banking KPI Library. Loads the KPI data,
// renders cards, and drives search, category filter, and copy-to-clipboard.
// All logic that can be tested lives in kpi.js; this file only touches the page.

(function () {
  "use strict";

  var state = { data: null, category: "all", query: "" };

  var els = {
    search: document.getElementById("search"),
    filters: document.getElementById("filters"),
    results: document.getElementById("results"),
    count: document.getElementById("resultCount"),
    empty: document.getElementById("emptyState"),
    status: document.getElementById("copyStatus")
  };

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function categoryLabel(id) {
    var c = (state.data.categories || []).filter(function (x) {
      return x.id === id;
    })[0];
    return c ? c.label : id;
  }

  function renderFilters() {
    var cats = state.data.categories || [];
    var buttons = ['<button type="button" class="chip is-active" data-cat="all">All</button>'];
    cats.forEach(function (c) {
      buttons.push(
        '<button type="button" class="chip" data-cat="' +
          escapeHtml(c.id) +
          '">' +
          escapeHtml(c.label) +
          "</button>"
      );
    });
    els.filters.innerHTML = buttons.join("");
  }

  function cardHtml(kpi) {
    var gotchas = (kpi.gotchas || [])
      .map(function (g) {
        return "<li>" + escapeHtml(g) + "</li>";
      })
      .join("");
    var sql = kpi.sql
      ? '<div class="kpi-sql"><span class="kpi-label">Example SQL</span><pre>' +
        escapeHtml(kpi.sql) +
        "</pre></div>"
      : "";
    return (
      '<article class="kpi-card" data-id="' +
      escapeHtml(kpi.id) +
      '">' +
      '<div class="kpi-head">' +
      "<h3>" +
      escapeHtml(kpi.name) +
      "</h3>" +
      '<span class="kpi-cat">' +
      escapeHtml(categoryLabel(kpi.category)) +
      "</span>" +
      "</div>" +
      '<p class="kpi-def">' +
      escapeHtml(kpi.definition) +
      "</p>" +
      '<div class="kpi-formula"><span class="kpi-label">Formula</span><code>' +
      escapeHtml(kpi.formula) +
      "</code></div>" +
      '<div class="kpi-grid">' +
      '<div><span class="kpi-label">Numerator</span><p>' +
      escapeHtml(kpi.numerator) +
      "</p></div>" +
      '<div><span class="kpi-label">Denominator</span><p>' +
      escapeHtml(kpi.denominator) +
      "</p></div>" +
      "</div>" +
      '<div class="kpi-gotchas"><span class="kpi-label">Gotchas</span><ul>' +
      gotchas +
      "</ul></div>" +
      '<div class="kpi-meta">' +
      '<div><span class="kpi-label">Typical range</span><p>' +
      escapeHtml(kpi.benchmark || "n/a") +
      "</p></div>" +
      '<div><span class="kpi-label">Source</span><p>' +
      escapeHtml(kpi.source || "") +
      "</p></div>" +
      "</div>" +
      sql +
      '<div class="kpi-actions">' +
      '<button type="button" class="btn btn-secondary copy-btn" data-id="' +
      escapeHtml(kpi.id) +
      '">Copy definition</button>' +
      "</div>" +
      "</article>"
    );
  }

  function render() {
    var list = window.KPI.filterKpis(state.data.kpis, state.category, state.query);
    els.count.textContent =
      list.length + (list.length === 1 ? " metric" : " metrics");
    if (!list.length) {
      els.results.innerHTML = "";
      els.empty.hidden = false;
      return;
    }
    els.empty.hidden = true;
    els.results.innerHTML = list.map(cardHtml).join("");
  }

  function onCopy(id) {
    var kpi = state.data.kpis.filter(function (k) {
      return k.id === id;
    })[0];
    if (!kpi) return;
    var text = window.KPI.copyText(kpi);
    var done = function () {
      els.status.textContent = "Copied " + kpi.name + " to your clipboard.";
      setTimeout(function () {
        els.status.textContent = "";
      }, 2500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallbackCopy);
    } else {
      fallbackCopy();
    }
    function fallbackCopy() {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        done();
      } catch (e) {
        els.status.textContent = "Copy failed; select the card text manually.";
      }
      document.body.removeChild(ta);
    }
  }

  function wireEvents() {
    els.search.addEventListener("input", function () {
      state.query = this.value;
      render();
    });
    els.filters.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cat]");
      if (!btn) return;
      state.category = btn.getAttribute("data-cat");
      Array.prototype.forEach.call(els.filters.children, function (c) {
        c.classList.toggle("is-active", c === btn);
      });
      render();
    });
    els.results.addEventListener("click", function (e) {
      var btn = e.target.closest(".copy-btn");
      if (btn) onCopy(btn.getAttribute("data-id"));
    });
  }

  function showLoadError() {
    els.results.innerHTML =
      '<div class="load-error"><strong>Could not load the KPI data.</strong>' +
      "<p>If you opened this file directly, serve the folder over a local web server " +
      "(<code>python -m http.server 8000</code>) so the browser can read " +
      "<code>data/kpis.json</code>. The published site loads it automatically.</p></div>";
  }

  fetch("data/kpis.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      state.data = data;
      renderFilters();
      wireEvents();
      render();
    })
    .catch(showLoadError);
})();
