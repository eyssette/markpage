// gestion des mathématiques en Latex
export function convertLatexExpressions(string) {
	string = string
		.replace(/\$\$(.*?)\$\$/g, "&#92;[$1&#92;]")
		.replace(/\$(.*?)\$/g, "&#92;($1&#92;)");
	let expressionsLatex = string.match(
		new RegExp(/&#92;\[.*?&#92;\]|&#92;\(.*?&#92;\)/g),
	);
	if (expressionsLatex) {
		// On n'utilise Katex que s'il y a des expressions en Latex dans le Markdown
		for (let expressionLatex of expressionsLatex) {
			// On vérifie le mode d'affichage de l'expression (inline ou block)
			const inlineMaths = expressionLatex.includes("&#92;[") ? true : false;
			// On récupère la formule mathématique
			let mathInExpressionLatex = expressionLatex
				.replace("&#92;[", "")
				.replace("&#92;]", "");
			mathInExpressionLatex = mathInExpressionLatex
				.replace("&#92;(", "")
				.replace("&#92;)", "");
			mathInExpressionLatex = mathInExpressionLatex
				.replaceAll("&lt;", "\\lt")
				.replaceAll("&gt;", "\\gt");
			mathInExpressionLatex = mathInExpressionLatex
				.replaceAll("<em>", "_")
				.replaceAll("</em>", "_");
			// On convertit la formule mathématique en HTML avec Katex
			const stringWithLatex = window.katex.renderToString(
				mathInExpressionLatex,
				{
					displayMode: inlineMaths,
				},
			);
			string = string.replace(expressionLatex, stringWithLatex);
		}
	}
	return string;
}
