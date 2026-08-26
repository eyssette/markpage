// Permet de charger le bundle IIFE si le module ESM ne peut pas être chargé (par exemple, si le navigateur ne supporte pas les modules, notamment si l'application est ouverte en local dans un navigateur, sans serveur web)
document.querySelector("#main-module").addEventListener(
	"error",
	() => {
		const iifeScript = document.createElement("script");
		iifeScript.src = "script.min.js";
		iifeScript.defer = true;
		document.head.append(iifeScript);
	},
	{ once: true },
);
