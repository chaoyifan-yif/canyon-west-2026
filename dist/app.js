const gm = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const gd = (origin, destination) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;

const places = [
  {
    id: "vegas", n: 1, x: 180, y: 455, day: "D0—D1", name: "Las Vegas", zh: "拉斯维加斯", symbol: "✦",
    kicker: "霓虹起点", duration: "1.5 天", effort: "步行为主", park: "不取车",
    why: "把城市体验集中在第一晚和周六：Strip City Walk、Bellagio 与 21:00 的 O 秀。",
    steps: ["周五抵达后跟随 Ride App Pickup 标识叫车，先去 Horseshoe 放行李。", "周六从 Paris / Bellagio 一带开始，白天步行串联中段 Strip。", "20:15 前抵达 Bellagio 的 O Theatre；演出后步行或叫车回酒店。"],
    alert: "周五、周六都不租车。Strip 酒店停车和堵车会增加成本，周日早上再去机场租车中心取车。",
    map: gm("Horseshoe Las Vegas"), official: "https://bellagio.mgmresorts.com/en/entertainment/o-by-cirque-du-soleil.html"
  },
  {
    id: "zion", n: 2, x: 355, y: 270, day: "D2", name: "Zion", zh: "锡安 · Canyon Overlook", symbol: "◒",
    kicker: "砂岩巨壁", duration: "1.5–2 小时", effort: "1 mi 往返", park: "隧道东口路肩",
    why: "不进主峡谷排摆渡车，用短而精华的 Canyon Overlook Trail 看 Zion 的立体峡谷。",
    steps: ["从 Springdale 方向沿 UT-9 上山，穿过 Zion–Mt. Carmel Tunnel。", "出隧道后立即寻找道路两侧合法小停车位；满位就继续前行掉头再找，绝不占道。", "步道入口就在隧道东口北侧护栏旁；原路往返，观景台停留 15–20 分钟。"],
    alert: "Zion 与 Bryce 使用山地时间，比 Las Vegas 快 1 小时。不要把车停在隧道口或压实线临停。",
    map: gm("Canyon Overlook Trailhead Zion"), official: "https://www.nps.gov/zion/planyourvisit/zion-canyon-overlook-trail.htm"
  },
  {
    id: "bryce", n: 3, x: 505, y: 205, day: "D2—D3", name: "Bryce Canyon", zh: "布莱斯峡谷", symbol: "♜",
    kicker: "石柱剧场", duration: "日落 + 半日徒步", effort: "2.9 mi 环线", park: "Sunset / Sunrise Point",
    why: "周日先看夕阳把石柱群染红，周一再走进 hoodoos 之间，两次视角完全不同。",
    image: "https://www.nps.gov/common/uploads/cropped_image/secondary/FE35EFCF-D514-DD31-AD8FC8948876FDDD.jpeg",
    steps: ["周日把车停 Sunset Point；先沿 Rim Trail 向 Inspiration Point 走，再返回等日落。", "周一停 Sunrise Point，从 Queen’s Garden 下切进入石柱群。", "接 Navajo Loop，经 Two Bridges 爬回 Sunset Point；若 Wall Street 开放，也只二选一，不重复绕行。"],
    alert: "海拔约 8,000 英尺，十月早晚可能接近冰点。日落后道路很暗，头灯和保暖层必须随身。",
    map: gm("Sunset Point Bryce Canyon National Park"), official: "https://www.nps.gov/brca/planyourvisit/day-hikes.htm"
  },
  {
    id: "antelope", n: 4, x: 710, y: 335, day: "D3", name: "Lower Antelope", zh: "下羚羊谷", symbol: "≈",
    kicker: "光与岩壁", duration: "约 1–1.5 小时", effort: "导览步行", park: "Ken’s Tours 专用停车场",
    why: "在狭窄砂岩缝隙里看波浪纹理与橙红光线；必须跟纳瓦霍向导进入。",
    steps: ["导航到 Ken’s Tours Lower Antelope Canyon，免费停在访客停车区。", "15:15 前到柜台签到，带订单和带照片证件；16:00 团绝不能迟到。", "跟团下金属楼梯并单向穿越峡谷；听从向导安排拍照，出口后步行回接待区。"],
    alert: "Page 与大峡谷全年采用 Arizona 时间；十月比 Bryce / Zion 慢 1 小时。峡谷内没有自由脱团活动。",
    map: gm("Ken's Tours Lower Antelope Canyon"), official: "https://lowerantelope.com/tours/"
  },
  {
    id: "horseshoe", n: 5, x: 690, y: 385, day: "D4", name: "Horseshoe Bend", zh: "马蹄湾", symbol: "∩",
    kicker: "科罗拉多弯道", duration: "1.5 小时", effort: "1.5 mi 往返", park: "City of Page 收费停车场",
    why: "站在千尺悬崖边，看科罗拉多河完成接近 270° 的巨大转弯。",
    steps: ["从 US-89 转入 Horseshoe Bend Parking Lot，现场按车型付停车费。", "沿铺装与硬土混合步道下坡约 0.75 英里；全程无遮阴。", "先到有护栏的主观景台，再在安全范围内向两侧移动找角度，原路返回。"],
    alert: "停车费不含在国家公园年卡内。多数悬崖边没有护栏；风大时不要靠边坐或为拍照倒退。",
    map: gm("Horseshoe Bend Parking Lot"), official: "https://www.cityofpage.org/hsb"
  },
  {
    id: "grand", n: 6, x: 590, y: 470, day: "D4", name: "Grand Canyon", zh: "大峡谷南缘", symbol: "⌄",
    kicker: "地球剖面", duration: "半日 + 日落", effort: "1.8 mi 往返", park: "Visitor Center Lots 1–4",
    why: "先沿东入口看横向层次，再从 South Kaibab 走到 Ooh Aah Point，真正下到峡谷壁内。",
    steps: ["从 Page 经 East Entrance 入园，先停 Desert View Watchtower，再短停 Navajo Point。", "开到 Grand Canyon Visitor Center 的 Lots 1–4，车留在这里。", "乘橙线 Kaibab Rim Route 到 South Kaibab Trailhead，徒步至 Ooh Aah Point 原路返回，再去 Mather Point 等日落。"],
    alert: "下坡很快、回程全上坡。最迟 16:30 从 Ooh Aah Point 折返；带足水，日落后不要继续在无灯步道内行走。",
    map: gm("Grand Canyon Visitor Center Parking Lot 1"), official: "https://www.nps.gov/grca/planyourvisit/kaibab-orange-route.htm"
  },
  {
    id: "route66", n: 7, x: 365, y: 530, day: "D5", name: "Route 66", zh: "Williams + Seligman", symbol: "66",
    kicker: "返程彩蛋", duration: "3–3.5 小时含午餐", effort: "轻松散步", park: "主街路边车位",
    why: "把返程拆成两个有性格的小镇停靠：铁路小镇 Williams 与保留老公路气质的 Seligman。",
    steps: ["Williams 停 Historic Downtown / Route 66 主街附近，咖啡加短走。", "继续到 Seligman，拍老车、招牌和 Roadkill Café 一带街景。", "在 Westside Lilo’s 吃早午餐，12:00 前出发；晚了就取消 Hoover Dam。"],
    alert: "这一天的硬截止是 16:30 还车。任何前段延误都优先砍掉 Hoover Dam 外观停靠。",
    map: gm("Historic Seligman Sundries"), official: "https://www.visitarizona.com/places/cities/seligman/"
  },
  {
    id: "hoover", n: 8, x: 205, y: 500, day: "D5 · 可选", name: "Hoover Dam", zh: "胡佛大坝外观", symbol: "≋",
    kicker: "最后一站", duration: "30–40 分钟", effort: "短步行", park: "Bridge Trail Parking",
    why: "从 Mike O’Callaghan–Pat Tillman Memorial Bridge 步道俯瞰大坝；只做外观，不参加内部 tour。",
    steps: ["只有导航预计 15:00 前抵达时才执行。", "停 Bridge Trail Parking，沿带楼梯的步道走上纪念桥人行道。", "在中部看大坝后原路返回，15:30 必须离开去租车中心。"],
    alert: "如果气温高、停车位满或 Seligman 出发晚，直接跳过。机场与还车时间优先。",
    map: gm("Mike O'Callaghan-Pat Tillman Memorial Bridge Parking"), official: "https://www.usbr.gov/lc/hooverdam/service/"
  }
];

