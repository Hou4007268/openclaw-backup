# Simple safe skill installer
param($skillName)

Write-Host "=== Safe Skill Installer ===" -ForegroundColor Cyan
Write-Host "Skill: $skillName"
Write-Host ""

# Run safety check
Write-Host "Running safety check..." -ForegroundColor Yellow
python skill-safety-check.py $skillName

if ($LASTEXITCODE -ne 0) {
    Write-Host "Safety check FAILED! Installation cancelled." -ForegroundColor Red
    exit 1
}

Write-Host "Safety check PASSED!" -ForegroundColor Green
Write-Host ""

# Confirm installation
$confirm = Read-Host "Install skill '$skillName'? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Installation cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Installing skill: $skillName" -ForegroundColor Yellow
npx skills add $skillName -g -y

if ($LASTEXITCODE -ne 0) {
    Write-Host "Installation FAILED!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Skill '$skillName' installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Installed skills:" -ForegroundColor Cyan
npx skills list -g