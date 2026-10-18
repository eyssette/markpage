function copycode() {
	document.querySelectorAll("pre code").forEach((block) => {
		const pre = block.parentElement;

		if (pre.querySelector(".copy-button")) return;

		// Crée une zone scrollable autour du code
		const scrollContainer = document.createElement("div");
		scrollContainer.className = "code-scroll";

		pre.insertBefore(scrollContainer, block);
		scrollContainer.appendChild(block);

		// Crée le bouton dans le pre
		const copyButton = document.createElement("button");
		copyButton.innerText = "Copier";
		copyButton.className = "copy-button";

		copyButton.addEventListener("click", () => {
			navigator.clipboard
				.writeText(block.innerText)
				.then(() => {
					copyButton.innerText = "Copié !";
					setTimeout(() => {
						copyButton.innerText = "Copier";
					}, 2000);
				})
				.catch(console.error);
		});

		pre.appendChild(copyButton);
	});
}
