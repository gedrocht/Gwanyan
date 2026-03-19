#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

script_directory_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repository_root_path="$(get_repository_root_path "${script_directory_path}")"

assert_project_dependencies_are_installed "${repository_root_path}"

echo "Building all major project artifacts..."

print_section_heading "Build the application bundle"
run_project_npm_command "${repository_root_path}" run build

print_section_heading "Build the handbook and API documentation"
run_project_npm_command "${repository_root_path}" run docs:build

generated_documentation_site_path_file_path="${repository_root_path}/documentation/site/generated-builds/latest-path.txt"

if [[ -f "${generated_documentation_site_path_file_path}" ]]; then
  echo "The generated handbook site is available at: $(cat "${generated_documentation_site_path_file_path}")"
fi

print_section_heading "Validate the wiki content"
run_project_npm_command "${repository_root_path}" run wiki:validate

print_section_heading "Result"
echo "All buildable project artifacts were completed successfully."
