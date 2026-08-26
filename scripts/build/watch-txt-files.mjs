#!/usr/bin/env node
// oxlint-disable import/no-nodejs-modules unicorn/prefer-optional-catch-binding no-continue
import { ensurePathInsideRoot } from "./secure-fs.mjs";
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || "app";
const fileToTouch = process.argv[3] || path.join("app", "js", "main.mjs");
const debounceMs = 200;

const includeExts = new Set([
	".adoc",
	".asciidoc",
	".cfg",
	".conf",
	".csv",
	".diff",
	".ejs",
	".env",
	".eta",
	".haml",
	".handlebars",
	".hbs",
	".html",
	".ini",
	".j2",
	".jinja",
	".json",
	".latex",
	".liquid",
	".log",
	".markdown",
	".md",
	".mjml",
	".mustache",
	".njk",
	".patch",
	".po",
	".pot",
	".properties",
	".pug",
	".rst",
	".slim",
	".sql",
	".srt",
	".svg",
	".tex",
	".text",
	".toml",
	".tsv",
	".twig",
	".txt",
	".webmanifest",
	".xml",
	".yaml",
	".yml",
]);

process.stdout.write(
	`watch-txt-files: watching ${root} for text files, touching ${fileToTouch} on changes`,
);

const timers = new Map();

function touch(file) {
	try {
		const time = new Date();
		fs.utimesSync(file, time, time);
		process.stdout.write(`watch-txt-files: touched ${file}\n`);
	} catch (_e) {
		try {
			fs.closeSync(fs.openSync(file, "a"));
			fs.utimesSync(file, new Date(), new Date());
			process.stdout.write(`watch-txt-files: created+touched ${file}\n`);
		} catch (error) {
			process.stdout.write(
				`watch-txt-files: cannot touch file ${file}: ${error.message}\n`,
			);
		}
	}
}

function shouldHandle(filename) {
	const ext = path.extname(filename || "").toLowerCase();
	return includeExts.has(ext);
}

function isSafeBasename(name) {
	return (
		typeof name === "string" &&
		name.length > 0 &&
		!name.includes("\0") &&
		!name.includes("/") &&
		!name.includes("\\")
	);
}

function watchDir(dir) {
	try {
		fs.watch(dir, { persistent: true }, (event, filename) => {
			if (!filename) {
				return;
			}
			// ignore temp editors
			if (filename.endsWith("~") || filename.startsWith(".#")) {
				return;
			}

			if (!isSafeBasename(filename)) {
				return;
			}

			const pCandidate = `${dir}/${filename}`;
			const safePath = (() => {
				try {
					return ensurePathInsideRoot(
						path.resolve(root),
						pCandidate,
						"watched file",
					);
				} catch (_e) {
					// ignore
				}
			})();

			if (!safePath) {
				return;
			}

			const absTouch = path.normalize(path.resolve(fileToTouch));
			if (path.normalize(path.resolve(safePath)) === absTouch) {
				return;
			}

			if (!shouldHandle(filename)) {
				return;
			}

			const key = "touch";
			if (timers.has(key)) {
				clearTimeout(timers.get(key));
			}
			timers.set(
				key,
				setTimeout(() => {
					touch(fileToTouch);
					timers.delete(key);
				}, debounceMs),
			);
		});
	} catch (_err) {
		// ignore
	}

	try {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.isDirectory()) {
				// skip ignored dirs
				if (
					entry.name === "node_modules" ||
					entry.name === ".git" ||
					entry.name === "dist"
				) {
					continue;
				}
				if (!isSafeBasename(entry.name)) {
					continue;
				}
				watchDir(`${dir}/${entry.name}`);
			}
		}
	} catch (_err) {
		// ignore
	}
}

watchDir(root);

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
