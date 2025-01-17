function lightbox() {
	// Sélectionne toutes les images et les liens vers des PDF de la page
	const images = document.querySelectorAll("img");
	const pdfLinks = document.querySelectorAll("a[href$='.pdf']");

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

	// Crée un conteneur pour l'image ou le PDF
	const lightboxContent = document.createElement("div");
	lightboxContent.style.width = "90%";
	lightboxContent.style.height = "90%";
	lightboxContent.style.display = "flex";
	lightboxContent.style.justifyContent = "center";
	lightboxContent.style.alignItems = "center";

	// Crée un élément <img> pour afficher les images
	const lightboxImage = document.createElement("img");
	lightboxImage.style.maxWidth = "100%";
	lightboxImage.style.maxHeight = "100%";
	lightboxImage.style.objectFit = "contain";

	// Crée un élément <embed> pour afficher les PDFs
	const lightboxPDF = document.createElement("embed");
	lightboxPDF.style.width = "90%";
	lightboxPDF.style.height = "90%";
	lightboxPDF.style.border = "none";
	lightboxPDF.setAttribute("type", "application/pdf");

	// Ajoute le conteneur pour l'image ou le PDF
	lightboxContent.appendChild(lightboxImage);
	lightboxContent.appendChild(lightboxPDF);
	lightboxContainer.appendChild(lightboxContent);

	// Crée la croix de fermeture
	const closeButton = document.createElement("span");
	closeButton.innerHTML = "&times;";
	closeButton.style.position = "absolute";
	closeButton.style.top = "20px";
	closeButton.style.right = "20px";
	closeButton.style.fontSize = "30px";
	closeButton.style.color = "black";
	closeButton.style.cursor = "pointer";

	// Ajoute la croix de fermeture au conteneur
	lightboxContainer.appendChild(closeButton);
	document.body.appendChild(lightboxContainer);

	// Ouverture de la lightbox
	function openLightbox() {
		lightboxContainer.style.display = "flex";
		lightboxContainer.classList.add("lightbox-open");
		lightboxContainer.classList.remove("lightbox-closed");
	}

	// Fermeture de la lightbox
	function closeLightbox() {
		lightboxContainer.style.display = "none";
		lightboxImage.style.display = "none";
		lightboxPDF.style.display = "none";
		lightboxImage.src = "";
		lightboxPDF.src = "";
		lightboxContainer.classList.add("lightbox-closed");
		lightboxContainer.classList.remove("lightbox-open");
	}

	// Ferme la lightbox si on clique dessus
	lightboxContainer.addEventListener("click", (e) => {
		if (e.target === lightboxContainer || e.target === closeButton) {
			closeLightbox();
		}
	});

	// Ferme la lightbox dès qu'on appuie sur le clavier
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			closeLightbox();
		}
	});

	// Ajoute un écouteur de clic sur chaque image
	images.forEach((image) => {
		image.classList.add("lightboxAddOn");
		image.addEventListener("click", () => {
			lightboxImage.src = image.src;
			lightboxImage.style.display = "block";
			lightboxPDF.style.display = "none";
			openLightbox();
		});
	});

	// Ajoute un écouteur de clic sur chaque lien PDF
	pdfLinks.forEach((link) => {
		link.classList.add("lightboxAddOn");
		link.addEventListener("click", (e) => {
			e.preventDefault();
			lightboxPDF.src = link.href;
			lightboxPDF.style.display = "block";
			lightboxImage.style.display = "none";
			openLightbox();
		});
	});
}
