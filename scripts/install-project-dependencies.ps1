$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "common.ps1")

$repositoryRootPath = Get-RepositoryRootPath -ScriptRootPath $PSScriptRoot

Write-Host "Installing project dependencies for Gwanyan Interactive Grassland..."
Write-Host "This downloads the Node.js packages listed in package.json."

Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("install")

Write-Host "Project dependencies were installed successfully."
