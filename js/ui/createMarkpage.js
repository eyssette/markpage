import { yaml } from "../processMarkdown/yaml";
import { handleMarkpage } from "./handleMarkpage";

export function createMarkpage(markpageData, urlSourceMarkpage) {
	const titleElement = document.getElementById("title");
	const initialMessageElement = document.getElementById("initialMessage");
	const mainElement = document.getElementById("content");
	const innerBoxElement = document.getElementById("innerBox");
	if (yaml.searchbar === false) {
		innerBoxElement.classList.add("noSearchBar");
	}
	const footerContentElement = document.getElementById("footerContent");
	const title = markpageData[0];
	const initialMessage = markpageData[1];
	const sections = markpageData[2];
	const sectionsContent = markpageData[3];
	let sectionsHTML = "";
	const homeLink = urlSourceMarkpage ? ".#" + urlSourceMarkpage : ".";
	let footerHTML =
		'<a href="' +
		homeLink +
		'" class="navigationLink" aria-label="Page d\'accueil"><span class="homeIcon"></span></a>';
	let param;
	// On crée le HTML pour le contenu en parcourant le contenu de chaque section
	for (let i = 0; i < sections.length; i++) {
		const sectionID = i + 1;
		// On récupère le titre de chaque section
		const sectionTitle = sections[i];
		// On récupère le contenu de chaque section
		const sectionContent = sectionsContent[i];
		// On va utiliser des paramètres dans l'URL pour naviguer entre sections
		const paramInit = "?sec=" + sectionID + "&subsec=1";
		param = urlSourceMarkpage ? paramInit + "#" + urlSourceMarkpage : paramInit;
		// On commence le HTML pour chaque section, avec le titre de chaque section et un lien vers la section correspondante
		sectionsHTML = sectionsHTML + '<section id="section-' + sectionID + '">';
		const linkH2 =
			'<a href="' + param + '" class="navigationLink">' + sectionTitle + "</a>";
		sectionsHTML = sectionsHTML + "<h2>" + linkH2 + "</h2>";
		footerHTML = footerHTML + linkH2;

		sectionsHTML = sectionsHTML + '<div class="sectionContent">';
		// On regarde s'il y a des sous-sections
		if (typeof sectionContent[0] === "object") {
			// S'il y a des sous-sections, on parcourt le contenu de chaque sous-section
			for (let j = 0; j < sectionContent.length; j++) {
				// Pour chaque sous-section …
				const subSectionID = j + 1;
				const subSection = sectionContent[j];
				sectionsHTML =
					sectionsHTML +
					'<section class="subSection" id="subSection-' +
					subSectionID +
					'">';
				// … on récupère le titre, l'image et le contenu
				const titleH3 = subSection[0];
				const imageH3 = subSection[1].replace("<p>", "").replace("</p>", "");
				const contentH3 = subSection[2];
				// … on insère un lien dans le titre avec un paramètre dans l'URL pour naviguer entre les sous-sections
				const paramWithoutHash = paramInit + "&subsec=" + subSectionID;
				param = urlSourceMarkpage
					? paramWithoutHash + "#" + urlSourceMarkpage
					: paramWithoutHash;
				sectionsHTML =
					sectionsHTML +
					"<h3>" +
					imageH3 +
					'<a href="' +
					param +
					'" class="navigationLink">' +
					titleH3 +
					"</a></h3>";
				sectionsHTML =
					sectionsHTML +
					'<div class="subSectionContent">' +
					contentH3 +
					"</div>";
				sectionsHTML = sectionsHTML + "</section>";
				param = paramInit;
			}
			sectionsHTML = sectionsHTML + "</div>";
		} else {
			// S'il n'y a pas de sous-sections, on insère directement le contenu de la section
			sectionsHTML = sectionsHTML + sectionContent + "</div>";
		}
		sectionsHTML = sectionsHTML + "</section>";
	}

	// On affiche le mini site
	titleElement.innerHTML = title;
	document.title = title.replace("<span>", " – ").replace(/<[^>]*>?/gm, "");
	if (initialMessage.length > 0 || yaml.pad) {
		initialMessageElement.innerHTML = initialMessage;
		initialMessageElement.style.display = "block";
	} else {
		initialMessageElement.style.display = "none";
	}
	mainElement.innerHTML = sectionsHTML;
	footerContentElement.innerHTML = footerHTML;
	handleMarkpage(markpageData);
}
