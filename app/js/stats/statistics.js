function generateUUID() {
	let d = new Date().getTime();
	if (
		typeof performance !== "undefined" &&
		typeof performance.now === "function"
	) {
		d += performance.now(); // Utilise la haute résolution si disponible
	}
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r = ((d + Math.random() * 16) % 16) | 0;
		d = Math.floor(d / 16);
		return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
	});
}

function getBaseUrl() {
	const hasBaseUrlInHash =
		window.location.origin.includes("markpage.") ||
		window.location.origin.includes("lightpad.") ||
		window.location.origin.includes("localhost");

	if (hasBaseUrlInHash) {
		const hash = window.location.hash && window.location.hash.substring(1);
		return hash || window.location.origin;
	}
	return window.location.origin;
}

const userId = generateUUID();

let index = 0;

export function getStatsData(options = {}) {
	const websiteName =
		options && options.websiteName
			? options.websiteName
			: document.querySelector("h1").textContent || "";
	const statsData = {
		website_name: websiteName,
		website_url: window.location.href,
		website_base_url: getBaseUrl(),
		connexion_id: userId,
		connexion_date: new Date().toISOString(),
		connexion_view_index: index,
	};
	index++;
	return statsData;
}

export function sendStatsData(yaml, statsData) {
	const destination = yaml && yaml.stats && yaml.stats.destination;
	if (destination === "console") {
		console.log(statsData);
	}
	if (destination.startsWith("http")) {
		// On envoie les données de statistiques à l'URL spécifiée dans le YAML
		fetch(destination, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(statsData),
		}).catch((error) => {
			console.error("Erreur lors de l'envoi des statistiques :", error);
		});
	}
}
