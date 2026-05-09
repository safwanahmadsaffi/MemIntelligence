@echo off
title AgentFlow Setup

echo.
echo  ====================================================
echo   AgentFlow - See Every Cent of Intelligence
echo   One-Click Setup Script
echo  ====================================================
echo.

echo  [1/3] Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  ERROR: Node.js is not installed!
    echo  Download from: https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do echo  Found Node.js %%v
echo.

echo  [2/3] Installing dependencies...
call npm install --loglevel=error
if %ERRORLEVEL% NEQ 0 (
    echo  Retrying...
    call npm install --loglevel=error
)
echo  Done.
echo.

echo  [3/3] Starting AgentFlow...
echo.
echo  ====================================================
echo   Server starting at http://localhost:3000
echo.
echo   Landing:    http://localhost:3000
echo   Dashboard:  http://localhost:3000/dashboard
echo   Tasks:      http://localhost:3000/dashboard/tasks
echo   Explorer:   http://localhost:3000/dashboard/explorer
echo   Demo Panel: http://localhost:3000/dashboard/demo
echo.
echo   Press Ctrl+C to stop.
echo  ====================================================
echo.

start "" cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000"

call npx next dev
