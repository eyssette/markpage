export function setTheme(theme, allowedThemes, styleThemeElement) {
	// Possibilité d'utiliser un thème
	const themeName = theme.trim();
	const CSSfile = themeName.endsWith(".css") ? themeName : themeName + ".css";
	if (allowedThemes.includes(CSSfile)) {
		// theme = true;
		let themeURL = "css/theme/" + CSSfile;
		fetch(themeURL)
			.then((response) => response.text())
			.then((data) => {
				styleThemeElement.textContent = data;
				document.body.className =
					document.body.className + " theme-" + CSSfile.replace(".css", "");
			})
			.catch((error) => {
				styleThemeElement.textContent = "";
				document.body.className = document.body.className.replace(
					/theme-.*/,
					"",
				);
				console.error(error);
			});
	}
}
