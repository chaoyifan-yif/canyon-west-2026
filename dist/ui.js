"use strict";
/* Presentation layer. It shares the itinerary, map and personal-record state. */
const DAY_TITLES = [
  "Las Vegas · 老城夜游",
  "Las Vegas · 长街与 O 秀",
  "Zion → Bryce · 进入峡谷",
  "Bryce → Page · 石柱与光影",
  "大峡谷南缘 → Flagstaff",
  "秋色、66 号公路与返程",
];
const DAY_AREAS = [
  "LAS VEGAS",
  "THE STRIP",
  "ZION / BRYCE",
  "BRYCE / PAGE",
  "GRAND CANYON",
  "ROUTE 66 / LAS",
];
const DAY_SHORT = [
  "老城夜游",
  "长街与 O 秀",
  "Zion · Bryce",
  "Bryce · Page",
  "大峡谷南缘",
  "秋色与返程",
];
const TYPE_LABEL = {
  flight: "航班",
  drive: "自驾",
  stay: "住宿",
  food: "吃饭",
  see: "游览",
  hike: "徒步",
  ticket: "预约",
  transit: "交通",
  rest: "休息",
  car: "还车",
};
let mapInteractive = false;
mapDay = 6;
mapView = null;

function icon(name) {
  const paths = {
    route:
      '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15m6-12v15"/>',
    day: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 5 3 2 5-5"/>',
    record: '<path d="M5 3h12l2 2v16H5Z"/><path d="M9 8h6M9 12h6m-6 4h3"/>',
    kit: '<path d="M8 7V5a4 4 0 0 1 8 0v2"/><rect x="4" y="7" width="16" height="14" rx="4"/><path d="M8 12h8m-8 4h8"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
    star: '<path d="m12 2 2.8 6.2L22 9l-5.2 4.8 1.5 7.2L12 17.3 5.7 21l1.5-7.2L2 9l7.2-.8Z"/>',
  };
  return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
}
function sectionHeading(kicker, title, extra = "") {
  return `<div class="section-title"><div><p class="eyebrow">${kicker}</p><h2>${title}</h2></div>${extra}</div>`;
}
function fold(title, sub, body, extra = "") {
  return `<details class="fold" data-folder="${esc(view + ":" + day + ":" + title)}" ${extra}><summary><span><strong>${title}</strong>${sub ? `<small>${sub}</small>` : ""}</span><span class="fold-arrow" aria-hidden="true">＋</span></summary><div class="fold-body">${body}</div></details>`;
}
function routeChoice() {
  return `<div class="day6-route-picker"><div><strong>10/6 · 日落后怎么走</strong><p>${mapVariant === "core" ? "B：折返 Desert View 看日落、拍银心，再去 Flagstaff。" : "A：Yavapai 看日落，随后直接去 Flagstaff。"}</p></div><div role="group" aria-label="10月6日路线"><button type="button" data-map-variant="direct" aria-pressed="${mapVariant === "direct"}" class="${mapVariant === "direct" ? "active" : ""}">A · 直接南下</button><button type="button" data-map-variant="core" aria-pressed="${mapVariant === "core"}" class="${mapVariant === "core" ? "active" : ""}">B · 折返拍星</button></div></div>`;
}
function homeAtlas() {
  const template = document.createElement("template");
  template.innerHTML = routeMap();
  const canvas = template.content.querySelector(".atlas-map")?.outerHTML || "";
  const detail =
    mapDay === 6
      ? ""
      : template.content.querySelector(".atlas-detail")?.outerHTML || "";
  const notes =
    mapDay === 6
      ? ""
      : template.content.querySelector(".atlas-footnotes")?.outerHTML || "";
  return `<section id="home-map" class="home-map">${sectionHeading("THE DRIVE / 四天自驾", "把一路风景连起来。", '<span class="section-aside">10.04 — 10.07</span>')}<div class="map-switch" role="group" aria-label="选择自驾日期">${[
    [6, "全程"],
    [2, "10/4"],
    [3, "10/5"],
    [4, "10/6"],
    [5, "10/7"],
  ]
    .map(
      ([n, label]) =>
        `<button type="button" data-map-day="${n}" class="${n === mapDay ? "active" : ""}" aria-pressed="${n === mapDay}">${label}</button>`,
    )
    .join(
      "",
    )}</div><div class="home-map-frame ${detail ? "has-detail" : ""} ${mapInteractive ? "map-interactive" : "map-locked"}">${canvas}${detail}</div><div class="map-bottom"><span>道路快照 · 可缩放 · 点日期看逐段导航</span><button class="map-gesture" type="button" data-map-touch aria-pressed="${mapInteractive}">${mapInteractive ? "结束拖动，恢复页面滑动" : "启用地图拖动"}</button></div>${mapDay === 4 ? routeChoice() : fold("10/6 的两条走法", mapVariant === "core" ? "已选 B · 折返 Desert View 补拍银心" : "已选 A · 看完日落直接南下", routeChoice())}${notes ? fold("这一段的时间与路况提示", "出发前再核对实际车程", notes) : ""}</section>`;
}
function tripPulse() {
  const l = live(),
    before = now() < zoned(TRIP.start, "18:50", "America/Los_Angeles");
  const index = before ? 0 : (l?.d.index ?? 5);
  return `<div class="trip-pulse"><span class="pulse-dot"></span><div><small>${sim ? "演示时钟" : before ? "出发前预览" : l?.current ? "按计划，此刻" : "接下来"}</small><strong>${before ? "10 月 2 日抵达 Las Vegas" : l ? `${l.d.short} ${l.e.start} · ${l.e.title}` : "旅程结束，回看一路记录"}</strong></div><a href="#daily/${index}" class="pulse-link">${before ? "看第一天" : "看当天"} ${icon("arrow")}</a></div>`;
}
overview = function () {
  return `<section class="journey-cover"><div class="cover-copy"><p class="eyebrow">02 — 07 OCTOBER 2026 · TWO TRAVELERS</p><h1>峡谷以西<span>六天，走进美国西南。</span></h1><p class="cover-route">Las Vegas / Zion / Bryce / Page / Grand Canyon</p><div class="cover-meta"><span>6 天</span><span>5 晚</span><span>3 州</span><a href="#kit/stays">住宿与订单 ↗</a></div></div><div class="cover-art">${artwork("grand", true)}<span>36° N · 112° W</span></div></section>${tripPulse()}${homeAtlas()}<section class="chapter-section">${sectionHeading("SIX DAYS / 按日期出发", "每天一页，路上随手翻。")}<div class="days-grid">${DAYS.map((d) => `<a class="day-card chapter-card" href="#daily/${d.index}"><span class="chapter-date"><small>OCT</small>${d.date.slice(-2)}</span><div class="chapter-copy"><small>${d.weekday} · ${DAY_AREAS[d.index]}</small><h3>${DAY_SHORT[d.index]}</h3><p>${esc(d.route)}</p><span class="chapter-stay">${d.stay ? esc(hotel(d.stay).city) + " · " + esc(hotel(d.stay).name) : "19:50 · LAS 飞回湾区"}</span></div><span class="chapter-arrow">↗</span></a>`).join("")}</div></section><div class="home-notes"><div><p class="eyebrow">记住这一小时</p><h3>进 Utah 快一小时，去 Page 再拨回来。</h3><p>10/4 进入 Utah：UTC−6。10/5 到 Page 后：UTC−7。每个行程时间已经按当地时区写好。</p></div><div><p class="eyebrow">山区也能翻</p><h3>出发前存一份离线手册。</h3><p>行程和自驾图可以离线查看，Google Maps 导航请提前下载离线地图。</p><button class="text-button" data-action="offline">下载离线手册 ↓</button></div></div>`;
};
function dayTabs() {
  return `<div class="day-tabs" role="group" aria-label="选择日期">${DAYS.map((d) => `<button type="button" data-day="${d.index}" aria-label="${d.short} ${d.weekday} · ${DAY_SHORT[d.index]}" class="day-tab ${day === d.index ? "active" : ""}" aria-pressed="${day === d.index}"><small>${d.weekday.slice(2)}</small><strong>${d.date.slice(-2)}</strong></button>`).join("")}</div>`;
}
function dayFocus(d) {
  const tripToday = currentTripDay() === d.index;
  const t = now();
  const next = tripToday
    ? d.events.find((e) => stamp(d, e, true) > t)
    : d.events.find((e) => !prefs.done[e.id]);
  const h = hotel(d.stay);
  return `<div class="day-focus"><div class="next-stop"><p class="eyebrow">${tripToday ? "按计划 · 当前 / 下一站" : "日程预览 · 第一项未完成"}</p><strong>${next ? `${next.start} · ${esc(next.title)}` : "今天的安排已全部勾选"}</strong><div class="button-row">${next ? `<button class="text-button" data-jump="${next.id}">定位这项安排 ↓</button>` : ""}<span>${d.events.filter((e) => prefs.done[e.id]).length} / ${d.events.length} 已完成</span></div></div><div class="tonight"><p class="eyebrow">${h ? "今晚住这里" : "回程航班"}</p><strong>${h ? esc(h.name) : "19:50 · LAS → 湾区"}</strong><div class="button-row">${mapLink(h?.id || "rental", h ? "住宿导航" : "Hertz 还车导航")}<a class="source-link" href="#kit/stays">${h ? "入住信息" : "订单与行前核对"} ↗</a></div></div></div>`;
}
eventCard = function (d, e) {
  const t = now(),
    active = t >= stamp(d, e) && t < stamp(d, e, true),
    done = !!prefs.done[e.id];
  const selected = prefs.meals?.[e.id];
  const mode =
    e.mode ||
    (["rail", "harrahs", "paris"].includes(e.place) ? "walking" : "driving");
  const navigation = selected?.address
    ? `<a class="nav-link" target="_blank" rel="noopener noreferrer" href="${esc(mapsAddress(selected.address, mode))}">导航到 ${esc(selected.name)}</a>`
    : mapLink(
        e.place,
        e.type === "hike"
          ? "停车 / 步道入口"
          : e.type === "food"
            ? "原计划地点"
            : "打开导航",
        mode,
        e.origin || "",
      );
  const status =
    e.ticket === "o"
      ? "已预订 · 21:00"
      : e.ticket
        ? prefs.confirmed[e.ticket]
          ? "已核对电子票"
          : "请核对电子票"
        : e.status;
  return `<article class="event ${active ? "current" : ""} ${done ? "done" : ""}" id="${e.id}"><div class="event-time"><strong>${e.start}</strong><span>${zoneLabel(e.zone)}${e.openEnd ? " · 起飞" : ` · ${duration(d, e)}`}</span>${active ? '<b class="status-now">计划此刻</b>' : ""}</div><div class="event-card"><div class="event-head"><div><span class="event-kicker">${TYPE_LABEL[e.type] || "行程"}${e.optional ? " · 可删减" : ""}</span><h3>${esc(e.title)}</h3></div><input class="check" type="checkbox" data-done="${e.id}" ${done ? "checked" : ""} aria-label="标记完成：${esc(e.title)}"></div><p>${esc(e.summary)}</p><div class="event-actions">${navigation}${e.secondPlace ? mapLink(e.secondPlace, "另一处停车场") : ""}${status ? `<span class="tag">${esc(status)}</span>` : ""}<span class="event-end">${e.openEnd ? "以机票为准" : `至 ${e.end} ${zoneLabel(e.endZone)}`}</span></div>${e.steps.length ? `<details ${expand ? "open" : ""}><summary>现场提示 · ${e.steps.length} 条</summary><ol>${e.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>${e.source ? src(e.source) : ""}</details>` : e.source ? `<p>${src(e.source)}</p>` : ""}${MEALS[e.id] ? mealPanel(e) : ""}</div></article>`;
};
daily = function () {
  const d = DAYS[day];
  return `<header class="daily-heading"><p class="eyebrow">DAILY / OCTOBER ${d.date.slice(-2)}</p>${dayTabs()}<div class="day-banner"><div><span class="day-location">${DAY_AREAS[day]}</span><h1>${DAY_TITLES[day]}</h1><p>${esc(d.route)}</p></div><div class="metrics"><span>起床 <b>${esc(d.wake)}</b></span><span>驾车 <b>${esc(d.drive)}</b></span><span>${esc(d.zoneLabel)}</span></div></div></header>${sim ? '<div class="notice">正在使用演示时钟。<a href="#kit">返回行囊恢复真实时间</a></div>' : ""}${dayFocus(d)}${day === 4 ? routeChoice() : ""}<div class="day-briefs">${fold("今天要留意", day === 1 ? "21:00 O 秀已预订" : day === 5 ? "19:50 航班 · 预留还车与接驳时间" : d.alerts[0], `<p>${esc(d.intro)}</p><ul>${d.alerts.map((a) => `<li>${esc(a)}</li>`).join("")}</ul><p><strong>如果晚了：</strong>${esc(d.fallback)}</p>`)}${STARS[day] ? fold("今晚的拍星攻略", day === 4 && mapVariant === "core" ? STAR6_CORE.window : STARS[day].window, starPanel(day), "data-star-fold") : ""}</div><div class="toolbar"><div class="filter-row">${[
    ["all", "全部"],
    ["food", "吃饭"],
    ["drive", "交通"],
    ["see", "游玩"],
  ]
    .map(
      ([k, n]) =>
        `<button class="filter ${filter === k ? "active" : ""}" data-filter="${k}" aria-pressed="${filter === k}">${n}</button>`,
    )
    .join(
      "",
    )}</div><div class="toolbar-tools"><button class="source-link" data-action="expand">${expand ? "收起详情" : "展开提示"}</button><input class="search" type="search" placeholder="搜索当天安排" aria-label="搜索当日行程" value="${esc(query)}"></div></div><div class="timeline" id="timeline">${timeline()}</div><div class="day-pagination">${day > 0 ? `<button class="btn" data-day="${day - 1}">← ${DAYS[day - 1].short}</button>` : "<span></span>"}${day < 5 ? `<button class="btn primary" data-day="${day + 1}">${DAYS[day + 1].short} 下一天 →</button>` : '<a class="btn primary" href="#ledger">回看旅途记录 →</a>'}</div>`;
};
const renderLedger = ledger;
ledger = function () {
  const template = document.createElement("template");
  template.innerHTML = renderLedger();
  template.content.querySelector(".page-heading")?.remove();
  template.content.querySelector(".cloud-panel")?.remove();
  template.content.querySelector(".ledger-summary>div:last-child")?.remove();
  const body = template.innerHTML
    .replace("每一笔，都能找回来。", "消费明细")
    .replace(
      "餐费可在每日餐卡编辑；其他项目点右侧“编辑”。",
      "吃饭的实付会从每日餐卡自动记入。",
    )
    .replace("ADD A MEMORY / 也记一笔", "NEW ENTRY / 记一笔");
  const meals = Object.entries(prefs.meals || {}).filter(([, m]) => m.name);
  return `<div class="page-heading"><p class="eyebrow">JOURNAL / 旅途记录</p><h1>吃过的，走过的，记下来。</h1><p>金额以 USD 实付记录。<a class="text-button" href="#kit/sync">${cloudMode === "synced" ? "已云端同步" : "同步与备份设置"} ↗</a></p></div>${meals.length ? fold("我们的餐厅记录", `${meals.length} 顿已选 · 随时补评价`, `<div class="meal-journal">${meals.map(([id, m]) => `<article><div><strong>${esc(m.name)}</strong><p>${m.rating ? "★".repeat(m.rating) + " · " : ""}${esc(m.note || "吃完再来补一句。")}</p></div><button class="text-button" data-open-meal="${esc(id)}">查看 / 编辑 ↗</button></article>`).join("")}</div>`) : ""}${body}`;
};
function hotelCollection() {
  const t = document.createElement("template");
  t.innerHTML = stays();
  return t.content.querySelector(".hotel-grid").outerHTML;
}
kit = function () {
  return `<div class="page-heading"><p class="eyebrow">ESSENTIALS / 行囊</p><h1>出发要用的，都放这里。</h1><p>住宿、订单、离线手册与个人记录。</p></div><div class="kit-shortcuts"><button data-action="offline">${icon("record")}<strong>离线手册</strong><small>下载后没网也能翻</small></button><button data-action="print">${icon("day")}<strong>打印 / PDF</strong><small>完整六天行程</small></button><button data-action="export">${icon("kit")}<strong>备份记录</strong><small>地址、餐厅与账本</small></button></div><div class="kit-grid"><div>${fold("五晚住宿", "按入住日期查看地址、早餐和停车", hotelCollection(), 'id="stay-folder"')}${fold("订单与私密地址", "电子票、Hatch 民宿门牌、随手记", `<div class="panel private-panel"><div class="booking-confirmed">已预订 · 10/3 21:00 Bellagio O 秀</div><label><input type="checkbox" data-confirm="ken" ${prefs.confirmed.ken ? "checked" : ""}> 已核对 10/5 16:00 Ken’s 电子票</label><label>Hatch Airbnb 完整地址<input id="private-address" value="${esc(prefs.airbnb)}" placeholder="从已确认订单复制门牌地址"></label><p>未填写时仅标出 Hatch 镇中心；门牌不会写入公开网页。</p><label>Monorail 24 小时票首次进闸<input id="rail-start" type="datetime-local" value="${esc(prefs.railStart)}"></label><p id="rail-result">${railResult()}</p><label>随手记<textarea id="private-note" placeholder="入住提醒、预约备注，不填门锁密码或证件号">${esc(prefs.note)}</textarea></label><button class="btn primary" data-action="save-private">保存个人记录</button></div>`, 'id="private-folder"')}${fold("出发清单", `${Object.values(prefs.packed).filter(Boolean).length} / ${TRIP.packing.length} 已勾选`, `<section class="panel checklist">${TRIP.packing.map((s, i) => `<label><input type="checkbox" data-packed="${i}" ${prefs.packed[i] ? "checked" : ""}><span>${esc(s)}</span></label>`).join("")}</section>`)}</div><div>${fold("云端同步与备份", cloudMode === "synced" ? "已同步 · 可在其他设备登录读取" : "个人记录默认保存在这台设备", cloudPanel() + `<div class="backup-actions"><button class="btn" data-action="export">导出个人记录</button><button class="btn" data-action="import">导入备份</button><input hidden type="file" id="import-file" accept="application/json,.json"><p>备份包含你填写的地址与备注，请妥善保管。</p></div>`, 'id="sync-folder"')}${fold("交通、门票与官方链接", "国家公园年卡、停车费和临行复查", `<div class="reference-copy"><p><strong>10/4 取车：</strong>Uber 直接去 Hertz 租车中心，7135 Gilespie Street。</p><p><strong>Monorail：</strong>24 小时票从首次扫码计时。${src("railHours")}</p><p><strong>国家公园：</strong>Zion、Bryce、大峡谷普通入园无需预订时段；携带有效且适用的年卡和持卡人证件。特定活动另有要求。</p><p><strong>另外收费：</strong>Ken’s 导览单独预约；马蹄湾停车费不由国家公园年卡覆盖。</p><div class="sources">${Object.keys(TRIP.sources).map(src).join("")}</div></div>`)}${fold("预览某个时刻", "用演示时钟检查当地时间与下一站", `<section class="panel"><div class="sim-row"><label>日期<select id="sim-day">${DAYS.map((d) => `<option value="${d.index}" ${day === d.index ? "selected" : ""}>${d.short}</option>`).join("")}</select></label><label>当地时间<input type="time" id="sim-time" value="14:20"></label></div><label>时区<select id="sim-zone"><option value="America/Phoenix">Page / Flagstaff / Vegas · UTC−7</option><option value="America/Denver">Zion / Bryce / Hatch · UTC−6</option></select></label><div class="button-row"><button class="btn" data-action="simulate">预览行程</button><button class="btn" data-action="real-time">恢复真实时钟</button></div><p>${sim ? "当前是演示时钟。" : "当前使用真实时钟。"}</p></section>`, 'id="clock-folder"')}</div></div>`;
};

/* Keep shared links working while presenting four primary destinations. */
render = function (scroll = false) {
  const openFolders = new Set(
    [...document.querySelectorAll("details[data-folder][open]")].map(
      (el) => el.dataset.folder,
    ),
  );
  $("#main").innerHTML = (
    { overview, daily, stays, ledger, kit }[view] || overview
  )();
  document.querySelectorAll("details[data-folder]").forEach((el) => {
    if (openFolders.has(el.dataset.folder)) el.open = true;
  });
  document.body.dataset.page = view;
  const active = view === "stays" ? "kit" : view;
  document.querySelectorAll("[data-view]").forEach((n) => {
    n.classList.toggle("active", n.dataset.view === active);
    if (n.dataset.view === active) n.setAttribute("aria-current", "page");
    else n.removeAttribute("aria-current");
  });
  document.title = `${view === "daily" ? DAYS[day].short + " · " + DAY_SHORT[day] : "峡谷以西"} · 2026 西南旅行手册`;
  if (scroll) window.scrollTo({ top: 0, behavior: "instant" });
};
route = function () {
  const a = location.hash.slice(1).split("/");
  view = ["overview", "daily", "stays", "ledger", "kit"].includes(a[0])
    ? a[0]
    : "overview";
  if (a[0] === "map") {
    view = "overview";
    mapDay = 6;
    mapView = null;
  }
  if (view === "daily" && /^\d+$/.test(a[1] || "") && +a[1] < 6) day = +a[1];
  filter = "all";
  query = "";
  prefs.view = view;
  prefs.day = day;
  save();
  render(true);
  requestAnimationFrame(() => {
    if (a[0] === "map") $("#home-map")?.scrollIntoView({ block: "start" });
    const id =
      a[1] === "stays"
        ? "stay-folder"
        : a[1] === "sync"
          ? "sync-folder"
          : a[1] === "private"
            ? "private-folder"
            : null;
    if (view === "kit" && id) {
      const el = document.getElementById(id);
      if (el) {
        el.open = true;
        el.scrollIntoView({ block: "start" });
      }
    }
  });
};
chooseMapDay = function (next) {
  if (![2, 3, 4, 5, 6].includes(next)) return;
  mapDay = next;
  mapLeg = 0;
  mapView = null;
  render();
  document
    .getElementById("home-map")
    ?.scrollIntoView({ block: "start", behavior: "instant" });
};
chooseMapVariant = function (next) {
  if (!["direct", "core"].includes(next)) return;
  const pos = window.scrollY;
  mapVariant = next;
  try {
    localStorage.setItem("canyon-day6-route", next);
  } catch {}
  applyDay6Variant();
  mapLeg = 0;
  mapView = null;
  render();
  window.scrollTo({ top: pos, behavior: "instant" });
};
document.addEventListener("click", (e) => {
  const touch = e.target.closest("[data-map-touch]");
  if (touch) {
    mapInteractive = !mapInteractive;
    const pos = window.scrollY;
    render();
    window.scrollTo({ top: pos, behavior: "instant" });
  }
  const meal = e.target.closest("[data-open-meal]");
  if (meal) {
    const id = meal.dataset.openMeal,
      di = Number(id.match(/^d(\d+)-/)?.[1]);
    mealDrawerOpen.add(id);
    chooseDay(di);
    setTimeout(
      () =>
        document
          .getElementById(id)
          ?.scrollIntoView({ block: "start", behavior: "smooth" }),
      80,
    );
  }
});
document.addEventListener("pointercancel", () => {
  mapPointer = null;
});
