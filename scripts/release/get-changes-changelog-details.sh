#!/usr/bin/env bash

set -euo pipefail

TAG_OLD="${1:-}"
TAG_NEW="${2:-}"
EXTRA="${3:-}"

if [[ -z "$TAG_OLD" || -z "$TAG_NEW" || -n "$EXTRA" ]]; then
  echo "❌ Usage: task get-changes:changelog:details -- <tag1> <tag2>"
  exit 1
fi

echo "# EVOLUTION DE L'APPLICATION"
echo ""
echo "Voici les changements entre les tags $TAG_OLD et $TAG_NEW, avec :"
echo "- Un extrait du fichier CHANGELOG.md entre ces deux tags"
echo "- Le détail des commits concernés (avec la liste des fichiers modifiés pour chaque commit)"
echo ""
echo "Pour voir le détail d'un commit pour un fichier, utiliser la commande suivante : \`git show <hash_du_commit>:<nom_du_fichier>\`"
echo "Pour voir le _diff_ qu'a apporté un commit pour un fichier, utiliser la commande suivante : \`git diff <hash_du_commit>^ <hash_du_commit> -- <nom_du_fichier>\`"
echo ""
echo "Les commits de type \`feat\` et \`fix\` sont les plus importants"
echo ""
echo ""
echo "----------------------------------------"
echo ""
echo ""

bash scripts/release/get-changes-changelog.sh "$TAG_OLD" "$TAG_NEW"

echo ""
echo ""
echo "----------------------------------------"
echo ""
echo ""
echo "## DETAILS DES COMMITS (entre $TAG_OLD et $TAG_NEW)"
echo ""

COMMIT_LOG=$(git log --format='__COMMIT__%H%n%s%n%b%n__FILES__' --name-only "$TAG_OLD".."$TAG_NEW")

if [[ -n "$COMMIT_LOG" ]]; then
  CURRENT_COMMIT=""
  CURRENT_HEADER=""
  CURRENT_BODY=""
  CURRENT_FILES=()
  IN_FILES=false

  while IFS= read -r LINE; do
    if [[ "$LINE" == __COMMIT__* ]]; then
      if [[ -n "$CURRENT_COMMIT" ]]; then
        if [[ ! "$CURRENT_HEADER" =~ ^bump|edit ]]; then
          echo "### $CURRENT_HEADER"
          echo "- Hash : $CURRENT_COMMIT"
          if [[ -n "$CURRENT_BODY" ]]; then
            echo ""
            echo "$CURRENT_BODY"
            echo ""
          fi
          echo ""
          echo "Fichiers modifies:"

          if [[ ${#CURRENT_FILES[@]} -gt 0 ]]; then
            for FILE in "${CURRENT_FILES[@]}"; do
              [[ -n "$FILE" ]] && echo "- $FILE"
            done
          else
            echo "- Aucun fichier modifie pour ce commit"
          fi
          echo ""
        fi
      fi

      CURRENT_COMMIT="${LINE#__COMMIT__}"
      CURRENT_HEADER=""
      CURRENT_BODY=""
      CURRENT_FILES=()
      IN_FILES=false
      continue
    fi

    if [[ "$LINE" == "__FILES__" ]]; then
      IN_FILES=true
      continue
    fi

    if [[ "$IN_FILES" == true ]]; then
      [[ -n "$LINE" ]] && CURRENT_FILES+=("$LINE")
    elif [[ -z "$CURRENT_HEADER" ]]; then
      CURRENT_HEADER="$LINE"
    else
      if [[ -n "$CURRENT_BODY" ]]; then
        CURRENT_BODY+=$''
      fi
      CURRENT_BODY+="$LINE"
    fi
  done <<< "$COMMIT_LOG"

  if [[ -n "$CURRENT_COMMIT" ]]; then
    if [[ ! "$CURRENT_HEADER" =~ ^bump|edit ]]; then
      echo "### $CURRENT_HEADER"
      echo "- Hash : $CURRENT_COMMIT"
		echo ""
      if [[ -n "$CURRENT_BODY" ]]; then
        echo "$CURRENT_BODY"
      fi
      echo "Fichiers modifiés:"

      if [[ ${#CURRENT_FILES[@]} -gt 0 ]]; then
        for FILE in "${CURRENT_FILES[@]}"; do
          [[ -n "$FILE" ]] && echo "- $FILE"
        done
      else
        echo "- Aucun fichier modifie pour ce commit"
      fi
      echo ""
    fi
  fi
else
  echo "Aucun commit trouve entre les tags $TAG_OLD et $TAG_NEW."
fi
