# Canyon West 2026

2026 年 10 月 2–7 日拉斯维加斯、Zion、Bryce Canyon、Page 与大峡谷南缘自驾行程网站。

这是一个纯静态前端项目；行程、酒店、导航链接和离线内容都在浏览器端运行，不需要后端或数据库。

## 本地预览

直接用任意静态文件服务器打开 `dist/`，例如：

```powershell
py -m http.server 4173 --directory dist
```

随后访问 `http://localhost:4173`。

## 部署到腾讯云 EdgeOne Pages

在 EdgeOne Pages 新建项目时连接此 GitHub 仓库，并使用：

- Framework preset：No framework / Static
- Build command：留空
- Output directory：`dist`

网站本身不含账号、订单号或精确住址；如需记录个人预订信息，页面会使用当前浏览器的本地存储。
