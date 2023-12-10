function handleMarkpage() {
	const bodyElement = document.body;
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
				subSectionElement = document.getElementById("subSection-"+subSectionID);
				sectionElement = document.getElementById("section-"+sectionID);
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
				// Redirection en fonction des paramètres dans l'URL
				newURL = baseURL + '?' + Object.keys(params).map(function(key) {
					return key + '=' + encodeURIComponent(params[key]);
				}).join('&');
			}
			
			// On change l'affichage de l'URL sans recharger la page
			history.pushState({path: newURL + '#'+ hash}, '', newURL + '#'+ hash);
			changeDisplayBasedOnParams(params);
			if (window.innerWidth < 600) {
				link.scrollIntoView({
					behavior: "instant"
				});
			} else {
				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});
			}
		});
	});
	
};