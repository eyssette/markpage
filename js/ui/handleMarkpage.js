import { yaml } from "../processMarkdown/yaml";
import { displayMaths } from "./displayMaths";
import { getParams } from "../utils";
import { changeDisplayBasedOnParams } from "./changeDisplayBasedOnParams";
import { handleNavigation } from "./navigation";
import { searchBar } from "./searchBar";
import { handleClicks } from "./handleClicks";
import { paramsRemoveH3, paramsRemoveMenu } from "./params";
import { showOnlyThisElement } from "./showOnlyThisElement";
import { CSSthemes } from "../config";
import { setTheme } from "./setTheme";

export let params;

export function handleMarkpage(markpageData) {
	if (yaml.maths) {
		displayMaths();
	}
	if (yaml.addOns && yaml.addOns.includes("kroki")) {
		setTimeout(() => {
			document.getElementById("content").innerHTML = window.processKroki(
				document.getElementById("content").innerHTML,
			);
		}, 200);
	}
	const hash = window.location.hash.substring(1);
	const actualURL = window.location.search;
	params = getParams(actualURL);
	if (params.theme) {
		const styleThemeElement = document.getElementById("styleTheme");
		setTheme(params.theme, CSSthemes, styleThemeElement);
	}
	const baseURL = window.location.origin + window.location.pathname;

	changeDisplayBasedOnParams(params, markpageData);
	handleClicks(baseURL, hash, markpageData);

	window.addEventListener("popstate", function () {
		// Gestion des retours en arrière dans l'historique du navigateur
		let actualURL = window.location.search;
		params = getParams(actualURL);
		changeDisplayBasedOnParams(params, markpageData);
	});

	// Affichage si yamlLinkToHomePage d'un lien supplémentaire vers la page d'accueil en haut à droite
	let linkToHomePageElement;
	if (yaml.linkToHomePage) {
		linkToHomePageElement = document.getElementById("linkToHomePage");
		linkToHomePageElement.style.display = "block";
		linkToHomePageElement.addEventListener("click", function (e) {
			e.preventDefault();
			delete params.sec;
			delete params.subsec;
			showOnlyThisElement(undefined, "sections");
			showOnlyThisElement(undefined, "subsections");
			changeDisplayBasedOnParams(params, markpageData);
			history.pushState(
				{ path: baseURL + "#" + hash },
				"",
				baseURL + "#" + hash,
			);
		});
	}
	// On peut ajouter un paramètre dans l'URL pour cacher le menu du bas et l'icône de page d'accueil
	if (params.menu && params.menu == 0) {
		paramsRemoveMenu(linkToHomePageElement);
	}
	// On peut enlever les titres h3 sur le côté
	if (params.h3 && params.h3 == 0) {
		paramsRemoveH3(params);
	}

	searchBar(hash, markpageData);

	handleNavigation(baseURL, hash, params, markpageData);
}
