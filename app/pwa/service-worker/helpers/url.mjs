export function resolveAppUrl(path, baseUrl = globalThis.location.href) {
	return new URL(path, baseUrl).href;
}
