---
title: 'Star Office UI - 让 AI 工作状态可视化'
published: 2026-03-13
pinned: false
description: '详细介绍 Star Office UI 项目的功能、部署教程以及与 OpenClaw 的深度集成方案'
tags:
  - OpenClaw
  - AI 工具
  - 可视化
  - Star Office
category: AI 工具
licenseName: CC BY
author: 小Q
draft: false
date: 2026-03-13
pubDate: 2026-03-13
---

# Star Office UI - 让 AI 工作状态一目了然

你是否想过能够实时看到 AI 助手正在做什么？Star Office UI 就是这样一个神奇的项目——它是一个像素风格的 AI 办公室可视化看板，让你能够直观地看到 AI 此刻在做什么、昨天做了什么、现在是否在工作。

## 项目简介

Star Office UI 是一个基于像素风格的 AI 助手工作状态实时可视化工具。它的设计灵感来自于像素风办公室场景，AI 在工作时会在虚拟办公室中走到对应的工位区域，状态通过动画和气泡实时展示。

### 核心特性

1. **6 种工作状态可视化**
   - idle - 待命状态，位于休息区（沙发）
   - writing - 写代码/写文档，位于工作区
   - esearching - 搜索/调研，位于工作区
   - executing - 执行命令/跑任务，位于工作区
   - syncing - 同步数据/推送，位于工作区
   - error - 报错/异常排查，位于 Bug 区

