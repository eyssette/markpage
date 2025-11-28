import { processYAML, yaml } from "../../../processMarkdown/yaml";
import { parseMarkdown } from "../../../processMarkdown/parseMarkdown";
import { createMarkpage } from "../../createMarkpage";

// Fonction debounce pour gérer l'update du contenu avec un délai
function debounce(func, wait) {
	let timeout;
	return function (...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

// Fonction pour mettre à jour les cartes
export async function updateContent() {
	const editorElement = document.querySelector(".editor");
	const editorContent =
		editorElement && editorElement.textContent ? editorElement.textContent : "";
	const md = editorContent ? await processYAML(editorContent) : "";
	const markpageData = md.trim() ? parseMarkdown(md, yaml) : null;
	return markpageData ? createMarkpage(markpageData) : null;
}

export function eventKeyUpDebounceUpdateContent() {
	// Utiliser debounce pour appeler updateContent avec un délai afin d'éviter un lag dans le cas d'un document long
	const editorElement = document.querySelector(".editor");
	const debouncedUpdateContent = debounce(async () => {
		await updateContent();
	}, 600);
	editorElement.addEventListener("keyup", () => {
		debouncedUpdateContent();
	});
}
