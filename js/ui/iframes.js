import { yaml } from "../processMarkdown/yaml";

export function convertIframeHTMLelementsToIframeCodes(html) {
	// On convertit dans le HTML (en texte) les éléments HTML iframe en un élément div qui contient le code de l'iframe dans un attribut data-iframe : [iframe src="url" …]
	return html.replace(
		/<iframe([\s\S]*?)>([\s\S]*?)<\/iframe>/gi,
		function (match, attributes) {
			return (
				'<div class="iframeCode" data-iframe="' +
				attributes.replace(/"/g, "&quot;") +
				'"></div>'
			);
		},
	);
}

export function convertIframeCodesToIframeHTMLElements(element, options) {
	// Option pour faire la conversion avec un délai entre chaque conversion, pour éviter les problèmes de performance quand il y a beaucoup d'iframes à convertir
	const delay = options && options.delay ? 250 : 10;
	const iframes = element.querySelectorAll(
		'[data-iframe]:not([data-iframe=""])',
	);
	iframes.forEach((iframe, index) => {
		// On fait la conversion, avec un délai entre chaque conversion, pour éviter les problèmes de performance quand il y a beaucoup d'iframes à convertir
		setTimeout(() => {
			const iframeCode = iframe.getAttribute("data-iframe");
			iframe.innerHTML = `<iframe ${iframeCode}></iframe>`;
		}, delay * index);
	});
}

// Si on est sur un pad, on ne fait la conversion des codes Iframes qu'une seule fois au début
let alreadyConvertedIframes = false;
export function handleIframes(visibleElement, previousSection, options) {
	const isPad = options && options.isPad;
	if (isPad) {
		if (!alreadyConvertedIframes) {
			// En mode Pad, on convertit tous les codes d'iframe en iframes réelles dès le début, mais avec un délai entre chaque conversion pour éviter les problèmes de performance quand il y a beaucoup d'iframes à convertir
			// Si on utilise des mathématiques, on ne convertit pas les iframes tout de suite, mais seulement après avoir converti les expressions en Latex
			if (yaml && yaml.maths) return;
			convertIframeCodesToIframeHTMLElements(document.body, { delay: true });
			alreadyConvertedIframes = true;
		}
	} else {
		convertIframeCodesToIframeHTMLElements(visibleElement, { delay: false });
		// En mode Markpage, si on passe à une autre section ou sous-section, on reset les iframes de la section précédente (en remettant le code de l'iframe à la place de l'iframe réelle) afin que la vidéo ne continue pas en arrière-plan.
		if (previousSection != visibleElement) {
			const previousIframes = previousSection.querySelectorAll(
				"div[data-iframe], iframe",
			);
			previousIframes.forEach((iframe) => {
				iframe.parentElement.innerHTML = convertIframeHTMLelementsToIframeCodes(
					iframe.parentElement.innerHTML,
				);
			});
		}
	}
}
