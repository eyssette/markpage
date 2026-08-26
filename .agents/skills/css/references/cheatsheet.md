# Aide-mémoire Baseline 2020

Cette fiche résume les catégories de features CSS les plus fréquentes.

Pour une vérification exhaustive et à jour, préférer le script
`scripts/check_baseline_css.py`, qui s'appuie sur `references/baseline_2020_data.json`
(généré depuis le paquet `web-features` du WebDX Community Group). Cette
fiche n'est qu'un résumé pour orienter rapidement l'écriture de CSS.

Rappel : "Baseline 2020" = toute feature devenue interopérable dans les
navigateurs principaux (Chrome/Edge, Firefox, Safari) au plus tard le
31 décembre 2020. C'est une cible fixe, pas "Baseline widely available"
aujourd'hui (qui bouge chaque année).

## ✅ Sûr à utiliser SANS précaution (Baseline 2020 ou antérieur)

### Layout & positionnement
- `display: flex`, `display: grid`, `display: inline-flex`, `inline-grid`
- `flex-direction`, `flex-wrap`, `flex-flow`, `justify-content`, `align-items`, `align-content`, `align-self`
- `grid-template-columns`, `grid-template-rows`, `grid-auto-rows`, `grid-auto-columns`, `grid-column`, `grid-row`
- **⚠️ `gap` (uniquement pour CSS Grid)** – pour **Flexbox**, `gap` n’est **pas** sûr (Safari 14.1+). Préférez `margin` sur les enfants ou un `@supports (gap: 10px)`.
- `box-sizing: border-box`, `position: absolute` / `relative` / `fixed` / `sticky` *(sticky OK sur éléments classiques, attention aux bugs Safari sur `<thead>` / `overflow:hidden`)*
- `float`, `clear` (legacy, toujours supportés)

### Visuel & effets
- `border-radius`, `box-shadow`, `text-shadow`, `opacity`
- `transform` : 2D **et** 3D (`translate`, `scale`, `rotate`, `skew`, `rotateX`, `perspective`, etc.)
- `transition`, `animation` / `@keyframes`
- `filter` (les fonctions classiques : `blur()`, `grayscale()`, `brightness()`, `contrast()`, `drop-shadow()`, `hue-rotate()`, `invert()`, `saturate()`, `sepia()`)

### Couleurs & dégradés
- **Couleurs** : `rgb()`, `rgba()`, `hsl()`, `hsla()` **uniquement en syntaxe classique** (ex: `rgba(255,0,0,0.5)`).  
  ⚠️ **Évitez** la syntaxe moderne `rgb(255 0 0 / 0.5)` (Safari 15+).
- `currentColor`, `transparent`
- **Dégradés** : `linear-gradient()`, `radial-gradient()`, `repeating-linear-gradient()`, `repeating-radial-gradient()`.  
  ⚠️ `conic-gradient()` n’est **pas** sûr (Safari 15.4+).

### Fonctions & valeurs
- `calc()`, `var()` (custom properties)
- `min()`, `max()`, `clamp()` – sûrs (Baseline atteinte en milieu d’année 2020, mais c’est juste à la limite ; préférez les protéger si vous voulez être ultra-serein).
- `object-fit` / `object-position` (pour les images/vidéos)

### Unités
- `px`, `%`, `em`, `rem`, `ex`, `ch` (sûres depuis longtemps)
- `vw`, `vh`, `vmin`, `vmax` (sûrs)
- `fr` (unité de grid), `deg`, `rad`, `turn`, `grad`, `s`, `ms`

### Sélecteurs (tous sûrs)
- Classes (`.`), ID (`#`), attributs (`[type="text"]`)
- Combinateurs : ` ` (descendant), `>` (enfant), `+` (frère adjacent), `~` (frères généraux)
- Pseudo-classes : `:hover`, `:focus`, `:active`, `:visited`, `:link`
- Pseudo-structurelles : `:first-child`, `:last-child`, `:nth-child()`, `:nth-of-type()`, `:nth-last-child()`, `:first-of-type`, `:last-of-type`, `:empty`
- Pseudo-classes d’état : `:enabled`, `:disabled`, `:checked`, `:indeterminate`, `:default`
- Pseudo-classes relatives au focus parent : `:focus-within` (sûr)
- Pseudo-éléments : `::before`, `::after`, `::first-line`, `::first-letter`, `::selection`
- `:not()` **avec un seul sélecteur simple** (ex: `:not(.classe)`, `:not(#id)`).  
  ⚠️ `:not()` avec une **liste complexe** (`:not(.a, .b)`) n’est PAS sûr (2021).

### Règles @ (At-rules)
- `@media` (toutes les features classiques : `min-width`, `max-width`, `orientation`, `prefers-color-scheme` – celle-ci est supportée depuis 2019, donc OK)
- `@font-face`, `@import` (attention aux perfs, mais syntaxe supportée)
- `@supports` (très utile pour les fallbacks, supporté depuis 2013)
- `@page` (pour l’impression), `@keyframes` (animations)

