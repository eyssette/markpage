import { showOnlyThisElement } from "./showOnlyThisElement";
import { changeDisplayBasedOnParams } from "./changeDisplayBasedOnParams";
import { getParams } from "../utils";
import { params } from "./handleMarkpage";

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
			const linkURL = link.href;
			let newURL;
			if (linkURL == baseURL || linkURL + "index.html" == baseURL) {
				newURL = baseURL;
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
						.join("&");
			}
			history.pushState({ path: newURL + "#" + hash }, "", newURL + "#" + hash);
			changeDisplayBasedOnParams(params, markpageData);
		});
	});
}
