import { resetEditor } from "../helpers/resetEditor";
import { confirmCloseEditorMessage } from "./messages";
import { eventCloseWindow } from "./closeWindow";

export function eventClickCloseButton(button, jar, editorWrapper) {
	button.addEventListener("click", () => {
		const confirmClose = confirm(confirmCloseEditorMessage);
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
			eventCloseWindow(false);
		}
	});
}

export function eventClickCopyContentButton(button, editor) {
	button.addEventListener("click", () => {
		const content = editor.textContent;
		if (content) {
			navigator.clipboard.writeText(content).catch((err) => {
				console.error("Could not copy text: ", err);
			});
		}
	});
}
