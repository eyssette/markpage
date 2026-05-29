import { handleURL } from "../../utils";

export async function fetchSource(source) {
	const response = await fetch(source);
	if (response.status === 404) {
		console.warn(`Fichier non trouvé (404) : ${source} — ignoré.`);
		return "";
	}
	if (!response.ok) {
		throw new Error(`Erreur lors de la récupération du fichier : ${source}`);
	}
	if (source.includes("docs.numerique.gouv.fr/")) {
		// Cas particulier des fichiers hébergés sur Docs de La Suite numérique
		// Le contenu est un JSON qu'il faut traiter pour en extraire le Markdown
		const content = await response.json().then((data) => {
			let markdownContent = `${data.content}`.replaceAll("***", "---");
			const hasH1titleRegex = /^#\s+(.+)$/m;
			const hasH1titleInMarkdownContent = hasH1titleRegex.test(markdownContent);
			if (!hasH1titleInMarkdownContent && data.title) {
				// Si le Markdown ne contient pas de titre H1, on en ajoute un à partir du titre du document
				markdownContent = `# ${data.title}\n\n${markdownContent}`;
			}
			return markdownContent;
		});
		return content;
	}
	return await response.text();
}

// Pour récupérer le contenu de plusieurs fichiers à partir d'un tableau d'URLS
export async function fetchFromMultipleSources(urls) {
	const contents = await Promise.all(
		urls.map((url) => {
			const { url: resolvedUrl } = handleURL(url);
			return fetchSource(resolvedUrl);
		}),
	);
	return contents.join("\n");
}
