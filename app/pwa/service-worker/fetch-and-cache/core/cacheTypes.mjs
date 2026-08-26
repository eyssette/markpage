import { APP_NAME, APP_VERSION, SW_VERSION } from "../../swConfig.mjs";

// On distingue 5 caches
// - CORE_CACHE : pour les fichiers essentiels de l'application (cache-first)
// - STATIC_ASSETS_CACHE : pour les assets statiques (stale-while-revalidate)
// - DATA_CACHE : pour les fichiers de données (stale-while-revalidate)
// - DYNAMIC_CACHE : pour les données téléchargées depuis le réseau (network-first)
// - OPAQUE_CACHE : pour les ressources opaques (cross-origin)
export const CORE_CACHE = `${APP_NAME}-core-${APP_VERSION}-${SW_VERSION}`;
export const STATIC_ASSETS_CACHE = `${APP_NAME}-assets-${APP_VERSION}-${SW_VERSION}`;
export const DATA_CACHE = `${APP_NAME}-data-${APP_VERSION}-${SW_VERSION}`;
export const DYNAMIC_CACHE = `${APP_NAME}-dynamic-${APP_VERSION}-${SW_VERSION}`;
export const OPAQUE_CACHE = `${APP_NAME}-opaque-${APP_VERSION}-${SW_VERSION}`;

export const CURRENT_CACHES = new Set([
	CORE_CACHE,
	STATIC_ASSETS_CACHE,
	DATA_CACHE,
	DYNAMIC_CACHE,
	OPAQUE_CACHE,
]);
