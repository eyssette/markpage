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
	if (
		yaml.lightpad &&
		sections.length == 1 &&
		sectionsContent &&
		sectionsContent[0].length > 1
	) {
		// S'il n'y a pas de titres h2 dans un lightpad (=pas de colonnes) et qu'il y a plusieurs capsules (h3+contenu), on utilise un style particulier, défini par la classe noColumns
		document.body.classList.add("noColumns");
	}
	for (let i = 0; i < sections.length; i++) {
		const sectionID = i + 1;
		// On récupère le titre de chaque section
		let sectionTitle = sections[i];
		let sectionTitleInitialTag = "<h2>";
		// Si le titre H2 de section contient une classe générée par un attribut générique de type {.maClasse}, on attribue cette classe au titre h2 lui-même, et non pas à son contenu.
		if (sectionTitle.includes("class=")) {
			const sectionTitlematch = sectionTitle.match(
				/<p class="([^>]*)">(.*?)<\/p>/i,
			);
			sectionTitle = sectionTitlematch ? sectionTitlematch[2] : sectionTitle;
			sectionTitleInitialTag = sectionTitlematch
				? `<h2 class="${sectionTitlematch[1]}">`
				: sectionTitleInitialTag;
		}

		// On récupère le contenu de chaque section
		const sectionContent = sectionsContent[i];
		// On va utiliser des paramètres dans l'URL pour naviguer entre sections
		const paramInit = "?sec=" + sectionID;
		const paramInitH2 = paramInit + "&subsec=1";
		const paramH2 = urlSourceMarkpage
			? paramInitH2 + "#" + urlSourceMarkpage
			: paramInitH2;
		// On commence le HTML pour chaque section, avec le titre de chaque section et un lien vers la section correspondante
		sectionsHTML = sectionsHTML + '<section id="section-' + sectionID + '">';
		const linkH2 =
			'<a href="' +
			paramH2 +
			'" class="navigationLink">' +
			sectionTitle +
			"</a>";
		sectionsHTML = sectionsHTML + sectionTitleInitialTag + linkH2 + "</h2>";
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
					'<section class="subSection subSection-' +
					subSectionID +
					'">';
				// … on récupère le titre, l'image et le contenu
				let titleH3 = subSection[0];
				const imageH3 = subSection[1].replace("<p>", "").replace("</p>", "");
				const contentH3 = subSection[2];
				// … on insère un lien dans le titre avec un paramètre dans l'URL pour naviguer entre les sous-sections
				const paramWithoutHash = paramInit + "&subsec=" + subSectionID;
				param = urlSourceMarkpage
					? paramWithoutHash + "#" + urlSourceMarkpage
					: paramWithoutHash;
				let titleH3initialTag = "<h3>";
				// Si le titre H3 contient une classe générée par un attribut générique de type {.maClasse}, on attribue cette classe au titre h3 lui-même, et non pas à son contenu.
				if (titleH3.includes("class=")) {
					const titleH3match = titleH3.match(/<p class="([^>]*)">(.*?)<\/p>/i);
					titleH3 = titleH3match ? titleH3match[2] : titleH3;
					titleH3initialTag = titleH3match
						? `<h3 class="${titleH3match[1]}">`
						: titleH3initialTag;
				}
				sectionsHTML =
					sectionsHTML +
					titleH3initialTag +
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
	if (titleElement.textContent != title) {
		titleElement.innerHTML = title;
	}
	document.title = title
		.replace("<span>", " – ")
		.replace(/<[^>]*>?/gm, "")
		.trim();
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
