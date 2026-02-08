@echo off
chcp 65001 >nul
echo ==========================================
echo    AI API服务一键启动脚本
echo ==========================================
echo.

:: 检查Docker是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Docker未安装，请先安装Docker
    exit /b 1
)

:: 检查docker-compose.yml是否存在
if not exist "docker-compose-ai-apis.yml" (
    echo [错误] 未找到 docker-compose-ai-apis.yml 文件
    echo 请确保文件在当前目录
    exit /b 1
)

echo [1/3] 正在创建模型目录...
if not exist "models" mkdir models
echo      ✓ 模型目录已创建

echo.
echo [2/3] 正在启动AI API服务...
docker-compose -f docker-compose-ai-apis.yml up -d
echo      ✓ 服务启动命令已执行

echo.
echo [3/3] 等待服务启动...
timeout /t 5 /nobreak >nul

echo.
echo ==========================================
echo    服务状态检查
echo ==========================================
echo.

echo 检查 LocalAI (端口8080)...
curl -s http://localhost:8080/readyz >nul 2>&1
if errorlevel 1 (
    echo      ⚠ LocalAI 启动中，请稍后再检查
) else (
    echo      ✓ LocalAI 运行正常
)

echo 检查 kimi-free-api (端口8000)...
curl -s http://localhost:8000/v1/models >nul 2>&1
if errorlevel 1 (
    echo      ⚠ kimi-free-api 启动中，请稍后再检查
) else (
    echo      ✓ kimi-free-api 运行正常
)

echo 检查 qwen-free-api (端口8001)...
curl -s http://localhost:8001/v1/models >nul 2>&1
if errorlevel 1 (
    echo      ⚠ qwen-free-api 启动中，请稍后再检查
) else (
    echo      ✓ qwen-free-api 运行正常
)

echo.
echo ==========================================
echo    服务访问地址
echo ==========================================
echo.
echo LocalAI:      http://localhost:8080
echo kimi-free-api: http://localhost:8000
echo qwen-free-api: http://localhost:8001
echo.
echo ==========================================
echo    下一步操作
echo ==========================================
echo.
echo 1. 获取API Token:
echo    - Kimi: 访问 https://kimi.moonshot.cn
echo    - Qwen: 访问 https://tongyi.aliyun.com
echo.
echo 2. 配置子代理:
echo    编辑 .credentials/kimi-token.txt
echo    编辑 .credentials/qwen-token.txt
echo.
echo 3. 查看日志:
echo    docker-compose -f docker-compose-ai-apis.yml logs -f
echo.
echo 4. 停止服务:
echo    docker-compose -f docker-compose-ai-apis.yml down
echo.
pause
