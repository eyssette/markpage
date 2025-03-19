import { load as loadYAML } from "../externals/js-yaml.js";
import { deepMerge, loadScript, loadCSS } from "../utils.js";
import { CSSthemes, allowedAddOns, addOnsDependencies } from "../config.js";
import { setTheme } from "../ui/setTheme.js";

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
		const isLightpadWebsite = window.location.href.includes("lightpad")
			? true
			: false;
		if (yaml.lightpad === true || isLightpadWebsite) {
			loadCSS("./css/lightpad.min.css");
			document.body.classList.add("lightpad");
			yaml.lightpad = true;
			yaml.pad = true;
			yaml.padScroll = true;
			if (yaml.addOns && !yaml.addOns.includes("textFit")) {
				yaml.addOns = yaml.addOns + ", textFit";
			} else {
				yaml.addOns = "textFit";
			}
			if (yaml.bandeau || yaml.banner) {
				document.body.classList.add("useBanner");
			}
		}
		if (yaml.pad === true) {
			loadCSS("./css/pad.min.css");
			yaml.oneByOne = false;
			yaml.linkToHomePage = false;
			// Par défaut on ajoute l'addOn lightbox si on est dans le mode pad (car les images sont de toute façon petites dans chaque colonne)
			if (yaml.addOns && !yaml.addOns.includes("lightbox")) {
				yaml.addOns = yaml.addOns + ", lightbox";
			} else {
				yaml.addOns = "lightbox";
			}
		}
		if (yaml.padScroll === true) {
			loadCSS("<style>body{height:100vw;overflow-y:hidden;}</style>");
		}
		// Possibilité d'activer ou désactiver l'affichage oneByOne (avec les boutons de navigation en bas)
		if (yaml.oneByOne == true) {
			loadCSS("./css/oneByOne.min.css");
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
				),
				loadCSS("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"),
			]);
		}
		// Gestion des styles personnalisés
		if (yaml.theme) {
			setTheme(yaml.theme, CSSthemes, styleThemeElement);
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
		// Affichage possible d'un lien supplémentaire vers la page d'accueil en haut à droite (sauf si on est sur Lightpad)
		if ((yaml.linkToHomePage || yaml.lienPageAccueil) && !yaml.lightpad) {
			yaml.linkToHomePage = yaml.lienPageAccueil
				? yaml.lienPageAccueil
				: yaml.linkToHomePage;
		}
		// Gestion des add-ons (scripts et css en plus)
		if (yaml.addOns) {
			yaml.addOns = yaml.addOns.replaceAll(" ", "").split(",");
			let addOnsDependenciesArray = [];
			// On ajoute aussi les dépendances pour chaque add-on
			for (const [addOn, addOnDependencies] of Object.entries(
				addOnsDependencies,
			)) {
				if (yaml.addOns.includes(addOn)) {
					for (const addOnDependencie of addOnDependencies) {
						addOnsDependenciesArray.push(addOnDependencie);
					}
				}
			}
			yaml.addOns.push(...addOnsDependenciesArray);
			// Pour chaque add-on, on charge le JS ou le CSS correspondant
			for (const desiredAddOn of yaml.addOns) {
				const addOnsPromises = [];
				const addDesiredAddOn = allowedAddOns[desiredAddOn];
				if (addDesiredAddOn) {
					if (addDesiredAddOn.js) {
						addOnsPromises.push(loadScript(addDesiredAddOn.js));
					}
					if (addDesiredAddOn.css) {
						addOnsPromises.push(loadCSS(addDesiredAddOn.css));
					}
					Promise.all(addOnsPromises);
				}
			}
		}
	} catch (e) {
		console.log("erreur processYAML : " + e);
	}
	return markdownContent;
}
