---
title: "搭建VSCode开发环境"
description: "我发现瑞萨新增了对VSCode开发环境的支持,可以通过下载相关插件进行配置。"
date: 2026-06-20
tags: ["RA4M2", "Renesas", "Zephyr", "RTOS"]
draft: false
series: "RA4M2-SENSOR"
board: "RA4M2-SENSOR"
sourceUrl: "https://github.com/sysuwilliam/RA4M2-SENSOR/blob/main/%E6%8A%A5%E5%91%8A/2.%E6%90%AD%E5%BB%BAVSCode%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83.md"
order: 2
---
[原始报告](https://github.com/sysuwilliam/RA4M2-SENSOR/blob/main/%E6%8A%A5%E5%91%8A/2.%E6%90%AD%E5%BB%BAVSCode%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83.md)

我发现瑞萨新增了对VSCode开发环境的支持,可以通过下载相关插件进行配置。
相比e2studio和keil，使用VSCode开发可以获得更快的编译速度，更强的调试兼容性和更灵活的生态，同时保留了RASC图形配置、编译、烧录、调试功能。所以我来介绍一下如何使用VSCode + Renesas拓展来搭建开发环境和烧录程序。

# 1.安装Renesas插件并进行相关配置
官方提供了英文版的教程
文档教程：[https://tool-support.renesas.com/e2studio/vscode/docs/quick-start-ra.html]https://tool-support.renesas.com/e2studio/vscode/docs/quick-start-ra.html
视频教程：[https://www.renesas.com/en/video/visual-studio-code-how-install-renesas-extensions]https://www.renesas.com/en/video/visual-studio-code-how-install-renesas-extensions
下面介绍一下具体的流程：

## 1. 安装Renesas Platform
在VSCode的拓展商店中搜索Renesas Platform并安装，即可安装Renesas提供的一系列拓展
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-18.png)
下载成功后侧边栏会显示`Renesas Memory Usage View`和`Renesas`图标
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-19.png)
## 2. 下载RA工具包
点击`Renesas Quick Install`,选择Nmae为`Renesas RA`的`Install`,点击`Start Installation`即可。
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-21.png)
安装计划会自动包含所有配置项。此外，还可以通过勾选"Build Tools"（构建工具）、"Debug Tools"（调试工具）、"Device Support"（设备支持）和"Smart Configurators"（智能配置器）选项卡来选择其他工具或工具链版本。
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-22.png)
整个下载的时间还挺长的，主要是`Renesas RA Smart Configurator`下载很慢，我这里1个小时左右才下载完成。
第一次下载，有些失败了，有可能是网络问题，可以重复下载几次：
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-25.png)
其中Jlink的驱动需要手动安装，参照下图：
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-24.png)

## 3. 配置DAPlink
因为我没有Jlink，所以使用DAPlink作为调试器。不过因为这不是官方支持的debug工具，所以配置过程比较繁琐，也会遇到很多问题，所以还是建议使用Jlink。
我配置DAPlink的具体步骤如下：
1. 下载Cortex-Debug插件
在扩展商店中搜索并安装`Cortex-Debug`
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-28.png)

2. 安装pyOCD
打开终端，输入`pip install -U pyocd`


# 2.构建并编译工程
## 1. 构建工程
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-32.png)
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-34.png)
board选择RA4M2
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-35.png)
DEVICE选择R7FA4M2AD3CFP,toolchain选择GCC
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-36.png)
点击Next，Flat (Non-TrustZone) Project，Next,Next
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-37.png)
选择Blinky例程，Finish
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-38.png)
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-39.png)
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-40.png)

## 2.选择工具链
初次购建工程后，在 VS Code 中按下 Ctrl + Shift + P，输入并选择：CMake: Configure，选择瑞萨专用Cmake工具链。
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-41.png)

## 3.使用pyocd + daplink调试
接线：
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/IMG_20260414_222941.jpg)
1. 添加芯片支持
- pyocd 默认不支持该芯片，需要按照pack的方式，让pyocd支持此芯片。
- 在根目录下创建packs文件夹，进入[https://www.keil.arm.com/packs/ra_dfp-renesas/versions/]https://www.keil.arm.com/packs/ra_dfp-renesas/versions/下载 `Renesas.RA_DFP.6.4.0.pack`，将.pack文件放入文件夹packs中。
- 由于pyocd 会自动检测当前路径下的pyocd.yaml文件，并加载其中的pack列表，这里我们在工程路径下添加一个pyocd.yaml文件，里面的内容如下所示。
```
pack:
  - ./packs/Renesas.RA_DFP.6.4.0.pack
```
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-46.png)

2. 修改launch.json
打开.vscode->launch.json，将内容替换为如下：
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Cortex Debug (External)",
            "cwd": "${workspaceFolder}",
            "executable": "${workspaceFolder}/build/Debug/RA.elf",
            "request": "launch",
            "type": "cortex-debug",
            "runToEntryPoint": "main",
            "targetId": "r7fa4m2ad",
            // --- 改为外部模式 ---
            "servertype": "external",
            "gdbTarget": "localhost:3333", 
            // ---------------------------
            "armToolchainPath": "D:/Renesas/RA/e2studio_v2025-12_fsp_v6.4.0/toolchains/gcc_arm/13.2.rel1/bin",
            "gdbPath": "D:/Renesas/RA/e2studio_v2025-12_fsp_v6.4.0/toolchains/gcc_arm/13.2.rel1/bin/arm-none-eabi-gdb.exe",
            "svdFile": "${workspaceFolder}/ra_gen/R7FA4M2AD.svd"
        }
    ]
}
```

3. 启动后端
此时接上线后已经可以成功识别芯片了，但直接调试会显示超时，所以需要手动启动后端，绕过超时检测。
在终端输入：pyocd gdbserver --target r7fa4m2ad，打开端口
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-47.png)

4. 启动调试
按F5即可启动调试
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-48.png)
![alt text](https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A/image-49.png)

看到板子正常运行了。整套流程下来发现配置过程比较繁琐，所以还是建议使用官方原生支持的Jlink或E2 Emulator，我以后也会考虑使用Jlink作为调试器。
总的来说在VSCode上开发的体验感是很不错的，比较符合我的使用习惯。

