import { load as loadYAML } from "../externals/js-yaml.js";
import { deepMerge, loadScript, loadCSS } from "../utils.js";
import { CSSthemes } from "../config.js";

export let yaml = {
	searchbar: true,
	oneByOne: true,
	linkToHomePage: false,
};

export function processYAML(markdownContent) {
	const styleThemeElement = document.getElementById("styleTheme");
	// Gestion de l'en-tête YAML
	try {
		if (
			markdownContent.split("---").length > 2 &&
			markdownContent.startsWith("---")
		) {
			const yamlData = loadYAML(markdownContent.split("---")[1]);
			yaml = yamlData ? deepMerge(yaml, yamlData) : yaml;
		}
		// Possibilité d'activer ou désactiver l'affichage oneByOne (avec les boutons de navigation en bas)
		if (yaml.oneByOne == true) {
			loadCSS("./css/oneByOne.min.css");
		} else {
			yaml.oneByOne == false;
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
		if (yaml.theme) {
			// Possibilité d'utiliser un thème pour les cartes
			const themeName = yaml.theme.trim();
			const CSSfile = themeName.endsWith(".css")
				? themeName
				: themeName + ".css";
			if (CSSthemes.includes(CSSfile)) {
				// theme = true;
				let themeURL = "css/theme/" + CSSfile;
				fetch(themeURL)
					.then((response) => response.text())
					.then((data) => {
						styleThemeElement.textContent = data;
						document.body.className =
							document.body.className + " theme-" + CSSfile.replace(".css", "");
					})
					.catch((error) => {
						styleThemeElement.textContent = "";
						document.body.className = document.body.className.replace(
							/theme-.*/,
							"",
						);
						console.error(error);
					});
			} else {
				styleThemeElement.textContent = "";
				document.body.className = document.body.className.replace(
					/theme-.*/,
					"",
				);
			}
		} else {
			styleThemeElement.textContent = "";
			document.body.className = document.body.className.replace(/theme-.*/, "");
		}
		// Gestion des styles personnalisés
		if (yaml.style) {
			const styleElement = document.createElement("style");
			styleElement.innerHTML = yaml.style.replaceAll("\\", "");
			document.body.appendChild(styleElement);
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
