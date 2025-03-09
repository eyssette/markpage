setTimeout(() => {
	// Sélectionne tous les blocs <pre><code>
	const codeBlocks = document.querySelectorAll("pre code");
	codeBlocks.forEach((block) => {
		// Crée le bouton Copier
		const copyButton = document.createElement("button");
		copyButton.innerText = "Copier";
		copyButton.style.position = "absolute";
		copyButton.style.top = "5px";
		copyButton.style.right = "5px";
		copyButton.style.padding = "5px 10px";
		copyButton.style.fontSize = "12px";
		copyButton.style.cursor = "pointer";
		copyButton.style.border = "none";
		copyButton.style.borderRadius = "3px";
		copyButton.style.backgroundColor = "#0071F0";
		copyButton.style.color = "white";
		copyButton.style.zIndex = "10";

		// Positionne le conteneur <pre> en relatif
		const pre = block.parentElement;
		pre.style.position = "relative";

		// Ajoute un écouteur d'événement au bouton
		copyButton.addEventListener("click", () => {
			// Copie le contenu du bloc code
			navigator.clipboard
				.writeText(block.innerText)
				.then(() => {
					copyButton.innerText = "Copié !";
					setTimeout(() => (copyButton.innerText = "Copier"), 2000);
				})
				.catch((err) => {
					console.error("Erreur lors de la copie", err);
				});
		});
		// Ajoute le bouton au conteneur <pre>
		pre.appendChild(copyButton);
		pre.style.padding = "3em 2em 1em 2em";
	});
}, 300);
