import {
	APPS_PROVIDING_DATA_FILES,
	CRITICAL_PRECACHE_URLS,
	DATA_FILE_EXTENSIONS,
	NON_CRITICAL_PRECACHE_URLS,
	STATIC_ASSETS_EXTENSIONS,
} from "../swConfig.mjs";
import { resolveAppUrl } from "../helpers/url.mjs";

const PRECACHE_URLS = [
	...CRITICAL_PRECACHE_URLS,
	...NON_CRITICAL_PRECACHE_URLS,
];

const PRECACHE_URL_SET = new Set(
	PRECACHE_URLS.map((url) => resolveAppUrl(url)),
);

export function isPrecachedRequest(request) {
	return PRECACHE_URL_SET.has(request.url);
}

// Vérifie si la requête est une navigation (HTML)
export function isNavigationRequest(request) {
	return request.mode === "navigate";
}

// Vérifie si l'URL correspond à un asset statique (JS, CSS, images, fonts, icônes...)
export function isStaticAsset(url) {
	// On récupère la partie après le dernier point
	const parts = url.pathname.split(".");
	const requiredPartsForExtension = 2;
	if (parts.length < requiredPartsForExtension) {
		return false;
	}

	const ext = parts.pop().toLowerCase();
	return STATIC_ASSETS_EXTENSIONS.has(ext);
}

export function isDataRequest(url) {
	// On vérifie si l'url correspond à un fichier dont l'extension correspond à un fichier de données
	const parts = url.pathname.split(".");
	const requiredPartsForExtension = 2;
	if (parts.length >= requiredPartsForExtension) {
		const ext = parts.pop().toLowerCase();
		return DATA_FILE_EXTENSIONS.has(ext);
	}
	// Sinon, on vérifie si le nom de domaine contient un des mots clés correspond à un site qui fournit des fichiers de données (ex: GitHub, GitLab, Framapad...)
	return APPS_PROVIDING_DATA_FILES.some((app) => url.hostname.endsWith(app));
}

// Vérifie si la requête est une requête de type "Range" (demande d'une partie d'un fichier)
export function isRangeRequest(request) {
	return request.headers.has("range");
}
