// Par défaut on affiche ça :
const defaultMarkpage = `# Markpage

<div style="float:left; margin-right:2em; " markdown> ![](markpage-logo.png =100x100)</div> 
 
Markpage est un outil **libre** et **gratuit** qui permet de créer facilement un minisite web ou une application pour smartphone, à partir d'un simple fichier en Markdown.

On peut l'utiliser notamment pour créer des petits modules de formation ou de révision.

Outil créé par [Cédric Eyssette](https://eyssette.forge.apps.education.fr/).
 
Les sources de ce logiciel sont sur la [Forge des Communs Numériques Éducatifs](https://forge.apps.education.fr/markpage/markpage.forge.apps.education.fr)

## Comment ça marche ?

### Le principe

1. Créez un fichier sur CodiMD ou sur une forge
2. Créez votre site en respectant la [syntaxe de Markpage](?sec=1&subsec=2)
3. Votre site sera alors disponible à l'adresse : https://markpage.forge.apps.education.fr/#URL (en remplaçant URL par l'URL de votre fichier)

### Syntaxe de base

Le plus simple est de récupérer ce [modèle sur CodiMD](https://codimd.apps.education.fr/8IuZtiIqRwWfrQO9Rec4nA?both).

Ce modèle permet de générer ce mini-site : [voir le site](https://markpage.forge.apps.education.fr/#https://codimd.apps.education.fr/8IuZtiIqRwWfrQO9Rec4nA?both).

La syntaxe de base est simple :

- on définit le titre de son site avec un titre de niveau 1
- tout ce qui vient entre ce titre et le premier titre de niveau 2 est considéré comme le message initial qui apparaît sur la page d'accueil
- on fait des onglets avec les titres de niveau 2
- tout ce qui vient sous un titre de niveau 2 est considéré comme le contenu de cet onglet
- on peut faire des sous-sections avec des titres de niveau 3

On peut utiliser toute la syntaxe Markdown classique dans le contenu de son site.

### Titres de sous-sections

On peut ajouter une image et des sous-titres aux titres de sous-sections.

Pour ajouter une image, on ajoute l'image en markdown dans la ligne juste au-dessous du titre de la sous-section.

Pour ajouter un sous-titre, on place le sous-titre dans un élément \`aside\`, et on peut mettre également un deuxième sous-titre avec un autre élément \`aside\` dans le premier élément \`aside\`.

On peut combiner ces trois éléments.

\`\`\`
### Titre section <aside>Sous-titre<aside>Deuxième sous-titre</aside></aside>
![](URL-image)
\`\`\`



<!-- ##Des exemples ? -->


## Options plus avancées

### En-tête YAML

Vous pouvez au début de votre fichier ajouter un en-tête YAML de ce type :

\`\`\`
---
maths: true
style: a{color:red}
recherche: false
lienPageAccueil: true
swipe: false
---
\`\`\`

- \`maths: true\` permet d'écrire des formules mathématiques en Latex avec la syntaxe \`$Latex$\` ou \`$$Latex$$\`
- \`style: a{color:red}\` permet d'ajouter des styles CSS personnalisés
- \`recherche: false\` permet de supprimer la barre de recherche en haut à gauche
- \`lienPageAccueil: true\` permet d'ajouter un lien vers la page d'accueil en haut à droite
- \`swipe: false\` permet de changer le mode de navigation sur mobile : par défaut, le paramètre est sur \`true\`, une seule sous-section est affichée et on navigue avec un mouvement de swipe ou bien via des boutons de navigation. Avec \`false\`, seule le contenu de la section active est affichée, mais tous les titres de sous-section sont présents et on peut scroller pour cliquer sur la sous-section qui nous intéresse.

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

\`\`\`
:::typeAdmonition titre

Bloc de texte en Markdown multiligne

:::
\`\`\`

#### Admonitions dépliables

Si vous voulez que votre admonition soit caché par défaut et dépliable en cliquant dessus, il faut ajouter \`collapsible\` à la première ligne

\`\`\`
:::typeAdmonition collapsible titre

Bloc de texte en Markdown multiligne caché par défaut

:::
\`\`\`

:::info collapsible Admonition dépliable
Contenu
:::

### Attributions de classes CSS

Vous pouvez aussi attribuer une classe CSS à une ligne avec la syntaxe \`{.maClasse}\` en fin de ligne.

Si vous voulez attribuer une classe CSS à plusieurs lignes, il faut utiliser cette syntaxe :

\`\`\`
<div markdown class="maClasse">
Bloc de texte Markdown multiligne
</div>
\`\`\`

#### Classes prédéfinies

La classe \`{.center}\` permet de centrer un paragraphe.

La classe \`{.large}\` après une image sous un titre de sous-section permet d'avoir une grande image plutôt qu'une petit icône.

## Crédits

Markpage est hébergé sur la [Forge des Communs Numériques Éducatifs](https://forge.apps.education.fr) et utilise les logiciels libres suivants :

- [showdown](https://github.com/showdownjs/showdown) pour la conversion du markdown en html
- [js-yaml](https://github.com/nodeca/js-yaml) pour la gestion des en-têtes yaml
- [katex](https://katex.org/) pour la gestion des mathématiques en Latex

`;

