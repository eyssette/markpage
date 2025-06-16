import { changeDisplayBasedOnParams } from "./changeDisplayBasedOnParams";
import { showOnlyThisElement } from "./showOnlyThisElement";
import { yaml } from "../processMarkdown/yaml";

function changeURLhistory(options) {
	const params = options && options.params;
	const paramsURL = options && options.paramsURL;
	const baseURL = options && options.baseURL;
	const hash = options && options.hash;
	// On change l'historique dans l'URL sans changer la page
	let newURL;
	if (params.sec || paramsURL.sec != 1 || paramsURL.subsec != 1) {
		newURL =
			baseURL +
			"?" +
			Object.keys(params)
				.map(function (key) {
					return key + "=" + encodeURIComponent(params[key]);
				})
				.join("&") +
			"#" +
			hash.replace("?footnote", "");
	} else {
		newURL = baseURL + "#" + hash.replace("?footnote", "");
	}
	history.pushState({ path: newURL }, "", newURL);
}

export function handleNavigation(baseURL, hash, params, markpageData) {
	const sectionsTitle = markpageData[2];
	const numberOfSections = sectionsTitle.length;
	const subSectionsData = markpageData[3];
	const previousButton = document.getElementById("previousButton");
	const nextButton = document.getElementById("nextButton");
	// Une fonction pour gérer le déplacement d'une section ou d'une sous-section à une autre
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
					changeURLhistory({
						params: params,
						paramsURL: paramsURL,
						baseURL: baseURL,
						hash: hash,
					});
					changeDisplayBasedOnParams(params, markpageData);
				} else if (paramsSecInt < numberOfSections) {
					// Sinon on passe à la section d'après et à la première sous-section
					paramsURL.sec = paramsSecInt + 1;
					paramsURL.subsec = 1;
					changeURLhistory({
						params: params,
						paramsURL: paramsURL,
						baseURL: baseURL,
						hash: hash,
					});
					changeDisplayBasedOnParams(params, markpageData);
				}
			} else {
				// Si on se déplace vers l'arrière
				if (paramsSubsecInt > 1) {
					// Si on n'est pas à la première sous-section : on recule d'une sous-section
					paramsURL.subsec = paramsSubsecInt - 1;
					changeURLhistory({
						params: params,
						paramsURL: paramsURL,
						baseURL: baseURL,
						hash: hash,
					});
					changeDisplayBasedOnParams(params, markpageData);
				} else if (paramsSecInt > 1) {
					// Sinon : on passe à la section d'avant (sauf si on est à la première section)
					paramsURL.sec = paramsSecInt - 1;
					paramsURL.subsec = subSectionsData[paramsURL.sec - 1].length;
					changeURLhistory({
						params: params,
						paramsURL: paramsURL,
						baseURL: baseURL,
						hash: hash,
					});
					changeDisplayBasedOnParams(params, markpageData);
				} else {
					// Si on est à la première section : on revient à la page d'accueil
					delete params.sec;
					delete params.subsec;
					showOnlyThisElement(undefined, "sections");
					showOnlyThisElement(undefined, "subsections");
					changeURLhistory({
						params: params,
						paramsURL: paramsURL,
						baseURL: baseURL,
						hash: hash,
					});
					changeDisplayBasedOnParams(params, markpageData);
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
					changeURLhistory({
						params: params,
						paramsURL: paramsURL,
						baseURL: baseURL,
						hash: hash,
					});
					changeDisplayBasedOnParams(params, markpageData);
				} // Sinon, on ne fait rien, on reste sur la page
			} else {
				// Si on se déplace vers l'arrière
				if (paramsSecInt > 1) {
					// Si on n'est pas à la première section, on va à la section d'avant
					paramsURL.sec = paramsSecInt - 1;
					paramsURL.subsec = subSectionsData[paramsSecInt - 1].length;
					changeURLhistory({
						params: params,
						paramsURL: paramsURL,
						baseURL: baseURL,
						hash: hash,
					});
					changeDisplayBasedOnParams(params, markpageData);
				} else {
					// Si on est à la première section : on va à la page d'accueil
					delete paramsURL.sec;
					delete paramsURL.subsec;
					showOnlyThisElement(undefined, "sections");
					showOnlyThisElement(undefined, "subsections");
					changeURLhistory({
						params: params,
						paramsURL: paramsURL,
						baseURL: baseURL,
						hash: hash,
					});
					changeDisplayBasedOnParams(params, markpageData);
				}
			}
		} else if (next) {
			// Si on était à la page d'accueil, on va à la première section et à la première sous-section
			paramsURL.sec = 1;
			paramsURL.subsec = 1;
			changeURLhistory({
				params: params,
				paramsURL: paramsURL,
				baseURL: baseURL,
				hash: hash,
			});
			changeDisplayBasedOnParams(params, markpageData);
		}
	}

	// Navigation avec les touches de navigation
	document.addEventListener("keydown", function (event) {
		// Vérifier si l'élément actif est un champ de saisie
		const isTextInput =
			document.activeElement &&
			(document.activeElement.tagName === "INPUT" ||
				document.activeElement.tagName === "TEXTAREA" ||
				document.activeElement.isContentEditable);

		if (isTextInput) return; // Ne rien faire si on est dans un champ de saisie

		if (event.key === "ArrowLeft") {
			event.preventDefault();
			moveNextOrPrevious(params, false);
		}
		if (event.key === "ArrowRight") {
			event.preventDefault();
			moveNextOrPrevious(params, true);
		}
	});

	// Par défaut, sur écran tactile, la navigation se fait step-by-step dans les sous-sections et via un geste de swipe ou par les boutons de navigations en bas : on peut désactiver dans l'en-tête YAML ce paramètre
	// Gestion du swipe
	let startX = 0;
	let startY = 0;

	function handleTouchStart(e) {
		startX = e.changedTouches[0].screenX;
		startY = e.changedTouches[0].screenY;
	}

	function handleTouchEnd(e) {
		const diffX = e.changedTouches[0].screenX - startX;
		const diffY = e.changedTouches[0].screenY - startY;
		const absDiffX = Math.abs(diffX);
		const absDiffY = Math.abs(diffY);
		const ratioX = absDiffX / (absDiffY || 1);

		// Ignore small movements.
		if (absDiffX < 30 && absDiffY < 30) {
			return;
		}
		if (absDiffX > absDiffY && ratioX >= 2) {
			if (diffX >= 0) {
				// Right Swipe
				moveNextOrPrevious(params, false);
			} else {
				// Left Swipe
				moveNextOrPrevious(params, true);
			}
		}
	}

	const innerBoxElement = document.querySelector("#innerBox");
	if (!yaml.pad) {
		innerBoxElement.addEventListener(
			"touchstart",
			function (event) {
				handleTouchStart(event);
			},
			{ passive: false },
		);
		innerBoxElement.addEventListener(
			"touchend",
			function (event) {
				handleTouchEnd(event);
			},
			{ passive: false },
		);
	}

	// Gestion des boutons de navigation en bas
	previousButton.addEventListener("click", () => {
		moveNextOrPrevious(params, false);
	});
	nextButton.addEventListener("click", () => {
		moveNextOrPrevious(params, true);
	});
}
