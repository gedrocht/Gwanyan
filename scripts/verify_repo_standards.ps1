$ErrorActionPreference = "Stop"

$requiredFiles = @(
  ".editorconfig",
  ".gitignore",
  ".github/settings.yml",
  "README.md",
  "LICENSE",
  "package.json",
  "tsconfig.json",
  "typedoc.json",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CODE_OF_CONDUCT.md",
  ".github/CODEOWNERS",
  ".github/dependabot.yml",
  ".github/pull_request_template.md",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/feature_request.yml",
  ".github/workflows/continuous-integration.yml",
  ".github/workflows/github-pages.yml",
  ".github/workflows/pull-request-quality.yml",
  ".github/workflows/repo-health.yml",
  ".github/workflows/dependency-review.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/scorecards.yml",
  "index.html",
  "src/main.ts",
  "src/application/InteractiveGrasslandExperience.ts",
  "tests/unit/PointerWindTracker.test.ts",
  "tests/end-to-end/application.spec.ts",
  "documentation/site/docusaurus.config.mjs",
  "documentation/wiki/docker-compose.yml",
  "scripts/validate_wiki_links.py"
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
