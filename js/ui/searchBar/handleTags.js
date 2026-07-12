import { buildTagQuery } from "./buildTagQuery";

export function handleTags() {
	const searchInput = document.querySelector("#searchInput");
	const buttons = document.querySelectorAll("#initialMessage button");
	// Si on clique sur un bouton de filtre
	buttons.forEach((button) => {
		button.addEventListener("click", function () {
			// Toggle l'état actif du bouton
			this.classList.toggle("active");

			// On récupère tous les boutons actifs, car certains boutons ont peut-être été créés si des éléments SELECT ont été utilisés, et on veut les prendre en compte dans la requête
			const allButtons = document.querySelectorAll("#initialMessage button");
			// On construit la requête complète
			const query = buildTagQuery(allButtons);

			// On actualise le champ de recherche et on déclenche la recherche
			searchInput.value = query;
			searchInput.dispatchEvent(new Event("input", { bubbles: true }));
		});
	});
	// Réciproquement : si on édite le champ de recherche et qu'on supprime ou qu'on ajoute un filtre,
	// alors le bouton correspondant doit avoir ou perdre le statut "active"
	searchInput.addEventListener("input", function () {
		const searchValue = this.value.trim();

		// Extraire tous les termes de la requête (en ignorant les parenthèses et opérateurs logiques)
		// On retire les parenthèses, AND, OR et on split sur les espaces
		const cleanedValue = searchValue
			.replace(/\(/g, " ")
			.replace(/\)/g, " ")
			.replace(/\bAND\b/g, " ")
			.replace(/\bOR\b/g, " ");

		const words = cleanedValue.trim().split(/\s+/).filter(Boolean);

		const allButtons = document.querySelectorAll("#initialMessage button");
		allButtons.forEach((button) => {
			const buttonText = button.textContent.trim().replaceAll(" ", "_");
			if (words.includes(buttonText)) {
				button.classList.add("active");
			} else {
				button.classList.remove("active");
			}
		});
	});
}
