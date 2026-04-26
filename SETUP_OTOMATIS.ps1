
# ============================================
# SETUP OTOMATIS DIADOEK RESTAURANT SYSTEM
# ============================================
# Script ini akan menginstall Node.js dan menjalankan aplikasi

Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "Memulai Setup Otomatis Diadoek Restaurant" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

# Step 1: Cek apakah Node.js sudah ada
Write-Host "[1/4] Mengecek Node.js..." -ForegroundColor Yellow
$nodeCheck = node --version 2>$null
if ($nodeCheck) {
    Write-Host "✓ Node.js sudah terinstall: $nodeCheck" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js tidak ditemukan, menginstall..." -ForegroundColor Red
    
    # Download Node.js LTS
    $nodeUrl = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
    $msiPath = "$env:TEMP\node-installer.msi"
    
    Write-Host "Downloading Node.js dari: $nodeUrl" -ForegroundColor Cyan
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $nodeUrl -OutFile $msiPath -UseBasicParsing
    
    Write-Host "Node.js selesai didownload. Memulai instalasi..." -ForegroundColor Cyan
    # Install Node.js silently
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$msiPath`" /quiet /norestart" -Wait
    
    # Refresh environment
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    # Verify installation
    Start-Sleep -Seconds 2
    $nodeCheck = node --version 2>$null
    if ($nodeCheck) {
        Write-Host "✓ Node.js berhasil diinstall: $nodeCheck" -ForegroundColor Green
    } else {
        Write-Host "✗ Instalasi Node.js gagal" -ForegroundColor Red
        exit 1
    }
    
    # Clean up installer
    Remove-Item $msiPath -Force
}

Write-Host ""

# Step 2: Install dependencies
Write-Host "[2/4] Menginstall dependencies..." -ForegroundColor Yellow
$projectPath = Get-Location
Set-Location $projectPath

# Check if node_modules already exists
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ npm install gagal" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dependencies berhasil diinstall" -ForegroundColor Green
} else {
    Write-Host "✓ Dependencies sudah ada" -ForegroundColor Green
}

Write-Host ""

# Step 3: Setup database
Write-Host "[3/4] Menyiapkan database..." -ForegroundColor Yellow
if (-not (Test-Path "db")) {
    New-Item -ItemType Directory -Path "db" -Force | Out-Null
}
Write-Host "✓ Database siap" -ForegroundColor Green

Write-Host ""

# Step 4: Jalankan aplikasi
Write-Host "[4/4] Menjalankan aplikasi..." -ForegroundColor Yellow
Write-Host "" 
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "APLIKASI SIAP BERJALAN!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""
Write-Host "URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Health Check: http://localhost:3000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Yellow
Write-Host ""

npm run dev