const days = [
  {
    index: 0, date: "10/02", weekday: "周五", label: "抵达 Vegas", title: "落地，先把节奏放慢", subtitle: "不取车 · 机场叫车 · 入住后吃饭", zone: "太平洋时间 PDT", overnight: "Horseshoe Las Vegas · 第 1 晚", stayNote: "位置便于步行串联中段 Strip；叫车在酒店指定 Ride Share 区上下。",
    stayMap: gm("Horseshoe Las Vegas"), stayOfficial: "https://www.caesars.com/horseshoe-las-vegas",
    meals: [["🍜","晚餐","Grand Lux Café（Venetian）；太晚则在 LINQ Promenade 就近解决"]],
    drives: [["LAS → Horseshoe","约 15–25 分钟","Ride App；晚高峰预留余量"]],
    events: [
      ["18:50","抵达 LAS","下机、取行李；不要去租车中心。", gm("Harry Reid International Airport Ride App Pickup"), "机场叫车点"],
      ["19:35","Ride App Pickup","跟随航站楼 Ride App 标志到指定楼层后再叫车。", "https://www.harryreidairport.com/Transportation/RideShare", "官方说明"],
      ["20:15","Horseshoe 入住","放行李、补水；确认周六 O 秀电子票。", gm("Horseshoe Las Vegas"), "导航"],
      ["20:45","晚餐 + 轻量夜景","体力好去 Venetian；疲惫就酒店附近吃完休息。", gm("Grand Lux Cafe Venetian"), "餐厅地图"]
    ]
  },
  {
    index: 1, date: "10/03", weekday: "周六", label: "Vegas + O 秀", title: "从白天的 Strip 走到水上舞台", subtitle: "城市漫步 · 每段可休息 · 21:00 O 秀", zone: "太平洋时间 PDT", overnight: "Horseshoe Las Vegas · 第 2 晚", stayNote: "继续住同一家，不搬酒店；下午可回房休息 60–90 分钟。",
    stayMap: gm("Horseshoe Las Vegas"), stayOfficial: "https://www.caesars.com/horseshoe-las-vegas",
    meals: [["🥐","早餐","Mon Ami Gabi：露台看 Bellagio 街景，建议预约"],["🍕","午餐","Eataly at Park MGM：选择多、无需正式套餐"],["🍜","晚餐","Noodles at Bellagio；目标 19:30 前吃完"]],
    drives: [["全天","步行 + 2 段叫车","欢迎牌往返用车，其余沿 Strip 步行"]],
    events: [
      ["09:00","Mon Ami Gabi 早餐","从 Horseshoe 步行到 Paris；吃完直接开始中段 Strip。", gm("Mon Ami Gabi Las Vegas"), "导航"],
      ["10:30","Welcome to Las Vegas Sign","叫车往返；拍照后不要在南段继续暴走。", gm("Welcome to Fabulous Las Vegas Sign"), "导航"],
      ["12:00","Park MGM + Eataly","室内休息、午餐；顺路看 New York-New York 外观。", gm("Eataly Las Vegas"), "导航"],
      ["14:00","Bellagio + Caesars","温室花园、喷泉、Forum Shops；15:30 左右回酒店歇脚。", gm("Bellagio Conservatory & Botanical Gardens"), "导航"],
      ["17:20","Venetian 运河","恢复体力后再出门；室内外运河选一段即可。", gm("Grand Canal Shoppes at The Venetian"), "导航"],
      ["18:40","Bellagio 晚餐","用餐后不要再跨酒店；20:15 开始入场。", gm("Noodles Bellagio"), "导航"],
      ["21:00","O by Cirque du Soleil","电子票提前存手机；演出约 90 分钟。", "https://bellagio.mgmresorts.com/en/entertainment/o-by-cirque-du-soleil.html", "官方门票"]
    ]
  },
  {
    index: 2, date: "10/04", weekday: "周日", label: "Zion → Bryce", title: "离开霓虹，进入巨壁与石柱", subtitle: "取车 · Canyon Overlook · Bryce 日落", zone: "Zion / Bryce 为 MDT，比 Vegas 快 1 小时", overnight: "Best Western Plus Ruby’s Inn · 第 3 晚", stayNote: "Bryce 入口外约 1 英里，免费停车；入住后在园区内吃晚餐。",
    stayMap: gm("Best Western Plus Ruby's Inn"), stayOfficial: "https://www.bestwestern.com/en_US/book/hotel-details.45040.html",
    meals: [["☕","早餐","酒店附近快速解决；不要安排长早午餐"],["🥪","午餐","提前买好三明治，在 Hurricane / Springdale 路上吃"],["🥩","晚餐","Cowboy’s Buffet & Steak Room at Ruby’s Inn"]],
    drives: [["Horseshoe → 租车中心","约 15 分钟","Ride App"],["LAS → Zion","约 2 小时 45 分","另加 1 小时时差"],["Zion → Bryce","约 1 小时 50 分","UT-9 / US-89 / UT-12"]],
    warning: "若 13:45 MDT 仍未到 Zion 隧道东口，Canyon Overlook 只走到观景点即返；若晚于 15:30 离开 Zion，直接去 Bryce 的 Sunset Point。",
    events: [
      ["08:30","LAS Rent-A-Car Center 取车","从 Horseshoe 叫车过去；拍四角视频，确认备胎与油量。", gm("Harry Reid Rent A Car Center"), "导航"],
      ["09:20 PDT","离开 Las Vegas","加油、买水和第二天徒步午餐；之后直奔 Zion。", gd("Harry Reid Rent A Car Center","Canyon Overlook Trailhead Zion"), "驾车路线"],
      ["13:05 MDT","Canyon Overlook Trail","隧道东口找合法车位；1 英里原路往返，游玩 1.5–2 小时。", gm("Canyon Overlook Trailhead Zion"), "停车 / 入口"],
      ["15:15 MDT","前往 Bryce","沿 UT-9 东行，不回 Springdale；途中只安排一次短休。", gd("Canyon Overlook Trailhead Zion","Sunset Point Bryce Canyon"), "驾车路线"],
      ["17:25 MDT","Bryce 日落","停 Sunset Point；沿 Rim Trail 走到 Inspiration Point 再返回。", gm("Sunset Point Bryce Canyon"), "停车"],
      ["日落后","Ruby’s Inn 入住 + 晚餐","天黑后路面可能结霜，慢开；前台确认早餐时间。", gm("Cowboy's Buffet & Steak Room"), "餐厅"]
    ]
  },
  {
    index: 3, date: "10/05", weekday: "周一", label: "Bryce → Page", title: "走进 hoodoos，下午穿越羚羊谷", subtitle: "Queen’s / Navajo Loop · 时区奖励 1 小时 · 16:00 团", zone: "到 Page 后切回 MST，钟表慢 1 小时", overnight: "Hampton Inn & Suites Page · 第 4 晚", stayNote: "靠近 US-89、马蹄湾与羚羊谷；免费停车和早餐。贵重物品交前台或随身带。",
    stayMap: gm("Hampton Inn & Suites Page Lake Powell"), stayOfficial: "https://www.hilton.com/en/hotels/pgalphx-hampton-suites-page-lake-powell/",
    meals: [["🥞","早餐","Ruby’s Inn 自助早餐；08:30 前结束"],["🥪","午餐","前一天备好的简餐，徒步后在车内或野餐区吃"],["🍖","晚餐","Big John’s Texas BBQ；忙时可外带"]],
    drives: [["Ruby’s → Bryce","约 10 分钟","UT-63"],["Bryce → Page","约 2 小时 40 分","跨时区，抵达钟表慢 1 小时"]],
    warning: "12:30 MDT 必须驶离 Bryce。导航会自动改成 Arizona 时间，但请手动确认；Ken’s Tours 按 Page 当地时间签到。",
    events: [
      ["09:00 MDT","Queen’s Garden 下切","停 Sunrise Point；沿标识下行，看 Queen Victoria 岩柱。", gm("Sunrise Point Bryce Canyon"), "停车 / 入口"],
      ["10:05 MDT","接 Navajo Loop","往 Sunset Point 方向，经 Two Bridges 爬升；全程约 2.9 英里。", "https://www.nps.gov/brca/planyourvisit/day-hikes.htm", "官方步道"],
      ["12:00 MDT","回到 Rim + 午餐","补水、换干衣、上厕所；12:30 准时发车。", gd("Sunset Point Bryce Canyon","Ken's Tours Lower Antelope Canyon"), "去 Page"],
      ["14:15 MST","Page 入住 / 寄存行李","先把贵重物品和行李处理好，再去羚羊谷。", gm("Hampton Inn & Suites Page Lake Powell"), "酒店"],
      ["15:15 MST","Ken’s Tours 签到","订单、证件、水准备好；背包与三脚架按现场规定处理。", gm("Ken's Tours Lower Antelope Canyon"), "停车"],
      ["16:00 MST","Lower Antelope General Tour","跟团下楼梯、单向穿越；约 1–1.5 小时。", "https://lowerantelope.com/tours/", "官方门票"],
      ["18:15 MST","Big John’s 晚餐","这晚不加景点；吃完补给，早点休息。", gm("Big John's Texas BBQ Page"), "导航"]
    ]
  },
  {
    index: 4, date: "10/06", weekday: "周二", label: "Page → 大峡谷", title: "从河湾，走进真正的大峡谷", subtitle: "马蹄湾 · Desert View · Ooh Aah Point · Mather 日落", zone: "全天 Arizona MST，无时差", overnight: "The Squire at Grand Canyon · 第 5 晚", stayNote: "Tusayan 位于南门外，省去夜车回 Vegas；晚餐和休息都在酒店内完成。",
    stayMap: gm("The Squire at Grand Canyon"), stayOfficial: "https://www.visitgrandcanyon.com/stay/squire/",
    meals: [["🥣","早餐","Hampton 免费早餐；08:30 前退房"],["🥗","午餐","Desert View Market / 车上简餐，控制在 35 分钟"],["🍔","晚餐","Squire Pub + Social；徒步后不用再开车找饭"]],
    drives: [["Page → Horseshoe Bend","约 10 分钟","US-89"],["马蹄湾 → Desert View","约 2 小时","US-89 / AZ-64"],["Desert View → Visitor Center","约 35–45 分钟","Desert View Drive"]],
    warning: "Ooh Aah Point 回程全上坡。15:45 仍未坐上橙线就取消下峡谷徒步，改为 Mather Point 与 Rim Trail；日落后直接去 Tusayan。",
    events: [
      ["09:00 MST","Horseshoe Bend","停 City of Page 收费停车场；1.5 英里往返，无树荫。", gm("Horseshoe Bend Parking Lot"), "停车"],
      ["10:40 MST","出发去大峡谷","加满油、下载离线地图；走东入口避免折返。", gd("Horseshoe Bend Parking Lot","Desert View Watchtower"), "驾车路线"],
      ["12:40 MST","Desert View Watchtower","年卡 + 证件备查；看第一眼大峡谷并简单午餐。", gm("Desert View Watchtower"), "停车"],
      ["13:45 MST","Navajo Point → Visitor Center","Navajo Point 快停 10–15 分钟，之后不停站直达 Lots 1–4。", gd("Navajo Point Grand Canyon","Grand Canyon Visitor Center Parking Lot 1"), "驾车路线"],
      ["15:00 MST","橙线到 South Kaibab","车留 Visitor Center；搭 Kaibab Rim Route 橙线。", "https://www.nps.gov/grca/planyourvisit/kaibab-orange-route.htm", "摆渡车"],
      ["15:30 MST","徒步 Ooh Aah Point","1.8 英里往返；观景后原路爬回，预留 2 小时。", gm("South Kaibab Trailhead"), "步道口"],
      ["17:45 MST","Mather Point 日落","回 Visitor Center 后步行到观景台；天黑后取车去 Tusayan。", gm("Mather Point"), "观景台"]
    ]
  },
  {
    index: 5, date: "10/07", weekday: "周三", label: "Route 66 → LAS", title: "用老公路收尾，晚上飞回湾区", subtitle: "Williams · Seligman · 可选 Hoover · 19:55 起飞", zone: "Arizona 与 Las Vegas 当天同为 UTC−7", overnight: "当晚回到湾区", stayNote: "航班 19:55 LAS → 21:30 SJC；目标 16:30 完成还车，最晚 17:15 进入航站楼。",
    stayMap: gm("Harry Reid International Airport"), stayOfficial: "https://www.harryreidairport.com/",
    meals: [["🍳","早餐","Squire 酒店早餐；08:00 准时发车"],["🍔","午餐","Westside Lilo’s Café, Seligman；若排队就外带"]],
    drives: [["Tusayan → Williams","约 1 小时","AZ-64 / I-40"],["Williams → Seligman","约 45 分钟","I-40"],["Seligman → LAS 租车中心","约 3 小时","含可选 Hoover 需再加 30–45 分钟"]],
    warning: "12:00 未离开 Seligman，或导航显示 15:00 后才到 Hoover Bridge Parking，立即取消 Hoover，直接还车。",
    events: [
      ["08:00 MST","离开 Tusayan","油量至少半箱；先导航 Williams Historic Downtown。", gd("The Squire at Grand Canyon","Williams Historic Downtown"), "驾车路线"],
      ["09:05 MST","Williams 短走","主街路边合法车位；咖啡、铁路站和 Route 66 招牌。", gm("Williams Historic Downtown"), "停车"],
      ["10:30 MST","Seligman + 早午餐","主街拍照，Westside Lilo’s 吃饭；12:00 硬离开。", gm("Westside Lilo's Cafe Seligman"), "导航"],
      ["14:40 PDT","可选 Hoover Bridge","只从纪念桥看大坝；30–40 分钟封顶。", gm("Mike O'Callaghan-Pat Tillman Memorial Bridge Parking"), "停车"],
      ["16:00 PDT","租车中心还车","加满油、拍里程与车况；搭机场接驳。", gm("Harry Reid Rent A Car Center"), "导航"],
      ["17:15 PDT","抵达航站楼","安检、吃简餐；19:55 起飞，21:30 抵达 SJC。", gm("Harry Reid International Airport"), "机场"]
    ]
  }
];

