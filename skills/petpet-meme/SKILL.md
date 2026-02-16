---
name: petpet-meme
description: 生成 Petpet 摸头表情包
---

# Petpet 表情包生成技能

> 将图片转换为可爱的 Petpet 摸头动画效果

## 使用方法

```bash
# 生成 petpet 表情包
openclaw run skill:petpet-meme --input ~/image.jpg --output ~/petpet.gif
```

## 效果说明

Petpet 效果特点：
- 图片被温柔"揉捏"的动画
- 5-10帧轻微变形（压扁/拉伸）
- 循环播放产生"摸头"感
- 适合表情包使用

## 技术实现

使用 Python + Pillow：

```python
from PIL import Image, ImageDraw
import numpy as np

def create_petpet(input_path, output_path):
    # 打开原图
    img = Image.open(input_path)
    
    # 调整为正方形
    size = min(img.size)
    img = img.crop((0, 0, size, size))
    img = img.resize((256, 256))
    
    frames = []
    
    # 生成5帧变形动画
    for i in range(5):
        # 计算变形参数
        squeeze = 0.8 + 0.2 * np.sin(i * np.pi / 2.5)
        
        # 垂直压扁
        new_height = int(256 * squeeze)
        frame = img.resize((256, new_height), Image.Resampling.LANCZOS)
        
        # 创建新画布并居中
        new_frame = Image.new('RGBA', (256, 256), (255, 255, 255, 0))
        y_offset = (256 - new_height) // 2
        new_frame.paste(frame, (0, y_offset))
        
        frames.append(new_frame)
    
    # 添加反向帧形成循环
    frames.extend(frames[-2:0:-1])
    
    # 保存为 GIF
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=100,  # 100ms per frame
        loop=0
    )
    
    return output_path
```

## 参数

- `--input`: 输入图片路径（支持 jpg/png）
- `--output`: 输出 GIF 路径
- `--size`: 输出尺寸（默认 256x256）
- `--speed`: 动画速度（默认 100ms/帧）

## 示例

输入：正方形头像照片  
输出：可爱的摸头动图，适合微信/QQ表情包

---

*Version: 1.0*  
*Requires: Python, Pillow, numpy*
