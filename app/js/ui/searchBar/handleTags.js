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
}
