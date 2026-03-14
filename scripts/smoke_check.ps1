param(
    [string]$BaseUrl = "http://localhost:8080"
)

$ErrorActionPreference = "Stop"

function Get-StatusCode([string]$Path) {
    try {
        return (Invoke-WebRequest -UseBasicParsing "$BaseUrl$Path").StatusCode
    } catch {
        if ($_.Exception.Response) {
            return [int]$_.Exception.Response.StatusCode
        }
        throw
    }
}

function Assert-Status([string]$Path, [int[]]$Expected) {
    $code = Get-StatusCode $Path
    if ($Expected -notcontains $code) {
        throw "[smoke] FAIL status $Path expected one of [$($Expected -join ',')] got=$code"
    }
    Write-Output "[smoke] OK status $Path -> $code"
}

function Get-ContentType([string]$Path) {
    $response = Invoke-WebRequest -UseBasicParsing "$BaseUrl$Path"
    return $response.Headers["Content-Type"]
}

function Assert-ContentTypePrefix([string]$Path, [string[]]$ExpectedPrefixes) {
    $contentType = (Get-ContentType $Path).ToLowerInvariant()
    $matched = $false
    foreach ($prefix in $ExpectedPrefixes) {
        if ($contentType.StartsWith($prefix.ToLowerInvariant())) {
            $matched = $true
            break
        }
    }
    if (-not $matched) {
        throw "[smoke] FAIL content-type $Path expected one of prefixes [$($ExpectedPrefixes -join ',')] got=$contentType"
    }
    Write-Output "[smoke] OK content-type $Path -> $contentType"
}

function Assert-HeaderPresent([string]$Path, [string]$HeaderName) {
    $headers = (Invoke-WebRequest -UseBasicParsing "$BaseUrl$Path").Headers
    if (-not $headers[$HeaderName]) {
        throw "[smoke] FAIL missing header $HeaderName on $Path"
    }
    Write-Output "[smoke] OK header $HeaderName on $Path -> $($headers[$HeaderName])"
}

Write-Output "[smoke] Base URL: $BaseUrl"

Assert-Status "/" @(200)
Assert-Status "/portal.html" @(200, 401)
Assert-Status "/api/health" @(200)

Assert-ContentTypePrefix "/dist/app.js" @("application/javascript", "text/javascript")
Assert-ContentTypePrefix "/dist/components/Header.js" @("application/javascript", "text/javascript")
Assert-ContentTypePrefix "/dist/tailwind.css" @("text/css")

Assert-HeaderPresent "/" "X-Content-Type-Options"
Assert-HeaderPresent "/" "Content-Security-Policy"
Assert-HeaderPresent "/" "X-Frame-Options"

Write-Output "[smoke] All checks passed."
