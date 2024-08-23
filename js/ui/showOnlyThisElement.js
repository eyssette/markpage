// Pour forcer le reload d'une iframe
function resetIframe(iframe) {
	const srcIframe = iframe.src;
	iframe.blur();
	iframe.src = "";
	iframe.src = srcIframe;
}

// Une fonction pour choisir de n'afficher que l'élément actif
export function showOnlyThisElement(element, type) {
	const sections = document.querySelectorAll("section");
	const subSections = document.querySelectorAll(".subSection");
	if (type == "sections") {
		for (const sectionElement of sections) {
			sectionElement.classList.remove("visible");
		}
	}
	if (type == "subsections") {
		for (const subSectionElement of subSections) {
			subSectionElement.classList.remove("visible");
		}
	}
	if (element) {
		element.classList.add("visible");
		const iframesInElement = element.querySelectorAll("iframe");
		for (const iframe of iframesInElement) {
			resetIframe(iframe);
		}
	}
}
