// oxlint-disable import/no-nodejs-modules prefer-named-capture-group no-continue prefer-destructuring max-params unicorn/text-encoding-identifier-case unicorn/no-null require-unicode-regexp unicorn/escape-case unicorn/no-hex-escape
// Plugin Rollup/Rolldown : concatène et minifie les CSS importés dans le JS principal,
// puis minifie individuellement les CSS restants du dossier des styles.

import {
	ensurePathInsideRoot,
	getCssFiles,
	getSafeModulePath,
	resolveSafeCssImportPath,
} from "./secure-fs.mjs";
import fs from "node:fs";
import path from "node:path";
import { transform } from "lightningcss";

const CSS_IMPORT_LINE_REGEX = /^(\s*)import\s+['"]([^'"]+\.css)['"]\s*;?\s*$/;
const CSS_EXTENSION_SUFFIX_REGEX = /\.css$/;

// Récupère tous les fichiers CSS qui sont importés dans le fichier JS principal
function getImportedCssFiles(jsFile, jsContent, appRootPath) {
	const importedCssFiles = [];

	for (const line of jsContent.split("\n")) {
		const match = line.match(CSS_IMPORT_LINE_REGEX);
		if (!match) {
			continue;
		}

		const cssImportPath = match[2];
		const resolvedCssPath = resolveSafeCssImportPath(
			jsFile,
			cssImportPath,
			appRootPath,
		);

		if (resolvedCssPath === null) {
			throw new Error(
				`Import CSS refusé dans ${jsFile}: "${cssImportPath}". ` +
					`Utilisez uniquement un chemin relatif vers un fichier .css situé dans ${appRootPath}.`,
			);
		}

		const safeCssPath = ensurePathInsideRoot(
			appRootPath,
			resolvedCssPath,
			"fichier CSS importé",
		);

		if (!fs.existsSync(safeCssPath)) {
			throw new Error(
				`Fichier CSS introuvable dans ${jsFile}: "${cssImportPath}" -> ${safeCssPath}`,
			);
		}

		importedCssFiles.push(safeCssPath);
	}

	return importedCssFiles;
}

// Commente les lignes d'import CSS déjà prises en charge par ce plugin
function stripCssImportsFromJsContent(
	jsFile,
	jsContent,
	importedCssFiles,
	appRootPath,
) {
	const importedCssFilesSet = new Set(importedCssFiles);

	return jsContent
		.split("\n")
		.map((line) => {
			const match = line.match(CSS_IMPORT_LINE_REGEX);
			if (!match) {
				return line;
			}

			const resolvedCssPath = resolveSafeCssImportPath(
				jsFile,
				match[2],
				appRootPath,
			);
			if (
				resolvedCssPath === null ||
				!importedCssFilesSet.has(resolvedCssPath)
			) {
				return line;
			}

			return `${match[1]}// ${line.trim()}`;
		})
		.join("\n");
}

// Concatène tous les fichiers CSS importés dans le fichier JS principal
function concatenateImportedCssFiles(importedCssFiles, appRootPath) {
	let concatenatedCss = "";

	for (const cssFile of importedCssFiles) {
		const safeCssFile = ensurePathInsideRoot(
			appRootPath,
			cssFile,
			"fichier CSS concaténé",
		);
		concatenatedCss += `${fs.readFileSync(safeCssFile, "utf-8")}\n`;
	}

	return concatenatedCss;
}

function logGeneratedChunk(filePath, distRootPath) {
	const safeFilePath = ensurePathInsideRoot(
		distRootPath,
		filePath,
		"chunk généré",
	);
	const stats = fs.statSync(safeFilePath);
	const size = `${(stats.size / 1024).toFixed(2)} kB`;
	process.stdout.write(
		`\x1b[90m<DIR>/\x1b[0m\x1b[34m${path.relative(distRootPath, safeFilePath)}\x1b[0m  \x1b[90mchunk │ size: ${size}\x1b[0m\n`,
	);
}

function minifyCssToFile(inputCss, sourceFile, outputFile, distRootPath) {
	const sourceCode = Buffer.isBuffer(inputCss)
		? inputCss
		: Buffer.from(inputCss, "utf-8");
	const { code } = transform({
		filename: sourceFile,
		code: sourceCode,
		minify: true,
	});
	const safeOutputFile = ensurePathInsideRoot(
		distRootPath,
		outputFile,
		"fichier CSS minifié",
	);

	fs.mkdirSync(path.dirname(safeOutputFile), { recursive: true });
	fs.writeFileSync(safeOutputFile, code);
	logGeneratedChunk(safeOutputFile, distRootPath);
}

