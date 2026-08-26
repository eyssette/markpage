// STRATÉGIES DE CACHE

import {
	CORE_CACHE,
	DATA_CACHE,
	DYNAMIC_CACHE,
	OPAQUE_CACHE,
	STATIC_ASSETS_CACHE,
} from "./cacheTypes.mjs";
import { DEFAULT_TIMEOUT_MS, OFFLINE_URL } from "../../swConfig.mjs";
import { fetchAndCache } from "./fetchAndCache.mjs";
import { isNavigationRequest } from "../../checks/checkRequestType.mjs";
import { resolveAppUrl } from "../../helpers/url.mjs";

// Récupère la réponse d'un cache opaque (cross-origin) si elle existe
async function matchOpaqueCache(request) {
	const opaqueCache = await caches.open(OPAQUE_CACHE);
	return opaqueCache.match(request);
}

// Récupère la réponse du cache des données si elle existe
async function matchDataCache(request) {
	const dataCache = await caches.open(DATA_CACHE);
	return dataCache.match(request);
}

// Cache-first : on sert le cache si dispo, sinon on va chercher le réseau et on met à jour le cache.
export async function cacheFirst(request) {
	const cache = await caches.open(CORE_CACHE);
	const cached =
		(await cache.match(request)) || (await matchOpaqueCache(request));
	if (cached) {
		return cached;
	}
	try {
		return await fetchAndCache(request, CORE_CACHE);
	} catch {
		// Si la requête est de type "navigate" (HTML), on retombe sur la page offline si le réseau est indisponible.
		if (isNavigationRequest(request)) {
			return navigationFallback(request);
		}
		return new Response("Hors-ligne et aucune ressource en cache.", {
			status: 503,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
			},
		});
	}
}

// Stale-while-revalidate : on sert le cache si dispo, et on rafraîchit en tâche de fond pour la prochaine fois.
export async function staleWhileRevalidate(event, request) {
	const cache = await caches.open(STATIC_ASSETS_CACHE);
	const cached =
		(await cache.match(request)) || (await matchOpaqueCache(request));

	const networkPromise = fetchAndCache(request, STATIC_ASSETS_CACHE, { event });

	if (cached) {
		event.waitUntil(
			// oxlint-disable-next-line promise/prefer-await-to-then
			networkPromise.catch(() => {
				// On ignore les erreurs réseau pour ne pas casser la navigation si le réseau est indisponible.
			}),
		);
		return cached;
	}

	try {
		// Pas de cache : on doit attendre le réseau.
		const networkResponse = await networkPromise;
		return networkResponse;
	} catch {
		// Ni cache ni réseau disponibles.
		return Response.json(
			{
				error: "offline",
				message: "Aucune ressource disponible hors-ligne.",
			},
			{
				status: 503,
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				},
			},
		);
	}
}

// Fallback utilisé quand la navigation échoue complètement au réseau.
async function navigationFallback(request) {
	// On regarde d'abord si cette page a déjà été visitée et mise en cache dynamiquement.
	const dynamicCache = await caches.open(DYNAMIC_CACHE);
	const cachedPage = await dynamicCache.match(request);
	if (cachedPage) {
		return cachedPage;
	}

	// On regarde si la requête correspond directement à une URL précachée (ex: "./" ou "index.html").
	const coreCache = await caches.open(CORE_CACHE);
	const corePage = await coreCache.match(request);
	if (corePage) {
		return corePage;
	}

	// On revient sur la page d'accueil de l'application si elle a été précachée correctement.
	const appShell =
		(await coreCache.match(resolveAppUrl("index.html"))) ||
		(await coreCache.match(resolveAppUrl("./")));
	if (appShell) {
		return appShell;
	}

	// En dernier recours, on affiche la page offline générique.
	const offlinePage = await coreCache.match(resolveAppUrl(OFFLINE_URL));
	if (offlinePage) {
		return offlinePage;
	}

	return new Response("Hors-ligne et aucune page en cache.", {
		status: 503,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
}

// Network-first pour les navigations : on tente le réseau, sinon on retombe sur le cache, puis sur une page offline (avec un timeout pour ne pas bloquer trop longtemps si le réseau est lent).
export async function networkFirstNavigation(event, request) {
	try {
		const response = await fetchAndCache(request, DYNAMIC_CACHE, {
			event,
			timeoutMs: DEFAULT_TIMEOUT_MS,
		});
		return response;
	} catch {
		// Réseau totalement coupé, timeout écoulé, ou preload+fetch tous les deux en échec.
		return navigationFallback(request);
	}
}

// Par défaut (hors navigation/asset/donnée) : réseau direct, repli sur le cache en cas d'échec.
export async function networkFirst(event, request, cacheName = DYNAMIC_CACHE) {
	const cache = await caches.open(cacheName);

	try {
		const response = await fetchAndCache(request, cacheName, { event });
		return response;
	} catch {
		// En cas d'échec réseau, on essaie le cache
		const cachedResponse =
			(await cache.match(request)) ||
			(await matchDataCache(request)) ||
			(await matchOpaqueCache(request));

		if (cachedResponse) {
			return cachedResponse;
		}

		return new Response("Hors-ligne et aucune ressource en cache.", {
			status: 503,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
			},
		});
	}
}
