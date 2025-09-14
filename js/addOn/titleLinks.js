function titleLinks() {
	// Sélectionne tous les titres de niveaux 4, 5 et 6 (car les autres existent déjà sous la forme de liens dans Markpage)
	const headers = document.querySelectorAll("h4, h5, h6");

	headers.forEach((header) => {
		header.addEventListener("click", async () => {
			const baseUrl = window.location.href;
			const baseUrlWithHash = baseUrl.includes("#") ? baseUrl : baseUrl + "#";
			const title = header.innerText.trim();
			const encoded = encodeURIComponent(title);
			// Lien vers le titre avec un "text fragment"
			const fullUrl = `${baseUrlWithHash}:~:text=${encoded}`;
			try {
				await navigator.clipboard.writeText(fullUrl);
				header.setAttribute("data-copied", "true");
				setTimeout(() => {
					header.removeAttribute("data-copied");
				}, 3000);
			} catch (err) {
				console.error("Échec de la copie :", err);
			}
		});
	});
}