const bookings = [
  ["flight","往返机票","SJC ⇄ LAS","锁定 10/02 18:50 抵达、10/07 19:55 起飞；座位与行李规则一起确认。","现在","https://www.google.com/travel/flights"],
  ["show","O 秀 · Bellagio","10/03 · 21:00","只在 MGM / Bellagio 官方页选票；目标提前 45 分钟到剧场。","现在","https://bellagio.mgmresorts.com/en/entertainment/o-by-cirque-du-soleil.html"],
  ["tour","Lower Antelope General Tour","10/05 · 16:00 · 2 人","Ken’s Tours；截图价格两人 $161。到场签到时间以订单为准。","现在","https://lowerantelope.com/tours/"],
  ["hotel","Horseshoe Las Vegas","10/02–10/04 · 2 晚","比较含 resort fee、税与取消政策后的全包价。","本周","https://www.caesars.com/horseshoe-las-vegas"],
  ["hotel","Best Western Plus Ruby’s Inn","10/04 · 1 晚","位置优先，避免日落后长距离夜车；确认早餐和停车。","本周","https://www.bestwestern.com/en_US/book/hotel-details.45040.html"],
  ["hotel","Hampton Inn & Suites Page","10/05 · 1 晚","免费早餐、停车；预订可取消房型。","本周","https://www.hilton.com/en/hotels/pgalphx-hampton-suites-page-lake-powell/"],
  ["hotel","The Squire at Grand Canyon","10/06 · 1 晚","Tusayan 南门外；确认 amenity fee 与停车全包价。","本周","https://www.visitgrandcanyon.com/stay/squire/"],
  ["car","租车 · LAS Airport","10/04 08:30 → 10/07 16:30","选择无限里程；把异地费、税、保险口径和额外驾驶人算进总价。","本周","https://www.harryreidairport.com/Transportation/RentalCars"],
  ["meal","Mon Ami Gabi","10/03 · 09:00","露台优先；没有合适时间就现场候位，不影响主行程。","可选","https://www.monamigabi.com/las-vegas/"],
];

