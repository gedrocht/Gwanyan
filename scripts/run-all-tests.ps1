$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "common.ps1")

$repositoryRootPath = Get-RepositoryRootPath -ScriptRootPath $PSScriptRoot
Assert-ProjectDependenciesAreInstalled -RepositoryRootPath $repositoryRootPath

Write-Host "Running all project tests..."

Write-SectionHeading -HeadingText "Run unit tests"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "test:unit")

Write-SectionHeading -HeadingText "Install the Playwright browser used by the end-to-end tests"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("exec", "playwright", "install", "chromium")

Write-SectionHeading -HeadingText "Run end-to-end tests"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "test:end-to-end")

Write-SectionHeading -HeadingText "Result"
Write-Host "All project tests completed successfully."
