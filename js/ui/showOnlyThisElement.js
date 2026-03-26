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
		// On ajoute la classe "visible" à l'élément actif
		element.classList.add("visible");
		if (type == "subsections") {
			// On retire la classe "visible" de tous les éléments h3
			const allH3Elements = document.querySelectorAll("h3");
			for (const h3Element of allH3Elements) {
				h3Element.classList.remove("visible");
			}
			// On part de l'élément actif et on ajoute la classe "visible" à tous les éléments h3 qui sont dans la même section que l'élément actif et qui ont la classe "groupDisplay"
			let currentElement = element;
			while (currentElement) {
				const h3Element = currentElement.querySelector("h3.groupDisplay");
				if (h3Element) {
					h3Element.classList.add("visible");
				} else {
					break;
				}
				currentElement = currentElement.previousElementSibling;
			}
			currentElement = element.nextElementSibling;
			while (currentElement) {
				const h3Element = currentElement.querySelector("h3.groupDisplay");
				if (h3Element) {
					h3Element.classList.add("visible");
				} else {
					break;
				}
				currentElement = currentElement.nextElementSibling;
			}
		}
	}
}
