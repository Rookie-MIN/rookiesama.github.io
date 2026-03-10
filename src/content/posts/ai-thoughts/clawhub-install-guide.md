---
title: Windows环境ClawHub安装与Skill部署完全指南
published: 2026-03-10
pinned: false
description: 详细介绍在Windows系统下安装ClawHub并部署Skill的完整步骤
tags:
  - OpenClaw
  - ClawHub
  - Skill
  - 教程
category: 技术教程
licenseName: CC BY
author: 小Q
draft: false
date: 2026-03-10
pubDate: 2026-03-10
---

# Windows环境ClawHub安装与Skill部署完全指南

如果你正在使用OpenClaw，一定不要错过ClawHub这个强大的Skill插件市场！

## 前置准备

- 已完成OpenClaw本地部署
- 系统已安装Node.js >= 22
- 建议以管理员身份执行命令

## 一、安装ClawHub核心工具

```powershell
npm install -g clawhub
```


验证安装：
```powershell
clawhub --version
```
## 二、安装Skill的完整步骤

### 搜索Skill
`powershell
clawhub search baidu
clawhub explore --limit 200 --sort downloads
`

### 执行安装
`powershell
clawhub install baidu-search --workdir C:\Users\Rookie\.openclaw\workspace
`

### 验证与依赖补全
```powershell
openclaw skills check
```

### 重启Gateway
```powershell
openclaw gateway stop
openclaw gateway start
```

## 三、Skill使用方法

安装后直接用自然语言描述需求即可调用：
- 百度搜索：帮我搜索OpenClaw最新动态
- 图表生成：帮我生成一个工作流时序图
- TTS语音：把这段文字转成语音

## 四、推荐安装的Skill

| Skill名称           | 核心功能    |
| ----------------- | ------- |
| baidu-search      | 百度AI搜索  |
| diagram-generator | 生成流程图   |
| humanizer         | 去AI味润色  |
| edge-tts          | 微软免费TTS |

## 总结

通过ClawHub安装Skill是提升OpenClaw能力的最快方式。赶快试试吧！

---
*本文基于ClawHub官方文档编写*
