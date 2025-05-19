// On peut définir des raccourcis vers ses markpages (si on veut forker le projet et avoir une URL plus courte à partager)
export const shortcuts = [
	[
		"ethique-animale",
		"https://codimd.apps.education.fr/1K2QEqbzRJeqb-bXZfiJqA/download",
	],
	[
		"ethique-environnementale",
		"https://codimd.apps.education.fr/TwoOoaLmRy2E-v5hnGJMUw/download",
	],
];

export const corsProxy = "https://corsproxy.io/?url=";

export const CSSthemes = ["colors.css", "digipad.css"];

// Gestion des add-ons
export const allowedAddOns = {
	pako: { js: "js/addOn/pako.min.js" },
	kroki: { js: "js/addOn/kroki.js" },
	lightbox: {
		js: "js/addOn/lightbox.js",
		css: "<style>img[src]:not([src$='?nolightbox']){cursor: pointer}#lightbox img{max-width:90%!important;max-height:90%!important}</style>",
	},
	text2quiz: {
		js: "js/addOn/text2quiz.js",
		css: "<style>.iframeText2quiz{width:700px; height:750px; max-width: 100%; border:none} @media screen and (max-width: 834px){.iframeText2quiz{height:65vh;}}</style>",
	},
	copycode: {
		js: "js/addOn/copycode.js",
	},
	textFit: {
		js: "js/addOn/textFit.min.js",
	},
	highlight: {
		js: "js/addOn/highlight.min.js",
		css: "js/addOn/highlight-theme-idea.css",
	},
};

export const addOnsDependencies = {
	kroki: ["pako"],
};
