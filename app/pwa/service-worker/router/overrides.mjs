// DÉTECTION DES OVERRIDES (stratégies forcées par un header ou un paramètre d'URL)

import { STRATEGIES, STRATEGY_HEADER, STRATEGY_PARAM } from "../swConfig.mjs";

export function normalizeStrategy(value) {
	if (typeof value !== "string") {
		return;
	}

	const strategy = value.trim().toLowerCase();

	if (STRATEGIES.has(strategy)) {
		return strategy;
	}
}

// Retourne la stratégie explicitement demandée
export function getForcedStrategy(request, url) {
	const headerStrategy = normalizeStrategy(
		request.headers.get(STRATEGY_HEADER),
	);

	if (headerStrategy) {
		return headerStrategy;
	}

	const urlParamStrategy = url.searchParams.get(STRATEGY_PARAM);

	return normalizeStrategy(urlParamStrategy);
}

// Retire le paramètre de contrôle de l'URL avant d'effectuer la requête pour éviter de polluer le cache avec des URLs différentes pour la même ressource.
export function getRequestWithoutStrategyParam(request) {
	const url = new URL(request.url);

	if (!url.searchParams.has(STRATEGY_PARAM)) {
		return request;
	}

	url.searchParams.delete(STRATEGY_PARAM);

	const init = {
		method: request.method,
		headers: request.headers,
		mode: request.mode,
		credentials: request.credentials,
		redirect: request.redirect,
	};

	return new Request(url.href, init);
}
