import { showOnlyThisElement } from "./showOnlyThisElement";
import { yaml } from "../processMarkdown/yaml";

const bodyElement = document.body;
const progressBarElement = document.getElementById("progressBar");

// Pour forcer le reload d'une iframe
function resetIframe(iframe) {
	const srcIframe = iframe.src;
	iframe.src = "";
	iframe.src = srcIframe;
}

// Fonction pour changer l'affichage en fonction des paramètres dans l'objet param (qui correspond aux paramètres dans l'URL)
export function changeDisplayBasedOnParams(param, markpageData) {
	let visibleElement;
	const sectionsTitle = markpageData[2];
	const numberOfSections = sectionsTitle.length;
	const subSectionsData = markpageData[3];
	let subSectionElement;
	if (param && Object.keys(param).length > 0) {
		const sectionID = param.sec
			? param.sec.toString().replace(/#.*/, "")
			: param.sec;
		const subSectionID = param.subsec
			? param.subsec.toString().replace(/#.*/, "")
			: param.subsec;
		if (subSectionID) {
			bodyElement.className = "displaySubSection";
			const sectionElement = document.getElementById("section-" + sectionID);
			subSectionElement = sectionElement.querySelector(
				"#subSection-" + subSectionID,
			);
			visibleElement = subSectionElement;
			showOnlyThisElement(sectionElement, "sections");
			showOnlyThisElement(subSectionElement, "subsections");
			// Gestion de la barre de progrès
			const sectionIDint = parseInt(sectionID);
			const numberOfSubsections = subSectionsData[sectionIDint - 1].length;
			const subSectionIDint = parseInt(param.subsec);
			progressBarElement.max = numberOfSubsections;
			progressBarElement.value = subSectionIDint;
			if (numberOfSubsections == 1) {
				progressBarElement.style.display = "none";
			} else {
				progressBarElement.style.display = "block";
			}
			// Dernière page : on cache le bouton "nextButton"
			const nextButton = document.getElementById("nextButton");
			if (
				subSectionIDint == numberOfSubsections &&
				sectionIDint == numberOfSections
			) {
				nextButton.style.display = "none";
			} else {
				nextButton.style.display = "block";
			}
		} else {
			if (sectionID) {
				bodyElement.className = "displaySection";
				const sectionElement = document.getElementById("section-" + sectionID);
				visibleElement = sectionElement;
				showOnlyThisElement(sectionElement, "sections");
				showOnlyThisElement(undefined, "subsections");
			} else {
				bodyElement.className = "displayHomepage";
			}
		}
		// Gestion des iframes
		const allIframes = document.querySelectorAll("iframe");
		// Reset de l'iframe dans la page sur laquelle on vient d'arriver
		if (visibleElement) {
			const iframesInElement = Array.from(allIframes).filter((iframe) =>
				visibleElement.contains(iframe),
			);
			for (const iframe of iframesInElement) {
				resetIframe(iframe);
			}
		}
		// Reste des iframes de type vidéo (sinon la vidéo peut continuer à être jouée alors qu'on est passé à une autre page)
		const iframesWithVideo = Array.from(allIframes).filter((iframe) =>
			iframe.classList.contains("isVideo"),
		);
		for (const iframe of iframesWithVideo) {
			resetIframe(iframe);
		}
		// Gestion du scroll vers l'élément cible
		if (
			subSectionElement &&
			window.innerWidth < 600 &&
			yaml.oneByOne == false
		) {
			subSectionElement.scrollIntoView({
				behavior: "smooth",
			});
		} else {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	} else {
		showOnlyThisElement(undefined, "sections");
		showOnlyThisElement(undefined, "subsections");
		bodyElement.className = "displayHomepage";
	}
}
