Write-Host "=== OpenClaw Communication Freeze Diagnosis ===" -ForegroundColor Cyan

# Check Node.js processes
Write-Host "`n1. Node.js Processes:" -ForegroundColor Yellow
tasklist | findstr node

# Check network connections
Write-Host "`n2. Network Connections (port 18789):" -ForegroundColor Yellow
netstat -an | findstr :18789

# Check disk space
Write-Host "`n3. Disk Space (C: drive):" -ForegroundColor Yellow
$disk = Get-PSDrive C
$freeGB = [math]::Round($disk.Free / 1GB, 2)
$usedGB = [math]::Round(($disk.Used / 1GB), 2)
$totalGB = [math]::Round(($disk.Free + $disk.Used) / 1GB, 2)
$percentFree = [math]::Round(($disk.Free / ($disk.Free + $disk.Used)) * 100, 2)
Write-Host "  C: Drive - Used: ${usedGB}GB / Total: ${totalGB}GB (Free: ${freeGB}GB, ${percentFree}%)" -ForegroundColor Gray

# Check log files
Write-Host "`n4. Log Files:" -ForegroundColor Yellow
$logPath = "$env:TEMP\openclaw"
if (Test-Path $logPath) {
    $logFiles = Get-ChildItem $logPath -Filter "*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 3
    if ($logFiles) {
        foreach ($log in $logFiles) {
            $sizeMB = [math]::Round($log.Length / 1MB, 2)
            Write-Host "  $($log.Name): ${sizeMB} MB (Last modified: $($log.LastWriteTime))" -ForegroundColor Gray
        }
    } else {
        Write-Host "  No log files found" -ForegroundColor Gray
    }
} else {
    Write-Host "  Log directory not found: $logPath" -ForegroundColor Gray
}

Write-Host "`n=== Recommendations ===" -ForegroundColor Cyan
Write-Host "1. Restart OpenClaw gateway weekly" -ForegroundColor Green
Write-Host "2. Clear old log files if they are too large" -ForegroundColor Green
Write-Host "3. Check network stability" -ForegroundColor Green
Write-Host "4. Ensure sufficient disk space (>10% free)" -ForegroundColor Green
Write-Host "5. Consider updating to latest version" -ForegroundColor Green

Write-Host "`nDiagnosis complete." -ForegroundColor Cyan