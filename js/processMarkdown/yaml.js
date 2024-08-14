import jsYaml from "../externals/js-yaml.js";
import { deepMerge, loadScript, loadCSS } from "../utils.js";

export let yaml = {
	searchbar: true,
	swipe: true,
	linkToHomePage: false,
};

export function processYAML(markdownContent) {
	// Gestion de l'en-tête YAML
	try {
		if (
			markdownContent.split("---").length > 2 &&
			markdownContent.startsWith("---")
		) {
			const yamlData = jsYaml.load(markdownContent.split("---")[1]);
			yaml = yamlData ? deepMerge(yaml, yamlData) : yaml;
		}
		// Gestion des mathématiques
		if (yaml.maths === true) {
			Promise.all([
				loadScript(
					"https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js",
				),
				loadCSS("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"),
			]);
		}
		// Gestion des styles personnalisés
		if (yaml.style) {
			const styleElement = document.createElement("style");
			styleElement.innerHTML = yaml.style.replaceAll("\\", "");
			document.body.appendChild(styleElement);
		}
		// Possibilité d'activer ou désactiver le swipe et par conséquent aussi l'affichage step-by-step (avec les boutons de navigation en bas)
		if (yaml.swipe == true) {
			loadCSS("./css/swipe.min.css");
		} else {
			yaml.swipe == false;
		}
		// Possibilité de ne pas avoir la searchbar
		if (yaml.searchbar == false || yaml.recherche == false) {
			yaml.searchbar = false;
		} else {
			yaml.searchbar = true;
		}
		// Affichage possible d'un lien supplémentaire vers la page d'accueil en haut à droite
		if (yaml.linkToHomePage || yaml.lienPageAccueil) {
			yaml.linkToHomePage = yaml.lienPageAccueil
				? yaml.lienPageAccueil
				: yaml.linkToHomePage;
		}
	} catch (e) {
		console.log("erreur processYAML : " + e);
	}
}
