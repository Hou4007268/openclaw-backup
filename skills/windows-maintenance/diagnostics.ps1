# Windows System Diagnostics Script
# Run these commands in PowerShell as Administrator

# === 1. SYSTEM OVERVIEW ===
Write-Host "=== SYSTEM OVERVIEW ===" -ForegroundColor Green
Get-ComputerInfo | Select-Object WindowsVersion, WindowsBuildLabEx, TotalPhysicalMemory, CsProcessors
Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory,TotalVisibleMemorySize

# === 2. DISK HEALTH ===
Write-Host "`n=== DISK USAGE ===" -ForegroundColor Green
Get-Volume | Where-Object {$_.DriveLetter} | Select-Object DriveLetter,FileSystemLabel,@{Name="Used%";Expression={[math]::Round((($_.Size - $_.SizeRemaining) / $_.Size) * 100, 1)}}

# === 3. CRITICAL ERRORS (Last 24 hours) ===
Write-Host "`n=== CRITICAL ERRORS (24h) ===" -ForegroundColor Red
$startTime = (Get-Date).AddHours(-24)
Get-EventLog -LogName System -After $startTime -EntryType Error -ErrorAction SilentlyContinue | 
    Select-Object TimeGenerated,Source,EventID | Format-Table -AutoSize

# === 4. BLUE SCREEN CHECK ===
Write-Host "`n=== BLUE SCREEN HISTORY ===" -ForegroundColor Red
Get-EventLog -LogName System -EntryType Error -ErrorAction SilentlyContinue | 
    Where-Object {$_.Source -eq "BugCheck"} | 
    Select-Object TimeGenerated,Message -First 5

# === 5. DUMP FILES ===
Write-Host "`n=== DUMP FILES ===" -ForegroundColor Yellow
Get-ChildItem C:\Windows\Minidump\ -ErrorAction SilentlyContinue | 
    Select-Object Name,LastWriteTime,@{Name="SizeMB";Expression={[math]::Round($_.Length/1MB,2)}} |
    Sort-Object LastWriteTime -Descending

# === 6. SERVICE ISSUES ===
Write-Host "`n=== SERVICE PROBLEMS ===" -ForegroundColor Yellow
Get-Service | Where-Object {$_.Status -eq 'Stopped' -and $_.StartType -eq 'Automatic'} | 
    Select-Object Name,DisplayName,Status | Format-Table -AutoSize

# === 7. NETWORK ADAPTERS ===
Write-Host "`n=== NETWORK ADAPTERS ===" -ForegroundColor Cyan
Get-PnpDevice -Class Net | Select-Object Name,Status,DriverVersion | Format-Table -AutoSize

# === 8. CLEANUP RECOMMENDATIONS ===
Write-Host "`n=== CLEANUP OPPORTUNITIES ===" -ForegroundColor Cyan
$memDump = Get-Item C:\Windows\MEMORY.DMP -ErrorAction SilentlyContinue
if ($memDump) {
    $sizeMB = [math]::Round($memDump.Length/1MB,2)
    Write-Host "MEMORY.DMP: $sizeMB MB (can be deleted if not analyzing crashes)" -ForegroundColor Yellow
}
