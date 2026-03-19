$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "common.ps1")

$repositoryRootPath = Get-RepositoryRootPath -ScriptRootPath $PSScriptRoot
Assert-ProjectDependenciesAreInstalled -RepositoryRootPath $repositoryRootPath

Write-Host "Running the complete project verification workflow..."

Write-SectionHeading -HeadingText "Check formatting"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "format:check")

Write-SectionHeading -HeadingText "Run ESLint"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "lint")

Write-SectionHeading -HeadingText "Run TypeScript typechecking"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "typecheck")

Write-SectionHeading -HeadingText "Audit production dependencies"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "audit:production")

Write-SectionHeading -HeadingText "Run unit tests"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "test:unit")

Write-SectionHeading -HeadingText "Install the Playwright browser used by the end-to-end tests"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("exec", "playwright", "install", "chromium")

Write-SectionHeading -HeadingText "Run end-to-end tests"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "test:end-to-end")

Write-SectionHeading -HeadingText "Build the application bundle"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "build")

Write-SectionHeading -HeadingText "Build the handbook and API documentation"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "docs:build")

Write-SectionHeading -HeadingText "Validate the wiki content"
Invoke-ProjectNpmCommand -RepositoryRootPath $repositoryRootPath -NpmArguments @("run", "wiki:validate")

Write-SectionHeading -HeadingText "Result"
Write-Host "The complete project verification workflow finished successfully."
