import defaultMD from "../../index.md";

import { parseMarkdown } from "./parseMarkdown.js";
import { createMarkpage } from "../ui/createMarkpage.js";
import { resolveSourceURL } from "./helpers/resolveSourceURL.js";
import { fetchSource } from "./helpers/fetch.js";

const defaultOptions = {
	useCorsProxy: false,
	useDefaultMarkpage: false,
	addMdExtension: false,
};

export async function getMarkdownContentAndCreateMarkpage(newOptions = {}) {
	const options = { ...defaultOptions, ...newOptions };

	// On récupère la source du site Markpage dans le hash s'il y en a une
	const hash = window.location.hash.substring(1).replace(/\?.*/, "");

	const source = resolveSourceURL(hash, options);

	// Cas : pas de source dans le hash ou usage forcé du site Markpage par défaut
	if (!source || options.useDefaultMarkpage) {
		const markpageData = parseMarkdown(defaultMD);
		return createMarkpage(markpageData);
	}

	try {
		// On récupère le contenu de la source dans le hash
		const md = await fetchSource(source);

		// On vérifie que la source est bien un fichier Markdown
		const looksLikeMarkdown = md.includes("# ");
		if (!looksLikeMarkdown) {
			// Si ce n'est pas un fichier Markdown …
			if (!options.addMdExtension) {
				// … On essaie d'abord d'ajouter l'extension ".md"
				// Si on déploie un site Markpage avec des fichiers dans son dépôt, on peut alors utiliser des URLs plus significatives, sans avoir à ajouter le .md dans l'URL
				return getMarkdownContentAndCreateMarkpage({
					...options,
					addMdExtension: true,
				});
			} else {
				// Si ça ne marche toujours pas, on affiche le site Markpage par défaut
				alert(
					"Erreur dans l'URL ou le fichier source. Vérifiez que le fichier est public et qu'il respecte la syntaxe Markpage",
				);
				return getMarkdownContentAndCreateMarkpage({
					...options,
					useDefaultMarkpage: true,
				});
			}
		} else {
			// Si on a bien récupéré la source Markdown et qu'elle est correcte, on affiche le site Markpage correspondant
			const markpageData = parseMarkdown(md);
			return createMarkpage(markpageData, hash);
		}
	} catch (error) {
		// En cas d'erreur avec la récupération du contenu, on essaie d'utiliser un proxy CORS, et si ça ne marche pas, on affiche le site Markpage par défaut
		if (!options.useCorsProxy) {
			return getMarkdownContentAndCreateMarkpage({
				...options,
				useCorsProxy: true,
			});
		} else {
			alert(
				"Il y a une erreur dans l'URL ou bien votre fichier n'est pas accessible",
			);
			console.log(error);

			return getMarkdownContentAndCreateMarkpage({
				...options,
				useDefaultMarkpage: true,
			});
		}
	}
}
