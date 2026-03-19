$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "common.ps1")

$repositoryRootPath = Get-RepositoryRootPath -ScriptRootPath $PSScriptRoot
Assert-ProjectDependenciesAreInstalled -RepositoryRootPath $repositoryRootPath

Write-Host "Building only the application bundle..."
Write-Host "If you want the handbook and wiki validation too, use build-all-artifacts.ps1."

Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "build")

Write-Host "Application-only build completed successfully."
