param(
    [string]$Region = "us-east-2",
    [string]$ApiId = "u7fyurbrjc",
    [string]$OutputRoot = "docs/dev/auth/baselines",
    [string]$CaptureLabel = "registration-config-exports",
    [string[]]$DynamoTables = @(
        "Users",
        "EmailVerificationTokens",
        "EmailVerificationRateLimits"
    ),
    [string[]]$LambdaFunctions = @(
        "showcaseRegistration",
        "showcaseVerifyEmail",
        "showcaseResendVerification"
    ),
    [string]$AwsProfile,
    [switch]$IncludeIam,
    [switch]$ContinueOnError
)

$ErrorActionPreference = if ($ContinueOnError) { "Continue" } else { "Stop" }

function New-AwsArgs {
    param(
        [string]$Region,
        [string]$Profile
    )

    $args = @("--region", $Region)
    if (-not [string]::IsNullOrWhiteSpace($Profile)) {
        $args += @("--profile", $Profile)
    }
    return ,$args
}

function Invoke-AwsJson {
    param(
        [string[]]$CommandArgs,
        [string]$OutFile,
        [string]$StepName,
        [switch]$AllowFailure
    )

    try {
        $json = aws @CommandArgs | Out-String
        if ([string]::IsNullOrWhiteSpace($json)) {
            throw "No JSON returned for: $($CommandArgs -join ' ')"
        }
        $parsed = $json | ConvertFrom-Json
        $parsed | ConvertTo-Json -Depth 100 | Set-Content -Path $OutFile -Encoding UTF8
        Write-Host "[ok] $StepName -> $OutFile"
        return $true
    }
    catch {
        Write-Warning "[fail] $StepName :: $($_.Exception.Message)"
        if (-not $AllowFailure) {
            throw
        }
        return $false
    }
}

function Save-SanitizedLambdaConfig {
    param(
        [string]$FunctionName,
        [string]$OutputDir,
        [string[]]$AwsArgs,
        [switch]$AllowFailure
    )

    $rawPath = Join-Path $OutputDir "$FunctionName.get-function-configuration.raw.json"
    $ok = Invoke-AwsJson -CommandArgs @("lambda", "get-function-configuration", "--function-name", $FunctionName) + $AwsArgs -OutFile $rawPath -StepName "lambda get-function-configuration ($FunctionName)" -AllowFailure:$AllowFailure
    if (-not $ok) {
        return $false
    }

    $raw = Get-Content -Path $rawPath -Raw | ConvertFrom-Json
    if ($null -ne $raw.Environment -and $null -ne $raw.Environment.Variables) {
        $redacted = @{}
        $raw.Environment.Variables.PSObject.Properties | ForEach-Object {
            $redacted[$_.Name] = "__REDACTED__"
        }
        $raw.Environment.Variables = $redacted
    }
    $raw | ConvertTo-Json -Depth 100 | Set-Content -Path (Join-Path $OutputDir "$FunctionName.get-function-configuration.sanitized.json") -Encoding UTF8

    Remove-Item -Path $rawPath -Force
    Write-Host "[ok] lambda sanitized config ($FunctionName)"
    return $true
}

function Save-SanitizedLambdaFunction {
    param(
        [string]$FunctionName,
        [string]$OutputDir,
        [string[]]$AwsArgs,
        [switch]$AllowFailure
    )

    $rawPath = Join-Path $OutputDir "$FunctionName.get-function.raw.json"
    $ok = Invoke-AwsJson -CommandArgs @("lambda", "get-function", "--function-name", $FunctionName) + $AwsArgs -OutFile $rawPath -StepName "lambda get-function ($FunctionName)" -AllowFailure:$AllowFailure
    if (-not $ok) {
        return $false
    }

    $raw = Get-Content -Path $rawPath -Raw | ConvertFrom-Json

    if ($null -ne $raw.Configuration -and $null -ne $raw.Configuration.Environment -and $null -ne $raw.Configuration.Environment.Variables) {
        $redacted = @{}
        $raw.Configuration.Environment.Variables.PSObject.Properties | ForEach-Object {
            $redacted[$_.Name] = "__REDACTED__"
        }
        $raw.Configuration.Environment.Variables = $redacted
    }

    if ($null -ne $raw.Code) {
        $raw.Code.Location = "__REDACTED__"
    }

    $raw | ConvertTo-Json -Depth 100 | Set-Content -Path (Join-Path $OutputDir "$FunctionName.get-function.sanitized.json") -Encoding UTF8

    Remove-Item -Path $rawPath -Force
    Write-Host "[ok] lambda sanitized function payload ($FunctionName)"
    return $true
}

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    throw "AWS CLI not found. Install AWS CLI v2 and ensure 'aws' is on PATH."
}

