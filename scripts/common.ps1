$ErrorActionPreference = "Stop"

function Get-RepositoryRootPath {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ScriptRootPath
  )

  if ([string]::IsNullOrWhiteSpace($ScriptRootPath)) {
    throw "The script root path is empty, so the repository root cannot be determined."
  }

  $repositoryRootPath = Split-Path -Parent $ScriptRootPath

  if (-not (Test-Path (Join-Path $repositoryRootPath "package.json"))) {
    throw "package.json was not found next to the scripts directory, so this does not look like the repository root."
  }

  return $repositoryRootPath
}

function Get-PreferredNodeCommandInfo {
  param(
    [Parameter(Mandatory = $true)]
    [string]$RepositoryRootPath
  )

  $systemNodeCommand = Get-Command "node" -ErrorAction SilentlyContinue

  if ($null -ne $systemNodeCommand) {
    return [pscustomobject]@{
      CommandPath = $systemNodeCommand.Source
      ToolDirectoryPath = Split-Path -Parent $systemNodeCommand.Source
      Source = "system"
    }
  }

  $portableNodeCommandPath = Join-Path $RepositoryRootPath ".tools\node-v22.22.1-win-x64\node.exe"

  if (Test-Path $portableNodeCommandPath) {
    return [pscustomobject]@{
      CommandPath = $portableNodeCommandPath
      ToolDirectoryPath = Split-Path -Parent $portableNodeCommandPath
      Source = "portable"
    }
  }

  throw "Node.js was not found. Install Node.js 22 or newer, or provide the portable toolchain under .tools."
}

function Get-PreferredNpmCommandInfo {
  param(
    [Parameter(Mandatory = $true)]
    [string]$RepositoryRootPath
  )

  $systemNpmCommand = Get-Command "npm" -ErrorAction SilentlyContinue

  if ($null -ne $systemNpmCommand) {
    return [pscustomobject]@{
      CommandPath = $systemNpmCommand.Source
      ToolDirectoryPath = Split-Path -Parent $systemNpmCommand.Source
      Source = "system"
    }
  }

  $portableNpmCommandPath = Join-Path $RepositoryRootPath ".tools\node-v22.22.1-win-x64\npm.cmd"

  if (Test-Path $portableNpmCommandPath) {
    return [pscustomobject]@{
      CommandPath = $portableNpmCommandPath
      ToolDirectoryPath = Split-Path -Parent $portableNpmCommandPath
      Source = "portable"
    }
  }

  throw "npm was not found. Install Node.js 22 or newer, or provide the portable toolchain under .tools."
}

function Invoke-ProjectNpmCommand {
  param(
    [Parameter(Mandatory = $true)]
    [string]$RepositoryRootPath,
    [Parameter(Mandatory = $true)]
    [string[]]$NpmArguments
  )

  $npmCommandInfo = Get-PreferredNpmCommandInfo -RepositoryRootPath $RepositoryRootPath
  $originalPathEnvironmentValue = $env:PATH

  Push-Location $RepositoryRootPath

  try {
    if ($npmCommandInfo.Source -eq "portable") {
      $env:PATH = $npmCommandInfo.ToolDirectoryPath + ";" + $env:PATH
    }

    & $npmCommandInfo.CommandPath @NpmArguments

    if ($LASTEXITCODE -ne 0) {
      throw "npm returned exit code $LASTEXITCODE while running: npm $($NpmArguments -join ' ')"
    }
  } finally {
    $env:PATH = $originalPathEnvironmentValue
    Pop-Location
  }
}

function Assert-ProjectDependenciesAreInstalled {
  param(
    [Parameter(Mandatory = $true)]
    [string]$RepositoryRootPath
  )

  if (-not (Test-Path (Join-Path $RepositoryRootPath "node_modules"))) {
    throw "Project dependencies are not installed yet. Run scripts/install-project-dependencies.ps1 first."
  }
}

function Write-SectionHeading {
  param(
    [Parameter(Mandatory = $true)]
    [string]$HeadingText
  )

  Write-Host ""
  Write-Host ("==> " + $HeadingText)
}

function Get-NodeVersionAssessment {
  param(
    [Parameter(Mandatory = $true)]
    [string]$RepositoryRootPath,
    [Parameter(Mandatory = $true)]
    [version]$MinimumVersion
  )

  try {
    $nodeCommandInfo = Get-PreferredNodeCommandInfo -RepositoryRootPath $RepositoryRootPath
    $rawNodeVersionText = (& $nodeCommandInfo.CommandPath --version).Trim()
    $parsedNodeVersion = [version]($rawNodeVersionText.TrimStart("v"))

    return [pscustomobject]@{
      IsInstalled = $true
      VersionText = $rawNodeVersionText
      MeetsMinimumVersion = $parsedNodeVersion -ge $MinimumVersion
      Message = if ($parsedNodeVersion -ge $MinimumVersion) {
        "Installed"
      } else {
        "Installed, but older than the required version"
      }
    }
  } catch {
    return [pscustomobject]@{
      IsInstalled = $false
      VersionText = "Not found"
      MeetsMinimumVersion = $false
      Message = $_.Exception.Message
    }
  }
}

function Test-CommandAvailability {
  param(
    [Parameter(Mandatory = $true)]
    [string]$CommandName
  )

  return $null -ne (Get-Command $CommandName -ErrorAction SilentlyContinue)
}
