---
title: "使用Zephyr RTOS开发RA4M2-SENSOR"
description: "由于我最近在研究Zephyr RTOS，这块开发板又刚好可以适配，所以就尝试将Zephyr接入RA4M2-SENSOR中。"
date: 2026-06-22
tags: ["RA4M2", "Renesas", "Zephyr", "RTOS"]
draft: false
series: "RA4M2-SENSOR"
board: "RA4M2-SENSOR"
sourceUrl: "https://github.com/sysuwilliam/RA4M2-SENSOR/blob/main/%E6%8A%A5%E5%91%8A/4.%E4%BD%BF%E7%94%A8Zephyr%20RTOS%E5%BC%80%E5%8F%91RA4M2-SENSOR.md"
order: 4
---
[原始报告](https://github.com/sysuwilliam/RA4M2-SENSOR/blob/main/%E6%8A%A5%E5%91%8A/4.%E4%BD%BF%E7%94%A8Zephyr%20RTOS%E5%BC%80%E5%8F%91RA4M2-SENSOR.md)

# 使用Zephyr RTOS开发RA4M2-SENSOR

## 一、评测目标

由于我最近在研究Zephyr RTOS，这块开发板又刚好可以适配，所以就尝试将Zephyr接入RA4M2-SENSOR中。
本次目标是验证 `RA4M2-SENSOR` 开发板是否可以使用 `Zephyr RTOS` 完成最小功能开发，并给出一份可复现的开发、构建与烧录流程。

本次最终实现的功能为：

- 基于 `Zephyr` 创建 `RA4M2` 工程
- 使用 `GPIO` 驱动开发板 LED
- 实现 LED 周期性闪烁
- 使用 `pyOCD + DAPLink` 完成程序烧录

结论：

- `RA4M2` 可以使用 `Zephyr` 开发
- `Zephyr` 官方已经提供 `ek_ra4m2` 板级支持
- 在本次环境下，工程可以成功构建
- 在安装 `Renesas.RA_DFP` CMSIS-Pack 后，可以通过 `pyOCD` 成功烧录到目标板

---

## 二、Zephyr 是什么

`Zephyr` 是一个面向嵌入式系统和物联网设备的开源实时操作系统（RTOS），由 Linux Foundation 托管维护。它并不是传统意义上只服务单一芯片厂商的 SDK，而是一套面向资源受限设备的通用嵌入式平台。官方文档强调，Zephyr 适合从 LED、传感器到联网终端等多种 MCU 应用场景，重点是提供统一的内核、驱动和板级开发方式。[1][2]

从体系结构上看，Zephyr 主要由以下几部分组成：

- **内核（Kernel）**：负责线程调度、时间管理、中断处理和同步机制，是整个 RTOS 运行的基础。
- **设备树（Devicetree）**：用来描述硬件连接关系，例如哪个 GPIO 接了 LED、哪个 UART 用作控制台、哪个 I2C 总线上挂了传感器。
- **Kconfig 配置系统**：负责管理软件功能开关，例如是否启用 GPIO、串口、日志、浮点输出等。
- **驱动模型（Driver Model）**：把底层硬件封装成统一接口，应用层通常不需要直接操作寄存器。
- **构建系统（West + CMake）**：提供统一的下载、更新、构建和烧录流程。

从开发者角度看，Zephyr 可以理解为：

- 一个跨芯片平台的嵌入式操作系统
- 一个统一的板级支持与驱动框架
- 一个带有完整工程管理能力的开发生态

它的核心理念不是“给某一家芯片厂单独写一套 SDK”，而是通过统一的构建系统、设备树、Kconfig 和驱动模型，让不同厂商的板卡尽量用同一套工程结构开发。这样一来，开发者后续迁移平台时，更多只是调整板级描述文件，而不是重写整套业务代码。

### 2.1 官方参考资料

- [Zephyr Introduction](https://docs.zephyrproject.org/latest/introduction/index.html)
- [Zephyr Getting Started](https://docs.zephyrproject.org/latest/develop/getting_started/index.html)
- [Build the Blinky Sample](https://docs.zephyrproject.org/latest/develop/getting_started/index.html#build-the-blinky-sample)
- [Flash the Sample](https://docs.zephyrproject.org/latest/develop/getting_started/index.html#flash-the-sample)

---

## 三、Zephyr 的主要优势

### 3.1 统一的硬件抽象

Zephyr 使用 `DeviceTree` 描述硬件，使用 `Kconfig` 管理软件配置。对于不同芯片平台，可以用相似的方式描述 GPIO、UART、I2C、SPI、ADC、PWM 等外设，降低平台迁移成本。这样做的好处是，应用代码与板级硬件细节分离，移植时通常只需要调整 overlay 或 Kconfig，而不是重写主程序。

### 3.2 丰富的板级与驱动生态

Zephyr 官方已经支持大量开发板和芯片系列。本次使用的 `RA4M2` 官方板卡 `ek_ra4m2` 已经被支持，因此不需要从零编写完整 BSP。

### 3.3 工程结构清晰

典型 Zephyr 工程通常包含：

- `src/main.c`
- `prj.conf`
- `app.overlay`
- `CMakeLists.txt`

这种结构比传统单片机“工程文件 + IDE 配置 + 厂商生成代码”的方式更清晰，也更利于版本管理。对课程评测而言，它的优点是可复现性强，只要命令和配置文件一致，别人基本能复现同样的结果。

### 3.4 更适合团队协作与持续集成

Zephyr 使用命令行构建，天然适合：

- Git 版本管理
- 自动化构建
- 持续集成
- 多开发者协作

### 3.5 便于后续扩展

完成 LED 闪烁只是第一步。后续如果要扩展到：

- 串口日志
- I2C 传感器
- ADC 采样
- PWM 输出
- USB、网络、文件系统

Zephyr 的扩展性和统一接口会更有优势。

---

## 四、评测环境

### 4.1 硬件环境

- 目标板：`RA4M2-SENSOR`
- MCU：`Renesas RA4M2`
- 下载器：`DAPLink`
- 烧录方式：`pyOCD`

### 4.2 软件环境

- Windows PowerShell
- `Zephyr`
- `west`
- `cmake`
- `ninja`
- `dtc`
- Python 虚拟环境：`D:\Zephyr\zephyrproject\.venv`
- 工具链：`GNU Arm Embedded Toolchain`
- 工具链路径：`D:\DevEnv\DevEnv\DevEnv\GNU-tools-for-STM32`

### 4.3 Zephyr 板卡

本次使用 Zephyr 官方板卡定义：

- `ek_ra4m2`

---

## 五、工程实现思路

### 5.1 LED 引脚来源

根据现有 FSP 例程和板级引脚分析，本次使用了以下三个引脚作为 LED 控制引脚：

- `P002`
- `P103`
- `P104`

在 Zephyr 中，通过 `app.overlay` 补充设备树定义，将它们定义为 `gpio-leds` 节点。

### 5.2 主程序逻辑

程序启动后执行以下流程：

1. 获取三个 LED 的 GPIO 描述符
2. 检查 GPIO 设备是否 ready
3. 将 LED 引脚配置为输出
4. 在死循环中依次翻转 LED 状态
5. 每 500 ms 延时一次

这样就实现了 LED 闪烁功能。

### 5.3 为什么适合用 Zephyr 做这个实验

- LED 这类 GPIO 任务非常适合验证板级支持是否正常
- 设备树方式可以直接把 LED 引脚和名字绑定起来
- 主程序只负责业务逻辑，不需要关心底层寄存器细节
- 一旦这类最小工程能跑通，后续 UART、I2C、ADC、PWM 扩展会更顺

---

## 六、工程文件说明

本次 Zephyr 工程主要文件如下：

- `src/main.c`
- `app.overlay`
- `prj.conf`
- `CMakeLists.txt`

---

## 七、完整源码

### 7.1 `src/main.c`

```c
#include <zephyr/device.h>
#include <zephyr/devicetree.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/kernel.h>

#define SLEEP_TIME_MS 500

#define USER_LED0_NODE DT_NODELABEL(user_led0)
#define USER_LED1_NODE DT_NODELABEL(user_led1)
#define USER_LED2_NODE DT_NODELABEL(user_led2)

static const struct gpio_dt_spec leds[] = {
	GPIO_DT_SPEC_GET(USER_LED0_NODE, gpios),
	GPIO_DT_SPEC_GET(USER_LED1_NODE, gpios),
	GPIO_DT_SPEC_GET(USER_LED2_NODE, gpios),
};

int main(void)
{
	int ret;

	for (size_t i = 0; i < ARRAY_SIZE(leds); ++i) {
		if (!gpio_is_ready_dt(&leds[i])) {
			return -ENODEV;
		}

		ret = gpio_pin_configure_dt(&leds[i], GPIO_OUTPUT_INACTIVE);
		if (ret < 0) {
			return ret;
		}
	}

	while (1) {
		for (size_t i = 0; i < ARRAY_SIZE(leds); ++i) {
			gpio_pin_toggle_dt(&leds[i]);
		}

		k_msleep(SLEEP_TIME_MS);
	}

	return 0;
}
```

### 7.2 `app.overlay`

```dts
/
{
	user_leds {
		compatible = "gpio-leds";

		user_led0: user_led0 {
			gpios = <&ioport0 2 GPIO_ACTIVE_HIGH>;
			label = "USER_LED0_P002";
		};

		user_led1: user_led1 {
			gpios = <&ioport1 3 GPIO_ACTIVE_HIGH>;
			label = "USER_LED1_P103";
		};

		user_led2: user_led2 {
			gpios = <&ioport1 4 GPIO_ACTIVE_HIGH>;
			label = "USER_LED2_P104";
		};
	};
};

&ioport0 {
	status = "okay";
};

&ioport1 {
	status = "okay";
};
```

### 7.3 `prj.conf`

```conf
CONFIG_GPIO=y
```

### 7.4 `CMakeLists.txt`

```cmake
cmake_minimum_required(VERSION 3.20.0)
find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})
project(ra4m2_sensor_blinky)

target_sources(app PRIVATE src/main.c)
```

---

## 八、完整开发过程与问题处理

### 8.1 初始目标

最初目标是验证 `RA4M2` 是否可以在 `Zephyr` 下运行 LED 闪烁示例。

### 8.2 遇到的问题

在实际开发中，先后遇到了以下问题： 
1. 默认 `Zephyr SDK` 安装与识别流程未完全打通  
2. `pyOCD` 初始状态下不认识 `R7FA4M2AD`

### 8.3 对应处理方式

针对上述问题，采取了以下解决办法：
1. 改用系统中现成可用的 `GNU Arm Embedded Toolchain`
2. 使用 `pyocd pack install R7FA4M2AD*` 安装 Renesas RA4M2 器件支持包

### 8.4 最终结果

最终实现了以下结果：

- `west build` 成功
- 生成 `zephyr.elf` / `zephyr.hex`
- `west flash --runner pyocd` 成功
- 程序成功烧录到 `RA4M2` 目标板

构建成功截图如下：

![Zephyr LED build success](/media/articles/ra4m2-sensor/04-zephyr-rtos-ra4m2-sensor/e3f0a06c-5beb-4947-9e8c-33d98db01e41-9334247aaa33.png)

从截图可以看出，`west build` 已经完成了完整的配置、编译和链接流程，最终生成了 `zephyr.elf`。同时，构建输出中显示板卡为 `ek_ra4m2/r7fa4m2ad3cfp`，说明 Zephyr 已正确识别目标硬件；内存占用信息也表明程序规模很小，符合 LED 闪烁这类基础验证工程的预期。

烧录成功截图如下：

![Zephyr LED flash success](/media/articles/ra4m2-sensor/04-zephyr-rtos-ra4m2-sensor/1c3adcca-890b-4a9c-873d-5bbb3680e12d-fb9f695107cc.png)

从截图可以看出，`west flash` 已调用 `pyocd` 作为 runner，并成功完成 `Loading`、`Erasing`、`Programming` 等步骤，最终写入 `zephyr.hex` 到目标板。这说明板卡连接、DAPLink 识别以及 Renesas RA4M2 器件支持包都已配置正确。

---

## 九、完整命令记录

以下命令为本次开发实际可用的完整命令流程。

### 9.1 激活虚拟环境

```powershell
cd D:\Zephyr
zephyrproject\.venv\Scripts\Activate.ps1
```

### 9.2 安装 pyOCD 的 RA4M2 支持包

```powershell
pyocd pack find R7FA4M2AD*
pyocd pack install R7FA4M2AD*
pyocd list --targets | Select-String -Pattern "ra4m2|r7fa4m2ad" -CaseSensitive:$false
```

### 9.3 设置工具链环境变量

```powershell
cd D:\Zephyr\zephyrproject
$env:ZEPHYR_TOOLCHAIN_VARIANT="gnuarmemb"
$env:GNUARMEMB_TOOLCHAIN_PATH="D:\DevEnv\DevEnv\DevEnv\GNU-tools-for-STM32"
```

### 9.4 构建工程

```powershell
west build -p always -b ek_ra4m2 apps\ra4m2_led_blinky --build-dir build\ra4m2_led_blinky
```


### 9.5 烧录工程

```powershell
west flash --build-dir build\ra4m2_led_blinky --runner pyocd
```

### 9.6 重复构建与烧录推荐命令

```powershell
cd D:\Zephyr
zephyrproject\.venv\Scripts\Activate.ps1
cd D:\Zephyr\zephyrproject
$env:ZEPHYR_TOOLCHAIN_VARIANT="gnuarmemb"
$env:GNUARMEMB_TOOLCHAIN_PATH="D:\DevEnv\DevEnv\DevEnv\GNU-tools-for-STM32"
west build -p always -b ek_ra4m2 apps\ra4m2_led_blinky --build-dir build\ra4m2_led_blinky
west flash --build-dir build\ra4m2_led_blinky --runner pyocd
```

---

## 十、构建产物位置

构建成功后，主要产物位于：

- `D:\Zephyr\zephyrproject\build\ra4m2_led_blinky\zephyr\zephyr.elf`
- `D:\Zephyr\zephyrproject\build\ra4m2_led_blinky\zephyr\zephyr.hex`
- `D:\Zephyr\zephyrproject\build\ra4m2_led_blinky\zephyr\zephyr.bin`

其中：

- `zephyr.elf` 适合调试
- `zephyr.hex` 适合烧录
- `zephyr.bin` 可用于部分下载工具或后续封装

---

## 十一、评测结果分析

本次评测说明，`RA4M2` 使用 `Zephyr` 开发是完全可行的，尤其在以下方面表现较好：

- 官方板级支持现成可用
- GPIO 类基础外设适配成本低
- 命令行构建流程清晰
- pyOCD 安装好目标 pack 后可以正常烧录

但同时也有一些需要注意的地方：

- `west` 需要严格在 workspace 语义下使用
- `pyOCD` 默认不一定包含全部器件支持，需要额外安装 `CMSIS-Pack`
- `Zephyr SDK`、`pyOCD`、`GNU Arm Toolchain` 三者的组合关系要理顺

综合来看：

- 对于基础验证、可移植工程、团队协作，`Zephyr` 很有优势
- 对于复杂外设、厂商专有中间件、触摸等功能，仍需进一步评估适配成本

---

## 十二、最终结论

本次评测成功完成了 `RA4M2` 在 `Zephyr` 下的最小开发验证。

结论如下：

- `RA4M2` 可以使用 `Zephyr` 进行开发
- `ek_ra4m2` 官方板级支持可用
- 基于 GPIO 的 LED 闪烁程序可以成功构建
- 使用 `pyOCD + DAPLink` 并安装 `Renesas.RA_DFP` 后，可以成功完成烧录

因此，综合来看，`RA4M2` 具备使用 `Zephyr` 进行后续应用开发的基础条件。

