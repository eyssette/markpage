function normalizeTitle(title) {
	return title
		.toString()
		.replace(/#.*/, "")
		.replace(/<[^>]*>/g, "")
		.replace(/&[^;]*;/g, "")
		.replace(/[^a-zA-Z0-9À-ÿ]/g, "")
		.toLowerCase();
}

export function convertNavigationParam(param, markpageData) {
	// Si le paramètre "sec" existe et s'il ne se convertit pas en un nombre, c'est un texte qui désigne une section par son titre. On va donc chercher l'ID de la section correspondante à ce titre.
	if (param.sec && isNaN(param.sec)) {
		// On récupère le titre de la section à partir du paramètre "sec"
		// On supprime tous les caractères qui ne sont pas des lettres ou des chiffres
		// On ne supprime pas les lettres accentuées
		const sectionTitleParam = normalizeTitle(param.sec);
		console.log(sectionTitleParam);
		const sectionTitles = markpageData[2].map((title) => normalizeTitle(title));

		// On cherche l'ID de la section correspondante
		// C'est le numéro de l'élément qui est dans markpageData[2]
		const sectionIndex = sectionTitles.findIndex(
			(title) => title === sectionTitleParam,
		);

		if (sectionIndex !== -1) {
			// On remplace le paramètre "sec" par l'ID de la section correspondante
			param.sec = sectionIndex + 1;
			// S'il n'y a pas de paramètre "subsec", on le met à 1 pour aller à la première sous-section de cette section
			if (!param.subsec) {
				param.subsec = 1;
			}
		} else {
			// On supprime le paramètre "sec" et "subsec" s'il n'y a pas de section correspondante
			delete param.sec;
			delete param.subsec;
		}
	}
	if (param.subsec && isNaN(param.subsec)) {
		// On récupère le titre de la sous-section à partir du paramètre "subsec"
		const subSectionTitleParam = normalizeTitle(param.subsec);
		const sectionID = param.sec ? parseInt(param.sec) : null;
		if (sectionID && markpageData[3][sectionID - 1]) {
			const subSectionTitles = markpageData[3][sectionID - 1].map(
				(subSection) => normalizeTitle(subSection[0]),
			);
			const subSectionIndex = subSectionTitles.findIndex(
				(title) => title === subSectionTitleParam,
			);
			if (subSectionIndex !== -1) {
				// On remplace le paramètre "subsec" par l'ID de la sous-section correspondante
				param.subsec = subSectionIndex + 1;
			} else {
				// Si on ne trouve pas la sous-section correspondante, alors s'il y a un paramètre "sec", on revient à la première sous-section de cette section, sinon on revient à la page d'accueil en supprimant le paramètre "subsec"
				if (sectionID) {
					param.subsec = 1;
				} else {
					delete param.subsec;
				}
			}
		} else {
			// Si on ne trouve pas la section correspondante, on supprime le paramètre "subsec"
			delete param.subsec;
		}
	}
	if (param.part && isNaN(param.part)) {
		// On récupère le titre de la partie à partir du paramètre "part"
		const partTitleParam = normalizeTitle(param.part);
		const sectionID = param.sec ? parseInt(param.sec) : null;
		const subSectionID = param.subsec ? parseInt(param.subsec) : null;
		if (
			sectionID &&
			subSectionID &&
			markpageData[3][sectionID - 1] &&
			markpageData[3][sectionID - 1][subSectionID - 1]
		) {
			let partIndex = -1;
			const subSection = markpageData[3][sectionID - 1][subSectionID - 1];
			if (param.groupDisplay) {
				// Si le paramètre "groupDisplay" est présent,
				// On a l'id de la première .subSection avant le groupDisplay, c'est subSectionID
				// On va ensuite avancer dans les .subSection suivantes, regarder le h3 de cette .subSection, dont la classe est "groupDisplay", et regarder si le h3 correspond au titre du paramètre partTitleParam
				let currentSubSectionIndex = subSectionID - 1;
				while (currentSubSectionIndex < markpageData[3][sectionID - 1].length) {
					const currentSubSection =
						markpageData[3][sectionID - 1][currentSubSectionIndex];
					const currentSubSectionTitle = normalizeTitle(currentSubSection[0]);
					if (currentSubSectionTitle === partTitleParam) {
						partIndex = currentSubSectionIndex + 1;
						break;
					}
					currentSubSectionIndex++;
				}
				if (partIndex === -1) {
					// Si on ne trouve pas la partie correspondante, on supprime le paramètre "part"
					delete param.part;
				} else {
					param.subsec = partIndex;
					if (param.subpart) {
						const subpartTitleParam = normalizeTitle(param.subpart);
						const subSectionContent =
							markpageData[3][sectionID - 1][partIndex - 1][2];
						const partTitles = subSectionContent
							.split("\n")
							.filter(
								(line) => line.startsWith("<h4") || line.startsWith("<h5"),
							)
							.map((line) => {
								// On récupère le texte du titre en supprimant les balises HTML
								// On supprime tous les caractères qui ne sont pas des lettres ou des chiffres
								// On ne supprime pas les lettres accentuées
								return normalizeTitle(line);
							});
						partIndex = partTitles.findIndex(
							(title) => title === subpartTitleParam,
						);
					}
				}
			} else {
				// On recherche dans le contenu de la sous-section les titres des parties (qui sont des titres h4 ou h5)
				const subSectionContent = subSection[2];
				const partTitles = subSectionContent
					.split("\n")
					.filter((line) => line.startsWith("<h4") || line.startsWith("<h5"))
					.map((line) => {
						// On récupère le texte du titre en supprimant les balises HTML
						// On supprime tous les caractères qui ne sont pas des lettres ou des chiffres
						// On ne supprime pas les lettres accentuées
						return normalizeTitle(line);
					});
				partIndex = partTitles.findIndex((title) => title === partTitleParam);
			}
			if (partIndex !== -1) {
				// On remplace le paramètre "part" par l'ID de la partie correspondante
				param.part = partIndex + 1;
			} else {
				// Si on ne trouve pas la partie correspondante, on supprime le paramètre "part"
				delete param.part;
			}
		} else {
			// Si on ne trouve pas la section ou la sous-section correspondante, on supprime le paramètre "part"
			delete param.part;
		}
	}
	return param;
}
