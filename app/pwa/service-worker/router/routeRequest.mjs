// ROUTAGE DES REQUÊTES

// Trois stratégies de cache sont utilisées :
// 1. Cache-first : pour les ressources essentielles (le cœur de l'application)
// 2. Stale-while-revalidate : pour les assets statiques (JS, CSS, images, fonts, icônes...)
// 3. Network-first : pour les données téléchargées depuis le réseau et les pages HTML hors page d'accueil (index.html)

// On peut forcer une stratégie particulière pour une requête donnée en ajoutant un header HTTP `X-Cache-Strategy` ou un paramètre d'URL `cache_strategy` avec l'une des valeurs suivantes : `cache-first`, `stale-while-revalidate`, `network-first`.
// Ce forçage ne peut s'appliquer qu'aux ressources non-HTML (images, JS, CSS, données JSON...) afin d'éviter de casser le fonctionnement hors-ligne des navigations HTML (pages web).

import {
	DATA_CACHE,
	DYNAMIC_CACHE,
} from "../fetch-and-cache/core/cacheTypes.mjs";
import {
	cacheFirst,
	networkFirst,
	networkFirstNavigation,
	staleWhileRevalidate,
} from "../fetch-and-cache/core/cacheStrategies.mjs";
import {
	getForcedStrategy,
	getRequestWithoutStrategyParam,
} from "./overrides.mjs";
import {
	isDataRequest,
	isNavigationRequest,
	isPrecachedRequest,
	isRangeRequest,
	isStaticAsset,
} from "../checks/checkRequestType.mjs";

// Applique la stratégie explicitement demandée
function routeForcedStrategy(event, request, strategy) {
	switch (strategy) {
		case "no-cache": {
			return fetch(request);
		}

		case "cache-first": {
			return cacheFirst(request);
		}

		case "stale-while-revalidate": {
			return staleWhileRevalidate(event, request);
		}

		case "network-first": {
			return networkFirst(event, request, DYNAMIC_CACHE);
		}

		default: {
			throw new Error(`Unknown cache strategy: ${strategy}`);
		}
	}
}

// Sélectionne la stratégie à appliquer selon le type de requête.
export function routeRequest(event, request) {
	if (isRangeRequest(request)) {
		return fetch(request);
	}

	if (isPrecachedRequest(request)) {
		return cacheFirst(request);
	}

	if (isNavigationRequest(request)) {
		return networkFirstNavigation(event, request);
	}

	const url = new URL(request.url);

	const forcedStrategy = getForcedStrategy(request, url);

	if (forcedStrategy) {
		const requestWithoutStrategyParam = getRequestWithoutStrategyParam(request);

		return routeForcedStrategy(
			event,
			requestWithoutStrategyParam,
			forcedStrategy,
		);
	}

	if (isStaticAsset(url)) {
		return staleWhileRevalidate(event, request);
	}

	if (isDataRequest(url)) {
		return networkFirst(event, request, DATA_CACHE);
	}

	return networkFirst(event, request, DYNAMIC_CACHE);
}
