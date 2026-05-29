import { shortcuts, corsProxy } from "./config";

// Pour récupérer les paramètres de navigation dans l'URL
export function getParams(
	queryString = window.location.search,
	urlHash = window.location.hash,
) {
	const paramsFromQuery = Object.fromEntries(new URLSearchParams(queryString));
	// Version sécurisée (hashHasParams) : les paramètres sont dans le hash et ne sont donc pas envoyés au serveur
	const hashHasParams = urlHash.includes("?") && urlHash.includes("=");
	const hashQueryPart = hashHasParams ? urlHash.split("?")[1] : "";
	const paramsFromHash = hashHasParams
		? Object.fromEntries(new URLSearchParams(hashQueryPart))
		: {};

	// Les paramètres dans le hash (#hash?p=1) écrasent les paramètres classiques dans l'URL (?p=2)
	return {
		...paramsFromQuery,
		...paramsFromHash,
	};
}

// Pour gérer l'URL de la source en Markdown
export function handleURL(url, options) {
	let isValidUrl = false;
	if (url !== "") {
		let addCorsProxy = options && options.useCorsProxy ? true : false;
		// Vérification de la présence d'un raccourci
		const shortcut = shortcuts.find((element) => element[0] == url);
		if (shortcut) {
			isValidUrl = true;
			url = shortcut[1];
			// Si on a un raccourci, on n'a pas besoin de traiter correctement l'url
			return { url: url, isValidUrl: isValidUrl };
		}
		// Gestion des fichiers hébergés sur la forge et publiés sur une page web
		if (url.includes(".forge")) {
			isValidUrl = true;
			addCorsProxy = false;
		}
		// Gestion des fichiers hébergés sur github
		if (url.startsWith("https://github.com")) {
			isValidUrl = true;
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
			isValidUrl = true;
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
			isValidUrl = true;
			addCorsProxy = false;
			url = url.replace(/\?.*/, "") + "/export/txt";
		}
		// gestion des fichiers hébergés sur Docs de La Suite numérique
		if (url.includes("docs.numerique.gouv.fr")) {
			isValidUrl = true;
			const documentIdMatch = url.match(/docs\/([a-z0-9-]+)\//);
			if (documentIdMatch) {
				const documentId = documentIdMatch[1];
				addCorsProxy = true;
				url = `https://docs.numerique.gouv.fr/api/v1.0/documents/${documentId}/formatted-content/?content_format=markdown`;
			} else url = "";
		}
		url = addCorsProxy ? corsProxy + url : url;
	}
	return { url: url, isValidUrl: isValidUrl };
}

// Fonction générique pour rediriger vers une URL avec un hash
export function redirectToUrl(input, baseURL = window.location.origin) {
	const hash = input.value.trim();
	baseURL = input.getAttribute("data-base-url")
		? "https://" + input.getAttribute("data-base-url")
		: baseURL;
	if (hash) {
		const fullUrl = baseURL + `#${hash}`;
		window.open(fullUrl, "_blank");
	} else {
		alert("Veuillez entrer une URL valide.");
	}
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

export function removeTagsFromStringButKeepAltImages(str) {
	return str
		.replace(/<img[^>]*alt=["']([^"']+)["'][^>]*>/gi, "$1") // Remplace les balises <img> par leur contenu alt
		.replace(/<[^>]+?>/gi, ""); // Supprime toutes les autres balises
}

export function loadScript(src, name) {
	const prefixScript = "script-";
	// Fonction pour charger des scripts
	const alreadyLoaded = document.querySelector("#" + prefixScript + name);
	return new Promise((resolve, reject) => {
		if (!alreadyLoaded) {
			const script = document.createElement("script");
			script.src = src;
			script.id = prefixScript + name;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		} else {
			resolve();
		}
	});
}

export function loadCSS(src, name) {
	const prefixCSS = "css-";
	// Fonction pour charger des CSS
	const cssElement = document.querySelector("#" + prefixCSS + name);
	if (!cssElement) {
		return new Promise((resolve, reject) => {
			let styleElement;
			if (src.startsWith("<style>")) {
				styleElement = document.createElement("style");
				styleElement.id = prefixCSS + name;
				styleElement.textContent = src
					.replace("<style>", "")
					.replace("</style>", "");
				resolve();
			} else {
				styleElement = document.createElement("link");
				styleElement.href = src;
				styleElement.id = prefixCSS + name;
				styleElement.rel = "stylesheet";
				styleElement.type = "text/css";
				styleElement.onload = resolve;
				styleElement.onerror = reject;
			}
			document.head.appendChild(styleElement);
		});
	}
}

function fixInternalLinkWithNoHash(link) {
	const href = link.getAttribute("href");
	if (href && href.startsWith("/") && !href.includes("#")) {
		link.setAttribute("href", href + window.location.hash);
	}
}

export function handleLinks(links) {
	// On ouvre tous les liens externes (sauf Lightbox, déjà filtrés) dans un nouvel onglet, et on laisse les liens internes fonctionner normalement
	links = Array.from(links);

	// On laisse les liens internes fonctionner normalement
	links = links.filter((link) => {
		const href = link.getAttribute("href");
		if (!href) return false;
		if (href.includes(":~:text")) return false;
		if (href.startsWith("/")) {
			// Si on a un lien interne (par exemple /?sec=1&subsec=2), on ajoute le hash de la source s'il n'était pas présent, pour qu'il puisse fonctionner
			fixInternalLinkWithNoHash(link);
			return false;
		}
		return true;
	});
	links.forEach((link) => {
		link.setAttribute("target", "_blank");
		link.setAttribute("rel", "noopener noreferrer");
	});
}

// Trier un tableau sans prendre en compte la casse et les accents
export function sortCaseAndAccentInsensitive(array) {
	return array.sort((a, b) => {
		return a.localeCompare(b, "fr", {
			sensitivity: "base",
			numeric: true, // Prend en compte les nombres
		});
	});
}

export function isLightpad() {
	return (
		window.location.href.includes("https://lightpad.forge.apps.education.fr") ||
		window.location.href.includes("?lightpad")
	);
}

export function decodeString(str) {
	return decodeURIComponent(window.atob(str));
}
