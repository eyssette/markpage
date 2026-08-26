---
name: "think-and-plan"
description: "Accompagner la réflexion et la planification d'une nouvelle application ou d'une nouvelle fonctionnalité, en proposant un plan d'action clair et priorisé. À utiliser pour structurer un projet ou définir une stratégie de développement. Par exemple : « je veux créer une application », « je veux ajouter une fonctionnalité », « j'aimerais mettre en place » ou des questions comme : « que penses-tu ... ? », « comment je pourrais ... ? », « est-ce possible de ... ? »"
argument-hint: "<horizon souhaité>"
agent: "agent"
---

# Think and Plan

Objectif : transformer une idée encore floue en un livrable clair, stocké dans `.plan/` à la racine du projet :

1. Si le fichier n'existe pas, création de **`.plan/VISION.md`** — la vision produit stable (objectif, public cible, périmètre)
2. Création de **`.plan/plan-YYYY-MM-DD-<timestamp_unix>.md`** — le plan d'action du moment, avec des étapes en cases à cocher

Le cœur de cette skill n'est pas de remplir un template le plus vite possible, mais de **penser avec l'utilisateur** : poser des questions, proposer des options, challenger les choix flous ou contradictoires, et ne rien figer sans validation. Un plan produit sans avoir vraiment compris le besoin est pire qu'inutile : il donne une fausse impression de clarté.

## Vue d'ensemble du déroulé

1. IMPORTANT : Vérifier si `.plan/VISION.md` existe déjà → si oui, s'en servir de base plutôt que repartir de zéro
2. Extraire les contraintes techniques du fichier `AGENTS.md`
3. Construire ou consolider la vision avec l'utilisateur, par la discussion : il faut challenger l'utilisateur et faire un brainstorming pour clarifier l'objectif, le public cible, les fonctionnalités principales et ce qui est hors périmètre
4. Écrire `.plan/VISION.md` s'il n'existe pas, ou le mettre à jour si nécessaire (en discutant avec l'utilisateur, et en faisant valider les changements par l'utilisateur)
5. Réfléchir à un plan d'action concret, avec l'utilisateur, en découpant le projet en grandes étapes et sous-tâches actionnables
6. Écrire `.plan/plan-YYYY-MM-DD-<timestamp_unix>.md`

Ces étapes sont décrites dans l'ordre logique, mais rien n'empêche d'aller-retour : si en discutant du plan on découvre que la vision doit changer, on demande à l'utilisateur s'il souhaite mettre à jour `VISION.md` avant de continuer.

## Étape 1 — Reprendre l'existant

IMPORTANT : Avant de poser la moindre question, regarder si `.plan/VISION.md` existe déjà dans le projet.

- **S'il existe** : le lire et s'en servir de socle. Ne pas repartir de zéro. Présenter à l'utilisateur un résumé rapide de ce qui est déjà défini, et demander si ça reste valable ou si quelque chose a changé, plutôt que de reposer toutes les questions depuis le début. L'objectif est de faire avancer la réflexion, pas de la répéter.
- **S'il n'existe pas** : passer à l'étape 2 puis 3.

Regarder aussi s'il existe déjà des fichiers `plan-*.md` dans `.plan/` : s'il y en a, ça donne du contexte sur ce qui a déjà été planifié et éventuellement réalisé (utile pour ne pas proposer un plan qui ignore le travail précédent).

## Étape 2 — Lire les contraintes techniques

Chercher un fichier `AGENTS.md` à la racine du projet (ou à l'endroit indiqué par l'utilisateur) et le lire s'il existe.

Ces contraintes techniques (stack, conventions, limites) ne vont pas dans `.plan/VISION.md`, qui reste un document produit. Elles servent surtout à l'étape 5, pour que le plan d'action proposé soit réaliste et cohérent avec l'existant — inutile de proposer une étape qui contredit une contrainte connue.

## Étape 3 — Construire la vision avec l'utilisateur

C'est l'étape la plus importante. Ne pas se contenter de reformuler ce que l'utilisateur vient de dire : creuser.

Points à couvrir, sous forme de conversation (pas un questionnaire à remplir mécaniquement — poser les questions naturellement, une ou deux à la fois, dans l'ordre qui a du sens selon ce que l'utilisateur a déjà dit) :

- **Objectif / idée directrice** : quel problème ça résout, pourquoi ce projet existe. Si la réponse de l'utilisateur reste vague ("un outil pour gérer des tâches"), pousser un peu : qu'est-ce qui ne marche pas avec les outils existants ? quel est le déclencheur de cette idée ?
- **Public cible** : qui va utiliser ça, et est-ce que ça change quelque chose au produit. Si l'utilisateur dit "tout le monde", challenger gentiment — un produit qui vise tout le monde finit souvent par ne bien servir personne.
- **Fonctionnalités principales** : ce qu'il doit y avoir dans une première version, en distinguant l'essentiel du confort.
- **Ce que l'appli ne cherche pas à faire** : c'est souvent le point le plus utile et le plus négligé. Demander explicitement ce qui est hors périmètre, surtout si l'utilisateur énumère beaucoup de fonctionnalités — l'aider à trancher plutôt que tout accepter.

