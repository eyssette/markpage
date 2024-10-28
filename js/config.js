// On peut définir des raccourcis vers ses markpages (si on veut forker le projet et avoir une URL plus courte à partager)
export const shortcuts = [["myMarkpage", "URL"]];

export const corsProxy = "https://corsproxy.io/?";

export const CSSthemes = ["colors.css"];

// Gestion des addOns
export const allowedAddOns = {
	pako: { js: "js/externals/pako.min.js" },
	kroki: { js: "js/externals/kroki.js" },
	textFit: {
		js: "js/externals/textFit.min.js",
		css: "<style>.katex-display{max-width:80%} .katex-display .textFitted{white-space:nowrap}</style>",
	},
};

export const addOnsDependencies = {
	kroki: ["pako"],
};
