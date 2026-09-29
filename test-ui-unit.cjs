/* In-memory DOM integration tests. No browser, network, real account or cloud writes.
   npm install --no-save jsdom; node test-ui-unit.cjs
   These tests do NOT substitute for real viewport / screenshot review. */
const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm");
const assert = require("node:assert/strict");
const { JSDOM, VirtualConsole } = require("jsdom");
const root = path.join(__dirname, "dist"),
  files = [
    "data.js",
    "guide.js",
    "app.js",
    "features.js",
    "route-geometry.js",
    "route-map.js",
    "ui.js",
    "day2.js",
  ];
const errors = [],
  checks = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push(e.message));
const rawCss = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const tokens = Object.fromEntries(
  [...rawCss.matchAll(/(--[a-z-]+):\s*(#[a-f0-9]+)/gi)].map((m) => [m[1], m[2]]),
);
const resolvedCss = rawCss.replace(
  /var\((--[a-z-]+)\)/g,
  (all, k) => tokens[k] || all,
);
const html = fs
  .readFileSync(path.join(root, "index.html"), "utf8")
  .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "")
  .replace(
    /<link\s+rel="stylesheet"\s+href="\.\/styles\.css"\s*\/?>/,
    "<style>" + resolvedCss + "</style>",
  );
const dom = new JSDOM(html, {
  url: "https://unit.test/",
  runScripts: "outside-only",
  pretendToBeVisual: true,
  virtualConsole: vc,
});
const w = dom.window,
  d = w.document,
  ctx = dom.getInternalVMContext();
w.structuredClone = structuredClone;
w.scrollTo = () => {};
w.HTMLElement.prototype.scrollIntoView = () => {};
w.setInterval = () => 0;
w.confirm = () => true;
w.matchMedia = () => ({ matches: true });
let downloadedBlob;
w.URL.createObjectURL = (blob) => { downloadedBlob=blob; return "blob:unit-test"; };
w.URL.revokeObjectURL = () => {};
let downloaded = null;
w.HTMLAnchorElement.prototype.click = function () {
  if (this.download) downloaded = this.download;
};
w.fetch = async (u) => {
  const file = String(u).replace(/^\.\//, "");
  assert.ok(
    [...files, "index.html", "styles.css"].includes(file),
    "no unexpected network request",
  );
  return {
    ok: true,
    text: async () => fs.readFileSync(path.join(root, file), "utf8"),
  };
};
const run = (s) => vm.runInContext(s, ctx),
  tick = () => new Promise((r) => setTimeout(r, 30));
function ok(name, test) {
  test();
  checks.push(name);
}
function click(sel) {
  const n = d.querySelector(sel);
  assert.ok(n, sel);
  n.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
}
async function route(hash) {
  w.location.hash = hash;
  await tick();
  await new Promise((r) => w.requestAnimationFrame(r));
}
function contrast(selector) {
  const el = d.querySelector(selector);
  assert.ok(el, selector);
  const s = w.getComputedStyle(el);
  let p = el,
    bg;
  while (p) {
    const c = w.getComputedStyle(p).backgroundColor;
    if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
      bg = c;
      break;
    }
    p = p.parentElement;
  }
  const rgb = (x) => {
      const m = x.match(/[\d.]+/g);
      if (!m)
        throw Error(selector + " unresolved color " + s.color + " / " + bg);
      return m.slice(0, 3).map(Number);
    },
    lum = (x) =>
      rgb(x)
        .map((v) => {
          v /= 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        })
        .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const a = lum(s.color),
    b = lum(bg || "rgb(255,255,255)");
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
(async () => {
  for (const file of files) run(fs.readFileSync(path.join(root, file), "utf8"));
  await tick();
  ok("home owns full self-drive map; four navigation destinations", () => {
    assert.equal(d.querySelectorAll(".mobile-nav a").length, 4);
    assert.ok(d.querySelector("#home-map #route-svg"));
    assert.equal(d.querySelectorAll(".chapter-card").length, 6);
    assert.equal(d.querySelectorAll(".map-switch button").length, 5);
  });
  click('[data-map-day="2"]');
  ok("October 4 map includes Walmart and legal Zion stop", () => {
    assert.match(d.querySelector(".atlas-stops").textContent, /Walmart/);
    assert.match(d.querySelector(".atlas-stops").textContent, /Visitor Center/);
    assert.match(d.querySelector(".atlas-stops").textContent, /Canyon Overlook/);
    assert.equal(d.querySelectorAll(".map-road").length, 6);
  });
  click('[data-day2-variant="canyon"]');
  ok("October 4 canyon branch switches map and schedule", () => {
    assert.match(d.querySelector(".atlas-stops").textContent, /Visitor Center/);
    assert.equal(d.querySelectorAll(".map-road").length, 4);
  });
  await route("#daily/2");
  ok("canyon route includes groceries, shuttle and Bryce stars", () => {
    const timeline = d.querySelector(".timeline").textContent;
    assert.match(timeline, /Walmart/);
    assert.match(timeline, /Riverside Walk/);
    assert.match(timeline, /Sunrise Point/);
    assert.ok(d.querySelector('[data-star-fold]'));
    assert.match(d.querySelector('.day6-route-picker a').href, /google.com\/maps/);
  });
  await route("#overview");
  click('[data-map-day="6"]');
  ok("full loop renders while October 4 canyon branch is selected", () => {
    assert.ok(d.querySelectorAll(".overview-road").length > 15);
    assert.match(d.querySelector("#home-map").textContent, /ZION/);
  });
  await route("#daily/2");
  click('[data-day2-variant="overlook"]');
  ok("Overlook route retains grocery and sunset contingency", () => {
    const timeline=d.querySelector(".timeline").textContent;
    assert.match(timeline, /Walmart/);
    assert.match(timeline, /Visitor Center/);
    assert.match(timeline, /Canyon Overlook/);
    assert.match(timeline, /Sunset Point/);
    assert.match(timeline, /大概率错过/);
  });
  await route("#overview");
  click('[data-map-day="6"]');
  const directRoads = d.querySelectorAll(".overview-road").length;
  click('[data-map-day="4"]');
  click('[data-map-variant="core"]');
  ok("October 6 backtrack map and origin/destination navigation", () => {
    assert.equal(d.querySelectorAll(".map-road").length, 9);
    assert.equal(d.querySelectorAll(".map-road.backtrack").length, 1);
  });
  click('.atlas-stops [data-map-stop="8"]');
  ok("map stop selects Yavapai to Desert View route", () => {
    assert.match(
      d.querySelector(".atlas-detail h2").textContent,
      /Yavapai.*Desert View/s,
    );
    assert.match(d.querySelector(".atlas-detail a").href, /origin=/);
  });
  click('[data-map-day="6"]');
  ok("full loop preserves backtrack", () =>
    assert.equal(d.querySelectorAll(".overview-road").length, directRoads + 1),
  );
  await route("#daily/4");
  ok("hashchange uses redesigned day renderer; branch matches timeline", () => {
    assert.ok(d.querySelector(".daily-heading"));
    assert.match(d.querySelector(".timeline").textContent, /折返 Desert View/);
    assert.match(d.querySelector(".star-panel h2").textContent, /Desert View/);
    assert.equal(d.querySelector("[data-star-fold]").open, false);
  });
  click('[data-map-variant="direct"]');
  ok("switch back restores original day without losing content", () =>
    assert.doesNotMatch(
      d.querySelector(".timeline").textContent,
      /折返 Desert View/,
    ),
  );
  const ratios = {};
  for (const selector of [
    ".day-banner h1",
    ".day-banner p",
    ".metrics",
    ".event-card>p",
    ".star-sky h2",
    ".star-sky p",
    ".star-sky .eyebrow",
  ]) {
    ratios[selector] = Number(contrast(selector).toFixed(2));
    assert.ok(
      ratios[selector] >= 4.5,
      `${selector} contrast ${ratios[selector]}`,
    );
  }
  checks.push(
    "token-resolved DOM text contrast >= 4.5:1 for day and night surfaces",
  );
  for (let day = 0; day < 6; day++) {
    await route("#daily/" + day);
    ok(
      "day " +
        day +
        " renders complete events and collapsed restaurant candidates",
      () => {
        assert.equal(
          d.querySelectorAll(".event").length,
          run("DAYS[" + day + "].events.length"),
        );
        assert.equal(d.querySelectorAll(".meal-drawer[open]").length, 0);
        assert.doesNotMatch(
          d.querySelector("main").textContent,
          /undefined|NaN/,
        );
      },
    );
  }
  await route("#daily/1");
  ok("O show remains 21:00 confirmed", () =>
    assert.match(d.querySelector(".timeline").textContent, /已预订 · 21:00/),
  );
  click('[data-filter="food"]');
  ok("food filter works", () =>
    assert.equal(
      d.querySelectorAll(".event").length,
      run('DAYS[1].events.filter(e=>e.type==="food").length'),
    ),
  );
  const first = d.querySelector("[data-pick-meal]");
  const meal = first.dataset.pickMeal;
  click('[data-pick-meal="' + meal + '"]');
  let form = d.querySelector('[data-meal-form="' + meal + '"]');
  form.elements.spent.value = "42.50";
  form.elements.rating.value = "5";
  form.elements.note.value = "QA test only";
  form.dispatchEvent(
    new w.Event("submit", { bubbles: true, cancelable: true }),
  );
  ok("selected meal saves rating, navigation and expense once", () => {
    assert.match(d.querySelector(".meal-selected").textContent, /42.50/);
    assert.equal(
      run('prefs.expenses.filter(x=>x.id==="meal:' + meal + '").length'),
      1,
    );
    assert.match(
      d.querySelector(".meal-selected a").href,
      /google.com\/maps\/dir/,
    );
  });
  form = d.querySelector('[data-meal-form="' + meal + '"]');
  form.elements.spent.value = "43";
  form.dispatchEvent(
    new w.Event("submit", { bubbles: true, cancelable: true }),
  );
  await route("#ledger");
  ok("ledger includes exactly one edited meal", () => {
    assert.equal(d.querySelectorAll(".expense-row").length, 1);
    assert.match(d.querySelector(".expense-row").textContent, /43.00/);
    assert.equal(d.querySelectorAll(".cloud-panel").length, 0);
  });
  let ef = d.querySelector("#expense-form");
  ef.elements.namedItem("category").value = "fuel";
  ef.elements.namedItem("title").value = "QA fuel";
  ef.elements.namedItem("amount").value = "30";
  ef.dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  ok("categorized expense create", () =>
    assert.equal(d.querySelectorAll(".expense-row").length, 2),
  );
  click('[data-ledger-category="fuel"]');
  ok("ledger category filter", () => {
    assert.equal(d.querySelectorAll(".expense-row").length, 1);
    assert.match(d.querySelector(".expense-row").textContent, /QA fuel/);
  });
  click("[data-edit-expense]");
  ef = d.querySelector("#expense-form");
  ef.elements.namedItem("amount").value = "31";
  ef.dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  ok("expense edit", () =>
    assert.match(d.querySelector(".expense-row").textContent, /31.00/),
  );
  click("[data-delete-expense]");
  ok("expense delete", () =>
    assert.equal(d.querySelectorAll(".expense-row").length, 0),
  );
  await route("#kit/stays");
  ok("hotel deep link opens hotel folder; correct five nights", () => {
    assert.equal(d.querySelector("#stay-folder").open, true);
    assert.equal(d.querySelectorAll(".hotel").length, 4);
    assert.match(d.querySelector("#stay-folder").textContent, /Fairfield/);
  });
  await route("#kit/sync");
  ok("sync deep link opens private settings", () =>
    assert.equal(d.querySelector("#sync-folder").open, true),
  );
  d.querySelector("#private-address").value = "QA private address";
  d.querySelector("#private-note").value = "QA note";
  d.querySelector("#rail-start").value = "2026-10-03T09:10";
  click('[data-action="save-private"]');
  ok("private form retains address, note and monorail timer", () => {
    assert.equal(run("prefs.airbnb"), "QA private address");
    assert.match(
      d.querySelector("#rail-result").textContent,
      /10月4日|10\/0?4|10-04|24/,
    );
  });
  await route("#map");
  ok("legacy map link lands in homepage atlas", () => {
    assert.ok(d.querySelector(".journey-cover"));
    assert.ok(d.querySelector("#route-svg"));
  });
  await route("#daily/2");
  click("[data-done]");
  ok("progress updates and stays persisted", () =>
    assert.ok(d.querySelector(".event.done")),
  );
  await route("#kit");
  let off = d.querySelector('[data-action="offline"]');
  await run('offline(document.querySelector("[data-action=offline]"))');
  const offlineHtml=await new Promise(resolve=>{const reader=new w.FileReader();reader.onload=()=>resolve(reader.result);reader.readAsText(downloadedBlob);});
  ok("standalone offline bundle embeds styles and all eight scripts", () => {
    assert.match(downloaded, /离线旅行手册.html/);
    assert.match(offlineHtml, /<style>[\s\S]*\.journey-cover/);
    assert.match(offlineHtml, /const DAY_TITLES/);
    const offlineDoc=new JSDOM(offlineHtml,{runScripts:'outside-only'});
    assert.equal(offlineDoc.window.document.querySelectorAll('script').length,8);
    assert.equal(offlineDoc.window.document.querySelectorAll('script[src],link[rel=stylesheet]').length,0);
    offlineDoc.window.document.querySelectorAll('script').forEach(s=>new vm.Script(s.textContent));
    offlineDoc.window.close();
    assert.doesNotMatch(offlineHtml, /QA private address/);
  });
  await route("#kit/private");
  ok("private-address navigation opens correct drawer", () =>
    assert.equal(d.querySelector("#private-folder").open, true),
  );
  run("render()");
  ok("open drawers survive same-page rerender", () =>
    assert.equal(d.querySelector("#private-folder").open, true),
  );
  const backup = JSON.parse(run("JSON.stringify({version:2,prefs})"));
  backup.prefs.starPlans = { 3: { status: "done" } };
  backup.prefs.done["d4-core-0"] = true;
  const input = d.querySelector("#import-file");
  Object.defineProperty(input, "files", {
    value: [{ size: 2000, text: async () => JSON.stringify(backup) }],
  });
  input.dispatchEvent(new w.Event("change", { bubbles: true }));
  await tick();
  ok(
    "backup import retains meals, expenses, stars and both route branches",
    () => {
      assert.equal(
        run("prefs.meals[" + JSON.stringify(meal) + "].note"),
        "QA test only",
      );
      assert.equal(run("prefs.expenses[0].amount"), 43);
      assert.equal(run("prefs.starPlans[3].status"), "done");
      assert.equal(run('prefs.done["d4-core-0"]'), true);
    },
  );
  ok("import rejects invalid expense values and unknown categories", () =>
    assert.equal(
      run(
        'sanitizeFeatureBackup({expenses:[{id:"bad",date:"2026-10-05",category:"fuel",amount:-3},{id:"bad2",date:"2026-10-05",category:"unknown",amount:3}]}).expenses.length',
      ),
      0,
    ),
  );
  for (const variant of ["direct", "core"]) {
    run("mapVariant=" + JSON.stringify(variant) + ";applyDay6Variant()");
    ok(variant + " itinerary times stay non-overlapping", () =>
      assert.equal(
        run(
          "DAYS.flatMap(d=>d.events.filter((e,i)=>stamp(d,e,true)<stamp(d,e)||(i&&stamp(d,e)<stamp(d,d.events[i-1],true)))).length",
        ),
        0,
      ),
    );
  }
  ok("all source files parse; SW and offline bundle include UI", () => {
    for (const f of files)
      new vm.Script(fs.readFileSync(path.join(root, f), "utf8"));
    assert.match(fs.readFileSync(path.join(root, "sw.js"), "utf8"), /ui\.js/);
  });
  ok("no DOM runtime errors", () => assert.deepEqual(errors, []));
  console.log(
    JSON.stringify(
      {
        testType: "In-memory DOM, not visual/browser QA",
        passed: checks.length,
        checks,
        contrast: ratios,
      },
      null,
      2,
    ),
  );
  dom.window.close();
})().catch((e) => {
  console.error(e);
  dom.window.close();
  process.exitCode = 1;
});
