---
title: "Zephyr开发RA4M2双工程总结"
description: "Zephyr 是面向资源受限嵌入式设备的开源实时操作系统，官方文档明确指出它适用于从简单传感器、LED 设备到更复杂的 IoT 控制器场景。12"
date: 2026-06-23
tags: ["RA4M2", "Renesas", "Zephyr", "RTOS"]
cover: "/media/articles/ra4m2-sensor/01/IMG_20260414_223459-32c5bc54511e.jpg"
coverAlt: "RA4M2-SENSOR development board on a desk"
draft: false
series: "RA4M2-SENSOR"
board: "RA4M2-SENSOR"
sourceUrl: "https://github.com/sysuwilliam/RA4M2-SENSOR/blob/main/%E6%8A%A5%E5%91%8A/5.Zephyr%E5%BC%80%E5%8F%91RA4M2%E5%8F%8C%E5%B7%A5%E7%A8%8B%E6%80%BB%E7%BB%93.md"
order: 5
---
[原始报告](https://github.com/sysuwilliam/RA4M2-SENSOR/blob/main/%E6%8A%A5%E5%91%8A/5.Zephyr%E5%BC%80%E5%8F%91RA4M2%E5%8F%8C%E5%B7%A5%E7%A8%8B%E6%80%BB%E7%BB%93.md)

# Zephyr 开发 RA4M2 LED 工程总结

## 1. Zephyr 是什么

Zephyr 是面向资源受限嵌入式设备的开源实时操作系统，官方文档明确指出它适用于从简单传感器、LED 设备到更复杂的 IoT 控制器场景。[1][2]

## 2. 优势

- 结构清晰，易维护
- 板级配置规范
- 构建和烧录流程统一
- 适合课程评测和后续扩展

## 3. 官方依据

- 官方介绍页强调了 `small-footprint kernel`、`Devicetree Support`、`Optimized Device Driver Model` 和跨架构支持。[1]
- 官方 Getting Started Guide 给出了标准的 `west build` 和 `west flash` 流程，也说明了 `-p always` 适合新手和首次构建。[2]
- Zephyr 支持 Windows 原生开发环境，适合本次在 Windows 下完成安装、构建和烧录。[1]

### 官方参考配图

- Zephyr 官方介绍页: [Introduction](https://docs.zephyrproject.org/latest/introduction/index.html)
- Zephyr 官方入门页: [Getting Started Guide](https://docs.zephyrproject.org/latest/develop/getting_started/index.html)
- Blinky 构建示意: [Build the Blinky Sample](https://docs.zephyrproject.org/latest/develop/getting_started/index.html#build-the-blinky-sample)
- 烧录示意: [Flash the Sample](https://docs.zephyrproject.org/latest/develop/getting_started/index.html#flash-the-sample)

## 4. 工程内容

- 本文件仅总结 Zephyr 下的 LED 闪烁工程
- 目标功能为 RA4M2-SENSOR 开发板 3 个用户 LED 周期性翻转

## 5. 目录

- `D:\IEEE Project\评测\RA4M2-SENSOR\zephyr_led_blinky`
- `D:\IEEE Project\评测\RA4M2-SENSOR\zephyr_uart_firewater`

## 6. 工程 1 代码

### `main.c`

```c
#include <zephyr/device.h>
#include <zephyr/devicetree.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/kernel.h>

#define SLEEP_TIME_MS 200

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

### `app.overlay`

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

### `prj.conf`

```conf
CONFIG_GPIO=y
```

## 7. 功能说明

该工程的核心逻辑如下：

- 使用 `gpio_dt_spec` 从设备树中读取 3 个用户 LED 的引脚定义
- 上电后先检查 GPIO 设备是否 ready
- 将 3 个 LED 配置为输出模式
- 在 `while(1)` 循环中依次翻转 LED 电平
- 通过 `k_msleep(200)` 形成稳定可见的闪烁效果

Zephyr 在这里的优势非常明显：

- 应用层代码不需要直接操作复杂寄存器
- 引脚定义放在 `app.overlay` 中，代码与硬件配置分离
- 后续更换 LED 引脚时，只需要改 overlay，不需要重写主逻辑

## 8. 构建与烧录命令

```powershell
cd D:\Zephyr
zephyrproject\.venv\Scripts\Activate.ps1
cd D:\Zephyr\zephyrproject
$env:ZEPHYR_TOOLCHAIN_VARIANT='gnuarmemb'
$env:GNUARMEMB_TOOLCHAIN_PATH='D:\DevEnv\DevEnv\DevEnv\GNU-tools-for-STM32'
west build -p always -b ek_ra4m2 apps\ra4m2_led_blinky --build-dir build\ra4m2_led_blinky
west flash --build-dir build\ra4m2_led_blinky --runner pyocd
```

## 9. 结论

LED 工程已经独立完成，能够在 Zephyr RTOS 下正确驱动 RA4M2-SENSOR 板上的 3 个用户 LED 周期性闪烁，说明该板卡可以正常完成基础 GPIO 类应用开发。

## 参考

- [1] Zephyr Project Documentation - Introduction: https://docs.zephyrproject.org/latest/introduction/index.html
- [2] Zephyr Project Documentation - Getting Started Guide: https://docs.zephyrproject.org/latest/develop/getting_started/index.html

