import { showOnlyThisElement } from "./showOnlyThisElement.js";
import { changeDisplayBasedOnParams } from "./changeDisplayBasedOnParams.js";
import { getParams } from "../utils.js";
import { params } from "./handleMarkpage.js";
import { yaml } from "../processMarkdown/yaml.js";
import { handleTags } from "./searchBar/handleTags.js";
import { handleSelectElements } from "./searchBar/handleSelectElements.js";

let hasDocumentClickListener = false;
let hasInnerBoxMouseListener = false;
let latestBaseURL = "";
let latestHash = "";
let latestMarkpageData;
let latestDocument;
let activeYaml;

// Permet de trouver le titre h3 le plus proche en haut qui n'a pas la classe "groupDisplay" (c'est le titre de la sous-section) à partir d'un élément donné (qui peut être un titre h4, h5 ou h6, ou un autre élément à l'intérieur d'une sous-section)
function findPreviousNonGroupDisplaySectionTitle(element) {
	let currentElement = element;
	while (currentElement) {
		const titleElement = currentElement.querySelector("h3");
		if (titleElement && !titleElement.classList.contains("groupDisplay")) {
			return titleElement;
		}
		currentElement = currentElement.previousElementSibling;
	}
}

// Pour créer un lien vers une section spécifique, il suffit de faire un clic avec la touche alt du clavier sur le titre de la section.
// Cela va copier dans le presse-papier l'URL de la section, avec les paramètres "sec", "subsec" et éventuellement "part" dans l'URL, et comme valeurs les titres de la section, de la sous-section et de la partie correspondantes.
// Ces titres sont transformés pour être compatibles avec l'URL (on enlève les espaces, on garde seulement les lettres (éventuellement accentuées) et les chiffres, on met tout en minuscules).

