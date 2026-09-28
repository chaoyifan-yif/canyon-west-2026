# Canyon West 2026

2026 年 10 月 2–7 日拉斯维加斯、Zion、Bryce Canyon、Page 与大峡谷南缘自驾行程网站。

公开行程是纯静态页面，`dist/` 可单独运行；餐厅选择、评价、花费、民宿地址等个人记录默认只在本机浏览器。部署于 `www.chaoyifan666.fun` 时，用户可用单独的旅途密码登录私有同步服务，把记录存入阿里云 MySQL。公开代码和页面不包含密码、订单号或民宿精确门牌。

## 四个入口，一份路上用的手册

| 入口 | 用途 |
| --- | --- |
| 旅程 | 整圈自驾图、逐日路段、六天入口；不再另设地图 Tab |
| 当天 | 下一站、今晚住宿、时间轴；餐厅候选和拍星攻略按需展开 |
| 记录 | 实付分类、餐厅评价、账本；餐费从每日餐卡同步记入 |
| 行囊 | 五晚住宿、私人补充、清单、同步、离线手册和备份 |

首页的自驾图不依赖在线瓦片，可按 10 月 4–7 日查看里程、规划时长及 Google Maps 导航。10 月 6 日有「Yavapai 日落后直达 Flagstaff」和「折返 Desert View 补拍银心」两条分支；选择同步当天时间轴与观星卡。旧 `#map` 链接仍跳到首页地图，旧 `#stays` 也保留。路形由 `scripts/generate-route-geometry.py` 生成，是 OSRM 路网快照，不含实时交通或封路；公开地图只标 Hatch 镇中心。

视觉采用暖白、深墨色、砂岩红。正文不叠加在插画上，深色拍星面板显式指定浅色文字，系统字体与 SVG 插画不依赖外部字体服务。手机导航由六项减为四项；地图默认不捕获手机拖动，点「启用地图拖动」再操作。

展示层在 `dist/ui.js`，既有行程数据、个人记录键名和 API 协议保持兼容。设计取舍及测试边界见 [设计说明](docs/UI-REDESIGN.md)。

本地无网络 DOM 集成测试：安装开发依赖 `jsdom` 后运行 `node test-ui-unit.cjs`。它验证路由、路线分支、餐厅/账本联动、完整备份导入、导航目的地、离线打包和颜色对比度，但**不验证真实浏览器排版或手机截图**。旧 `test-site.cjs` / `test-features.cjs` / `test-map.cjs` 保留为旧版测试记录，其中旧选择器不适用于本次四入口布局。

## 本地预览

直接用任意静态文件服务器打开 `dist/`，例如：

```powershell
py -m http.server 4173 --directory dist
```

随后访问 `http://localhost:4173`。

## 静态部署

在 EdgeOne Pages 新建项目时连接此 GitHub 仓库，并使用：

- Framework preset：No framework / Static
- Build command：留空
- Output directory：`dist`

静态副本依然可离线使用，但不会连接个人云端。`dist/sw.js` 不缓存私有 API。

## 私有记录服务

`server/guide-api.py` 是仅监听 `127.0.0.1:8765` 的最小 HTTP API。Nginx 在 HTTPS 下把 `/travel/us-west-lasvegas/api/` 反向代理到该服务。MySQL 结构在 `server/schema.sql`；`server/setup-server.py` 为服务器首次初始化生成独立数据库用户和旅途登录密码。密码只写在服务器的 `/etc/canyon-guide.env` 与 root 私有的 `/root/canyon-guide-access.txt`，绝不提交到 Git。`server/canyon-guide.service` 提供 systemd 托管，`server/patch-nginx.py` 只在既有配置的旅行路径插入 API 代理，不改游戏服务。

需要更换旅途密码时，以 root 身份运行 `server/rotate-access-password.py`，从标准输入传入新密码，随后重启 `canyon-guide` 服务。脚本保留原环境文件的 root-only 备份、刷新 scrypt 哈希并撤销旧会话；不会清空 MySQL 中的行程记录。密码不要写入 Git、公开网页、命令行参数或日志。

个人状态仍会保留在本机，登录后与云端同步；冲突时不会覆盖其他设备的新版本。这个服务不接入银行账单，所有消费金额都由用户手填。不要在记录里填写门锁密码、卡号或证件号。退出时清除本机个人记录，服务器副本保留以供下次登录。服务器端需自己定期备份 MySQL。
