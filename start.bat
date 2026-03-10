@echo off
echo ===================================================
echo AERIAL PROGRESS MONITORING SYSTEM - STARTUP SCRIPT
echo ===================================================
echo.

:: Check for node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    pause
    exit /b
)

:: Clear existing ports 5000 and 5173/5174
echo [INFO] Cleaning up dangling ports (5000, 5173, 5174)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5174" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

:: Check for concurrently
call npm ls -g concurrently >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing 'concurrently' globally...
    call npm install -g concurrently
)

echo [INFO] Starting Backend and Frontend Servers...
echo.

:: Use concurrently to run both in the same terminal, with prefixes
concurrently -n "BACKEND,FRONTEND" -c "cyan,yellow" "cd backend && call npm run dev" "cd frontend && call npm run dev"

pause
