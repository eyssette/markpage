import { createEditor } from "./dom/createEditor.js";
import { createCloseButton } from "./dom/createCloseButton.js";
import { initJar } from "./helpers/initCodeJar.js";
import { initKeyboardEvents } from "./events/keyboard.js";
import { getDefaultMD } from "./helpers/defaultMD.js";

export function initMarkdownEditor(md = "") {
	const { editorWrapper, editor } = createEditor();
	document.body.insertBefore(editorWrapper, document.body.firstChild);

	setTimeout(() => {
		//const footer = document.querySelector("footer");
		//footer.style.top = "50vh";
		const defaultMD = getDefaultMD();
		const jar = initJar(editor, md ? md : defaultMD);
		createCloseButton(editorWrapper, jar);
		initKeyboardEvents();
	}, 100);
}
