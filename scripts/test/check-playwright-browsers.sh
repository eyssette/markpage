#!/usr/bin/env bash

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

PROJECT_PLAYWRIGHT_VERSION=$(node -e "const p=require('./package.json'); const declared=(p.devDependencies?.playwright || p.dependencies?.playwright || '').trim(); const m=declared.match(/[0-9]+\\.[0-9]+\\.[0-9]+/); if (m) process.stdout.write(m[0]);" 2>/dev/null)
PLAYWRIGHT_LIST_OUTPUT="$(npx playwright install --list 2>&1 || true)"

PROJECT_SECTION="$(printf '%s\n' "$PLAYWRIGHT_LIST_OUTPUT" | awk -v version="$PROJECT_PLAYWRIGHT_VERSION" 'BEGIN { RS=""; ORS="" } index($0, "Playwright version: " version) { print; found=1; exit } END { if (!found) exit 1 }' || true)"

if [ -n "$PROJECT_SECTION" ] && [ -n "$PROJECT_PLAYWRIGHT_VERSION" ] && printf '%s\n' "$PROJECT_SECTION" | grep -q "Playwright version: $PROJECT_PLAYWRIGHT_VERSION" && printf '%s\n' "$PROJECT_SECTION" | grep -Eq 'ms-playwright/(chromium|chromium_headless_shell|firefox|webkit|msedge)'; then
  echo "⚠️ L'installation de Playwright a échoué, mais des navigateurs compatibles avec Playwright $PROJECT_PLAYWRIGHT_VERSION sont déjà présents."
  cd "$PROJECT_ROOT" || exit 1
  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true npm i -D "playwright@$PROJECT_PLAYWRIGHT_VERSION"
else
  echo "❌ Impossible d'installer Playwright et ses dépendances, et aucun navigateur compatible avec la version Playwright du projet n'a été trouvé."
  echo "$PLAYWRIGHT_LIST_OUTPUT"
  exit 1
fi
