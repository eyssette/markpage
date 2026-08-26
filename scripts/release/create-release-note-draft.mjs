#!/usr/bin/env node
// oxlint-disable no-console

// oxlint-disable-next-line import/no-nodejs-modules
import fs from "node:fs";

const args = process.argv.slice(2);

const usage = "❌ Usage: task release-draft -- <old_tag> <new_tag>";

if (args.length < 7 || args.length > 11) {
	console.error(usage);
	process.exit(1);
}

const [
	APP_NAME = "",
	VERSION = "",
	RELEASE_DATE = "",
	CHANGELOG_URL = "",
	ISSUES_URL = "",
	TAG_OLD = "",
	TAG_NEW = "",
] = args;

if (!TAG_OLD || !TAG_NEW) {
	console.error(usage);
	process.exit(1);
}

const data = {
	APP_NAME,
	VERSION,
	RELEASE_DATE,
	CHANGELOG_URL,
	ISSUES_URL,
};

let template = fs.readFileSync(
	"scripts/release/release-note-draft-template.md",
	"utf8",
);

template = template.replaceAll(
	/\{\{\s*(?<variable>[A-Z_][A-Z0-9_]*)\s*\}\}/gu,
	(_match, variable) => data[variable] ?? "",
);

process.stdout.write(template);
