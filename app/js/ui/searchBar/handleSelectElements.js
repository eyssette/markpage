import { buildTagQuery } from "./buildTagQuery";

export function handleSelectElements() {
	const searchInput = document.querySelector("#searchInput");
	const selectElements = document.querySelectorAll("#initialMessage select");
	// Si on change la valeur d'un select
	selectElements.forEach((select) => {
		select.addEventListener("change", function () {
			// On supprime d'abord les boutons créés précédemment pour les select et qui ne sont pas sélectionnés, afin de ne pas les prendre en compte dans la requête
			const existingButtons = document.querySelectorAll(
				"#initialMessage button",
			);
			existingButtons.forEach((button) => {
				const isNotSelected = !Array.from(selectElements).some(
					(sel) => sel.value === button.textContent,
				);
				if (isNotSelected && button.classList.contains("select-button")) {
					button.remove();
				}
			});

			// Le choix d'une option est identique au clic sur un bouton, donc on peut réutiliser la fonction buildTagQuery
			// On va donc créer un tableau de boutons fictifs pour chaque select, avec la valeur sélectionnée comme texte du bouton
			const values = Array.from(selectElements).map((sel) => sel.value);
			values.forEach((value) => {
				// Si la valeur n'est pas déjà représentée par un bouton, on crée un bouton fictif
				const existingButton = Array.from(
					document.querySelectorAll("#initialMessage button"),
				).find((button) => button.textContent === value);
				if (existingButton) {
					return existingButton;
				}
				const button = document.createElement("button");
				button.textContent = value;
				button.classList.add("active");
				button.classList.add("select-button");
				// On l'ajoute au DOM dans #initialMessage pour que buildTagQuery puisse le prendre en compte, mais on cache le bouton
				button.style.display = "none";
				document.querySelector("#initialMessage").appendChild(button);
			});

			// On construit la requête à partir de ces boutons fictifs, mais en prenant aussi en compte les boutons réels déjà présents dans le DOM
			const allButtons = document.querySelectorAll("#initialMessage button");
			const query = buildTagQuery(allButtons);

			// On actualise le champ de recherche et on déclenche la recherche
			searchInput.value = query;
			searchInput.dispatchEvent(new Event("input", { bubbles: true }));
		});
	});
}
