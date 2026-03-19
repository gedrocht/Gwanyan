$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "common.ps1")

$repositoryRootPath = Get-RepositoryRootPath -ScriptRootPath $PSScriptRoot
Assert-ProjectDependenciesAreInstalled -RepositoryRootPath $repositoryRootPath

Write-Host "Starting the local development server..."
Write-Host "When the server is ready, open the printed local URL in your browser."
Write-Host "Press Ctrl+C in this terminal when you want to stop the server."

Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "dev")
