#!/usr/bin/env bash

set -euo pipefail

TAG="${1:-}"
EXTRA="${2:-}"

if [[ -z "$TAG" || -n "$EXTRA" ]]; then
	echo "❌ Usage: task create-zipped-dist-from-tag -- <tag>"
	exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
	echo "❌ Ce script doit être exécuté dans un dépôt Git."
	exit 1
fi

if ! git rev-parse -q --verify "refs/tags/$TAG" >/dev/null 2>&1; then
	echo "❌ Tag introuvable: $TAG"
	exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
	echo "❌ npm est requis."
	exit 1
fi

if ! command -v zip >/dev/null 2>&1; then
	echo "❌ La commande zip est requise."
	exit 1
fi

ROOT_DIR="$(git rev-parse --show-toplevel)"
RELEASE_DIR="$ROOT_DIR/.release/dist"
SAFE_TAG="${TAG//\//-}"
ZIP_NAME="markpage-dist@${SAFE_TAG}.zip"
ZIP_PATH="$RELEASE_DIR/$ZIP_NAME"
WORKTREE_PARENT="$ROOT_DIR/.release/.tmp"
WORKTREE_DIR="$WORKTREE_PARENT/worktree-$SAFE_TAG-$$"

mkdir -p "$RELEASE_DIR" "$WORKTREE_PARENT"

cleanup() {
	if [[ -d "$WORKTREE_DIR" ]]; then
		git -C "$ROOT_DIR" worktree remove --force "$WORKTREE_DIR" >/dev/null 2>&1 || true
	fi
}
trap cleanup EXIT INT TERM

echo "📌 Preparation du worktree temporaire pour le tag $TAG..."
git -C "$ROOT_DIR" worktree add --detach "$WORKTREE_DIR" "$TAG" >/dev/null

echo "📦 Installation des dépendances du tag..."
if ! npm --prefix "$WORKTREE_DIR" ci; then
	echo "⚠️ npm ci a échoué, fallback vers npm install..."
	npm --prefix "$WORKTREE_DIR" install
fi

echo "🏗️ Build du tag $TAG..."
(
	cd "$WORKTREE_DIR"
	npm exec -- task build --force
)

if [[ ! -d "$WORKTREE_DIR/dist" ]]; then
	echo "❌ Le dossier dist n'a pas ete généré par le build."
	exit 1
fi

rm -f "$ZIP_PATH"

echo "🗜️ Création de l'archive $ZIP_NAME..."
(
	cd "$WORKTREE_DIR/dist"
	zip -rq "$ZIP_PATH" .
)

echo "✅ Archive créée: $ZIP_PATH"
