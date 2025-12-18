// Fonction pour construire la requête avec la logique AND/OR
export function buildTagQuery(buttons) {
	const activeButtons = Array.from(buttons).filter((btn) =>
		btn.classList.contains("active"),
	);

	if (activeButtons.length === 0) {
		return "";
	}

	// Grouper les boutons par leur conteneur parent avec data-logic
	const groups = new Map();

	activeButtons.forEach((button) => {
		const buttonContent = button.textContent.trim().replaceAll(" ", "_");

		// Trouver le parent direct avec data-logic
		let parent = button.parentElement;
		while (parent && !parent.hasAttribute("data-logic")) {
			parent = parent.parentElement;
		}

		if (parent) {
			const logic = parent.getAttribute("data-logic");
			const parentId = parent; // Utiliser l'élément lui-même comme clé

			if (!groups.has(parentId)) {
				groups.set(parentId, {
					logic: logic,
					terms: [],
					parent: parent,
				});
			}
			groups.get(parentId).terms.push(buttonContent);
		} else {
			// Si pas de parent avec data-logic, traiter individuellement
			groups.set(button, {
				logic: null,
				terms: [buttonContent],
				parent: null,
			});
		}
	});

	// Construire la requête hiérarchiquement
	function buildFromElement(element) {
		const logic = element.getAttribute("data-logic");
		const childGroups = [];

		// Trouver tous les enfants directs avec data-logic
		const childElements = Array.from(element.children).filter((child) =>
			child.hasAttribute("data-logic"),
		);

		if (childElements.length > 0) {
			// Traiter récursivement les enfants
			childElements.forEach((child) => {
				const childQuery = buildFromElement(child);
				if (childQuery) {
					childGroups.push(childQuery);
				}
			});
		} else {
			// Pas d'enfants avec data-logic, récupérer les boutons actifs directs
			const directButtons = Array.from(
				element.querySelectorAll("button"),
			).filter(
				(btn) =>
					btn.classList.contains("active") &&
					btn.closest("[data-logic]") === element,
			);

			directButtons.forEach((btn) => {
				childGroups.push(btn.textContent.trim().replaceAll(" ", "_"));
			});
		}

		if (childGroups.length === 0) {
			return "";
		}

		if (childGroups.length === 1) {
			return childGroups[0];
		}

		return `(${childGroups.join(` ${logic} `)})`;
	}

	// Trouver l'élément racine avec data-logic
	const rootElements = Array.from(
		document.querySelectorAll("#initialMessage [data-logic]"),
	).filter((el) => {
		// Trouver les éléments qui ne sont pas enfants d'autres éléments data-logic
		let parent = el.parentElement;
		while (parent && parent.id !== "initialMessage") {
			if (parent.hasAttribute("data-logic")) {
				return false;
			}
			parent = parent.parentElement;
		}
		return true;
	});

	const queries = rootElements
		.map((root) => buildFromElement(root))
		.filter(Boolean);

	if (queries.length === 0) {
		return activeButtons
			.map((btn) => btn.textContent.trim().replaceAll(" ", "_"))
			.join(" ");
	}

	return queries.length === 1 ? queries[0] : queries.join(" ");
}
