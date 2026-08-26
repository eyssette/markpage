import { DEFAULT_TIMEOUT_MS } from "../../swConfig.mjs";
import { cacheNetworkResponse } from "../helpers/cacheNetworkResponse.mjs";
import { getNetworkResponse } from "../helpers/getNetworkResponse.mjs";
import { logFetchError } from "../helpers/logErrors.mjs";
import { shouldNotBeCachedBasedOnFileExtension } from "../../checks/checkIfCacheable.mjs";

// Met à jour le cache depuis le réseau.
const inflightRequests = new Map();

export async function fetchAndCache(
	request,
	cacheName,
	{ event, timeoutMs = DEFAULT_TIMEOUT_MS } = {},
) {
	const key = `${request.method}:${request.url}:${cacheName}`;

	// Si une requête identique est déjà en cours, on retourne la même promesse
	if (inflightRequests.has(key)) {
		return inflightRequests.get(key).then((response) => response.clone());
	}

	// Les fichiers volumineux et non cacheables (vidéos, archives, PDF...) ne
	// doivent pas être coupés par le timeout applicatif.
	const skipTimeout = shouldNotBeCachedBasedOnFileExtension(request);

	const promise = (async () => {
		try {
			// On utilise cache: "no-cache" pour toujours obtenir une réponse fraîche
			// du réseau tout en permettant au navigateur de gérer son propre cache HTTP.
			const fetchOptions = {
				cache: "no-cache",
			};
			const response = await getNetworkResponse(
				request,
				fetchOptions,
				event,
				skipTimeout ? 0 : timeoutMs,
			);
			await cacheNetworkResponse(request, response, cacheName, event);
			return response;
		} catch (error) {
			logFetchError(error, request.url, timeoutMs);
			throw error;
		}
	})();

	// Stocke la promesse dans la map pour dédupliquer les requêtes en vol
	inflightRequests.set(key, promise);

	try {
		const response = await promise;
		return response.clone();
	} finally {
		// Nettoie la map une fois la requête terminée (succès ou échec)
		setTimeout(() => {
			if (inflightRequests.get(key) === promise) {
				inflightRequests.delete(key);
			}
		}, 0);
	}
}
