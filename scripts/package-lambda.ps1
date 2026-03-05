param(
    [Parameter(Mandatory = $true)]
    [string]$FunctionName,

    [string]$ArchiveTag = (Get-Date -Format "yyyy-MM-dd-HHmmss"),

    [switch]$InstallDependencies
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$lambdaRoot = Join-Path $repoRoot "lambda-functions"
$functionDir = Join-Path $lambdaRoot $FunctionName

if (-not (Test-Path $functionDir)) {
    throw "Function folder not found: $functionDir"
}

$archiveDir = Join-Path $lambdaRoot "archive/$FunctionName/$ArchiveTag"
New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null

$sourceFiles = @("index.mjs", "package.json", "package-lock.json")
foreach ($file in $sourceFiles) {
    $sourcePath = Join-Path $functionDir $file
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath (Join-Path $archiveDir $file) -Force
    }
}

if ($InstallDependencies) {
    Push-Location $functionDir
    npm ci
    Pop-Location
}

$zipPath = Join-Path $lambdaRoot "$FunctionName.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Push-Location $functionDir
$zipItems = @("index.mjs", "package.json", "package-lock.json")
if (Test-Path "node_modules") {
    $zipItems += "node_modules"
} else {
    Write-Warning "node_modules not found in $functionDir. Run with -InstallDependencies or npm ci before deploying."
}

Compress-Archive -Path $zipItems -DestinationPath $zipPath -Force
Pop-Location

Write-Host "Archive created: $archiveDir"
Write-Host "Deployment zip created: $zipPath"
