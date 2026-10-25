import { yaml } from "../processMarkdown/yaml";

const arrow = document.getElementById("scroll-arrow");
let isFirstCheck = true;

function checkScroll() {
	// Si c'est la première fois qu'on appelle cette fonction, on ne fait rien, pour éviter que l'arrow disparaisse au chargement de la page
	if (isFirstCheck) {
		isFirstCheck = false;
		return;
	}

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

	checkScroll();
	window.addEventListener("resize", checkScroll);
	window.addEventListener("click", checkScroll);
	window.addEventListener("keydown", checkScroll);
}
