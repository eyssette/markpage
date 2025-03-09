import { convertLatexExpressions } from "../processMarkdown/convertLatex";

export function displayMaths() {
	const interval = setInterval(() => {
		if (window.katex) {
			clearInterval(interval);
			const initialMessageElement = document.getElementById("initialMessage");
			initialMessageElement.innerHTML = convertLatexExpressions(
				initialMessageElement.innerHTML,
			);
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
