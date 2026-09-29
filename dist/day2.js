"use strict";
/* Oct 4 is a field decision: one shared grocery run, two honest Zion branches. */
P.walmart = "Walmart Neighborhood Market, 5940 Losee Rd, North Las Vegas, NV 89081";
P.zionvc = "Zion Canyon Visitor Center Parking Lot, Springdale, UT";
P.brycepoint = "Bryce Point Parking, Bryce Canyon National Park, UT";
TRIP.sources.walmart = ["Walmart · Losee Rd 门店与营业时间", "https://www.walmart.com/store/4339-north-las-vegas-nv"];
TRIP.sources.zionParking = ["NPS · Zion 停车与接驳", "https://www.nps.gov/zion/planyourvisit/traffic.htm"];
TRIP.sources.zionShuttle = ["NPS · 2026 Zion Shuttle 时刻", "https://www.nps.gov/zion/planyourvisit/zion-canyon-shuttle-system.htm"];
TRIP.sources.riverside = ["NPS · Riverside Walk", "https://www.nps.gov/thingstodo/hike-riverside-walk.htm"];
TRIP.sources.bryceNight = ["NPS · Bryce 观星机位", "https://www.nps.gov/thingstodo/stargazing-at-bryce-canyon.htm"];
TRIP.sources.bryceParking = ["NPS · Bryce 观景点停车", "https://www.nps.gov/brca/planyourvisit/parking-information.htm"];