const costs = [
  ["往返机票（2 人）",450,700], ["租车 + 税费",320,480], ["汽油",150,190],
  ["住宿 5 晚全包",890,1340], ["O 秀（2 人）",300,500], ["羚羊谷（2 人）",161,200],
  ["餐饮",420,600], ["停车 / resort fee / 叫车",180,280], ["机动与小额门票",80,120]
];

let activeView = "route";
let activePlace = places[0].id;
let activeDay = 0;
let toastTimer;

const bookingState = JSON.parse(localStorage.getItem("canyon-west-bookings") || "{}");
const budgetState = JSON.parse(localStorage.getItem("canyon-west-budget") || "{}");

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
}

function switchView(view) {
  activeView = view;
  document.querySelectorAll(".view").forEach(el => el.classList.toggle("is-active", el.id === `${view}View`));
  document.querySelectorAll("[data-view]").forEach(el => el.classList.toggle("is-active", el.dataset.view === view));
  window.scrollTo({top: 0, behavior: "auto"});
}

function renderMap() {
  const path = places.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ") + " L 180 455";
  const stops = places.map(p => {
    const labelWidth = Math.max(82, p.name.length * 7.3 + 20);
    const lx = Math.min(930 - labelWidth / 2, Math.max(70 + labelWidth / 2, p.x));
    const ly = p.y < 260 ? p.y + 53 : p.y - 49;
    return `<g class="route-stop ${p.id === activePlace ? "is-active" : ""}" data-place="${p.id}" tabindex="0" role="button" aria-label="查看 ${p.zh}">
      <circle class="halo" cx="${p.x}" cy="${p.y}" r="29"/><circle class="dot" cx="${p.x}" cy="${p.y}" r="14"/><text class="num" x="${p.x}" y="${p.y + .5}">${p.n}</text>
      <rect class="label-bg" x="${lx-labelWidth/2}" y="${ly-14}" width="${labelWidth}" height="28" rx="14"/><text class="label" x="${lx}" y="${ly+1}">${p.name}</text>
      <text class="map-day" x="${p.x + 20}" y="${p.y + 5}">${p.day}</text></g>`;
  }).join("");
  document.getElementById("routeMap").innerHTML = `<svg class="route-svg" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet"><title>拉斯维加斯、锡安、布莱斯、Page、大峡谷与 Route 66 环线路线图</title>
    <defs><linearGradient id="routeGradient" x1="0" x2="1"><stop stop-color="#82d4ee"/><stop offset=".4" stop-color="#ffc56e"/><stop offset="1" stop-color="#ef6a43"/></linearGradient></defs>
    <path class="map-state" d="M78 96L290 72 410 132 535 82 700 100 924 185M92 390L928 390M298 68L312 568M690 102L674 574"/>
    <text x="135" y="120" fill="#536879" font-size="19" font-weight="800">NEVADA</text><text x="386" y="116" fill="#536879" font-size="19" font-weight="800">UTAH</text><text x="702" y="124" fill="#536879" font-size="19" font-weight="800">ARIZONA</text>
    <path class="map-route-shadow" d="${path}"/><path class="map-route" d="${path}"/>${stops}
  </svg>`;
  document.querySelectorAll(".route-stop").forEach(stop => {
    const select = () => { activePlace = stop.dataset.place; renderMap(); renderPlace(); };
    stop.addEventListener("click", select);
    stop.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); } });
  });
  document.getElementById("mobilePlaceStrip").innerHTML = places.map(p => `<button class="mobile-place-btn ${p.id === activePlace ? "is-active" : ""}" type="button" data-mobile-place="${p.id}">${p.zh.replace(" · Canyon Overlook", "")}</button>`).join("");
  document.querySelectorAll("[data-mobile-place]").forEach(button => button.addEventListener("click", () => {
    activePlace = button.dataset.mobilePlace;
    renderMap();
    renderPlace();
    document.getElementById("routePanel").scrollIntoView({behavior:"smooth", block:"start"});
  }));
}