// Minifie le fichier CSS principal (styles.css) et l'enregistre dans dist/css
function minifyMainCss(importedCssFiles, options) {
	const { appRootPath, distStylesFolder, distRootPath } = options;
	const concatenatedCss = concatenateImportedCssFiles(
		importedCssFiles,
		appRootPath,
	);
	const safeDistStylesFolder = ensurePathInsideRoot(
		distRootPath,
		distStylesFolder,
		"dossier styles dist",
	);
	const mainCssFile = ensurePathInsideRoot(
		safeDistStylesFolder,
		"./styles.css",
		"fichier CSS principal",
	);
	const mainMinCssFile = ensurePathInsideRoot(
		safeDistStylesFolder,
		"./styles.min.css",
		"fichier CSS principal minifié",
	);
	minifyCssToFile(concatenatedCss, mainCssFile, mainMinCssFile, distRootPath);
}

// Minifie les fichiers CSS non importés du dossier des styles
function minifyNonImportedCssFiles(importedCssFiles, options) {
	const { stylesRootPath, distStylesFolder, distRootPath } = options;
	const safeDistStylesFolder = ensurePathInsideRoot(
		distRootPath,
		distStylesFolder,
		"dossier styles dist",
	);

	for (const stylesCssFile of getCssFiles(stylesRootPath)) {
		const safeStylesCssFile = ensurePathInsideRoot(
			stylesRootPath,
			stylesCssFile,
			"fichier CSS source",
		);
		const relativePath = path.relative(stylesRootPath, safeStylesCssFile);
		const normalizedRelativePath = relativePath.replaceAll("\\", "/");
		if (
			normalizedRelativePath.startsWith("../") ||
			normalizedRelativePath.includes("/../") ||
			path.isAbsolute(normalizedRelativePath)
		) {
			throw new Error(
				`Chemin CSS source hors du dossier autorisé: ${relativePath}`,
			);
		}

		const stylesMinCssFile = ensurePathInsideRoot(
			safeDistStylesFolder,
			normalizedRelativePath.replace(CSS_EXTENSION_SUFFIX_REGEX, ".min.css"),
			"fichier CSS minifié",
		);

		// On ignore le fichier CSS principal (déjà minifié dans minifyMainCss())
		if (path.basename(safeStylesCssFile) === "styles.css") {
			continue;
		}
		// On ignore les fichiers déjà importés dans le JS principal
		// (déjà intégrés et minifiés dans styles.css)
		const stylesCssFileAbsolute = safeStylesCssFile;
		if (importedCssFiles.includes(stylesCssFileAbsolute)) {
			continue;
		}

		minifyCssToFile(
			fs.readFileSync(safeStylesCssFile),
			safeStylesCssFile,
			stylesMinCssFile,
			distRootPath,
		);
	}
}

/**
 * Crée le plugin Rollup/Rolldown qui minifie les CSS :
 * - concatène et minifie les CSS importés dans le fichier JS principal
 * - minifie individuellement les CSS non importés du dossier des styles
 *
 * @param {object} options
 * @param {string} options.mainJsAbsolutePath - chemin absolu du fichier JS principal
 * @param {string} options.appRootPath - dossier racine de l'application (app/)
 * @param {string} options.stylesRootPath - dossier racine des styles (app/css/)
 * @param {string} options.distRootPath - dossier racine de la build (dist/)
 * @param {string} options.distStylesFolder - dossier des styles dans la build (dist/css/)
 */
export function createMinifyStylesPlugin(options) {
	const { mainJsAbsolutePath, appRootPath, stylesRootPath } = options;
	let importedCssFilesForBuild = [];

	return {
		name: "minify-styles",
		buildStart() {
			// Les CSS non importés en JS ne sont pas toujours dans le graphe de modules;
			// on les ajoute explicitement au watch mode pour déclencher un rebuild.
			for (const cssFile of getCssFiles(stylesRootPath)) {
				this.addWatchFile(path.resolve(cssFile));
			}
		},
		transform(code, id) {
			const modulePath = getSafeModulePath(id);
			if (modulePath !== mainJsAbsolutePath) {
				return null;
			}

			importedCssFilesForBuild = getImportedCssFiles(
				modulePath,
				code,
				appRootPath,
			);
			const transformedCode = stripCssImportsFromJsContent(
				modulePath,
				code,
				importedCssFilesForBuild,
				appRootPath,
			);

			if (transformedCode === code) {
				return null;
			}

			return {
				code: transformedCode,
				map: null,
			};
		},
		writeBundle() {
			// Si on a option.cssAlreadyMinified, on ne minifie pas les CSS importés dans le JS principal.
			if (options.cssAlreadyMinified) {
				return;
			}
			if (importedCssFilesForBuild.length === 0) {
				const safeMainJsAbsolutePath = ensurePathInsideRoot(
					appRootPath,
					mainJsAbsolutePath,
					"fichier JS principal",
				);
				const jsContent = fs.readFileSync(safeMainJsAbsolutePath, "utf-8");
				importedCssFilesForBuild = getImportedCssFiles(
					safeMainJsAbsolutePath,
					jsContent,
					appRootPath,
				);
			}

			minifyMainCss(importedCssFilesForBuild, options);
			minifyNonImportedCssFiles(importedCssFilesForBuild, options);
		},
	};
}
