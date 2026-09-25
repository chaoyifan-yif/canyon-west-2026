/* Restaurant shortlists are planning notes, not reservations or live opening data.
   Price is an estimated USD amount per person before tax and tip, checked 2026-09-25. */
const RESTAURANT_SOURCES = {
  vegas:'https://www.tripadvisor.com/Restaurants-g45963-Las_Vegas_Nevada.html',
  page:'https://www.tripadvisor.com/Restaurants-g60834-Page_Arizona.html',
  bryce:'https://www.tripadvisor.com/Restaurants-g143015-Bryce_Canyon_National_Park_Utah.html',
  flag:'https://www.tripadvisor.com/Restaurants-g60971-Flagstaff_Arizona.html',
  seligman:'https://www.tripadvisor.com/Tourism-g31353-Seligman_Arizona-Vacations.html',
  desert:'https://www.nps.gov/grca/planyourvisit/restaurants.htm',
  airport:'https://www.harryreidairport.com/dine-shop-and-more'
};
const meal=(name,address,cuisine,price,review,source,fit='顺路',score='')=>({name,address,cuisine,price,review,source,fit,score});
const MEALS = {
  'd0-4':{kind:'晚餐',context:'抵达晚、还要坐 Monorail；先看营业和排队。价格为人均餐费估算，不含税与小费。',options:[
    meal('Grand Lux Café · Venetian','3355 Las Vegas Blvd S, Las Vegas, NV 89109','美式 / 大份量','$25–40','菜单广，评价稳；晚到仍有弹性。',RESTAURANT_SOURCES.vegas,'原路线 · 首选','TA 4.3/5'),
    meal('Tacos El Gordo · Strip','3041 Las Vegas Blvd S, Las Vegas, NV 89109','蒂华纳风格墨西哥卷饼','$15–25','味道评价高、价格较友善；常需排队，距 Venetian 需步行。','https://www.tripadvisor.com/Restaurant_Review-g45963-d10038007-Reviews-Tacos_El_Gordo-Las_Vegas_Nevada.html','步行增加约15分钟','TA 4.4/5'),
    meal('Peppermill Restaurant','2985 Las Vegas Blvd S, Las Vegas, NV 89109','复古美式 diner','$25–40','有老拉斯维加斯气氛，分量足；回酒店可直接打车。','https://www.peppermilllasvegas.com/','需改返程动线','口碑常见；评分未核验')
  ]},
  'd1-5':{kind:'午餐',context:'Park MGM 附近用餐后还要去 Bellagio；不建议为一顿饭多跑一轮长街。',options:[
    meal('Eataly Las Vegas','3770 Las Vegas Blvd S, Las Vegas, NV 89109','意式餐厅 / 柜台披萨意面','$22–35','选择多、速度可控；口碑较两家备选普通，优势是就在路线里。','https://www.eataly.com/us_en/stores/las-vegas','原路线 · 最省时','TA 3.9/5'),
    meal('Din Tai Fung · ARIA','3730 Las Vegas Blvd S, Las Vegas, NV 89158','小笼包 / 台式面点','$30–50','小笼包与服务评价较稳，需预留等位和穿行 ARIA 的时间。','https://www.tripadvisor.com/Restaurant_Review-g45963-d21344064-Reviews-Din_Tai_Fung-Las_Vegas_Nevada.html','绕行 + 可能等位','TA 4.3/5'),
    meal('Mon Ami Gabi · Paris','3655 Las Vegas Blvd S, Las Vegas, NV 89109','法式小酒馆 / 牛排薯条','$35–60','经典位置与整体口碑好；露台不可保证，花费明显上升。','https://www.tripadvisor.com/Restaurant_Review-g45963-d422629-Reviews-Mon_Ami_Gabi-Las_Vegas_Nevada.html','可接 Bellagio，但较贵','TA 4.5/5')
  ]},
  'd1-10':{kind:'晚餐',context:'21:00 O 秀拟定场次待核对。20:25 前往剧院，避免跨酒店久等。',options:[
    meal('Noodles · Bellagio','3600 Las Vegas Blvd S, Las Vegas, NV 89109','泛亚洲面食 / 点心','$30–50','位置最稳，但评价有分歧；味道不保证是这组最佳。','https://bellagio.mgmresorts.com/en/restaurants/noodles.html','同酒店 · 省心','口碑两极，非高分'),
    meal('Mon Ami Gabi · Paris','3655 Las Vegas Blvd S, Las Vegas, NV 89109','法式小酒馆','$35–60','口碑强、景观好；吃完需过街走回 Bellagio，建议预约较早时段。','https://www.tripadvisor.com/Restaurant_Review-g45963-d422629-Reviews-Mon_Ami_Gabi-Las_Vegas_Nevada.html','留足返场时间','TA 4.5/5'),
    meal('Din Tai Fung · ARIA','3730 Las Vegas Blvd S, Las Vegas, NV 89158','小笼包 / 台式','$30–50','味道评价较稳；走回 O Theatre 比 Noodles 远，排队时直接放弃。','https://www.tripadvisor.com/Restaurant_Review-g45963-d21344064-Reviews-Din_Tai_Fung-Las_Vegas_Nevada.html','需提前预约或早吃','TA 4.3/5')
  ]},
  'd2-6':{kind:'午餐',context:'Zion 隧道东侧停车紧张，14:15–14:30 只有15分钟。此时没有三家既高分又不影响 Bryce 日落的餐厅。',options:[
    meal('自带三明治 · Canyon Overlook 停车区','Canyon Overlook Trailhead, Zion National Park, UT','简餐 / 野餐','$8–15','唯一不明显挤占徒步与日落的选项；只在合法车位停稳后吃。','https://www.nps.gov/thingstodo/hike-canyon-overlook.htm','最符合时间 · 首选','不适用评分'),
    meal('Thunderbird Restaurant','4530 State St, Mount Carmel, UT 84755','美式公路餐馆 / 派','$20–35','路上可吃热饭和派；评分普通，堂食会推迟 Bryce。','https://www.tripadvisor.com/Restaurant_Review-g57075-d510724-Reviews-Thunderbird_Restaurant-Mount_Carmel_Utah.html','步道后路过 · 至少增加30–45分钟','TA 3.8/5'),
    meal('Bryce Canyon Pines · 外带','2476 W Hwy 12, Bryce Canyon, UT 84764','美式汉堡 / 三明治','$22–35','口碑比 Ruby’s 自助餐好；到 Bryce 前才吃已偏晚，需电话确认外带。','https://www.tripadvisor.com/Restaurant_Review-g143015-d519331-Reviews-Bryce_Canyon_Pines_Restaurant-Bryce_Canyon_National_Park_Utah.html','仅晚到且改餐次时','TA 4.1/5')
  ]},
  'd2-11':{kind:'晚餐',context:'看完 Bryce 日落再吃饭。周日晚季节性营业须当天确认；从餐厅到 Hatch 仍要开夜路。',options:[
    meal('Bryce Canyon Pines Restaurant','2476 W Hwy 12, Bryce Canyon, UT 84764','美式家常菜 / 派','$25–40','当地相对较好评价，派常获好评；可能要等位，先电话确认末单。','https://www.tripadvisor.com/Restaurant_Review-g143015-d519331-Reviews-Bryce_Canyon_Pines_Restaurant-Bryce_Canyon_National_Park_Utah.html','口碑优先 · 稍绕','TA 4.1/5'),
    meal('Cowboy’s Buffet & Steak Room','26 S Main St, Bryce Canyon City, UT 84764','美式自助 / 牛排','$28–45','方便、吃得快，但近期评价分歧大，不能算高分推荐。','https://www.tripadvisor.com/Restaurant_Review-g143015-d518939-Reviews-Cowboy_s_Buffet_and_Steak_Room-Bryce_Canyon_National_Park_Utah.html','原路线 · 方便','TA 3.3/5'),
    meal('The Lodge at Bryce Canyon Restaurant','The Lodge at Bryce Canyon, Bryce Canyon National Park, UT 84764','公园内美式正餐','$30–50','就在园内，省去先出园的路；10月仍可能营业，但日落后易遇等位，口碑中等。','https://www.visitbrycecanyon.com/dining/the-lodge-at-bryce-canyon-restaurant','园内最顺路 · 先查末单','TA 3.6/5')
  ]},
  'd3-1':{kind:'早餐',context:'Hatch 民宿不含早餐；07:35 要出发。别临时指望小镇餐厅准时营业。',options:[
    meal('昨晚买好的早餐 · 民宿','Hatch, UT','面包 / 酸奶 / 水果','$6–12','最可靠、能准时上路；私人民宿门牌只在登录后记录，不公开在推荐列表。','https://www.nps.gov/brca/planyourvisit/food.htm','首选 · 不用等','不适用评分'),
    meal('Hatch Station Dining Car','177 S Main St, Hatch, UT 84735','美式早餐 / 蛋饼','$15–25','小镇老式餐馆；历史评价参差，营业时间必须前一天电话核对。','https://www.tripadvisor.com/Restaurant_Review-g57008-d1776588-Reviews-Hatch_Station_s_Dining_Car_Restaurant-Hatch_Utah.html','若确认早开门才选','评分与营业待核'),
    meal('Bryce Canyon Pines Restaurant','2476 W Hwy 12, Bryce Canyon, UT 84764','美式早餐','$18–30','在去 Bryce 的路上，但坐下吃会压缩环线和赶 Ken’s 的余量。','https://www.tripadvisor.com/Restaurant_Review-g143015-d519331-Reviews-Bryce_Canyon_Pines_Restaurant-Bryce_Canyon_National_Park_Utah.html','仅缩短徒步时','TA 4.1/5')
  ]},
  'd3-4':{kind:'午餐',context:'Bryce 徒步后仅35分钟用餐，12:00 MDT 就要去 Page 赶 16:00 MST Ken’s。没有三家能在原时段内安心堂食。',options:[
    meal('自带徒步午餐 · Sunrise Point','Sunrise Point Parking, Bryce Canyon National Park, UT','三明治 / 野餐','$8–15','把正餐时间还给路程，是最符合预约风险的方案。','https://www.nps.gov/brca/planyourvisit/food.htm','首选 · 不改时间轴','不适用评分'),
    meal('Ruby’s Canyon Diner · 外带','26 S Main St, Bryce Canyon City, UT 84764','汉堡 / 快餐','$15–25','可试外带，但出园、取餐会吃掉 12:00 出发余量。','https://www.rubysinn.com/restaurant-in-bryce-canyon/canyon-diner/','需提前点单','评分未核验'),
    meal('Bryce Canyon Pines · 外带','2476 W Hwy 12, Bryce Canyon, UT 84764','三明治 / 汉堡','$20–30','店口碑好；仅在前一天确认可预订外带，且离园不堵时选。','https://www.tripadvisor.com/Restaurant_Review-g143015-d519331-Reviews-Bryce_Canyon_Pines_Restaurant-Bryce_Canyon_National_Park_Utah.html','可能使 Ken’s 迟到','TA 4.1/5')
  ]},
  'd3-12':{kind:'晚餐',context:'Page 用餐后可去 Wahweap Overlook 拍星；尽量20:00前吃完，不必因排队错过较好的银河时间。',options:[
    meal('Big John’s Texas BBQ','153 S Lake Powell Blvd, Page, AZ 86040','德州烤肉 / 现场音乐','$25–40','热闹、有地方特色；游客多，排队和味道有波动。','https://www.tripadvisor.com/Restaurant_Review-g60834-d2309179-Reviews-Big_John_s_Texas_BBQ-Page_Arizona.html','原计划 · 氛围好','TA 4.3/5'),
    meal('BirdHouse','707 N Navajo Dr, Page, AZ 86040','炸鸡 / 快餐','$15–25','口碑较高、通常出餐快，适合想早些去拍星。','https://www.birdhouseaz.com/','拍星时间优先','TA 4.6/5'),
    meal('Bonkers Restaurant','810 N Navajo Dr, Page, AZ 86040','意式 / 牛排 / 海鲜','$30–50','坐下来吃的好选择，评价稳定；可能等位。','https://www.tripadvisor.com/Restaurant_Review-g60834-d951473-Reviews-Bonkers_Restaurant_and_Steakhouse-Page_Arizona.html','堂食较慢','TA 4.3/5')
  ]},
  'd4-6':{kind:'午餐',context:'Desert View 35分钟吃饭 + 看景；附近只有 Market & Deli 等少量服务。不能真实地给出三家高分餐厅。',options:[
    meal('自带三明治 · Desert View','Desert View Watchtower Parking, Grand Canyon National Park, AZ','野餐 / 水果','$8–15','最省时间；带走垃圾，公园内勿喂野生动物。','https://www.nps.gov/grca/planyourvisit/restaurants.htm','首选 · 不误行程','不适用评分'),
    meal('Desert View Market & Deli','Desert View Market & Deli, Grand Canyon National Park, AZ','现成三明治 / 饮料','$15–25','NPS列出的园内快餐，是否供应、排队以当天为准。','https://www.nps.gov/places/000/desert-view-market-deli.htm','园内唯一实用购买点','非餐厅评分'),
    meal('Cameron Trading Post Restaurant','466 Hwy 89, Cameron, AZ 86020','纳瓦霍风味 / 美式','$25–40','在东门外，须提前吃、调整入园时间；绝不能吃完再按原时间轴走。','https://camerontradingpost.com/restaurant/','只适合改时间轴','评分未核验')
  ]},
  'd4-15':{kind:'晚餐',context:'按原计划21:00才进 Flagstaff Downtown，多数好店可能已停止接单。观星和完整坐下晚餐二选一更现实。',options:[
    meal('Lumberyard Brewing Co.','5 S San Francisco St, Flagstaff, AZ 86001','美式 / 酿酒屋','$25–40','历史街区氛围好，店面营业至22:00不代表厨房末单。','https://lumberyardbrewingcompany.com/','原计划 · 提前电话问','TA 4.3/5'),
    meal('Beaver Street Brewery','11 S Beaver St, Flagstaff, AZ 86001','披萨 / 美式 pub','$25–40','口碑稳定且也在市中心，官网营业到22:00；厨房时间待核。','https://beaverstreetbrewery.com/menu/','同区备选 · 问末单','TA 4.2/5'),
    meal('提前外带 · Flagstaff East','1000 N Country Club Dr, Flagstaff, AZ 86004','外带 / 车上预订','$15–30','若想去 Sunset Crater 拍星，这比21点再去市中心最可行；具体店由当天营业决定。','https://www.tripadvisor.com/Restaurants-g60971-Flagstaff_Arizona.html','拍星优先','临时自选')
  ]},
  'd5-7':{kind:'午餐',context:'Route 66 小镇停45分钟；人多时外带比久等重要。',options:[
    meal('Westside Lilo’s Café','22855 Old Hwy 66, Seligman, AZ 86337','美式 / 德式 diner','$20–35','老66公路主题浓、口碑较好；可能排队。','https://www.tripadvisor.com/Restaurant_Review-g31353-d514633-Reviews-Westside_Lilo_s_Cafe-Seligman_Arizona.html','原计划 · 首选','TA 4.4/5'),
    meal('Delgadillo’s Snow Cap','301 E Chino Ave, Seligman, AZ 86337','汉堡 / 奶昔','$12–22','老66号公路趣味地标，快餐适合时间紧；季节营业须核对。','https://www.tripadvisor.com/Tourism-g31353-Seligman_Arizona-Vacations.html','快速备选','TA 4.4/5'),
    meal('Route 66 RoadRunner','22330 W Old Highway 66, Seligman, AZ 86337','披萨 / 美式简餐','$15–28','同镇评分较高、吃得较快；当天营业请再核对。','https://www.tripadvisor.com/Restaurant_Review-g31353-d2659793-Reviews-Route_66_RoadRunner-Seligman_Arizona.html','同镇备选','TA 4.4/5')
  ]},
  'd5-15':{kind:'晚餐 / 机场简餐',context:'先完成还车、接驳、安检，再按实际航站楼与登机口选餐。19:50起飞，不能为餐厅跨航站楼。',options:[
    meal('安检后就近现买 · 方案A','Harry Reid International Airport, Las Vegas, NV','三明治 / 沙拉','$15–25','不预设航站楼与店名；先确认登机口，再选步行5分钟内营业柜台。',RESTAURANT_SOURCES.airport,'最安全 · 首选','不适用评分'),
    meal('Kingman 出发前买外带 · 方案B','Kingman, AZ','提前备好三明治','$12–22','航班或安检不确定时更稳；食物过安检需符合TSA规则。',RESTAURANT_SOURCES.airport,'避免机场赶饭','不适用评分'),
    meal('LAS 机场官方餐饮目录 · 方案C','Harry Reid International Airport, Las Vegas, NV','按实际航站楼选','$18–35','机场目录按 T1/T3 与安检区域筛选；临行再核对营业，不杜撰一家你可能到不了的店。',RESTAURANT_SOURCES.airport,'登机口确认后再挑','营业实时核对')
  ]}
};
const STARS = {
  3:{title:'Page · 湖畔暗夜',place:'Wahweap Overlook',address:'Wahweap Overlook, US-89, Page, AZ 86040',distance:'从 Home2 约10–15分钟车程（路况估算）',window:'10/5 20:00–21:10 MST',moon:'月亮约15:29落下，夜间无月光；次日约02:07再升起。',reality:'十月上旬银河核心已很低，晚饭后只可能在西南低空短暂尝试；不要期待夏季那种高悬银河拱。',plan:['19:45餐后先看云量、风和能见度；高云或疲惫就取消。','沿US-89进 NPS 标示的正式观景停车区，车停稳后看清地面，不走到崖边。','20:00–20:15先用肉眼找银河，面向西南，避开 Page 镇灯光；用手机星图确认核心高度。','20:15–20:55拍广角构图与湖面地景；21:10前收好器材，明早要去大峡谷。'],camera:'全幅起点：14–20mm、f/1.8–2.8、10–15秒、ISO 1600–3200、RAW、手动对亮星放大对焦；先拍一张检查星点拖线，再调整。',safety:'NPS 区域可24小时访问，但可能收公园费；只在指定车位，不临崖、不单独走下坡。红光头灯，别照别人镜头。风大可改酒店休息。',sources:['https://home.nps.gov/places/wahweap-overlook.htm','https://www.nps.gov/glca/planyourvisit/seasonalhours.htm','https://www.timeanddate.com/moon/usa/page?month=10','https://static.photopills.com/ebooks/photopills-milky-en.pdf']},
  4:{title:'Flagstaff · 火山岩星空',place:'Sunset Crater · Lava Flow Trail 停车场',address:'Lava Flow Trail Parking, Sunset Crater Volcano National Monument, Flagstaff, AZ',distance:'从 Fairfield East 约25–35分钟车程（路况估算）',window:'10/6 19:30–20:45 MST 是核心较好的时段；原行程从酒店出发约21:00已偏晚',moon:'月亮约15:58落下，次日约02:11再升起；晚间无月光。',reality:'这里是官方24小时开放区域，暗度较好；但十月银河核心约在西南低空、很快下沉。按原计划21:25后抵达更适合拍星野与火山地景，不保证拍到明亮银河核心。',plan:['若银河核心是重点：须放弃南缘完整日落，约17:15提前离开，并提前吃外带晚餐，争取20:00前抵达拍摄点；这与原计划的 Yavapai 日落和21点 Downtown 晚餐冲突。','若坚持完整南缘日落：20:20才到酒店，约21:00从酒店出发、21:25–21:35到拍摄点；主要拍一般星野、仙后座/天鹅座或星轨，不以银河核心为目标。','导航到 Lava Flow Trail 正式停车场，不要跟导航拐入未铺装林道；入口前查 NPS 当天封闭。','在停车场或几百英尺外的铺装步道/露天剧场拍，先照亮脚下，不在漆黑火山岩上探路；疲劳就取消。'],camera:'全幅起点：14–20mm、f/1.8–2.8、10–15秒、ISO 1600–3200、RAW；前景火山岩另拍一张，回去再自然合成。星轨可固定三脚架连拍15–30秒多张。',safety:'NPS 写明道路与步道昼夜开放，但火险、天气可临时关闭；景区入园费照常。10月海拔高会冷，保暖手套、红光头灯和结伴同行。开车司机不要疲劳。',sources:['https://home.nps.gov/sucr/planyourvisit/hours.htm','https://home.nps.gov/places/lava-flow-trail-picnic-area.htm','https://www.nps.gov/places/lava-flow-trail-amphitheater.htm','https://www.timeanddate.com/moon/usa/flagstaff?month=10']}
};
const EXPENSE_CATEGORIES={food:'吃饭',fuel:'加油',supplies:'买补给',tickets:'门票 / 活动',souvenirs:'纪念品',lodging:'住宿',transport:'交通 / 停车',other:'其他'};