function renderPlace() {
  const p = places.find(item => item.id === activePlace);
  const visual = p.image ? `<img src="${p.image}" alt="${p.zh}景观" loading="eager" referrerpolicy="no-referrer"/>` : "";
  document.getElementById("routePanel").innerHTML = `<div class="place-visual">${visual}<span class="place-symbol">${p.symbol}</span></div>
    <div class="panel-body">
      <div class="place-kicker"><span>${p.kicker}</span><span>${p.day}</span></div><h2 class="place-title">${p.zh}</h2><p class="place-why">${p.why}</p>
      <div class="fact-row"><div class="fact"><b>${p.duration}</b><span>建议游玩</span></div><div class="fact"><b>${p.effort}</b><span>活动强度</span></div><div class="fact"><b>${p.park}</b><span>停车方式</span></div></div>
      <ol class="plan-list">${p.steps.map(step => `<li>${step}</li>`).join("")}</ol><p class="panel-alert">${p.alert}</p>
      <div class="panel-actions"><a class="link-button" href="${p.map}" target="_blank" rel="noopener">打开地图 ↗</a><a class="link-button secondary" href="${p.official}" target="_blank" rel="noopener">官方信息</a></div>
    </div>`;
}

function renderDaySwitcher() {
  document.getElementById("daySwitcher").innerHTML = days.map(d => `<button class="day-tab ${d.index === activeDay ? "is-active" : ""}" role="tab" aria-selected="${d.index === activeDay}" data-day="${d.index}"><b>${String(d.index).padStart(2,"0")}</b><strong>${d.date} ${d.weekday}</strong><small>${d.label}</small></button>`).join("");
  document.querySelectorAll(".day-tab").forEach(tab => tab.addEventListener("click", () => { activeDay = Number(tab.dataset.day); renderDaySwitcher(); renderDay(); }));
}

