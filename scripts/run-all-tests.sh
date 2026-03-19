#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

script_directory_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repository_root_path="$(get_repository_root_path "${script_directory_path}")"

assert_project_dependencies_are_installed "${repository_root_path}"

echo "Running all project tests..."

print_section_heading "Run unit tests"
run_project_npm_command "${repository_root_path}" run test:unit

print_section_heading "Install the Playwright browser used by the end-to-end tests"
run_project_npm_command "${repository_root_path}" exec playwright install chromium

print_section_heading "Run end-to-end tests"
run_project_npm_command "${repository_root_path}" run test:end-to-end

print_section_heading "Result"
echo "All project tests completed successfully."
