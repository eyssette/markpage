import { yaml } from "../processMarkdown/yaml";
import { removeTagsFromStringButKeepAltImages } from "../utils";

// Gestion de la searchBar
export function searchBar(hash, markpageData) {
	const sectionsTitle = markpageData[2];
	const subSectionsData = markpageData[3];
	const searchbarElement = document.getElementById("searchBar");

	const urlParams = new URLSearchParams(window.location.search);
	const shouldRemoveSearchBar =
		urlParams && urlParams.get("searchbar") && urlParams.get("searchbar") == 0;

	if (!yaml.searchbar || shouldRemoveSearchBar) {
		// Par défaut, on gère la searchbar, mais on peut décider dans les paramètres YAML de ne pas avoir de searchbar
		searchbarElement.remove();
		return;
	}

	const searchInput = document.getElementById("searchInput");
	searchbarElement.style.display = "block";
	function searchText() {
		let sectionsResults = [];
		let subSectionsResults = [];
		let sectionsColumnResults = [];
		// On fait la recherche sans prendre en compte la casse
		const inputText = searchInput.value.toLowerCase();
		if (inputText.length > 2) {
			for (let i = 0; i < subSectionsData.length; i++) {
				// Recherche dans le titre de chaque section + le contenu de chaque section
				const titleSection = sectionsTitle[i].toString().toLowerCase();
				const contentSection = subSectionsData[i].toString().toLowerCase();
				let textSection =
					sectionsTitle[i].toString().toLowerCase() + contentSection;
				textSection = removeTagsFromStringButKeepAltImages(textSection);
				// Diviser inputText en plusieurs termes si nécessaire
				let terms = inputText
					.toLowerCase()
					.trim()
					.split(/\s+/)
					// on remplace "_" par " " car les boutons de filtre de tags avec des mots composés utilisent "_"
					.map((t) => t.replaceAll("_", " "));

				if (terms.every((term) => textSection.includes(term))) {
					// On a trouvé tous les termes dans la section
					if (subSectionsData[i].length > 0) {
						// S'il y a des sous-sections, on affine la recherche dans chaque sous-section
						for (let j = 0; j < subSectionsData[i].length; j++) {
							// Recherche du texte dans le contenu de chaque sous-section
							let textSubSection = subSectionsData[i][j]
								.toString()
								.toLowerCase();
							textSubSection =
								removeTagsFromStringButKeepAltImages(textSubSection);

							if (terms.every((term) => textSubSection.includes(term))) {
								subSectionsResults.push([i, j]);
							}
						}
						// Cas où on a trouvé les termes dans le titre de la section : du coup c'est toute la colonne qu'il faut afficher
						if (terms.every((term) => titleSection.includes(term))) {
							sectionsColumnResults.push(i);
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
						let activeSubSection = sectionElement.querySelector(
							".subSection-" + (indexSubSection + 1),
						);
						if (!activeSubSection) {
							activeSubSection = document.querySelector(
								`#section-${indexSection + 1} .noSubSections`,
							);
						}
						const subSectionTitle = activeSubSection.querySelector("h3 a")
							? activeSubSection.querySelector("h3 a").innerHTML
							: sectionElement.querySelector("h2 a").innerHTML;
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
				section.classList.remove("isColumnResultFromSearch");
				section.classList.remove("hide");
			});
			// Cas où le résultat se trouve dans la section
			if (sectionsResults.length > 0) {
				hasResults = true;
				sectionsResults.forEach((sectionResult) => {
					const sectionId = sectionResult + 1;
					const activeSection = document.querySelector(`#section-${sectionId}`);
					activeSection.classList.add("isResultFromSearch");
				});
			}
			// Cas où le résultat se trouve dans une sous-section
			if (subSectionsResults.length > 0) {
				hasResults = true;
				subSectionsResults.forEach((subSectionResult) => {
					const sectionId = subSectionResult[0] + 1;
					const subSectionId = subSectionResult[1] + 1;
					const activeSection = document.querySelector(`#section-${sectionId}`);
					let activeSubSection = document.querySelector(
						`#section-${sectionId} .subSection-${subSectionId}`,
					);
					if (!activeSubSection) {
						activeSubSection = document.querySelector(
							`#section-${sectionId} .noSubSections`,
						);
					}
					activeSection.classList.add("hasResultFromSearch");
					activeSubSection.classList.add("isResultFromSearch");
				});
			}
			// Cas où seul le titre de colonne a été trouvé
			if (sectionsColumnResults.length > 0) {
				hasResults = true;
				sectionsColumnResults.forEach((sectionsColumnResult) => {
					const sectionId = sectionsColumnResult + 1;
					const activeSection = document.querySelector(`#section-${sectionId}`);
					activeSection.classList.add("isColumnResultFromSearch");
				});
			}
			sections.forEach((section) => {
				if (
					hasResults &&
					(section.classList.contains("isResultFromSearch") ||
						section.classList.contains("hasResultFromSearch") ||
						section.classList.contains("isColumnResultFromSearch"))
				) {
					section.classList.remove("hide");
				} else {
					if (inputText.length > 2) {
						section.classList.add("hide");
					}
				}
			});
		}
	}
	function displaySearchBar(shouldDisplaySearchBar) {
		const title = document.querySelector("header h1");
		const imageInTitle = title.querySelector("img");
		const banner = document.querySelector("header .banner");
		const titleInitialColor = title.style.color;
		if (shouldDisplaySearchBar) {
			title.style.color = "transparent";
			if (imageInTitle) {
				imageInTitle.style.opacity = "0";
			}
			searchInput.classList.add("active");
			if (banner) {
				banner.style.zIndex = "100";
			}
		} else {
			title.style.color = titleInitialColor;
			if (imageInTitle) {
				imageInTitle.style.opacity = "1";
			}
			searchInput.classList.remove("active");
			if (banner) {
				banner.style.zIndex = "-100";
			}
		}
	}
	if (window.matchMedia("(max-width: 500px)").matches) {
		searchbarElement.addEventListener("mouseover", function () {
			displaySearchBar(true);
		});
		/* searchbarElement.addEventListener("mouseout", function () {
				displaySearchBar(false);
			}); */
		searchInput.addEventListener("input", function () {
			displaySearchBar(true);
		});
		searchInput.addEventListener("focus", function () {
			displaySearchBar(true);
		});
	}

	// Gestion de l'input pour faire une recherche dans le contenu
	searchInput.addEventListener("input", searchText);
	searchInput.addEventListener("keydown", function (event) {
		// Si on appuie sur Escape, on sort de la barre de recherche
		if (event.key === "Escape" || event.keyCode === 27) {
			// on réinitialise le champ d'entrée avec une chaîne vide
			searchInput.value = "";
			searchText();
			setTimeout(() => {
				searchInput.blur();
			}, 100);
		}
	});
	let isLastClickDisplaySearchBar = false;
	document.body.addEventListener("click", function (event) {
		if (window.matchMedia("(max-width: 500px)").matches) {
			if (
				(event.target.tagName == "BUTTON" && event.target.closest(".banner")) ||
				event.target.id == "searchInput"
			) {
				isLastClickDisplaySearchBar = true;
				displaySearchBar(true);
			} else {
				const banner = document.querySelector("header .banner");
				if (searchInput.value.trim() == "") {
					displaySearchBar(false);
				} else {
					if (banner) {
						banner.style.zIndex = "-100";
					}
				}
				if (yaml.lightpad && yaml.autofiltres && isLastClickDisplaySearchBar) {
					window.scrollTo({
						top: 0,
						behavior: "instant",
					});
				}
				isLastClickDisplaySearchBar = false;
			}
		} else {
			if (event.target.id != "searchInput" && event.target.tagName != "LABEL") {
				setTimeout(() => {
					searchInput.blur();
				}, 100);
			}
		}
	});
}
