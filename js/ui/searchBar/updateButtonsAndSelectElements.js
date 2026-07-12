export function updateButtonsAndSelectElements(inputText) {
	const searchValue = inputText.trim();

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

	const selectElements = document.querySelectorAll("#initialMessage select");
	selectElements.forEach((select) => {
		const options = select.options;
		for (let i = 0; i < options.length; i++) {
			const optionText = options[i].textContent.trim().replaceAll(" ", "_");
			if (words.includes(optionText)) {
				options[i].selected = true;
			} else {
				options[i].selected = false;
			}
		}
	});
}
