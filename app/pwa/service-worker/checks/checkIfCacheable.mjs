import { NON_CACHEABLE_EXTENSIONS, STRATEGY_HEADER } from "../swConfig.mjs";
import { normalizeStrategy } from "../router/overrides.mjs";

// Vérifie si la ressource est considérée comme à ne pas mettre en cache (vidéos, fichiers lourds, etc.)
export function shouldNotBeCachedBasedOnFileExtension(request) {
	const url = new URL(request.url);
	const parts = url.pathname.split(".");
	const requiredPartsForExtension = 2;
	if (parts.length < requiredPartsForExtension) {
		return false;
	}

	const ext = parts.pop().toLowerCase();
	return NON_CACHEABLE_EXTENSIONS.has(ext);
}

// Vérifie si la réponse a un header "Cache-Control: no-store" (dans ce cas, on ne doit pas la mettre en cache)
export function hasNoStoreDirective(response) {
	const cacheControl = response.headers.get("Cache-Control");
	if (!cacheControl) {
		return false;
	}
	return cacheControl
		.toLowerCase()
		.split(",")
		.map((directive) => directive.trim())
		.includes("no-store");
}

export function shouldStayPrivate(request, response) {
	const cacheControl = response.headers.get("Cache-Control");
	if (!cacheControl) {
		return false;
	}

	// Par défaut, si le header Cache-Control contient "private", on considère que la ressource ne doit pas être mise en cache par le service worker.
	// Mais si le développeur autorise explicitement le caching dans la requête via le header `X-Cache-Strategy, alors on autorise la mise en cache
	// On n'autorise pas l'utilisation d'un paramètre d'URL pour forcer le caching d'une ressource privée, car cela pourrait être utilisé par un attaquant pour contourner la politique de confidentialité.
	const headerStrategy = normalizeStrategy(
		request.headers.get(STRATEGY_HEADER),
	);
	if (
		headerStrategy === "stale-while-revalidate" ||
		headerStrategy === "network-first"
	) {
		// On autorise la mise en cache, mais on évite le "cache-first" pour ce type de ressource, car sinon une ressource privée pourrait rester en cache pendant longtemps
		return false;
	}

	return cacheControl
		.toLowerCase()
		.split(",")
		.map((directive) => directive.trim())
		.includes("private");
}

// Vérifie si la ressource peut être récupérée et mise en cache
export function isCacheableResponse(response) {
	return response && (response.ok || response.type === "opaque");
}