function renderDay() {
  const d = days[activeDay];
  const firstPlace = places.find(p => p.day.includes(`D${activeDay}`));
  const bg = firstPlace?.image ? `url('${firstPlace.image}')` : "linear-gradient(135deg, rgba(15,48,70,.65), rgba(239,106,67,.12))";
  document.getElementById("dayTimeline").innerHTML = `<div class="day-banner" style="--day-image:${bg}"><div><p class="eyebrow">DAY ${d.index} · ${d.date} ${d.weekday}</p><h3>${d.title}</h3><p>${d.subtitle}</p></div><span class="clock-chip">${d.zone}</span></div>
    <div class="timeline">${d.events.map(e => `<article class="timeline-item"><time class="timeline-time">${e[0]}</time><i class="timeline-dot"></i><div class="timeline-copy"><h4>${e[1]}</h4><p>${e[2]}</p><div class="timeline-actions"><a href="${e[3]}" target="_blank" rel="noopener">${e[4]} ↗</a></div></div></article>`).join("")}</div>`;

  document.getElementById("dayAside").innerHTML = `<section><div class="side-title"><h3>🚗 驾驶节奏</h3><span>不含排队</span></div>${d.drives.map(x => `<div class="road-segment"><b>${x[0]}</b><span>${x[1]}</span><small>${x[2]}</small></div>`).join("")}</section>
    <section><div class="side-title"><h3>🍴 今天吃什么</h3><span>按路线安排</span></div>${d.meals.map(m => `<div class="meal"><i>${m[0]}</i><div><b>${m[1]}</b><span>${m[2]}</span></div></div>`).join("")}</section>
    <section><div class="side-title"><h3>⌂ 今晚住哪里</h3><span>${d.index < 5 ? "已选区域" : "返程"}</span></div><div class="stay-card"><b>${d.overnight}</b><p>${d.stayNote}</p><div><a href="${d.stayMap}" target="_blank" rel="noopener">地图 ↗</a> · <a href="${d.stayOfficial}" target="_blank" rel="noopener">官网 ↗</a></div></div></section>
    ${d.warning ? `<section class="time-warning"><strong>硬截止：</strong>${d.warning}</section>` : ""}`;
}

