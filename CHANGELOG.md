# Changelog

## 4.14.1 (2025-08-31)

### Fix

- processYAML aussi sur le fichier source par défaut index.md
- processYAML => await setTheme

## 4.14.0 (2025-08-27)

### Feat

- propriété include dans le YAML pour pouvoir répartir la source du site Markpage dans plusieurs fichiers

### Fix

- pas de proxy Cors si on utilise un fichier source sur une forge avec ajout automatique de l'extension ".md"
- refactoring du fetch des données source

## 4.13.0 (2025-07-18)

### Feat

- ajout des tâches en Markdown

### Fix

- possibilité d'utiliser Kroki dans le message initial
- handlClicks doit être relancé pour certains addOns
- paramètres dans l'URL des boutons de navigation
- bouton de navigation maintenant cliquables sur toute la longueur
- lien vers l'exemple Lightpad avec des tags

## 4.12.1 (2025-06-16)

### Fix

- changement de l'historique de l'URL avant de faire changeDisplayBasedOnParams
- gestion de la navigation si on utilise des footnotes

## 4.12.0 (2025-06-16)

### Feat

- gestion des notes de bas de page

### Fix

- classe iframe ChatMD
- adjustHeight amélioré si bandeau + petit écran

### CI

- fix erreur de récursivité dans le template de déploiement
- création d'un template pour déployer Markpage dans un autre dépôt

## 4.11.0 (2025-06-03)

### Feat

- ajout automatique de l'extension .md au nom de fichier si le fetch a échoué une première fois
- **addOn**: addOn pour ChatMD

### Fix

- résolution d'un problème avec adjustHeight en cas d'utilisation d'un bandeau
- **ui**: sur petit écran, le scrollTo après clic ne doit avoir lieu que si on vient de fermer le conteneur des boutons de filtre
- **css**: blocs pre sur petits écrans : white-space = pre-wrap

### CI

- ajout de tous les fichiers du dossier addOn

### Chore

- confiuration commitizen

## 4.10.0 (2025-05-19)

### Feat

- **ui**: addOn "highlight" pour la coloration syntaxique
- **ui**: ajout d'une flèche s'il faut scroller pour afficher la suite

### Fix

- **markdown**: détection des admonitions dans des blocs de code améliorée
- **ui**: détection du swipe améliorée
- **ui**: vérification de l'existence de textFit avant de l'appliquer
- **CSS**: marge verticale pour les boutons sur la page d'accueil
- **CSS**: pre et code pour petits écrans
- URL sécurisée pour redirectToUrl
- fonction pour les redirections : setUpRedirectListener()
- gestion de l'input de redirection vers une URL : plus générale
- source par défaut dans le fichier index.md pour Markpage et indexLightpad.md pour Lightpad
- lightbox plus large et plus haute, croix de fermeture plus grande

### Build

- update package-lock.json
- script de build avec npx

### Chore

- mise à jour version
- .editorconfig et configuration commitizen
- configuration Taskfile

## 4.9.0 (2025-04-18)

### Feat

- feat: lightbox pour des liens en iframe

### Fix

