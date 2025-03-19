const frenchToEnglishColorName = {
	// Basic colors
	argent: "Silver",
	blanc: "White",
	bleu: "Blue",
	bordeaux: "Maroon",
	cyan: "Cyan",
	gris: "Gray",
	jaune: "Yellow",
	magenta: "Magenta",
	marine: "Navy",
	marron: "Brown",
	noir: "Black",
	olive: "Olive",
	or: "Gold",
	orange: "Orange",
	rose: "Pink",
	rouge: "Red",
	sarcelle: "Teal",
	vert: "Green",
	violet: "MediumVioletRed",
	indigo: "Indigo",
	// Couleur plus claire ou plus foncée
	bleuclair: "lightblue",
	bleufoncé: "darkblue",
	cyanclair: "lightcyan",
	cyanfoncé: "darkcyan",
	magentafoncé: "DarkMagenta",
	magentaclair: "Orchid",
	marronclair: "Chocolate",
	rougeclair: "LightCoral",
	rosefoncé: "DeepPink",
	vertclair: "PaleGreen",
	vertfoncé: "DarkGreen",
	violetclair: "Plum",
	violetfoncé: "Purple",
	// Noms composés
	vertolive: "OliveDrab",
	bleuciel: "SkyBlue",
	bleuroi: "RoyalBlue",
	bleumarine: "Navy",
	vertforet: "ForestGreen",
	vertcitron: "LimeGreen",
	vertmer: "SeaGreen",
	bleunuit: "MidnightBlue",
};

function isValidColorNameCSS(string) {
	const s = new Option().style;
	s.color = string;
	return s.color !== "";
}

export function getCSScolor(string) {
	string = string.toLowerCase();
	if (isValidColorNameCSS(string)) {
		return string;
	} else {
		return frenchToEnglishColorName[string];
	}
}
