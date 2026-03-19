$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "common.ps1")

$repositoryRootPath = Get-RepositoryRootPath -ScriptRootPath $PSScriptRoot
$minimumNodeVersion = [version]"22.0.0"

Write-Host "Checking prerequisites for Gwanyan Interactive Grassland..."

Write-SectionHeading -HeadingText "Required tools"

$nodeVersionAssessment = Get-NodeVersionAssessment -RepositoryRootPath $repositoryRootPath -MinimumVersion $minimumNodeVersion
$gitIsInstalled = Test-CommandAvailability -CommandName "git"
$pythonIsInstalled = (Test-CommandAvailability -CommandName "python") -or (Test-CommandAvailability -CommandName "py")
$dockerIsInstalled = Test-CommandAvailability -CommandName "docker"

Write-Host ("Git: " + $(if ($gitIsInstalled) { "installed" } else { "missing" }))
Write-Host ("Node.js: " + $nodeVersionAssessment.VersionText + " - " + $nodeVersionAssessment.Message)
Write-Host ("Python: " + $(if ($pythonIsInstalled) { "installed" } else { "missing" }))
Write-Host ("Docker Desktop: " + $(if ($dockerIsInstalled) { "installed" } else { "not detected (optional unless you want to serve the wiki locally)" }))

$missingRequiredPrerequisites = @()

if (-not $gitIsInstalled) {
  $missingRequiredPrerequisites += "Git"
}

if (-not $nodeVersionAssessment.MeetsMinimumVersion) {
  $missingRequiredPrerequisites += "Node.js 22 or newer"
}

if (-not $pythonIsInstalled) {
  $missingRequiredPrerequisites += "Python 3.10 or newer"
}

Write-SectionHeading -HeadingText "Official download pages"
Write-Host "Git: https://git-scm.com/downloads"
Write-Host "Node.js: https://nodejs.org/en/download/"
Write-Host "Python: https://www.python.org/downloads/"
Write-Host "Docker Desktop: https://docs.docker.com/get-started/introduction/get-docker-desktop/"

Write-SectionHeading -HeadingText "What each tool is for"
Write-Host "Git is used to clone, update, and contribute to the repository."
Write-Host "Node.js and npm are required to install packages, run the app, build the app, and run tests."
Write-Host "Python is required for the wiki validation step that is part of the full project verification flow."
Write-Host "Docker Desktop is optional for basic development, but it is needed if you want to serve the separate wiki software locally."

if ($missingRequiredPrerequisites.Count -gt 0) {
  Write-SectionHeading -HeadingText "Result"
  Write-Error ("Missing required prerequisites:`n" + ($missingRequiredPrerequisites -join "`n"))
}

Write-SectionHeading -HeadingText "Result"
Write-Host "All required prerequisites were found."
