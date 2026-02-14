# Windows Maintenance Skill

## Purpose
Diagnose and fix common Windows system issues including blue screen errors, performance problems, and system health checks.

## When to Use
- System crashes or blue screen errors
- Performance degradation
- Before important work sessions
- Weekly/monthly maintenance

## Files
- `SKILL.md` - This documentation
- `diagnostics.ps1` - System diagnostic commands
- `fixes.ps1` - Common fix procedures

## Quick Start

### Run Diagnostics
```powershell
# PowerShell as Administrator
.\skills\windows-maintenance\diagnostics.ps1
```

### Apply Fixes
```powershell
# PowerShell as Administrator
.\skills\windows-maintenance\fixes.ps1
# Then call specific function: Fix-ServiceIssues
```

## Capabilities

### 1. System Health Check
Quick overview of system status:
- OS version and build
- Memory usage
- Disk space
- Critical errors in event log

**Commands used:**
```powershell
Get-ComputerInfo
Get-CimInstance Win32_OperatingSystem
Get-Volume
Get-EventLog -LogName System -EntryType Error
```

### 2. Blue Screen Diagnosis
Analyze BSOD (Blue Screen of Death) errors:
- Check minidump files location: `C:\Windows\Minidump\`
- Full memory dump: `C:\Windows\MEMORY.DMP`
- Identify error codes (0x133, 0x7E, etc.)
- Find patterns in crashes
- Clean up dump files to free space

**Common BSOD Codes:**
| Code | Name | Common Cause |
|------|------|--------------|
| 0x133 | DPC_WATCHDOG_VIOLATION | Network/storage drivers |
| 0x7E | SYSTEM_THREAD_EXCEPTION | Driver/hardware issues |
| 0x50 | PAGE_FAULT_IN_NONPAGED_AREA | RAM/driver issues |
| 0x1E | KMODE_EXCEPTION | Driver compatibility |

### 3. Common Fixes

#### Service Issues
```powershell
# Fix services stuck in auto-start but stopped
Set-Service luafv -StartupType Manual
```

#### Disk Cleanup
```powershell
# Clean dump files (safe, requires confirmation)
Remove-Item C:\Windows\MEMORY.DMP -Force
Remove-Item C:\Windows\Minidump\*.dmp -Force
```

#### Network Reset
```powershell
netsh winsock reset
netsh int ip reset
ipconfig /flushdns
# Restart required
```

#### System File Repair
```powershell
# Step 1: Check image health
DISM /Online /Cleanup-Image /ScanHealth

# Step 2: Repair if needed
DISM /Online /Cleanup-Image /RestoreHealth

# Step 3: Fix system files
SFC /scannow
```

## Usage Examples

### Example 1: Quick Health Check
```
Check my Windows system health
```
Agent will run diagnostics and report:
- OS version and uptime
- Memory and disk status
- Recent critical errors

### Example 2: Blue Screen Analysis
```
I got a blue screen error, help me diagnose
```
Agent will:
1. Check event logs for BugCheck entries
2. List minidump files with dates
3. Identify error patterns
4. Recommend driver updates
5. Generate detailed report

### Example 3: Full Maintenance
```
Run full Windows maintenance
```
Agent will:
1. Run complete diagnostics
2. Identify issues
3. Apply safe fixes automatically
4. Recommend manual actions
5. Save report to notes/

## Output
Always generates:
1. Console summary of findings
2. Detailed report saved to `notes/windows-maintenance-YYYY-MM-DD.md`
3. Actionable recommendations with priority levels

## Safety Notes
- ✅ Read-only checks by default
- ⚠️ Destructive operations (cleanup) require explicit confirmation
- ⚠️ Driver updates are recommended, not automatic
- ❌ Registry changes are manual-only
- ❌ BIOS/UEFI changes not supported

## Troubleshooting Guide

### If diagnostics.ps1 won't run
```powershell
# Check execution policy
Get-ExecutionPolicy

# Temporarily allow (for this session)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### If commands return access denied
- Run PowerShell as Administrator
- Right-click PowerShell → Run as Administrator

### If DISM fails with "source files not found"
```powershell
# Use Windows installation media as source
DISM /Online /Cleanup-Image /RestoreHealth /Source:WIM:X:\sources\install.wim:1
```

## Limitations
- Cannot install drivers automatically (security)
- Cannot access BIOS/UEFI settings
- Hardware failures require physical inspection
- Some fixes require system restart

## Maintenance Schedule

| Frequency | Task | Command/File |
|-----------|------|--------------|
| Weekly | Quick health check | diagnostics.ps1 |
| Monthly | Clean temp files | fixes.ps1 → Clean-TempFiles |
| After BSOD | Full diagnosis | Full analysis + report |
| Quarterly | Deep maintenance | DISM + SFC + driver updates |
