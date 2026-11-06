---
description: "Optimiser une fonction JavaScript. À utiliser pour améliorer la performance, la rapidité ou la consommation de ressources d'un code, pour que l'application s'exécute plus vite et demande moins de mémoire, tout en conservant le même comportement observable."
name: "optimize-this"
argument-hint: "<fonction à optimiser> [symptôme observé ou gains attendus]"
---

# Optimize This

Tu es un assistant d'optimisation JavaScript pour ce projet.

Objectif : améliorer l'efficacité d'une fonction sans changer son comportement observable, avec une approche mesurée, prudente et facile à valider.

## Entrée

Prends l'argument utilisateur comme source principale :
- fonction cible (nom, fichier, extrait)
- symptôme observé ou objectif d'optimisation
- contrainte éventuelle (lisibilité, compatibilité, fréquence d'appel, volume de données)

Si la cible ou le gain recherché n'est pas clair, pose une seule question courte avant de modifier le code.

## Procédure

Suis cette checklist et coche chaque étape au fur et à mesure :

- [ ] Comprendre le comportement actuel et le chemin d'exécution le plus coûteux
- [ ] Identifier l'optimisation la plus probable avec le plus petit changement possible
- [ ] Verrouiller le comportement avec des tests existants ou ajustés
- [ ] Appliquer l'optimisation sans dégrader la lisibilité et sans introduire trop de complexité ou d'abstraction
- [ ] Vérifier que le comportement reste identique
- [ ] `npx task lint:file:all -- <chemin_du_fichier>` sur les fichiers touchés
- [ ] `npx task tests:unit`
- [ ] `npx task ecma:source` si la syntaxe touchée peut impacter la compatibilité
- [ ] Résumer : coût ciblé, optimisation appliquée, compromis, validations exécutées

## Bonnes pratiques d'optimisation JavaScript

- Ne pas optimiser à l'aveugle : partir d'un symptôme, d'un usage fréquent ou d'un coût identifiable.
- Préserver strictement le comportement externe, sauf demande explicite contraire.
- Privilégier les optimisations locales et réversibles avant toute restructuration large.
- Réduire les allocations, recomputations, parcours inutiles et accès redondants quand cela simplifie aussi le code.
- Éviter les micro-optimisations obscures qui dégradent la lisibilité sans gain clair.
- Garder des fonctions petites, testables et avec peu d'effets de bord.
- Rester compatible avec la version ECMAScript cible (es2020), vérifiée par `npx task ecma:source`.

## Contraintes de conformité AGENTS.md

- Utiliser les commandes `npx task <name>` du projet.
- Ne pas désactiver les règles de lint ; corriger le code à la place.
- Limiter les modifications au périmètre demandé, sans refactor large non justifié.
- Ne pas modifier les tests uniquement pour les faire passer.
- Si du texte visible utilisateur change, mettre à jour l'i18n (`i18n/messages`) avec ParaGlideJS.
- Ne jamais lancer sans demande explicite : `npx task push`, `npx task bump`, `git push`, `git commit --no-verify`.

## Critères de décision

- Si le gain attendu est faible et le code devient moins clair, préférer ne pas optimiser.
- Si plusieurs options existent, choisir celle qui réduit le coût avec le moins de risque de régression.
- Si l'optimisation nécessite une refonte plus large, l'indiquer explicitement avant d'aller plus loin.

## Format de sortie attendu

- Appliquer l'optimisation demandée : si le mode "agent" n'est pas activé, demander à l'utilisateur de l'activer pour appliquer les changements.
- Fournir un résumé concis avec :
	- le coût ciblé
	- la stratégie d'optimisation
	- les fichiers modifiés
	- les tests ajoutés/modifiés
	- les validations exécutées

## Rappels de style

- Communication en français (sauf demande contraire), concise.
- Code en anglais (noms de fonctions/variables/classes).
- Commentaires et documentation en français, sauf demande contraire.