Ne pas hésiter à proposer des options concrètes plutôt que de poser des questions ouvertes dans le vide ("tu vois plutôt un mode A ou un mode B ?") — ça aide l'utilisateur à réagir et clarifier sa pensée, surtout quand il n'a pas encore une idée bien nette.

Une fois que la vision semble stable, la reformuler en une version synthétique et demander confirmation explicite avant de l'écrire dans le fichier.

Ne jamais écrire `.plan/VISION.md` sans validation de l'utilisateur.

## Étape 4 — Écrire `.plan/VISION.md` s'il n'existe pas, ou le mettre à jour si nécessaire

Si le fichier n'existe pas, créer `.plan/VISION.md`, ou le mettre à jour si besoin.

Structure indicative — l'adapter si le projet a des besoins particuliers, sans complexifier inutilement :

```markdown
# Vision - [Nom du projet]

## Objectif / idée directrice
[2-4 phrases sur le problème résolu et pourquoi ce projet existe]

## Public cible
[Qui utilise ça, et ce que ça implique]

## Fonctionnalités principales
- [Fonctionnalité essentielle 1]
- [Fonctionnalité essentielle 2]
- ...

## Hors périmètre
Ce que l'application ne cherche pas à faire (au moins pour l'instant) :
- [...]

## Contraintes techniques
[Renvoi au fichier AGENTS.md]
```

Si `.plan/VISION.md` existait déjà et qu'on le met à jour, ne pas écraser silencieusement des sections encore valables : ne modifier que ce qui a changé, et toujours après discussion et validation par l'utilisateur.

## Étape 5 — Réfléchir au plan d'action

Une fois la vision posée, passer à la planification concrète. Là aussi, c'est une discussion, pas une génération automatique :

- Proposer un premier découpage en grandes étapes, et l'exposer à l'utilisateur pour réaction plutôt que de l'écrire directement dans le fichier.
- Challenger l'ordre proposé si une étape a l'air de dépendre d'une autre pas encore faite, ou si une étape a l'air trop grosse pour être une seule case à cocher utile.
- Poser la question de la priorité si tout ne peut pas être fait d'un coup : qu'est-ce qui est vraiment nécessaire pour une première version fonctionnelle, qu'est-ce qui peut attendre ?
- Rester pragmatique sur le niveau de détail : des sous-tâches concrètes et actionnables, sans descendre jusqu'au niveau ligne de code — ça reste un plan, pas un cahier des charges exhaustif.

Valider avec l'utilisateur la structure globale (les grandes étapes) avant de détailler chaque section en sous-tâches, pour éviter de tout réécrire si l'ordre général ne convient pas.

## Étape 6 — Écrire le fichier de plan

Créer `.plan/plan-YYYY-MM-DD-<timestamp_unix>.md`, où `YYYY-MM-DD` est la date du jour et `<timestamp_unix>` un timestamp Unix (secondes), par exemple via `date +%s` en bash. Cela garantit un nom de fichier unique même si plusieurs plans sont créés le même jour.

Structure indicative :

```markdown
# Plan — [Date]

## Résumé
[1-3 phrases : ce que ce plan vise à accomplir, en lien avec VISION.md]

## L'essentiel à faire
- [Point d'attention 1 ou fonctionnalité essentielle 1]
- [Point d'attention 2 ou fonctionnalité essentielle 2]

## Hors périmètre
- [Point hors périmètre 1]
- [Point hors périmètre 2]

## [Grande étape 1]
- [ ] Sous-tâche concrète
- [ ] Sous-tâche concrète

## [Grande étape 2]
- [ ] Sous-tâche concrète
- [ ] Sous-tâche concrète
```

Le nombre de points d'attention, fonctionnalités essentielles, grandes étapes et de sous-tâches dépend entièrement du projet — ne pas forcer un nombre fixe. L'important est que chaque case à cocher soit assez concrète pour qu'on sache reconnaître qu'elle est terminée.

Une fois le fichier écrit, le signaler à l'utilisateur avec son chemin, et rester disponible pour l'ajuster si en le relisant quelque chose cloche.

## Étape 7 — Proposer de passer à l'action si l'utilisateur le souhaite

Une fois le plan écrit et validé, demander à l'utilisateur s'il souhaite passer à l'action et commencer à implémenter le plan.

Si oui, proposer de lancer une première sous-tâche concrète et bien définie, en utilisant la SKILL appropriée (`code`, `fix-this`, `review-this`, `refactor-this`, etc.) pour la réaliser.

Ne jamais lancer une action sans validation explicite de l'utilisateur.

## Points d'attention généraux

- **Ne pas sur-structurer** : cette skill donne un canevas, pas un carcan. Si un projet est très simple, une vision courte et un plan de 3 étapes suffisent — pas besoin de remplir artificiellement chaque section.
- **Privilégier le dialogue à la génération automatique** : à chaque fois qu'il y a une ambiguïté ou un choix de conception, le signaler à l'utilisateur plutôt que de trancher silencieusement à sa place.
- **Un fichier de plan par session de réflexion** : ne pas modifier un ancien `plan-*.md` pour une nouvelle session de planification, en créer un nouveau. `VISION.md`, lui, est un document vivant qui se met à jour.
