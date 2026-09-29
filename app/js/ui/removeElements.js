import { yaml } from "../processMarkdown/yaml";

export function removeH2() {
	const h2Elements = document.querySelectorAll("h2");
	for (const h2Element of h2Elements) {
		h2Element.style.display = "none";
	}
	// On recale correctement le contenu
	const innerBoxElement = document.getElementById("innerBox");
	innerBoxElement.style.marginTop = "0px";
	innerBoxElement.style.paddingTop = "0px";
}

export function removeH3(params) {
	const h3Elements = document.querySelectorAll("h3");
	for (const h3Element of h3Elements) {
		h3Element.style.display = "none";
	}
	if (params.subsec) {
		// À la place du titre en haut de page, on met le titre h3 de la section affichée
		const h3Title = h3Elements[params.subsec - 1].firstChild.innerHTML;
		if (params.sec && h3Title) {
			const h2Title = document.querySelector(
				"#section-" + params.sec + " h2 a",
			);
			h2Title.parentElement.innerHTML = h2Title.innerHTML + " / " + h3Title;
		}
	}
	// On recale correctement en CSS le contenu de la section, étant donné qu'on a supprimé la partie "titres h3" sur la gauche
	const topPosition = params.h2 === "0" ? " top:0px;" : "";
	const styleSubSectionContent = `@media screen and (min-width: 601px) {.subSectionContent {margin-left:140px;${topPosition}}}`;
	const styleSheet = document.createElement("style");
	styleSheet.innerText = styleSubSectionContent;
	document.head.appendChild(styleSheet);
}

export function removeMenu(linkToHomePageElement) {
	const menuElement = document.getElementById("footerContent");
	menuElement.style.display = "none";
	const footerElement = menuElement.parentElement;
	footerElement.style.height = "0px";
	footerElement.style.padding = "0px";
	footerElement.style.backgroundColor = "transparent";
	if (yaml.linkToHomePage) {
		linkToHomePageElement.style.display = "none";
	}
}
