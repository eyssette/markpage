import { handleURL } from "../../utils";

export function resolveSourceURL(hash, options) {
	let source = handleURL(hash, { useCorsProxy: options.useCorsProxy });

	if (options.addMdExtension) {
		// Cas où on déploie un site Markpage avec des fichiers dans son dépôt, on peut alors utiliser des URLs plus significatives, sans avoir à ajouter le .md dans l'URL, car on l'ajoute ici automatiquement
		source += ".md";
	}

	const isLightpad =
		window.location.href.includes("https://lightpad.forge.apps.education.fr") ||
		window.location.href.includes("?lightpad");

	if (!source && isLightpad) {
		document.title = "Lightpad";
		return "indexLightpad.md";
	}

	return source;
}
