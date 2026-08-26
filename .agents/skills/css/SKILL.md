---
name: css
description: Écrire ou vérifier du CSS. Vérification du respect des bonnes pratiques et vérification de la compatibilité Baseline 2020. À utiliser dès qu'on veut écrire, éditer, relire ou auditer du style CSS.
argument-hint: "<fichier CSS à vérifier>"
agent: "agent"
---

# Bonnes pratiques CSS et compatibilité Baseline 2020

L'objectif est de **produire** ou de **vérifier** du CSS donné en entrée.

## IMPORTANT : Workflow

### 1/ Vérification de la présence d'un design de référence
Il faut d'abord vérifier s'il existe un fichier `.plan/DESIGN.md` dans le projet.
- Si oui, il faut demander à l'utilisateur s'il veut l'utiliser comme référence pour la vérification du CSS.
- Si non, il faut demander à l'utilisateur s'il veut d'abord créer un fichier `.plan/DESIGN.md` avant de continuer, et utiliser alors la skill `design-md` pour générer un plan de design initial.

### 2/ Tâche à identifier : produire ou vérifier du CSS
Ensuite, il faut voir si l'utilisateur veut **produire** du CSS ou **vérifier** du CSS existant.

### 3/ Workflow pour chaque tâche

#### Cas 1 : S'il faut **produire** du CSS
- écrire le CSS en respectant les règles de bonnes pratiques ci-dessous,
  - écrire en priorité le CSS dans le fichier `app/css/style.css`
  - s'il faut découper le CSS, créer un fichier par composant/layout dans `app/css/components/` ou `app/css/layouts/` et importer chaque fichier à la suite au début de `app/js/main.js`.
- vérifier la compatibilité la Baseline 2020, avec le script python fourni (`check_baseline_css.py` dans `references/scripts/`).

#### Cas 2 : S'il faut **vérifier** du CSS existant :
- vérifier que les règles de bonnes pratiques ci-dessous sont respectées,
- vérifier la compatibilité la Baseline 2020, avec le script python fourni (`check_baseline_css.py` dans `references/scripts/`).
- écrire un rapport de vérification détaillé, avec les problèmes détectés et les solutions possibles dans un fichier. `.report/css-audit/YYYY-MM-DD-HHMMSS.md` (où `YYYY-MM-DD-HHMMSS` est la date et l'heure de l'audit).
- en cas de problèmes :
  - Si les problèmes sont simples, proposer des corrections directes.
  - Si les problèmes sont nombreux ou complexes, proposer un plan de correction étape par étape et demander à l'utilisateur s'il veut corriger ou ignorer chaque problème, en avançant petit à petit et sous le contrôle de l'utilisateur.

## Objectifs et règles de base

Le CSS doit être :
- **maintenable** pour que le code reste lisible, compréhensible et puisse être modifié facilement ;
- **modulaire**, mais sans excès, pour que le code CSS soit facile à réutiliser et à adapter, sans complexité inutile.
- **structuré** pour que le code CSS soit organisé de manière logique, avec des conventions claires et cohérentes.
- **performant** pour que le rendu soit rapide et fluide, sur tous les appareils, même anciens et tous les types d'écrans (mobile-first, mais aussi desktop responsive).
- **accessible** pour que le contenu soit utilisable par tous, y compris les personnes en situation de handicap.
- **compatible** avec la Baseline 2020 pour garantir un rendu correct sur une large gamme de navigateurs (y compris anciens) ;

- Aucun préprocesseur CSS (Sass, Less, PostCSS…) ne doit être utilisé.
- Aucun framework CSS (Bootstrap, Tailwind, Material…) ne doit être utilisé.
- Aucune librairie CSS externe ne doit être utilisée (normalize.css, reset.css, etc.).
- Aucune police de caractères externe ou icône externe ne doit être utilisée (CDN, Google Fonts, FontAwesome…), mais s'il la police ou l'icône est libre et open-source, elle peut être auto-hébergée.

## Bonnes pratiques CSS

Voici quelques bonnes pratiques à respecter pour écrire du CSS maintenable, modulaire, structuré, performant et accessible (compatible Baseline 2020).