$datePrefix = Get-Date -Format "yyyy-MM-dd"
$folderName = "$datePrefix-$CaptureLabel"
$outputDir = Join-Path $OutputRoot $folderName
New-Item -Path $outputDir -ItemType Directory -Force | Out-Null

$awsArgs = New-AwsArgs -Region $Region -Profile $AwsProfile
$manifest = [ordered]@{
    capturedAtUtc = (Get-Date).ToUniversalTime().ToString("o")
    region = $Region
    apiId = $ApiId
    outputDir = $outputDir
    includeIam = [bool]$IncludeIam
    profileUsed = if ([string]::IsNullOrWhiteSpace($AwsProfile)) { "default" } else { $AwsProfile }
    files = @()
    failures = @()
}

Write-Host "Exporting auth config baseline to: $outputDir"

$identityPath = Join-Path $outputDir "aws.identity.json"
$identityOk = Invoke-AwsJson -CommandArgs @("sts", "get-caller-identity") + $awsArgs -OutFile $identityPath -StepName "aws sts get-caller-identity" -AllowFailure:$ContinueOnError
if ($identityOk) { $manifest.files += "aws.identity.json" } else { $manifest.failures += "aws.identity.json" }

$regionPath = Join-Path $outputDir "aws.region.json"
@{ region = $Region } | ConvertTo-Json -Depth 5 | Set-Content -Path $regionPath -Encoding UTF8
$manifest.files += "aws.region.json"

foreach ($table in $DynamoTables) {
    $describeOut = Join-Path $outputDir "dynamodb.$table.describe-table.json"
    $ttlOut = Join-Path $outputDir "dynamodb.$table.describe-time-to-live.json"
    $backupsOut = Join-Path $outputDir "dynamodb.$table.describe-continuous-backups.json"

    $describeOk = Invoke-AwsJson -CommandArgs @("dynamodb", "describe-table", "--table-name", $table) + $awsArgs -OutFile $describeOut -StepName "dynamodb describe-table ($table)" -AllowFailure:$ContinueOnError
    if ($describeOk) { $manifest.files += [System.IO.Path]::GetFileName($describeOut) } else { $manifest.failures += [System.IO.Path]::GetFileName($describeOut) }

    $ttlOk = Invoke-AwsJson -CommandArgs @("dynamodb", "describe-time-to-live", "--table-name", $table) + $awsArgs -OutFile $ttlOut -StepName "dynamodb describe-time-to-live ($table)" -AllowFailure:$ContinueOnError
    if ($ttlOk) { $manifest.files += [System.IO.Path]::GetFileName($ttlOut) } else { $manifest.failures += [System.IO.Path]::GetFileName($ttlOut) }

    $backupOk = Invoke-AwsJson -CommandArgs @("dynamodb", "describe-continuous-backups", "--table-name", $table) + $awsArgs -OutFile $backupsOut -StepName "dynamodb describe-continuous-backups ($table)" -AllowFailure:$ContinueOnError
    if ($backupOk) { $manifest.files += [System.IO.Path]::GetFileName($backupsOut) } else { $manifest.failures += [System.IO.Path]::GetFileName($backupsOut) }
}

$apiCommands = @(
    @{ Name = "apigw.apis.get-apis.json"; Args = @("apigatewayv2", "get-apis") },
    @{ Name = "apigw.routes.get-routes.json"; Args = @("apigatewayv2", "get-routes", "--api-id", $ApiId) },
    @{ Name = "apigw.integrations.get-integrations.json"; Args = @("apigatewayv2", "get-integrations", "--api-id", $ApiId) },
    @{ Name = "apigw.stages.get-stages.json"; Args = @("apigatewayv2", "get-stages", "--api-id", $ApiId) },
    @{ Name = "apigw.api.get-api.json"; Args = @("apigatewayv2", "get-api", "--api-id", $ApiId) }
)

foreach ($cmd in $apiCommands) {
    $outPath = Join-Path $outputDir $cmd.Name
    $ok = Invoke-AwsJson -CommandArgs $cmd.Args + $awsArgs -OutFile $outPath -StepName $cmd.Name -AllowFailure:$ContinueOnError
    if ($ok) { $manifest.files += $cmd.Name } else { $manifest.failures += $cmd.Name }
}

