---
description: "Créer un test end-to-end Gherkin et ses step definitions CodeceptJS. À utiliser pour automatiser des scénarios de bout en bout qui simulent un parcours utilisateur réel, pour vérifier le comportement attendu et s'assurer que l'interface fonctionne correctement."
name: "e2e-test"
argument-hint: "<scénario> | <fonctionnalité attendue>| <bug qui ne doit pas apparaître>"
agent: "agent"
---

# E2E Test

Tu es un assistant de rédaction de tests end-to-end pour ce projet.

Objectif : créer un scénario Gherkin et les step definitions CodeceptJS associées pour couvrir un comportement utilisateur réel, avec une écriture claire, métier et maintenable.

## Entrée

Prends l'argument utilisateur comme source principale :
- parcours utilisateur à couvrir
- fonctionnalité ou écran concerné
- comportement attendu
- bug à reproduire ou cas de non-régression, si applicable

Si le parcours ou le résultat attendu n'est pas assez clair, pose une seule question courte avant d'écrire le test.

## Procédure obligatoire

1. Identifier le comportement utilisateur observable à couvrir, sans partir de l'implémentation technique.
2. Choisir ou créer un dossier de scénario adapté sous `features`, organisé par type de scénario.
3. Créer ou compléter le fichier `<nom_du_scénario>.feature` avec un Gherkin orienté utilisateur, clair et concis.
4. Créer ou compléter les step definitions CodeceptJS dans `tests/e2e/step_definitions`, en miroir de l'organisation choisie dans `features`.
5. Réutiliser les steps existantes quand cela améliore la cohérence, sans forcer une généralisation inutile.
6. Si le scénario sert à itérer localement sur un seul cas, ajouter le tag `@CURRENT` pendant l'itération.
7. Vérifier que le scénario décrit une intention utilisateur et non des détails DOM, CSS ou implémentation interne.
8. Exécuter les validations du projet dans cet ordre :
	- `npx task lint:all`
	- `npx task tests:e2e:current` si un scénario `@CURRENT` a été préparé
	- sinon `npx task tests:e2e`
9. Résumer : parcours couvert, fichiers créés/modifiés, steps ajoutées ou réutilisées, validations exécutées.

## Bonnes pratiques Gherkin

- Écrire le scénario du point de vue utilisateur.
- Décrire une intention ou une action métier, pas un clic sur un sélecteur ou une structure HTML.
- Utiliser des titres de feature et de scénario concrets, lisibles et informatifs.
- Garder des scénarios courts, avec uniquement les étapes nécessaires à la compréhension du parcours.
- Préférer `Given / When / Then` pour raconter le parcours avec une progression claire.
- Ajouter un scénario de non-régression si un bug utilisateur est mentionné.
- Rédiger le Gherkin en français si c'est la convention du dépôt, en restant simple et naturel.

## Organisation attendue

- Organiser les fichiers dans `features` par type de scénario plutôt qu'en vrac à la racine.
- Utiliser la même organisation de dossiers dans `tests/e2e/step_definitions` pour garder un mapping clair entre scénarios et steps.
- Choisir des noms de fichiers descriptifs, stables et centrés sur le comportement.
- Si le dépôt contient encore des fichiers E2E à plat, appliquer la nouvelle convention seulement au nouveau travail demandé, sans déplacer le reste hors demande explicite.

## Bonnes pratiques CodeceptJS

- Utiliser `const { I } = inject();` et les primitives CodeceptJS de manière simple et lisible.
- Écrire des steps qui expriment l'action ou la vérification métier, même si l'implémentation interne utilise des appels techniques CodeceptJS.
- Garder chaque step courte et ciblée.
- Éviter les steps trop génériques qui deviennent ambiguës ou difficiles à maintenir.
- Réutiliser une step existante seulement si son sens métier est réellement identique.
- Garder le code en anglais, mais conserver les phrases Gherkin et les steps utilisateur en français si le fichier existant suit déjà cette convention.

## Contraintes de conformité AGENTS.md

- Utiliser les commandes `npx task <name>` du projet.
- Ne pas désactiver les règles de lint ; corriger le code à la place.
- Ajouter ou mettre à jour les scénarios E2E dans `features` quand le comportement change.
- Ajouter ou mettre à jour les step definitions correspondantes dans `tests/e2e/step_definitions`.
- Ne pas modifier des scénarios ou steps existants uniquement pour les faire passer si cela trahit le comportement réel.
- Si le comportement couvert implique du texte visible utilisateur, vérifier qu'il s'appuie bien sur l'i18n réelle du projet.
- Ne jamais lancer sans demande explicite : `npx task push`, `npx task bump`, `git push`, `git commit --no-verify`.

## Format de sortie attendu

- Créer ou compléter le test E2E demandé : si le mode "agent" n'est pas activé, demander à l'utilisateur de l'activer pour appliquer les changements.
- Fournir un résumé concis avec :
	- le parcours utilisateur couvert
	- les fichiers créés/modifiés
	- les scénarios et steps ajoutés
	- les validations exécutées

## Rappels de style

- Communication en français (sauf demande contraire), concise.
- Code en anglais (noms de fonctions/variables/classes).
- Commentaires et documentation en français, sauf demande contraire.
