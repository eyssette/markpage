import { eventClickCopyContentButton } from "../events/clickButtons";

export function createCopyContentButton(editorWrapper, editor) {
	const button = document.createElement("button");
	button.className = "copy-content-button";
	button.title = "Copier le contenu de l'éditeur";
	button.innerHTML = "Copier le contenu";
	editorWrapper.appendChild(button);
	eventClickCopyContentButton(button, editor);
}
