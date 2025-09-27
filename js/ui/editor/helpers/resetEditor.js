import { initialConfig } from "../../../processMarkdown/helpers/initialConfig";
import { updateContent } from "./updateContent";
import { getDefaultMD } from "./defaultMD";

export function resetEditor(jar, editorWrapper, closeEditorButton) {
	document.body.classList.remove("editMode");
	closeEditorButton.style.display = "none";
	editorWrapper.style.display = "none";

	// const footer = document.querySelector("footer");
	// footer.style.display = "block";
	// footer.style.top = "25vh";

	const style = document.querySelector("style#customCSS");
	jar.updateCode(initialConfig.md);
	updateContent();
	const defaultMD = getDefaultMD();
	jar.updateCode(defaultMD);
	if (style) style.remove();
}
