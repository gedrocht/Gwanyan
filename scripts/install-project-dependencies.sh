#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

script_directory_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repository_root_path="$(get_repository_root_path "${script_directory_path}")"

echo "Installing project dependencies for Gwanyan Interactive Grassland..."
echo "This downloads the Node.js packages listed in package.json."

run_project_npm_command "${repository_root_path}" install

echo "Project dependencies were installed successfully."
