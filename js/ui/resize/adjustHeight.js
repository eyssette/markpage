import { yaml } from "../../processMarkdown/yaml";

export function adjustHeight(element, options) {
	const bodyHeight = window.innerHeight;
	const headerHeight = document.querySelector("header h1").offsetHeight;
	let availableHeight = bodyHeight - headerHeight;
	if (availableHeight > 500 || yaml.lightpad) {
		if (document.body.classList.contains("noColumns")) {
			availableHeight = availableHeight - 50;
		} else {
			const titleColumnsHeight = document.querySelector("h2").clientHeight;
			availableHeight = availableHeight - titleColumnsHeight - 50;
		}
		// On a au minimum une hauteur de 400px pour chaque colonne (nécessaire si on utilise un bandeau avec Lightpad sur petit écran et que le bandeau est long : sinon la colonne ne s'afficherait que dans l'espace restant, qui serait tout petit)
		availableHeight = Math.max(availableHeight, 400);
		if (yaml && yaml.bandeau) {
			availableHeight = window.matchMedia("(min-width: 500px)").matches
				? availableHeight - 100
				: availableHeight - 10;
		}
		if (options && options.isSubSection) {
			element.style.maxHeight = `${availableHeight}px`;
		} else {
			element.style.height = `${availableHeight}px`;
		}
		document.body.classList.add("adjustHeightColumns");
	} else {
		document.body.style.height = "unset";
		document.body.style.overflow = "unset";
		element.style.height = "unset";
		document.body.classList.remove("adjustHeightColumns");
	}
}