2. **昨日小记功能**
   - 自动读取 memory/*.md 文件
   - 读取最近一天的工作记录
   - 脱敏后展示在\"昨日小记\"卡片中

3. **多 Agent 协作支持**
   - 通过 join key 邀请其他 Agent 加入
   - 实时查看多人状态
   - 支持最多 3 人同时在线

4. **中英日三语切换**
   - 支持 CN / EN / JP 一键切换
   - 界面文案、气泡、加载提示全部联动

5. **AI 生图装修**
   - 接入 Gemini API
   - 用 AI 给办公室换背景
   - 不接 API 也能正常使用核心功能

6. **移动端适配**
   - 手机直接打开即可查看
   - 适合外出时快速瞄一眼

7. **桌面宠物模式**
   - 可选的 Electron 桌面封装
   - 把办公室变成透明窗口的桌面宠物

## 环境要求

- **Python 3.10+**：代码使用了 X | Y union type 语法，不支持 Python 3.9 及更低版本

## 快速部署教程

### 方式一：通过 OpenClaw 自动部署（推荐）

如果你正在使用 OpenClaw，只需要发送以下消息给 AI：

`
请按照 SKILL.md 帮我完成 Star Office UI 的部署：
https://github.com/ringhyacinth/Star-Office-UI/blob/master/SKILL.md
`

AI 会自动完成 clone、安装依赖、启动后端、配置状态同步。

### 方式二：手动部署（30秒）

`ash
# 1) 克隆仓库
git clone https://github.com/ringhyacinth/Star-Office-UI.git
cd Star-Office-UI

# 2) 安装依赖
python3 -m pip install -r backend/requirements.txt

# 3) 初始化状态文件
cp state.sample.json state.json

# 4) 启动后端
cd backend
python3 app.py
`

启动后访问 **http://127.0.0.1:19000** 即可看到办公室界面。

### 切换状态测试

`ash
# 测试不同状态
python3 set_state.py writing \"正在整理文档\"
python3 set_state.py error \"发现问题，排查中\"
python3 set_state.py idle \"待命中\"
python3 set_state.py researching \"在搜索资料\"
python3 set_state.py executing \"正在执行命令\"
python3 set_state.py syncing \"同步数据中\"
`

## 与 OpenClaw 深度集成

### 状态自动同步配置

在 OpenClaw 的 SOUL.md 或 AGENTS.md 中添加以下规则：

`markdown
## Star Office 状态同步规则
- 接到任务时：先执行 python3 set_state.py <状态> \"<描述>\" 再开始工作
- 完成任务后：执行 python3 set_state.py idle \"待命\" 再回复用户
`

这样 AI 在工作时会自动更新状态，你可以在 Star Office UI 中实时看到 AI 走到工作区开始工作，工作完成后 AI 会自动回到休息区待命。

### 状态与区域映射表

| 状态 | 办公室区域 | 触发场景 |
|------|-----------|---------|
| idle | 🛋 休息区 | 待命 / 任务完成 |
| writing | 💻 工作区 | 写代码 / 写文档 |
| researching | 💻 工作区 | 搜索 / 调研 |
| executing | 💻 工作区 | 执行命令 / 跑任务 |
| syncing | 💻 工作区 | 同步数据 / 推送 |
| error | 🐛 Bug 区 | 报错 / 异常排查 |

## 邀请其他 Agent 加入

如果你有多个 AI Agent，可以通过 join key 邀请它们加入你的办公室：

### Step 1：准备 join key

首次启动后端时，系统会自动生成 join-keys.json，内含示例 key（如 ocj_example_team_01）。你可以在文件中自行添加、修改或删除 key，每个 key 默认支持最多 3 人同时在线。

### Step 2：配置访客 Agent

访客只需下载 office-agent-push.py，填写 3 个变量：

`python
JOIN_KEY = \"ocj_你的key\"
AGENT_NAME = \"Agent名称\"
OFFICE_URL = \"你的办公室地址\"
`

然后运行：

`ash
python3 office-agent-push.py
`

脚本会自动加入办公室并每 15 秒推送一次状态。

## 常用 API 接口

| 端点 | 说明 |
|------|------|
| GET /health | 健康检查 |
| GET /status | 获取 Agent 状态 |
| POST /set_state | 设置 Agent 状态 |
| GET /agents | 获取 Agent 列表 |
| POST /join-agent | 访客加入办公室 |
| POST /agent-push | 访客推送状态 |
| POST /leave-agent | 访客离开 |
| GET /yesterday-memo | 获取昨日小记 |

## 公网访问配置（可选）

如果你想分享给其他人查看，可以使用 Cloudflare Tunnel：

`ash
cloudflared tunnel --url http://127.0.0.1:19000
`

系统会返回一个 https://xxx.trycloudflare.com 链接，即可分享给他人访问。

## 部署验证

部署完成后可以运行验证脚本：

`ash
python3 scripts/smoke_test.py --base-url http://127.0.0.1:19000
`

所有检查显示 OK 即表示部署成功。

## 项目结构

`
Star-Office-UI/
├── backend/              # Flask 后端
│   ├── app.py
│   ├── requirements.txt
│   └── run.sh
├── frontend/             # 前端页面与资源
│   ├── index.html
│   ├── join.html
│   └── layout.js
├── desktop-pet/          # Electron 桌面宠物版（可选）
├── docs/                # 文档与截图
├── office-agent-push.py  # 访客推送脚本
├── set_state.py         # 状态切换脚本
├── state.sample.json    # 状态文件模板
├── join-keys.sample.json # Join Key 模板
├── SKILL.md            # OpenClaw Skill
└── LICENSE            # MIT 许可
`

## 安全注意事项

- 首次部署可保留默认配置
- 生产环境中建议复制 .env.example 到 .env 并设置强随机密码
- 设置 FLASK_SECRET_KEY 和 ASSET_DRAWER_PASS
- 避免弱密码和会话泄露

## 美术资产说明

- 访客角色动画使用 **LimeZu** 的免费资产
- 代码 / 逻辑采用 MIT 许可
- 美术资产禁止商用（仅学习 / 演示 / 交流用途）

## 总结

Star Office UI 为 AI 工作状态可视化提供了一个优雅的解决方案。无论是监控 AI 工作进度，还是多 Agent 协作管理，它都是一个非常实用的工具。对于使用 OpenClaw 的用户来说，深度集成后可以让 AI 自动维护状态，实现真正的\"看着 AI 工作\"。

快去部署试试吧！
