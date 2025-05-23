import Showdown from "../externals/showdown.js";
import { yaml } from "./yaml.js";
import { getCSScolor } from "../ui/colors.js";

// Extensions pour Showdown

// Gestion des attributs génériques du type {.classe1 .classe2}
function showdownExtensionGenericAttributes() {
	return [
		{
			type: "output",
			filter: (text) => {
				// Regex pour détecter les attributs génériques en fin de ligne dans un élément
				const genericAttributesRegexBlock = /<(\w+)(.*?)>(.*?) ({\.(.*?)})/g;

				const easyGenericAttributesRegexInline = /--(.*?):(.*?)--/g;
				let lastMatchPositionEasyGenericAttribute = 0;
				text = text.replace(
					easyGenericAttributesRegexInline,
					(match, attributeString, textWithAttribute) => {
						const isColor = getCSScolor(attributeString);
						const sectionText = text.substring(
							lastMatchPositionEasyGenericAttribute,
						);
						const matchPosition = sectionText.indexOf(match);
						lastMatchPositionEasyGenericAttribute =
							lastMatchPositionEasyGenericAttribute +
							matchPosition +
							match.length;
						const before = text.substring(0, matchPosition);
						const after = text.substring(lastMatchPositionEasyGenericAttribute);
						const isInCode = /<code>|<pre>/.test(
							before.slice(before.lastIndexOf("<")),
						);
						const isComment = after && after.startsWith(">");
						if (!isInCode & !isComment) {
							let replaceBy;
							const isTag = attributeString.startsWith("tag");
							if (!isTag) {
								replaceBy = isColor
									? `<span style="color:${isColor}">${textWithAttribute}</span>`
									: `<span class="${attributeString}">${textWithAttribute}</span>`;
							} else {
								const contentAfterTag = attributeString
									.replace("tag", "")
									.trim();
								const colourBackground = getCSScolor(contentAfterTag);
								if (colourBackground) {
									replaceBy = `<span class="tag" style="background-color:${colourBackground}">${textWithAttribute}</span>`;
								} else {
									replaceBy = `<span class="tag ${contentAfterTag}">${textWithAttribute}</span>`;
								}
							}
							return replaceBy;
						} else {
							return match;
						}
					},
				);

				// Regex pour détecter l'utilisation d'attributs génériques à l'intérieur d'un élément (un passage mis en gras, en italiques, ou tout autre balise)
				const genericAttributesRegexInline =
					/<(\w+)(.*?)>(.*?)<\/\1>{(\.[^{}]+)}/g;

				let modifiedText = text;

				// Traitement des attributs génériques en fin de ligne
				modifiedText = modifiedText.replace(
					genericAttributesRegexBlock,
					(match, tag, attrs, content, _, classes) => {
						// Vérifier si l'élément est dans un <code>
						if (match.includes("<code>")) return match;

						const classAttribute = ` class="${classes.replace(/\./g, " ").trim()}"`;
						return `<${tag}${attrs}${classAttribute}>${content}</${tag}>`;
					},
				);

				// Traitement des attributs génériques pour un élément inline
				modifiedText = modifiedText.replace(
					genericAttributesRegexInline,
					(match, tag, attrs, content, classes) => {
						const classAttribute = ` class="${classes.replace(/\./g, " ").trim()}"`;
						return `<${tag}${attrs}${classAttribute}>${content}</${tag}>`;
					},
				);

				return modifiedText;
			},
		},
	];
}

// Gestion des admonitions
function showdownExtensionAdmonitions() {
	return [
		{
			type: "output",
			filter: (text) => {
				// Supprimer les balises <p> autour des admonitions
				text = text.replace(/<p>:::(.*?)(<\/p>)?/g, ":::$1");

				// Expression régulière pour capturer le contenu des admonitions
				const regex = /:::(\w+)(?:\s+(collapsible)?)?\s*(.*?)\n([\s\S]*?):::/g;

				// Traiter chaque match de l'admonition
				text = text.replace(
					regex,
					(match, type, collapsible, title, content, offset) => {
						title = title.replace("<br />", "").replace("</p>", "");
						// Vérifier si l'admonition est dans un bloc code en regardant autour
						const before = text.substring(0, offset);
						const isInCode = /<code|<pre/.test(
							before.slice(before.lastIndexOf("<")),
						);

						if (isInCode) {
							// Si l'admonition est dans un bloc de code, on ne fait rien
							return match;
						}

						// Retirer "collapsible" du titre si présent
						if (collapsible) title = title.replace("collapsible", "").trim();

						// Construire le HTML de l'admonition
						if (collapsible) {
							return `<div class="admonition ${type}">
							<details>
								<summary class="admonitionTitle">${title}</summary>
								<div class="admonitionContent">${content.trim()}</div>
							</details>
						</div>`;
						} else {
							return `<div class="admonition ${type}">
							<div class="admonitionTitle">${title}</div>
							<div class="admonitionContent">${content.trim()}</div>
						</div>`;
						}
					},
				);

				return text;
			},
		},
	];
}

// Gestion des éléments soulignés et surlignés
function showdownExtensionUnderline() {
	return [
		{
			type: "output",
			filter: (text) => {
				text = text.replaceAll(
					/\+\+(.*?)\+\+/g,
					(match, contentUnderlined, offset) => {
						const before = text.substring(0, offset);
						const isInCode = /<code>|<pre>/.test(
							before.slice(before.lastIndexOf("<")),
						);

						if (isInCode) {
							// Si le soulignement est dans un bloc de code, on ne fait rien
							return match;
						} else return `<u>${contentUnderlined}</u>`;
					},
				);
				return text;
			},
		},
	];
}
function showdownExtensionHighlight() {
	return [
		{
			type: "output",
			filter: (text) => {
				text = text.replaceAll(/==(.*?)==/g, "<mark>$1</mark>");
				return text;
			},
		},
	];
}

// Gestion de la conversion du markdown en HTML
const converter = new Showdown.Converter({
	emoji: true,
	parseImgDimensions: true,
	simplifiedAutoLink: true,
	simpleLineBreaks: true,
	tables: true,
	extensions: [
		showdownExtensionGenericAttributes,
		showdownExtensionAdmonitions,
		showdownExtensionUnderline,
		showdownExtensionHighlight,
	],
});

// Gestion des dimensions des images
function fixImageDimensionsCodiMD(md) {
	md = md.replaceAll(/=x([0-9]*)\)/g, "=*x$1)");
	md = md.replaceAll(/=([0-9]*)x\)/g, "=$1x*)");
	return md;
}

// Gestion des URLs relatives des images
function resolveImagePath(md) {
	md = md.replace(
		/!\[(.*?)\]\((?!http)(.*?)\)/g,
		function (match, altText, imagePath) {
			const pathPrefix = yaml.pathImages.endsWith("/")
				? yaml.pathImages
				: yaml.pathImages + "/";
			return `![${altText}](${pathPrefix}${imagePath})`;
		},
	);
	return md;
}

// Gestion du Markdown dans un bloc div
function markdownInDiv(md) {
	md = md.replace(/<div(.*)?>/g, "<div markdown$1>");
	return md;
}

export function markdownToHTML(text) {
	text = fixImageDimensionsCodiMD(text);
	text = markdownInDiv(text);
	if (yaml && yaml.pathImages) {
		text = resolveImagePath(text);
	}
	let html = converter.makeHtml(text);
	// Optimisation de l'affichage des images (sauf si en HTLM on ne met pas l'attribut src en premier)
	html = html.replaceAll("<img src", '<img loading="lazy" src');
	return html;
}
