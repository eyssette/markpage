function processFlashMD(md) {
	md = md.replace(
		/<pre><code class="flashmd language-.*?">((.|\n)*?)<\/code><\/pre>/gm,
		function (match, source) {
			source = source
				.replaceAll("\n\n\n", "\n\n")
				.replaceAll("&lt;", "<")
				.replaceAll("&gt;", ">")
				.replaceAll("&amp;", "&");
			source = window.btoa(encodeURIComponent(source));
			return `<iframe class="iframeFlashmd" src="https://flashmd.forge.apps.education.fr/?raw=1&révision&aléatoire&uneparune#${source}" style="border:0; width:100vw; height:400px; max-height:none;"></iframe>`;
		},
	);
	return md;
}
