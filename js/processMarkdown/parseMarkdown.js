import { processYAML, yaml } from "./yaml";
import { markdownToHTML } from "./markdownToHTML";
import { filterElementWithNoContent, removeUselessCarriages } from "../utils";
function replaceHashesInCodeAndCommentBlocks(markdown) {
	return markdown.replace(/(```[\s\S]*?```|<!--[\s\S]*?-->)/g, (match) => {
		return match.replace(/#/g, "\uE000"); // Utilisation d'un caractère Unicode spécial
	});
}

function restoreHashesInCodeAndCommentsBlocks(markdown) {
	return markdown.replace(/(```[\s\S]*?```|<!--[\s\S]*?-->)/g, (match) => {
		return match.replace(/\uE000/g, "#");
	});
}

export function parseMarkdown(markdownContent) {
	markdownContent = processYAML(markdownContent);

	// Suppression des caractères "#" dans les blocs codes
	markdownContent = replaceHashesInCodeAndCommentBlocks(markdownContent);
	// On distingue le header et le contenu
	const indexfirstH2title = markdownContent.indexOf("## ");
	const header = markdownContent.substring(0, indexfirstH2title);
	const mainContent = markdownContent.substring(indexfirstH2title);

	// Dans le header, on distingue le titre (défini par un titre h1) et le message initial

	let markpageTitle = header.match(/# .*/)[0].replace("# ", "");
	if (yaml && yaml.lightpad) {
		markpageTitle = markpageTitle.replace(/<br.*?>/, " – ");
	}
	const indexStartTitle = header.indexOf(markpageTitle);
	const initialMessageContent = header.substring(
		indexStartTitle + markpageTitle.length + 1,
	);

	// Dans le contenu, on distingue chaque section (définie par un titre h2)
	const sections = mainContent
		.split(/(\n|^)## /)
		.filter(filterElementWithNoContent);
	let sectionsTitles = [];
	let subSectionsArray = [];

	for (const section of sections) {
		// Dans chaque section, on distingue le titre et le contenu
		const indexEndTitle = section.indexOf("\n");
		const sectionTitle = markdownToHTML(section.substring(0, indexEndTitle))
			.replace("<p>", "")
			.replace("</p>", "");
		const sectionTitleAside = sectionTitle.match(/<aside>(.*)<\/aside>/);
		const sectionTitleAsideHTML = sectionTitleAside
			? "<h3>" + sectionTitleAside[1] + "</h3>"
			: "";
		const sectionContent = section.substring(indexEndTitle);
		sectionsTitles.push(sectionTitle);

		// Dans chaque section, on regarde s'il y a des sous-sections (définis par un titre h3)
		const subSections = sectionContent
			.split(/(\n|^)### /)
			.filter(filterElementWithNoContent);
		let subSectionsContent = [];
		if (/(\n|^)### /.test(sectionContent)) {
			// S'il y a des sous-sections …
			for (let subSection of subSections) {
				subSection = restoreHashesInCodeAndCommentsBlocks(subSection);
				// … on récupère le titre, l'image et le contenu de chaque sous-section
				// - récupération du titre
				const indexEndTitleSubSection = subSection.indexOf("\n");
				const subSectionTitle = markdownToHTML(
					subSection.substring(0, indexEndTitleSubSection),
				)
					.replace("<p>", "")
					.replace("</p>", "");
				// - récupération du contenu éventuellement avec image
				let subSectionContent = subSection.substring(
					1 + indexEndTitleSubSection,
				);
				// - s'il y a une image, on la récupère
				let subSectionImage = "";
				if (subSectionContent.trim().startsWith("![")) {
					const indexEndImage = subSectionContent.indexOf("\n");
					subSectionImage = markdownToHTML(
						subSectionContent.substring(0, indexEndImage),
					);
					subSectionContent = subSectionContent.substring(1 + indexEndImage);
				}
				// … on transforme en HTML le contenu, en supprimant les retours à la ligne inutiles
				const subSectionContentHTML =
					sectionTitleAsideHTML +
					markdownToHTML(removeUselessCarriages(subSectionContent));
				subSectionsContent.push([
					subSectionTitle,
					subSectionImage,
					subSectionContentHTML,
				]);
			}
		} else {
			// S'il n'y a pas de sous-section : on transforme directement en HTML le contenu, en supprimant les retours à la ligne inutiles
			let subSectionsContentHTML = "";
			if (subSections[0]) {
				subSectionsContentHTML = subSections[0];
				subSectionsContentHTML = markdownToHTML(
					removeUselessCarriages(
						restoreHashesInCodeAndCommentsBlocks(subSectionsContentHTML),
					),
				);
			}
			subSectionsContentHTML =
				'<div class="noSubSections">' +
				sectionTitleAsideHTML +
				subSectionsContentHTML +
				"</div>";
			subSectionsContent = [subSectionsContentHTML];
		}
		subSectionsArray.push(subSectionsContent);
	}

	const markpageData = [
		markdownToHTML(markpageTitle).replace("<p>", "").replace("</p>", ""),
		markdownToHTML(initialMessageContent),
		sectionsTitles,
		subSectionsArray,
	];

	return markpageData;
}
