#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

script_directory_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repository_root_path="$(get_repository_root_path "${script_directory_path}")"
minimum_node_major_version=22

echo "Checking prerequisites for Gwanyan Interactive Grassland..."

print_section_heading "Required tools"

git_is_installed="false"
python_is_installed="false"
docker_is_installed="false"
node_version_text="Not found"
node_message="Node.js was not found"
node_meets_minimum_version="false"

if command -v git >/dev/null 2>&1; then
  git_is_installed="true"
fi

if command -v python >/dev/null 2>&1 || command -v python3 >/dev/null 2>&1; then
  python_is_installed="true"
fi

if command -v docker >/dev/null 2>&1; then
  docker_is_installed="true"
fi

if node_command_path="$(get_preferred_node_command_path "${repository_root_path}")"; then
  node_version_text="$("${node_command_path}" --version)"
  node_major_version="${node_version_text#v}"
  node_major_version="${node_major_version%%.*}"

  if [[ "${node_major_version}" -ge "${minimum_node_major_version}" ]]; then
    node_meets_minimum_version="true"
    node_message="Installed"
  else
    node_message="Installed, but older than the required version"
  fi
fi

echo "Git: $(if [[ "${git_is_installed}" == "true" ]]; then echo "installed"; else echo "missing"; fi)"
echo "Node.js: ${node_version_text} - ${node_message}"
echo "Python: $(if [[ "${python_is_installed}" == "true" ]]; then echo "installed"; else echo "missing"; fi)"
echo "Docker Desktop: $(if [[ "${docker_is_installed}" == "true" ]]; then echo "installed"; else echo "not detected (optional unless you want to serve the wiki locally)"; fi)"

missing_required_prerequisites=()

if [[ "${git_is_installed}" != "true" ]]; then
  missing_required_prerequisites+=("Git")
fi

if [[ "${node_meets_minimum_version}" != "true" ]]; then
  missing_required_prerequisites+=("Node.js 22 or newer")
fi

if [[ "${python_is_installed}" != "true" ]]; then
  missing_required_prerequisites+=("Python 3.10 or newer")
fi

print_section_heading "Official download pages"
echo "Git: https://git-scm.com/downloads"
echo "Node.js: https://nodejs.org/en/download/"
echo "Python: https://www.python.org/downloads/"
echo "Docker Desktop: https://docs.docker.com/get-started/introduction/get-docker-desktop/"

print_section_heading "What each tool is for"
echo "Git is used to clone, update, and contribute to the repository."
echo "Node.js and npm are required to install packages, run the app, build the app, and run tests."
echo "Python is required for the wiki validation step that is part of the full project verification flow."
echo "Docker Desktop is optional for basic development, but it is needed if you want to serve the separate wiki software locally."

if [[ "${#missing_required_prerequisites[@]}" -gt 0 ]]; then
  print_section_heading "Result"
  printf 'Missing required prerequisites:\n'
  printf '%s\n' "${missing_required_prerequisites[@]}"
  exit 1
fi

print_section_heading "Result"
echo "All required prerequisites were found."
