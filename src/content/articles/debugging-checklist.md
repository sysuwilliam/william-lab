---
title: "调试记录模板"
description: "一个适合工程问题复盘的轻量模板，先记录事实，再收敛结论。"
date: 2026-06-27
tags: ["debug", "template"]
draft: false
---

工程调试最怕只留下结论、不留下证据。可以按这个结构记录：

## 现象

描述可复现的异常行为，包括环境、命令、输入和输出。

## 假设

列出可能原因，按验证成本排序。

## 验证

逐条写下执行过的命令和结果。

```text
case: build fails before application startup
signal: config parser error
next: inspect generated build arguments
```

## 结论

写清楚最终修复点，以及以后如何避免同类问题。
