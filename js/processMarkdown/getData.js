import defaultMD from "../../index.md";
import { handleURL, redirectToUrl } from "../utils";
import { parseMarkdown } from "./parseMarkdown";
import { createMarkpage } from "../ui/createMarkpage";

let md;
let markpageData;

export function getMarkdownContentAndCreateMarkpage(options) {
	const url = window.location.hash.substring(1).replace(/\?.*/, "");
	const optionUseCorsProxy =
		options && options.useCorsProxy ? options.useCorsProxy : false;
	const optionUseDefaultMarkpage =
		options && options.useDefaultMarkpage ? true : false;
	let sourceMarkpage = handleURL(url, {
		useCorsProxy: optionUseCorsProxy,
	});
	const isLightpad =
		window.location.href.includes("https://lightpad.forge.apps.education.fr") ||
		window.location.href.includes("?lightpad");
	if (sourceMarkpage == "" && isLightpad) {
		document.title = "Lightpad";
		sourceMarkpage = "indexLightpad.md";
	}
	if (sourceMarkpage !== "" && !optionUseDefaultMarkpage) {
		fetch(sourceMarkpage)
			.then((response) => response.text())
			.then((data) => {
				md = data;
				const isNotMarkdown = !md.includes("# ");
				if (isNotMarkdown) {
					getMarkdownContentAndCreateMarkpage({ useDefaultMarkpage: true });
					alert(
						"Il y a une erreur dans l'URL ou dans la syntaxe du fichier source. Merci de vous assurer que le fichier est bien accessible et qu'il respecte les règles d'écriture de Markpage",
					);
				} else {
					markpageData = parseMarkdown(md);
					createMarkpage(markpageData, url);
					if (sourceMarkpage == "indexLightpad.md") {
						const urlInput = document.getElementById("urlInput");
						const okButton = document.getElementById("okButton");
						okButton.addEventListener("click", () => redirectToUrl(urlInput));
						urlInput.addEventListener("keypress", (event) => {
							if (event.key === "Enter") {
								redirectToUrl(urlInput);
							}
						});
					}
				}
			})
			.catch((error) => {
				if (!optionUseCorsProxy) {
					getMarkdownContentAndCreateMarkpage({ useCorsProxy: true });
				} else {
					getMarkdownContentAndCreateMarkpage({ useDefaultMarkpage: true });
					alert(
						"Il y a une erreur dans l'URL ou bien votre fichier n'est pas accessible",
					);
					console.log(error);
				}
			});
	} else {
		md = defaultMD;
		markpageData = parseMarkdown(md);
		createMarkpage(markpageData);
		if (md.includes("urlInput1")) {
			const urlInput1 = document.getElementById("urlInput1");
			const okButton1 = document.getElementById("okButton1");
			okButton1.addEventListener("click", () => redirectToUrl(urlInput1));
			urlInput1.addEventListener("keypress", (event) => {
				if (event.key === "Enter") {
					redirectToUrl(urlInput1);
				}
			});
		}
		if (md.includes("urlInput2")) {
			const urlInput2 = document.getElementById("urlInput2");
			const okButton2 = document.getElementById("okButton2");
			okButton2.addEventListener("click", () => redirectToUrl(urlInput2));
			urlInput2.addEventListener("keypress", (event) => {
				if (event.key === "Enter") {
					redirectToUrl(urlInput2);
				}
			});
		}
	}
}
