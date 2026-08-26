export async function setTheme(theme, allowedThemes, styleThemeElement) {
	// Possibilité d'utiliser un thème
	const themeName = theme.trim();
	const CSSfile = themeName.endsWith(".css") ? themeName : themeName + ".css";
	if (allowedThemes.includes(CSSfile)) {
		try {
			// theme = true;
			let themeURL = "css/theme/" + CSSfile;
			const response = await fetch(themeURL);
			const data = await response.text();
			styleThemeElement.textContent = data;
			document.body.className =
				document.body.className + " theme-" + CSSfile.replace(".css", "");
		} catch (error) {
			styleThemeElement.textContent = "";
			document.body.className = document.body.className.replace(/theme-.*/, "");
			console.error(error);
		}
	}
}