### Divers / Propriétés de confort
- `touch-action: manipulation` (désactiver le zoom sur les boutons, sûr)
- `caret-color` (couleur du curseur de saisie, sûr)
- `will-change` (optimisation, sûr – à utiliser avec parcimonie)
- `user-select: none` (avec le préfixe `-webkit-user-select` + `user-select`, sûr)
- `hyphens: auto` (césure automatique, support large)
- `overflow: hidden` / `auto` / `scroll`, `resize` (classiques)

### Custom properties (variables CSS)
- `--ma-variable: valeur;` et `var(--ma-variable, fallback)` – 100 % sûrs.

## ⚠️ À éviter ou à protéger par `@supports` (postérieur à 2020)

Ordonné approximativement par année d'arrivée en Baseline :

| Année | Feature | Alternative / stratégie |
|---|---|---|
| 2021 | `:is()`, `:where()`, `:not()` avec liste de sélecteurs | Dupliquer les sélecteurs manuellement |
| 2021 | Propriétés logiques (`margin-inline`, `inset`, `padding-block`, etc.) | Utiliser les propriétés physiques (`margin-left`, `top`…) |
| 2021 | `aspect-ratio` | Astuce `padding-top` en % ou accepter une déformation |
| 2021 | `subgrid` | Utiliser `grid-template-columns/rows` classique sur l'élément enfant |
| 2022 | `:focus-visible` | Combiner avec `:focus` en repli |
| 2022 | `@layer` (cascade layers) | Gérer l'ordre des règles manuellement dans le fichier CSS |
| 2022 | `appearance` (non préfixé) | Garder `-webkit-appearance: none;` en complément |
| 2022 | Unités de viewport dynamiques (`dvh`, `svh`, `lvh`…) | Déclarer un fallback en `vh` avant la règle `dvh` |
| 2022 | `color-scheme`, `scroll-behavior` | `@supports (scroll-behavior: smooth)` |
| 2022 | `object-view-box` | Utiliser `object-position` et `object-fit` |
| 2023 | `:has()` | Pas de repli CSS possible. Dégradation visuelle du layout. Utiliser une structure HTML adaptée en amont (serveur/classes) si possible.|
| 2023 | Container queries (`@container`, `container-type`) | Repli sur les Media Queries classiques (`@media`) |
| 2023 | Imbrication native (`&` / CSS nesting) | Écrire les sélecteurs de manière complète (non imbriquée) |
| 2023 | `color-mix()`, `oklch()`, `oklab()`, `lab()`, `lch()` | Fournir une couleur `rgb()` ou `hsl()` de repli avant la ligne concernée |
| 2023 | Fonctions trigonométriques/exponentielles (`sin()`, `pow()`…) | Utiliser des valeurs fixes calculées manuellement |
| 2023 | `text-wrap: balance` / `pretty` | Utiliser des contraintes de largeur (`max-width`) pour gérer le flux |
| 2024 | CSS Anchor Positioning (`anchor()`, `position-anchor`) | Structure HTML imbriquée (Parent `relative` / Enfant `absolute`) |
| 2024 | `backdrop-filter` (interop totale), masques non préfixés (`mask-*`) | Garder `-webkit-mask-*`, prévoir un rendu sans effet en repli |
| 2024 | Couleurs relatives (`hsl(from ...)`, `rgb(from ...)`) | Utiliser des variables CSS (`--var`) pour gérer les composants de couleur |
| 2024 | `light-dark()` (couleur selon thème) | Utiliser `@media (prefers-color-scheme: dark)` pour redéfinir une variable CSS (Baseline ancienne, donc OK). |
| 2024 | `scroll-timeline` / `view-timeline` | Utiliser les animations CSS classiques ou l'API `IntersectionObserver` en JS pur |
| 2024+ | `@starting-style`, `@scope`, `@function`, `view-transition-*` | Fonctionnalités très récentes : dégradation systématique nécessaire |

## Stratégie de repli (`@supports`)

Pour utiliser une feature récente sans casser les navigateurs plus anciens,
déclarer d'abord la version sûre, puis surcharger dans un bloc `@supports` :

```css
.card {
  background: rgba(0, 0, 0, 0.6); /* repli sûr, Baseline 2020 */
}

@supports (backdrop-filter: blur(4px)) {
  .card {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
  }
}
```

La cascade CSS applique naturellement les déclarations dans l'ordre : un
navigateur qui ne comprend pas `@supports (...)` ignore le bloc entier et
garde le repli du dessus.

Pour les sélecteurs récents comme `:has()`, on peut tester le support du
sélecteur lui-même :

```css
@supports selector(:has(a)) {
  .card:has(img) { border-color: blue; }
}
```
