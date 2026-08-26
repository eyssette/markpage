---
name: design-md
description: Créer ou modifier un fichier DESIGN.md conforme à la spécification DESIGN.md (identité visuelle, couleurs, typographie, espacements, arrondis, composants), en visant la simplicité et l'accessibilité, et en guidant l'utilisateur pas à pas, avec des questions simples et non techniques. À utiliser dès que l'utilisateur veut créer, générer ou remplir un DESIGN.md, une "charte graphique", une "identité visuelle", un "design system" — même s'il ne connaît pas le vocabulaire technique du design ou du développement.
argument-hint: "Taper sur Entrée pour créer le fichier DESIGN.md"
agent: "agent"
---

# Générateur de DESIGN.md, pas à pas

## Ce que fait cette skill

Elle transforme un entretien simple, une question à la fois, en un fichier `DESIGN.md` valide selon la spécification (`./references/spec.md`). L'utilisateur cible est **non technique** : il ne connaît ni les codes couleur, ni les noms de police, ni le vocabulaire du design (token, contraste, hex...).

Il faut faire un travail de traduction des demandes de l'utilisateur vers des valeurs précises, concrètes et cohérentes, en restant toujours simple et accessible.

Toujours garder ces trois principes en tête :

1. **Une question à la fois.**
  - Ne jamais présenter un formulaire complet. L'entretien doit ressembler à une conversation courte, pas à un questionnaire à remplir.
2. **Toujours des suggestions concrètes.**
  - Chaque question propose des choix nommés et compréhensibles (jamais "primary color?" mais "quelle couleur représente le mieux votre projet ?" avec des exemples décrits en mots). Si l'utilisateur hésite ou répond "je ne sais pas", proposer directement une valeur par défaut raisonnable plutôt que d'insister.
3. **Sobre et accessible par défaut.**
  - Entre deux options plausibles, toujours pencher vers celle qui est la plus simple à lire et la moins criarde. Le préréglage "Sobre et professionnel" de `./references/style-presets.md` est le choix par défaut recommandé chaque fois que l'utilisateur ne se prononce pas clairement.

Avant de commencer l'entretien, lire `./references/style-presets.md` — il contient les préréglages de couleurs/polices/espacements/arrondis à proposer, ainsi que l'échelle typographique commune.

Garder `./references/spec.md` sous la main pour vérifier le format exact au moment d'écrire le fichier final.

## Créer ou mettre à jour ?

Avant de poser la moindre question, vérifier si plan/DESIGN.md existe déjà.

### S'il n'existe pas
Lancer l'entretien complet décrit plus bas, section par section, pour créer le fichier depuis zéro.

