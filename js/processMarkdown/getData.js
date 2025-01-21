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
		const urlInput1 = document.getElementById("urlInput1");
		const okButton1 = document.getElementById("okButton1");
		const urlInput2 = document.getElementById("urlInput2");
		const okButton2 = document.getElementById("okButton2");

		// Fonction générique pour rediriger vers une URL
		function redirectToUrl(inputElement) {
			const userUrl = inputElement.value.trim();
			if (userUrl) {
				const fullUrl = window.location.origin + `/#${userUrl}`;
				window.open(fullUrl, "_blank");
			} else {
				alert("Veuillez entrer une URL valide.");
			}
		}
		okButton1.addEventListener("click", () => redirectToUrl(urlInput1));
		urlInput1.addEventListener("keypress", (event) => {
			if (event.key === "Enter") {
				redirectToUrl(urlInput1);
			}
		});
		okButton2.addEventListener("click", () => redirectToUrl(urlInput2));
		urlInput2.addEventListener("keypress", (event) => {
			if (event.key === "Enter") {
				redirectToUrl(urlInput2);
			}
		});
	}
}
