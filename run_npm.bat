@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
set "NODE_EXE=%~dp0nodejs\node.exe"
set "NPM_CLI_JS=%~dp0nodejs\node-v20.11.1-win-x64\node_modules\npm\bin\npm-cli.js"
"%NODE_EXE%" "%NPM_CLI_JS%" %*