function copySectionLinkToClipboard(titleElement, hash) {
	const sectionElement = titleElement.closest("#content > section");
	const subSectionElement = titleElement.closest(".subSection");

	let sectionTitle = "";
	let subSectionTitle = "";
	let partTitle = "";
	let subPartTitle = "";
	let isGroupDisplay = false;

	if (sectionElement) {
		sectionTitle = sectionElement.querySelector("h2").textContent;
	}
	if (subSectionElement) {
		// On vérifie si la sous-section est affichée dans un groupe de sous-sections (avec la classe "groupDisplay")
		const parentSubSectionElement = titleElement.parentElement;
		isGroupDisplay = titleElement.classList.contains("groupDisplay");
		// Si c'est le cas, on met pour subsectionTitle, le titre h3 le plus proche en haut qui n'a pas la classe "groupDisplay" (c'est le titre de la sous-section)
		if (isGroupDisplay) {
			const parentSectionElement = parentSubSectionElement.closest("section");
			const h3Element =
				findPreviousNonGroupDisplaySectionTitle(parentSectionElement);
			if (h3Element) subSectionTitle = h3Element.textContent;
			partTitle = subSectionElement.querySelector("h3").textContent;
		} else {
			subSectionTitle = subSectionElement.querySelector("h3").textContent;
		}
	}

	// Si l'élément cliqué est un titre h4, h5 ou h6, c'est le titre de la partie
	if (
		titleElement.tagName === "H4" ||
		titleElement.tagName === "H5" ||
		titleElement.tagName === "H6"
	) {
		// On vérifie si on est dans un groupe de sous-sections (avec la classe "groupDisplay")
		const parentSubSectionElement = titleElement.closest(".subSection");
		const subSectionGroupTitle =
			parentSubSectionElement && parentSubSectionElement.querySelector("h3");
		isGroupDisplay =
			subSectionGroupTitle &&
			subSectionGroupTitle.classList.contains("groupDisplay");
		if (isGroupDisplay) {
			partTitle = subSectionTitle;
			// On remonte de sous-section en sous-section jusqu'à trouver le titre h3 qui n'a pas la classe "groupDisplay"
			const h3Element = findPreviousNonGroupDisplaySectionTitle(
				parentSubSectionElement,
			);
			if (h3Element) {
				subSectionTitle = h3Element.textContent;
				subPartTitle = titleElement.textContent;
			}
		} else {
			partTitle = titleElement.textContent;
		}
	}

	// On transforme les titres pour qu'ils soient compatibles avec l'URL
	const transformTitleForURL = (title) => {
		return title
			.replace(/#.*/, "")
			.replace(/[^a-zA-Z0-9À-ÿ]/g, "")
			.toLowerCase();
	};

	const sectionParam = transformTitleForURL(sectionTitle);
	const subSectionParam = transformTitleForURL(subSectionTitle);
	const partParam = transformTitleForURL(partTitle);
	const subPartParam = transformTitleForURL(subPartTitle);

	// On conserve les autres paramètres de l'URL et on remplace sec, subsec et part
	const urlObject = new URL(window.location.href);
	urlObject.hash = hash;
	for (const [key, value] of [
		["sec", sectionParam],
		["subsec", subSectionParam],
		["part", partParam],
		["subpart", subPartParam],
	]) {
		urlObject.searchParams.delete(key);
		if (value) urlObject.searchParams.set(key, value);
	}
	// On ajoute le paramètre groupDisplay si nécessaire
	if (isGroupDisplay) {
		urlObject.searchParams.set("groupDisplay", "true");
	} else {
		urlObject.searchParams.delete("groupDisplay");
	}
	const url = urlObject.href;

	navigator.clipboard.writeText(url).then(
		function () {
			confirm("Lien copié dans le presse-papier : " + url);
		},
		function (err) {
			console.error(
				"Erreur lors de la copie du lien dans le presse-papier : ",
				err,
			);
		},
	);
}

function getNavigationLinkFromTarget(target) {
	const headingElement = target.closest("h3");
	if (headingElement) {
		const headingLink = headingElement.querySelector(".navigationLink");
		if (headingLink) return headingLink;
	}

	return target.closest(".navigationLink");
}

function handleDocumentClick(event) {
	const titleElement = event.target.closest("h2, h3, h4, h5, h6");
	if (titleElement && event.altKey) {
		event.preventDefault();
		event.stopPropagation();
		copySectionLinkToClipboard(titleElement, latestHash);
		return;
	}

	const link = getNavigationLinkFromTarget(event.target);
	if (!link) return;

	// Empêche le comportement par défaut d'ouverture du lien et récupère au contraire le contenu du lien
	event.preventDefault();
	const currentHash = window.location.hash.substring(1) || latestHash;
	const linkURL = link.href.replace(link.hash, "");
	let newURL;
	if (linkURL == latestBaseURL || linkURL + "index.html" == latestBaseURL) {
		// Si le lien est un lien vers la page d'accueil, on enlève les paramètres "sec" et "subsec" de l'URL et on affiche tout le contenu
		newURL = latestBaseURL + "#" + currentHash;
		delete params.sec;
		delete params.subsec;
		showOnlyThisElement(undefined, "sections");
		showOnlyThisElement(undefined, "subsections");
	} else {
		// Sinon, on récupère les paramètres "sec" et "subsec" du lien cliqué et on les ajoute à l'URL, puis on affiche la section ou la sous-section correspondante
		const linkURLWithoutBase = linkURL.replace(latestBaseURL, "");
		const linkParams = getParams(linkURLWithoutBase, currentHash);
		Object.assign(params, linkParams);
		if (!("subsec" in linkParams)) {
			params.subsec = 1;
		}
		// Changement de l'historique de l'URL
		newURL =
			latestBaseURL +
			"?" +
			Object.keys(params)
				.map(function (key) {
					return key + "=" + encodeURIComponent(params[key]);
				})
				.join("&") +
			"#" +
			currentHash.replace("?footnote", "");
	}
	history.pushState({ path: newURL }, "", newURL);
	changeDisplayBasedOnParams(params, latestMarkpageData);
}

function handleInnerBoxMouseDown(event) {
	const innerBox = latestDocument.querySelector("#innerBox");
	if (!innerBox) return;

	// Liste de tags à ignorer car ils représentent des éléments potentiellement interactifs
	const ignoredTags = [
		"IMG",
		"IFRAME",
		"BUTTON",
		"INPUT",
		"TEXTAREA",
		"SELECT",
		"LABEL",
		"VIDEO",
		"AUDIO",
		"CANVAS",
	];
	// On ne fait rien si on clique sur un élément potentiellement interactif ou si le clic est à l'intérieur des contenus des colonnes
	// Pour les liens "A", on traite différement les titres des capsules, sur lesquelles on peut cliquer pour se déplacer avec la souris.
	if (
		ignoredTags.includes(event.target.tagName) ||
		event.target.closest(".subSectionContent, .noSubSections") ||
		(event.target.tagName == "A" && event.target.parentElement.tagName != "H3")
	) {
		return;
	}
	let startX = event.clientX;
	const isModeLightpadNoColums =
		latestDocument.body.classList.contains("noColumns");
	let scrollableElement = isModeLightpadNoColums
		? latestDocument.body.querySelector("#content")
		: latestDocument.body.querySelector("#innerBox");

	let scrollLeft = scrollableElement.scrollLeft;
	let isDragging = true;

	// On empêche la sélection de texte au moment de relâcher la souris
	event.preventDefault();

	function onMouseMove(e) {
		if (!isDragging) return;
		let deltaX = e.clientX - startX;
		scrollableElement.scrollTo({
			left: scrollLeft - deltaX,
			behavior: "auto",
		});
	}

	function onMouseUp() {
		isDragging = false;
		innerBox.removeEventListener("mousemove", onMouseMove);
		innerBox.removeEventListener("mouseup", onMouseUp);
	}

	innerBox.addEventListener("mousemove", onMouseMove);
	innerBox.addEventListener("mouseup", onMouseUp);
}

export function setHandleClicksDependencies(dependencies = {}) {
	if (dependencies.document) {
		latestDocument = dependencies.document;
	}
	if (dependencies.yaml) {
		activeYaml = dependencies.yaml;
	}
}

export function resetHandleClicksState() {
	hasDocumentClickListener = false;
	hasInnerBoxMouseListener = false;
	latestBaseURL = "";
	latestHash = "";
	latestMarkpageData = undefined;
	latestDocument = undefined;
	activeYaml = undefined;
}

export function handleClicks(baseURL, hash, markpageData) {
	latestDocument ??= document;
	activeYaml ??= yaml;
	latestBaseURL = baseURL;
	latestHash = hash;
	latestMarkpageData = markpageData;

	if (!hasDocumentClickListener) {
		latestDocument.addEventListener("click", handleDocumentClick);
		hasDocumentClickListener = true;
	}

	// Gestion des boutons de filtres dans Lightpad
	if (activeYaml.lightpad) {
		handleTags();
		handleSelectElements();
	}

	// Possibilité de se déplacer à gauche ou à droite avec un clic maintenu sur la souris
	// (Dans le mode "pad")
	if (activeYaml.pad && !hasInnerBoxMouseListener) {
		latestDocument.addEventListener("mousedown", function (event) {
			if (!event.target.closest("#innerBox")) return;
			handleInnerBoxMouseDown(event);
		});
		hasInnerBoxMouseListener = true;
	}
}
