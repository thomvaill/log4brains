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

cd "${ROOT_PATH}"

if [[ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]]
then
  echo "Please run this command from the master branch"
  exit 1
fi

git pull

echo "Please check that the last build pipeline was successful: https://github.com/thomvaill/log4brains/actions/workflows/build.yml"
read -rp "Press any key to continue or Ctrl+C to abort..."

yarn lerna version \
  --conventional-commits \
  --force-publish \
  --exact \
  --no-push

echo "You can now inspect the current release commit before continuing (to abort: git reset --hard origin/master && git tag -d <VERSION>)"
read -rp "Press any key to push & publish or Ctrl+C to abort..."

git push

yarn lerna publish from-git \
  --conventional-commits \
  --force-publish \
  --exact \
  --create-release github

echo "Done!"
echo "Please now monitor the Post-Release actions: https://github.com/thomvaill/log4brains/actions"
