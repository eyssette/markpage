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
					hash.replace("?footnote", "");
			}
			history.pushState({ path: newURL }, "", newURL);
			changeDisplayBasedOnParams(params, markpageData);
		});
	});

	// Gestion des boutons de filtres dans Lightpad
	if (yaml.lightpad) {
		const searchInput = document.querySelector("#searchInput");
		const buttons = document.querySelectorAll("#initialMessage button");

		// Fonction pour construire la requête avec la logique AND/OR
		function buildSearchQuery() {
			const activeButtons = Array.from(buttons).filter((btn) =>
				btn.classList.contains("active"),
			);

			if (activeButtons.length === 0) {
				return "";
			}

			// Grouper les boutons par leur conteneur parent avec data-logic
			const groups = new Map();

			activeButtons.forEach((button) => {
				const buttonContent = button.textContent.trim().replaceAll(" ", "_");

				// Trouver le parent direct avec data-logic
				let parent = button.parentElement;
				while (parent && !parent.hasAttribute("data-logic")) {
					parent = parent.parentElement;
				}

				if (parent) {
					const logic = parent.getAttribute("data-logic");
					const parentId = parent; // Utiliser l'élément lui-même comme clé

					if (!groups.has(parentId)) {
						groups.set(parentId, {
							logic: logic,
							terms: [],
							parent: parent,
						});
					}
					groups.get(parentId).terms.push(buttonContent);
				} else {
					// Si pas de parent avec data-logic, traiter individuellement
					groups.set(button, {
						logic: null,
						terms: [buttonContent],
						parent: null,
					});
				}
			});

			// Construire la requête hiérarchiquement
			function buildFromElement(element) {
				const logic = element.getAttribute("data-logic");
				const childGroups = [];

				// Trouver tous les enfants directs avec data-logic
				const childElements = Array.from(element.children).filter((child) =>
					child.hasAttribute("data-logic"),
				);

				if (childElements.length > 0) {
					// Traiter récursivement les enfants
					childElements.forEach((child) => {
						const childQuery = buildFromElement(child);
						if (childQuery) {
							childGroups.push(childQuery);
						}
					});
				} else {
					// Pas d'enfants avec data-logic, récupérer les boutons actifs directs
					const directButtons = Array.from(
						element.querySelectorAll("button"),
					).filter(
						(btn) =>
							btn.classList.contains("active") &&
							// Avant : btn.parentElement === element
							// Maintenant : s'assurer que le plus proche ancêtre avec data-logic est bien `element`
							btn.closest("[data-logic]") === element,
					);

					directButtons.forEach((btn) => {
						childGroups.push(btn.textContent.trim().replaceAll(" ", "_"));
					});
				}

				if (childGroups.length === 0) {
					return "";
				}

				if (childGroups.length === 1) {
					return childGroups[0];
				}

				return `(${childGroups.join(` ${logic} `)})`;
			}

			// Trouver l'élément racine avec data-logic
			const rootElements = Array.from(
				document.querySelectorAll("#initialMessage [data-logic]"),
			).filter((el) => {
				// Trouver les éléments qui ne sont pas enfants d'autres éléments data-logic
				let parent = el.parentElement;
				while (parent && parent.id !== "initialMessage") {
					if (parent.hasAttribute("data-logic")) {
						return false;
					}
					parent = parent.parentElement;
				}
				return true;
			});

			const queries = rootElements
				.map((root) => buildFromElement(root))
				.filter(Boolean);

			if (queries.length === 0) {
				return activeButtons
					.map((btn) => btn.textContent.trim().replaceAll(" ", "_"))
					.join(" ");
			}

			return queries.length === 1 ? queries[0] : queries.join(" ");
		}

		// Si on clique sur un bouton de filtre
		buttons.forEach((button) => {
			button.addEventListener("click", function () {
				// Toggle l'état actif du bouton
				this.classList.toggle("active");

				// Construire la requête complète avec la logique
				const query = buildSearchQuery();

				// On actualise le champ de recherche et on déclenche la recherche
				searchInput.value = query;
				searchInput.dispatchEvent(new Event("input", { bubbles: true }));
			});
		});
		// Réciproquement : si on édite le champ de recherche et qu'on supprime ou qu'on ajoute un filtre,
		// alors le bouton correspondant doit avoir ou perdre le statut "active"
		searchInput.addEventListener("input", function () {
			const searchValue = this.value.trim();

			// Extraire tous les termes de la requête (en ignorant les parenthèses et opérateurs logiques)
			// On retire les parenthèses, AND, OR et on split sur les espaces
			const cleanedValue = searchValue
				.replace(/\(/g, " ")
				.replace(/\)/g, " ")
				.replace(/\bAND\b/g, " ")
				.replace(/\bOR\b/g, " ");

			const words = cleanedValue.trim().split(/\s+/).filter(Boolean);

			buttons.forEach((button) => {
				const buttonText = button.textContent.trim().replaceAll(" ", "_");
				if (words.includes(buttonText)) {
					button.classList.add("active");
				} else {
					button.classList.remove("active");
				}
			});
		});
	}

	// Possibilité de se déplacer à gauche ou à droite avec un clic maintenu sur la souris
	// (Dans le mode "pad")
	if (yaml.pad) {
		const innerBox = document.querySelector("#innerBox");
		document;
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
