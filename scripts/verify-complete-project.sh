#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

script_directory_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repository_root_path="$(get_repository_root_path "${script_directory_path}")"

assert_project_dependencies_are_installed "${repository_root_path}"

echo "Running the complete project verification workflow..."

print_section_heading "Check formatting"
run_project_npm_command "${repository_root_path}" run format:check

print_section_heading "Run ESLint"
run_project_npm_command "${repository_root_path}" run lint

print_section_heading "Run TypeScript typechecking"
run_project_npm_command "${repository_root_path}" run typecheck

print_section_heading "Audit production dependencies"
run_project_npm_command "${repository_root_path}" run audit:production

print_section_heading "Run unit tests"
run_project_npm_command "${repository_root_path}" run test:unit

print_section_heading "Install the Playwright browser used by the end-to-end tests"
run_project_npm_command "${repository_root_path}" exec playwright install chromium

print_section_heading "Run end-to-end tests"
run_project_npm_command "${repository_root_path}" run test:end-to-end

print_section_heading "Build the application bundle"
run_project_npm_command "${repository_root_path}" run build

print_section_heading "Build the handbook and API documentation"
run_project_npm_command "${repository_root_path}" run docs:build

print_section_heading "Validate the wiki content"
run_project_npm_command "${repository_root_path}" run wiki:validate

print_section_heading "Result"
echo "The complete project verification workflow finished successfully."
