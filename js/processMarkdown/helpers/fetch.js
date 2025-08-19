import { handleURL } from "../../utils";

export async function fetchSource(source) {
	const response = await fetch(source);
	if (!response.ok) {
		throw new Error(`Erreur lors de la récupération du fichier : ${source}`);
	}
	return await response.text();
}

// Pour récupérer le contenu de plusieurs fichiers à partir d'un tableau d'URLS
export async function fetchFromMultipleSources(urls) {
	const contents = await Promise.all(
		urls.map((url) => fetchSource(handleURL(url))),
	);
	return contents.join("\n");
}
