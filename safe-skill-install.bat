@echo off
REM 安全技能安装脚本
REM 使用方法: safe-skill-install.bat <技能名称>

setlocal enabledelayedexpansion

echo ========================================
echo        技能安全安装工具
echo ========================================
echo.

if "%1"=="" (
    echo 错误: 请提供技能名称
    echo 使用方法: safe-skill-install.bat <技能名称>
    exit /b 1
)

set SKILL_NAME=%1
set SKILL_URL=%2

echo 正在检查技能: %SKILL_NAME%
echo.

REM 运行安全检查
echo [安全检查] 正在验证技能安全性...
python skill-safety-check.py "%SKILL_NAME%" "%SKILL_URL%"

if errorlevel 1 (
    echo.
    echo [错误] 安全检查失败，安装已取消
    exit /b 1
)

echo.
echo [安全检查] 通过！
echo.

REM 确认安装
set /p CONFIRM="是否确认安装技能 '%SKILL_NAME%'? (y/n): "
if /i not "!CONFIRM!"=="y" (
    echo 安装已取消
    exit /b 0
)

echo.
echo [安装] 正在安装技能: %SKILL_NAME%
echo.

REM 实际安装命令
npx skills add %SKILL_NAME% -g -y

if errorlevel 1 (
    echo.
    echo [错误] 技能安装失败
    exit /b 1
)

echo.
echo [完成] 技能 '%SKILL_NAME%' 已成功安装！
echo.

REM 显示已安装的技能列表
echo [信息] 当前已安装的技能:
npx skills list -g

endlocal