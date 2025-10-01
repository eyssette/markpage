import { createEditor } from "./dom/createEditor.js";
import { createCloseButton } from "./dom/createCloseButton.js";
import { initJar } from "./helpers/initCodeJar.js";
import { initKeyboardEvents } from "./events/keyboard.js";
import { getDefaultMD } from "./helpers/defaultMD.js";
import { createCopyContentButton } from "./dom/createCopyContentButton.js";
import { eventCloseWindow } from "./events/closeWindow.js";

export function initMarkdownEditor(md = "") {
	const { editorWrapper, editor } = createEditor();
	document.body.insertBefore(editorWrapper, document.body.firstChild);

	setTimeout(() => {
		const defaultMD = getDefaultMD();
		const jar = initJar(editor, md ? md : defaultMD);
		createCloseButton(editorWrapper, jar);
		createCopyContentButton(editorWrapper, editor);
		initKeyboardEvents();
		eventCloseWindow(true);
	}, 100);
}
