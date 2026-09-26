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
  'd0-4':{kind:'晚餐',context:'第一晚改去 Fremont Downtown；三家都在附近。价格是人均规划估算，不含税和小费，末单与等位出发前再查。',options:[
    meal('Evel Pie','508 Fremont St, Las Vegas, NV 89101','纽约式薄底披萨','$15–25','快、随意、很贴街头氛围；周五官网营业至凌晨。','https://www.evelpie.com/location/evel-pie/','原路线 · 最省时','营业已核对'),
    meal('Nacho Daddy · Downtown','121 N 4th St, Las Vegas, NV 89101','Tex-Mex / 满料玉米片','$25–40','可坐下来吃，份量大、气氛热闹；周五官网营业至凌晨。','https://nachodaddy.com/downtown/','靠近天幕 · 堂食','营业已核对'),
    meal('Le Thai · Downtown','523 Fremont St, Las Vegas, NV 89101','泰餐 / 咖喱 / 炒饭','$25–40','短肋炒饭是店家招牌；周五官网营业到23:00，晚到须确认厨房末单。','https://lethaivegas.com/contact/','口味优先 · 需早到','营业已核对')
  ]},
  'd1-5':{kind:'午餐',context:'Park MGM 附近用餐后还要去 Bellagio；不建议为一顿饭多跑一轮长街。',options:[
    meal('Eataly Las Vegas','3770 Las Vegas Blvd S, Las Vegas, NV 89109','意式餐厅 / 柜台披萨意面','$22–35','选择多、速度可控；口碑较两家备选普通，优势是就在路线里。','https://www.eataly.com/us_en/stores/las-vegas','原路线 · 最省时','TA 3.9/5'),
    meal('Din Tai Fung · ARIA','3730 Las Vegas Blvd S, Las Vegas, NV 89158','小笼包 / 台式面点','$30–50','小笼包与服务评价较稳，需预留等位和穿行 ARIA 的时间。','https://www.tripadvisor.com/Restaurant_Review-g45963-d21344064-Reviews-Din_Tai_Fung-Las_Vegas_Nevada.html','绕行 + 可能等位','TA 4.3/5'),
    meal('Mon Ami Gabi · Paris','3655 Las Vegas Blvd S, Las Vegas, NV 89109','法式小酒馆 / 牛排薯条','$35–60','经典位置与整体口碑好；露台不可保证，花费明显上升。','https://www.tripadvisor.com/Restaurant_Review-g45963-d422629-Reviews-Mon_Ami_Gabi-Las_Vegas_Nevada.html','可接 Bellagio，但较贵','TA 4.5/5')
  ]},
  'd1-10':{kind:'晚餐',context:'21:00 Bellagio O 秀已预订；20:20 左右抵达剧院。晚餐不能因等位侵占入场缓冲。',options:[
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
  'd3-12':{kind:'晚餐',context:'Page 晚餐后仍可拍银河较亮的天鹅座星带、星野与湖畔地景；不必为了追银心跳过晚饭。',options:[
    meal('Big John’s Texas BBQ','153 S Lake Powell Blvd, Page, AZ 86040','德州烤肉 / 现场音乐','$25–40','热闹、有地方特色；游客多，排队和味道有波动。','https://www.tripadvisor.com/Restaurant_Review-g60834-d2309179-Reviews-Big_John_s_Texas_BBQ-Page_Arizona.html','原计划 · 氛围好','TA 4.3/5'),
    meal('BirdHouse','707 N Navajo Dr, Page, AZ 86040','炸鸡 / 快餐','$15–25','口碑较高、通常出餐快，适合想早些去拍星。','https://www.birdhouseaz.com/','拍星时间优先','TA 4.6/5'),
    meal('Bonkers Restaurant','810 N Navajo Dr, Page, AZ 86040','意式 / 牛排 / 海鲜','$30–50','坐下来吃的好选择，评价稳定；可能等位。','https://www.tripadvisor.com/Restaurant_Review-g60834-d951473-Reviews-Bonkers_Restaurant_and_Steakhouse-Page_Arizona.html','堂食较慢','TA 4.3/5')
  ]},
  'd4-6':{kind:'午餐',context:'Desert View 35分钟吃饭 + 看景；附近只有 Market & Deli 等少量服务。不能真实地给出三家高分餐厅。',options:[
    meal('自带三明治 · Desert View','Desert View Watchtower Parking, Grand Canyon National Park, AZ','野餐 / 水果','$8–15','最省时间；带走垃圾，公园内勿喂野生动物。','https://www.nps.gov/grca/planyourvisit/restaurants.htm','首选 · 不误行程','不适用评分'),
    meal('Desert View Market & Deli','Desert View Market & Deli, Grand Canyon National Park, AZ','现成三明治 / 饮料','$15–25','NPS列出的园内快餐，是否供应、排队以当天为准。','https://www.nps.gov/places/000/desert-view-market-deli.htm','园内唯一实用购买点','非餐厅评分'),
    meal('Cameron Trading Post Restaurant','466 Hwy 89, Cameron, AZ 86020','纳瓦霍风味 / 美式','$25–40','在东门外，须提前吃、调整入园时间；绝不能吃完再按原时间轴走。','https://camerontradingpost.com/restaurant/','只适合改时间轴','评分未核验')
  ]},
  'd4-15':{kind:'晚餐',context:'按原计划21:00才进 Flagstaff Downtown，多数好店可能已停止接单。饭后夜逛与拍星二选一；拍星地点改为 US-180 的 Peak View，不绕行施工中的 Sunset Crater 南入口。',options:[
    meal('Lumberyard Brewing Co.','5 S San Francisco St, Flagstaff, AZ 86001','美式 / 酿酒屋','$25–40','历史街区氛围好，店面营业至22:00不代表厨房末单。','https://lumberyardbrewingcompany.com/','原计划 · 提前电话问','TA 4.3/5'),
    meal('Beaver Street Brewery','11 S Beaver St, Flagstaff, AZ 86001','披萨 / 美式 pub','$25–40','口碑稳定且也在市中心，官网营业到22:00；厨房时间待核。','https://beaverstreetbrewery.com/menu/','同区备选 · 问末单','TA 4.2/5'),
    meal('提前外带 · Flagstaff East','1000 N Country Club Dr, Flagstaff, AZ 86004','外带 / 车上预订','$15–30','若想去 Peak View 拍星，这比21点再去市中心更可行；具体店由当天营业决定。','https://www.tripadvisor.com/Restaurants-g60971-Flagstaff_Arizona.html','拍星优先','临时自选')
  ]},
  'd5-7':{kind:'午餐',context:'Seligman 正餐只留约40分钟，12:15 最迟继续上路；人多时外带比久等重要。',options:[
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
  3:{title:'Page · 银心之外还有整片星河',place:'Wahweap Overlook · 以当晚标识开放为准',address:'Wahweap Overlook, US-89, Page, AZ 86040',distance:'从 Home2 约10–15分钟车程（规划估算）',window:'10/5 晚饭后约20:15–21:15 MST',moon:'月亮15:29落下，次日02:07才升起；这段时间没有月光干扰。',reality:'银心只是银河的一小部分：十月夜间银心低、可能被地形挡住，但天鹅座一带的银河星带、夏季大三角、仙后座方向、星轨和湖畔星野仍值得拍。是否可见取决于云、光害和实际方位。',subjects:[['A · 银河星带','先用星图找天鹅座 / 夏季大三角，不用执着西南低空的银心。'],['B · 湖景星野','16mm 把湖岸轮廓与星空一起构图，前景另拍一张。'],['C · 北天星轨','北向固定三脚架，连续拍多张，回去叠加。']],plan:['晚饭后看云、风、能见度；21点出发也有星带和星野可拍，不是“错过饭点就没戏”。','开到 NPS 标示的 Wahweap Overlook 正式停车区；它与日落后关闭的 Wahweap View/Sunrise Point 名称相似，务必认现场牌，若封闭就不进入。','到场先用星图 App 确认银河星带位置，避开 Page 镇方向的灯光；在停车区附近构图，不去无栏崖边。','拍20–40分钟就收工；摄影不用强行延长到凌晨，次日要去大峡谷。'],camera:'全幅 16mm F1.8 起步：RAW、f/1.8、10秒、ISO 1600–3200，手动放大亮星精确对焦。先看100%星点是否拖线，再试15秒或降ISO；前景可单独低ISO长曝。星轨用15–25秒连续多张，不移动三脚架后期叠加。',safety:'NPS 说 Glen Canyon 整体可24小时访问，但附近一些特定观景区日落后关闭；以当晚标识及公告为准。只在指定停车区，不临崖；红光头灯、保暖、结伴，风大就回酒店。',sources:['https://home.nps.gov/places/wahweap-overlook.htm','https://home.nps.gov/glca/learn/management/superintendents-compendium.htm','https://www.timeanddate.com/moon/usa/page?month=10','https://science.nasa.gov/solar-system/how-to-photograph-a-meteor-shower/']},
  4:{title:'Flagstaff · 秋夜星野与山影',place:'Peak View Overlook · US-180 正式停车区',address:'Peak View Overlook, US-180, Flagstaff, AZ',distance:'从 Fairfield East 约25–35分钟车程（规划估算）',window:'10/6 晚饭后约22:10–22:55 MST · 与 Downtown 夜逛二选一',moon:'月亮约15:58落下，次日约02:11再升起；晚间无月光。',reality:'21点后银心不再是合理主目标，但广角镜头能拍 San Francisco Peaks 山影、天鹅座方向的银河星带、北天星轨或仙后座一带的星野。秋夜光线更暗、空气冷，不等于“没得拍”。',subjects:[['A · 山影与银河','先用星图找高处星带，以山体或松树剪影作前景。'],['B · 北天星轨','对着北方山影，连拍20–30分钟可做短星轨。'],['C · 明亮星座','在光害较低的方向拍星座与地景，不强求银心。']],plan:['先吃晚餐；若晚饭拖到22点或司机疲劳，就取消拍摄，不牺牲安全。选拍星则不再走 Downtown 21:45 的可选夜逛。','沿铺装 US-180 到 Peak View 官方停车区；此地有指定停车位和 San Francisco Peaks 视野，停在正式车位，不停公路路肩。','到场预计22:10以后，先用星图找可见目标，做一组16mm星野，再用同构图多张连拍星轨；停留约30–45分钟。','拍完直接回酒店，不再追加第三站；明早还要沿 Snowbowl Road 拍白杨。今晚不要绕去 Sunset Crater——NPS 公告其常用南侧入口道路 9/21–10/21 封闭。'],camera:'全幅 16mm F1.8 起步：RAW、f/1.8、10秒、ISO 1600–3200；放大星点检查拖线与虚焦。山影可拍前景补光或另拍一张低ISO长曝。星轨固定三脚架连拍15–25秒多张，关掉间隔空隙，后期叠加。',safety:'Peak View 是官方指定铺装停车区，但未核实夜间现场是否有临时关闭；出发前看公告与入口标识，封闭就不进。US-180 夜间注意野生动物和结冰，带保暖层、红光灯；不要走进无灯树林。',sources:['https://www.flagstaffarizona.org/things-to-do/outdoors-nature/winter-adventure/','https://www.nps.gov/sucr/learn/news/2026-08-24-fs-545-road-closure.htm','https://www.timeanddate.com/moon/usa/flagstaff?month=10','https://www.flagstaffarizona.org/things-to-do/astrotourism/']}
};
const EXPENSE_CATEGORIES={food:'吃饭',fuel:'加油',supplies:'买补给',tickets:'门票 / 活动',souvenirs:'纪念品',lodging:'住宿',transport:'交通 / 停车',other:'其他'};
