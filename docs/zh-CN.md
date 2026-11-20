# 简体中文和 Windows

## 在 Windows 开服，用网页游玩

安装 Git 和 Node.js 24，在本仓库目录打开 PowerShell，运行以下命令。

```powershell
npm.cmd ci
npm.cmd run setup
npm.cmd run start:lan
```

终端会显示首次设置地址。在主机浏览器里打开它，创建管理员账号并完成设置。通过 `ipconfig` 查看主机的 IPv4 地址。手机连上同一个 Wi-Fi 后，访问 `http://<主机局域网IP>:3005` 或打开房主分享的战役邀请链接。

- **界面语言**在账号菜单的「设置 → 语言」中选择「简体中文」。自动模式会优先采用服务器提供的界面语言，再参考浏览器或系统语言。各设备可以独立选择。
- **剧情语言**在创建战役时的「世界与剧情」中选择「简体中文」。已有战役可以在战役的「设置 → 世界与剧情」中调整。它决定 AI 主持人使用的语言。
- **Codex 主持**需要在主机安装并登录 Codex CLI，再在管理员面板中将它设为主持程序并测试。玩家在网页里提交行动。

## 构建 Windows 桌面版

桌面端使用 [上游客户端仓库](https://github.com/Lebbitheplow/open-game-master-client) 打包本仓库的游戏页面和服务端。附带的补丁将 Windows 启动界面、加入流程、局域网分享和 Codex 设置的主要文本接入简体中文。部分较少使用的客户端面板仍显示英文。

先在本仓库运行上面的依赖安装命令。打包时请使用已提交本地化改动的版本。客户端的 `bundle-server` 会从本仓库的 `HEAD` 构建内置服务端。在 Windows 上从本仓库目录执行以下命令。

```powershell
$server = (Get-Location).Path
$client = Join-Path (Split-Path $server) "open-game-master-client-zh"
git clone https://github.com/Lebbitheplow/open-game-master-client.git $client
git -C $client switch --detach 48d00ed07fe6123c114a6b87b013cc8e31e10948
git -C $client apply (Join-Path $server "patches/open-game-master-client-zh-CN.patch")
Set-Location $client
$env:ODM_SERVER_DIR = $server
npm.cmd ci
npm.cmd run bundle-server
npm.cmd run build
npm.cmd run stage-desktop
npx.cmd electron-builder --win --publish never
```

安装包位于客户端仓库的 `release` 目录。只想从源码启动时，完成 `bundle-server` 后可以运行 `npm.cmd start`。应用的「设置 → 语言」可切换界面语言，开房后点「在当前 Wi-Fi 上分享」，把二维码给手机玩家。上游客户端的安装标识保持一致，本地构建与官方版共用安装位置。
