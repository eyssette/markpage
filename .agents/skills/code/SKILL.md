---
name: "code"
description: "Écrire du code pour implémenter une fonctionnalité en respectant les bonnes pratiques et les conventions du projet. À utiliser lorsque l'utilisateur demande de créer une application, une fonction, un module, un composant"
argument-hint: "<plan d'action ou fonctionnalité à implémenter>"
agent: "agent"
---

# Code

Écrit du code applicatif pour ce projet (JS modulaire, ParaGlideJS pour l'i18n, Svelte en option pour la réactivité), en respectant strictement les conventions de `AGENTS.md` et les principes ci-dessous. Toute production de code doit se terminer par une revue via `npx task review:file`.

## 0. Avant de coder

- Reformuler très brièvement ce qui va être fait et où (fichiers/dossiers concernés).
- Si la demande est ambiguë ou a plusieurs interprétations valables : formuler l'hypothèse retenue ou poser la question — ne jamais trancher en silence.
- Écrire le minimum de code qui résout le problème : pas de fonctionnalité, abstraction ou option non demandée.
- Sur du code existant : ne toucher que ce que la tâche exige. Ne pas reformater / refactoriser le code adjacent (Oxfmt/Oxlint s'en chargent). Ne retirer que les imports/variables devenus inutiles à cause du changement ; signaler le code mort préexistant sans le supprimer.
- Prévenir l'utilisateur que toute nouvelle fonction impliquera probablement des tests unitaires et/ou des scénarios e2e (voir §5).

## 1. Emplacement du code (structure du projet)

- Code source JS/CSS : `app/js` et `app/css`.
- Point d'entrée : `app/js/main.mjs` (importe les autres modules JS et le CSS principal).
- Architecture modulaire et structure claire, de préférence par dossier/fonctionnalité, ou MVC si cela est pertinent (à faire valider par l'utilisateur si le projet n'a pas encore de structure claire).
- Composants Svelte : de préférence `app/js/components/*.svelte`, mais demander à l'utilisateur si un autre emplacement est souhaité.
- Traductions : `i18n/messages`.
- Ne jamais éditer `dist` à la main (généré par le build).
- Tests unitaires : `tests/unit`.
- Tests end-to-end : scénarios Gherkin dans `features` et implémentation dans `tests/e2e/step_definitions`.

## 2. Principes de code à respecter systématiquement

- **JavaScript modulaire** : fichiers courts, un rôle par fichier, imports/exports explicites (ESM, extension `.mjs`/`.js` selon l'existant). Pas d'objet fourre-tout, pas de fichier god-module, pas de fichier "barrel"
- **KISS** : la solution la plus simple qui fonctionne. Pas de sur-ingénierie.
- **DRY** : factoriser la logique dupliquée dans une fonction/module partagé, mais ne pas factoriser prématurément deux usages qui n'ont pas encore prouvé être identiques.
- **1 fonction = 1 responsabilité** : une fonction fait une seule chose, a un nom qui le dit, et reste testable isolément. Si une fonction fait "et... et...", la découper.
- **Pas de classes** : utiliser des fonctions et des modules, jamais `class`. Préférer la composition de fonctions à l'héritage.
- **Pas de mutation cachée** : privilégier les fonctions pures quand c'est raisonnable ; documenter clairement toute mutation d'un paramètre si elle est nécessaire.
- **Imports dynamiques pour les plugins/fonctionnalités optionnelles** : tout module chargé conditionnellement (plugin, fonctionnalité activable, code lourd non utilisé au démarrage) doit être importé via `import()` dynamique, jamais en `import` statique en tête de fichier. Cela inclut les composants Svelte non utilisés systématiquement.
- **Pas de top-level await** : tout `await` doit être à l'intérieur d'une fonction asynchrone (`async function`). Ne jamais faire de `await` au niveau racine d'un module, y compris pour un `import()` dynamique.
- **Compatibilité ECMAScript** : rester compatible avec `ECMA_VERSION` défini dans `rolldown.config.mjs` / `Taskfile.yml` / `oxlint.config.mjs`. En cas de doute sur une syntaxe récente, lancer `npx task ecma:source` après écriture.
- **Complexité cognitive faible** : préférer les retours anticipés (early return) aux imbrications profondes ; éviter les conditions complexes non nommées (extraire dans une variable/fonction au nom explicite).
- **Nommage** : anglais pour le code (fonctions, variables), français pour les commentaires et la documentation (sauf demande contraire de l'utilisateur).
- **Gestion des événements** : Toujours utiliser des écouteurs d'événements (addEventListener), dans les fichiers JavaScript, plutôt que des attributs HTML (ex: onclick, onchange …).
- **Architecture CSS** : ne jamais utiliser du CSS inline, ou alors seulement très rarement, quand ce serait complexifier de faire autrement. Les styles doivent être intégrés dans `app/css/style.css` ou dans un fichier dédié importé via `app/js/main.mjs`. Avant toute création de style, consulter `.plan/DESIGN.md` ; si ce fichier est absent, suggérer sa création via la SKILL `/design-md`. Utiliser la SKILL `/css` pour créer ou vérifier le style CSS produit.

## 3. Accessibilité et sécurité

- Garantir le respect des standards d'**accessibilité** numérique (WCAG niveau AA a minima) : structure sémantique correcte, alternatives textuelles, contraste suffisant, navigation au clavier et compatibilité avec les lecteurs d'écran.
- Garantir la **sécurité** du code produit : validation et échappement systématique des entrées/sorties (protection contre XSS, injection SQL, etc.), aucune exécution de code arbitraire non maîtrisé (eval, exec, désérialisation non sécurisée...), et aucun contournement des mécanismes d'authentification, d'autorisation ou de contrôle d'accès existants.

## 4. Bonnes pratiques générales

- Avant d'écrire du nouveau code, rechercher si l'existant peut être réutilisé et respecter les conventions déjà présentes dans le projet.
- Viser la performance, la lisibilité, la maintenabilité et la testabilité du code.
- Documenter de manière simple les fonctions (pas de JSdoc complexe), en français sauf demande contraire de l'utilisateur, et sans excès ou précisions inutiles. Pas de commentaire inline, après une ligne de code. Commentaire uniquement pour décrire la fonction avant son code, ou pour expliquer un point technique complexe ou la structure de la fonction (avant chaque étape importante de traitement).
- Ne pas ajouter de dépendance, d'abstraction ou de complexité sans nécessité démontrée ; privilégier les solutions natives et simples.
- Ne jamais utiliser des CDN, des scripts externes ou des librairies non gérées par le projet, sauf demande explicite de l'utilisateur.
- Ne jamais utiliser des polices ou des ressources externes non gérées par le projet, sauf demande explicite de l'utilisateur.
- Ne jamais refactoriser du code hors périmètre de la tâche : signaler les améliorations possibles sans les appliquer.
- Éviter les effets de bord inutiles : limiter les variables globales, rendre les dépendances explicites et préférer les fonctions pures quand cela reste simple.
- Gérer explicitement les erreurs : ne jamais masquer une erreur avec un `catch` vide et ne pas ignorer silencieusement un cas invalide.
- Ne jamais faire confiance aux données externes : valider les entrées publiques et éviter les injections (`innerHTML`, `eval`, etc.).
- Éviter les valeurs magiques.
- Ne pas exporter une fonction ou créer une API publique si elle n'est pas nécessaire.
- DOM : Limiter les accès répétés et les mises à jours successives du DOM, éviter les sélections identiques plusieurs fois dans une même fonction.

## 5. Internationalisation (ParaGlideJS)

- Ne jamais coder en dur un texte visible par l'utilisateur.
- Utiliser les messages ParaGlideJS existants dans `i18n/messages` ; en ajouter/mettre à jour si un nouveau texte est nécessaire, dans toutes les langues déjà présentes.
- Cas particulier `unplugin-raw` (textes longs importés bruts dans le JS) : dans ce cas précis (pour de la documentation, ou un tutoriel, à l'intérieur de l'application par exemple), l'i18n est gérée manuellement — le signaler explicitement à l'utilisateur si ce mécanisme est utilisé.

## 6. Composants Svelte (optionnel)

À utiliser uniquement quand une réactivité fine ou une gestion d'état non triviale le justifie — pas par défaut pour du HTML/CSS/JS simple (KISS).

- Nom de fichier en PascalCase (`ComponentName.svelte`).
- Élément personnalisé déclaré en kebab-case : `<svelte:options customElement="component-name" />`.
- Syntaxe Svelte 5 uniquement : `$props`, `$state`, `$derived`, `$effect`, `$host` (pour dispatcher des événements vers l'extérieur du composant).
- Le composant reste responsable de sa vue/réactivité ; la logique métier réutilisable hors-UI va dans un module JS classique (séparation des responsabilités).
- Charger le composant via import dynamique s'il n'est pas utilisé systématiquement (cf. §2).

## 7. Tests

- Avertir l'utilisateur avant d'ajouter une fonction que des tests seront nécessaires.
- Ne jamais modifier un test existant juste pour le faire passer : un test doit refléter le comportement réel attendu.
- Correctif de bug : écrire d'abord un test qui reproduit le bug, vérifier qu'il échoue, corriger, vérifier qu'il passe.
- Logique nouvelle/modifiée → test unitaire dans `tests/unit` (Jasmine).
- Comportement utilisateur nouveau/modifié → scénario Gherkin dans `features` + step definitions dans `tests/e2e/step_definitions` (CodeceptJS), dans le style des scénarios existants.
- Itération rapide sur un seul scénario e2e : le tagger `@CURRENT` et lancer `npx task tests:e2e:current`.

## 8. Lint

- Ne jamais désactiver une règle de lint (inline, par fichier, ou globale dans `oxlint.config.mjs`).
  - Règle en erreur → corriger le code.
  - Règle en avertissement → essayer d'abord de corriger le code ; si ce n'est pas raisonnable, demander à l'utilisateur s'il veut la désactiver, en expliquant pourquoi.
- `npx task lint` affiche les erreurs bloquantes. `npx task lint:all` affiche en plus les avertissements non bloquants.

## 9. Séquence de fin de tâche (obligatoire)

Avant de considérer une tâche de code terminée, exécuter dans cet ordre :

1. **`npx task review:file -- <chemin_du_fichier>` sur chaque fichier créé ou modifié** — étape obligatoire, non optionnelle, même si le lint et les tests passent. Corriger les points soulevés par la revue avant de rendre la main, ou expliquer à l'utilisateur pourquoi un point n'est pas corrigé.
2. `npx task lint:all` pour vérifier l'ensemble
3. `npx task tests:unit` (et `npx task tests:e2e:current` si un scénario `@CURRENT` a été écrit/modifié)
4. `npx task ecma:source` si une syntaxe potentiellement incompatible a été touchée

Ne pas exécuter `npx task push`, `npx task bump`, `git push`, ni `git commit --no-verify` sans demande explicite de l'utilisateur dans le tour de conversation en cours, avec un avertissement clair sur l'effet de la commande (push multi-dépôts, montée de version, contournement des hooks).

## 10. Commit (seulement si demandé)

- Ne pas committer sans demande explicite de l'utilisateur. Par défaut, l'utilisateur gère lui-même les commits et le push.
- Conventional Commits, scope obligatoire pour `feat`/`fix`.
- Message de commit en français, concis, orienté utilisateur.
- Ne pas contourner les hooks Husky ; si un hook échoue, corriger le point signalé plutôt que de forcer.

## Langue

- Communiquer en français avec l'utilisateur (sauf s'il écrit dans une autre langue).
- Code (fonctions, variables) en anglais ; commentaires, documentation, messages de commit en français.
- Être concis, ne pas être verbeux.
