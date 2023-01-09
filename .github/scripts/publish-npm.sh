#!/bin/sh
set -e

if [ ! "$(which yarn)" ]; then
  echo "FAILED to find yarn executable"
  exit 1
fi
if [ ! "$(which jq)" ]; then
  echo "FAILED to find jq executable"
  exit 1
fi

new_version=$1
dry_run=$2
package_name="$(cat package.json | jq .name)"

echo "package_name: $package_name"
echo "new_version: $new_version"
echo "dry_run: $dry_run"

echo -e "\033[0;32mPublishing version ${package_name}@${new_version}\033[0m"
if [ "$dry_run" = "true" ]; then
    echo "DRY RUN: yarn publish . --new-version \"${new_version}\" --prerelease --no-git-tag-version"
else
    yarn publish . --new-version "${new_version}" --prerelease --no-git-tag-version
fi
