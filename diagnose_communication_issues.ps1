# 诊断 OpenClaw 沟通卡死问题
Write-Host "=== OpenClaw 沟通卡死诊断 ===" -ForegroundColor Cyan

# 1. 检查系统资源
Write-Host "`n1. 系统资源检查:" -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "找到 $($nodeProcesses.Count) 个 Node.js 进程:" -ForegroundColor Green
    $nodeProcesses | ForEach-Object {
        Write-Host "  PID: $($_.Id), 内存: $([math]::Round($_.WorkingSet64/1MB, 2)) MB, CPU: $([math]::Round($_.CPU, 2))%" -ForegroundColor Gray
    }
} else {
    Write-Host "未找到 Node.js 进程" -ForegroundColor Red
}

# 2. 检查网络连接
Write-Host "`n2. 网络连接检查:" -ForegroundColor Yellow
$connections = netstat -an | Select-String ":18789"
if ($connections) {
    Write-Host "OpenClaw 网关连接状态:" -ForegroundColor Green
    $connections | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Gray
    }
    
    $timeWaitCount = ($connections | Select-String "TIME_WAIT").Count
    if ($timeWaitCount -gt 10) {
        Write-Host "警告: 发现 $timeWaitCount 个 TIME_WAIT 连接，可能存在连接泄漏" -ForegroundColor Red
    }
} else {
    Write-Host "未找到网关连接" -ForegroundColor Red
}

# 3. 检查磁盘空间
Write-Host "`n3. 磁盘空间检查:" -ForegroundColor Yellow
Get-PSDrive C | ForEach-Object {
    $freeGB = [math]::Round($_.Free / 1GB, 2)
    $usedGB = [math]::Round(($_.Used / 1GB), 2)
    $totalGB = [math]::Round(($_.Free + $_.Used) / 1GB, 2)
    $percentFree = [math]::Round(($_.Free / ($_.Free + $_.Used)) * 100, 2)
    
    Write-Host "  C盘: 已用 ${usedGB}GB / 总共 ${totalGB}GB (可用 ${freeGB}GB, ${percentFree}%)" -ForegroundColor Gray
    
    if ($percentFree -lt 10) {
        Write-Host "警告: 磁盘空间不足，可能影响性能" -ForegroundColor Red
    }
}

# 4. 检查日志文件大小
Write-Host "`n4. 日志文件检查:" -ForegroundColor Yellow
$logPath = "$env:TEMP\openclaw"
if (Test-Path $logPath) {
    $logFiles = Get-ChildItem $logPath -Filter "*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 5
    
    if ($logFiles) {
        Write-Host "最近的日志文件:" -ForegroundColor Green
        $logFiles | ForEach-Object {
            $sizeMB = [math]::Round($_.Length / 1MB, 2)
            Write-Host "  $($_.Name): ${sizeMB} MB (修改时间: $($_.LastWriteTime))" -ForegroundColor Gray
        }
        
        $largestLog = $logFiles | Sort-Object Length -Descending | Select-Object -First 1
        if ($largestLog.Length -gt 100MB) {
            Write-Host "警告: 日志文件过大 ($([math]::Round($largestLog.Length/1MB, 2)) MB)，可能影响性能" -ForegroundColor Red
        }
    } else {
        Write-Host "未找到日志文件" -ForegroundColor Gray
    }
} else {
    Write-Host "日志目录不存在: $logPath" -ForegroundColor Gray
}

# 5. 检查 PowerShell 执行策略
Write-Host "`n5. PowerShell 执行策略:" -ForegroundColor Yellow
$executionPolicy = Get-ExecutionPolicy
Write-Host "  当前执行策略: $executionPolicy" -ForegroundColor Gray
if ($executionPolicy -eq "Restricted") {
    Write-Host "警告: 执行策略为 Restricted，可能影响脚本执行" -ForegroundColor Red
}

# 6. 建议解决方案
Write-Host "`n=== 建议解决方案 ===" -ForegroundColor Cyan
Write-Host "1. 定期重启 OpenClaw 网关 (每周一次)" -ForegroundColor Green
Write-Host "2. 清理旧的日志文件" -ForegroundColor Green
Write-Host "3. 检查网络连接稳定性" -ForegroundColor Green
Write-Host "4. 确保有足够的磁盘空间" -ForegroundColor Green
Write-Host "5. 考虑升级到最新版本" -ForegroundColor Green

Write-Host "`n诊断完成。" -ForegroundColor Cyan