---
title: 'AI大模型API更换教程'
published: 2026-03-09
pinned: false
description: '详细讲解OpenClaw AI助手API更换方法'
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

本文详细介绍如何正确更换OpenClaw的底层模型API。

## 配置文件位置

OpenClaw的API配置在以下两个文件中：

C:\Users\Rookie\.openclaw\agents\main\agent\
- models.json        (模型配置)
- auth-profiles.json (认证配置)

## 文件结构说明

### models.json

定义模型提供者（providers），包含：
- baseUrl: API端点地址
- api: API类型
- models: 可用模型列表
- apiKey: API密钥

### auth-profiles.json

定义认证配置（profiles），格式：provider:profile
- type: 认证类型
- provider: 对应的provider名称
- key: API密钥

## 更换API Key步骤

### 步骤一：备份配置文件

copy models.json models.json.backup
copy auth-profiles.json auth-profiles.json.backup

### 步骤二：修改 models.json

找到对应的provider，修改apiKey字段。

### 步骤三：修改 auth-profiles.json

找到对应的profile，修改key字段。

### 步骤四：重启Gateway

openclaw gateway restart

### 步骤五：验证

发送测试消息确认正常。

## 切换到其他大模型

如果要切换到OpenAI等其他模型，需要：
1. 在models.json中添加新provider
2. 在auth-profiles.json中添加对应profile

## 常见问题

Q: 不响应怎么办？
A: 检查两个文件中的API Key是否一致。

## 推荐API

- OpenAI (GPT-4) - 生态完善
- 硅基流动 - 国内可用
- Claude - 长文本强

## 结语

关键：两个文件都要修改，且API Key要保持一致。

---
*本文由小Q编写*
*2026年3月9日*
