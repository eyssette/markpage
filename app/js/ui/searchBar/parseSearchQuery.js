// Analyse une requête de recherche pour déterminer si elle est simple ou complexe
export function parseSearchQuery(query) {
	query = query.trim();

	// On vérifie si c'est une expression complexe
	const hasLogicalOperators = query.includes(" AND ") || query.includes(" OR ");
	const openParentheses = (query.match(/\(/g) || []).length;
	const hasOpenParentheses = openParentheses > 0;
	const closedParentheses = (query.match(/\)/g) || []).length;
	const hasPairedParentheses =
		hasOpenParentheses && openParentheses === closedParentheses;
	const isComplex =
		(hasLogicalOperators && !hasOpenParentheses) ||
		(hasLogicalOperators && hasPairedParentheses);

	// S'il n'y a pas d'opérateurs logiques, c'est une recherche simple
	if (!isComplex) {
		return {
			type: "simple",
			// Dans une recherche simple, les termes sont séparés par des espaces
			// Et on doit simplement chercher que tous les termes soient présents
			// Après avoir identifié chaque terme à rechercher, on remplace les "_" qui sont présents dans les boutons de tags par des espaces (car on a auparavant remplacé les espaces dans les tags en Markdown par des "_" dans les boutons de tags)
			terms: query
				.toLowerCase()
				.split(/\s+/)
				.map((t) => t.replaceAll("_", " ")),
		};
	}

	// Sinon, c'est une recherche complexe
	return {
		type: "complex",
		expression: query,
	};
}