### S'il existe déjà
- Ne jamais relancer tout l'entretien à l'aveugle, et ne jamais réécrire le fichier sans dire à l'utilisateur ce qui va changer.
- Lire le fichier existant.
- En faire un résumé très court, en langage courant, sans montrer le YAML brut — par exemple : "Le fichier actuel utilise une ambiance chaleureuse, avec un bleu marine en couleur principale et des coins peu arrondis."
- Demander à l'utilisateur ce qu'il souhaite faire, avec des choix du type :
  - Ajuster un point précis (une couleur, une police, l'arrondi, une règle...)
  - Ajouter quelque chose qui manque (une section qui avait été sautée, un composant particulier)
  - Tout revoir depuis le début
Selon la réponse :
  - Ajustement précis : ne poser que la ou les questions concernées (par ex. uniquement la question de la section Colors si l'utilisateur veut changer la couleur principale), puis modifier seulement les parties concernées du fichier — le token ET la prose qui va avec — en laissant tout le reste identique. Vérifier ensuite que le changement reste cohérent avec le reste du fichier (ex. si la nouvelle couleur ne contraste plus assez avec le fond, le signaler et proposer un ajustement plutôt que de l'appliquer telle quelle).
  - Ajout d'un élément manquant : ne poser que les questions nécessaires pour cette section ou ce composant, l'ajouter au fichier existant à sa place dans l'ordre imposé par la spec, et le retirer du tableau omitted s'il y figurait.
  - Tout revoir : reprendre l'entretien complet depuis le début, comme pour une création, puis remplacer le fichier existant une fois l'entretien terminé.

Dans tous les cas de mise à jour partielle, éditer le fichier existant plutôt que de le régénérer entièrement à partir de rien : cela évite de perdre des choix ou du contenu que l'utilisateur aurait pu ajuster à la main entre deux sessions.

## Comment poser les questions

- Toujours des questions simples, compréhensibles par un non designer. Par exemple, demander "Quelle ambiance générale voulez-vous pour votre projet ?" plutôt que "Quel style de design system souhaitez-vous ?".
- Une seule question par appel, pour garder le rythme d'une conversation.
- Inclure des suggestions concrètes dans la question, plutôt que de demander à l'utilisateur de deviner les options possibles, avec des boutons à cliquer si possible, ou un texte libre si c'est plus pertinent pour la question.
- Toujours inclure une option du type "Je ne sais pas / autre" quand c'est pertinent — ou, plus simple encore, préciser dans la phrase d'accompagnement que l'utilisateur peut aussi taper sa propre réponse au lieu de cliquer.


Entre deux questions, ne pas résumer ni justifier longuement chaque réponse : un accusé de réception bref ("Parfait, on part sur une ambiance chaleureuse.") suffit avant d'enchaîner sur la question suivante, pour garder le rythme.

## Déroulé de l'entretien

Suivre cet ordre, qui correspond à l'ordre des sections du DESIGN.md final.

Sauter une section si l'utilisateur indique clairement qu'elle n'est pas pertinente pour son projet (dans ce cas, elle sera listée dans `omitted` — voir plus bas).

### 1. Overview (identité et ambiance)

- Demander le **nom** du projet (texte libre) et une **description courte** (1-2 phrases).
- Demander à quel public le projet s'adresse (des enseignants, des élèves, des parents d'élèves …).
- Demander à l'utilisateur s'il a une image (capture d'écran) à donner qui pourrait servir d'inspiration, ou l'adresse d'un ou deux sites dont il apprécie le design : si c'est le cas, consulter et analyser ces images ou sites pour en extraire les choix par défaut et pour pouvoir proposer pour chaque question quelque chose qui s'approche de ces images ou sites.
- Si l'utilisateur n'a pas donné d'images ou de sites, demander l'**ambiance générale** en une question à choix : par exemple "Sobre et professionnel", "Chaleureux et humain", "Moderne et minimaliste", "Ludique et coloré" (ce sont les 4 préréglages de `./references/style-presets.md` — les décrire en une formule parlante plutôt que par leur nom de code). C'est la réponse la plus structurante : elle détermine le préréglage utilisé pour tout le reste, sauf si l'utilisateur précise ensuite des couleurs ou polices différentes.

Rédiger ensuite un paragraphe de présentation (section Overview) à partir de ces réponses, Sans jargon.

### 2. Colors

Partir des images, des sites donnés par l'utilisateur ou du préréglage choisi à l'étape 1. Poser une question du type "Voici la palette que je propose : [palette] [décrire les 3-4 couleurs en mots, pas juste en hexa]. Ça vous convient, ou vous avez une couleur en tête (par
exemple la couleur de votre logo) ?" avec des options du type "Cette palette me convient" / "J'ai une couleur précise à indiquer" / "Voir une autre ambiance".

Si l'utilisateur donne une couleur précise, vérifier que cette couleur est accessible (contraste suffisant avec le fond) et cohérente avec l'ambiance générale. Si elle est trop criarde ou peu lisible, proposer une alternative plus sobre et accessible, en expliquant pourquoi.

Une fois la couleur principale choisie, l'utiliser comme `primary` et ajuster le reste de la palette autour (`secondary`, `tertiary`, `background`, `surface`, `text-primary`, `text-secondary`) pour que tout reste harmonieux et accessible.

Rédiger ensuite un paragraphe de présentation (section Colors) à partir de ces réponses, sans jargon.

### 3. Typography

Demander à l'utilisateur la ou les deux polices principales qu'il souhaite utiliser, ou lui proposer un choix de 2-3 polices cohérentes avec l'ambiance générale.

