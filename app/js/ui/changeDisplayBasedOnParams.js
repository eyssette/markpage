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
		const sectionID = param.sec ? param.sec.toString().replace(/#.*/, "") : 0;
		const subSectionID = param.subsec
			? param.subsec.toString().replace(/#.*/, "")
			: 1;
		// on pourrait aussi avoir un paramètre pour distinguer à l'intérieur d'une sous-section, les différentes parties / titres
		const subSectionPartID = param.part
			? param.part.toString().replace(/#.*/, "")
			: "";
		// On supprime certains paramètres de navigation de l'objet param une fois qu'on les a utilisés pour déterminer l'affichage
		delete param.part;
		delete param.groupDisplay;
		delete param.subpart;

		if (sectionID && subSectionID) {
			bodyElement.classList.remove("displayHomepage");
			bodyElement.classList.remove("displaySection");
			bodyElement.classList.add("displaySubSection");
			const sectionElement = document.getElementById("section-" + sectionID);
			subSectionElement = sectionElement.querySelector(
				".subSection-" + subSectionID,
			);
			visibleElement = subSectionElement || sectionElement;
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

		// Si on a un paramètre de partie d'une sous-section, on scrolle vers l'élément correspondant à cette partie (qui est le n-ième titre "h4 ou h5")
		let partElement;
		if (subSectionElement && subSectionPartID) {
			const partIndex = parseInt(subSectionPartID) - 1;
			const subsectionHeadings =
				subSectionElement.querySelectorAll("h4, h5, h6");
			if (
				subsectionHeadings.length > 0 &&
				partIndex < subsectionHeadings.length
			) {
				partElement = subsectionHeadings[partIndex];
			}
		}
		if (
			subSectionElement &&
			((window.innerWidth < 600 && yaml.oneByOne == false) ||
				yaml.pad ||
				partElement)
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
				if (partElement) {
					// On scrolle pour que l'élément partElement soit visible tout en haut de la fenêtre
					window.scrollTo({
						top: partElement.offsetTop - 20,
						behavior: "smooth",
					});
					// On met en surbrillance l'élément partElement de manière temporaire pour indiquer à l'utilisateur où il se trouve dans la sous-section
					partElement.classList.add("highlighted");
					setTimeout(() => {
						partElement.classList.remove("highlighted");
					}, 2000);
				} else {
					subSectionElement.scrollIntoView({
						behavior: "smooth",
					});
				}
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
