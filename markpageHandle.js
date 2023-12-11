function handleMarkpage() {

	const bodyElement = document.body;	

	const sectionsTitle = markpageData[2];
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
				const initialMessageElement = document.getElementById('initialMessage');
				initialMessageElement.innerHTML = convertLatexExpressions(initialMessageElement.innerHTML)
				const sectionContent = document.querySelectorAll(".sectionContent");
					for (const section of sectionContent) {
						const subSectionsContent = section.querySelectorAll('.subSectionContent')
						if (subSectionsContent.length>0) {
							for (const subSection of subSectionsContent) {
								subSection.innerHTML = convertLatexExpressions(subSection.innerHTML)
							}
						} else {
							section.innerHTML = convertLatexExpressions(section.innerHTML)
						}
					}
			}
		}, 200);
	
	const sections = document.querySelectorAll('section');
	const subSections = document.querySelectorAll('.subSection')
	const links = document.querySelectorAll('.navigationLink');

	const hash = window.location.hash.substring(1);
	// Pour récupérer les paramètres de navigation dans l'URL
	function getParams(URL) {
		urlSearchParams = new URLSearchParams(URL.split('?')[1]);
		const paramsObject = {};
		urlSearchParams.forEach(function(value, key) {
				paramsObject[key] = value;
		});
		return paramsObject;
	}
	
	const actualURL = window.location.search;
	const baseURL = window.location.origin + window.location.pathname;
	let params = getParams(actualURL);

	changeDisplayBasedOnParams(params);

	function showOnlyThisElement(element, type) {
		if (type == 'sections') {
			for (const sectionElement of sections) {
				sectionElement.classList.remove("visible");
			}
		}
		if (type == 'subsections') {
			for (const subSectionElement of subSections) {
				subSectionElement.classList.remove("visible");
			}
		}
		if (element) {
			element.classList.add("visible")
		}
	}

	function changeDisplayBasedOnParams(param) {
		if (param) {
			const sectionID = param.sec;
			const subSectionID = param.subsec;
			if (subSectionID) {
				bodyElement.className = "displaySubSection";
				sectionElement = document.getElementById("section-"+sectionID);
				subSectionElement = sectionElement.querySelector("#subSection-"+subSectionID);
				showOnlyThisElement(sectionElement, 'sections');
				showOnlyThisElement(subSectionElement, 'subsections');
			} else {
				if (sectionID) {
					bodyElement.className = "displaySection";
					sectionElement = document.getElementById("section-"+sectionID);
					showOnlyThisElement(sectionElement, 'sections');
					showOnlyThisElement(undefined, 'subsections')
				}
			}
		} else {
			bodyElement.className = "displayHomepage"
		}
	}

	// On détecte les clics sur les liens
	links.forEach(function(link) {
		link.addEventListener('click', function(event) {
			// Empêche le comportement par défaut d'ouverture du lien et récupère au contraire le contenu du lien
			event.preventDefault();
			const linkURL = link.href;
			let newURL;
			if (linkURL == baseURL || linkURL+'index.html' == baseURL) {
				newURL = baseURL;
				params = undefined;
				showOnlyThisElement(undefined, 'sections')
				showOnlyThisElement(undefined, 'subsections')
			} else {
				params = getParams(linkURL);
				// Affichage par défaut de la première sous-section
				if (params.sec && !params.subsec && subSectionsData[params.sec-1].length>1) {
					params.subsec = "1";
				}
				// Redirection en fonction des paramètres dans l'URL
				newURL = baseURL + '?' + Object.keys(params).map(function(key) {
					return key + '=' + encodeURIComponent(params[key]);
				}).join('&');
			}
			
			// On change l'affichage de l'URL sans recharger la page
			history.pushState({path: newURL + '#'+ hash}, '', newURL + '#'+ hash);
			changeDisplayBasedOnParams(params);
			if (window.innerWidth < 600 && typeof params !== "undefined" && params.subsec !=="1" ) {
				link.scrollIntoView({
					behavior: "smooth"
				});
			} else {
				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});
			}
		});
	});

	window.addEventListener('popstate', function(event) {
		let actualURL = window.location.search;
		console.log(actualURL);
		console.log(history);
		params = getParams(actualURL);
		// Redirection en fonction des paramètres dans l'URL
		newURL = baseURL + '?' + Object.keys(params).map(function(key) {
			return key + '=' + encodeURIComponent(params[key]);
		}).join('&');

		if(actualURL == '') {
			params=undefined;
			showOnlyThisElement(undefined, 'sections');
			showOnlyThisElement(undefined, 'subsections');
		}
		// On change l'affichage de l'URL sans recharger la page
		changeDisplayBasedOnParams(params);
	});
	
	// console.log(markpageData)


	function searchText() {
		let sectionsResults = [];
		let subSectionsResults = [];
		const inputText = document.getElementById("searchInput").value.toLowerCase();
		if (inputText.length>2) {
			for (let i = 0; i < subSectionsData.length; i++) {
				// Recherche dans le titre de chaque section + le contenu de chaque section
				const textSection = sectionsTitle[i].toString().toLowerCase()+subSectionsData[i].toString().toLowerCase();
				if (textSection.indexOf(inputText)>-1) {
					// On a trouvé le texte dans la section
					if (subSectionsData[i].length>1) {
						// S'il y a des sous-sections, on affine la recherche dans chaque sous-section
						for (let j = 0; j < subSectionsData[i].length; j++) {
							// recherche du texte dans le contenu de chaque sous-section
							const textSubSection = subSectionsData[i][j].toString().toLowerCase();
							if (textSubSection.indexOf(inputText)>-1) {
								subSectionsResults.push([i,j])
							}
						}
					} else {
						// Sinon, on indique juste comme résultat la section correspondante
						sectionsResults.push(i)
					}
				}
			}
		}
		const numberResultsSection = sectionsResults.length
		const numberResultsSubSection = subSectionsResults.length
		const numberResults = numberResultsSection + numberResultsSubSection;
		const displayResultsElement = document.getElementById('displayResults');
		let displayResultsHTML = '';
		if (numberResults>0) {
			displayResultsHTML = '<ul>'
			if(numberResultsSection>0) {
				for (const indexSection of sectionsResults) {
					displayResultsHTML += '<li><a href="?sec='+(indexSection+1)+'#'+hash+'">'+sectionsTitle[indexSection]+'</a></li>'		
				}
			}
			if(numberResultsSubSection>0) {
				for (const result of subSectionsResults) {
					const indexSection = result[0];
					const indexSubSection = result[1];
					const sectionElement = document.getElementById('section-'+(indexSection+1))
					const subSectionElement = sectionElement.querySelector('#subSection-'+(indexSubSection+1))
					const subSectionTitle = subSectionElement.querySelector('h3 a').innerHTML
					displayResultsHTML += '<li><a href="?sec='+(indexSection+1)+'&subsec='+(indexSubSection+1)+'#'+hash+'">'+subSectionTitle+'</a></li>'		
				}
			}
			displayResultsHTML +='</ul>'
		}
		displayResultsElement.innerHTML = displayResultsHTML;

		
	
	}

	// Gestion de l'input pour faire une recherche dans le contenu
	document.getElementById("searchInput").addEventListener("input", searchText);
	document.getElementById("searchInput").addEventListener("keydown", function(event) {
		// Si on appuie sur Escape, on sort de la barre de recherche
		if (event.key === "Escape" || event.keyCode === 27) {
			// on réinitialise le champ d'entrée avec une chaîne vide
			document.getElementById("searchInput").value = "";
			searchText();
		}
	});
};