let md = defaultMarkpage;

// On peut définir des raccourcis vers ses markpages (si on veut forker le projet et avoir une URL plus courte à partager)

const shortcuts = [
	["myMarkpage","URL"],
]

let markpageData;

// Variables pour la gestion de l'en-tête YAML
let yamlData;
let yamlMaths;
let yamlStyle;
let yamlSearchbar = true;
let yamlLinkToHomePage = false;
let yamlSwipe = true;

function getMarkdownContent() {
	// Récupération du markdown externe
	let urlMD = window.location.hash.substring(1); // Récupère l'URL du hashtag sans le #
	if (urlMD !== "") {
		// Vérification de la présence d'un raccourci
		const shortcut = shortcuts.find(element => element[0]==urlMD)
		if (shortcut) {
			urlMD = shortcut[1]
		}
		// Gestion des fichiers hébergés sur github
		if (urlMD.startsWith("https://github.com")) {
			urlMD = urlMD.replace(
				"https://github.com",
				"https://raw.githubusercontent.com"
			);
			urlMD = urlMD.replace("/blob/", "/");
		}
		// gestion des fichiers hébergés sur codiMD / hedgedoc / digipage
		if (
			(urlMD.startsWith("https://codimd") || urlMD.includes("hedgedoc") || urlMD.includes("digipage") )
		) {
			urlMD =
				urlMD.replace("?edit", "").replace("?both", "").replace("?view", "").replace(/#$/,"").replace(/\/$/,'');
			urlMD = urlMD.indexOf("download") === -1 ? urlMD + "/download" : urlMD;
		}
		// gestion des fichiers hébergés sur framapad
		if (urlMD.includes('framapad') && !urlMD.endsWith('/export/txt')) {
			urlMD = urlMD.replace(/\?.*/,'') + '/export/txt';
		}

		// Récupération du contenu du fichier
		fetch(urlMD)
			.then((response) => response.text())
			.then((data) => {
				md = data;
				markpageData = parseMarkdown(md);
				createMarkpage(markpageData);
			})
			.catch((error) => {
				markpageData = parseMarkdown(defaultMarkpage);
				createMarkpage(markpageData);
				alert("Il y a une erreur dans l'URL ou dans la syntaxe du fichier source. Merci de vous assurer que le fichier est bien accessible et qu'il respecte les règles d'écriture de Markpage")
				console.log(error);
			});
	} else {
		markpageData = parseMarkdown(md);
		createMarkpage(markpageData);
	}
}

getMarkdownContent()

// Filtres pour supprimer des éléments inutiles
function filterElementWithNoContent(element) {
	value = element.trim().replace('\n','') === '' ? false : true; 
	return value;
}

function removeUselessCarriages(text) {
	text = text.replace(/^\n*/,'').replace(/\n*$/,'');
	return text;
}

function loadScript(src) {
	// Fonction pour charger des scripts
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.onload = resolve;
		script.onerror = reject;
		document.head.appendChild(script);
	});
}
function loadCSS(src) {
	// Fonction pour charger des CSS
	return new Promise((resolve, reject) => {
		const styleElement = document.createElement("link");
		styleElement.href = src;
		styleElement.rel = "stylesheet";
		styleElement.onload = resolve;
		styleElement.onerror = reject;
		document.head.appendChild(styleElement);
	});
}

