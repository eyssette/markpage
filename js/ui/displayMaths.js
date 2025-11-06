import { yaml } from "../processMarkdown/yaml";
import { convertLatexExpressions } from "../processMarkdown/convertLatex";

export function displayMaths() {
	const interval = setInterval(() => {
		if (window.katex) {
			clearInterval(interval);
			const initialMessageElement = document.getElementById("initialMessage");
			const initialMessageElementBaseContent = initialMessageElement.innerHTML;
			const useFiltersButtons =
				initialMessageElementBaseContent.includes("<button>");
			if (yaml) {
				if (!yaml.lightpad || (yaml.lightpad && !useFiltersButtons)) {
					initialMessageElement.innerHTML = convertLatexExpressions(
						initialMessageElementBaseContent,
					);
				}
			}
			// Possibilité d'utiliser du Latex dans les titres de section ou sous-section
			const sectionTitles = document.querySelectorAll(
				"h2, h3, .navigationLink",
			);
			for (const sectionTitle of sectionTitles) {
				sectionTitle.innerHTML = convertLatexExpressions(
					sectionTitle.innerHTML,
				);
			}

			const sectionContent = document.querySelectorAll(".sectionContent");
			for (const section of sectionContent) {
				const subSectionsContent =
					section.querySelectorAll(".subSectionContent");
				if (subSectionsContent.length > 0) {
					for (const subSection of subSectionsContent) {
						subSection.innerHTML = convertLatexExpressions(
							subSection.innerHTML,
						);
					}
				} else {
					section.innerHTML = convertLatexExpressions(section.innerHTML);
				}
			}
		}
	}, 200);
}
