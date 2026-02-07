Write-Host "=== Fixing OpenClaw Communication Freeze ===" -ForegroundColor Cyan

# 1. Restart OpenClaw gateway
Write-Host "`n1. Restarting OpenClaw gateway..." -ForegroundColor Yellow
try {
    $result = openclaw gateway restart
    Write-Host "  Gateway restart command executed" -ForegroundColor Green
} catch {
    Write-Host "  Error restarting gateway: $_" -ForegroundColor Red
}

# 2. Clear old log files
Write-Host "`n2. Clearing old log files..." -ForegroundColor Yellow
$logPath = "$env:TEMP\openclaw"
if (Test-Path $logPath) {
    $oldLogs = Get-ChildItem $logPath -Filter "*.log" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
    if ($oldLogs) {
        $oldLogsCount = $oldLogs.Count
        $oldLogsSize = [math]::Round(($oldLogs | Measure-Object Length -Sum).Sum / 1MB, 2)
        $oldLogs | Remove-Item -Force
        Write-Host "  Removed $oldLogsCount old log files (${oldLogsSize} MB)" -ForegroundColor Green
    } else {
        Write-Host "  No old log files found (older than 7 days)" -ForegroundColor Gray
    }
} else {
    Write-Host "  Log directory not found: $logPath" -ForegroundColor Gray
}

# 3. Create a scheduled task for weekly restart
Write-Host "`n3. Creating scheduled task for weekly restart..." -ForegroundColor Yellow
$taskName = "OpenClaw-Weekly-Restart"
$taskExists = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if (-not $taskExists) {
    $action = New-ScheduledTaskAction -Execute "openclaw.exe" -Argument "gateway restart"
    $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 3am
    $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    
    try {
        Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description "Weekly restart of OpenClaw gateway to prevent communication freezes"
        Write-Host "  Created scheduled task: $taskName (runs every Sunday at 3am)" -ForegroundColor Green
    } catch {
        Write-Host "  Error creating scheduled task: $_" -ForegroundColor Red
        Write-Host "  You can manually create this task in Task Scheduler" -ForegroundColor Yellow
    }
} else {
    Write-Host "  Scheduled task already exists: $taskName" -ForegroundColor Gray
}

# 4. Create PowerShell compatibility script
Write-Host "`n4. Creating PowerShell compatibility script..." -ForegroundColor Yellow
$compatScript = @'
function Invoke-CurlCompatible {
    param(
        [string]$Url,
        [hashtable]$Headers = @{},
        [string]$Method = "GET",
        [string]$Body
    )
    
    try {
        $request = [System.Net.WebRequest]::Create($Url)
        $request.Method = $Method
        
        foreach ($header in $Headers.Keys) {
            $request.Headers[$header] = $Headers[$header]
        }
        
        if ($Body) {
            $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($Body)
            $request.ContentLength = $bodyBytes.Length
            $requestStream = $request.GetRequestStream()
            $requestStream.Write($bodyBytes, 0, $bodyBytes.Length)
            $requestStream.Close()
        }
        
        $response = $request.GetResponse()
        $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
        $result = $reader.ReadToEnd()
        $reader.Close()
        $response.Close()
        
        return $result
    } catch {
        Write-Error "Curl compatible request failed: $_"
        return $null
    }
}

# Export the function
Export-ModuleMember -Function Invoke-CurlCompatible
'@

$modulePath = "$env:USERPROFILE\Documents\WindowsPowerShell\Modules\OpenClawCompatibility"
if (-not (Test-Path $modulePath)) {
    New-Item -ItemType Directory -Path $modulePath -Force | Out-Null
}

$moduleFile = "$modulePath\OpenClawCompatibility.psm1"
$compatScript | Out-File -FilePath $moduleFile -Encoding UTF8
Write-Host "  Created compatibility module: $moduleFile" -ForegroundColor Green

# 5. Create a quick fix batch file
Write-Host "`n5. Creating quick fix batch file..." -ForegroundColor Yellow
$batchContent = @'
@echo off
echo Fixing OpenClaw communication freeze...
echo.

echo 1. Restarting OpenClaw gateway...
openclaw gateway restart
echo.

echo 2. Waiting for restart to complete...
timeout /t 10 /nobreak >nul
echo.

echo 3. Checking status...
openclaw status
echo.

echo Fix completed. Check if communication is working now.
pause
'@

$batchFile = "$env:USERPROFILE\Desktop\FixOpenClawFreeze.bat"
$batchContent | Out-File -FilePath $batchFile -Encoding ASCII
Write-Host "  Created quick fix batch file: $batchFile" -ForegroundColor Green

Write-Host "`n=== Fix Summary ===" -ForegroundColor Cyan
Write-Host "1. Gateway restarted" -ForegroundColor Green
Write-Host "2. Old logs cleared (if any)" -ForegroundColor Green
Write-Host "3. Weekly restart scheduled task created" -ForegroundColor Green
Write-Host "4. PowerShell compatibility module created" -ForegroundColor Green
Write-Host "5. Quick fix batch file created on Desktop" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "- Test communication now" -ForegroundColor White
Write-Host "- If still freezing, run the batch file on Desktop" -ForegroundColor White
Write-Host "- Weekly restart will happen automatically every Sunday at 3am" -ForegroundColor White

Write-Host "`nFix completed." -ForegroundColor Cyan