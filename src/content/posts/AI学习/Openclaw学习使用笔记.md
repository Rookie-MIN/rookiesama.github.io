---
title: Openclaw使用学习笔记
published: 2026-03-07
pinned: false
description: 这是我开荒openclaw 所经历的一些问题，加以记录
tags:
  - AI
  - Openclaw
category: AI笔记
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-03-07
pubDate: 2026-03-07
---
# 前言：
我是在该 [网站]([OpenClaw101 - OpenClaw 中文教程](https://www.openclaw101.club/)) 初次学习体验的，老实说我觉得里面内容是挺多的，但也有很多点并没有讲到位，会有很多问题产生，作为初入 [openclaw🦞](https://github.com/openclaw/openclaw)  的小白来说，还是有一定门槛的（至少我中途有好多东西还得去向 AI 询问），可能按照官方github网站，一步一步配置也能相对轻松的完成吧。

# 1.前期环境搭建
## 环境要求
### 必要条件
- **Node.js 22+**：OpenClaw 使用了较新的 Node.js 特性，因此需要 22.x 或更高版本
- **npm 或 yarn**：包管理器，随 Node.js 一起安装
- **操作系统**：Linux（推荐）、macOS、Windows（通过 WSL2）
本操作主要是 Windows 用户
(ps : Node.js 是 **JavaScript 运行时环境**
npm 是 Node.js 的默认 **JavaScript 包管理工具**，用于管理项目依赖、运行脚本，并方便开发者共享和复用代码。)

### 检查Node.js版本
```shell
node --version
#输出应该是 v22.x.x 或者更高
```
如果没有下载，请访问[网站]([Node.js — 下载 Node.js®](https://nodejs.org/zh-cn/download/current))按照操作下载安装
# npm 全局安装(本人使用)
这是最简便的办法~~（**当然省略了安装路径这一操作）**~~ 
```shell
npm install -g openclaw@latest
```
安装完成后，验证是否安装成功：
```shell
openclaw --version
```
如果你看到版本号输出，说明安装成功。

# 运行Onboarding Wizard
安装完成后，运行 onboarding wizard 来完成初始化配置。这个向导会引导你完成以下步骤：

- 创建配置文件
- 设置 AI 模型提供商的 API Key
- 配置第一个通讯渠道
- 安装守护进程（daemon）
```shell
openclaw onboard --install-daemon
```
`--install-daemon` 参数会同时安装系统守护进程，让 Gateway 可以在后台持续运行并开机自启。
向导会以交互式问答的形式引导你完成配置。大致流程如下：
```
🐾 Welcome to OpenClaw!
? Select your AI provider: (Use arrow keys) 
	❯ Anthropic (Claude) 
	  OpenAI (GPT)
	  Google (Gemini)
	  Custom / OpenAI-compatible
? Enter your API key: sk-ant-xxxx...
? Choose a channel to set up: 
	❯ Telegram 
	  Discord 
	  WhatsApp 
	  Skip for now
✅ Configuration saved to ~/.openclaw/openclaw.json
✅ Daemon installed and started
```

简单来说就是：
- 1.先配置 openclaw 的 agent（AI模型，API）
- 2.再配置 openclaw 的 clannel (聊天频道，比如在手机的QQ中创建一个机器人用户和它聊天)
💡 **提示**：如果你还没有准备好 API Key 或渠道配置，可以暂时跳过，后续通过编辑配置文件或 Control UI 来补充。

以下是我的个人方案，仅供参考~~（觉得门槛比较低，我这废物都成功了）~~
- 我最早是想装一个 Deepseek V1 的大脑，但由于没有这个选项，我就询问该怎么装，给出的答案是走一个中间渠道再调用，非常的麻烦~~反正最后我没成功（）~~
- 后我转向使用 Minimax (token便宜 先用着), 直接进入[网站获取API即可](https://platform.minimaxi.com/login)
	- 创建账号 ->  接口密钥 ->  创建新的API -> 复制粘贴
	- 切记，要记好自己的API，复制到一个能够保存的地方，若是遗忘则很难查询
	- 好消息是 新人送 15元 额度,能耍一阵子了
- 对于 channel，其实挺想用 Discord 和 Watchapp 的，两个兼容性都挺强的，但我使用出现问题：
	- 刚创建的 Discord 被封禁了~~不知原因~~
	- Watchapp 的识别扫描，认证一直进不去()
- 最后只能退而求其次，选用国内的平台，我用的是飞书，这是[网络教程](https://cloud.tencent.com/developer/article/2626160),还是挺详细的
	- 目前用过来除了不能发送图片以外 倒是没有其他问题（我是说可能）

接下来会给很多 `skill` 和 `YES/NO`， 一般都默认 NO 就好了
- `skill` 默认先不配置，先能聊天才算数
- 其他东西 都是额外功能，需要花钱（部分配置还吃系统，Mac系统兼容性就挺好的） 暂时我们就不用这些功能

# 启动
简易配置完，就可以开始启动了
(对于人格和提示词其实我并不明白是先配置，还是先启动就行，推荐还是先修改文件，具体说明在下面)
```shell
# 前台运行（适合调试，按 Ctrl+C 停止）
openclaw gateway 
# 以守护进程方式启动
openclaw gateway start 
# 查看运行状态
openclaw gateway status 
# 停止 Gateway
openclaw gateway stop 
# 重启 Gateway（常用于更新配置后）
openclaw gateway restart
```
前台运行模式适合调试和开发，你可以直接在终端看到所有日志输出。守护进程模式适合正式部署，Gateway 会在后台运行，不受终端关闭影响。

# 验证安装
## openclaw status
```shell
openclaw status
```
这个命令会显示 Gateway 的运行状态、连接的渠道、活跃的会话等信息

## openclaw doctor
```shell
openclaw doctor
```
`openclaw doctor` 是一个诊断工具，它会检查你的安装环境和配置文件，并报告任何问题：
如果有任何项目显示 ❌ 或 ⚠️，按照提示进行修复即可。
```shell
openclaw doctor --fix
#给出的默认修复
```

# 配置详解
## 人格于提示词:
[详细教程](https://www.openclaw101.club/docs/config/persona/) 这里讲的非常详细，建议先修改再启动 Openclaw（好像说是启动后就不再会执行一些文件了 恼）
但对于 SOUL AGENT USER TOOLS IDENTITY 还是会确认的（如果你不幸无法确认，那就让AI 自己读取文件）
修改完 这些文件后 输入:
```shell
openclaw doctor --fix
openclaw gateway restart
```
应该就可以了。

## 常见问题
- 