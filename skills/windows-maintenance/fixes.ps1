# Windows System Fixes Script
# Run individual sections as needed

# === FIX 1: Service Startup Issues ===
function Fix-ServiceIssues {
    Write-Host "Fixing service startup issues..." -ForegroundColor Green
    # Common problematic services
    $services = @("luafv", "WbioSrvc", "TabletInputService")
    foreach ($svc in $services) {
        $service = Get-Service $svc -ErrorAction SilentlyContinue
        if ($service -and $service.StartType -eq 'Automatic' -and $service.Status -eq 'Stopped') {
            Write-Host "  Setting $svc to Manual..."
            Set-Service $svc -StartupType Manual -ErrorAction SilentlyContinue
        }
    }
}

# === FIX 2: Clean Temporary Files ===
function Clean-TempFiles {
    Write-Host "Cleaning temporary files..." -ForegroundColor Green
    $tempPaths = @(
        $env:TEMP,
        "C:\Windows\Temp",
        "$env:LOCALAPPDATA\Temp"
    )
    foreach ($path in $tempPaths) {
        if (Test-Path $path) {
            $size = (Get-ChildItem $path -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
            $sizeMB = [math]::Round($size/1MB,2)
            Write-Host "  $path : $sizeMB MB"
        }
    }
    # Note: Actual deletion requires confirmation
}

# === FIX 3: Clean Dump Files ===
function Clean-DumpFiles {
    Write-Host "Cleaning crash dump files..." -ForegroundColor Green
    $dumps = @(
        "C:\Windows\MEMORY.DMP",
        "C:\Windows\Minidump\*.dmp"
    )
    foreach ($dump in $dumps) {
        if (Test-Path $dump) {
            $files = Get-ChildItem $dump
            $totalSize = ($files | Measure-Object -Property Length -Sum).Sum
            $sizeMB = [math]::Round($totalSize/1MB,2)
            Write-Host "  Found dump files: $sizeMB MB"
            # Uncomment to actually delete:
            # Remove-Item $dump -Force
        }
    }
}

# === FIX 4: Reset Network Stack ===
function Reset-Network {
    Write-Host "Resetting network stack (requires restart)..." -ForegroundColor Green
    Write-Host "  Run these commands manually:"
    Write-Host "    netsh winsock reset"
    Write-Host "    netsh int ip reset"
    Write-Host "    ipconfig /flushdns"
    Write-Host "  Then restart computer"
}

# === FIX 5: System File Check ===
function Run-SFC {
    Write-Host "Running System File Checker..." -ForegroundColor Green
    Write-Host "  Execute: SFC /scannow" -ForegroundColor Yellow
    Write-Host "  (This may take 15-30 minutes)"
}

# === FIX 6: DISM Repair ===
function Run-DISM {
    Write-Host "Running DISM repair..." -ForegroundColor Green
    Write-Host "  Step 1: DISM /Online /Cleanup-Image /ScanHealth" -ForegroundColor Yellow
    Write-Host "  Step 2: DISM /Online /Cleanup-Image /RestoreHealth (if issues found)"
    Write-Host "  Step 3: SFC /scannow"
}

# === MENU ===
Write-Host "`n=== Windows System Fixes ===" -ForegroundColor Cyan
Write-Host "1. Fix Service Issues"
Write-Host "2. Check Temp Files (safe)"
Write-Host "3. Clean Dump Files"
Write-Host "4. Reset Network Stack"
Write-Host "5. Run SFC"
Write-Host "6. Run DISM"
Write-Host "`nTo run a fix, call the function: Fix-ServiceIssues"
