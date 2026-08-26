---
description: "Créer un brouillon de message d'annonce de release clair à partir de l'ancien tag de la dernière release et du nouveau tag de la release à créer. À utiliser pour rédiger un résumé de mise à jour entre deux versions, à des fins de communication des dernières nouveautés de l'application. Par exemple : « prépare l'annonce de la version 2.0 »"
name: "release-draft"
argument-hint: "<OLD_TAG> <NEW_TAG>"
agent: "agent"
---

## Objectif
Rédiger un message d'annonce de release en Markdown, agréable à lire et orienté utilisateur.

## Entrée attendue
- Deux tags Git: `OLD_TAG` et `NEW_TAG`.
- Si en plus des deux tags, il y a un troisième argument "template", cela signifie que la release concerne le template et non pas une application créée à partir du template. Dans ce cas, tout ce qui concerne l'environnement de développement est important.

## Sortie attendue
- Un message d'annonce de release en Markdown, prêt à publier, structuré et lisible, dans un fichier `.release/note/NEW_TAG.md`.
- Indique le chemin du fichier créé.
- Demande à l'utilisateur s'il souhaite aussi créer une archive de l'application compilée pour la version `NEW_TAG`. Si oui, lance la commande `task create-zipped-dist-from-tag -- NEW_TAG` et informe l'utilisateur du chemin de l'archive créée (`.release/dist/NEW_TAG.zip`).

## Comportement

1. Vérifie si `OLD_TAG` et `NEW_TAG` sont fournis.
2. Si au moins un tag manque, demande explicitement:
   - `Quel est l'ancien tag (de la dernière release) ?`
   - `Quel est le nouveau tag (pour la release à créer) ?`
   Puis attends la réponse avant de continuer.
3. Récupère les informations nécessaires:
   - Extrait détaillé du changelog:
     - `task get-changes:changelog:details -- OLD_TAG NEW_TAG`
       - Si la commande échoue ou ne retourne aucun commit, informe l'utilisateur et arrête-toi : ne génère jamais de contenu à partir d'hypothèses ou de suppositions.
       - Le changelog est déjà organisé par catégories (feat, fix, …) : prends en compte cette organisation pour rédiger le message de release.
       - Tu dois absolument prendre en compte les commits de type "feat".
       - Tu peux faire le tri dans les commits de type "fix", mais en faisant très attention à ne pas omettre des correctifs importants ou des améliorations notables.
       - Pour les autres types de commits, tu peux facilement faire un tri, mais tu dois rester attentif à ne pas omettre des changements qui pourraient être utiles à l'utilisateur.
   - Template de brouillon de release:
     - `task release-draft -- OLD_TAG NEW_TAG`
     - Si la commande échoue ou ne retourne aucun contenu, informe l'utilisateur et arrête-toi : ne génère jamais de contenu à partir d'hypothèses ou de suppositions.
4. Analyse l'extrait du changelog pour identifier:
   - Les nouveautés majeures côté utilisateur
   - Les améliorations importantes
   - Les correctifs notables
   - Les points techniques utiles mais secondaires
5. Si le sens d'un changement est ambigu ou n'est pas assez précis pour comprendre ce qu'il fait et pourquoi, inspecte les commits utiles:
   - Considère comme "importants" en priorité les commits `feat`, et dans un deuxième temps les `fix` qui modifient un comportement visible par l'utilisateur final (exclut les refactors internes, corrections de tests).
   - Pour es commits, examine des diffs ciblés:
     - `git diff HASH^ HASH -- FILE_NAME`
   - Utilise cette étape avec parcimonie: limite-toi à environ 5 à 10 commits maximum, uniquement sur les fichiers qui semblent centraux pour la release.
6. Complète le template de release :
   - Remplace chaque commentaire HTML par le contenu approprié, en respectant les consignes de rédaction.
   - N'ajoute pas de sections supplémentaires : respecte strictement la structure du template fourni par la commande `task release-draft -- OLD_TAG NEW_TAG`.
   - Ne fais pas une liste à puces de changements
   - Ne fais pas de phrases nominales
   - Fais un paragraphe descriptif pour chaque changement, avec une vraie phrase complète et concrète.
   - Les détails doivent être informatifs et utiles pour comprendre le changement, ils ne doivent pas faire référence au diff ou à des commits précis. Il doit s'agir d'explications plus précises, si elles sont utiles pour l'utilisateur, sur ce que fait le changement et pourquoi.
   - Après avoir fait ce paragraphe précis, résume en une phrase nominale le changement, dans une liste à puce avec une seule puce., et place cette phrase juste avant le paragraphe descriptif.
7. Avant d'écrire le fichier, relis le message produit et vérifie que:
   - Aucune phrase ne reste vague ou générique (ex: « cette release apporte plusieurs améliorations utiles »).
   - On peut comprendre ce qui change et pourquoi : les phrases doivent être concrètes et informatives, et pas généralistes ou abstraites.
   - Les termes techniques (noms de fonctions, d'API, de flags CLI, de fichiers) ne sont pas traduits littéralement.
   - Le ton reste factuel, sans exagération.
8. Écris le fichier `.release/note/NEW_TAG.md`, puis affiche dans la conversation le chemin du fichier.
9. Demande à l'utilisateur s'il souhaite créer une archive de l'application compilée pour la version `NEW_TAG`. Si oui, lance la commande nécessaire et informe l'utilisateur du chemin de l'archive créée.

## Contraintes de rédaction
- Tu dois respecter la structure du template de release fourni par la commande `task release-draft -- OLD_TAG NEW_TAG` : ne pas ajouter de section supplémentaire, ne supprimer une section que si elle est vide.
- La sortie finale doit toujours être en français, à l'exception des termes techniques (API, flags, noms de fonctions, noms de fichiers) qui restent dans leur forme originale.
- Le ton doit être informatif, mais rester agréable et engageant, sans être enjolivé, et sans exagération.
- Utilise le Markdown pour structurer, sans abuser du gras et de l'italique.
- Évite les formulations trop générales ou abstraites. Privilégie des phrases concrètes qui expliquent ce qui change et pourquoi (si besoin : utilise le détail du diff pour un commit pour comprendre), avec l'impact observable. N'écris pas de phrase du type « cette release apporte plusieurs améliorations utiles » ou toute autre formulation qui ne dit rien de précis.
- Il faut éviter les phrases trop longues et complexes. Si une phrase est trop longue, coupe-la en deux phrases plus simples.
- Les phrases doivent être compréhensibles par un utilisateur qui n'est pas forcément un expert technique, mais qui a un minimum de connaissances sur le projet et son fonctionnement.
- Le contenu d'ensemble doit rester globalement concis (mais suffisamment détaillé pour que l'utilisateur comprenne les changements).

## Gestion des erreurs
- Si une commande (`git`, `task ...`) échoue ou ne retourne pas de résultat exploitable, arrête-toi et informe clairement l'utilisateur de l'erreur rencontrée, sans tenter de deviner ou d'inventer le contenu manquant.