function detectDarkModeByPlugin() {
	const testElement = document.createElement("div");
	testElement.style.backgroundColor = "#ffffff"; // Couleur blanche par défaut
	testElement.style.color = "#000000"; // Texte noir par défaut
	testElement.style.display = "none";
	document.body.appendChild(testElement);

	const backgroundColor = window.getComputedStyle(testElement).backgroundColor;
	const color = window.getComputedStyle(testElement).color;
	document.body.removeChild(testElement);

	// Si les couleurs ne sont plus blanche/noir, il est probable qu'un plugin de mode sombre soit activé
	return backgroundColor !== "rgb(255, 255, 255)" || color !== "rgb(0, 0, 0)";
}

function processText2quiz(md) {
	md = md.replace(
		/<pre><code class="text2quiz language-.*?">((.|\n)*?)<\/code><\/pre>/gm,
		function (match, source) {
			source = source
				.replaceAll("\n\n\n", "\n\n")
				.replaceAll("&lt;", "<")
				.replaceAll("&gt;", ">")
				.replaceAll("&amp;", "&");
			source = encodeURI(source);
			const isDarkMode = detectDarkModeByPlugin();
			const theme = isDarkMode ? "t=dm" : "t=lm";
			return `<iframe class="iframeText2quiz" src="https://text2quiz.vercel.app/?v=1.0&dm=0&dh=0&dqt=0&${theme}#${source}"></iframe>`;
		},
	);
	return md;
}
