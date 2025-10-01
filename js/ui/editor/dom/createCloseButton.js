import { eventClickCloseButton } from "../events/clickButtons";

export function createCloseButton(editorWrapper, jar) {
	const button = document.createElement("button");
	button.className = "close-editor-button";
	button.title = "Fermer l'éditeur Markdown";
	button.innerHTML = "Fermer l'éditeur";
	editorWrapper.appendChild(button);
	eventClickCloseButton(button, jar, editorWrapper);
}
