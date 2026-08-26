// Limite le nombre d'entrées dans un cache dès lors qu'il dépasse un seuil, en supprimant les plus anciennes entrées.
const defaultMarginBeforeTrimming = 20;
export async function trimCache(
	cacheName,
	maxEntries,
	margin = defaultMarginBeforeTrimming,
) {
	const cache = await caches.open(cacheName);
	const keys = await cache.keys();

	const threshold = maxEntries + margin;

	if (keys.length <= threshold) {
		return;
	}
	const excess = keys.length - maxEntries;
	const keysToDelete = keys.slice(0, excess);
	await Promise.all(keysToDelete.map((key) => cache.delete(key)));
}
