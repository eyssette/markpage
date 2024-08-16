import { showOnlyThisElement } from "./showOnlyThisElement";
import { changeDisplayBasedOnParams } from "./changeDisplayBasedOnParams";
import { getParams } from "../utils";

export function handleClicks(baseURL, hash, params, markpageData) {
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
			const linkURL = link.href;
			let newURL;
			if (linkURL == baseURL || linkURL + "index.html" == baseURL) {
				newURL = baseURL;
				params = undefined;
				showOnlyThisElement(undefined, "sections");
				showOnlyThisElement(undefined, "subsections");
			} else {
				params = getParams(linkURL);
				// Affichage par défaut de la première sous-section
				const sectionElement = document.getElementById("section-" + params.sec);
				const hasSubSections =
					sectionElement.querySelector(".subSectionContent");
				if (params.sec && !params.subsec && hasSubSections) {
					params.subsec = "1";
				}
				// Redirection en fonction des paramètres dans l'URL
				newURL =
					baseURL +
					"?" +
					Object.keys(params)
						.map(function (key) {
							return key + "=" + encodeURIComponent(params[key]);
						})
						.join("&");
			}

			// On change l'affichage de l'URL sans recharger la page
			history.pushState({ path: newURL + "#" + hash }, "", newURL + "#" + hash);
			changeDisplayBasedOnParams(params, markpageData);
		});
	});
}
