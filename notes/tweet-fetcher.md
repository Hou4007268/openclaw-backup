# 推文抓取方法

## 使用 Camofox + fetch_tweet.py

### 命令格式
```bash
python3 ~/projects/openclaw-backup/x-tweet-fetcher/scripts/fetch_tweet.py --url "推文链接" --text-only
```

### 示例
```bash
# 抓取单条推文
python3 ~/projects/openclaw-backup/x-tweet-fetcher/scripts/fetch_tweet.py --url "https://x.com/i/status/2024681566191137181" --text-only

# 抓取用户最近推文
python3 ~/projects/openclaw-backup/x-tweet-fetcher/scripts/fetch_tweet.py --user "bitfish" --limit 5 --text-only
```

### 参数说明
| 参数 | 说明 |
|------|------|
| `--url` | 推文链接 |
| `--user` | 用户名（不含@） |
| `--limit` | 抓取数量 |
| `--text-only` | 纯文本输出 |
| `--pretty` | JSON 格式化输出 |

### 前置条件
确保 Camofox 正在运行：
```bash
cd ~/projects/openclaw-backup/camofox-browser && npm start &
```

---

## PII 脱敏工具

### 本地脚本（已部署）
```bash
# 脱敏处理
python3 ~/projects/openclaw-backup/scripts/pii-redact.py "内容"
```

### 支持的脱敏类型
- 邮箱 → `<EMAIL>`
- 电话 → `<PHONE>`
- 身份证 → `<ID_CARD>`
- 银行卡 → `<BANK_CARD>`
