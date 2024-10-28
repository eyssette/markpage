function krokiCreateImageFromSource(type, source) {
	const dataKroki = new TextEncoder("utf-8").encode(source);
	const dataKrokiCompressed = pako.deflate(dataKroki, {
		level: 9,
		to: "string",
	});
	const dataKrokiCompressedFormatted = btoa(dataKrokiCompressed)
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
	const urlImage =
		"https://kroki.io/" + type + "/svg/" + dataKrokiCompressedFormatted;
	const image = '<img src="' + urlImage + '" />';
	return image;
}

function processKroki(md) {
	md = md.replace(
		/<pre><code class="(mermaid|tikz|graphviz|plantuml|excalidraw|vegalite|vega) language-.*?">((.|\n)*?)<\/code><\/pre>/gm,
		function (match, type, source) {
			source = source
				.replaceAll("\n\n\n", "\n\n")
				.replaceAll("&lt;", "<")
				.replaceAll("&gt;", ">")
				.replaceAll("&amp;", "&");
			return krokiCreateImageFromSource(type, source);
		},
	);
	return md;
}
