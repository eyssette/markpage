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
			// Suppression du paramètre "editor" dans l'URL s'il existe
			// (permet de sortir du mode édition si on y est arrivé via une URL contenant le paramètre "editor")
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.has("editor")) {
				urlParams.delete("editor");
				window.history.replaceState(
					{},
					"",
					`${window.location.pathname}?${urlParams}`,
				);
			}
			resetEditor(jar, editorWrapper, button);
		}
	});

	editorWrapper.appendChild(button);
}
