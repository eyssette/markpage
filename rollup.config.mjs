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
			include: ["css/styles.css"],
			extract: "css/styles.min.css",
			minimize: true,
			plugins: [
				cssnano({
					preset: "default",
				}),
			],
		}),
		postcss({
			extensions: [".css"],
			include: ["css/oneByOne.css"],
			extract: "css/oneByOne.min.css",
			minimize: true,
			plugins: [
				cssnano({
					preset: "default",
				}),
			],
		}),
		postcss({
			extensions: [".css"],
			include: ["css/pad.css"],
			extract: "css/pad.min.css",
			minimize: true,
			plugins: [
				cssnano({
					preset: "default",
				}),
			],
		}),
		postcss({
			extensions: [".css"],
			include: ["css/lightpad.css"],
			extract: "css/lightpad.min.css",
			minimize: true,
			plugins: [
				cssnano({
					preset: "default",
				}),
			],
		}),
	],
};
