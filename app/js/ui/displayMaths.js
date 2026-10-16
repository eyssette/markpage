import { yaml } from "../processMarkdown/yaml";
import { convertLatexExpressions } from "../processMarkdown/convertLatex";
import { convertIframeCodesToIframeHTMLElements } from "./iframes";
import { handleClicks } from "./handleClicks";

export function displayMaths(baseURL, hash, markpageData) {
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
			// Si on est en mode Pad, après avoir converti les expressions en Latex, on convertit les codes d'iframe en iframes réelles
			if (yaml.pad) {
				convertIframeCodesToIframeHTMLElements(document.body, { delay: true });
			}
			handleClicks(baseURL, hash, markpageData);
		}
	}, 200);
}
