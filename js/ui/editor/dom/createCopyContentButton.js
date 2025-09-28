export function createCopyContentButton(editorWrapper, editor) {
	const button = document.createElement("button");
	button.className = "copy-content-button";
	button.title = "Copier le contenu de l'éditeur";
	button.innerHTML = "Copier le contenu";

	button.addEventListener("click", () => {
		const content = editor.textContent;
		if (content) {
			navigator.clipboard.writeText(content).catch((err) => {
				console.error("Could not copy text: ", err);
			});
		}
	});

	editorWrapper.appendChild(button);
}
