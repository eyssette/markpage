<!-- Tokens de couleur alignés sur la convention primary/secondary/tertiary/neutral
     recommandée par references/spec.md et utilisée telle quelle par SKILL.md
     (génération automatique des boutons/champs, étape "Components"). Ne pas
     renommer ces quatre clés sans mettre à jour SKILL.md en conséquence. -->

# Préréglages de style

Ces préréglages transforment un choix simple d'ambiance en valeurs concrètes de design : couleurs, typographie, espacements et arrondis.

Ils privilégient systématiquement :

* la lisibilité ;
* le contraste ;
* la simplicité ;
* une hiérarchie visuelle claire ;
* un nombre limité de couleurs ;
* des composants faciles à comprendre et à utiliser.

L'utilisateur n'a pas besoin de connaître un code couleur ou un nom de police.

Le préréglage **A. Sobre et professionnel** est le choix par défaut lorsqu'aucune préférence claire n'est exprimée.

Les différences entre les préréglages doivent principalement venir de la **typographie, des proportions, de la palette et du rythme visuel**, et non d'effets décoratifs.

Un préréglage peut être ajusté si l'utilisateur fournit une couleur, une police ou une contrainte de marque précise.

### Convention de nommage des couleurs

Chaque préréglage définit quatre tokens de base, dans ce rôle fixe :

| Token | Rôle |
|---|---|
| `primary` | Texte fort, titres |
| `secondary` | Texte secondaire, légendes, **et** contours (voir ci-dessous) |
| `tertiary` | Couleur d'action : liens, boutons principaux, éléments qui demandent de l'attention |
| `neutral` | Fond de page |

Un cinquième token optionnel, `neutral-muted`, donne un fond de surface secondaire (cartes, sections, zones mises en retrait). C'est un token additionnel toléré par le format mais non obligatoire — ne pas l'utiliser dans la logique de génération automatique des boutons/champs de `SKILL.md`, qui ne s'appuie que sur les quatre tokens de base.

Le preset D ajoute un sixième token optionnel, `tertiary-alt`, pour une touche de couleur secondaire — voir sa fiche.

**Il n'y a volontairement pas de token `border` séparé.** Un contour utilise `secondary` :

