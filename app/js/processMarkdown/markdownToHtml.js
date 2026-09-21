import Showdown from "../externals/showdown.js";
import { getCSScolor } from "../ui/colors.js";
import { yaml } from "./yaml.js";

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
					// oxlint-disable-next-line max-params
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
					// oxlint-disable-next-line max-params
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

function fixSpoilerAdmonitionCodi(text) {
	// Dans CodiMD on peut définir le type de l'admonition spoiler en la mettant avant dans un autre admonition
	const spoilerInAdmonitionRegex =
		/<div class="admonition \w*?"><div class="admonitionTitle"><\/div><div class="admonitionContent">\n(<div class="admonition spoiler">`.*?`<\/div>\n<\/div>)<\/div>/s;
	const spoilerMatch = text.match(spoilerInAdmonitionRegex);
	if (spoilerMatch) {
		text = text.replace(spoilerMatch[0], spoilerMatch[1]);
	}
	return text;
}

// Fonction pour remplacer les admonitions en Markdown par leur équivalent en HTML
function processAdmonition(text, level) {
	const colons = ":".repeat(level);
	// Regex pour capturer les admonitions
	const admonitionRegex = new RegExp(`${colons}(.+?)\n${colons}(\n|$)`, "gms");
	const admonitions = text.match(admonitionRegex);

	if (admonitions) {
		let lastAdmonitionPosition = 0;
		admonitions.forEach((admonition) => {
			// On enregistre la position de l'admonition dans le texte pour pouvoir plus tard vérifier si l'admonition est dans un bloc code
			const admonitionPosition = text.indexOf(admonition[0]);
			// On récupère les informations de l'admonition qui sont dans la première ligne
			// On récupère le type de l'admonition, l'effet collapsible s'il est utilisé, et le titre de l'admonition s'il est utilisé
			const getAdmonitionInfosRegex = /:::(\w+)( collapsible)?( .*)?/;
			const admonitionFirstLine = admonition.slice(0, admonition.indexOf("\n"));
			const admonitionInfos = admonitionFirstLine.match(
				getAdmonitionInfosRegex,
			);
			if (admonitionInfos) {
				// Récupération du type de l'admonition
				const typeAdmonition = admonitionInfos[1] ? admonitionInfos[1] : "";
				// Récupération de l'effet collapsible (optionnel)
				const isCollapsible =
					admonitionInfos[2] || typeAdmonition == "spoiler" ? true : false;
				// Récupération du titre (optionnel)
				const titleAdmonition = admonitionInfos[3]
					? admonitionInfos[3].trim()
					: isCollapsible
						? "Détails"
						: "";
				// Vérifie si l'admonition est dans un bloc code en regardant autour
				const before = text.substring(
					lastAdmonitionPosition,
					admonitionPosition,
				);
				lastAdmonitionPosition = admonitionPosition;
				const isInCode = /<code>|<pre>/.test(
					before.slice(before.lastIndexOf("<")),
				);
				// Si l'admonition est dans un bloc de code, on ne fait rien
				if (isInCode) {
					return;
				}
				// On construit le HTML de l'admonition
				let contentAdmonition = admonition
					.replace(admonitionFirstLine, "")
					.trim();
				// On supprime dans le contenu la dernière ligne, qui correspond à la fermeture en Markdown de l'admonition
				contentAdmonition = contentAdmonition.substring(
					0,
					contentAdmonition.lastIndexOf("\n"),
				);
				// On convertit le contenu de l'admonition en HTML
				const admonitionHTML = isCollapsible
					? `<div class="admonition ${typeAdmonition}"><details><summary class="admonitionTitle">${titleAdmonition}</summary><div class="admonitionContent">\n${contentAdmonition}\n</div></details></div>\n`
					: `<div class="admonition ${typeAdmonition}"><div class="admonitionTitle">${titleAdmonition}</div><div class="admonitionContent">\n${contentAdmonition}\n</div></div>\n`;

				text = text.replace(admonition, admonitionHTML);
			}
		});
	}
	// On applique le fix pour l'utilisation de spoiler avec CodiMD
	text = fixSpoilerAdmonitionCodi(text);
	return text;
}