const DAY2_COMMON = [
  ...DAYS[2].events.slice(0, 5),
  ev("10:00","10:25","drive","Hertz → Walmart Losee Rd","上 I-15 北行前先采购；导航到 5940 Losee Rd，别走到别的 Walmart。","walmart",["取车延迟时仍保留采购，把逛店压缩为 25 分钟。"],{zone:"America/Los_Angeles",origin:"rental",source:"walmart"}),
  ev("10:25","11:00","food","一站买齐水、路餐和早餐","买一箱水、两份当天三明治/便当、10/5 早餐、零食、水果与电解质饮料；35 分钟是快购目标，超时就放弃 Bryce 日落。","walmart",["先装车水箱、次日早餐与摄影夜间简餐；结账后把一日饮水放前排。","可提前在该门店预约 Pickup；到店仍以实际备货和取货时段为准。","不要在车里留贵重物品或把摄影器材明放。"],{zone:"America/Los_Angeles",source:"walmart"})
];
const d2event = (id, ...args) => { const e=ev(...args); e.id="d2-"+id; e.steps=Array.isArray(e.steps)?e.steps:[]; e.zone=e.zone||"America/Denver"; e.endZone=e.endZone||e.zone; return e; };
const DAY2_OVERLOOK = [
  ...DAY2_COMMON,
  d2event("drive-overlook-vc","11:00","15:05","drive","Walmart → Zion Visitor Center","先导航免费停车场，路网纯驾驶约 3 小时 4 分，另有拉斯维加斯到犹他州的 1 小时时差。入口排队可能更久。","zionvc",["导航坐标 37.200190, -112.987139；进入后只看正式停车位。","若出发前就决定完全不进主峡谷、只争取日落，可从 Walmart 直接导航 Canyon Overlook，省去游客中心绕行。"],{zone:"America/Los_Angeles",endZone:"America/Denver",origin:"walmart",source:"zionParking"}),
  d2event("check-vc","15:05","15:15","rest","游客中心停车位满？马上改道","最多花 10 分钟判断；没有合法空位，就沿 UT-9 东行去 Canyon Overlook。别在满场入口或路边排队占道。","zionvc",["有车位则切换 A：接驳车 + Riverside Walk；这条 B 线只用于没车位或提前决定直冲 Overlook。","两处都没有合法车位，就不要勉强徒步，继续开去 Bryce。"],{source:"zionParking"}),
  d2event("drive-overlook","15:15","15:40","drive","游客中心 → Canyon Overlook","路网纯驾驶约 17 分钟；再预留入口与隧道等待。K5 可走这段铺装公路，不可自行开进主峡谷 Scenic Drive。","zion",["过隧道后才是步道入口；小型停车区就在附近。","这段绕行已算进地图；不要把从 Walmart 直奔 Overlook 的早到时间误用到这里。"],{origin:"zionvc",source:"zionStatus"}),
  d2event("park-overlook","15:40","15:50","rest","只找标示的 Canyon Overlook 车位","隧道东口的小停车区和园方标示的附近正式车位；不是沿路随意停。停满不排队占道，也不压植被。","zion",["约找 10 分钟；没有合法空位就跳过徒步，直接去 Bryce。","附近正式车位也可能可用，但须遵守现场标识，不能停路肩。"],{source:"zion"}),
  d2event("lunch-overlook","15:50","16:00","food","车边吃路餐","合法停车后吃提前买的三明治，水和垃圾随身带。","zion",[],{source:"walmart"}),
  d2event("hike-overlook","16:00","17:00","hike","Canyon Overlook 往返","1 mile / 1.6 km；按 60–75 分钟走到观景台并原路返回。这里是最省时的 Zion 大景。","zion",["步道有台阶和暴露边缘，防滑鞋、结伴，不为追赶日落跑步。","不为 Bryce 日落压缩返程；按真实导航 ETA 决定接下来去 Sunset 还是 Sunrise Point。"],{source:"zion"}),
  d2event("drive-bryce","17:00","19:10","drive","Zion → Bryce Sunset Point","OSRM 路网约 1 小时 59 分纯驾驶；还未计限速、入园和停车。19:06 MDT 日落，走完两处停车检查后通常来不及。","sunset",["若导航显示能在 18:40 前停好车，才值得冲 Sunset Point 余晖。","如已晚或疲劳，直接导航 Sunrise Point 拍星，不为了日落超速。"],{origin:"zion",source:"bryceStatus"}),
  d2event("bryce-sunset","19:10","19:25","see","Sunset Point · 有光就拍，没有就看暮色","日落约 19:06 MDT，这个经游客中心改道的方案大概率错过太阳落下；有余晖就拍石柱，别把日落当成承诺。","sunset",["正式停车区内停车，沿铺装路到观景处；今夜不下谷。"],{source:"bryceParking"}),
  d2event("sunrise-transfer","19:25","19:35","drive","转到 Sunrise Point 夜间机位","约几分钟园内车程；若 Sunset Point 西南方视野更好且停车合法，也可留原地拍。","sunrise",["先看现场西南地平线与灯光，别在黑暗中临时找无名崖边。"],{origin:"sunset"}),
  d2event("dinner-overlook","19:35","20:25","food","路餐晚饭 + 暮光构图","在正式停车区吃已买好的简餐；趁还有微光确认回车路与西南方，不押注园内餐厅营业。","sunrise",["20:10 前尽量架好机；天文暮光约 20:33 结束。","带外套和红光灯，气温比 Zion 明显低。"],{source:"bryceNight"}),
  d2event("stars-overlook","20:25","21:10","see","Bryce 低银心 · 第一轮试拍","20:30 左右银心已在西南低空；先试拍 10–15 秒，障碍或云遮就改拍高处银河星带。","sunrise",["停车区和铺装观景面内活动；不为前景夜爬陡坡。","21:00 后银心继续降低；不把 Bryce Point 当成必出银心的点。"],{source:"bryceNight"}),
  d2event("hatch-overlook","21:10","22:00","drive","Bryce → Hatch 民宿","夜间开往已订 Hatch Airbnb；以入住指引中的私密地址导航，公开地图只显示 Hatch 镇中心。","airbnb",["疲劳就提前结束拍摄；夜里注意鹿等野生动物。"],{origin:"sunrise"}),
  d2event("checkin-overlook","22:00","22:20","stay","入住，备好明晨早餐","提前告诉房东可能 22:00 后到；核对自助入住和停车说明。","airbnb")
];
const DAY2_CANYON = [
  ...DAY2_COMMON,
  d2event("drive-canyon","11:00","15:05","drive","Walmart → Zion Visitor Center","OSRM 路网约 3 小时 4 分纯驾驶，再加 1 小时时差；入口排队会使实际抵达更晚。","zionvc",["免费停车是先到先得，不是预留；导航坐标 37.200190, -112.987139。","停满就切回 Canyon Overlook 方案；不要在满场排队挡路。"],{zone:"America/Los_Angeles",endZone:"America/Denver",origin:"walmart",source:"zionParking"}),
  d2event("park-canyon","15:05","15:20","rest","确认免费车位，再上接驳车","Visitor Center 大停车场约 350 多个位置；若找到合法空位，步行去 1 号站。","zionvc",["停车、洗手间、装水与午餐合并；别为了“免费”绕找 40 分钟。","主峡谷不能自行开 K5 游览，接驳车不需额外车票。"],{source:"zionShuttle"}),
  d2event("lunch-canyon","15:20","15:35","food","车边快速吃路餐","吃买好的三明治再上车，餐盒垃圾收好。","zionvc"),
  d2event("shuttle-up","15:35","16:20","transit","接驳车 1 号站 → 9 号站","车程官方约 45 分钟；一路坐着看山壁，到 Temple of Sinawava 下。","zionvc",["坐到 9 号站，不是开车过去。","首班/末班与候车以当天公告为准；10/4 的官方计划为 7:00–18:00 发自 1 号站。"],{source:"zionShuttle"}),
  d2event("riverside","16:20","17:15","hike","Riverside Walk 精华段折返","沿 Virgin River 平缓步道走到喜欢的峡谷收窄处，再原路返回；把步行控制在约 55 分钟。","zionvc",["想走到 Narrows 起点需走 Riverside Walk 全程，往返约 2.2 miles，通常要 1–2 小时；这天不默认走满。","只在步道上拍照，不进入河道；看清回程接驳时间。"],{source:"riverside"}),
  d2event("shuttle-down","17:15","18:00","transit","9 号站 → Visitor Center","返程约 45 分钟，候车可能再加时间；不要卡 19:15 最末班。","zionvc",["如 17:15 等车已拥挤，直接上第一班回程，不加别的站。"],{source:"zionShuttle"}),
  d2event("dinner-canyon","18:00","18:15","food","停车场简餐，马上出发","先把晚餐解决，不期待 20 点之后在 Bryce 找热餐。","zionvc"),
  d2event("drive-bryce-canyon","18:15","20:30","drive","Zion → Bryce Sunrise Point","路网约 2 小时 15 分，尚未计隧道等待；19:06 的 Bryce 日落赶不上，目标是黑夜前后抵达。","sunrise",["隧道排队和 UT-9 临时封路以当天 NPS 公告为准。","20:45 还没抵达时，银心已较低：可拍银河高处，或直接回 Hatch 休息。"],{origin:"zionvc",source:"bryceStatus"}),
  d2event("stars-canyon","20:30","21:10","see","Sunrise Point · 低银心机会窗","约 20:33 天文暮光结束；到得够早且西南无遮才试低银心，不能保证；其他星带仍能拍。","sunrise",["到场先看标识、停车、地面与西南方；夜里不从这里下到峡谷步道。","21:00 以后银心更贴近地平线，若低空被挡就换高处银河。"],{source:"bryceNight"}),
  d2event("hatch-canyon","21:10","22:00","drive","Bryce → Hatch 民宿","用 Airbnb 订单里的私密地址；夜间驾驶，疲劳就缩短拍摄。","airbnb",[],{origin:"sunrise"}),
  d2event("checkin-canyon","22:00","22:20","stay","入住，准备明天早餐","提前确认深夜自助入住和停车。","airbnb")
];
DAY2_COMMON.forEach((e,i)=>{e.id=i<5?"d2-"+i:i===5?"d2-grocery-drive":"d2-grocery";e.steps=Array.isArray(e.steps)?e.steps:[];e.zone=e.zone||"America/Denver";e.endZone=e.endZone||e.zone;});
function applyDay2Variant() {
  const d=DAYS[2], canyon=day2Variant==="canyon";
  d.events=canyon?DAY2_CANYON:DAY2_OVERLOOK;
  d.intro=canyon?"有免费 Visitor Center 车位才进主峡谷：接驳车到 9 号站，Riverside Walk 走约 55 分钟折返。Bryce 日落基本赶不上；当晚去正式观景停车区尝试拍星。":"游客中心满位就改去 Canyon Overlook：只在正式车位停，徒步约 1 小时。经停车判断和绕行后，Bryce 日落大概率错过；仍可看暮色并拍星。若出发前决定完全跳过游客中心、直奔 Overlook，才有较好的日落机会。";
  d.alerts=canyon?["主峡谷 Scenic Drive 在接驳车季节不能自行驶入；游客中心停车免费但先到先得。","接驳车单程约 45 分钟，Riverside Walk 并非 55 分钟走到 Narrows 起点的承诺。","采购之后走此线，Bryce 19:06 日落基本赶不上；拍星需要按实际到达时间决定。"]:["Canyon Overlook 停车非常少；只停标示车位，不能随便停路肩。","先试游客中心再改道，会多耗约 25 分钟；按此路线 19:06 的 Bryce 日落通常赶不上。","晚上先吃采购的路餐，再从 Bryce 正式停车区拍星；不要夜间下陡坡。"];
  d.fallback="若两处 Zion 都没有合法停车、入口或隧道延误，略过徒步并继续 Bryce；云多、疲劳或抵达太晚则省掉夜拍，直接去 Hatch。";
  d.tag=canyon?"主峡谷短走 · 日落放弃":"Overlook 短走 · 暮色拍星";
  d.drive="约 6–7 小时 · 含采购与园内移动，实际看导航";
  d.walk=canyon?"Riverside Walk 约 55 分钟折返":"Canyon Overlook 约 1–1.25 小时";
  MAP_DAYS[0].subtitle=canyon?"采购 → Visitor Center → Bryce 观星 → Hatch":"采购 → Visitor Center → Overlook → Bryce → Hatch";
}
applyDay2Variant();
MEALS["d2-lunch-overlook"]={...MEALS["d2-6"],context:"取车后已采购午餐；找到合法车位后在车边快速吃，不为餐厅等位挤掉 Zion / Bryce 时间。"};
MEALS["d2-lunch-canyon"]={...MEALS["d2-lunch-overlook"]};
MEALS["d2-dinner-overlook"]={...MEALS["d2-11"],context:"今晚拍星前在正式停车区吃提前采购的路餐。原三家餐厅只是取消夜拍时的备选；别为等位错过 20:30 的低银心。"};
MEALS["d2-dinner-canyon"]={...MEALS["d2-11"],context:"主峡谷返回停车场后直接吃采购的晚餐。到 Bryce 时餐厅与银心窗口不可兼得；原三家只在放弃夜拍时考虑。"};
STARS[2]={
 title:"Bryce · 日落之后，试拍西南低银心",
 place:"Sunrise Point Parking · 正式停车区",
 address:"Sunrise Point Parking, Bryce Canyon National Park, UT",
 distance:"Sunset Point 约数分钟车程；从 Zion 直接来则不需先绕 Bryce Point",
 window:"10/4 约 20:15–21:10 MDT；20:33 前后进入天文黑夜",
 moon:"月亮下午已落下，10/5 凌晨才再升起；仍以现场云和能见度为准。",
 reality:"Bryce Point 朝北看石柱极美，但 10 月初银心在西南低空，不能据此保证“银心+石柱”同框。NPS 明确把 Sunrise、Sunset、Inspiration、Paria View 列为观星点；今晚以 Sunrise Point 正式停车区为默认，天亮前/黄昏时确认西南视线。银心约 20:30 低悬，21:00 后更低，天气或地形遮挡就拍高处银河星带。",
 subjects:[["A · 低银心","朝西南用星图找最亮的银河中心；先拍天空，不为特殊前景靠近崖边。"],["B · 石柱和星野","用正式栏杆内/铺装区域的红岩剪影做前景；银心不在同一画面也可分开拍。"],["C · Bryce Point 备选","若日落前有余量可白天踏勘；其代表性石柱视线向北，不作为今晚默认银心机位。"]],
 plan:["日落约 19:06 MDT、天文暮光约 20:33 结束。争取 19:40–20:10 到正式停车区，先找回车路线和安全拍摄位置。","先拍一张 10–15 秒 RAW 检查对焦；20:25–21:00 集中拍低空，挡住则立刻转拍高处天鹅座银河。","夜间只留在正式停车区和铺装观景面；不下 Queen’s Garden/Navajo。拍到 21:10 左右就回 Hatch，提前确认民宿晚到入住。"],
 camera:STARS[3].camera,workflow:STARS[3].workflow,
 safety:"Bryce Point、Sunrise Point 等正式停车区按 NPS 2026 秋季公布为 24 小时开放，但雪、施工或临时管制可能改变。高海拔低温大风，结伴、红光灯、防寒；鹿等野生动物不能保证完全没有。只停合法车位，不在公路路肩或无护栏崖边取景。",
 sources:["https://www.nps.gov/thingstodo/stargazing-at-bryce-canyon.htm","https://www.nps.gov/places/000/bryce-point.htm","https://www.nps.gov/brca/planyourvisit/parking-information.htm","https://www.timeanddate.com/sun/@5535938?month=10&year=2026","https://www.timeanddate.com/moon/@5535938?month=10&year=2026"]
};
function day2RouteChoice() {
  return `<div class="day6-route-picker"><div><strong>10/4 · 先看游客中心停车</strong><p>${day2Variant==="canyon"?"有免费车位：坐接驳车走主峡谷，晚间在 Bryce 拍星。":"没车位：继续开往 Canyon Overlook，那里也只能停正式车位；经过两次停车判断，Bryce 日落大概率赶不上。"} 两条都先去 Walmart 买补给。</p><p class="day2-route-note"><a href="${esc(mapsAddress(P.zionvc))}" target="_blank" rel="noopener noreferrer">导航免费停车 ↗</a> · <a href="${esc(mapsAddress(P.zion))}" target="_blank" rel="noopener noreferrer">导航 Overlook ↗</a><br>若从一开始就以日落为先，可跳过游客中心直达 Overlook；两处都满就继续 Bryce。不能随意停路肩。</p></div><div role="group" aria-label="10月4日锡安路线"><button type="button" data-day2-variant="canyon" aria-pressed="${day2Variant==="canyon"}" class="${day2Variant==="canyon"?"active":""}">A · 主峡谷短走</button><button type="button" data-day2-variant="overlook" aria-pressed="${day2Variant==="overlook"}" class="${day2Variant==="overlook"?"active":""}">B · Overlook / 暮色拍星</button></div></div>`;
}
const day2OriginalDaily=daily;
daily=function(){const html=day2OriginalDaily();return day===2?html.replace('<div class="day-briefs">',day2RouteChoice()+'<div class="day-briefs">'):html;};
const day2OriginalRouteMap=routeMap;
routeMap=function(){const html=day2OriginalRouteMap();return mapDay===2?html.replace('<section class="road-atlas">',day2RouteChoice()+'<section class="road-atlas">'):html;};
const day2OriginalHomeAtlas=homeAtlas;
homeAtlas=function(){const html=day2OriginalHomeAtlas();return mapDay===2?html.replace('<div class="map-bottom">',day2RouteChoice()+'<div class="map-bottom">'):html;};
document.addEventListener("click",e=>{const b=e.target.closest("[data-day2-variant]");if(!b)return;const v=b.dataset.day2Variant;if(!["canyon","overlook"].includes(v))return;day2Variant=v;try{localStorage.setItem("canyon-day2-route",v);}catch{}applyDay2Variant();mapLeg=0;mapView=null;const y=scrollY;render();scrollTo(0,y);});
