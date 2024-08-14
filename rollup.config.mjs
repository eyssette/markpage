import terser from "@rollup/plugin-terser";
import { string } from "rollup-plugin-string";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";

export default {
	input: "js/main.js",
	output: {
		file: "script.min.js",
		format: "iife",
		plugins: [terser()],
		sourcemap: true,
	},
	plugins: [
		string({
			include: "*.md",
		}),
		postcss({
			extensions: [".css"],
			extract: "css/styles.min.css",
			minimize: true,
			plugins: [
				cssnano({
					preset: "default",
				}),
			],
		}),
	],
};
