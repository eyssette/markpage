import { shortcuts, corsProxy } from "./config";

// Pour récupérer les paramètres de navigation dans l'URL
export function getParams(URL) {
	const urlSearchParams = new URLSearchParams(URL.split("?")[1]);
	const paramsObject = {};
	urlSearchParams.forEach(function (value, key) {
		paramsObject[key] = value;
	});
	return paramsObject;
}

// Pour gérer l'URL de la source du flipbook
export function handleURL(url) {
	if (url !== "") {
		let addCorsProxy = true;
		// Vérification de la présence d'un raccourci
		const shortcut = shortcuts.find((element) => element[0] == url);
		if (shortcut) {
			url = shortcut[1];
			// Si on a un raccourci, on n'a pas besoin de traiter correctement l'url
			return url;
		}
		// Gestion des fichiers hébergés sur la forge et publiés sur une page web
		if (url.includes(".forge")) {
			addCorsProxy = false;
		}
		// Gestion des fichiers hébergés sur github
		if (url.startsWith("https://github.com")) {
			addCorsProxy = false;
			url = url.replace(
				"https://github.com",
				"https://raw.githubusercontent.com",
			);
			url = url.replace("/blob/", "/");
		}
		// gestion des fichiers hébergés sur codiMD / hedgedoc / digipage
		if (
			url.startsWith("https://codimd") ||
			url.startsWith("https://pad.numerique.gouv.fr/") ||
			url.includes("hedgedoc") ||
			url.includes("digipage")
		) {
			addCorsProxy = false;
			url = url
				.replace("?edit", "")
				.replace("?both", "")
				.replace("?view", "")
				.replace(/#$/, "")
				.replace(/\/$/, "");
			url = url.indexOf("download") === -1 ? url + "/download" : url;
		}
		// gestion des fichiers hébergés sur framapad ou digidoc
		if (
			(url.includes("framapad") || url.includes("digidoc")) &&
			!url.endsWith("/export/txt")
		) {
			addCorsProxy = false;
			url = url.replace(/\?.*/, "") + "/export/txt";
		}
		url = addCorsProxy ? corsProxy + url : url;
	}
	return url;
}

export function deepMerge(target, source) {
	const isObject = (obj) => obj && typeof obj === "object";

	for (const key in source) {
		if (isObject(source[key])) {
			if (!target[key]) {
				Object.assign(target, { [key]: {} });
			}
			deepMerge(target[key], source[key]);
		} else {
			Object.assign(target, { [key]: source[key] });
		}
	}

	return target;
}

// Filtres pour supprimer des éléments inutiles
export function filterElementWithNoContent(element) {
	const value = element.trim().replace("\n", "") === "" ? false : true;
	return value;
}

export function removeUselessCarriages(text) {
	text = text.replace(/^\n*/, "").replace(/\n*$/, "");
	return text;
}

export function loadScript(src) {
	// Fonction pour charger des scripts
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.onload = resolve;
		script.onerror = reject;
		document.head.appendChild(script);
	});
}

export function loadCSS(src) {
	return new Promise((resolve, reject) => {
		let styleElement;
		if (src.startsWith("<style>")) {
			styleElement = document.createElement("style");
			styleElement.textContent = src
				.replace("<style>", "")
				.replace("</style>", "");
		} else {
			styleElement = document.createElement("link");
			styleElement.href = src;
			styleElement.rel = "stylesheet";
			styleElement.onload = resolve;
			styleElement.onerror = reject;
		}
		document.head.appendChild(styleElement);
	});
}

export function openLinksInNewTab(links) {
	links.forEach((link) => {
		link.setAttribute("target", "_blank");
		link.setAttribute("rel", "noopener noreferrer");
	});
}
