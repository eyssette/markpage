---
editor: true
plugins: copycode
style: img{border-radius:10px}
---

# Markpage

<div style="float:left; margin-right:2em; margin-bottom:5em;" markdown> ![](favicon.svg =150x150)</div> 
 
Markpage est un outil **libre** et **gratuit**, créé par [Cédric Eyssette](https://eyssette.forge.apps.education.fr/) sur [LaForgeÉdu](https://forge.apps.education.fr/markpage/markpage.forge.apps.education.fr), qui permet de créer facilement un minisite web ou une application pour smartphone, à partir d'un simple fichier en Markdown.

On peut l'utiliser notamment pour créer des petits modules de formation ou de révision.

<label for="urlInput1">Entrez l'URL de votre fichier en Markdown pour accéder à votre minisite :</label> <input type="url" id="urlInput1" class="redirect-input" placeholder="Votre URL"> <button class="redirect-button" data-input-id="urlInput1">OK</button>

Vous pouvez également tester l'éditeur en ligne : <button class="openEditor">ouvrir l'éditeur</button>

## Comment ça marche ?

### Le principe

1. Créez un fichier sur un service comme [CodiMD](https://codimd.apps.education.fr/), [Digipad](https://digipad.app/), [Framapad](https://framapad.org/abc/fr/) … ou sur la [Forge](https://forge.apps.education.fr/).
2. Créez votre site en respectant la [syntaxe de Markpage](?sec=1&subsec=2)
3. Votre site sera alors disponible à l'adresse : https://markpage.forge.apps.education.fr/#URL (en remplaçant URL par l'URL de votre fichier)

<label for="urlInput2">Entrez l'URL de votre fichier en Markdown :</label>

<input type="url" id="urlInput2" class="redirect-input" placeholder="Votre URL"> <button class="redirect-button" data-input-id="urlInput2">OK</button>

### Syntaxe de base

Le plus simple est de récupérer ce [modèle sur CodiMD](https://codimd.apps.education.fr/8IuZtiIqRwWfrQO9Rec4nA?both).

Ce modèle permet de générer ce mini-site : [voir le site](https://markpage.forge.apps.education.fr/#https://codimd.apps.education.fr/8IuZtiIqRwWfrQO9Rec4nA?both).

La syntaxe de base est simple :

- on définit le titre de son site avec un titre de niveau 1
- tout ce qui vient entre ce titre et le premier titre de niveau 2 est considéré comme le message initial qui apparaît sur la page d'accueil
- tout ce qui vient sous un titre de niveau 2 est considéré comme le contenu d'une section, qui apparaîtra dans un onglet spécifique
- on peut faire des sous-sections avec des titres de niveau 3

On peut utiliser toute la syntaxe Markdown classique dans le contenu de son site.

### Titres de sections

On fait un titre de section avec un titre en markdown de niveau 2.

Si on utilise la balise `<span>précisions</span>` dans un titre de niveau 2, alors le contenu dans cette balise ne sera affiché que dans le menu de la page d'accueil, et dans le titre de l'onglet correspondant, mais il ne sera pas affiché tout en bas dans le footer (pour gagner en lisibilité si le titre devient trop long).

Pour ajouter un sous-titre au titre de section, on place le sous-titre dans un élément `aside`. Le sous-titre ne s'affiche pas non plus dans le footer.

On peut combiner les balises `span` et `aside`. On aurait ainsi par exemple :

```
#​​# Titre section <span>précision sur le titre</span><aside>Sous-titre</aside>
```

### Titres de sous-sections

On peut ajouter des sous-titres et une image aux titres de sous-sections.

Pour ajouter un sous-titre au titre de sous-section, on place le sous-titre dans un élément `aside`, et on peut mettre également un deuxième sous-titre avec un autre élément `aside` dans le premier élément `aside`.

Pour ajouter une image, on ajoute l'image en markdown dans la ligne juste au-dessous du titre de la sous-section.

On peut combiner ces trois éléments.

```
​#​​#​# Titre sous-section <aside>Sous-titre<aside>2e sous-titre</aside></aside>
![](URL-image)
```

## Options plus avancées

### En-tête YAML

Vous pouvez au début de votre fichier ajouter un en-tête YAML de ce type :

```
---
maths: true
favicon: URL_image
theme: colors
style: a{color:red}
recherche: false
lienPageAccueil: true
oneByOne: false
---
```

- `maths: true` permet d'écrire des formules mathématiques en Latex avec la syntaxe `$Latex$` ou `$$Latex$$`
- `favicon: URL_image` permet de personnaliser l'image de _favicon_ du site
- `theme: colors` permet d'utiliser un thème personnalisé (thèmes possibles : seulement _colors_ pour le moment)
- `style: a{color:red}` permet d'ajouter des styles CSS personnalisés
- `recherche: false` permet de supprimer la barre de recherche en haut à gauche
- `lienPageAccueil: true` permet d'ajouter un lien vers la page d'accueil en haut à droite
- `oneByOne: false` permet de changer le mode de navigation sur mobile : par défaut, le paramètre est sur `true`, une seule sous-section est affichée et on navigue avec un mouvement de swipe ou bien via des boutons de navigation. Avec `false`, seul le contenu de la section active est affiché, mais tous les titres de sous-section sont présents et on peut scroller pour cliquer sur la sous-section qui nous intéresse.
- `plugins: kroki, lightbox` permet d'utiliser des add-ons, ici _kroki_ pour pouvoir générer des graphiques avec mermaid, tikz… et _lightbox_ pour pouvoir afficher en grand une image quand on clique dessus
- `pathImages: URL` permet d'indiquer le chemin vers les images quand on veut utiliser des adresses relatives dans la source de son fichier Markdown

### Thèmes et Styles CSS

#### Thèmes

Pour changer de thème, il est recommandé d'utiliser l'en-tête yaml, mais vous pouvez aussi utiliser le paramètre `?theme=themeName` dans l'URL.

Pour le moment un seul thème est disponible : le thème colors

- [voir ce site avec le thème colors](?theme=colors&sec=2&subsec=2)
- [voir ce site avec le thème par défaut](?sec=2&subsec=2)

#### Styles CSS

Il est recommandé d'utiliser l'en-tête yaml pour inclure vos styles CSS personnalisés.

Vous pouvez cependant éventuellement les laisser dans le contenu en Markdown. Dans ce cas, il ne faut pas les mettre au début, mais plutôt à la fin de votre fichier.

##### Attributions de classes CSS

Vous pouvez attribuer une classe CSS à une ligne avec la syntaxe `{.maClasse}` en fin de ligne.

Si vous voulez attribuer une classe CSS à plusieurs lignes, il faut utiliser cette syntaxe :

```
<div markdown class="maClasse">
Bloc de texte Markdown multiligne
</div>
```

##### Classes prédéfinies

La classe `{.center}` permet de centrer un paragraphe.

La classe `{.large}` après une image sous un titre de sous-section permet d'avoir une grande image plutôt qu'une petit icône.

### Admonitions

Les admonitions sont des sortes d'encadrés qui permettent de mettre en avant certaines informations.

:::info Exemple d'admonition de type "info"
Contenu
:::

:::tip Exemple d'admonition de type "tip"
Contenu
:::

:::warning Exemple d'admonition de type "warning"
Contenu
:::

Dans votre fichier, vous pouvez utiliser les "admonitions" avec la syntaxe suivante, dans laquelle typeAdmonition est le type de l'admonition (les types "info", "tip" et "warning" ont déjà un style CSS par défaut, mais vous pouvez en utiliser d'autres). Le titre de l'admonition peut contenir des espaces.

```
:::typeAdmonition titre

Bloc de texte en Markdown multiligne

:::
```

#### Admonitions dépliables

Si vous voulez que votre admonition soit caché par défaut et dépliable en cliquant dessus, il faut ajouter `collapsible` à la première ligne

```
:::typeAdmonition collapsible titre

Bloc de texte en Markdown multiligne caché par défaut

:::
```

:::info collapsible Admonition dépliable
Contenu
:::

### Add-ons

Vous pouvez utiliser des add-ons pour gérer des contenus ou des fonctionnalités spécifiques.

Il suffit de les indiquer dans l'en-tête YAML ainsi : `plugins: kroki, lightbox` par exemple pour ajouter kroki et lightbox.

Les add-ons disponibles sont les suivants :

#### Kroki

Mot-clé pour ajouter cet add-on : `kroki`

_Kroki_ permet de générer automatiquement des graphiques avec la syntaxe suivante : Tikz, Mermaid, PlantUML, Graphviz, Excalidraw, Vega ou Vegalite.

Pour cela, il faut utiliser un bloc code et indiquer au début la syntaxe qu'on veut utiliser, ainsi :

````
```mermaid
On met ici son graphique avec la syntaxe mermaid
```

````

#### Lightbox

Mot-clé pour ajouter cet add-on : `lightbox`

_Lightbox_ permet d'afficher en grand une image ou un PDF quand on clique dessus.

Si on veut désactiver l'effet de lightbox pour un PDF, on ajoute simplement `?nolightbox` à la fin de l'URL du PDF.

#### Text2quiz

Mot-clé pour ajouter cet add-on : `text2quiz`

[Text2quiz](https://text2quiz.vercel.app/) est un logiciel libre et gratuit qui permet de gérer des exercices à partir d'un fichier texte, en respectant une syntaxe particulière.

On intègre un exercice text2quiz avec la syntaxe suivante : 

````
```text2quiz
On met ici ses exercices avec la syntaxe text2quiz
```

````

[Voir un exemple d'utilisation de text2quiz dans Markpage](https://markpage.forge.apps.education.fr/#https://codimd.apps.education.fr/DWVc_AZLRluTSja04zty-g)

#### Copycode

Mot-clé pour ajouter cet add-on : `copycode`

Cet add-on permet d'avoir un bouton cliquable pour copier dans le presse-papier le texte contenu dans un bloc code (avec la syntaxe markdown ci-dessous).

Rappel de la syntaxe pour un bloc code :

````
```
contenu du bloc code
```
````

#### TitleLinks

Mot-clé pour ajouter cet add-on : `titleLinks`

Cet add-on permet de partager des liens vers une sous-section spécifique.
Si on clique sur un titre de niveau 4, 5 ou 6, un lien vers ce titre est copié dans le presse-papier (les titres des autres niveaux existent déjà sous forme de liens dans Markpage).

## Exemples d'utilisation

#### Création d'un minisite

- [CRCN Édu & usages de l'IA](https://markpage.forge.apps.education.fr/#https://codimd.apps.education.fr/yiaeykqpSMS_ml1ZdIqUeA)
- [Normative Ethics and The Body](https://markpage.forge.apps.education.fr/#https://codimd.apps.education.fr/xtmGW7mSRq67o_jDStbgvg)

#### Mise en valeur de travaux d'élèves

- [When Rights are Denied: Stories of Injustice](https://markpage.forge.apps.education.fr/#https://codimd.apps.education.fr/-PoT97vFTf2Zg3d0OoOONA)

#### Création d'un lexique

- [Modèle de lexique](https://markpage.forge.apps.education.fr/#https://codimd.apps.education.fr/8Cu1j7gKQ8eytUBJ9uUEZA)

#### Cahier de textes avec Markpage

- [Exemple de cahier de textes](https://markpage.forge.apps.education.fr/#https://codimd.apps.education.fr/s/c6dPX8ZhT)

## Faire évoluer l'outil !

### Un outil libre et gratuit

Markpage est un outil libre et gratuit hébergé sur la [Forge des Communs Numériques Éducatifs](https://forge.apps.education.fr).

Markpage utilise les logiciels libres suivants :

- [showdown](https://github.com/showdownjs/showdown) pour la conversion du markdown en html
- [js-yaml](https://github.com/nodeca/js-yaml) pour la gestion des en-têtes yaml
- [katex](https://katex.org/) pour la gestion des mathématiques en Latex

### Contacter l'auteur

N'hésitez pas à m'envoyer vos demandes d'évolution de l'outil.

Vous pouvez me contacter sur les [réseaux sociaux](https://eyssette.forge.apps.education.fr).

De préférence, merci d'utiliser les “[tickets](https://forge.apps.education.fr/markpage/markpage.forge.apps.education.fr/-/issues)” sur LaForgeEdu.

Vous pouvez aussi envoyer un [mail](mailto:forge-apps+guichet+markpage-markpage-forge-apps-education-fr-1073-issue-@phm.education.gouv.fr)