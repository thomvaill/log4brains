#!/usr/bin/env bash
# shellcheck disable=SC1091
set -euo pipefail

SELF_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_PATH="$(cd "${SELF_PATH}/.." && pwd)"
readonly SELF_PATH ROOT_PATH

if [[ ! -f "${SELF_PATH}/release-credentials.local.sh" ]]
then
  echo "Please create the release-credentials.local.sh file with the following exports: NODE_AUTH_TOKEN, GH_TOKEN"
  exit 1
fi
source "${SELF_PATH}/release-credentials.local.sh"
npm config set '//registry.npmjs.org/:_authToken' "${NODE_AUTH_TOKEN}" # writes to ~/.npmrc
npm config set registry https://registry.npmjs.org/

cd "${ROOT_PATH}"

if [[ "$(git rev-parse --abbrev-ref HEAD)" != "develop" ]]
then
  echo "Please run this command from the develop branch"
  exit 1
fi

git pull

echo ""
echo "Release checklist:"
echo "  - the last build pipeline is successful: https://github.com/thomvaill/log4brains/actions/workflows/build.yml"
echo "  - the example is working: https://thomvaill.github.io/log4brains/adr/"
echo "  - manual smoketests are OK (log4brains adr new, log4brains adr list, log4brains preview)"
read -rp "Press any key to continue or Ctrl+C to abort..."

yarn lerna publish \
  --conventional-commits \
  --exact \
  --create-release github

echo ""
echo "Done!"
echo "Please now monitor the Post-Release actions: https://github.com/thomvaill/log4brains/actions"
