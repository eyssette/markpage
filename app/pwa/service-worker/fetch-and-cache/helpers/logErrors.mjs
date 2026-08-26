// Log différencié selon qu'il s'agit d'un timeout applicatif ou d'une autre erreur réseau.
export function logFetchError(error, url, timeoutMs) {
	if (process.env.NODE_ENV === "development-with-service-worker") {
		if (error.name === "AbortError" || error.name === "TimeoutError") {
			// bearer:disable javascript_lang_logger_leak
			console.error(
				`Timeout réseau (${timeoutMs}ms) pour ${url}, requête annulée`,
			);
		} else {
			// bearer:disable javascript_lang_logger_leak
			// nosemgrep: javascript.lang.security.audit.unsafe-formatstring.unsafe-formatstring
			console.error(`Erreur réseau pour ${url} :`, error);
		}
	}
}
