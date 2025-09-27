import { loadCSS } from "../../utils";
import { initMarkdownEditor } from "./editor";
import { updateContent } from "./helpers/updateContent";

export function initEditorButtonEvents() {
	const openEditorButton = document.querySelector("button.openEditor");
	if (openEditorButton) {
		openEditorButton.addEventListener("click", () => {
			// On teste si on est sur téléphone ou petit écran
			if (window.innerWidth < 600 || window.innerHeight < 500) {
				alert(
					"L'éditeur Markdown n'est pas disponible sur les petits écrans. Merci d'utiliser un ordinateur ou une tablette en mode paysage.",
				);
				return;
			}
			document.body.classList.add("editMode");
			const editorWrapper = document.querySelector(".editor-wrapper");
			loadCSS("/css/editor.min.css", "editor-style");
			if (editorWrapper === null) {
				initMarkdownEditor();
			} else {
				editorWrapper.style.display = "block";
				const closeEditorButton = document.querySelector(
					".close-editor-button",
				);
				closeEditorButton.style.display = "block";
				updateContent();
			}
		});
	}
}
