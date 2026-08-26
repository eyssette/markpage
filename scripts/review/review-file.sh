#!/usr/bin/env bash
set -euo pipefail

FILE_PATH="${1:-}"
ECMA_VERSION="${2:-}"

# Vérification que le chemin du fichier est fourni
if [[ -z "$FILE_PATH" ]]; then
	echo "❌ Usage: task review:file -- <file_path>"
	exit 1
fi

# Vérification que le fichier existe
if [ ! -f "$FILE_PATH" ]; then
	echo "❌ Fichier introuvable : $FILE_PATH"
	exit 1
fi

# 1. Formatage

echo "1 – Formatage"
if (npx oxfmt --config .oxfmtrc.json --check "$FILE_PATH" | grep -q "issue"); then
	echo "❌ Fichier mal formaté"
else
	echo "✅ Fichier correctement formaté"
fi

# 2. Lint (qualité du code)
echo "2. Lint (qualité de code)"
set +e
ERROR_MESSAGE=$(npx oxlint --config oxlint.config.mjs --report-unused-disable-directives-severity "warn" "$FILE_PATH" -f default | grep "Found" | sed "s/Found //")
set -e
if [[ "$ERROR_MESSAGE" = "0 warnings and 0 errors." ]]; then
	echo "✅ Aucun problème détecté"
else
	echo "❌ Problèmes détectés : $ERROR_MESSAGE"
	echo "- Pour le détail des erreurs, lancer : \`npx oxlint --config oxlint.config.mjs --report-unused-disable-directives-severity \"warn\" $FILE_PATH\`"
fi

# 3. Compatibilité ECMAScript
echo "3. Compatibilité ECMAScript"
ECMA_OUTPUT=$(npx es-check "$ECMA_VERSION" "$FILE_PATH" --module --quiet 2>&1 || true)
if [ -z "$ECMA_OUTPUT" ]; then
	echo "✅ Compatible avec ECMA $ECMA_VERSION"
else
	echo "❌ Incompatible avec ECMA $ECMA_VERSION"
fi

# 4. Tests unitaires
echo "4. Tests unitaires"
# On extrait d'abord le nom du fichier et son chemin à partir de "app" et on transforme l'extension .mjs en spec.mjs
TEST_FILE_PATH=$(echo "$FILE_PATH" | sed -E 's|^app/js/(.*)\.mjs$|tests/unit/\1.spec.mjs|')
# On vérifie d'abord que le fichier de test existe
if [ ! -f "$TEST_FILE_PATH" ]; then
	echo "❌ Pas de fichier de test : $TEST_FILE_PATH"
else
	# On vérifie d'abord que le fichier de test peut être lancé sans erreur de syntaxe
	set +e
	TEST_RESULT=$(npx jasmine --config='tests/unit/.config/jasmine.mjs' "$TEST_FILE_PATH" 2>&1 | grep "spec" | grep "failure")
	JASMINE_EXIT_CODE=$?
	set -e
	if [[ "$TEST_RESULT" == *"0 failures"* ]]; then
		echo "✅ Réussis : $TEST_RESULT"
		# Calcul de la couverture de code pour le fichier testé
		echo "Couverture de code pour le fichier testé :"
		set +e
		COVERAGE_OUTPUT=$(npx c8 --reporter=text-summary --reporter=html --reporter=lcov --include="$FILE_PATH" --report-dir '.report/coverage/' npx jasmine --config='tests/unit/.config/jasmine.mjs' "$TEST_FILE_PATH" 2>&1)
		echo "$COVERAGE_OUTPUT" | grep "Statements" | sed 's/^/- /'
		echo "$COVERAGE_OUTPUT" | grep "Branches" | sed 's/^/- /'
		echo "$COVERAGE_OUTPUT" | grep "Functions" | sed 's/^/- /'
		echo "$COVERAGE_OUTPUT" | grep "Lines" | sed 's/^/- /'
		set -e
	else
		if [ -z "$TEST_RESULT" ]; then
			echo "❌ Erreur de syntaxe dans le code à tester : tests non exécutés"
		else
			echo "❌ Des erreurs : $TEST_RESULT"
		fi
	fi
fi

# 5. Calcul de la complexité du fichier
echo "5. Complexité du fichier"
# Nombre de lignes de code
set +e
LINE_COUNT=$(wc -l <"$FILE_PATH" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
# En supprimant les lignes vides et les commentaires, on obtient le nombre de lignes de code effectives
EFFECTIVE_LINE_COUNT=$(grep -vE '^\s*(//|/\*|\*|$)' "$FILE_PATH" | wc -l | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
# Nombre de fonctions dans le fichier
FUNCTION_COUNT=$(grep -E 'function |=>' "$FILE_PATH" | wc -l | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
# Complexité cyclomatique approximative (nombre de branches)
BRANCH_COUNT=$(grep -E 'if |else|for |while |case |catch |try' "$FILE_PATH" | wc -l | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
# Profondeur d'imbrication maximale (nombre de niveaux d'indentation)
MAX_NESTING=$(awk '{print gsub(/\t/, "")}' "$FILE_PATH" | sort -nr | head -n 1)
# Affichage des résultats
echo "- Nombre de lignes de code : $LINE_COUNT"
echo "- Nombre de lignes de code effectives : $EFFECTIVE_LINE_COUNT"
echo "- Nombre de fonctions : $FUNCTION_COUNT"
echo "- Nombre de branches : $BRANCH_COUNT"
echo "- Profondeur d'imbrication maximale : $MAX_NESTING"
set -e

# 6. Nombre d'imports dans le fichier
echo "6. Nombre d'imports dans le fichier"
set +e
IMPORT_COUNT=$(grep -E '^\s*import ' "$FILE_PATH" | wc -l | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
set -e
echo "- Nombre d'import : $IMPORT_COUNT"

# 7. Nombre de commentaires dans le fichier
echo "7. Nombre de commentaires dans le fichier"
set +e
# On compte les lignes qui commencent par // ou /* ou * (pour les commentaires multi-lignes)
COMMENTS_BLOCK_COUNT=$(grep -E '^\s*(//|/\*|\*)' "$FILE_PATH" | wc -l | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
# On compte aussi les lignes qui contiennent des commentaires en ligne (après du code)
INLINE_COMMENTS_COUNT=$(grep -E '^[^//t ]+//' "$FILE_PATH" | wc -l | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
COMMENTS_COUNT=$((COMMENTS_BLOCK_COUNT + INLINE_COMMENTS_COUNT))
set -e
echo "- Type “blocs” : $COMMENTS_BLOCK_COUNT"
echo "- Type “inline” : $INLINE_COMMENTS_COUNT"
