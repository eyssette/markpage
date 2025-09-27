import { resetEditor } from "../helpers/resetEditor.js";

export function createCloseButton(editorWrapper, jar) {
	const button = document.createElement("button");
	button.className = "close-editor-button";
	button.title = "Fermer l'éditeur Markdown";
	button.innerHTML = "Fermer l'éditeur";

	button.addEventListener("click", () => {
		const confirmClose = confirm(
			"Voulez-vous vraiment fermer l'éditeur Markdown ?\n\n" +
				"Vos modifications seront perdues si vous n'avez pas copié le contenu.",
		);
		if (confirmClose) {
			resetEditor(jar, editorWrapper, button);
		}
	});

	editorWrapper.appendChild(button);
}
