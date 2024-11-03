import defaultMD from "../../content.md";
import { handleURL } from "../utils";
import { parseMarkdown } from "./parseMarkdown";
import { createMarkpage } from "../ui/createMarkpage";

let md = defaultMD;
let markpageData;

export function getMarkdownContentAndCreateMarkpage() {
	const url = window.location.hash.substring(1).replace(/\?.*/, "");
	const sourceMarkpage = handleURL(url);
	if (sourceMarkpage !== "") {
		fetch(sourceMarkpage)
			.then((response) => response.text())
			.then((data) => {
				md = data;
				markpageData = parseMarkdown(md);
				createMarkpage(markpageData, url);
			})
			.catch((error) => {
				markpageData = parseMarkdown(md);
				createMarkpage(markpageData);
				alert(
					"Il y a une erreur dans l'URL ou dans la syntaxe du fichier source. Merci de vous assurer que le fichier est bien accessible et qu'il respecte les règles d'écriture de Markpage",
				);
				console.log(error);
			});
	} else {
		markpageData = parseMarkdown(md);
		createMarkpage(markpageData);
		const urlInput = document.getElementById("urlInput");
		const okButton = document.getElementById("okButton");
		function redirectToUrl() {
			const userUrl = urlInput.value.trim();
			if (userUrl) {
				const fullUrl = window.location.origin + `/#${userUrl}`;
				window.open(fullUrl, "_blank");
			} else {
				alert("Veuillez entrer une URL valide.");
			}
		}
		okButton.addEventListener("click", redirectToUrl);
		urlInput.addEventListener("keypress", (event) => {
			if (event.key === "Enter") {
				redirectToUrl();
			}
		});
	}
}