* **à pleine intensité** pour tout élément dont le contour doit être identifiable comme interactif (champ de texte, case à cocher, bouton secondaire) — le contraste de `secondary` contre `neutral` est vérifié ≥ 3:1 (généralement ≥ 5:1) dans chaque préréglage ci-dessous ;
* **en version atténuée** (teinte très claire du même `secondary`, ~15–20 % d'intensité) pour les séparateurs purement décoratifs (ligne entre deux sections, contour discret d'une carte déjà séparée par de l'espace).

Ne jamais utiliser la version atténuée seule pour délimiter un élément cliquable : dans ce cas, soit garder `secondary` à pleine intensité, soit ajouter un fond `neutral-muted` derrière l'élément pour que sa zone reste repérable même avec un contour discret.

---

## Règles d'accessibilité

Ces règles s'appliquent à tous les préréglages.

* Le texte courant doit rester très contrasté avec son arrière-plan.
* Ne jamais utiliser une couleur d'accent claire comme couleur de texte sur un fond clair.
* Vérifier le contraste des textes, contrôles et éléments interactifs.
* Un contour à lui seul doit atteindre au moins 3:1 contre le fond s'il est le seul moyen d'identifier un élément interactif (voir la règle `secondary` ci-dessus) — sinon l'accompagner d'un fond `neutral-muted`.
* Ne jamais utiliser la couleur seule pour communiquer un état ou une information.
* Les liens doivent être identifiables sans dépendre uniquement de la couleur.
* Les éléments interactifs doivent avoir un état `focus` clairement visible. Réutiliser `tertiary` comme couleur d'anneau de focus (son contraste contre `neutral` est déjà vérifié dans chaque préréglage) plutôt qu'introduire une couleur dédiée.
* Les zones cliquables doivent être suffisamment grandes pour être utilisées confortablement.
* Ne pas utiliser les majuscules ou l'espacement des lettres comme seul moyen de créer une hiérarchie.
* Préférer les différences de taille, graisse, espacement et surface aux effets visuels complexes.
* Les animations doivent rester discrètes et ne jamais être nécessaires à la compréhension de l'interface.

---

## Couleurs sémantiques communes (erreur / succès)

Utilisées par tous les préréglages pour les messages d'état, en plus de la palette propre à chaque ambiance. Elles restent volontairement neutres (universellement reconnaissables comme danger/succès) plutôt que teintées par l'ambiance :

```yaml
color:
  error: "#D92D20"
  success: "#067647"
```

Les deux sont vérifiées ≥ 4.8:1 contre un fond blanc ou quasi blanc (`neutral` des quatre préréglages). Comme le rappellent les règles d'accessibilité : ne jamais s'appuyer sur `error`/`success` seuls — toujours ajouter un texte, une icône ou un libellé.

---

# A. Sobre et professionnel

**Préréglage par défaut.**

Ambiance calme, fiable, institutionnelle et discrète.

### Caractère visuel

* Contraste élevé.
* Peu de couleurs.
* Formes légèrement arrondies.
* Hiérarchie très explicite.
* Peu d'éléments décoratifs.
* Densité moyenne.

### Couleurs

```yaml
color:
  primary: "#17212B"
  secondary: "#5C6670"
  tertiary: "#155EEF"
  neutral: "#FFFFFF"
  neutral-muted: "#F5F7FA"
```

`tertiary` est utilisé pour les liens, les actions principales et les éléments nécessitant une attention particulière. `secondary` sert de texte atténué (contraste ≈ 5.9:1 contre `neutral`) et, à pleine intensité, de contour pour les champs et boutons secondaires.

### Typographie

```yaml
font:
  family: "Public Sans"
  heading-weight: 600
  body-weight: 400
  label-weight: 500
```

Une seule famille de police est utilisée pour conserver une apparence homogène et fonctionnelle. (Convention "famille unique" : voir la note sur les deux structures possibles à la fin du fichier.)

### Formes

```yaml
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
```

Échelle **Standard** — cohérent avec « formes légèrement arrondies ».

### Espacement

Utiliser l'échelle **Standard**.

---

# B. Chaleureux et humain

Ambiance accueillante, naturelle, rassurante et légèrement artisanale.

### Caractère visuel

* Tons chauds et peu saturés.
* Titres plus expressifs.
* Espacement légèrement généreux.
* Formes douces mais contenues.
* Hiérarchie moins rigide que dans le preset A.
* Sensation de proximité sans devenir ludique.

### Couleurs

```yaml
color:
  primary: "#342821"
  secondary: "#6D6058"
  tertiary: "#8A4B2A"
  neutral: "#FFFDF9"
  neutral-muted: "#F6EFE7"
```

`tertiary` peut être légèrement plus présent que dans le preset A (contraste ≈ 6.6:1 contre `neutral`), tout en restant réservé aux actions, liens et éléments importants. `secondary` (contraste ≈ 6:1) sert de texte atténué et de contour à pleine intensité.

### Typographie

```yaml
font:
  heading-family: "Source Serif 4"
  body-family: "Source Sans 3"
  heading-weight: 600
  body-weight: 400
  label-weight: 600
```

Une serif est réservée aux titres afin d'apporter de la chaleur sans nuire à la lisibilité du texte courant. (Convention "deux familles" : voir la note en fin de fichier.)

Les titres doivent rester courts et suffisamment grands pour que la serif reste lisible.

### Formes

```yaml
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  full: 9999px
```

Échelle **Doux** — rayons plus doux que dans le preset A, sans utiliser de formes excessivement arrondies.

### Espacement

Utiliser l'échelle **Aéré**.

---

# C. Moderne et minimaliste

Ambiance contemporaine, précise, éditoriale et technique.

### Caractère visuel

* Noir et blanc dominants.
* Accent unique et précis.
* Contraste marqué.
* Grille et alignements très nets.
* Peu de bordures décoratives.
* Espacement généreux entre les groupes.
* Formes relativement géométriques.

### Couleurs

```yaml
color:
  primary: "#141414"
  secondary: "#5F6368"
  tertiary: "#005FCC"
  neutral: "#FFFFFF"
  neutral-muted: "#F7F7F7"
```

`tertiary` doit être utilisé avec parcimonie (contraste ≈ 6:1 contre `neutral`). Une interface peut rester presque entièrement monochrome. Comme le préréglage se veut « peu de bordures décoratives », préférer ici la version atténuée de `secondary` pour les séparateurs, et réserver la version pleine intensité aux seuls contours réellement interactifs (champs, cases à cocher).

### Typographie

```yaml
font:
  family: "Inter"
  heading-weight: 600
  body-weight: 400
  label-weight: 500
```

La hiérarchie repose fortement sur la taille, la graisse et l'espace.

Éviter les effets typographiques, les dégradés et les ornements.

### Formes

```yaml
rounded:
  sm: 2px
  md: 4px
  lg: 8px
  full: 9999px
```

Échelle **Anguleux** — formes plus anguleuses que dans les autres presets.

### Espacement

Utiliser l'échelle **Aéré**, avec une attention particulière aux espaces entre les grandes sections.

---

# D. Coloré et énergique

Ambiance vive, optimiste et accessible.

La personnalité vient principalement de la couleur et de la typographie. Le texte courant reste simple pour conserver une bonne lisibilité.

### Caractère visuel

* Palette plus expressive.
* Un accent principal fort.
* Possibilité d'utiliser une couleur secondaire dans les grandes zones de surface.
* Contraste entre éléments colorés et surfaces neutres.
* Formes franchement arrondies, plus affirmées que dans le preset A.
* Hiérarchie claire malgré une palette plus vivante.

### Couleurs

```yaml
color:
  primary: "#202124"
  secondary: "#5F6368"
  tertiary: "#B54708"
  tertiary-alt: "#087A72"
  neutral: "#FFFFFF"
  neutral-muted: "#F7F7F7"
```

`tertiary` est la couleur principale des actions (contraste ≈ 5.4:1 contre `neutral`).

`tertiary-alt` (contraste ≈ 5.2:1) peut être utilisé pour quelques éléments secondaires ou zones de mise en avant, mais ne doit pas concurrencer `tertiary`. Ne jamais utiliser les deux accents simultanément pour deux actions de même importance.

`tertiary-alt` est une teinte turquoise proche de `success` : éviter de l'utiliser dans un contexte où il pourrait être confondu avec un message de succès (bandeau de confirmation, coche de validation) — le réserver à des éléments purement décoratifs ou de mise en avant.

### Typographie

```yaml
font:
  heading-family: "Plus Jakarta Sans"
  body-family: "Work Sans"
  heading-weight: 700
  body-weight: 400
  label-weight: 600
```

Les titres sont légèrement plus affirmés que dans les autres presets, mais restent simples et lisibles. Le corps de texte utilise une famille distincte de celle du preset C (`Inter`) afin que les deux ambiances restent typographiquement différenciables même quand seul du texte courant est visible.

### Formes

```yaml
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  full: 9999px
```

Échelle **Doux**, comme le preset B — les boutons et petits contrôles peuvent utiliser `full` lorsqu'une forme en pilule correspond naturellement au composant. Le partage de cette échelle avec B est volontaire (voir tableau récapitulatif) : la distinction entre B et D repose sur la couleur et la typographie, pas sur l'arrondi.

### Espacement

Utiliser l'échelle **Standard**.

Éviter de compenser les couleurs vives par une multiplication des éléments décoratifs.

---

# Note sur les deux structures de police

Deux structures sont utilisées selon les presets :

* **Famille unique** (`font.family`) — presets A et C. Un seul jeu de graisses (`heading-weight`, `body-weight`, `label-weight`) suffit à créer la hiérarchie. Convient aux ambiances qui misent sur la neutralité plutôt que sur le contraste de polices.
* **Deux familles** (`font.heading-family` + `font.body-family`) — presets B et D. La police de titre porte le caractère de l'ambiance (serif chaleureuse pour B, sans-serif affirmée pour D) tandis que le corps de texte reste sur une police neutre et très lisible.

Les deux structures sont valides ; le choix dépend de si l'ambiance a besoin d'une police de titre expressive ou non.

---

# Échelle typographique commune

L'échelle de base reste commune aux quatre presets. Les différences d'ambiance viennent principalement des familles de polices et de leurs graisses.

```yaml
type:
  h1:
    size: 40px
    weight: 600
    line-height: 1.15

  h2:
    size: 30px
    weight: 600
    line-height: 1.2

  h3:
    size: 24px
    weight: 600
    line-height: 1.25

  body-lg:
    size: 18px
    weight: 400
    line-height: 1.6

  body-md:
    size: 16px
    weight: 400
    line-height: 1.5

  body-sm:
    size: 14px
    weight: 400
    line-height: 1.5

  label-md:
    size: 14px
    weight: 500
    line-height: 1.4

  label-sm:
    size: 12px
    weight: 500
    line-height: 1.4

  caption:
    size: 12px
    weight: 400
    line-height: 1.4
```

Le `body-md` de `16px` est la taille par défaut.

Le texte courant ne doit pas descendre sous `14px`.

### Texte confortable

Si l'utilisateur demande une interface **confortable** ou **grande** :

* `body-md` → `18px`
* `body-sm` → `16px`
* `label-md` → `16px`
* augmenter modérément les titres si nécessaire.

### Interface compacte

Si l'utilisateur demande une interface **compacte** :

* conserver `body-md` à `16px` ;
* passer à l'échelle d'espacement **Dense** (voir ci-dessous) plutôt que de réduire les espacements au cas par cas ;
* réduire éventuellement les titres secondaires ;
* ne jamais descendre le texte courant sous `14px`.

---

# Échelle d'espacement

## Standard

```yaml
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 24px
  margin: 32px
```

## Aéré

```yaml
spacing:
  xs: 8px
  sm: 12px
  md: 24px
  lg: 32px
  xl: 64px
  gutter: 32px
  margin: 48px
```

## Dense

```yaml
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 40px
  gutter: 16px
  margin: 24px
```

Le preset **Standard** est utilisé par défaut. **Dense** n'est pas rattaché à un préréglage d'ambiance en particulier : c'est l'échelle à appliquer, quel que soit le preset choisi, dès que l'utilisateur demande une interface « compacte » (voir la section « Interface compacte » ci-dessus).

L'espacement doit créer une hiérarchie entre les groupes d'information. Ne pas réduire les espaces internes des contrôles au point de nuire au confort d'utilisation.

---

# Échelle d'arrondi

Les rayons doivent rester cohérents dans toute l'interface.

## Standard

```yaml
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
```

## Doux

```yaml
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  full: 9999px
```

## Anguleux

```yaml
rounded:
  sm: 2px
  md: 4px
  lg: 8px
  full: 9999px
```

## Carré

```yaml
rounded:
  sm: 0px
  md: 0px
  lg: 0px
  full: 0px
```

Aucun des quatre presets d'ambiance n'utilise l'échelle **Carré** par défaut : elle reste disponible pour une contrainte de marque explicite (ex. identité institutionnelle stricte), à appliquer manuellement si l'utilisateur la demande.

Les très grands rayons doivent être évités sur les cartes, champs et conteneurs.

`full` est réservé aux éléments volontairement en forme de pilule ou de cercle.

---

# Élévation

Aucune ombre n'est utilisée par défaut.

La hiérarchie visuelle doit d'abord être créée avec :

1. l'espacement ;
2. la typographie ;
3. les surfaces (`neutral` / `neutral-muted`) ;
4. les contours (`secondary`) ;
5. la couleur (`tertiary`).

Lorsque l'élévation est nécessaire, utiliser une ombre légère et diffuse.

```text
Faible opacité, grand flou, absence de contour marqué.
```

Ne pas empiler plusieurs ombres sur un même composant.

---

# États interactifs

Tous les composants interactifs doivent avoir des états visuellement distincts :

* `default`
* `hover`
* `focus`
* `active`
* `disabled`
* `error`
* `success` lorsque nécessaire

Le `focus` doit être clairement visible — réutiliser `tertiary` comme couleur d'anneau de focus (voir « Règles d'accessibilité »).

