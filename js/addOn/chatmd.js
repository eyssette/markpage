function processChatMD(md) {
	md = md.replace(
		/<pre><code class="chatmd language-.*?">((.|\n)*?)<\/code><\/pre>/gm,
		function (match, source) {
			source = source
				.replaceAll("\n\n\n", "\n\n")
				.replaceAll("&lt;", "<")
				.replaceAll("&gt;", ">")
				.replaceAll("&amp;", "&");
			source = window.btoa(encodeURIComponent(source));
			return `<iframe class="iframeText2quiz" src="https://chatmd.forge.apps.education.fr/?raw=1#${source}" style="border:0; width:100vw; height:700px; max-height:none;"></iframe>`;
		},
	);
	return md;
}