Vérifier que la police est simple, lisible et accessible, et qu'il s'agit d'une police libre de droits.

Demander ensuite la taille de confort du texte : "Standard", "Confortable / grand" (Aéré), "Compact" (Dense) — ajuster l'échelle typographique commune en conséquence (voir references/style-presets.md).

### 4. Layout

Une question sur la densité : "Standard équilibré", "Aéré et respirant", "Dense et compact" — cela détermine directement l'échelle `spacing` à utiliser (voir `./references/style-presets.md`).

Rédiger un court paragraphe de prose expliquant la logique de mise en page (grille simple centrée, pleine largeur, etc.) — pas besoin de tout demander à l'utilisateur ici, une phrase de bon sens à partir des réponses précédentes suffit, sauf s'il précise une contrainte particulière.

### 5. Elevation & Depth

Une question : "Préférez-vous un peu de relief (ombres douces), ou un style complètement plat ?" avec 2-3 options tirées de `./references/style-presets.md`. Cette section reste uniquement de la prose, il n'y a pas de token dédié dans la spécification.

### 6. Shapes

Une question sur la forme des coins : "Très arrondis", "Légèrement arrondis", "Anguleux", "Complètement carrés" — détermine directement l'échelle `rounded` (voir `./references/style-presets.md`).

### 7. Components

Demander à l'utilisateur s'il souhaite des composants particuliers (boutons, champs de texte, cases à cocher, etc.) ou s'il préfère se limiter aux composants de base. Si l'utilisateur ne sait pas quoi répondre, proposer par défaut les composants de base.

Demander à l'utilisateur s'il souhaite laisser ajuster automatiquement les couleurs, polices et espacements des composants à partir des choix précédents, ou s'il préfère les définir lui-même. Par défaut, proposer l'option automatique. Sinon, poser des questions simples pour chaque composant que l'utilisateur veut. S'assurer que les composants restent cohérents avec l'ambiance générale et les choix précédents.

### 8. Do's and Don'ts

Partir des images, des sites donnés par l'utilisateur ou du préréglage choisi à l'étape 1 pour extraire quelques règles à faire valider par l'utilisateur.

Demander à l'utilisateur s'il veut ajouter ses propres règles.

Vérifier que l'ensemble est cohérent et reste dans une charte graphique simple et accessible.
Si ce n'est pas le cas, le signaler, expliquer pourquoi et proposer des ajustements.

## Construire le fichier final

Une fois l'entretien terminé, écrire le fichier `DESIGN.md` en respectant strictement le format décrit dans `./references/spec.md` :

- Frontmatter YAML entre deux lignes `---`, avec `version: alpha`, `name`, puis `colors`, `typography`, `spacing`, `rounded`, `components` — uniquement les groupes de tokens réellement utilisés.
- Si une section a été volontairement sautée pendant l'entretien, l'ajouter au tableau `omitted` du frontmatter avec la raison donnée par l'utilisateur si elle existe.
- Corps Markdown avec les sections dans l'ordre imposé par la spec : Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts — en `##`, sans en inventer d'autres. Chaque section de couleur/typographie/espacement/arrondi doit présenter les valeurs en prose (nom descriptif + valeur) avant/à côté du token, comme dans les exemples de `./references/spec.md`.
- Vérifier à la fin : un seul jeu de tokens par groupe, pas de doublon de titre de section, les couleurs sont bien des couleurs CSS valides, les dimensions ont bien une unité (`px`, `em` ou `rem`).

À la fin, dire simplement : "Le fichier DESIGN.md est prêt, vous pouvez l'ouvrir pour le consulter et l'ajuster si nécessaire." et renvoyer un lien vers le fichier `.plan/DESIGN.md` pour que l'utilisateur puisse l'ouvrir directement.

## Sauvegarde et présentation

Écrire le fichier dans `.plan/DESIGN.md`,
Ne pas coller l'intégralité du contenu dans le chat en plus du fichier — l'utilisateur peut l'ouvrir directement.

Si l'utilisateur souhaite ensuite ajuster un point précis (une couleur, une police...), éditer directement le fichier existant plutôt que de relancer tout l'entretien.
