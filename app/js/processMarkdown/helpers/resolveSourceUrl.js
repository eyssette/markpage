import { handleURL, isLightpad } from "../../utils";

export function resolveSourceURL(hash, options) {
	let { url, isValidUrl } = handleURL(hash, {
		useCorsProxy: options.useCorsProxy,
	});

	if (options.addMdExtension) {
		// Cas où on déploie un site Markpage avec des fichiers dans son dépôt, on peut alors utiliser des URLs plus significatives, sans avoir à ajouter le .md dans l'URL, car on l'ajoute ici automatiquement
		url += ".md";
	}

	const isLightpadWebsite = isLightpad();

	if (!url && isLightpadWebsite) {
		document.title = "Lightpad";
		return { url: "indexLightpad.md", isValidUrl: true };
	}

	return { url: url, isValidUrl: isValidUrl };
}
