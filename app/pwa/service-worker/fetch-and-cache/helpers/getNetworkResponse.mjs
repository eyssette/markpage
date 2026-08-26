// Récupère la réponse réseau : tente d'abord le preload si disponible, sinon fetch classique.
// oxlint-disable-next-line max-params max-statements
export async function getNetworkResponse(
	request,
	fetchOptions,
	event,
	timeoutMs,
) {
	const hasTimeout = timeoutMs > 0;
	// 1. Tentative via navigation preload (si applicable)
	if (request.mode === "navigate" && event && event.preloadResponse) {
		const NAVIGATION_PRELOAD_TIMEOUT_MS = 1000;
		let preloadTimeoutId;

		// oxlint-disable-next-line promise/prefer-await-to-then promise/prefer-await-to-callbacks
		const preloadPromise = event.preloadResponse.catch((error) => {
			if (process.env.NODE_ENV === "development-with-service-worker") {
				// bearer:disable javascript_lang_logger_leak
				console.error("Navigation Preload échoué :", error);
			}
		});

		// oxlint-disable-next-line promise/avoid-new
		const timeoutPromise = new Promise((resolve) => {
			preloadTimeoutId = setTimeout(resolve, NAVIGATION_PRELOAD_TIMEOUT_MS);
		});

		let preloadResponse;
		try {
			preloadResponse = await Promise.race([preloadPromise, timeoutPromise]);
		} finally {
			clearTimeout(preloadTimeoutId);
		}

		// On garde la promesse attachée à l'événement, même après timeout
		event.waitUntil(preloadPromise);

		if (preloadResponse) {
			return preloadResponse;
		}
	}

	// 2. Fetch classique (repli après échec du preload, ou requête non‑navigation);
	let timeoutId;
	try {
		if (hasTimeout) {
			const controller = new AbortController();
			timeoutId = setTimeout(() => {
				controller.abort(
					new DOMException(
						`Timeout après ${timeoutMs}ms pour ${request.url}`,
						"TimeoutError",
					),
				);
			}, timeoutMs);
			return await fetch(request, {
				...fetchOptions,
				signal: controller.signal,
			});
		}
		return await fetch(request, fetchOptions);
	} finally {
		if (hasTimeout) {
			clearTimeout(timeoutId);
		}
	}
}