### 1/ Architecture et nommage (modularité raisonnée)

- **Structure physique du fichier** (si un seul fichier ou regroupé par composants) :
  1.  **Variables & Reset** (`:root`, reset léger avec `box-sizing: border-box` : voir le fichier `references/reset.css` pour l'appliquer s'il n'est pas déjà présent).
  2.  **Éléments de base** (balises HTML nues : `body`, `h1…h6`, `p`, `a`, `ul`).
  3.  **Layouts** (grids, conteneurs, espacements structurels).
  4.  **Composants UI** (boutons, cartes, modales, formulaires).
  5.  **Utilitaires ponctuels** (ex : `.text-center`, `.hidden-visually` – très peu).
- **Nommage** (variante BEM allégée) :
  - **Sémantique fonctionnelle** : Utiliser des noms de classes fondés sur le rôle (`.card`, `.card__title`) et **jamais** sur l'apparence (`.blue-bg`, `.big-font`).
  - **Gestion des états (States)** : Distinguer le style structurel de l'état dynamique en utilisant un préfixe spécifique (ex: `.is-`) pour les classes d'état (exemple : `.is-active`, `.is-loading`, `.is-invalid`, …). Cela permet de séparer la logique de design de la logique métier/JS.
  - **Modificateurs** : Utiliser le double tiret pour les variantes de design (`.card--featured`).
  - **Éviter le contexte** : Ne pas utiliser de sélecteurs descendants lourds (`.sidebar .widget .title`) ; préférer une classe unique et plate (`.widget-title`).
  
  - Utiliser des noms de classes sémantiques (rôle fonctionnel) : `.card`, `.card__title`, `.card--highlight`.
  - **Jamais** de noms basés sur l’apparence visuelle (`.blue-bg`, `.big-font`) → la valeur change, le nom reste faux.
  - Éviter les sélecteurs contextuels du type `.sidebar .widget .title` : préférer une classe unique `.widget-title` directement sur l’élément cible.
- **Échelle de z-index** maîtrisée : ne jamais poser une valeur arbitraire (z-index: 9999). Définir une échelle limitée en variables CSS, par exemple :
  ```css
  :root {
    --z-dropdown: 10;
    --z-modal: 100;
    --z-tooltip: 300;
    --z-toast: 1000;
  }
  ```

**Découpage en fichiers** (si le projet grossit) : un fichier par composant/layout.
Tant que le projet reste petit, un seul fichier organisé selon la structure ci-dessus reste acceptable.

### 2/ Spécificité et cascade (zéro `!important`)

- **Interdiction formelle de `!important`**, sauf cas exceptionnel et documenté (ex : utilité de forçage d’affichage dans une librairie tierce). En pratique :
  - Pour surcharger un style, augmenter _légèrement_ la spécificité avec une seconde classe (`.btn.btn-primary`) ou un attribut `[type="submit"]`.
  - Réorganiser l’ordre des règles dans la source plutôt que d’alourdir les sélecteurs.
- **Limiter l’imbrication à 3 niveaux maximum** (ex : `.menu > .menu__item > .menu__link`). Au-delà, le sélecteur devient trop spécifique et difficile à maintenir.
- **Bannir les sélecteurs d’ID** pour le style (`#header`) – réserver les ID au JavaScript ou aux ancres.


### 3/ Unités et mise en page fluide (adaptative)

- **Tailles de police** : exclusivement en `rem` (ex : `font-size: 1.125rem`). Ne jamais utiliser `px` pour le texte, afin de respecter les préférences de zoom du navigateur.
- **line-height sans unité** : toujours définir une valeur sans unité (ex : `line-height: 1.5`) plutôt qu'en px ou em.
- **Largeurs / espacements** :
  - `%`, `fr` (pour les Grid), `auto`, `vw` / `vh` avec précaution.
  - Utiliser `max-width` et `min-width` pour contraindre les blocs, jamais `width` en valeur fixe sauf cas très spécifique (icônes).
  - Pour les blocs de texte longs, limiter la largeur avec max-width: 65ch pour optimiser le confort de lecture.
  - Pour les champs de formulaire (<input>), l'unité ch est utile pour dimensionner la largeur en fonction du nombre de caractères attendus (ex : width: 6ch pour un code postal).
- **Bannir les valeurs "magiques"** : ne pas utiliser de nombres arbitraires et non documentés (margin-top: 37px). S'appuyer sur une échelle d'espacement cohérente (voir §5) construite sur une unité de base (ex : multiples de 4px ou 8px).
- **Tailles fluides** (compatible 2020) : utiliser `clamp()` pour les titres ex :  `font-size: clamp(1.5rem, 4vw, 3rem);` _(supporté sur tous les navigateurs Baseline 2020)_.
- **Images / médias** : `max-width: 100%; height: auto;` pour le responsive. **`aspect-ratio` n’est pas fiable en 2020** → utiliser la technique du `padding-bottom` (ex : `padding-bottom: 56.25%` pour un ratio 16/9) sur un conteneur avec `position: relative`, et l’élément interne en `position: absolute; inset: 0;`.
- **Images** : Utiliser `object-fit: cover;` pour maintenir les proportions des images dans des conteneurs fixes sans les déformer.


### 4/ Media Queries : mobile-first et regroupées

- Écrire le style **mobile** en premier (sans media query). Ajouter ensuite des blocs `min-width` croissants :
  ```css
  .element { font-size: 1rem; }
  @media (min-width: 600px) { … }
  @media (min-width: 1024px) { … }
  ```
- **Ne pas mélanger** `min-width` et `max-width` dans le même projet, sauf pour des correctifs très isolés (une seule approche évite les conflits de cascade).
- Regrouper **toutes** les règles d’un même breakpoint en un seul bloc `@media`, plutôt que de les disperser dans le fichier.


### 5/ Variables CSS (Custom Properties) robustes

- **Préférer les variables CSS aux valeurs fixes** :
  - Toujours utiliser des variables CSS pour les couleurs, espacements, tailles et autres valeurs réutilisables, mais ne pas multiplier les valeurs fixes dans le code.
  - Mettre les variables dans `:root` pour les valeurs globales, et surcharger dans des classes contextuelles (ex : `.theme-dark`) ou dans des composants spécifiques.
  - Il faut prévoir la gestion d'un thème clair et d'un thème sombre, avec des variables CSS pour chaque couleur
  - Si un composant a des variantes (ex : `.card--highlight`), définir les variables sur le composant parent et les utiliser dans les enfants en changeant la valeur selon la variante pour ne modifier que la valeur, pas une règle entière.
- **Nommage par rôle métier/fonctionnel** :  
  `--primary-color`, `--vertical-spacing`, `--border-radius` – **jamais** `--blue-dark` ou `--px-16`.
- **Échelle d'espacement typée** : définir une série de variables d'espacement nommées par taille plutôt qu'une seule variable générique, par exemple :
  ```css
  :root {
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-m: 1rem;
    --space-l: 1.5rem;
    --space-xl: 2.5rem;
  }
  ```
- **Valeur de secours (fallback)** : toujours envisager un second argument à var() quand une variable pourrait être absente : color: var(--primary-color, #333);.
- **Calculs complexes** : utiliser `calc()` avec des variables (ex : `calc(var(--base) * 1.5)`).


### 6/ Ordre des déclarations (lisibilité et diffs)

Dans chaque règle, regrouper les propriétés selon la logique suivante (du plus extérieur au plus intérieur) :

1.  **Positionnement** (`position`, `top`, `right`, `bottom`, `left`, `z-index`)
2.  **Modèle de boîte** (`display`, `flex`/`grid` spécifiques, `width`, `height`, `margin`, `padding`, `border`, `border-radius`, `box-sizing`)
3.  **Typographie** (`font-*`, `line-height`, `text-*`, `letter-spacing`, `color`)
4.  **Arrière-plan et visuel** (`background`, `box-shadow`, `opacity`, `filter`, `transition`, `transform`)
5.  **Divers** (`cursor`, `overflow`, `will-change`, etc.)

**Une déclaration par ligne** – jamais de règles sur la même ligne.


### 7/ Accessibilité (a11y) impérative

- **Focus visible** :  
  Ne **jamais** supprimer `outline` sans la remplacer immédiatement par un indicateur visible (ex : `box-shadow: 0 0 0 3px #ffbf47;`).  ⚠️ `:focus-visible` n’est pas supporté par Safari avant 2022 (hors baseline 2020). On utilise donc `:focus` comme socle obligatoire, et on peut ajouter `:focus-visible` en surcouche via `@supports` (progressive enhancement), mais **jamais** en remplacement.
- **Navigation au clavier & Ordre de tabulation** :
  - **Ordre logique** : L'ordre de tabulation doit suivre l'ordre visuel de la page. Ne jamais utiliser de propriétés comme `order` (Flexbox/Grid) ou des positions absolues pour déplacer visuellement un élément sans changer sa place dans le code HTML.
  - **Interdiction du `tabindex` positif** : Ne **jamais** utiliser `tabindex="1"` (ou plus). Cela casse l'ordre naturel du navigateur et crée une expérience de navigation chaotique. Si un élément doit être focusable, utilise `tabindex="0"` (pour l'ajouter à l'ordre) ou `tabindex="-1"` (pour le rendre focusable uniquement via JS).
  - **Éléments interactifs** : S'assurer que tous les éléments cliquables (boutons, liens) sont réellement accessibles au clavier. Pour cela, utiliser les éléments HTML natifs (`<button>`, `<a>`, `<input>`) plutôt que des éléments génériques avec des rôles ARIA.
- **Couleurs et contrastes** : ne pas se fier uniquement au code ; veiller à un ratio de contraste ≥ 4.5:1 pour le texte courant. Utiliser des couleurs en HSL ou variables nommées pour faciliter les ajustements.
- **Débordement de texte** : appliquer `overflow-wrap: break-word;` sur les zones de texte libre pour éviter qu'un mot long (URL, adresse e-mail) ne casse la mise en page.
- **Icônes SVG intégrées** : utiliser `fill: currentColor;` (ou `stroke: currentColor;`) pour que l'icône hérite automatiquement de la couleur du texte environnant, plutôt que de dupliquer une couleur fixe.
- **color-scheme** : déclarer `color-scheme: light dark;` sur `:root` (propriété supportée en Baseline 2020) pour que les éléments natifs du navigateur (scrollbars, champs de formulaire, sélecteurs) s'adaptent correctement au thème choisi par l'utilisateur.
- **:focus-within** : supporté en Baseline 2020 (Safari 10.1+), cette pseudo-classe peut être utilisée pour styler un conteneur (ex : un menu ou un groupe de formulaire) dès qu'un de ses enfants reçoit le focus, utile pour des interactions sans JavaScript.
- **Réduction de mouvements** : toutes les animations (`transitions`, `keyframes`) doivent être conditionnées :
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
  _(le `!important` est toléré dans ce seul cas documenté, pour l'accessibilité)._


### 8/ Performance CSS (render et réseau)

- **Sélecteurs simples et peu coûteux** : éviter les sélecteurs attributs complexes (`[class*="..."]`) sur des éléments très nombreux, et bannir le sélecteur universel `*` en combinaison avec des descendants.
- **Animations performantes** :
  - Animer uniquement `transform` et `opacity` (ces propriétés sont gérées par le compositeur GPU).
  - Éviter d’animer `width`, `height`, `top`, `left`, `margin` (déclenchent des reflows coûteux).
- **`will-change`** : utiliser avec une extrême parcimonie, uniquement sur les éléments ayant une animation permanente et connue. Ne jamais l’appliquer à des centaines d’éléments.
- **contain** : support partiel en 2020 (Safari notamment) → à éviter pour l'instant, au même titre que les autres propriétés listées en §9.
- **Police de caractères** : utiliser `font-display: swap` dans les `@font-face` pour ne pas bloquer le rendu du texte.


### 9/ Contraintes strictes liées à la Baseline 2020 (pièges à éviter)

- **`gap` en Flexbox** n’est pas supporté par Safari avant 14.1 (2021). → Utiliser `gap` **uniquement** pour les grilles CSS (`display: grid`). Pour les flexbox, employer des marges sur les enfants avec un sélecteur `:not(:last-child)`.
- **`aspect-ratio`** : non supporté avant Safari 15 (2021). → Utiliser la technique du `padding-top` / `padding-bottom` en pourcentage.
- **`:is()`, `:where()`, `:has()`** : à proscrire (support trop récent ou partiel).
- **Sélecteurs imbriqués natifs (CSS Nesting)** : non supportés. Aucun préprocesseur CSS ne doit être utilisé pour générer du CSS imbriqué.
- **`place-items` / `place-content`** : préférer les propriétés individuelles `align-items` + `justify-items` pour éviter des bugs dans Safari 13.1.
- **Variables CSS dans les media queries** (`@media (min-width: var(--bp))`) : non supporté → toujours écrire les valeurs de breakpoints en dur dans les @media.
- **`scroll-behavior: smooth`** : supporté, mais ne pas en dépendre pour la navigation critique (le fallback reste un saut instantané).

### 10/ Polices de caractères (font-family) et icônes

- Ne jamais utiliser de polices propriétaires ou non libres. Utiliser des polices libres et open-source.
- Ne pas utiliser de CDN ou de polices externe. Préférer l’auto-hébergement des polices pour éviter les problèmes de disponibilité et de performance.
- Ne jamais imposer le choix d'une police à l'utilisateur. Toujours faire valider le choix de la police par l'utilisateur.

- Ne jamais utiliser d'icônes propriétaires ou non libres. Utiliser des icônes libres et open-source.
- Ne pas utiliser de CDN ou d'icônes externe. Préférer l’auto-hébergement des icônes pour éviter les problèmes de disponibilité et de performance.
- Ne jamais imposer un choix d'icônes : toujours faire valider le choix d'icônes par l'utilisateur.

### 11/ Commentaires et documentation interne

- Commenter **le pourquoi** si nécessaire, jamais le quoi (le code est auto-suffisant).
- Utiliser des blocs de commentaires pour délimiter les sections (ex : `/* === COMPOSANTS : CARTES === */`).
- Documenter toute dérogation aux règles ci-dessus (ex : un `!important` justifié) avec une référence claire.


**À retenir pour l’agent IA** : chaque règle écrite doit prioriser la **lisibilité humaine** et la **résilience**. En cas de doute entre deux solutions, choisir celle qui utilise le moins de sélecteurs, le moins de propriétés spécifiques et la plus grande clarté sémantique.

### 12/ Style d'impression

Si le contenu peut être imprimé, prévoir un bloc `@media print` dédié :

- Masquer les éléments non pertinents à l'impression (navigation, boutons, ...).
- Afficher les URLs des liens en clair si utile au contexte : `a[href]::after { content: " <" attr(href) ">"; }`.
- Forcer un fond blanc et un texte noir pour économiser l'encre, sauf besoin graphique spécifique.
- Ne pas dépendre de `transform` / `transition` à l'impression, ces propriétés sont ignorées par la plupart des moteurs de rendu papier.


## Compatibilité

1. **Toujours vérifier avec le script** avant de considérer le travail terminé : `python3 ./agents/skills/css/scripts/check_baseline_css.py path/vers/fichier.css`. Le script ne dépend d'aucune bibliothèque externe (Python standard uniquement). Il accepte plusieurs fichiers, `--json` pour une sortie machine, et `-` pour lire depuis stdin. Code de sortie 0 = rien à signaler, 1 = au moins une fonctionnalité post-2020 détectée (utilisable comme porte de CI).
2. **Pour chaque avertissement**, le signaler à l'utilisateur et lui demander s'il veut corriger ou ignorer. Le script fournit des pistes de repli.
3. **Ne pas faire aveuglément confiance à un avertissement isolé** : le script est un scanner par expressions régulières, pas un vrai parseur CSS, et les données sous-jacentes regroupent parfois plusieurs variantes d'une même fonctionnalité sous un identifiant commun. En cas de doute sur un résultat qui semble faux, vérifier sur [caniuse.com](https://caniuse.com) ou le badge Baseline de la page MDN correspondante avant de réécrire du code inutilement.

### Règles de compatibilité Baseline 2020 (résumé)

Voir `references/cheatsheet.md` pour la liste détaillée des catégories sûres et à risque, ainsi que le patron `@supports` de repli.