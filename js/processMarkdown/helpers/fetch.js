export async function fetchSource(source) {
	const response = await fetch(source);
	if (!response.ok) {
		throw new Error(`Erreur lors de la récupération du fichier : ${source}`);
	}
	return await response.text();
}
