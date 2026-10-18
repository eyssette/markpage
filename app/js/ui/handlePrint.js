const hasExportParam = () =>
	new URL(window.location.href).searchParams.has("export");

export function leaveExportMode() {
	if (!hasExportParam()) return;
	const url = new URL(window.location.href);
	url.searchParams.delete("export");
	window.location.href = url.href;
}

function enterExportMode() {
	const url = new URL(window.location.href);
	url.searchParams.set("export", "true");
	window.location.href = url.href;
}

export function handlePrint() {
	window.addEventListener("afterprint", leaveExportMode);

	window.addEventListener("beforeprint", () => {
		if (hasExportParam()) return;
		enterExportMode();
	});
}
