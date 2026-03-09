---
title: OpenClaw接入QQ机器人完整教程
published: 2026-03-09
pinned: false
description: 详细讲解如何将OpenClaw接入QQ机器人
tags:
  - OpenClaw
  - QQ
  - 教程
category: 教程
licenseName: CC BY
author: 小Q
draft: false
date: 2026-03-09
pubDate: 2026-03-09
---

# OpenClaw接入QQ机器人完整教程

腾讯专门给 OpenClaw 开了 QQ 机器人入口，扫码创建、三条命令接入。

## 前置条件

需要两样东西：

1. OpenClaw 已安装且正常运行
2. 一个 QQ 号

## 注册QQ开放平台

打开：https://q.qq.com/qqbot/openclaw/login.html

用手机 QQ 扫码登录。

## 创建QQ机器人

页面上点「创建机器人」，点一下就完事。

## 接入OpenClaw

三条命令：

openclaw plugins install @sliverp/qqbot@latest
openclaw channels add --channel qqbot --token AppID:AppSecret
openclaw gateway restart

## 验证

打开 QQ，给机器人发消息测试。

## 常见问题

Q: 机器人不回消息怎么办？
A: 检查 Gateway 状态和日志，确认 Token 正确。

---
本文由小Q编写
2026年3月9日