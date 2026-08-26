#!/usr/bin/env bash

set -euo pipefail

TAG_OLD="${1:-}"
TAG_NEW="${2:-}"
EXTRA="${3:-}"

if [[ -z "$TAG_OLD" || -n "$EXTRA" ]]; then
  echo "❌ Usage: task get-changes:changelog -- <tag_OLD> [tag_cible]"
  exit 1
fi

if [[ -z "$TAG_NEW" ]]; then
  TAG_NEW=$(sed -nE 's/^##[[:space:]]+([^[:space:]]+).*/\1/p' CHANGELOG.md | head -n 1)
  if [[ -z "$TAG_NEW" ]]; then
    echo "❌ Impossible de déterminer le tag cible depuis CHANGELOG.md"
    exit 1
  fi
fi

if [[ "$TAG_OLD" == "$TAG_NEW" ]]; then
  echo "❌ Le tag source et le tag cible doivent être différents"
  exit 1
fi

CHANGELOG_AT_TARGET=$(git show "$TAG_NEW:CHANGELOG.md" 2>/dev/null || true)
if [[ -z "$CHANGELOG_AT_TARGET" ]]; then
  echo "❌ Impossible de lire CHANGELOG.md au tag cible \"$TAG_NEW\""
  exit 1
fi

SECTION=$(printf "%s\n" "$CHANGELOG_AT_TARGET" | awk -v source="$TAG_OLD" -v target="$TAG_NEW" '
  BEGIN {
    capture = 0
    found_target = 0
    found_source = 0
  }
  $1 == "##" {
    version = $2
    if (version == target) {
      capture = 1
      found_target = 1
    } else if (version == source && capture == 1) {
      found_source = 1
      exit
    }
  }
  capture == 1 {
    print
  }
  END {
    if (found_target == 0) {
      exit 2
    }
    if (found_source == 0) {
      exit 3
    }
  }
')
AWK_STATUS=$?

if [[ "$AWK_STATUS" -eq 2 ]]; then
  echo "❌ Le tag cible \"$TAG_NEW\" est introuvable dans CHANGELOG.md"
  exit 1
fi

if [[ "$AWK_STATUS" -eq 3 ]]; then
  echo "❌ Le tag source \"$TAG_OLD\" est introuvable dans CHANGELOG.md du tag cible \"$TAG_NEW\""
  exit 1
fi

echo "## CHANGELOG.md (entre $TAG_OLD et $TAG_NEW)"
echo ""
# Add one heading level for each markdown heading line.
printf "%s\n" "$SECTION" | sed 's/^#/##/'
echo ""
