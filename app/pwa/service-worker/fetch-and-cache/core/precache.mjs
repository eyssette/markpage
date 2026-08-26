// PRECACHE

import {
	CRITICAL_PRECACHE_URLS,
	NON_CRITICAL_PRECACHE_URLS,
} from "../../swConfig.mjs";
import { CORE_CACHE } from "./cacheTypes.mjs";
import { isCacheableResponse } from "../../checks/checkIfCacheable.mjs";
import { resolveAppUrl } from "../../helpers/url.mjs";

// Met en cache un lot de ressources de manière tolérante aux échecs
// individuels : chaque échec est loggé mais ne fait pas échouer les autres.
export async function precacheNonCriticalUrls(cache, urls) {
	const results = await Promise.allSettled(
		urls.map(async (url) => {
			const request = new Request(resolveAppUrl(url), { cache: "reload" });
			const response = await fetch(request);
			if (!isCacheableResponse(response)) {
				throw new Error(
					`Réponse non cacheable pour ${url} (${response.status})`,
				);
			}
			await cache.put(request, response);
		}),
	);

	if (process.env.NODE_ENV === "development-with-service-worker") {
		for (const [index, result] of results.entries()) {
			if (result.status === "rejected") {
				// bearer:disable javascript_lang_logger_leak
				console.error(
					// nosemgrep: javascript.lang.security.audit.unsafe-formatstring.unsafe-formatstring
					`Précache optionnel échoué pour ${urls[index]} :`,
					result.reason,
				);
			}
		}
	}
}

export async function precacheCoreResources() {
	const cache = await caches.open(CORE_CACHE);
	// Lors de l'installation du service worker, on met en cache les fichiers essentiels pour que l'application fonctionne hors-ligne.
	// Afin d'éviter de servir des fichiers obsolètes, on force le rechargement depuis le réseau (cache: "reload") pour ces fichiers.
	const criticalRequests = CRITICAL_PRECACHE_URLS.map(
		(url) => new Request(url, { cache: "reload" }),
	);
	await cache.addAll(criticalRequests);
	await precacheNonCriticalUrls(cache, NON_CRITICAL_PRECACHE_URLS);
}
