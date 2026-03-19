import { yaml } from "../processMarkdown/yaml";
import { displayMaths } from "./displayMaths";
import { getParams, openLinksInNewTab, loadCSS, redirectToUrl } from "../utils";
import { changeDisplayBasedOnParams } from "./changeDisplayBasedOnParams";
import { handleNavigation } from "./navigation";
import { handleSearch } from "./searchBar/handleSearch";
import { handleClicks } from "./handleClicks";
import { paramsRemoveH3, paramsRemoveMenu } from "./params";
import { showOnlyThisElement } from "./showOnlyThisElement";
import { CSSthemes } from "../config";
import { setTheme } from "./setTheme";
import { checkScrollListener } from "./checkScrollListener";
import { checkInitEditor } from "./editor/checkInitEditor";
import { resizeElements } from "./resize/resizeElements";

export let params;

function setUpRedirectListener() {
	document.addEventListener("click", (e) => {
		if (e.target.matches(".redirect-button")) {
			const input = document.querySelector(`#${e.target.dataset.inputId}`);
			if (input) redirectToUrl(input);
		}
	});

	document.addEventListener("keypress", (e) => {
		if (e.target.matches(".redirect-input") && e.key === "Enter") {
			redirectToUrl(e.target);
		}
	});
}

export function handleMarkpage(markpageData) {
	const baseURL = window.location.origin + window.location.pathname;
	const hash = window.location.hash.substring(1);
	const actualURL = window.location.search;
	params = getParams(actualURL);

	// Gestion des maths
	if (yaml && yaml.maths) {
		displayMaths();
	}
	// Gestion des add-ons
	if (yaml && yaml.plugins && yaml.plugins.includes("copycode")) {
		const interval = setInterval(() => {
			if (window.copycode) {
				clearInterval(interval);
				window.copycode();
				handleClicks(baseURL, hash, markpageData);
			}
		}, 200);
	}
	if (yaml && yaml.plugins && yaml.plugins.includes("kroki")) {
		const interval = setInterval(() => {
			if (window.processKroki) {
				clearInterval(interval);
				document.getElementById("content").innerHTML = window.processKroki(
					document.getElementById("content").innerHTML,
				);
				document.getElementById("initialMessage").innerHTML =
					window.processKroki(
						document.getElementById("initialMessage").innerHTML,
					);
				handleClicks(baseURL, hash, markpageData);
			}
		}, 200);
	}
	if (yaml && yaml.plugins && yaml.plugins.includes("lightbox")) {
		const interval = setInterval(() => {
			if (window.lightbox) {
				clearInterval(interval);
				window.lightbox();
				const linksWithNoLightbox = document.querySelectorAll(
					"a:not(.lightboxPlugin):not(.navigationLink)",
				);
				openLinksInNewTab(linksWithNoLightbox);
			}
		}, 500);
	} else {
		const linksWithNoLightbox = document.querySelectorAll(
			"a:not(.navigationLink)",
		);
		openLinksInNewTab(linksWithNoLightbox);
	}
	if (yaml && yaml.plugins && yaml.plugins.includes("text2quiz")) {
		const interval = setInterval(() => {
			if (window.processText2quiz) {
				clearInterval(interval);
				document.getElementById("content").innerHTML = window.processText2quiz(
					document.getElementById("content").innerHTML,
				);
				handleClicks(baseURL, hash, markpageData);
			}
		}, 200);
	}
	if (yaml && yaml.plugins && yaml.plugins.includes("highlight")) {
		const interval = setInterval(() => {
			if (window.hljs) {
				clearInterval(interval);
				window.hljs.configure({
					ignoreUnescapedHTML: true,
				});
				window.hljs.highlightAll();
			}
		}, 200);
	}
	if (yaml && yaml.plugins && yaml.plugins.includes("chatmd")) {
		const interval = setInterval(() => {
			if (window.processChatMD) {
				clearInterval(interval);
				document.getElementById("content").innerHTML = window.processChatMD(
					document.getElementById("content").innerHTML,
				);
				handleClicks(baseURL, hash, markpageData);
			}
		}, 200);
	}
	if (yaml && yaml.plugins && yaml.plugins.includes("myMarkmap")) {
		const interval = setInterval(() => {
			if (window.processMyMarkmap) {
				clearInterval(interval);
				document.getElementById("content").innerHTML = window.processMyMarkmap(
					document.getElementById("content").innerHTML,
				);
				handleClicks(baseURL, hash, markpageData);
			}
		}, 200);
	}
	if (yaml && yaml.plugins && yaml.plugins.includes("flashmd")) {
		const interval = setInterval(() => {
			if (window.processFlashMD) {
				clearInterval(interval);
				document.getElementById("content").innerHTML = window.processFlashMD(
					document.getElementById("content").innerHTML,
				);
				handleClicks(baseURL, hash, markpageData);
			}
		}, 200);
	}
	if (
		yaml &&
		!yaml.lightpad &&
		yaml.plugins &&
		yaml.plugins.includes("titleLinks")
	) {
		const interval = setInterval(() => {
			if (window.titleLinks) {
				clearInterval(interval);
				window.titleLinks();
			}
		}, 200);
	}

	// S'il y a un paramètre dans l'URL pour définir un thème, on définit le thème via ce paramètre
	if (params.theme) {
		const styleThemeElement = document.getElementById("styleTheme");
		setTheme(params.theme, CSSthemes, styleThemeElement);
	}
	if (!yaml.padScroll && params.padscroll && params.padscroll == 1) {
		// Cas où on veut que le scroll se fasse colonne par colonne dans le mode pad
		loadCSS(
			"<style>body{height:100vw;overflow-y:hidden;}</style>",
			"padScrollColumnByColumn",
		);
		yaml.padScroll = true;
		params.pad = true;
	}
	if (!yaml.pad && params.pad && params.pad == 1) {
		loadCSS("./css/pad.min.css", "pad");
		yaml.pad = true;
		// On supprime les styles oneByOne si on utilise le mode pad
		const styleOneByOneElement = document.querySelector(
			'link[href*="oneByOne.min.css"]',
		);
		if (styleOneByOneElement) {
			styleOneByOneElement.remove();
		}
	}

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
	if (yaml && yaml.linkToHomePage) {
		linkToHomePageElement = document.getElementById("linkToHomePage");
		linkToHomePageElement.style.display = "block";
		linkToHomePageElement.addEventListener("click", function (e) {
			e.preventDefault();
			delete params.sec;
			delete params.subsec;
			showOnlyThisElement(undefined, "sections");
			showOnlyThisElement(undefined, "subsections");
			history.pushState(
				{ path: baseURL + "#" + hash.replace("?footnote", "") },
				"",
				baseURL + "#" + hash.replace("?footnote", ""),
			);
			changeDisplayBasedOnParams(params, markpageData);
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

	handleSearch(hash, markpageData);

	handleNavigation(baseURL, hash, params, markpageData);

	if (yaml && yaml.pad && yaml.padScroll) {
		setTimeout(() => {
			resizeElements();
			const titleElement = document.getElementById("title");
			if (window.textFit) {
				window.textFit(titleElement, { minFontSize: 16, multiLine: true });
			}
		}, 10);
		const headerElement = document.body.querySelector("header");
		const titleElement = document.getElementById("title");
		headerElement.querySelectorAll("img").forEach((img) => {
			img.addEventListener("load", () => {
				setTimeout(() => {
					resizeElements();
					if (window.textFit) {
						window.textFit(titleElement, { minFontSize: 16, multiLine: true });
					}
				}, 300);
			});
		});
		let resizeTimeout;
		window.addEventListener("resize", () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				resizeElements();
				const titleElement = document.getElementById("title");
				if (window.textFit) {
					window.textFit(titleElement, { minFontSize: 16, multiLine: true });
				}
			}, 200);
		});
	}
	if (yaml && yaml.lightpad) {
		const titleElement = document.getElementById("title");
		const interval = setInterval(() => {
			if (window.textFit) {
				clearInterval(interval);
				window.textFit(titleElement, { minFontSize: 16, multiLine: true });
			}
		}, 10);
	}

	setUpRedirectListener();
	checkScrollListener();
	checkInitEditor(params, markpageData);
}
