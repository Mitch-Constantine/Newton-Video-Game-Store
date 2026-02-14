# Start backend (API) and frontend (Angular). Use the frontend URL in your browser.

$apiDir = Join-Path $PSScriptRoot "api\Newton.Api"
$webDir = Join-Path $PSScriptRoot "web"

$launchPath = Join-Path $apiDir "Properties\launchSettings.json"
$launch = Get-Content -Raw $launchPath | ConvertFrom-Json
$appUrls = $launch.profiles.https.applicationUrl -split ';'
$httpsUrl = $appUrls[0].Trim()
$httpUrl = $appUrls[1].Trim()
$httpsPort = ([System.Uri]$httpsUrl).Port

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Newton - Backend + Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Build backend synchronously (compiler messages visible)
Write-Host "Building backend..." -ForegroundColor Cyan
Push-Location $apiDir
try {
    dotnet build
    if ($LASTEXITCODE -ne 0) {
        Pop-Location
        exit $LASTEXITCODE
    }
} finally {
    Pop-Location
}

# 2. Start backend in a new window
Write-Host "Starting backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$apiDir'; dotnet run --no-build --launch-profile https"

# 3. Wait until backend is listening
Write-Host "Waiting for backend to start..." -ForegroundColor Cyan
$maxWait = 45
$waited = 0
while ($waited -lt $maxWait) {
    try {
        $conn = New-Object System.Net.Sockets.TcpClient("localhost", $httpsPort)
        $conn.Close()
        break
    } catch {
        Start-Sleep -Seconds 1
        $waited++
    }
}
if ($waited -ge $maxWait) {
    Write-Host "Backend did not start in time." -ForegroundColor Red
    exit 1
}
Write-Host "Backend is ready." -ForegroundColor Green
Write-Host ""
Write-Host "  Open the app in your browser:" -ForegroundColor Yellow
Write-Host "    http://localhost:4200" -ForegroundColor Green
Write-Host ""
Write-Host "  API (HTTPS): $httpsUrl" -ForegroundColor Gray
Write-Host "  API (HTTP):  $httpUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 4. Start frontend (blocking)
Write-Host "Starting frontend..." -ForegroundColor Cyan
Push-Location $webDir
try {
    if (!(Test-Path "node_modules")) { npm ci }
    npm start
} finally {
    Pop-Location
}
