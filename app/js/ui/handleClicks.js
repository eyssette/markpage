import { showOnlyThisElement } from "./showOnlyThisElement";
import { changeDisplayBasedOnParams } from "./changeDisplayBasedOnParams";
import { getParams } from "../utils";
import { params } from "./handleMarkpage";
import { yaml } from "../processMarkdown/yaml";
import { handleTags } from "./searchBar/handleTags";
import { handleSelectElements } from "./searchBar/handleSelectElements";

// Pour créer un lien vers une section spécifique, il suffit de faire un clic avec la touche alt du clavier sur le titre de la section : cela va copier dans le presse-papier l'URL de la section, avec les paramètres "sec", "subsec" et éventuellement "part" dans l'URL, et comme valeurs les titres de la section, de la sous-section et de la partie correspondantes. Ces titres sont transformés pour être compatibles avec l'URL (on enlève les espaces, on garde seulement les lettres (éventuellement accentuées) et les chiffres, on met tout en minuscules).

function copySectionLinkToClipboard(event, hash) {
	const titleElement = event.target;
	const sectionElement = titleElement.closest("#content > section");
	const subSectionElement = titleElement.closest(".subSection");

	let sectionTitle = "";
	let subSectionTitle = "";
	let partTitle = "";
	let isGroupDisplay = false;

	if (sectionElement) {
		sectionTitle = sectionElement.querySelector("h2").textContent;
	}
	if (subSectionElement) {
		// On vérifie si la sous-section est affichée dans un groupe de sous-sections (avec la classe "groupDisplay")
		const parentSubSectionElement = event.target.parentElement;
		isGroupDisplay = parentSubSectionElement.classList.contains("groupDisplay");
		// Si c'est le cas, on met pour subsectionTitle, le titre h3 le plus proche en haut qui n'a pas la classe "groupDisplay" (c'est le titre de la sous-section)
		if (isGroupDisplay) {
			// On remonte vers la section précédente
			const parentSectionElement = parentSubSectionElement.closest("section");
			// On regarde le titre h3 dans cette section et on regarde s'il a la classe "groupDisplay". Si c'est le cas, on remonte encore vers la section précédente, et ainsi de suite jusqu'à trouver un titre h3 qui n'a pas la classe "groupDisplay
			let currentSectionElement = parentSectionElement;
			while (currentSectionElement) {
				const h3Element = currentSectionElement.querySelector("h3");
				if (h3Element && !h3Element.classList.contains("groupDisplay")) {
					subSectionTitle = h3Element.textContent;
					break;
				}
				currentSectionElement = currentSectionElement.previousElementSibling;
			}
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
		isGroupDisplay = parentSubSectionElement
			.querySelector("h3")
			.classList.contains("groupDisplay");
		if (isGroupDisplay) {
			partTitle = subSectionTitle;
			// On remonte de sous-section en sous-section jusqu'à trouver le titre h3 qui n'a pas la classe "groupDisplay"
			let currentSubSectionElement = parentSubSectionElement;
			while (currentSubSectionElement) {
				const h3Element = currentSubSectionElement.querySelector("h3");
				if (h3Element && !h3Element.classList.contains("groupDisplay")) {
					subSectionTitle = h3Element.textContent;
					break;
				}
				currentSubSectionElement =
					currentSubSectionElement.previousElementSibling;
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

	// On conserve les autres paramètres de l'URL et on remplace sec, subsec et part
	const urlObject = new URL(window.location.href);
	urlObject.hash = hash;
	for (const [key, value] of [
		["sec", sectionParam],
		["subsec", subSectionParam],
		["part", partParam],
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
			//
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

export function handleClicks(baseURL, hash, markpageData) {
	// Si c'est un clic avec la touche alt du clavier sur un titre de section, on copie dans le presse-papier l'URL de la section correspondante
	const clickableTitles = document.querySelectorAll("h2, h3, h4, h5, h6");
	clickableTitles.forEach(function (title) {
		if (title.dataset.altClickListener) return;
		title.dataset.altClickListener = "true";
		title.addEventListener("click", function (event) {
			if (event.altKey) {
				event.preventDefault();
				event.stopPropagation();
				copySectionLinkToClipboard(event, hash);
			}
		});
	});

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
				// Si le lien est un lien vers la page d'accueil, on enlève les paramètres "sec" et "subsec" de l'URL et on affiche tout le contenu
				newURL = baseURL + "#" + hash;
				delete params.sec;
				delete params.subsec;
				showOnlyThisElement(undefined, "sections");
				showOnlyThisElement(undefined, "subsections");
			} else {
				// Sinon, on récupère les paramètres "sec" et "subsec" du lien cliqué et on les ajoute à l'URL, puis on affiche la section ou la sous-section correspondante
				const linkURLWithoutBase = linkURL.replace(baseURL, "");
				const linkParams = getParams(linkURLWithoutBase, hash);
				Object.assign(params, linkParams);
				if (!("subsec" in linkParams)) {
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
					hash.replace("?footnote", "");
			}
			history.pushState({ path: newURL }, "", newURL);
			changeDisplayBasedOnParams(params, markpageData);
		});
	});

	// Gestion des boutons de filtres dans Lightpad
	if (yaml.lightpad) {
		handleTags();
		handleSelectElements();
	}

	// Possibilité de se déplacer à gauche ou à droite avec un clic maintenu sur la souris
	// (Dans le mode "pad")
	if (yaml.pad) {
		const innerBox = document.querySelector("#innerBox");
		innerBox.addEventListener("mousedown", function (event) {
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
			const isModeLightpadNoColums =
				document.body.classList.contains("noColumns");
			let scrollableElement = isModeLightpadNoColums
				? document.body.querySelector("#content")
				: document.body.querySelector("#innerBox");

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
		});
	}
}
