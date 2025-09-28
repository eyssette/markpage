import { load as loadYAML } from "../externals/js-yaml.js";
import { deepMerge, loadScript, loadCSS } from "../utils.js";
import { CSSthemes, allowedPlugins, pluginsDependencies } from "../config.js";
import { setTheme } from "../ui/setTheme.js";

export const defaultYaml = {
	searchbar: true,
	oneByOne: true,
	linkToHomePage: false,
};

export let yaml;

export async function processYAML(markdownContent) {
	// Gestion de l'en-tête YAML
	yaml = { ...defaultYaml };
	try {
		if (
			markdownContent.split("---").length > 2 &&
			markdownContent.startsWith("---")
		) {
			const yamlData = loadYAML(markdownContent.split("---")[1]);
			yaml = yamlData ? deepMerge(yaml, yamlData) : yaml;
		}
		const isLightpadWebsite = window.location.href.includes("lightpad")
			? true
			: false;
		if (yaml.addOns) {
			yaml.plugins = yaml.addOns;
		}
		if (yaml.lightpad === true || isLightpadWebsite) {
			loadCSS("./css/lightpad.min.css", "lightpad");
			document.body.classList.add("lightpad");
			yaml.lightpad = true;
			yaml.pad = true;
			yaml.padScroll = true;
			if (yaml.plugins && !yaml.plugins.includes("textFit")) {
				yaml.plugins = yaml.plugins + ", textFit";
			} else {
				yaml.plugins = "textFit";
			}
			if ((yaml.bandeau && yaml.bandeau != "non") || yaml.banner) {
				document.body.classList.add("useBanner");
			}
		}
		if (yaml.pad === true) {
			loadCSS("./css/pad.min.css", "pad");
			yaml.oneByOne = false;
			yaml.linkToHomePage = false;
			// Par défaut on ajoute le plugin lightbox si on est dans le mode pad (car les images sont de toute façon petites dans chaque colonne)
			if (yaml.plugins && !yaml.plugins.includes("lightbox")) {
				yaml.plugins = yaml.plugins + ", lightbox";
			} else {
				yaml.plugins = "lightbox";
			}
			if (yaml.tailleColonnes) {
				const styleColumns = `<style>@media screen and (min-width: 1400px) {#content>section {min-width: ${yaml.tailleColonnes};}}</style>`;
				loadCSS(styleColumns, "styleColumns");
			}
		}
		if (yaml.padScroll === true) {
			loadCSS(
				"<style>body{height:100vw;overflow-y:hidden;}</style>",
				"padScroll",
			);
		}
		// Possibilité d'activer ou désactiver l'affichage oneByOne (avec les boutons de navigation en bas)
		if (yaml.oneByOne == true) {
			loadCSS("./css/oneByOne.min.css", "oneByOne");
		} else {
			yaml.oneByOne == false;
		}
		// Gestion des mathématiques
		if (yaml.maths === true) {
			// Fix pour l'utilisation de "\\"" en Latex
			markdownContent = markdownContent.replaceAll("\\", "&#92;&#92;");
			Promise.all([
				loadScript(
					"https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js",
					"katex",
				),
				loadCSS(
					"https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
					"katex",
				),
			]);
		}
		// Gestion des styles personnalisés
		const styleThemeElement = document.getElementById("styleTheme");
		if (yaml.theme) {
			await setTheme(yaml.theme, CSSthemes, styleThemeElement);
		} else {
			styleThemeElement.textContent = "";
			document.body.className = document.body.className.replace(/theme-.*/, "");
		}
		// Gestion des styles personnalisés
		if (yaml.style) {
			const hasCustomCSS = document.querySelector("#customCSS");
			const styleElement = hasCustomCSS || document.createElement("style");
			styleElement.id = "customCSS";
			styleElement.innerHTML = yaml.style.replaceAll("\\", "");
			if (!hasCustomCSS) {
				document.body.appendChild(styleElement);
			}
		}
		// Possibilité de ne pas avoir la searchbar
		if (yaml.searchbar == false || yaml.recherche == false) {
			yaml.searchbar = false;
		} else {
			yaml.searchbar = true;
		}
		// Affichage possible d'un lien supplémentaire vers la page d'accueil en haut à droite (sauf si on est sur Lightpad)
		if ((yaml.linkToHomePage || yaml.lienPageAccueil) && !yaml.lightpad) {
			yaml.linkToHomePage = yaml.lienPageAccueil
				? yaml.lienPageAccueil
				: yaml.linkToHomePage;
		}
		// Gestion des add-ons (scripts et css en plus)
		if (yaml.plugins) {
			yaml.plugins = yaml.plugins.toString();
			yaml.plugins = yaml.plugins.replaceAll(" ", "").split(",");
			let pluginsDependenciesArray = [];
			// On ajoute aussi les dépendances pour chaque add-on
			for (const [plugin, pluginDependencies] of Object.entries(
				pluginsDependencies,
			)) {
				if (yaml.plugins.includes(plugin)) {
					for (const pluginDependencie of pluginDependencies) {
						pluginsDependenciesArray.push(pluginDependencie);
					}
				}
			}
			yaml.plugins.push(...pluginsDependenciesArray);
			// Pour chaque add-on, on charge le JS ou le CSS correspondant
			for (const desiredPlugin of yaml.plugins) {
				const pluginsPromises = [];
				const addDesiredPlugin = allowedPlugins[desiredPlugin];
				if (addDesiredPlugin) {
					if (addDesiredPlugin.js) {
						pluginsPromises.push(
							loadScript(addDesiredPlugin.js, desiredPlugin),
						);
					}
					if (addDesiredPlugin.css) {
						pluginsPromises.push(loadCSS(addDesiredPlugin.css, desiredPlugin));
					}
					Promise.all(pluginsPromises);
				}
			}
		}
	} catch (e) {
		const styleThemeElement = document.getElementById("styleTheme");
		styleThemeElement.textContent = "";
		document.body.className = document.body.className.replace(/theme-.*/, "");
		console.log("erreur processYAML : " + e);
	}
	return markdownContent;
}

export function resetYamlToDefault() {
	// Supprime toutes les clés existantes
	for (const key of Object.keys(yaml)) {
		delete yaml[key];
	}

	// Copie toutes les clés de defaultYaml
	for (const [key, value] of Object.entries(defaultYaml)) {
		yaml[key] = value;
	}
}
