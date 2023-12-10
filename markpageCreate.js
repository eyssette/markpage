// Par défaut on affiche ça :
const defaultMarkpage = `# Markpage

> <div style="float:left; margin-right:2em; " markdown> ![](markmap-logo.png =90x90)</div> 
> 
> Markpage est un outil libre et gratuit qui permet de créer facilement un minisite web ou une application pour smarphone, à partir d'un simple fichier en Markdown
> 
> Outil créé par [Cédric Eyssette](https://eyssette.github.io/).
> 
> Les sources de ce logiciel sont sur [la Forge des Communs Numériques Éducatifs](https://forge.aeif.fr/eyssette/markpage)

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
				urlMD.replace("?edit", "").replace("?both", "").replace("?view", "") +
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
				alert("Il y a une erreur dans l'URL. Merci de la vérifier et de vous assurer que le fichier est bien accessible.")
				console.log(error);
			});
	} else {
		markpageData = parseMarkdown(md);
		createMarkpage(markpageData);
	}
}

getMarkdownContent()

function filterElementWithNoContent(element) {
	value = element.trim().replace('\n','') === '' ? false : true; 
	return value;
}

function removeUselessCarriages(text) {
	text = text.replace(/^\n*/,'').replace(/\n*$/,'');
	return text;
}

function parseMarkdown(markdownContent) {
	// Gestion de la conversion du markdown en HTML
	const converter = new showdown.Converter({
		emoji: true,
		parseImgDimensions: true,
		simplifiedAutoLink: true,
	});
	function markdownToHTML(text) {
		let html = converter.makeHtml(text);
		// Optimisation de l'affichage des images
		html = html.replaceAll("<img ",'<img loading="lazy" ')
		return html;
	}
	
	// On distingue le header et le contenu
	const indexfirstH2title = markdownContent.indexOf("## ");
	const header = markdownContent.substring(0,indexfirstH2title);
	const mainContent = markdownContent.substring(indexfirstH2title);

	// Dans le header, on distingue le titre (défini par un titre h1) et le message initial (défini par un blockquote)
	const indexStartBlockquote = header.indexOf('> ');
	let markpageTitle;
	let initialMessageContent;
	if (indexStartBlockquote == -1) {
		markpageTitle = header.replace('# ','').replace('\n','');
		initialMessageContent = '';
	} else {
		markpageTitle = header.substring(0,indexStartBlockquote).replace('# ','').replace('\n','');
		initialMessageContent = header.substring(indexStartBlockquote);
	}

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
		if (subSections.length > 1) {
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
			const subSectionsContentHTML = subSections[0] ? markdownToHTML(removeUselessCarriages(subSections[0])) : '';
			subSectionsContent = [subSectionsContentHTML]
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
	const initialMessageElement = document.getElementById("initial-message");
	const mainElement = document.getElementById("content");
	const footerContentElement = document.getElementById("footerContent");
	const title = data[0];
	const initialMessage = data[1];
	const sections = data[2];
	const sectionsContent = data[3]
	let sectionsHTML = '';
	let footerHTML = '<a href="." class="navigationLink">🏠</a>';

	// On change le titre et le message initial avec le contenu personnalisé
	titleElement.innerHTML = title;
	if (initialMessage.length>0) {
		initialMessageElement.innerHTML = initialMessage;
		initialMessageElement.style.display = "block";
	}
	else {
		initialMessageElement.style.display = "none";
	}
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
		if (sectionContent.length > 1) {
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
	mainElement.innerHTML = sectionsHTML;
	footerContentElement.innerHTML = footerHTML;
	handleMarkpage()
}