// Extensions pour Showdown

// Gestion des attributs génériques du type {.classe1 .classe2}
function showdownExtensionGenericAttributes() {
	return [
	  {
		type: 'output',
		filter: (text) => {
			const regex = /<(\w+)>(.*?){\.(.*?)}/g;
			const matches = text.match(regex)
			if (matches) {
				let modifiedText = text;
				for (const match of matches) {
					const indexMatch = text.indexOf(match);
					const endIndeMatch = indexMatch+match.length;
					const isInCode = text.substring(endIndeMatch,endIndeMatch+7) == "</code>" ? true : false;
					if (!isInCode) {
						const matchInformations = regex.exec(match);
						const classes = matchInformations[3].replaceAll(".","")
						const matchReplaced = match.replace(regex,`<$1 class="${classes}">$2`)
						modifiedText = modifiedText.replaceAll(match,matchReplaced)
					}
				}
				return modifiedText;
			} else {
				return text;
			}
		}
	  }
	];
};

// Gestion des admonitions
function showdownExtensionAdmonitions() {
	return [
	  {
		type: 'output',
		filter: (text) => {
			text = text.replaceAll('<p>:::',':::')
			const regex = /:::(.*?)\n(.*?):::/gs;
			const matches = text.match(regex);
			if (matches) {
				let modifiedText = text;
				for (const match of matches) {
					const regex2 = /:::(.*?)\s(.*?)\n(.*?):::/s;
					const matchInformations = regex2.exec(match);
					const indexMatch = text.indexOf(match);
					// Pas de transformation de l'admonition en html si l'admonition est dans un bloc code
					const isInCode = text.substring(indexMatch-6,indexMatch) == "<code>" ? true : false
					if (!isInCode) {
						const type = matchInformations[1]
						let title = matchInformations[2]
						const content = matchInformations[3]
						if (title.includes('collapsible')) {
							title = title.replace('collapsible','')
							matchReplaced = `<div class="admonition ${type}"><details><summary class="admonitionTitle">${title}</summary><div class="admonitionContent">${content}</div></details></div>`
						} else {
							matchReplaced = `<div class="admonition ${type}"><div class="admonitionTitle">${title}</div><div class="admonitionContent">${content}</div></div>`
						}
						modifiedText = modifiedText.replaceAll(match,matchReplaced)
					}
					
				}
				return modifiedText;
			} else {
				return text;
			}
		}
	  }
	];
  };

// Gestion des éléments soulignés et surlignés
function showdownExtensionUnderline() {
	return [
		{
		  type: 'output',
		  filter: (text) => {
			text = text.replaceAll(/\+\+(.*?)\+\+/g,'<u>$1</u>')
			return text;
		  }
		}]
}
function showdownExtensionHighlight() {
	return [
		{
		  type: 'output',
		  filter: (text) => {
			text = text.replaceAll(/\=\=(.*?)\=\=/g,'<mark>$1</mark>')
			return text;
		  }
		}]
}

