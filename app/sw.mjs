// Service worker pour que l'application puisse fonctionner comme une PWA (Progressive Web App) avec mise en cache des ressources et gestion du hors-ligne.

import { UPDATE_SERVICE_WORKER_WITH_POST_MESSAGE } from "./pwa/service-worker/swConfig.mjs";
import { activatePreload } from "./pwa/service-worker/handle-cache/activatePreload.mjs";
import { precacheCoreResources } from "./pwa/service-worker/fetch-and-cache/core/precache.mjs";
import { removePreviousCaches } from "./pwa/service-worker/handle-cache/removePreviousCaches.mjs";
import { routeRequest } from "./pwa/service-worker/router/routeRequest.mjs";

// INSTALLATION DU SERVICE WORKER

globalThis.addEventListener("install", (event) => {
	event.waitUntil(
		(async () => {
			// Met en cache les ressources essentielles pour que l'application fonctionne hors-ligne.
			await precacheCoreResources();
		})(),
	);
	// Le service worker prend le contrôle, soit au moment où il reçoit un message de l'application (via `postMessage`), soit immédiatement si la configuration le permet.
	if (UPDATE_SERVICE_WORKER_WITH_POST_MESSAGE) {
		globalThis.addEventListener("message", (messageEvent) => {
			if (messageEvent.data && messageEvent.data.type === "SKIP_WAITING") {
				globalThis.skipWaiting();
			}
		});
	} else {
		globalThis.skipWaiting();
	}
});

// ACTIVATION DU SERVICE WORKER

globalThis.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			// Supprime les anciens caches.
			await removePreviousCaches();
			// Active le préchargement de la navigation pour améliorer les performances des navigations hors-ligne.
			await activatePreload();
			// Prend le contrôle des clients déjà ouverts sans attendre un reload.
			await globalThis.clients.claim();
		})(),
	);
});

// INTERCEPTION DES REQUÊTES FETCH
// Permet de gérer les requêtes réseau et de servir les ressources depuis le cache si nécessaire, selon la stratégie de cache définie.

globalThis.addEventListener("fetch", (event) => {
	const { request } = event;
	// On ne gère que le GET (les autres méthodes passent au réseau direct
	if (request.method !== "GET") {
		return;
	}
	// On utilise un router pour déterminer la stratégie de cache à appliquer selon le type de requête (navigation, asset statique, ressource précachée, etc.).
	event.respondWith(routeRequest(event, request));
});
