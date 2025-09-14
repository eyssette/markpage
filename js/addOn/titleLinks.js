function titleLinks() {
	// Sélectionne tous les titres de niveaux 4, 5 et 6 (car les autres existent déjà sous la forme de liens dans Markpage)
	const headers = document.querySelectorAll("h4, h5, h6");

	headers.forEach((header) => {
		header.addEventListener("click", async () => {
			const baseUrl = window.location.href;
			const baseUrlWithHash = baseUrl.includes("#") ? baseUrl : baseUrl + "#";
			const title = encodeURIComponent(header.innerText.trim());

			// On précise le lien en récupérant le contenu avant et après le titre
			let prefix = "";
			let prevNode = header.previousSibling.previousSibling;
			if (prevNode) {
				const text = prevNode.textContent.trimEnd();
				const words = text.split(/\s+/);
				const lastWords = words.slice(-3).join(" ").trim();
				prefix = lastWords ? encodeURIComponent(lastWords) + "-," : "";
			}
			let suffix = "";
			let nextNode = header.nextSibling.nextSibling;
			if (nextNode) {
				const text = nextNode.textContent.trimEnd();
				const words = text.split(/\s+/);
				const firstWords = words.slice(0, 3).join(" ").trim();
				suffix = firstWords ? ",-" + encodeURIComponent(firstWords) : "";
			}

			const fragment = `${prefix}${title}${suffix}`;

			// Lien vers le titre avec un "text fragment"
			const fullUrl = `${baseUrlWithHash}:~:text=${fragment}`;
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
