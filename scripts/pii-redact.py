#!/usr/bin/env python3
"""
简单的 PII 脱敏脚本
不依赖 spacy，用正则表达式实现基础脱敏
"""

import re
import sys

def redact_pii(text):
    """脱敏处理"""
    
    # 邮箱脱敏
    text = re.sub(r'[\w.-]+@[\w.-]+\.\w+', '<EMAIL>', text)
    
    # 电话脱敏
    text = re.sub(r'1[3-9]\d{9}', '<PHONE>', text)  # 手机号
    text = re.sub(r'\d{3,4}[-\s]?\d{7,8}', '<PHONE>', text)  # 固定电话
    
    # 身份证脱敏
    text = re.sub(r'\d{17}[\dXx]', '<ID_CARD>', text)
    
    # 银行卡脱敏
    text = re.sub(r'\d{16,19}', '<BANK_CARD>', text)
    
    # 姓名脱敏（常见姓氏 + 名字）
    names = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', 
             '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗',
             '郑', '梁', '谢', '宋', '唐', '许', '韩', '邓', '冯', '曹',
             '彭', '曾', '肖', '田', '董', '潘', '袁', '蔡', '余', '于',
             '叶', '杜', '魏', '程', '吕', '丁', '沈', '任', '姚', '卢',
             '傅', '钟', '姜', '崔', '谭', '廖', '范', '汪', '陆', '金',
             '石', '戴', '贾', '韦', '夏', '邱', '方', '侯', '邹', '熊']
    
    for name in names:
        # 2字名字
        text = re.sub(f'{name}[{name}]', f'<NAME>{name[-1]}>', text)
    
    return text

if __name__ == '__main__':
    if len(sys.argv) > 1:
        # 从命令行参数读取
        text = ' '.join(sys.argv[1:])
    else:
        # 从 stdin 读取
        text = sys.stdin.read()
    
    print(redact_pii(text))
