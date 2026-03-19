#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

script_directory_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repository_root_path="$(get_repository_root_path "${script_directory_path}")"

assert_project_dependencies_are_installed "${repository_root_path}"

echo "Starting the local development server..."
echo "When the server is ready, open the printed local URL in your browser."
echo "Press Ctrl+C in this terminal when you want to stop the server."

run_project_npm_command "${repository_root_path}" run dev
