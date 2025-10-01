import { confirmCloseEditorMessage } from "./messages.js";

let handleWindowClose = null;

export function eventCloseWindow(enable) {
	if (enable) {
		if (!handleWindowClose) {
			handleWindowClose = function (event) {
				event.returnValue = confirmCloseEditorMessage;
				return confirmCloseEditorMessage;
			};
			window.addEventListener("beforeunload", handleWindowClose);
		}
	} else {
		if (handleWindowClose) {
			window.removeEventListener("beforeunload", handleWindowClose);
			handleWindowClose = null;
		}
	}
}