Les états `error` et `success` s'appuient sur les couleurs sémantiques communes définies plus haut, et ne doivent jamais dépendre uniquement de la couleur. Ajouter un texte, une icône ou un autre indicateur pertinent.

---

# Composants

Les composants de base sont déduits automatiquement des tokens de couleur, typographie, espacement et arrondi (voir `SKILL.md`, section « Components », qui s'appuie directement sur `primary`, `secondary`, `tertiary`, `neutral`).

Ne pas interroger l'utilisateur composant par composant.

Déduire automatiquement :

* boutons ;
* liens ;
* champs ;
* sélecteurs ;
* cases à cocher ;
* boutons radio ;
* cartes ;
* tableaux ;
* alertes ;
* navigation ;
* menus.

Ne poser une question supplémentaire que si l'utilisateur mentionne explicitement une contrainte importante concernant un composant particulier.

Exemple :

> « Les cases à cocher doivent être très visibles. »

Dans ce cas uniquement, adapter le composant concerné sans modifier inutilement le reste du système.

---

# Priorité en cas de conflit

Lorsque plusieurs préférences se contredisent, appliquer cet ordre :

1. **Accessibilité**
2. **Lisibilité**
3. **Clarté de la hiérarchie**
4. **Cohérence du système**
5. **Préférence esthétique**

Une préférence visuelle ne doit jamais dégrader la lisibilité ou l'accessibilité.

En cas de doute, revenir au préréglage **A. Sobre et professionnel**, avec l'échelle d'espacement et d'arrondi standard.

---

# Tableau récapitulatif

À consulter pour vérifier rapidement qu'un ajustement futur ne casse pas la distinction entre presets.

| Preset | `neutral` | `tertiary` | Police | Espacement | Arrondi |
|---|---|---|---|---|---|
| A. Sobre | `#FFFFFF` | `#155EEF` (bleu) | Famille unique — Public Sans | Standard | Standard |
| B. Chaleureux | `#FFFDF9` | `#8A4B2A` (brun) | Deux familles — Source Serif 4 / Source Sans 3 | Aéré | Doux |
| C. Moderne | `#FFFFFF` | `#005FCC` (bleu) | Famille unique — Inter | Aéré | Anguleux |
| D. Coloré | `#FFFFFF` | `#B54708` (orange) + `tertiary-alt` teal | Deux familles — Plus Jakarta Sans / Work Sans | Standard | Doux |

Recoupements volontaires : A et D partagent l'échelle d'espacement Standard ; B et C partagent Aéré ; B et D partagent l'arrondi Doux. Dans chaque cas, la distinction repose sur la couleur et la typographie plutôt que sur l'espacement ou l'arrondi — cohérent avec le principe énoncé en introduction.