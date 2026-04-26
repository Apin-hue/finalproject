@echo off
REM Download and setup Node.js portable version
setlocal enabledelayedexpansion

echo.
echo ================================================
echo  SETUP NODEJS PORTABLE - DIADOEK RESTAURANT
echo ================================================
echo.

cd /d "%~dp0"

REM Create a nodejs folder
if not exist "nodejs" mkdir nodejs

echo [1/3] Downloading Node.js portable...
cd /d "%~dp0\nodejs"

REM Download Node.js (Windows x64 portable)
powershell -Command "& { $ProgressPreference = 'SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Write-Host 'Downloading...'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip' -OutFile 'node.zip' }"

if !errorlevel! equ 0 (
    echo Download successful
    
    echo [2/3] Extracting Node.js...
    powershell -Command "& { Expand-Archive -Path 'node.zip' -DestinationPath '.' -Force }"
    
    REM Move files up one level
    for /d %%D in (node-*) do (
        for %%F in ("%%D\*") do move "%%F" "." >nul 2>&1
        rmdir "%%D"
    )
    del node.zip
    
    echo [3/3] Setting up environment...
    cd /d "%~dp0"
    
) else (
    echo Failed to download
    exit /b 1
)

echo.
echo ================================================
echo  NODEJS SETUP COMPLETE
echo ================================================
echo.

REM Set PATH to use local nodejs
set "PATH=%~dp0nodejs;%PATH%"

echo Node.js location: %~dp0nodejs
node --version
npm --version

echo.
echo Installing project dependencies...
call npm install

echo.
echo ================================================
echo  STARTING APPLICATION
echo ================================================
echo.
echo URL: http://localhost:3000
echo Health Check: http://localhost:3000/health
echo.
echo Press Ctrl+C to stop
echo.

call npm run dev
