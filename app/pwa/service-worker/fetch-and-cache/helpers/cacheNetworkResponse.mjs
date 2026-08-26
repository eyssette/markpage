// Met en cache la réponse réseau si elle est éligible (ni exclue, ni non cacheable).

import { CACHE_MAX_ENTRIES, MAX_OPAQUE_ENTRIES } from "../../swConfig.mjs";
import {
	hasNoStoreDirective,
	isCacheableResponse,
	shouldNotBeCachedBasedOnFileExtension,
	shouldStayPrivate,
} from "../../checks/checkIfCacheable.mjs";
import {
	isOpaqueResponse,
	isPartialResponse,
	isTooLarge,
} from "../../checks/checkResponseType.mjs";
import { OPAQUE_CACHE } from "../core/cacheTypes.mjs";
import { isRangeRequest } from "../../checks/checkRequestType.mjs";
import { trimCache } from "../../handle-cache/trimCache.mjs";

// oxlint-disable-next-line max-params
export async function cacheNetworkResponse(
	request,
	response,
	cacheName,
	event,
) {
	if (
		shouldNotBeCachedBasedOnFileExtension(request) ||
		!isCacheableResponse(response) ||
		hasNoStoreDirective(response) ||
		shouldStayPrivate(request, response) ||
		isTooLarge(response) ||
		isRangeRequest(request) ||
		isPartialResponse(response)
	) {
		return;
	}

	const targetCacheName = isOpaqueResponse(response) ? OPAQUE_CACHE : cacheName;
	const maxEntries = isOpaqueResponse(response)
		? MAX_OPAQUE_ENTRIES
		: CACHE_MAX_ENTRIES;

	const cachePutOperation = async () => {
		try {
			const responseClone = response.clone();
			const cache = await caches.open(targetCacheName);
			await cache.put(request, responseClone);
			await trimCache(targetCacheName, maxEntries);
		} catch (error) {
			if (process.env.NODE_ENV === "development-with-service-worker") {
				// bearer:disable javascript_lang_logger_leak
				console.error(
					// nosemgrep: javascript.lang.security.audit.unsafe-formatstring.unsafe-formatstring
					`Erreur d'écriture dans le cache (${targetCacheName}) :`,
					error,
				);
			}
		}
	};

	// Si un event est fourni, on ne bloque pas la réponse principale pour la
	// mise en cache (utile pour stale-while-revalidate). Sinon on attend
	// (utile pour cache-first quand on doit peupler le cache).
	if (event) {
		event.waitUntil(cachePutOperation());
	} else {
		await cachePutOperation();
	}
}