function parseMarkdown(markdownContent) {
	// Gestion de la conversion du markdown en HTML
	const converter = new showdown.Converter({
		emoji: true,
		parseImgDimensions: true,
		simplifiedAutoLink: true,
		simpleLineBreaks: true,
		tables: true,
		extensions: [showdownExtensionGenericAttributes, showdownExtensionAdmonitions, showdownExtensionUnderline, showdownExtensionHighlight],
	});
	function markdownToHTML(text) {
		text = text.replaceAll('\n\n|','|')
		let html = converter.makeHtml(text);
		// Optimisation de l'affichage des images
		html = html.replaceAll("<img ",'<img loading="lazy" ')
		return html;
	}
	
	// Gestion de l'en-tête YAML
	if (markdownContent.split("---").length > 2 && markdownContent.startsWith("---")) {
		yamlPart = markdownContent.split("---")[1]
		try {
			yamlData = jsyaml.load(yamlPart);
			for (const property in yamlData) {
				// Gestion des mathématiques
				if (property == "maths") {
					yamlMaths = yamlData[property];
					if (yamlMaths === true) {
						Promise.all([
							loadScript(
								"https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
							),
							loadCSS(
								"https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
							),
						]);
					}
				}
				// Gestion des styles personnalisés
				if (property == "style") {
					yamlStyle = yamlData[property];
					const styleElement = document.createElement("style");
					styleElement.innerHTML = yamlStyle.replaceAll("\\","");
					document.body.appendChild(styleElement);
				}
				// Choix possible de ne pas avoir la searchbar
				if (property == "searchbar" || property == "recherche") {
					yamlSearchbar = yamlData[property];
				}
				// Affichage possible d'un lien supplémentaire vers la page d'accueil en haut à droite
				if (property == "linkToHomePage" || property == "lienPageAccueil") {
					yamlLinkToHomePage = yamlData[property];
				}
				// Possibilité de désactiver le swipe et par conséquent aussi l'affichage step-by-step (avec les boutons de navitation en bas)
				if (property == "swipe") {
					yamlSwipe = yamlData[property];
				}
			}
		} catch (e) {}
	}
	if (yamlSwipe == true) {
		loadCSS("swipe.min.css");
	}

	// On distingue le header et le contenu
	const indexfirstH2title = markdownContent.indexOf("## ");
	const header = markdownContent.substring(0,indexfirstH2title);
	const mainContent = markdownContent.substring(indexfirstH2title);

	// Dans le header, on distingue le titre (défini par un titre h1) et le message initial

	const markpageTitle = header.match(/# .*/)[0].replace('# ','')
	const indexStartTitle = header.indexOf(markpageTitle);
	const initialMessageContent = header.substring(indexStartTitle+markpageTitle.length+2);

	// Dans le contenu, on distingue chaque section (définie par un titre h2)
	const sections = mainContent.split(/(?<!#)## /).filter(Boolean);
	let sectionsTitles = [];
	let subSectionsArray = []

	for (const section of sections) {
		
		// Dans chaque section, on distingue le titre et le contenu
		const indexEndTitle = section.indexOf('\n');
		const sectionTitle = markdownToHTML(section.substring(0,indexEndTitle)).replace('<p>','').replace('</p>','');
		const sectionContent = section.substring(indexEndTitle);
		sectionsTitles.push(sectionTitle);

		// Dans chaque section, on regarde s'il y a des sous-sections (définis par un titre h3)
		const subSections = sectionContent.split(/(?<!`\n)(?<!#)### /).filter(filterElementWithNoContent);
		let subSectionsContent = [];
		if (sectionContent.match(/(?<!#)### /)) {
			// S'il y a des sous-sections …
			for (const subSection of subSections) {
				// … on récupère le titre, l'image et le contenu de chaque sous-section
				// - récupération du titre
				const indexEndTitleSubSection = subSection.indexOf('\n');
				const subSectionTitle = markdownToHTML(subSection.substring(0,indexEndTitleSubSection)).replace('<p>','').replace('</p>','');
				// - récupération du contenu éventuellement avec image
				let subSectionContent = subSection.substring(1+indexEndTitleSubSection);
				// - s'il y a une image, on la récupère
				let subSectionImage = '';
				if (subSectionContent.trim().startsWith('![')) {
					const indexEndImage = subSectionContent.indexOf('\n');
					subSectionImage = markdownToHTML(subSectionContent.substring(0,indexEndImage));
					subSectionContent = subSectionContent.substring(1+indexEndImage);
				}
				// … on transforme en HTML le contenu, en supprimant les retours à la ligne inutiles
				subSectionContentHTML = markdownToHTML(removeUselessCarriages(subSectionContent));
				subSectionsContent.push([subSectionTitle,subSectionImage,subSectionContentHTML])
			}
		} else {
			// S'il n'y a pas de sous-section : on transforme directement en HTML le contenu, en supprimant les retours à la ligne inutiles
			let subSectionsContentHTML = subSections[0] ? markdownToHTML(removeUselessCarriages(subSections[0])) : '';
			subSectionsContentHTML = '<div class="noSubSections">' + subSectionsContentHTML + '</div>';
			subSectionsContent = [subSectionsContentHTML];
		}
		subSectionsArray.push(subSectionsContent)
	}

	markpageData = [
		markdownToHTML(markpageTitle).replace('<p>','').replace('</p>',''),
		markdownToHTML(initialMessageContent),
		sectionsTitles,
		subSectionsArray
	];
	
	return markpageData;
}

function createMarkpage(data) {
	const titleElement = document.getElementById("title");
	const initialMessageElement = document.getElementById("initialMessage");
	const mainElement = document.getElementById("content");
	const innerBoxElement = document.getElementById("innerBox");
	if (yamlSearchbar === false) {
		innerBoxElement.classList.add('noSearchBar');
	}
	const footerContentElement = document.getElementById("footerContent");
	const title = data[0];
	const initialMessage = data[1];
	const sections = data[2];
	const sectionsContent = data[3]
	let sectionsHTML = '';
	let footerHTML = '<a href="." class="navigationLink">🏠</a>';

	let param;

	// On crée le HTML pour le contenu en parcourant le contenu de chaque section
	for (let i = 0; i < sections.length; i++) {
		const sectionID = i+1
		// On récupère le titre de chaque section
		const sectionTitle = sections[i];
		// On récupère le contenu de chaque section
		const sectionContent = sectionsContent[i];
		// On va utiliser des paramètres dans l'URL pour naviguer entre sections
		const paramInit = "?sec="+sectionID;
		param = paramInit;
		// On commence le HTML pour chaque section, avec le titre de chaque section et un lien vers la section correspondante
		sectionsHTML = sectionsHTML + '<section id="section-'+sectionID+'">';
		const linkH2 = '<a href="'+param+'" class="navigationLink">' + sectionTitle + '</a>'
		sectionsHTML = sectionsHTML + '<h2>' + linkH2 + '</h2>'
		footerHTML = footerHTML + linkH2

		sectionsHTML = sectionsHTML + '<div class="sectionContent">';
		// On regarde s'il y a des sous-sections
		if (typeof sectionContent[0] === "object") {
			// S'il y a des sous-sections, on parcourt le contenu de chaque sous-section
			for (let j = 0; j < sectionContent.length; j++) {
				// Pour chaque sous-section …
				const subSectionID = j+1
				const subSection = sectionContent[j]
				sectionsHTML = sectionsHTML + '<section class="subSection" id="subSection-'+subSectionID+'">';
				// … on récupère le titre, l'image et le contenu
				const titleH3 = subSection[0];
				const imageH3 = subSection[1].replace('<p>','').replace('</p>','');
				const contentH3 = subSection[2]
				// … on insère un lien dans le titre avec un paramètre dans l'URL pour naviguer entre les sous-sections
				param = param+"&subsec="+subSectionID;
				sectionsHTML = sectionsHTML + '<h3>'+imageH3+'<a href="'+param+'" class="navigationLink">' + titleH3 + '</a></h3>';
				sectionsHTML = sectionsHTML + '<div class="subSectionContent">'+contentH3+'</div>'	
				sectionsHTML = sectionsHTML + '</section>';
				param = paramInit;
			}
			sectionsHTML = sectionsHTML + '</div>';
		} else {
			// S'il n'y a pas de sous-sections, on insère directement le contenu de la section
			sectionsHTML = sectionsHTML + sectionContent+'</div>';
		}
		sectionsHTML = sectionsHTML + '</section>';
	}

	// On affiche le mini site
	titleElement.innerHTML = title;
	document.title = title;
	if (initialMessage.length>0) {
		initialMessageElement.innerHTML = initialMessage;
		initialMessageElement.style.display = "block";
	}
	else {
		initialMessageElement.style.display = "none";
	}
	mainElement.innerHTML = sectionsHTML;
	footerContentElement.innerHTML = footerHTML;
	handleMarkpage()
}