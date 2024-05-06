function handleMarkpage() {
	const bodyElement = document.body;

	const sectionsTitle = markpageData[2];
	const numberOfSections = sectionsTitle.length;
	const subSectionsData = markpageData[3];

	function convertLatexExpressions(string) {
		string = string
			.replace(/\$\$(.*?)\$\$/g, "&#92;[$1&#92;]")
			.replace(/\$(.*?)\$/g, "&#92;($1&#92;)");
		let expressionsLatex = string.match(
			new RegExp(/&#92;\[.*?&#92;\]|&#92;\(.*?&#92;\)/g)
		);
		if (expressionsLatex) {
			// On n'utilise Katex que s'il y a des expressions en Latex dans le Markdown
			for (let expressionLatex of expressionsLatex) {
				// On vérifie si le mode d'affichage de l'expression (inline ou block)
				const inlineMaths = expressionLatex.includes("&#92;[") ? true : false;
				// On récupère la formule mathématique
				let mathInExpressionLatex = expressionLatex
					.replace("&#92;[", "")
					.replace("&#92;]", "");
				mathInExpressionLatex = mathInExpressionLatex
					.replace("&#92;(", "")
					.replace("&#92;)", "");
				// On convertit la formule mathématique en HTML avec Katex
				stringWithLatex = katex.renderToString(mathInExpressionLatex, {
					displayMode: inlineMaths,
				});
				string = string.replace(expressionLatex, stringWithLatex);
			}
		}
		return string;
	}
	setTimeout(() => {
		if (yamlMaths) {
			const initialMessageElement = document.getElementById("initialMessage");
			initialMessageElement.innerHTML = convertLatexExpressions(
				initialMessageElement.innerHTML
			);
			const sectionContent = document.querySelectorAll(".sectionContent");
			for (const section of sectionContent) {
				const subSectionsContent =
					section.querySelectorAll(".subSectionContent");
				if (subSectionsContent.length > 0) {
					for (const subSection of subSectionsContent) {
						subSection.innerHTML = convertLatexExpressions(
							subSection.innerHTML
						);
					}
				} else {
					section.innerHTML = convertLatexExpressions(section.innerHTML);
				}
			}
		}
	}, 200);

	const sections = document.querySelectorAll("section");
	const subSections = document.querySelectorAll(".subSection");
	const links = document.querySelectorAll(".navigationLink");

	const hash = window.location.hash.substring(1);
	// Pour récupérer les paramètres de navigation dans l'URL
	function getParams(URL) {
		urlSearchParams = new URLSearchParams(URL.split("?")[1]);
		const paramsObject = {};
		urlSearchParams.forEach(function (value, key) {
			paramsObject[key] = value;
		});
		return paramsObject;
	}

	const actualURL = window.location.search;
	const baseURL = window.location.origin + window.location.pathname;
	let params = getParams(actualURL);

	changeDisplayBasedOnParams(params);

	function showOnlyThisElement(element, type) {
		if (type == "sections") {
			for (const sectionElement of sections) {
				sectionElement.classList.remove("visible");
			}
		}
		if (type == "subsections") {
			for (const subSectionElement of subSections) {
				subSectionElement.classList.remove("visible");
			}
		}
		if (element) {
			element.classList.add("visible");
		}
	}

	function changeDisplayBasedOnParams(param) {
		if (param) {
			const sectionID = param.sec;
			const subSectionID = param.subsec;
			if (subSectionID) {
				bodyElement.className = "displaySubSection";
				sectionElement = document.getElementById("section-" + sectionID);
				subSectionElement = sectionElement.querySelector(
					"#subSection-" + subSectionID
				);
				showOnlyThisElement(sectionElement, "sections");
				showOnlyThisElement(subSectionElement, "subsections");
			} else {
				if (sectionID) {
					bodyElement.className = "displaySection";
					sectionElement = document.getElementById("section-" + sectionID);
					showOnlyThisElement(sectionElement, "sections");
					showOnlyThisElement(undefined, "subsections");
				} else {
					bodyElement.className = "displayHomepage";
				}
			}
		} else {
			bodyElement.className = "displayHomepage";
		}
	}

	// On détecte les clics sur les liens
	links.forEach(function (link) {
		let listenerElement = link;
		if (
			link.parentElement.nodeName == "H3" ||
			link.parentElement.parentElement.nodeName == "H3"
		) {
			listenerElement = link.parentElement;
		}
		listenerElement.addEventListener("click", function (event) {
			// Empêche le comportement par défaut d'ouverture du lien et récupère au contraire le contenu du lien
			event.preventDefault();
			const linkURL = link.href;
			let newURL;
			if (linkURL == baseURL || linkURL + "index.html" == baseURL) {
				newURL = baseURL;
				params = undefined;
				showOnlyThisElement(undefined, "sections");
				showOnlyThisElement(undefined, "subsections");
			} else {
				params = getParams(linkURL);
				// Affichage par défaut de la première sous-section
				const sectionElement = document.getElementById("section-" + params.sec);
				const hasSubSections =
					sectionElement.querySelector(".subSectionContent");
				if (params.sec && !params.subsec && hasSubSections) {
					params.subsec = "1";
				}
				// Redirection en fonction des paramètres dans l'URL
				newURL =
					baseURL +
					"?" +
					Object.keys(params)
						.map(function (key) {
							return key + "=" + encodeURIComponent(params[key]);
						})
						.join("&");
			}

			// On change l'affichage de l'URL sans recharger la page
			history.pushState({ path: newURL + "#" + hash }, "", newURL + "#" + hash);
			changeDisplayBasedOnParams(params);
			if (window.innerWidth < 600 && typeof params !== "undefined") {
				link.scrollIntoView({
					behavior: "smooth",
				});
			} else {
				window.scrollTo({
					top: 0,
					behavior: "smooth",
				});
			}
		});
	});

	window.addEventListener("popstate", function (event) {
		let actualURL = window.location.search;
		params = getParams(actualURL);
		// Redirection en fonction des paramètres dans l'URL
		newURL =
			baseURL +
			"?" +
			Object.keys(params)
				.map(function (key) {
					return key + "=" + encodeURIComponent(params[key]);
				})
				.join("&");

		if (actualURL == "") {
			params = undefined;
			showOnlyThisElement(undefined, "sections");
			showOnlyThisElement(undefined, "subsections");
		}
		// On change l'affichage de l'URL sans recharger la page
		changeDisplayBasedOnParams(params);
	});

	// Affichage si yamlLinkToHomePage d'un lien supplémentaire vers la page d'accueil en haut à droite
	let linkToHomePageElement;
	if (yamlLinkToHomePage) {
		linkToHomePageElement = document.getElementById("linkToHomePage");
		linkToHomePageElement.style.display = "block";
	}

	// On peut ajouter un paramètre dans l'URL pour cacher le menu du bas et l'icône de page d'accueil
	if (params.menu && params.menu == 0) {
		const menuElement = document.getElementById("footerContent");
		menuElement.style.display = "none";
		const footerElement = menuElement.parentElement;
		footerElement.style.height = "0px";
		footerElement.style.padding = "0px";
		if (yamlLinkToHomePage) {
			linkToHomePageElement.style.display = "none";
		}
	}
	// On peut enlever les titres h3 sur le côté
	if (params.h3 && params.h3 == 0) {
		const h3Elements = document.querySelectorAll("h3");
		for (const h3Element of h3Elements) {
			h3Element.style.display = "none";
		}
		if (params.subsec) {
			// À la place du titre en haut de page, on met le titre h3 de la section affichée
			const h3Title = h3Elements[params.subsec - 1].firstChild.innerHTML;
			if (params.sec && h3Title) {
				const h2Title = document.querySelector(
					"#section-" + params.sec + " h2 a"
				);
				h2Title.parentElement.innerHTML = h2Title.innerHTML + " / " + h3Title;
			}
		}
		// On recale correctement en CSS le contenu de la section, étant donné qu'on a supprimé la partie "titres h3" sur la gauche
		const styleSubSectionContent =
			"@media screen and (min-width: 601px) {.subSectionContent {margin-left:140px}}";
		const styleSheet = document.createElement("style");
		styleSheet.innerText = styleSubSectionContent;
		document.head.appendChild(styleSheet);
	}

	// Gestion de la searchBar
	const searchbarElement = document.getElementById("searchBar");
	if (yamlSearchbar) {
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
							"section-" + (indexSection + 1)
						);
						const subSectionElement = sectionElement.querySelector(
							"#subSection-" + (indexSubSection + 1)
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

	// Gestion du swipe

	// Gestion du déplacement d'un section ou sous-section à une autre

	function moveNextOrPrevious(paramsURL, next) {
		let paramsSecInt;
		let paramsSubsecInt;
		if (paramsURL && paramsURL.subsec) {
			// Si on est dans une sous-section
			paramsSubsecInt = parseInt(paramsURL.subsec);
			paramsSecInt = parseInt(paramsURL.sec);
			const numberOfSubsections = subSectionsData[paramsSecInt - 1].length;
			if (next) {
				// Si on se déplace vers l'avant
				if (paramsSubsecInt < numberOfSubsections) {
					// s'il y a encore une sous-section après : on avance d'une sous-section
					paramsURL.subsec = paramsSubsecInt + 1;
					changeDisplayBasedOnParams(params);
				} else if (paramsSecInt < numberOfSections) {
					// Sinon on passe à la section d'après et à la première sous-section
					paramsURL.sec = paramsSecInt + 1;
					paramsURL.subsec = 1;
					changeDisplayBasedOnParams(params);
				}
			} else {
				// Si on se déplace vers l'arrière
				if (paramsSubsecInt > 1) {
					// Si on n'est pas à la première sous-section : on recule d'une sous-section
					paramsURL.subsec = paramsSubsecInt - 1;
					changeDisplayBasedOnParams(params);
				} else if (paramsSecInt > 1) {
					// Sinon : on passe à la section d'avant (sauf si on est à la première section)
					paramsURL.sec = paramsSecInt - 1;
					paramsURL.subsec = subSectionsData[paramsSecInt - 1].length;
					changeDisplayBasedOnParams(params);
				} else {
					// Si on est à la première section : on revient à la page d'accueil
					delete params.sec
					delete params.subsec
					showOnlyThisElement(undefined, "sections");
					showOnlyThisElement(undefined, "subsections");
					changeDisplayBasedOnParams(params);
				}
			}
		} else if (paramsURL.sec) {
			// Si on n'est pas dans une sous-section, mais dans une section sans sous-section
			if (next) {
				// Si on se déplace vers l'avant
				if (paramsSecInt < numberOfSections) {
					// S'il reste une section après : on va à la prochaine section et à la première sous-section
					paramsURL.sec = paramsSecInt + 1;
					paramsURL.subsec = 1;
					changeDisplayBasedOnParams(params);
				} // Sinon, on ne fait rien, on reste sur la page
			} else {
				// Si on se déplace vers l'arrière
				if (paramsSecInt > 1) {
					// Si on n'est pas à la première section, on va à la section d'avant
					paramsURL.sec = paramsSecInt - 1;
					paramsURL.subsec = subSectionsData[paramsSecInt - 1].length;
					changeDisplayBasedOnParams(params);
				} else {
					// Si on est à la première section : on va à la page d'accueil
					delete paramsURL.sec
					delete paramsURL.subsec
					showOnlyThisElement(undefined, "sections");
					showOnlyThisElement(undefined, "subsections");
					changeDisplayBasedOnParams(params);
				}
			}
		} else if (next) {
			// Si on était à la page d'accueil, on va à la première section et à la première sous-section
				paramsURL.sec = 1;
				paramsURL.subsec = 1;
				changeDisplayBasedOnParams(params);
			}
	}

	let startX = 0;
	let startY = 0;

	function handleTouchStart(e) {
		startX = e.changedTouches[0].screenX;
		startY = e.changedTouches[0].screenY;
	}

	function handleTouchEnd(e) {
		const diffX = e.changedTouches[0].screenX - startX;
		const diffY = e.changedTouches[0].screenY - startY;
		const ratioX = Math.abs(diffX / diffY);
		const ratioY = Math.abs(diffY / diffX);
		const absDiff = Math.abs(ratioX > ratioY ? diffX : diffY);

		// Ignore small movements.
		if (absDiff < 30) {
			return;
		}

		if (ratioX > ratioY) {
			if (diffX >= 0) {
				// Right Swipe
				moveNextOrPrevious(params,true);
			} else {
				// Left Swipe
				moveNextOrPrevious(params,false);
			}
		} else {
			if (diffY >= 0) {
				// Down Swipe
			} else {
				// Up Swipe
			}
		}
	}

	document.body.addEventListener("touchstart", function (event) {
		handleTouchStart(event);
	});
	document.body.addEventListener("touchend", function (event) {
		handleTouchEnd(event);
	});
	document.addEventListener("keydown", function (event) {
		if (event.key === "ArrowLeft") {
			moveNextOrPrevious(params,false);
		}
		if (event.key === "ArrowRight") {
			moveNextOrPrevious(params,true);
		}
	});
}
