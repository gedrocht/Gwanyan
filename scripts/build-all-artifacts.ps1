$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "common.ps1")

$repositoryRootPath = Get-RepositoryRootPath -ScriptRootPath $PSScriptRoot
Assert-ProjectDependenciesAreInstalled -RepositoryRootPath $repositoryRootPath

Write-Host "Building all major project artifacts..."

Write-SectionHeading -HeadingText "Build the application bundle"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "build")

Write-SectionHeading -HeadingText "Build the handbook and API documentation"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "docs:build")

$generatedDocumentationSitePathFilePath = Join-Path $repositoryRootPath "documentation\site\generated-builds\latest-path.txt"

if (Test-Path $generatedDocumentationSitePathFilePath) {
  Write-Host ("The generated handbook site is available at: " + (Get-Content $generatedDocumentationSitePathFilePath -Raw).Trim())
}

Write-SectionHeading -HeadingText "Validate the wiki content"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "wiki:validate")

Write-SectionHeading -HeadingText "Result"
Write-Host "All buildable project artifacts were completed successfully."
