import { showOnlyThisElement } from "./showOnlyThisElement";
import { yaml } from "../processMarkdown/yaml";

const bodyElement = document.body;
const progressBarElement = document.getElementById("progressBar");

// Fonction pour changer l'affichage en fonction des paramètres dans l'objet param (qui correspond aux paramètres dans l'URL)
export function changeDisplayBasedOnParams(param, markpageData) {
	const sectionsTitle = markpageData[2];
	const numberOfSections = sectionsTitle.length;
	const subSectionsData = markpageData[3];
	let subSectionElement;
	if (param) {
		const sectionID = param.sec;
		const subSectionID = param.subsec;
		if (subSectionID) {
			bodyElement.className = "displaySubSection";
			const sectionElement = document.getElementById("section-" + sectionID);
			subSectionElement = sectionElement.querySelector(
				"#subSection-" + subSectionID,
			);
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
				showOnlyThisElement(sectionElement, "sections");
				showOnlyThisElement(undefined, "subsections");
			} else {
				bodyElement.className = "displayHomepage";
			}
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
		bodyElement.className = "displayHomepage";
	}
}
