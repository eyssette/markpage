import { yaml } from "../processMarkdown/yaml";

const arrow = document.getElementById("scroll-arrow");

function checkScroll() {
	let scrollable = 0;
	let scrolled = 0;

	if (yaml.lightpad) {
		const innerBox = document.querySelector("#innerBox");
		scrollable = innerBox.scrollWidth - window.innerWidth;
		scrolled = innerBox.scrollLeft;
	} else {
		scrollable = document.documentElement.scrollHeight - window.innerHeight;
		scrolled = window.scrollY;
	}
	const isAtEnd = scrolled >= scrollable - 5;

	arrow.style.opacity = isAtEnd ? "0" : "0.6";
}

export function checkScrollListener() {
	if (yaml.lightpad) {
		document.querySelector("#innerBox").addEventListener("scroll", checkScroll);
		arrow.textContent = "→";
	} else {
		window.addEventListener("scroll", checkScroll);
	}

	window.addEventListener("load", checkScroll);
	window.addEventListener("resize", checkScroll);
	window.addEventListener("click", checkScroll);
	window.addEventListener("keydown", checkScroll);
}
