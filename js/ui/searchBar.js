import { yaml } from "../processMarkdown/yaml";

// Gestion de la searchBar
export function searchBar(hash, markpageData) {
	const sectionsTitle = markpageData[2];
	const subSectionsData = markpageData[3];
	const searchbarElement = document.getElementById("searchBar");
	if (yaml.searchbar) {
		// Par défaut, on gère la searchbar, mais on peut décider dans les paramètres YAML de ne pas avoir de searchbar
		searchbarElement.style.display = "block";
		function searchText() {
			let sectionsResults = [];
			let subSectionsResults = [];
			const inputText = document
				.getElementById("searchInput")
				.value.toLowerCase();
			if (inputText.length > 2) {
				for (let i = 0; i < subSectionsData.length; i++) {
					// Recherche dans le titre de chaque section + le contenu de chaque section
					const textSection =
						sectionsTitle[i].toString().toLowerCase() +
						subSectionsData[i].toString().toLowerCase();
					if (textSection.indexOf(inputText) > -1) {
						// On a trouvé le texte dans la section
						if (subSectionsData[i].length > 1) {
							// S'il y a des sous-sections, on affine la recherche dans chaque sous-section
							for (let j = 0; j < subSectionsData[i].length; j++) {
								// recherche du texte dans le contenu de chaque sous-section
								const textSubSection = subSectionsData[i][j]
									.toString()
									.toLowerCase();
								if (textSubSection.indexOf(inputText) > -1) {
									subSectionsResults.push([i, j]);
								}
							}
						} else {
							// Sinon, on indique juste comme résultat la section correspondante
							sectionsResults.push(i);
						}
					}
				}
			}
			const numberResultsSection = sectionsResults.length;
			const numberResultsSubSection = subSectionsResults.length;
			const numberResults = numberResultsSection + numberResultsSubSection;
			if (!yaml.pad) {
				// Si on n'est pas dans le mode pad : on affiche les résultats en dessous de la barre de recherche
				const displayResultsElement = document.getElementById("displayResults");
				let displayResultsHTML = "";
				if (numberResults > 0) {
					displayResultsHTML = "<ul>";
					if (numberResultsSection > 0) {
						for (const indexSection of sectionsResults) {
							displayResultsHTML +=
								'<li><a href="?sec=' +
								(indexSection + 1) +
								"#" +
								hash +
								'">' +
								sectionsTitle[indexSection] +
								"</a></li>";
						}
					}
					if (numberResultsSubSection > 0) {
						for (const result of subSectionsResults) {
							const indexSection = result[0];
							const indexSubSection = result[1];
							const sectionElement = document.getElementById(
								"section-" + (indexSection + 1),
							);
							const subSectionElement = sectionElement.querySelector(
								"#subSection-" + (indexSubSection + 1),
							);
							const subSectionTitle =
								subSectionElement.querySelector("h3 a").innerHTML;
							displayResultsHTML +=
								'<li><a href="?sec=' +
								(indexSection + 1) +
								"&subsec=" +
								(indexSubSection + 1) +
								"#" +
								hash +
								'">' +
								subSectionTitle +
								"</a></li>";
						}
					}
					displayResultsHTML += "</ul>";
				}
				displayResultsElement.innerHTML = displayResultsHTML;
			} else {
				// Si on est dans le mode pad, on affiche seulement les capsules qui correspondent aux résultats
				let hasResults = false;
				//Reset de la classe pour afficher les résultats
				const sections = document.querySelectorAll("section");
				sections.forEach((section) => {
					section.classList.remove("isResultFromSearch");
					section.classList.remove("hasResultFromSearch");
					section.classList.remove("hide");
				});
				if (sectionsResults.length > 0) {
					hasResults = true;
					sectionsResults.forEach((sectionResult) => {
						const sectionId = sectionResult + 1;
						const activeSection = document.querySelector(
							`#section-${sectionId}`,
						);
						activeSection.classList.add("isResultFromSearch");
					});
				}
				if (subSectionsResults.length > 0) {
					hasResults = true;
					subSectionsResults.forEach((subSectionResult) => {
						const sectionId = subSectionResult[0] + 1;
						const subSectionId = subSectionResult[1] + 1;
						const activeSection = document.querySelector(
							`#section-${sectionId}`,
						);
						const activeSubSection = activeSection.querySelector(
							`#subSection-${subSectionId}`,
						);
						activeSection.classList.add("hasResultFromSearch");
						activeSubSection.classList.add("isResultFromSearch");
					});
				}
				if (hasResults) {
					sections.forEach((section) => {
						if (
							section.classList.contains("isResultFromSearch") ||
							section.classList.contains("hasResultFromSearch")
						) {
							section.classList.remove("hide");
						} else {
							section.classList.add("hide");
						}
					});
				}
			}
		}

		// Gestion de l'input pour faire une recherche dans le contenu
		document
			.getElementById("searchInput")
			.addEventListener("input", searchText);
		document
			.getElementById("searchInput")
			.addEventListener("keydown", function (event) {
				// Si on appuie sur Escape, on sort de la barre de recherche
				if (event.key === "Escape" || event.keyCode === 27) {
					// on réinitialise le champ d'entrée avec une chaîne vide
					document.getElementById("searchInput").value = "";
					searchText();
				}
			});
	} else {
		// Si on ne veut pas de searchbar
		searchbarElement.remove();
	}
}
