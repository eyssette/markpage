// Vérifie si la réponse est trop volumineuse pour être mise en cache (par défaut, > 20 Mo)

import { MAX_CACHEABLE_SIZE_BYTES } from "../swConfig.mjs";

// Ne fonctionne que si le serveur fournit un header "Content-Length" (ce qui est le cas pour la plupart des serveurs web, mais pas pour les réponses chunked ou les flux).
export function isTooLarge(response, maxSize = MAX_CACHEABLE_SIZE_BYTES) {
	const contentLength = response.headers.get("Content-Length");
	if (contentLength) {
		const size = Number(contentLength);
		if (!Number.isNaN(size) && size > maxSize) {
			return true;
		}
	}
	return false;
}

export function isPartialResponse(response) {
	const partialResponseStatus = 206;
	return response.status === partialResponseStatus;
}

// Vérifie si la réponse est de type "opaque" (cross-origin, sans CORS)
export function isOpaqueResponse(response) {
	return response && response.type === "opaque";
}
