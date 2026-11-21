const hasExportParam = () =>
	new URL(window.location.href).searchParams.has("export");

export function leaveExportMode() {
	if (!hasExportParam()) return;
	const url = new URL(window.location.href);
	url.searchParams.delete("export");
	url.searchParams.delete("singlePage");
	window.location.href = url.href;
}

function enterExportMode() {
	const url = new URL(window.location.href);
	url.searchParams.delete("sec");
	url.searchParams.delete("subsec");
	url.searchParams.set("singlePage", "true");
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
