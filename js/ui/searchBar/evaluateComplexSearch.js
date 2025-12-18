// Tokenizer : découpe l'expression en tokens
function tokenize(expression) {
	const tokens = [];
	let current = "";
	let i = 0;

	while (i < expression.length) {
		const char = expression[i];

		if (char === "(") {
			if (current.trim()) {
				tokens.push({ type: "TERM", value: current.trim() });
				current = "";
			}
			tokens.push({ type: "LPAREN", value: "(" });
			i++;
		} else if (char === ")") {
			if (current.trim()) {
				tokens.push({ type: "TERM", value: current.trim() });
				current = "";
			}
			tokens.push({ type: "RPAREN", value: ")" });
			i++;
		} else if (expression.substr(i, 4) === " AND") {
			if (current.trim()) {
				tokens.push({ type: "TERM", value: current.trim() });
				current = "";
			}
			tokens.push({ type: "AND", value: "and" });
			i += 4;
		} else if (expression.substr(i, 3) === " OR") {
			if (current.trim()) {
				tokens.push({ type: "TERM", value: current.trim() });
				current = "";
			}
			tokens.push({ type: "OR", value: "or" });
			i += 3;
		} else {
			current += char;
			i++;
		}
	}

	if (current.trim()) {
		tokens.push({ type: "TERM", value: current.trim() });
	}

	return tokens;
}

// Parser récursif descendant (sans classe)
function createParser(tokens) {
	let pos = 0;

	function current() {
		return tokens[pos];
	}

	function consume() {
		return tokens[pos++];
	}

	// Expression OR (priorité la plus basse)
	function parseOrExpression() {
		let left = parseAndExpression();

		while (current() && current().type === "OR") {
			consume(); // consommer OR
			const right = parseAndExpression();
			left = { type: "OR", left, right };
		}

		return left;
	}

	// Expression AND (priorité moyenne)
	function parseAndExpression() {
		let left = parsePrimary();

		while (current() && current().type === "AND") {
			consume(); // consommer AND
			const right = parsePrimary();
			left = { type: "AND", left, right };
		}

		return left;
	}

	// Expression primaire (terme ou parenthèses)
	function parsePrimary() {
		const token = current();

		if (!token) {
			throw new Error("Expression incomplète");
		}

		if (token.type === "LPAREN") {
			consume(); // consommer '('
			const expr = parseOrExpression(); // recommencer du plus haut niveau
			if (!current() || current().type !== "RPAREN") {
				throw new Error("Parenthèse fermante manquante");
			}
			consume(); // consommer ')'
			return expr;
		}

		if (token.type === "TERM") {
			consume();
			return { type: "TERM", value: token.value };
		}

		throw new Error("Token inattendu: " + token.type);
	}

	return {
		parse: () => parseOrExpression(),
	};
}

// Évaluer l'arbre syntaxique
function evaluateAST(node, text) {
	if (node.type === "TERM") {
		const term = node.value.replaceAll("_", " ").toLowerCase();
		return text.includes(term);
	}

	if (node.type === "AND") {
		return evaluateAST(node.left, text) && evaluateAST(node.right, text);
	}

	if (node.type === "OR") {
		return evaluateAST(node.left, text) || evaluateAST(node.right, text);
	}

	throw new Error("Type de nœud inconnu: " + node.type);
}

// Fonction pour évaluer une expression booléenne sur un texte
export function evaluateComplexExpression(expression, text) {
	try {
		const tokens = tokenize(expression);
		const parser = createParser(tokens);
		const ast = parser.parse();
		return evaluateAST(ast, text);
	} catch (e) {
		console.error("Erreur de parsing:", e.message);
		// En cas d'erreur, faire une recherche simple
		return expression
			.split(/\s+/)
			.every((term) => text.includes(term.replaceAll("_", " ")));
	}
}
