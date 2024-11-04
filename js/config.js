// On peut définir des raccourcis vers ses markpages (si on veut forker le projet et avoir une URL plus courte à partager)
export const shortcuts = [["myMarkpage", "URL"]];

export const corsProxy = "https://corsproxy.io/?";

export const CSSthemes = ["colors.css"];

// Gestion des add-ons
export const allowedAddOns = {
	pako: { js: "js/externals/pako.min.js" },
	kroki: { js: "js/externals/kroki.js" },
	lightbox: { js: "js/externals/lightbox.js" },
	text2quiz: {
		js: "js/externals/text2quiz.js",
		css: "<style>.iframeText2quiz{width:700px; height:750px; max-width: 100%; border:none} @media screen and (max-width: 834px){.iframeText2quiz{height:65vh;}}</style>",
	},
};

export const addOnsDependencies = {
	kroki: ["pako"],
};
