import { yaml } from "../processMarkdown/yaml";
import { displayMaths } from "./displayMaths";
import { getParams, openLinksInNewTab, loadCSS } from "../utils";
import { changeDisplayBasedOnParams } from "./changeDisplayBasedOnParams";
import { handleNavigation } from "./navigation";
import { searchBar } from "./searchBar";
import { handleClicks } from "./handleClicks";
import { paramsRemoveH3, paramsRemoveMenu } from "./params";
import { showOnlyThisElement } from "./showOnlyThisElement";
import { CSSthemes } from "../config";
import { setTheme } from "./setTheme";

export let params;

const headerElement = document.body.querySelector("header");
const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

function adjustHeight(element) {
	const headerRect = headerElement.getBoundingClientRect();
	const headerHeight = isFirefox
		? headerElement.clientHeight + 10
		: headerRect.bottom + 30;
	const bodyHeight = window.innerHeight;
	const availableHeight = bodyHeight - headerHeight;
	if (availableHeight > 500 || yaml.markpad) {
		element.style.height = `${availableHeight}px`;
		document.body.classList.add("adjustHeightColumns");
	} else {
		document.body.style.height = "unset";
		document.body.style.overflow = "unset";
		element.style.height = "unset";
		document.body.classList.remove("adjustHeightColumns");
	}
}

export function handleMarkpage(markpageData) {
	// Gestion des maths
	if (yaml.maths) {
		displayMaths();
	}
	// Gestion des add-ons
	if (yaml.addOns && yaml.addOns.includes("kroki")) {
		setTimeout(() => {
			document.getElementById("content").innerHTML = window.processKroki(
				document.getElementById("content").innerHTML,
			);
		}, 200);
	}
	if (yaml.addOns && yaml.addOns.includes("lightbox")) {
		setTimeout(() => {
			window.lightbox();
			const linksWithNoLightbox = document.querySelectorAll(
				"a:not(.lightboxAddOn):not(.navigationLink)",
			);
			openLinksInNewTab(linksWithNoLightbox);
		}, 500);
	} else {
		const linksWithNoLightbox = document.querySelectorAll(
			"a:not(.navigationLink)",
		);
		openLinksInNewTab(linksWithNoLightbox);
	}
	if (yaml.addOns && yaml.addOns.includes("text2quiz")) {
		setTimeout(() => {
			document.getElementById("content").innerHTML = window.processText2quiz(
				document.getElementById("content").innerHTML,
			);
		}, 200);
	}
	const hash = window.location.hash.substring(1);
	const actualURL = window.location.search;
	params = getParams(actualURL);
	// S'il y a un paramètre dans l'URL pour définir un thème, on définit le thème via ce paramètre
	if (params.theme) {
		const styleThemeElement = document.getElementById("styleTheme");
		setTheme(params.theme, CSSthemes, styleThemeElement);
	}
	if (!yaml.padScroll && params.padscroll && params.padscroll == 1) {
		// Cas où on veut que le scroll se fasse colonne par colonne dans le mode pad
		loadCSS("<style>body{height:100vw;overflow-y:hidden;}</style>");
		yaml.padScroll = true;
		params.pad = true;
	}
	if (!yaml.pad && params.pad && params.pad == 1) {
		loadCSS("./css/pad.min.css");
		yaml.pad = true;
		// On supprime les styles oneByOne si on utilise le mode pad
		const styleOneByOneElement = document.querySelector(
			'link[href*="oneByOne.min.css"]',
		);
		if (styleOneByOneElement) {
			styleOneByOneElement.remove();
		}
	}
	const baseURL = window.location.origin + window.location.pathname;

	changeDisplayBasedOnParams(params, markpageData);
	handleClicks(baseURL, hash, markpageData);

	window.addEventListener("popstate", function () {
		const isLightbox = document.querySelector("#lightbox.lightbox-open");
		// Gestion des retours en arrière dans l'historique du navigateur
		if (isLightbox) {
			// Cas où on revient en arrière alors qu'on vient d'ouvrir une lightbox
			isLightbox.style.display = "none";
		} else {
			let actualURL = window.location.search;
			params = getParams(actualURL);
			changeDisplayBasedOnParams(params, markpageData);
		}
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

	if (yaml.pad && yaml.padScroll) {
		function resizeSectionContentElements() {
			const sectionContentElement =
				document.querySelectorAll(".sectionContent");
			sectionContentElement.forEach((element) => {
				adjustHeight(element);
			});
		}
		resizeSectionContentElements();
		headerElement.querySelectorAll("img").forEach((img) => {
			img.addEventListener("load", () => {
				setTimeout(() => {
					resizeSectionContentElements();
				}, 300);
			});
		});
		let resizeTimeout;
		window.addEventListener("resize", () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				resizeSectionContentElements();
				const titleElement = document.getElementById("title");
				window.textFit(titleElement, { reProcess: true, multiLine: true });
			}, 200);
		});
	}
}
