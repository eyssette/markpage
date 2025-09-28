import { loadCSS } from "../../utils";
import { initMarkdownEditor } from "./editor";
import { updateContent } from "./helpers/updateContent";
import { resetYamlToDefault } from "../../processMarkdown/yaml";

export function initEditorButtonEvents(params) {
	const openEditorButton = document.querySelector("button.openEditor");
	if (openEditorButton) {
		// On lance l'éditeur si on clique sur le bouton "ouvrir l'éditeur"
		openEditorButton.addEventListener("click", () => {
			initEditor();
		});
		// On lance l'éditeur s'il y a le paramètre "editor" dans l'URL
		if (params.editor !== undefined) {
			initEditor();
		}
	}
}

function initEditor() {
	// On teste si on est sur téléphone ou petit écran
	if (window.innerWidth < 600 || window.innerHeight < 500) {
		alert(
			"L'éditeur Markdown n'est pas disponible sur les petits écrans. Merci d'utiliser un ordinateur ou une tablette en mode paysage.",
		);
		return;
	}
	resetYamlToDefault();
	document.body.classList.add("editMode");
	const editorWrapper = document.querySelector(".editor-wrapper");
	loadCSS("/css/editor.min.css", "editor");
	if (editorWrapper === null) {
		initMarkdownEditor();
	} else {
		editorWrapper.style.display = "block";
		const closeEditorButton = document.querySelector(".close-editor-button");
		closeEditorButton.style.display = "block";
		updateContent();
	}
}
