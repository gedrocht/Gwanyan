$ErrorActionPreference = "Stop"

$requiredFiles = @(
  ".editorconfig",
  ".gitignore",
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CODE_OF_CONDUCT.md",
  ".github/CODEOWNERS",
  ".github/dependabot.yml",
  ".github/pull_request_template.md",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/feature_request.yml",
  ".github/workflows/repo-health.yml",
  ".github/workflows/dependency-review.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/scorecards.yml"
)

$missing = @()

foreach ($path in $requiredFiles) {
  if (-not (Test-Path $path)) {
    $missing += $path
  }
}

if ($missing.Count -gt 0) {
  Write-Error ("Missing required repository standard files:`n" + ($missing -join "`n"))
}

$codeowners = Get-Content ".github/CODEOWNERS" -Raw
if ($codeowners -notmatch "@[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+" -and $codeowners -notmatch "@[A-Za-z0-9_.-]+") {
  Write-Warning "CODEOWNERS does not yet include a real owner. Replace the placeholder comments before enforcing code-owner review."
}

Write-Host "Repository standards verification passed."
