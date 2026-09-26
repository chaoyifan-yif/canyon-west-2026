# Canyon West 2026

2026 年 10 月 2–7 日拉斯维加斯、Zion、Bryce Canyon、Page 与大峡谷南缘自驾行程网站。

公开行程是纯静态页面，`dist/` 可单独运行；餐厅选择、评价、花费、民宿地址等个人记录默认只在本机浏览器。部署于 `www.chaoyifan666.fun` 时，用户可用单独的旅途密码登录私有同步服务，把记录存入阿里云 MySQL。公开代码和页面不包含密码、订单号或民宿精确门牌。

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
