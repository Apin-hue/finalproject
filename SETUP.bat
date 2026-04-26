@echo off
REM ============================================
REM SETUP OTOMATIS DIADOEK RESTAURANT SYSTEM
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ================================================
echo  SETUP OTOMATIS DIADOEK RESTAURANT SYSTEM
echo ================================================
echo.

REM Check if Node.js is installed
echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js not found. Downloading and installing...
    cd /d "%TEMP%"
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile 'node-installer.msi'}"
    
    echo Installing Node.js...
    msiexec.exe /i "node-installer.msi" /quiet /norestart
    
    REM Wait for installation
    timeout /t 10 /nobreak
    
    REM Delete installer
    del "node-installer.msi"
    
    REM Refresh PATH
    for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH') do set "PATH=%%B"
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
    echo Node.js found: !NODE_VER!
)

echo.
echo [2/3] Installing dependencies...
cd /d "%~dp0"

if not exist "node_modules" (
    call npm install
) else (
    echo Dependencies already installed
)

echo.
echo [3/3] Creating database folder...
if not exist "db" mkdir db

echo.
echo ================================================
echo  INSTALLATION COMPLETE - STARTING APPLICATION
echo ================================================
echo.
echo URL: http://localhost:3000
echo Health Check: http://localhost:3000/health
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
