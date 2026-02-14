# 安全技能安装脚本 (PowerShell)
# 使用方法: .\Safe-Skill-Install.ps1 <技能名称>

param(
    [Parameter(Mandatory=$true)]
    [string]$SkillName,
    
    [string]$SkillUrl
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "        技能安全安装工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "正在检查技能: $SkillName" -ForegroundColor Yellow
Write-Host ""

# 运行安全检查
Write-Host "[安全检查] 正在验证技能安全性..." -ForegroundColor Yellow
$safetyResult = python skill-safety-check.py $SkillName $SkillUrl

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[错误] 安全检查失败，安装已取消" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[安全检查] 通过！" -ForegroundColor Green
Write-Host ""

# 确认安装
$confirm = Read-Host "是否确认安装技能 '$SkillName'? (y/n)"
if ($confirm -ne "y") {
    Write-Host "安装已取消" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "[安装] 正在安装技能: $SkillName" -ForegroundColor Yellow
Write-Host ""

# 实际安装命令
npx skills add $SkillName -g -y

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[错误] 技能安装失败" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[完成] 技能 '$SkillName' 已成功安装！" -ForegroundColor Green
Write-Host ""

# 显示已安装的技能列表
Write-Host "[信息] 当前已安装的技能:" -ForegroundColor Cyan
npx skills list -g