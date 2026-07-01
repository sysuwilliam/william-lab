---
title: "YOLO-LEARN"
description: "YOLO 目标检测学习、训练和部署实验记录。"
date: 2026-06-10
tags: ["vision", "yolo", "python"]
draft: false
repo: "https://github.com/sysuwilliam/YOLO-LEARN"
status: "learning"
stack: ["Python", "YOLO", "Computer Vision"]
---

用于记录 YOLO 目标检测相关的学习过程、数据处理、训练实验和部署尝试。

## Links

- [GitHub repository](https://github.com/sysuwilliam/YOLO-LEARN)

## Repository README

> Synced from [README.md](https://github.com/sysuwilliam/YOLO-LEARN/blob/main/README.md) on 2026-07-01.

# YOLO-LEARN

YOLO learning, dataset layout, and training experiment records.

This repository is a compact computer-vision learning workspace built around
Ultralytics YOLO11. It keeps local dataset examples, training scripts, model
weights, and selected training outputs for COCO8 / COCO128 experiments.

## Repository Layout

```text
YOLO-LEARN/
├─ scripts/
│  ├─ coco8_train.py
│  └─ coco128_train.py
├─ datasets/
│  ├─ README.md
│  ├─ coco8/
│  └─ coco128/
├─ models/
│  └─ yolo11n/
├─ runs/
│  ├─ coco8_yolo11n/
│  ├─ coco128_yolo11n/
│  └─ coco128_yolo11n2/
└─ README.md
```

## Environment

Recommended Python packages:

```shell
pip install ultralytics
```

If you use a virtual environment, activate it before running the training
scripts. The scripts set `YOLO_CONFIG_DIR` to the repository-local
`.ultralytics/` directory so that Ultralytics configuration files do not leak
into your global user profile.

## Training Scripts

### COCO8 Smoke Test

```shell
python scripts/coco8_train.py
```

Configuration:

| Item | Value |
| --- | --- |
| Model | `models/yolo11n/yolo11n.pt` |
| Dataset | `datasets/coco8/data.yaml` |
| Epochs | 10 |
| Image size | 640 |
| Batch size | 2 |
| Workers | 0 |
| Output | `runs/coco8_yolo11n/` |

This script is intended as a quick sanity check for the local YOLO environment.

### COCO128 Training Run

```shell
python scripts/coco128_train.py
```

Configuration:

| Item | Value |
| --- | --- |
| Model | `models/yolo11n/yolo11n.pt` |
| Dataset | `datasets/coco128/coco128.yaml` |
| Epochs | 100 |
| Image size | 640 |
| Batch size | 4 |
| Cache | RAM |
| Workers | 4 |
| Output | `runs/coco128_yolo11n/` or `runs/coco128_yolo11n2/` |

The script validates that `datasets/coco128/images/train2017` and
`datasets/coco128/labels/train2017` exist before training. This avoids a common
Ultralytics issue where an incomplete non-empty dataset directory prevents
automatic extraction.

## Dataset Layout

The preferred layout is:

```text
datasets/
└─ dataset_name/
   ├─ data.yaml
   ├─ classes.txt
   ├─ images/
   │  ├─ train/
   │  ├─ val/
   │  └─ test/
   └─ labels/
      ├─ train/
      ├─ val/
      └─ test/
```

YOLO training uses `data.yaml` plus the `images/` and `labels/` folders.
`classes.txt` is mainly kept for labeling tools such as labelImg.

## Recorded Results

The repository keeps selected outputs under `runs/` for review.

| Run | Dataset | Epochs | Final precision | Final recall | Final mAP50 | Final mAP50-95 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `coco8_yolo11n` | COCO8 | 10 | 0.66206 | 0.85000 | 0.82418 | 0.62066 |
| `coco128_yolo11n` | COCO128 | 10 | 0.61244 | 0.64432 | 0.67037 | 0.49911 |
| `coco128_yolo11n2` | COCO128 | 100 | 0.84752 | 0.76994 | 0.84554 | 0.67984 |

Useful output files include:

- `results.csv`: epoch-by-epoch metrics
- `results.png`: training curves
- `confusion_matrix.png`
- `BoxF1_curve.png`, `BoxP_curve.png`, `BoxR_curve.png`, `BoxPR_curve.png`
- `weights/best.pt` and `weights/last.pt`

## Notes

- This is a learning repository, not a production inference package.
- Model weights and run outputs are intentionally kept so training results can
  be reviewed later.
- If you adapt the scripts to a custom dataset, update `DATA_PATH`, class
  names, and dataset folders first.
