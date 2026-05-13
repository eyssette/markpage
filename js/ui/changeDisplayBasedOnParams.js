import { showOnlyThisElement } from "./showOnlyThisElement";
import { yaml } from "../processMarkdown/yaml";
import { handleIframes } from "./iframes";

const bodyElement = document.body;
const progressBarElement = document.getElementById("progressBar");
const initialMessageElement = document.getElementById("initialMessage");
let previousSection = initialMessageElement;

// Fonction pour changer l'affichage en fonction des paramètres dans l'objet param (qui correspond aux paramètres dans l'URL)
export function changeDisplayBasedOnParams(param, markpageData) {
	let visibleElement = initialMessageElement;
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
			bodyElement.classList.remove("displayHomepage");
			bodyElement.classList.remove("displaySection");
			bodyElement.classList.add("displaySubSection");
			const sectionElement = document.getElementById("section-" + sectionID);
			subSectionElement = sectionElement.querySelector(
				".subSection-" + subSectionID,
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
				bodyElement.classList.remove("displayHomepage");
				bodyElement.classList.remove("displaySubSection");
				bodyElement.classList.add("displaySection");
				const sectionElement = document.getElementById("section-" + sectionID);
				visibleElement = sectionElement;
				showOnlyThisElement(sectionElement, "sections");
				showOnlyThisElement(undefined, "subsections");
			} else {
				if (yaml.pad) {
					bodyElement.classList.remove("displayHomepage");
					bodyElement.classList.remove("displaySection");
					bodyElement.classList.add("displaySubSection");
					visibleElement = document.body;
				} else {
					bodyElement.classList.remove("displaySection");
					bodyElement.classList.remove("displaySubSection");
					bodyElement.classList.add("displayHomepage");
					visibleElement = initialMessageElement;
				}
			}
		}

		// Gestion du scroll vers l'élément cible
		if (
			subSectionElement &&
			((window.innerWidth < 600 && yaml.oneByOne == false) || yaml.pad)
		) {
			if (
				(yaml.padScroll &&
					document.body.classList.contains("adjustHeightColumns")) ||
				yaml.lightpad
			) {
				const isModeLightpadNoColums =
					document.body.classList.contains("noColumns");
				let scrollableElement = isModeLightpadNoColums
					? document.body.querySelector("#content")
					: document.body.querySelector("#innerBox");
				let scrollToElement = isModeLightpadNoColums
					? subSectionElement
					: subSectionElement.parentNode;
				const offsetWindow = window.innerWidth / 3;
				window.scrollTo({
					top: 0,
					behavior: "instant",
				});
				scrollableElement.scrollTo({
					left: scrollToElement.offsetLeft - offsetWindow,
					behavior: "smooth",
				});
				setTimeout(() => {
					subSectionElement.parentNode.scrollTop =
						subSectionElement.offsetTop - 150;
				}, 100);
			} else {
				subSectionElement.scrollIntoView({
					behavior: "smooth",
				});
			}
		} else {
			const isFoonoteLink = window.location.href.includes("?footnote");
			if (!isFoonoteLink) {
				window.scrollTo({
					top: 0,
					behavior: "smooth",
				});
			}
		}
	} else {
		showOnlyThisElement(undefined, "sections");
		showOnlyThisElement(undefined, "subsections");
		if (yaml.pad) {
			bodyElement.classList.remove("displayHomepage");
			bodyElement.classList.remove("displaySection");
			bodyElement.classList.add("displaySubSection");
		} else {
			bodyElement.classList.remove("displaySection");
			bodyElement.classList.remove("displaySubSection");
			bodyElement.classList.add("displayHomepage");
		}
		const scrollTopBehavior = yaml.pad ? "instant" : "smooth";
		window.scrollTo({
			top: 0,
			behavior: scrollTopBehavior,
		});
	}
	// Gestion des iframes
	handleIframes(visibleElement, previousSection, { isPad: yaml && yaml.pad });
	previousSection = visibleElement;
}
