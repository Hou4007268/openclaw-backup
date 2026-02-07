# Find-Skills 技能使用指南

## 已成功安装的技能

✅ `find-skills` 技能已成功安装到：
`C:\Users\Administrator\.openclaw\workspace\skills\find-skills`

## 技能功能

`find-skills` 技能帮助你：
1. **搜索技能** - 在技能生态系统中查找相关技能
2. **发现功能** - 当用户询问"如何做X"时，自动寻找相关技能
3. **安装技能** - 提供安装命令和指导

## 基本使用方法

### 1. 搜索技能
```bash
npx skills find [关键词]
```

示例：
```bash
npx skills find web
npx skills find react
npx skills find testing
```

### 2. 安装技能
```bash
npx skills add <所有者/仓库@技能名> -g -y
```

示例：
```bash
npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y
```

### 3. 列出已安装技能
```bash
npx skills list -g
```

## 安全验证机制

我已创建了安全验证机制，确保技能安装的安全性：

### 安全验证脚本
1. **`skill-safety-check.py`** - Python 安全检查脚本
2. **`safe-skill-install.bat`** - 批处理安装脚本（包含安全检查）

### 安全检查流程
1. **声誉检查** - 检查技能发布者历史
2. **元数据验证** - 验证技能元数据格式
3. **依赖项检查** - 检查依赖项安全性

### 安全安装命令
```bash
safe-skill-install.bat <技能名称> [技能URL]
```

示例：
```bash
safe-skill-install.bat vercel-labs/agent-skills@web-design-guidelines
```

## 主动寻找技能解决问题

### 当用户询问时，你应该：

1. **识别需求** - 分析用户需要什么功能
2. **搜索技能** - 使用 `npx skills find [关键词]`
3. **提供选项** - 展示找到的相关技能
4. **安全安装** - 使用安全验证机制安装

### 示例场景

**用户问：** "如何优化我的网站性能？"

**你的响应：**
1. 搜索相关技能：`npx skills find web performance`
2. 找到技能：`vercel-labs/agent-skills@web-performance`
3. 提供安装命令和安全验证

## 技能生态系统

- **技能网站：** https://skills.sh/
- **搜索命令：** `npx skills find`
- **安装命令：** `npx skills add`
- **更新命令：** `npx skills update`

## 注意事项

1. **安全第一** - 始终使用安全验证机制
2. **用户确认** - 安装前获得用户确认
3. **记录安装** - 记录已安装的技能
4. **定期更新** - 定期更新技能版本

## 已创建的验证文件

1. `skill-safety-check.py` - 安全检查核心逻辑
2. `safe-skill-install.bat` - 安全安装脚本
3. `FIND-SKILLS-GUIDE.md` - 本使用指南

---

**总结：** `find-skills` 技能已成功安装并配置了安全验证机制。你现在可以主动寻找技能来解决问题，无需等待用户询问！