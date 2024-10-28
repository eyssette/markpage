function lightbox() {
	// Sélectionne toutes les images de la page
	const images = document.querySelectorAll("img");

	// Crée et configure le conteneur lightbox
	const lightboxContainer = document.createElement("div");
	lightboxContainer.id = "lightbox";
	lightboxContainer.style.position = "fixed";
	lightboxContainer.style.top = "0";
	lightboxContainer.style.left = "0";
	lightboxContainer.style.width = "100%";
	lightboxContainer.style.height = "100%";
	lightboxContainer.style.backgroundColor = "white";
	lightboxContainer.style.display = "none";
	lightboxContainer.style.justifyContent = "center";
	lightboxContainer.style.alignItems = "center";
	lightboxContainer.style.zIndex = "1000";

	// On affiche l'image agrandie dans la lightbox
	const lightboxImage = document.createElement("img");
	lightboxImage.style.width = "90%";
	lightboxImage.style.height = "90%";
	lightboxImage.style.maxHeight = "none";
	lightboxImage.style.objectFit = "contain"; // Maintient les proportions de l'image

	// Crée la croix de fermeture
	const closeButton = document.createElement("span");
	closeButton.innerHTML = "&times;";
	closeButton.style.position = "absolute";
	closeButton.style.top = "20px";
	closeButton.style.right = "20px";
	closeButton.style.fontSize = "30px";
	closeButton.style.color = "black";
	closeButton.style.cursor = "pointer";
	lightboxContainer.appendChild(lightboxImage);
	lightboxContainer.appendChild(closeButton);
	document.body.appendChild(lightboxContainer);

	// Fonction pour fermer la lightbox
	function closeLightbox() {
		lightboxContainer.style.display = "none";
	}

	// Ferme la lightbox si on clique dessus
	lightboxContainer.addEventListener("click", (e) => {
		closeLightbox();
	});

	// Ferme la lightbox dès qu'on appuie sur le clavier
	document.addEventListener("keydown", () => {
		closeLightbox();
	});

	// Ajoute un écouteur de clic sur chaque image pour déclencher la lightbox, mais seulement si l'image n'est pas dans un lien
	images.forEach((image) => {
		if (!image.closest("a")) {
			image.addEventListener("click", () => {
				lightboxImage.src = image.src;
				lightboxContainer.style.display = "flex";
			});
		}
	});
}
