import { showOnlyThisElement } from "./showOnlyThisElement";
import { changeDisplayBasedOnParams } from "./changeDisplayBasedOnParams";
import { getParams } from "../utils";
import { params } from "./handleMarkpage";
import { yaml } from "../processMarkdown/yaml";

export function handleClicks(baseURL, hash, markpageData) {
	// On détecte les clics sur les liens
	const links = document.querySelectorAll(".navigationLink");
	links.forEach(function (link) {
		let listenerElement = link;
		if (
			link.parentElement.nodeName == "H3" ||
			link.parentElement.parentElement.nodeName == "H3"
		) {
			listenerElement = link.parentElement;
		}
		listenerElement.addEventListener("click", function (event) {
			// Empêche le comportement par défaut d'ouverture du lien et récupère au contraire le contenu du lien
			event.preventDefault();
			const linkURL = link.href.replace(link.hash, "");
			let newURL;
			if (linkURL == baseURL || linkURL + "index.html" == baseURL) {
				newURL = baseURL + "#" + hash;
				delete params.sec;
				delete params.subsec;
				showOnlyThisElement(undefined, "sections");
				showOnlyThisElement(undefined, "subsections");
			} else {
				Object.assign(params, getParams(linkURL));
				if (!("subsec" in getParams(linkURL))) {
					params.subsec = 1;
				}
				// Changement de l'historique de l'URL
				newURL =
					baseURL +
					"?" +
					Object.keys(params)
						.map(function (key) {
							return key + "=" + encodeURIComponent(params[key]);
						})
						.join("&") +
					"#" +
					hash;
			}
			history.pushState({ path: newURL }, "", newURL);
			changeDisplayBasedOnParams(params, markpageData);
		});
	});

	// Possibilité de se déplacer à gauche ou à droite avec un clic maintenu sur la souris
	// (Dans le mode "pad")
	if (yaml.pad) {
		document.addEventListener("mousedown", function (event) {
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
				(event.target.tagName == "A" &&
					event.target.parentElement.tagName != "H3")
			) {
				return;
			}

			let startX = event.clientX;
			let scrollLeft =
				document.documentElement.scrollLeft || document.body.scrollLeft;
			let isDragging = true;

			// On empêche la sélection de texte au moment de relâcher la souris
			event.preventDefault();

			function onMouseMove(e) {
				if (!isDragging) return;
				let deltaX = e.clientX - startX;
				window.scrollTo({ left: scrollLeft - deltaX, behavior: "auto" });
			}

			function onMouseUp() {
				isDragging = false;
				document.removeEventListener("mousemove", onMouseMove);
				document.removeEventListener("mouseup", onMouseUp);
			}

			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", onMouseUp);
		});
	}
}
