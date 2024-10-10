# Markpage

<div style="float:left; margin-right:2em; " markdown> ![](favicon.svg =100x100)</div> 
 
Markpage est un outil **libre** et **gratuit** qui permet de créer facilement un minisite web ou une application pour smartphone, à partir d'un simple fichier en Markdown.

On peut l'utiliser notamment pour créer des petits modules de formation ou de révision.

Outil créé par [Cédric Eyssette](https://eyssette.forge.apps.education.fr/).

Les sources de ce logiciel sont sur la [Forge des Communs Numériques Éducatifs](https://forge.apps.education.fr/markpage/markpage.forge.apps.education.fr)

## Comment ça marche ?

### Le principe

1. Créez un fichier sur un service comme [CodiMD](https://codimd.apps.education.fr/), [Digipad](https://digipad.app/), [Framapad](https://framapad.org/abc/fr/) … ou sur la [Forge](https://forge.apps.education.fr/).
2. Créez votre site en respectant la [syntaxe de Markpage](?sec=1&subsec=2)
3. Votre site sera alors disponible à l'adresse : https://markpage.forge.apps.education.fr/#URL (en remplaçant URL par l'URL de votre fichier)

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

### Titres de sous-sections

On peut ajouter une image et des sous-titres aux titres de sous-sections.

Pour ajouter une image, on ajoute l'image en markdown dans la ligne juste au-dessous du titre de la sous-section.

Pour ajouter un sous-titre, on place le sous-titre dans un élément `aside`, et on peut mettre également un deuxième sous-titre avec un autre élément `aside` dans le premier élément `aside`.

On peut combiner ces trois éléments.

```
### Titre section <aside>Sous-titre<aside>Deuxième sous-titre</aside></aside>
![](URL-image)
```

<!-- ##Des exemples ? -->

## Options plus avancées

### En-tête YAML

Vous pouvez au début de votre fichier ajouter un en-tête YAML de ce type :

```
---
maths: true
style: a{color:red}
recherche: false
lienPageAccueil: true
oneByOne: false
---
```

- `maths: true` permet d'écrire des formules mathématiques en Latex avec la syntaxe `$Latex$` ou `$$Latex$$`
- `style: a{color:red}` permet d'ajouter des styles CSS personnalisés
- `recherche: false` permet de supprimer la barre de recherche en haut à gauche
- `lienPageAccueil: true` permet d'ajouter un lien vers la page d'accueil en haut à droite
- `oneByOne: false` permet de changer le mode de navigation sur mobile : par défaut, le paramètre est sur `true`, une seule sous-section est affichée et on navigue avec un mouvement de swipe ou bien via des boutons de navigation. Avec `false`, seul le contenu de la section active est affiché, mais tous les titres de sous-section sont présents et on peut scroller pour cliquer sur la sous-section qui nous intéresse.

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

### Attributions de classes CSS

Vous pouvez aussi attribuer une classe CSS à une ligne avec la syntaxe `{.maClasse}` en fin de ligne.

Si vous voulez attribuer une classe CSS à plusieurs lignes, il faut utiliser cette syntaxe :

```
<div markdown class="maClasse">
Bloc de texte Markdown multiligne
</div>
```

#### Classes prédéfinies

La classe `{.center}` permet de centrer un paragraphe.

La classe `{.large}` après une image sous un titre de sous-section permet d'avoir une grande image plutôt qu'une petit icône.

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

Vous pouvez aussi envoyer un [mail](mailto:forge-apps+markpage-markpage-forge-apps-education-fr-1073-1zlrcah1x0db338wwkjnjf1g4-issue@phm.education.gouv.fr)
