export function createEditor() {
	const editorWrapper = document.createElement("div");
	editorWrapper.className = "editor-wrapper";

	const editor = document.createElement("div");
	editor.className = "editor";
	editor.setAttribute(
		"data-placeholder",
		"Éditez le Markdown ici pour créer votre propre site!",
	);

	editorWrapper.appendChild(editor);
	return { editorWrapper, editor };
}
