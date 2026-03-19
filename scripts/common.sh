#!/usr/bin/env bash

set -euo pipefail

get_repository_root_path() {
  local script_directory_path="$1"
  local repository_root_path

  if [[ -z "${script_directory_path}" ]]; then
    echo "The script directory path is empty, so the repository root cannot be determined." >&2
    return 1
  fi

  repository_root_path="$(cd "${script_directory_path}/.." && pwd)"

  if [[ ! -f "${repository_root_path}/package.json" ]]; then
    echo "package.json was not found next to the scripts directory, so this does not look like the repository root." >&2
    return 1
  fi

  printf '%s\n' "${repository_root_path}"
}

get_preferred_node_command_path() {
  local repository_root_path="$1"
  local portable_node_command_path="${repository_root_path}/.tools/node-v22.22.1-win-x64/node.exe"

  if command -v node >/dev/null 2>&1; then
    command -v node
    return 0
  fi

  if [[ -x "${portable_node_command_path}" ]]; then
    printf '%s\n' "${portable_node_command_path}"
    return 0
  fi

  echo "Node.js was not found. Install Node.js 22 or newer, or provide the portable toolchain under .tools." >&2
  return 1
}

get_preferred_npm_command_path() {
  local repository_root_path="$1"
  local portable_npm_command_path="${repository_root_path}/.tools/node-v22.22.1-win-x64/npm"

  if command -v npm >/dev/null 2>&1; then
    command -v npm
    return 0
  fi

  if [[ -x "${portable_npm_command_path}" ]]; then
    printf '%s\n' "${portable_npm_command_path}"
    return 0
  fi

  echo "npm was not found. Install Node.js 22 or newer, or provide the portable toolchain under .tools." >&2
  return 1
}

run_project_npm_command() {
  local repository_root_path="$1"
  shift

  local npm_command_path
  local original_path_environment_value="${PATH}"

  npm_command_path="$(get_preferred_npm_command_path "${repository_root_path}")"

  cd "${repository_root_path}"

  if [[ "${npm_command_path}" == *"/.tools/node-v22.22.1-win-x64/npm" ]]; then
    export PATH="$(dirname "${npm_command_path}"):${PATH}"
  fi

  "${npm_command_path}" "$@"
  export PATH="${original_path_environment_value}"
}

assert_project_dependencies_are_installed() {
  local repository_root_path="$1"

  if [[ ! -d "${repository_root_path}/node_modules" ]]; then
    echo "Project dependencies are not installed yet. Run scripts/install-project-dependencies.sh first." >&2
    return 1
  fi
}

print_section_heading() {
  printf '\n==> %s\n' "$1"
}