foreach ($functionName in $LambdaFunctions) {
    $policyOut = Join-Path $outputDir "$functionName.get-policy.json"

    $functionOk = Save-SanitizedLambdaFunction -FunctionName $functionName -OutputDir $outputDir -AwsArgs $awsArgs -AllowFailure:$ContinueOnError
    if ($functionOk) {
        $manifest.files += "$functionName.get-function.sanitized.json"
    }
    else {
        $manifest.failures += "$functionName.get-function.sanitized.json"
    }

    $configOk = Save-SanitizedLambdaConfig -FunctionName $functionName -OutputDir $outputDir -AwsArgs $awsArgs -AllowFailure:$ContinueOnError
    if ($configOk) {
        $manifest.files += "$functionName.get-function-configuration.sanitized.json"
    }
    else {
        $manifest.failures += "$functionName.get-function-configuration.sanitized.json"
    }

    $policyOk = Invoke-AwsJson -CommandArgs @("lambda", "get-policy", "--function-name", $functionName) + $awsArgs -OutFile $policyOut -StepName "lambda get-policy ($functionName)" -AllowFailure:$true
    if ($policyOk) { $manifest.files += [System.IO.Path]::GetFileName($policyOut) } else { $manifest.failures += [System.IO.Path]::GetFileName($policyOut) }
}

if ($IncludeIam) {
    foreach ($functionName in $LambdaFunctions) {
        try {
            $cfgPath = Join-Path $outputDir "$functionName.get-function-configuration.sanitized.json"
            if (-not (Test-Path $cfgPath)) {
                continue
            }
            $cfg = Get-Content -Path $cfgPath -Raw | ConvertFrom-Json
            if ($null -eq $cfg.Role) {
                continue
            }

            $roleName = ($cfg.Role -split "/")[-1]
            $roleOut = Join-Path $outputDir "iam.$roleName.get-role.json"
            $attachedOut = Join-Path $outputDir "iam.$roleName.list-attached-role-policies.json"
            $inlineOut = Join-Path $outputDir "iam.$roleName.list-role-policies.json"

            $roleOk = Invoke-AwsJson -CommandArgs @("iam", "get-role", "--role-name", $roleName) + $awsArgs -OutFile $roleOut -StepName "iam get-role ($roleName)" -AllowFailure:$ContinueOnError
            if ($roleOk) { $manifest.files += [System.IO.Path]::GetFileName($roleOut) } else { $manifest.failures += [System.IO.Path]::GetFileName($roleOut) }

            $attachedOk = Invoke-AwsJson -CommandArgs @("iam", "list-attached-role-policies", "--role-name", $roleName) + $awsArgs -OutFile $attachedOut -StepName "iam list-attached-role-policies ($roleName)" -AllowFailure:$ContinueOnError
            if ($attachedOk) { $manifest.files += [System.IO.Path]::GetFileName($attachedOut) } else { $manifest.failures += [System.IO.Path]::GetFileName($attachedOut) }

            $inlineOk = Invoke-AwsJson -CommandArgs @("iam", "list-role-policies", "--role-name", $roleName) + $awsArgs -OutFile $inlineOut -StepName "iam list-role-policies ($roleName)" -AllowFailure:$ContinueOnError
            if ($inlineOk) { $manifest.files += [System.IO.Path]::GetFileName($inlineOut) } else { $manifest.failures += [System.IO.Path]::GetFileName($inlineOut) }
        }
        catch {
            Write-Warning "[fail] iam discovery for $functionName :: $($_.Exception.Message)"
            if (-not $ContinueOnError) {
                throw
            }
        }
    }
}

$manifestPath = Join-Path $outputDir "export.manifest.json"
$manifest | ConvertTo-Json -Depth 20 | Set-Content -Path $manifestPath -Encoding UTF8

$readmePath = Join-Path $outputDir "README.md"
$summary = @"
# Auth Config Export Bundle

- Capture folder: $folderName
- Region: $Region
- API ID: $ApiId
- DynamoDB tables: $($DynamoTables -join ', ')
- Lambda functions: $($LambdaFunctions -join ', ')
- IAM captured: $([bool]$IncludeIam)
- Successful files: $($manifest.files.Count)
- Failed files: $($manifest.failures.Count)

## Notes
- Lambda environment variable values are sanitized to `__REDACTED__`.
- If a command fails and `-ContinueOnError` is used, see `export.manifest.json` failures list.
"@

$summary | Set-Content -Path $readmePath -Encoding UTF8

Write-Host "Export complete. Manifest: $manifestPath"
if ($manifest.failures.Count -gt 0) {
    Write-Warning "Completed with failures. Review export.manifest.json"
}