function renderBookings() {
  const done = bookings.filter((_, i) => bookingState[i]).length;
  document.getElementById("bookingCount").textContent = done;
  const pct = Math.round(done / bookings.length * 100);
  const ring = document.getElementById("bookingRing");
  ring.style.setProperty("--progress", `${pct * 3.6}deg`);
  ring.dataset.label = `${done}/${bookings.length}`;
  document.getElementById("bookingGrid").innerHTML = bookings.map((b, i) => `<article class="booking-card" data-order="${String(i+1).padStart(2,"0")}"><div class="booking-top"><span class="booking-type">${b[0].toUpperCase()}</span><button class="check-button ${bookingState[i] ? "is-done" : ""}" type="button" data-booking="${i}" aria-label="${bookingState[i] ? "标记为未完成" : "标记为已预订"}">${bookingState[i] ? "✓" : ""}</button></div><h3>${b[1]}</h3><p><strong>${b[2]}</strong><br>${b[3]}</p><div class="booking-meta"><span>${b[4]}</span><a href="${b[5]}" target="_blank" rel="noopener">去官网 ↗</a></div></article>`).join("");
  document.querySelectorAll(".check-button").forEach(btn => btn.addEventListener("click", () => {
    const i = btn.dataset.booking;
    bookingState[i] = !bookingState[i];
    localStorage.setItem("canyon-west-bookings", JSON.stringify(bookingState));
    renderBookings();
    showToast(bookingState[i] ? "已标记为完成" : "已取消完成标记");
  }));
}

