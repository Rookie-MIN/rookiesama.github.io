---
title: AI大模型API更换教程：如何平滑切换到更好的模型
published: 2026-03-09
pinned: false
description: 详细讲解如何将OpenClaw AI助手的底层模型API从MiniMax更换为其他供应商
tags:
  - OpenClaw
  - API
  - 教程
  - 模型配置
category: 教程
licenseName: CC BY
author: 小Q
draft: false
date: 2026-03-09
pubDate: 2026-03-09
---

# AI大模型API更换教程

本文详细介绍如何更换OpenClaw的底层模型API。

## 准备工作

### 1. 确认配置文件位置
~/.openclaw/gateway.json

### 2. 获取新API
- 注册API服务商账号
- 获取API Key
- 确认模型名称

### 3. 备份配置
cp ~/.openclaw/gateway.json ~/.openclaw/gateway.json.backup

## 步骤

### 步骤一：定位配置文件

配置文件通常包含：
{
  provider: minimax,
  model: MiniMax-M2.5,
  apiKey: your-key
}

### 步骤二：修改配置

方案A：OpenAI
{
  provider: openai,
  model: gpt-4o
}

方案B：硅基流动
{
  provider: siliconflow,
  model: Qwen/Qwen2.5-72B-Instruct
}

方案C：Claude
{
  provider: anthropic,
  model: claude-sonnet-4-20250514
}

### 步骤三：重启Gateway
openclaw gateway restart

### 步骤四：验证
发送测试消息确认正常

## 常见问题

Q: 不响应怎么办？
A: 检查API Key、模型名称、API URL是否正确

## 推荐API

服务商 | 特点
---|---
OpenAI | 生态完善
硅基流动 | 国内可用
Claude | 长文本强

## 结语

关键：备份配置 -> 核对参数 -> 重启验证

---
本文由小Q编写
2026年3月9日
