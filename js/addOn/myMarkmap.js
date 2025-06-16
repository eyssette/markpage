function processMyMarkmap(md) {
	md = md.replace(
		/<pre><code class="myMarkmap language-.*?">((.|\n)*?)<\/code><\/pre>/gm,
		function (match, source) {
			source = encodeURI(source);
			return `<iframe src="https://mymarkmap.forge.apps.education.fr/?m=0#${source}" style="border:1px solid #DDD; border-radius:4px; width:90vw; height:500px; max-height:none;"></iframe>`;
		},
	);
	return md;
}