function renderBudget() {
  document.getElementById("costTable").innerHTML = `<div class="cost-row header"><span>项目</span><span>参考低位</span><span>参考高位</span><span>实际支付</span></div>${costs.map((c, i) => `<label class="cost-row"><b>${c[0]}</b><span>$${c[1].toLocaleString()}</span><span>$${c[2].toLocaleString()}</span><input type="number" min="0" step="1" inputmode="decimal" data-cost="${i}" value="${budgetState[i] ?? ""}" placeholder="$" aria-label="${c[0]}实际支付金额"/></label>`).join("")}`;
  document.querySelectorAll("[data-cost]").forEach(input => input.addEventListener("input", () => {
    budgetState[input.dataset.cost] = input.value;
    localStorage.setItem("canyon-west-budget", JSON.stringify(budgetState));
    updateBudgetSummary();
  }));
  updateBudgetSummary();
}

function updateBudgetSummary() {
  const actual = costs.reduce((sum, _, i) => sum + (Number(budgetState[i]) || 0), 0);
  const entered = costs.filter((_, i) => Number(budgetState[i]) > 0).length;
  const low = costs.reduce((sum, c) => sum + c[1], 0);
  const high = costs.reduce((sum, c) => sum + c[2], 0);
  const perPerson = actual / 2;
  document.getElementById("budgetSummary").innerHTML = `<div class="summary-total"><span>当前已录入 · ${entered}/${costs.length} 项</span><strong>$${actual.toLocaleString()}</strong></div><div class="summary-line"><span>每人</span><b>$${Math.round(perPerson).toLocaleString()}</b></div><div class="summary-line"><span>逐项参考合计</span><b>$${low.toLocaleString()}–$${high.toLocaleString()}</b></div><div class="summary-line"><span>推荐预留</span><b>$3,200–$3,850</b></div><p class="budget-note">$2,000–$2,500 无法稳妥保留 O 秀、羚羊谷、往返机票和五晚位置便利住宿。若要压缩，优先用积分、降低 Vegas 酒店价和机票价。</p>`;
  const pct = actual ? Math.min(100, actual / 4660 * 100) : 0;
  document.getElementById("budgetFill").style.width = `${pct}%`;
  const marker = document.getElementById("budgetMarker");
  marker.style.left = `${pct}%`;
  marker.style.opacity = actual ? 1 : 0;
  const verdict = document.getElementById("budgetVerdict");
  if (!actual) verdict.textContent = "录入实际价格后，这里会判断是否超出推荐区间。";
  else if (entered < costs.length) verdict.textContent = `已录入 ${entered} 项；还差 ${costs.length-entered} 项，当前金额不是最终总价。`;
  else if (actual < 3200) verdict.textContent = "控制得很好，低于推荐预留；再留约 $150–$250 机动金。";
  else if (actual <= 3850) verdict.textContent = "位于推荐区间，舒适度与行程完整度比较平衡。";
  else verdict.textContent = "超过推荐区间；优先复核酒店全包价、机票和 O 秀座位档位。";
}

function copyCurrentDay() {
  const d = days[activeDay];
  const text = [`${d.date} ${d.weekday}｜${d.title}`, d.subtitle, "", ...d.events.map(e => `${e[0]}  ${e[1]}：${e[2]}`), "", `住宿：${d.overnight}`, `时区：${d.zone}`].join("\n");
  navigator.clipboard?.writeText(text).then(() => showToast("今日行程已复制")).catch(() => showToast("浏览器未允许复制，请手动选择"));
}

function init() {
  renderMap(); renderPlace(); renderDaySwitcher(); renderDay(); renderBookings(); renderBudget();
  document.querySelectorAll("[data-view]").forEach(btn => btn.addEventListener("click", () => switchView(btn.dataset.view)));
  document.getElementById("fitRoute").addEventListener("click", () => { activePlace = places[0].id; renderMap(); renderPlace(); showToast("已回到路线起点"); });
  document.getElementById("copyDay").addEventListener("click", copyCurrentDay);
  document.getElementById("printButton").addEventListener("click", () => window.print());
  document.getElementById("resetBudget").addEventListener("click", () => { Object.keys(budgetState).forEach(k => delete budgetState[k]); localStorage.removeItem("canyon-west-budget"); renderBudget(); showToast("实付金额已清空"); });
}

init();
