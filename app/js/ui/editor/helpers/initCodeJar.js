import { CodeJar } from "../../../externals/codejar.js";
import { highlightCode } from "./highlightCode.js";
import { optionsEditor } from "./optionsEditor.js";
import { updateContent } from "./updateContent.js";

export function initJar(editor, md = "") {
	const jar = CodeJar(editor, highlightCode, optionsEditor);
	jar.updateCode(md);
	updateContent();
	return jar;
}
