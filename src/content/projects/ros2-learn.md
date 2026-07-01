---
title: "ROS2-learn"
description: "ROS 2 机器人开发学习、环境配置和实验记录。"
date: 2026-07-01
tags: ["ros2", "robotics", "linux", "learning"]
draft: false
repo: "https://github.com/sysuwilliam/ROS2-learn"
status: "learning"
stack: ["ROS 2", "Linux", "Robotics", "C++", "Python"]
---

ROS 2 机器人开发学习仓库，用于整理环境配置、基础通信机制、节点实验和后续机器人项目实践。

## Links

- [GitHub repository](https://github.com/sysuwilliam/ROS2-learn)

## Repository README

> Synced from [README.md](https://github.com/sysuwilliam/ROS2-learn/blob/main/README.md) on 2026-07-01.

# ROS2-learn

这个仓库用于记录 ROS 2 学习过程中的笔记、示例代码和章节练习。内容主要围绕《ROS2 机器人开发：从入门到实践》的学习路线展开，包含基础命令、CMake、Python/C++ 节点、话题、服务、接口等练习。

## 仓库结构

```text
.
├── note/        # 学习笔记，按章节整理
├── code/        # 按章节编写的练习代码和工作空间
├── chapt4_ws/   # 第 4 章服务与接口相关 ROS 2 工作空间
└── example/     # 参考示例代码
```

## 环境要求

- Ubuntu 22.04 或兼容环境
- ROS 2 Humble
- Python 3
- CMake / colcon

使用前先加载 ROS 2 环境：

```bash
source /opt/ros/humble/setup.bash
```

## 构建 ROS 2 工作空间

以 `chapt4_ws` 为例：

```bash
cd chapt4_ws
colcon build
source install/setup.bash
```

如果工作空间中有自定义接口，修改接口文件后需要重新构建并重新加载环境：

```bash
colcon build
source install/setup.bash
```

## 运行示例

服务端和客户端示例需要在不同终端中运行，并在每个终端加载 ROS 2 和当前工作空间环境：

```bash
source /opt/ros/humble/setup.bash
source chapt4_ws/install/setup.bash
```

然后根据具体包名和节点名运行：

```bash
ros2 run <package_name> <executable_name>
```

## Git 忽略规则

根目录 `.gitignore` 已忽略 ROS 2 / colcon 构建产物、CMake 产物、Python 缓存、编辑器配置和本地历史文件。已经被 Git 跟踪的构建产物不会因为新增 `.gitignore` 自动移除，如需清理可使用 `git rm --cached` 另行处理。

## 说明

本仓库是个人学习记录，代码和笔记会随着学习进度持续调整。