- fix: amélioration affichage recherche notamment avec autofiltres + petits écrans
- fix(lightpad): gestion banner plus universelle  (même si pas d'autofilters)
- fix(lightpad): bandeau en position fixed sur grand écran
- fix(lightpad): tri boutons filtre / sans casse & accents
- fix(lightpad): mots composés dans boutons de filtre
- fix: pas de lightbox pour les images qui renvoient vers un lien
- fix(lightpad): autofilters + beaucoup de filtres
- fix: searchText / recherche dans titre seulement
- fix: conflit entre boutons de filtres et Latex
- fix: test si yaml avant d'utiliser une propriété du yaml
- fix(lightpad): bandeau plus petit sur petit écran
- fix: calcul headerHeight dans adjustHeight
- fix: pas de loading lazy pour l'image dans le titre
- fix: tri des tags en prenant en compte ordre numérique
- fix: effet hover sur bouton de filtre seulement sur grand écran
- fix(lightpad): adjustHeight / prise en compte de la taille du titre de colonne
- fix: petit ajustement pour adjustHeight
- fix(lightpad): adjustHeight si lightpad + bandeau avec bcp de contenu
- fix(lightpad): CSS bandeau / minimum pour marginTop
- fix(lightpad): CSS useBanner avec colonnes dans le contenu
- fix: CSS tags margin-bottom
- fix: calcul textFit pour titre à refaire après chargement images dans header
- fix: interactive-widget=resizes-content
- fix: accès avec tab au champ de recherche
- style: retour à la ligne inutile
- fix(lightpad): CSS si boutons filtres sur plusieurs lignes

## 4.8.0 (2025-03-20)

### Feat

- feat(lightpad): option autofiltres dans le yaml

### Fix

- fix: amélioration barre de recherche petit écran
- fix(lightpad): boutons recherche // searchInput
- fix(lightpad): recherche de termes combinés compatible avec un mode sans colonnes
- fix: conflit admonitions / genericAttributes
- fix: updateTitleVisibility / imageInTitle
- fix(lightpad): utilisation possible de "non" dans yaml.bandeau

## 4.7.0 (2025-03-19)

### Feat

- feat(lightpad): yaml.bandeau pour utiliser initialMessage dans Lightpad (et permettre notamment d'avoir des filtres)

### Fix

- fix: CSS pour les tags
- fix: prettier-ignore pour éviter un bug pour les couleurs avec accents
- fix: CSS pour le fond sur écran de taille moyenne
- fix(lightpad): CSS quand il n'y a pas de colonnes, mais que des capsules

## 4.6.0 (2025-03-19)

### Feat

- feat: gestion des tags avec easyGenericAttributes (--tagColor: text--)

### Fix

- fix: Esc dans searchInput nous fait sortir du champ (blur)
- fix(pad): recherche améliorée (pas d'affichage des capsules si pas de résultat)
- fix: clic en dehors de searchInput nous fait sortir du champ (blur)
- fix: navigation par les flèches désactivée si on est dans un champ texte
- fix: la recherche doit cacher les contenus non pertinents marqués visibles suite à la navigation au clavier
- fix: bug dans getCSScolor (typo + nom de couleur à mettre en minuscules)

## 4.5.0 (2025-03-17)

### Feat

- feat: utilisation des boutons dans #initialMessage pour filtres de recherche

### Fix

- fix: meilleure gestion markdown sans titres h2, ou avec seulement un titre h2
- fix(addOns): setInterval plutôt que setTimeout pour tester si l'addOn existe
- fix: amélioration gestion easyGenericAttributes
- fix: la recherche inclut le ALT des images
- fix(CSS): h4/h5/h6 img
- fix(CSS): compatibilité avec flipbook (hr:last-child/display:none)
- fix(lightpad): attribution des exemples
- fix: removeTagsFromString / ne pas supprimer le contenu dans les balises

## 4.4.0 (2025-03-11)

### Feat

- feat: meilleure gestion corsProxy (ajouté que si échec)

### Fix

- fix: test si input existe avant d'utiliser redirectoToUrl(urlInput)
- fix(lightpad): précisions dans “Comment ça marche ?” / URL fichier
- fix(lightpad): ajout des auteurs pour les exemples
- fix: test isLightpad plus strict
- fix(lightpad): CSS ol & ul / margin-left

### Docs

- docs: précisions fichier README
- docs: fichier CONTRIBUTING.md

## 4.3.0 (2025-03-10)

### Feat

- feat(lightpad)!: nom du thème classique =&gt; digipad
- feat(lightpad): boutons pour appliquer chaque thème au pad par défaut

### Fix

- fix(lightpad): optimisation svg
- fix(lightpad): simplification logo
- fix(markpage): setInterval pour tester window.katex avant  convertLatex
- fix(lightpad): suppression de "br" dans le titre
- fix(lightpad): CSS .textFitted padding-right sur grand écran
- fix(lightpad): textFit minFontSize:16px
- fix(lightpad): CSS .textFitted padding-x
- fix(lightpad): Exemples de pads
- fix(lightpad): liens classiques pour choisir un thème
- fix(lightpad): typos
- fix(lightpad): Liens dans la partie "Crédits"
- fix(lightpad): "Modèle", plutôt que "Exemple"
- fix(lightpad): remove loading "lazy"
- fix(lightpad): image Brigit&Komit: loading Lazy
- fix(lightpad): suppression couleur inutile

## 4.2.1 (2025-03-09)

### Fix

- fix(lightpad): image Brigit et Komit en svg
- theme digipad changé en classique et mis à jour
- style digipad
- chore: suppression ancien thème digipad.css
- feat(pad) affichage de la searchbar même sur petit écran
- style: lint js & CSS
- fix(lightpad): explications pour les encadrés + vidéo dans un encadré (optimisation)
- perf(touchListeners): ajout de l'option passive=false
- fix(lightpad): CSS uniformisés selon les tailles d'écran (titres h2 et h3)
- fix(lightpad): textFit déplacé en fin de handleMarkpage
- fix(lightpad): CSS cursor grab
- fix(lightpad): marges colonnes
- fix(markdownToHTML): pas de soulignement dans le bloc code
- fix(lightpad): CSS colonnes
- mise à jour thème Digipad
- fix: explications pour l'addOn copycode
- fix(HTML): classe plutôt que ID pour subSection-ID
- fix(lightpad): scrollTop toujours à 0 et en mode "instant".
- fix(lightpad): explications pour les thèmes
- fix(lightpad): thème classique =&gt; couleur de fond
- fix(lightpad) scroll dans colonne avec timeout (sinon pas de scroll si on arrive directement avec un lien vers une capsule particulière)
- style digipad
- fix(lightpad): suppression de l'image pour afficher du code (remplacée par du Markdown)
- refactor: ajout d'un trim() pour éviter espaces inutiles
- improvement(lightpad): CSS amélioré pour les images
- feat(images): possibilité de ne pas avoir un loading lazy pour les images si on utilise une balise HTML avec l'attribut src qui n'est pas en premier
- improvement(lightpad): images centrées dans les capsules
- perf(lightpad): optimisation image & iframe page accueil
- fix(lightpad): clearInterval avant d'appliquer textFit
- fix(markpage): CSS pre pour que l'addOn copycode ne crée pas de décalage
- fix(lightpad): h1 height pour petits écrans
- fix(lightpad): searchBard position fixed
- chore: ajout build
- fix(pad): resize event =&gt; test si window.textFit avant de l'utiliser
- fix(lightpad): image en svg plutôt qu'en png
- fix:  CSS input margin-left (sinon débordement outline)
- ci: ajout des images dans assets
- fix(lightpad): typo oubli des majuscules dans nom image
- fix(lightpad): couleur rouge -&gt; contraste meilleur
- fix(addOn) copycode / contraste des couleurs du bouton
- fix: ajout width et height sur image page d'accueil
- fix(lightpad): Message pour copier le lien vers le fichier Markdown
- fix(lightpad): image utilisation CodiMD (réf à Lightpad plutôt que Markpad)
- build
- perf(lightpad): dimensions du logo sur la page d'accueil
- perf(lightpad): dimensions image page d'accueil
- fix(lightpad): alt de l'image sur la page d'accueil
- perf(lightpad): dimensions de l'image
- fix(lightpad): CSS border-radius pour h3
- Acceptation complète des changements de main

## 4.2.0 (2025-02-13)

### Feat

- feat(search): recherche de plusieurs termes possible
- feat(parseMarkdown) : possibilité d'utiliser du Markdown dans des commentaires HTML

### Fix
- refactor(lightpad): styles CSS lightpad dans fichier lightpad.css
- style(lightpad):  CSS .noColumns pour les petits écrans
- fix(lightpad): meilleure gestion du scrollToElement
- fix(search): si pas de sous-section, on utilise le contenu dans .noSubSections et comme titre le titre h2
- fix(lightpad): scrollableElement différent si mode noColumn
- application du ticket : thème Lightpad
- style(lightpad): document.title = Lightpad par défaut si on est dans le mode lightpad
- fix(lightpad) yaml.linkToHomePage désactivé si on est sur lightpad

## 4.1.0 (2025-02-11)

### Feat

- feat(lightpad): noColumns
- feat(search): removeTagsFromString avant de faire la recherche

### Fix

- fix(easyGenericAttributes): pas d'application de la couleur si on est dans un bloc code
- style(lightpad): h1 img nolightbox

## 4.0.0 (2025-02-10)

Montée de version majeure : la fonction pad devient « Lightpad »

### Refactor

- refactor(appName): switch to Lightpad

## 3.2.2 (2025-02-10)

### Fix

- Markpad: ajout redirectToUrl
- Amélioration de la lightbox
- Police de base : Helvetica, Arial, sans-serif
- markpad: fix scroll avec souris
- setInterval pour textFit, pour aller plus vite
- fix(searchResult): cas où le résultat est dans une section où il n'y a pas de sous-section
- pad: CSS grands écrans (police et colonnes + grandes)
- fix: redirect dans markpad
- timeout plus important pour lightbox
- fix: cas où addOns &gt; 2
- perf(markpad-homepage): iframe loading lazy
- remove console.log

## 3.2.1 (2025-02-10)

### Fix

- Contenu par défaut pour Markpad
- fix: gestion classe type display (homepage, section, subsection)
- Markpad: adaptation automatique taille titre h1
- markpad: h1 gestion textFit + logo dans le Markdown
- fix: gestion scroll left si navigation clavier/clic
- CSS: scroll-snap pour petits écrans
- markpad: CSS / image/h1
- markpad: textFit sur title en cas de resize
- fix: gitlab-ci pour addOns

## 3.2.0 (2025-02-09)

### Feat

- Gestion easyGenericAttributes + noms de couleurs FR
- détection isMarkpadWebsite: sur markpad, on utilise le mode pad

### Fix

- markpad: gestion searchBar
- logo markpad
- markpad: search possible sur titre colonne seulement
- markpad: CSS petits écrans
- markpad: police de base plus grande
- fix: search si une seule subsection
- pad: CSS / ul, ol + h1
- pad: fix CSS background
- Lien page d'accueil : aria-label
- markpad: searchBar position fixed
- markpad: always adjustHeight
- markpad: CSS fond petits écrans
- markpad: fix position titres h2
- markpad: h1.textContent par défaut
- fix: copies de tous les fichiers svg

## 3.1.0 (2025-02-07)

### Feat

- pad: gestion scroll avec clic maintenu sur la souris
- propriété yaml.markpad
- lightbox: désactivation possible sur une img avec URL?nolightbox

### Fix

- pad & padscroll =&gt; CSS h1
- pad: suppression style oneByOne
- pad : déplacement autorisé si clic sur "h3 a"
- pad: CSS pre
- pad: CSS .subSection.visible
- img avec ?nolightbox : pas de cursor:pointer
- pad: CSS iframe maxHeight
- pad: CSS h1
- pad: h3 align center

## 3.0.1 (2025-02-07)

### Fix

- option pad : sur petit écran aussi
- Gestion des attributs génériques : pour les éléments inline également
- option padScroll
- pad : resizeSectionContentElements automatique si resize
- fix: markdown dans blocs code
- Amélioration thème colors
- paramètre URL: padscroll
- fix: thème colors / background html & box-shadow main
- CSS pad : font-size, pre …
- fix: resizeContentElements si image initialMessage
- pad: lightbox par défaut
- Paramètre URL : pad=1 pour voir son site avec le thème pad
- fix: border-width h3 si pad & thème color
- fix: params padscroll CSS
- pad: image max-width:100%
- CSS pad : .displayHomepage h2 a:hover
- pad: taille colonnes
- fix: ajout des styles minifiés dans public/css/

## 3.0.0 (2025-02-06)

Montée de version majeure : Markpage intègre la fonction de pad

### Feat

- YAML: option pad

### Fix

- CSS thème colors : 2e version
- fix: 2 élements urlInput + balises dans index.html
- icône pour homepage
- thème CSS colors: .displayHomepage blockquote
- CSS thème colors : h4 (éviter apparence bouton cliquable)
- resetIframe : seulement des iframes de la page précédente
- CSS footer en cas d'overflow
- Input URL : sur page d'accueil
- Plus besoin de la classe isVideo pour arrêter les vidéos dans des iframes
- CSS thème colors : fix background-color h3
- CSS footer: meilleure prise en compte petits écrans
- CSS lightbox : image w&h
- Défilement via swipe : seulement dans innerBox (permet défilement footer)
- fix pour admonitions sans titres
- iframe: max-width
- CSS h3 width
- Suppression des balises HTML dans le titre
- fix admonition : balise "p" vide avant certains encadrés
- CSS img maxWidth
- typo
- eslint-disable-next-line no-unused-vars
- CSS thème colors: footer a color
- fix erreur type NodeList&gt;array

## 2.5.2 (2025-01-16)

### Fix

- suppression regex lookbehind (?&lt;!#) pour plus de compatibilité
- addOn copyCode: zindex footer +  style pre
- openLinksInNewTab : pas pour les liens internes
- explication ?nolightbox pour désactiver lightbox pour un PDF

## 2.5.1 (2025-01-16)

### Fix

- lightbox: amélioration cas PDF + gestion retours en arrière
- Gestion des iframes avec des vidéos
- Ouverture des liens dans nouvel onglet (sauf navigationLink & lightbox)
- ajustement taille lightbox

## 2.5.0 (2025-01-14)

### Feat

- add-on : Copycode
- lightbox : aussi pour les fichiers PDF

### Fix

- fix : addOns dans dossier addOn
- typo copycode
- corsProxy : changement URL

## 2.4.1 (2024-12-15)

### Fix

- CSS pour les tables
- Explications utilisation text2quiz
- shortcut / dossier éthique animale
- cursor: pointer pour details & img avec lightbox
- déplacement dans dossier addOn des scripts addOns
- shortcut dossier ethique environnementale
- intégration text2quiz : fond transparent & taille iframe
- css iframeText2quiz sur petit écran
- Thème colors : background-color
- Ajustements CSS thème colors (heights)
- Thème colors: iframeText2quiz background-color
- CSS overflow-wrap
- typo
- addOn Text2quiz : pas d'affichage du titre de la question
- ajout js/externals/text2quiz.js dans .public

## 2.4.0 (2024-11-03)

### Feat

- addOn : Intégration avec text2quiz
- Gestion du Markdown dans un bloc div
- Input pour entrer URL fichier MD et avoir redirection vers rendu Markpage

### Fix

- fix fonction showdownExtensionAdmonitions
- Meilleure gestion liens internes
- bloc code inutile à la fin
- fix typo boutons navigation
- nouveau logo : dessin plus grand
- fix premier caractère initialMessageContent
- external js dans .public/js/externals
- typo

## 2.3.0 (2024-10-28)

### Feat

- addOn: lightbox
- Gestion addOns + addOn: kroki
- Possibilité d'utiliser des liens relatifs pour les images avec pathImages

### Fix

- Explications addOns
- réorganisation présentation options plus avancées : Thèmes et Styles CSS
- amélioration explications add-ons
- typo & commentaires
- ajout d'exemples d'utilisation de Markpage
- Ajout exemple cahier de textes

## 2.2.0 (2024-10-26)

### Feat

- changement possible du thème dans paramètres URL
- theme: colors
- gestion fichiers hébergés sur pad gouv

### Fix

- CSS : fix sélection section et pas sous-section
- thème colors : généralisation  (nombre de sections &gt;5 OK)
- function setTheme
- variables pour les couleurs
- thème colors : fix css background-color  h3
- suppression commentaires
- CSS pour le fond
- Fix pour l'utilisation de "\\"" en Latex
- explications sous-titres
- admonitions : background-color
- explication paramètre ?theme
- Explications styles CSS personnalisés
- navButtons : remove emojis
- fix supprimé pour conversion tableaux markdown
- explication pour thème personnalisé dans yaml
- thème colors : image homepage CSS
- ajout thèmes dans public
- build / admonitions
- admonitions : margin bottom

## 2.1.0 (2024-10-10)

### Feat

- Gestion thèmes personnalisés (yaml : theme)

### Fix

- prettier showdown
- add emojis
- swipe: toujours activé / remplacé par paramètre oneByOne
- gestion iframes : dans changeDisplayBasedOnParams
- fix handleClicks : gestion params
- Meilleure gestion du scroll automatique
- descriptif "Pour contribuer"
- suppression code inutile : listener popstate
- remove min-height: 90vh pour main
- gestion sous-titres h2
- CSS / sous-titres h2
- meilleure gestion admonitions
- fix navigation vers iframe : force reload
- Fix linkToHomePage (renvoyait à URL générale markpage)
- Explications pour balise span dans h2
- fixImageDimensionsCodiMD
- listener popstate : navigation via historique navigateur
- fix: begin{align*} dans Latex
- click linkToHomePage =&gt; change aussi l'URL affichée
- fix bug retour en arrière page accueil : juxtaposition
- reformulation
- js-yaml: import seulement de "load"
- CSS linkToHomePage
- CSS - footer span caché (précisions ds titres h2)
- fix typo visibleElement
- fix navigation retour vers dernière sous-section de la section précédente
- CSS / h3 a:empty : "…"
- CSS / subSectionContent : top/bottom
- CSS fix .subSectionContent max-height
- CSS: body / margin bottom
- CSS .subSectionContent : padding-top

## 2.0.1 (2024-08-15)

### Fix

- décomposition en modules de handleMarkpage
- fix yaml / swipe
- config rollup pour minifier swipe.css également
- load swipe css : le plus tôt possible
- logo en svg
- markpage-logo.svg &gt; favicon.svg
- prettier : ignore minified files
- markpage-logo.svg en tant que favicon
- swipe minified

## 2.0.0 (2024-08-14)

Montée de version majeure : réécriture importante du code de manière modulaire avec Rollup pour la compilation

### Refactor

- refactoring: modules + Rollup

## 1.9.0 (2024-07-15)

### Feat

- gestion des fichiers hébergés sur codiMD / hedgedoc / digipage
- gestion fichiers sur Framapad
- gestion source sur Digidoc

### Fix

- Amélioration CSS pour mobile
- réorganisation code gestion moveNextOrPrevious
- CSS : amélioration background (tons bleus comme chatMD)
- Amélioration du CSS pour les écrans plus larges
- Changements exemple initial (notamment liens vers la ForgeEdu)
- CSS différent pour h1 & h2 quand noSearchBar et petit écran
- box-shadow CSS + padding noSubsections
- Petites améliorations CSS
- gestion shortcut avant autres traitements URL
- typo
- CSS pour les liens et les blocs de code sur mobile
- CSS background-color : retour à une couleur moins bleue
- CSS: fix bug mode landscape sur portable
- fix bug .subSectionContent calcul max-width
- CSS (écrans larges) si beaucoup de contenu dans une sous-section
- CSS: overflow-x hidden

## 1.8.0 (2024-05-09)

### Feat

- Possibilité de désactiver la navigation par swipe

### Fix
- Sur mobile : seule la sous-section active est visible + boutons de navication + barre de progrès
- Ajout : historique de navigation si moveNextOrPrevious
- ajout de commentaires
- changement sens swipe

## 1.7.0 (2024-05-07)

### Feat

- Ajout navigation avec swipe
- Navigation clavier

### Fix
- fix bug retour page d'accueil

## 1.6.0 (2024-05-06)

### Feat

- Gestion éléments soulignés et surlignés en Markdown
- ajout paramètre menu ds URL pour pouvoir le cacher
- paramètre h3 dans l'URL pour pouvoir cacher les titres h3
- quand ?h3=0, ajouter contenu titre h3 en haut de la page
- Possibilité de mettre du markdown dans le titre et les titres de sections & sous-sections

### Fix

- Explications du fonctionnement de Markpage
- CSS: styles admonitions
- CSS : meilleur gestion petits écrans
- Pas de transformation des admonitions dans un bloc code
- Images dans les titres de sous-sections : classe .large
- définition des variables yaml : avant getMarkdownContent()
- aside dans les titres h2 et les liens dans le footer + max-width footer a
- Pas de generic attributes dans un bloc code
- CSS pour "pre"
- Lien vers la sous-section : inclure l'image
- CSS: pre max-width pour les petits écrans
- CSS: img max width 100% petits écrans
- simpleLineBreaks & gestion tableaux en Markdown
- CSS: img max-width pour petits écrans
- typo
- Pas de split sous-sections si titre h3 dans élément code
- fix showdownExtensionGenericAttributs : regex
- set document.title

## 1.5.0 (2023-12-16)

### Feat

- Affichage possible d'un lien supplémentaire vers la page d'accueil

### Fix

- yaml: dans les styles, fix pour la présence du caractère #

## 1.4.0 (2023-12-16)

### Feat

- yaml: possibilité de désactiver la barre de recherche
- defaultMarkpage : plus besoin de blockquote
- aside pour les sous-titres + aside aside pour les sous-sous-titres
- gestion des admonitions avec collapsible =&gt; balise details

### Fix

- CSS: maxWidth défini dans root
- CSS: h2 & h3
- Ajout classe noSubSections
- CSS: meilleure gestion width/maxWidth
- CSS: #initialMessage padding
- fix: admonition end tag + css admonitionContent
- CSS: ajout classe .center
- CSS: fix footer
- fix scroll automatique pour les sections sans sous-sections
- CSS: h3 img - contain plutôt que cover
- CSS: fix footer position bottom
- typo nom fichier markpage-logo.png
- Si source sur CodiMD : suppression du # à la fin
- CSS: h2 margin-top pour petits écrans

## 1.3.1 (2023-12-13)

### Fix

- extension showdon: gestion des admonitions
- Message initial : pas nécessairement un blockquote
- Amélioration CSS : subSectionContent (max-width)

## 1.3.0 (2023-12-13)

### Feat

- Gestion des generic attributes dans le markdown

### Fix

- Amélioration CSS : h3 (display flex)
- Amélioration styles : h3
- Améliorations CSS : h2, h3, img (+ petits écrans)
- Fix test présence sous-sections dans parseMarkdown & createMarkpage
- Fix affichage par défaut de la première sous-section
- ajustement CSS en cas de sous-section longue

## 1.2.2 (2023-12-11)

### Fix

- displayResults: CSS
- Ajout backgroundInnerBox en cas de dépassement du contenu d'une sous-section
- Escape pour sortir de la barre de recherche
- fix SearchText
- fix changeDisplayBasedOnParams

## 1.2.1 (2023-12-11)

### Fix

- displayResults: HTML+JS
- nommage id html =&gt; initialMessage & searchInput
- constante subSectionsData
- typo label searchInput
- fix affichage par défaut première sous-section

## 1.2.0 (2023-12-10)

### Feat

- gestion yaml + scripts en local
- searchBar : html & CSS
- Affichage par défaut de la première sous-section pour chaque section

### Fix

- fix gestion des maths
- sous-titres sousSections: h3 span
- amélioration css : footer & h1 petits écrans
- CSS petits écrans + windowScroll smooth
- Ajout auto subsec=1 ssi il existe des sousSections
- fix window Scroll quand subsec=1
- Message d'erreur : problème URL ou syntaxe
- fix windowScroll (check params not undefined)
- petits écrans font-size h2
- fix windowScroll petits écrans / linkTo subSection
- fix footer margin-bottom
- petits écrans: height footer

## 1.1.0 (2023-12-10)

### Feat

- Gestion retours en arrière dans l'historique web

### Fix

- page d'accueil
- favicon +  logo

## 1.0.0 (2023-12-10)

- Initial commit
