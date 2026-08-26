import { loadCSS } from "../../utils";
import { initMarkdownEditor } from "./editor";
import { updateContent } from "./helpers/updateContent";
import { resetYamlToDefault, yaml } from "../../processMarkdown/yaml";

function initEditorButtonEvents() {
	const openEditorButton = document.querySelector("button.openEditor");

	// S'il y a un bouton pour ouvrir l'éditeur, on lance l'éditeur quand on clique dessus
	if (openEditorButton) {
		openEditorButton.addEventListener("click", () => {
			initEditor();
		});
	}
}

function initEditor(md) {
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
		initMarkdownEditor(md);
	} else {
		editorWrapper.style.display = "block";
		const closeEditorButton = document.querySelector(".close-editor-button");
		closeEditorButton.style.display = "block";
		updateContent();
	}
}

let initialized = false;

export function checkInitEditor(params, markpageData) {
	// On peut lancer l'éditeur en cliquant sur un bouton
	initEditorButtonEvents();
	// On peut aussi lancer l'éditeur directement au démarrage de la page via l'URL avec `?editor`, si l'option est activée dans le YAML
	if (!initialized && yaml.editor && params.editor !== undefined) {
		const md = markpageData[4];
		initialized = true;
		initEditor(md);
	}
}