function showdownExtensionAdmonitions() {
	return [
		{
			type: "output",
			filter: (text) => {
				// Fix pour les admonitions qui finissent par une balise particulière
				text = text.replace(/:::(<\/li>)/g, "$1\n:::");
				// Supprimer les balises <p> ou les balises <br /> autour ou à la fin des admonitions
				text = text.replace(/(<p>)?(:::.*?)(<\/p>|<br \/>)/g, "$2");
				let level = 3;
				text = processAdmonition(text, level);
				while (text.includes(":".repeat(level + 1))) {
					level = level + 1;
					text = processAdmonition(text, level);
				}
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

// Gestion des notes de bas de page
function showdownExtensionFootNotes() {
	const hash = window.location.hash.substring(1).replace(/\?.*/, "");
	return [
		{
			type: "lang",
			filter: function filter(text) {
				return text.replace(
					/^\[\^([\d\w]+)\]:\s*((\n+(\s{2,4}|\t).+)+)$/gm,
					// oxlint-disable-next-line max-params
					function (str, name, rawContent, _, padding) {
						let content = converter.makeHtml(
							rawContent.replace(new RegExp("^" + padding, "gm"), ""),
						);
						return (
							'<div class="footnote" id="footnote-' +
							name +
							'"><a href="#' +
							hash +
							"?footnote:~:text=[" +
							name +
							']"><span>[' +
							name +
							"] :</span></a> " +
							converter
								.makeHtml(content)
								.replace(/^<p>([\s\S]*)<\/p>\s*$/, "$1") +
							"</div>"
						);
					},
				);
			},
		},
		{
			type: "lang",
			filter: function filter(text) {
				return text.replace(
					/^\[\^([\d\w]+)\]:( |\n)((.+\n)*.+)$/gm,
					// oxlint-disable-next-line max-params
					function (str, name, _, content) {
						return (
							'<small class="footnote" id="footnote-' +
							name +
							'"><a href="#' +
							hash +
							"?footnote:~:text=[" +
							name +
							']"><span>[' +
							name +
							"] :</span></a> " +
							converter
								.makeHtml(content)
								.replace(/^<p>([\s\S]*)<\/p>\s*$/, "$1") +
							"</small>"
						);
					},
				);
			},
		},
		{
			type: "output",
			filter: function filter(text) {
				return text.replace(/\[\^([\d\w]+)\]/gm, function (str, id) {
					return (
						'<a href="#' +
						hash +
						"?footnote:~:text=[" +
						id +
						"] :" +
						'" class="footnoteLink"><sup>[' +
						id +
						"]</sup></a>"
					);
				});
			},
		},
	];
}

// Gestion de la conversion du markdown en HTML
const converter = new Showdown.Converter({
	tasklists: true,
	emoji: true,
	parseImgDimensions: true,
	simplifiedAutoLink: true,
	simpleLineBreaks: true,
	tables: true,
	strikethrough: true,
	extensions: [
		showdownExtensionGenericAttributes,
		showdownExtensionAdmonitions,
		showdownExtensionUnderline,
		showdownExtensionHighlight,
		showdownExtensionFootNotes,
	],
	disableForced4SpacesIndentedSublists: true,
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
	// On sépare le texte en segments pour pouvoir repérer les blocs de code
	const segments = md.split(/(```[\s\S]*?```)/g);

	// On transforme les balises <div> en <div markdown>, mais seulement dans les segments qui ne sont pas un bloc de code
	for (let i = 0; i < segments.length; i++) {
		if (!segments[i].startsWith("```")) {
			segments[i] = segments[i].replace(/<div(.*?)>/g, "<div markdown$1>");
		}
	}

	return segments.join("");
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
