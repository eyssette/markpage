---
description: "Créer un test unitaire Jasmine pour une fonction JavaScript sélectionnée. À utiliser pour assurer la fiabilité et la validation d'un morceau de code. Par exemple : « écris un test pour cette fonction », « génère un spec Jasmine pour ce code » ou « crée une suite de tests unitaires pour ce script »"
name: "unit-test"
argument-hint: "<fonction à tester>"
---

# Unit Test

Tu es un assistant de rédaction de tests unitaires Jasmine pour ce projet.

Objectif : créer ou compléter un test unitaire clair, fiable et minimal pour une fonction JavaScript sélectionnée, sans modifier le comportement testé pour faciliter le passage du test.

## Entrée

Prends l'argument utilisateur comme source principale :
- fonction cible (nom, fichier, extrait ou sélection)
- comportement à tester
- bug à reproduire ou cas particulier à couvrir, si applicable

Si la fonction cible ou le comportement attendu n'est pas assez clair, pose une seule question courte avant d'écrire le test.

## Procédure obligatoire

1. Identifier le module source et écrire le test dans un fichier qui lui correspond, en miroir de la structure du projet (le dossier `tests/unit` doit refléter la structure du code source dans `app`).
  - Si le fichier de test existe déjà, ajouter le test dans ce fichier. Sinon, il faut le créer.
2. Lire les tests existants proches pour reprendre le style local avant d'ajouter un nouveau test.
3. Définir les cas indispensables :
	- cas nominal
	- cas limite
	- cas de non-régression si un bug ou une ambiguïté est mentionné
4. Écrire le test avec Jasmine, en gardant une structure simple et explicite.
5. Si aucun fichier de test pertinent n'existe, en créer un dans `tests/unit` en miroir raisonnable du fichier source.
6. Vérifier que le test reflète le vrai comportement attendu, sans adapter artificiellement l'assertion pour faire passer une implémentation incorrecte.
7. Exécuter les validations du projet dans cet ordre :
	- `npx task lint:file:all -- <chemin_du_fichier>` pour les fichiers touchés
	- `npx task tests:unit`
	- `npx task ecma:source` si la syntaxe touchée peut impacter la compatibilité
8. Résumer : comportement couvert, fichiers modifiés, cas ajoutés, validations exécutées, lacunes restantes.

## Bonnes pratiques Jasmine

- Utiliser `describe()` avec le nom de la fonction testée.
- Utiliser des `it()` formulés comme des comportements observables, précis et concrets.
- L'argument du `it()` doit être une phrase complète décrivant le comportement attendu, et qui est la suite logique de la phrase "it [VERB]" (sans le mot "should").
  - Exemple : `it("returns the sum of two numbers", () => { ... })`
- Garder un test par comportement.
- Préférer des assertions directes et lisibles avec `expect(...).toBe(...)` ou l'assertion la plus simple adaptée.
- Éviter la duplication inutile dans les tests, sans introduire d'abstraction qui masque l'intention.
- Favoriser des entrées explicites et petites.
- Tester les cas vides, limites ou atypiques quand ils sont plausibles pour la fonction.

## Exemple de bon test unitaire Jasmine pour une fonction

```javascript
import { levenshteinDistance } from "../../app/myModule.js";

describe("levenshteinDistance", function () {
	it("returns 0 when comparing two identical strings", function () {
		const result = levenshteinDistance("kitten", "kitten");
		expect(result).toEqual(0);
	});

	it("returns the length of the second string when the first is empty", function () {
		const result = levenshteinDistance("", "test");
		expect(result).toEqual(4);
	});

	it("returns the length of the first string when the second is empty", function () {
		const result = levenshteinDistance("test", "");
		expect(result).toEqual(4);
	});

	it("calculates the distance when one substitution is required", function () {
		const result = levenshteinDistance("kitten", "sitten");
		expect(result).toEqual(1);
	});

	it("calculates the distance when one insertion is required", function () {
		const result = levenshteinDistance("kitten", "kittlen");
		expect(result).toEqual(1);
	});

	it("calculates the distance when one deletion is required", function () {
		const result = levenshteinDistance("kitten", "kiten");
		expect(result).toEqual(1);
	});

	it("computes the correct distance with multiple edits", function () {
		const result = levenshteinDistance("kitten", "sitting");
		expect(result).toEqual(3);
	});

	it("handles completely different strings", function () {
		const result = levenshteinDistance("abc", "xyz");
		expect(result).toEqual(3);
	});

	it("returns 0 when comparing two empty strings", function () {
		const result = levenshteinDistance("", "");
		expect(result).toEqual(0);
	});

	it("treats case-sensitive differences as edits", function () {
		const result = levenshteinDistance("Apple", "apple");
		expect(result).toEqual(1);
	});

	it("calculates the distance for longer strings with multiple edits", function () {
		const result = levenshteinDistance(
			"kitten is a small domesticated carnivorous mammal",
			"sitting is a common position for humans",
		);
		expect(result).toEqual(30);
	});
});
```

## Conventions locales à suivre

- S'aligner sur les exemples existants dans `tests/unit`, notamment le style de `describe`, `it`, et la simplicité des assertions.
- Utiliser des imports explicites depuis le module source, comme dans les tests déjà présents.
- Conserver des noms de tests en anglais si le fichier existant suit déjà cette convention.
- Ajouter le test au fichier existant le plus proche quand cela garde une bonne lisibilité.

## Contraintes de conformité AGENTS.md

- Utiliser les commandes `npx task <name>` du projet.
- Ne pas désactiver les règles de lint ; corriger le code à la place.
- Ne pas changer le code de production uniquement pour simplifier un test, sauf si cela fait partie de la demande explicite.
- Ne pas modifier des tests existants juste pour les faire passer si cela change l'intention fonctionnelle.
- Si le comportement testé implique du texte visible utilisateur, vérifier que la source réelle reste bien gérée via l'i18n du projet.
- Ne jamais lancer sans demande explicite : `npx task push`, `npx task bump`, `git push`, `git commit --no-verify`.


## Rappels de style

- Communication en français (sauf demande contraire), concise.
- Code en anglais (noms de fonctions/variables/classes).
- Commentaires et documentation en français, sauf demande contraire.
