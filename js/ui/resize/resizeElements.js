import { yaml } from "../../processMarkdown/yaml.js";
import { adjustHeight } from "./adjustHeight.js";

export function resizeElements() {
	const hasNoColumns = document.body.classList.contains("noColumns");
	const sectionContentElement = document.querySelectorAll(".sectionContent");
	sectionContentElement.forEach((element) => {
		adjustHeight(element, { isSubSection: false });
	});
	if (hasNoColumns && window.matchMedia("(min-width: 500px)").matches) {
		const subSectionContentElement =
			document.querySelectorAll(".subSectionContent");
		subSectionContentElement.forEach((element) => {
			adjustHeight(element, { isSubSection: true });
		});
	}
	if (yaml && yaml.bandeau && window.matchMedia("(min-width: 500px)").matches) {
		const contentElement = document.querySelector("#content");
		const bannerElementHeight = document.querySelector(".banner").offsetHeight;
		let marginTop = hasNoColumns
			? bannerElementHeight + 30
			: bannerElementHeight + 10;
		marginTop = Math.max(70, marginTop);
		contentElement.style.marginTop = `${marginTop}px`;
	}
}
