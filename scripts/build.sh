#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

script_directory_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repository_root_path="$(get_repository_root_path "${script_directory_path}")"

assert_project_dependencies_are_installed "${repository_root_path}"

echo "Building only the application bundle..."
echo "If you want the handbook and wiki validation too, use build-all-artifacts.sh."

run_project_npm_command "${repository_root_path}" run build

echo "Application-only build completed successfully."
