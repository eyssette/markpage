// Par défaut on affiche ça :
const defaultMarkpage = `# Markpage

<div style="float:left; margin-right:2em; " markdown> ![](markpage-logo.png =90x90)</div> 
 
Markpage est un outil libre et gratuit qui permet de créer facilement un minisite web ou une application pour smarphone, à partir d'un simple fichier en Markdown
 
Outil créé par [Cédric Eyssette](https://eyssette.github.io/).
 
Les sources de ce logiciel sont sur [la Forge des Communs Numériques Éducatifs](https://forge.aeif.fr/eyssette/markpage)

## Comment ça marche ?

Voici le principe

## Des exemples ?


## Crédits

Markpage utilise les logiciels libres suivants :

`;

let md = defaultMarkpage;

// On peut définir des raccourcis vers ses markpages (si on veut forker le projet et avoir une URL plus courte à partager)

const shortcuts = [
	["myMarkpage","URL"],
]

let markpageData;

function getMarkdownContent() {
	// Récupération du markdown externe
	let urlMD = window.location.hash.substring(1); // Récupère l'URL du hashtag sans le #
	if (urlMD !== "") {
		// Gestion des fichiers hébergés sur github
		if (urlMD.startsWith("https://github.com")) {
			urlMD = urlMD.replace(
				"https://github.com",
				"https://raw.githubusercontent.com"
			);
			urlMD = urlMD.replace("/blob/", "/");
		}
		// Gestion des fichiers hébergés sur codiMD
		if (
			urlMD.startsWith("https://codimd") &&
			urlMD.indexOf("download") === -1
		) {
			urlMD =
				urlMD.replace("?edit", "").replace("?both", "").replace("?view", "").replace(/#$/, "") +
				"/download";
		}
		// Vérification de la présence d'un raccourci
		shortcut = shortcuts.find(element => element[0]==urlMD)
		if (shortcut) {
			urlMD = shortcut[1]
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

// Variables pour la gestion de l'en-tête YAML
let yamlData;
let yamlMaths;
let yamlStyle;
let yamlSearchbar = true;

// Extensions pour Showdown

// Gestion des attributs génériques du type {.classe1 .classe2}
function showdownExtensionGenericAttributes() {
	return [
	  {
		type: 'output',
		filter: (text) => {
			const regex = /<(\w+)>(.*?){(.*?)}/g;
			const matches = text.match(regex)
			if (matches) {
				let modifiedText = text;
				for (const match of matches) {
					const matchInformations = regex.exec(match);
					const classes = matchInformations[3].replaceAll(".","")
					const matchReplaced = match.replace(regex,`<$1 class="${classes}">$2`)
					modifiedText = modifiedText.replaceAll(match,matchReplaced)
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
				return modifiedText;
			} else {
				return text;
			}
		}
	  }
	];
  };


function parseMarkdown(markdownContent) {
	// Gestion de la conversion du markdown en HTML
	const converter = new showdown.Converter({
		emoji: true,
		parseImgDimensions: true,
		simplifiedAutoLink: true,
		extensions: [showdownExtensionGenericAttributes, showdownExtensionAdmonitions],
	});
	function markdownToHTML(text) {
		let html = converter.makeHtml(text);
		// Optimisation de l'affichage des images
		html = html.replaceAll("<img ",'<img loading="lazy" ')
		return html;
	}
	
	// Gestion de l'en-tête YAML
	if (markdownContent.split("---").length > 2) {
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
					styleElement.innerHTML = yamlStyle;
					document.body.appendChild(styleElement);
				}
				// Choix possible de ne pas avoir la searchbar
				if (property == "searchbar" || property == "recherche") {
					yamlSearchbar = yamlData[property];
				}
			}
		} catch (e) {}
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
		const sectionTitle = section.substring(0,indexEndTitle);
		const sectionContent = section.substring(indexEndTitle);
		sectionsTitles.push(sectionTitle);

		// Dans chaque section, on regarde s'il y a des sous-sections (définis par un titre h3)
		const subSections = sectionContent.split(/(?<!#)### /).filter(filterElementWithNoContent);
		let subSectionsContent = [];
		if (sectionContent.match(/(?<!#)### /)) {
			// S'il y a des sous-sections …
			for (const subSection of subSections) {
				// … on récupère le titre, l'image et le contenu de chaque sous-section
				// - récupération du titre
				const indexEndTitleSubSection = subSection.indexOf('\n');
				const subSectionTitle = subSection.substring(0,indexEndTitleSubSection);
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
		markpageTitle,
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