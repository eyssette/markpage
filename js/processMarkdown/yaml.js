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
		const isMarkpadWebsite = window.location.href.includes("markpad")
			? true
			: false;
		if (yaml.markpad === true || isMarkpadWebsite) {
			yaml.markpad = true;
			loadCSS(
				"<style>h1,#searchBar{position:fixed}h1{text-align:left;top:0;width:100%;background: #004450;color:white;height:1.15em;overflow:hidden;justify-content:left!important;padding-left:20px;padding-top:.12em!important;padding-bottom:0.18em}h1 img{height:1em;width:1em;object-fit:contain;vertical-align:text-top;margin-right:0.25em}#initialMessage{display:none!important}main{margin-top:2.75em;}.sectionContent{margin-top:-0.75em!important}#innerBox{overflow-y:hidden}@media screen and (max-width:500px){h1{height:2em!important;justify-content:center!important;text-align:center;padding-left:0!important}h1 img{margin-right:0}main{margin-top:3em}#content>section{background:#f6f6f8}}</style>",
			);
			document.body.querySelector("h1").textContent = "Markpad";
			yaml.pad = true;
			yaml.padScroll = true;
			if (yaml.addOns && !yaml.addOns.includes("textFit")) {
				yaml.addOns = yaml.addOns + ", textFit";
			} else {
				yaml.addOns = "textFit";
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
		// Affichage possible d'un lien supplémentaire vers la page d'accueil en haut à droite
		if (yaml.linkToHomePage || yaml.lienPageAccueil) {
			yaml.linkToHomePage = yaml.lienPageAccueil
				? yaml.lienPageAccueil
				: yaml.linkToHomePage;
		}
		// Gestion des add-ons (scripts et css en plus)
		if (yaml.addOns) {
			yaml.addOns = yaml.addOns.replace(" ", "").split(",");
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
