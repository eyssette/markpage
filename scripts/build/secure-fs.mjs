// oxlint-disable import/no-nodejs-modules no-continue unicorn/no-null prefer-destructuring require-unicode-regexp
// Utilitaires pour manipuler des chemins de fichiers de façon sécurisée
// (protection contre les traversées de répertoire, chemins absolus non désirés, etc.)

import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import path from "node:path";

const RELATIVE_CSS_IMPORT_PATH_REGEX =
	/^(?:\.{1,2}[\\/])[A-Za-z0-9._\-/]+\.css$/;

/**
 * Vérifie qu'un chemin candidat reste bien à l'intérieur d'un dossier racine autorisé.
 * Lève une erreur si ce n'est pas le cas. Retourne le chemin absolu résolu sinon.
 */
export function ensurePathInsideRoot(rootPath, candidatePath, label = "path") {
	if (
		typeof rootPath !== "string" ||
		rootPath.length === 0 ||
		typeof candidatePath !== "string" ||
		candidatePath.length === 0 ||
		candidatePath.includes("\0")
	) {
		throw new Error(`Chemin invalide pour ${label}.`);
	}

	const normalizedRoot = path.normalize(rootPath);
	const normalizedRootWithSlash = `${normalizedRoot}${path.sep}`;
	const candidateWithoutTraversal = candidatePath.replace(
		/^(?:\.\.(?:\/|\\|$))+/,
		"",
	);
	const candidateWithoutNullByte = candidateWithoutTraversal.replaceAll(
		"\0",
		"",
	);
	const candidateAsPosixPath = candidateWithoutNullByte.replaceAll("\\", "/");
	const absolutePath = path.isAbsolute(candidateWithoutNullByte)
		? path.normalize(candidateWithoutNullByte)
		: fileURLToPath(
				new URL(candidateAsPosixPath, pathToFileURL(normalizedRootWithSlash)),
			);
	const relativeToRoot = path.relative(normalizedRoot, absolutePath);

	if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
		throw new Error(`Chemin hors du dossier autorisé pour ${label}.`);
	}

	return absolutePath;
}

/**
 * Parcourt récursivement un dossier et retourne la liste de tous les fichiers .css trouvés.
 * Ignore les liens symboliques.
 */
export function getCssFiles(rootFolderPath) {
	const cssFiles = [];
	const safeRootPath = ensurePathInsideRoot(
		process.cwd(),
		rootFolderPath,
		"dossier CSS racine",
	);

	function walkDirectory(currentFolderPath) {
		const safeCurrentFolderPath = ensurePathInsideRoot(
			safeRootPath,
			currentFolderPath,
			"dossier CSS",
		);

		for (const dirent of fs.readdirSync(safeCurrentFolderPath, {
			withFileTypes: true,
		})) {
			const entryPath = ensurePathInsideRoot(
				safeRootPath,
				`${safeCurrentFolderPath}/${dirent.name}`,
				"entrée CSS",
			);

			if (dirent.isSymbolicLink()) {
				continue;
			}

			if (dirent.isDirectory()) {
				walkDirectory(entryPath);
				continue;
			}

			if (dirent.isFile() && entryPath.endsWith(".css")) {
				cssFiles.push(entryPath);
			}
		}
	}

	if (fs.existsSync(safeRootPath)) {
		walkDirectory(safeRootPath);
	}

	return cssFiles;
}

/**
 * Résout un chemin d'import CSS relatif écrit dans un fichier JS, en s'assurant
 * qu'il reste bien à l'intérieur du dossier racine de l'application.
 * Retourne `null` si le chemin est syntaxiquement invalide/non autorisé.
 * Lève une erreur (via ensurePathInsideRoot) si le chemin résolu sort du dossier racine.
 */
export function resolveSafeCssImportPath(jsFile, cssImportPath, appRootPath) {
	if (typeof cssImportPath !== "string" || cssImportPath.includes("\0")) {
		return null;
	}

	// Autorise uniquement des chemins relatifs vers des fichiers .css.
	if (!RELATIVE_CSS_IMPORT_PATH_REGEX.test(cssImportPath)) {
		return null;
	}

	const normalizedImportPath = cssImportPath.replaceAll("\\", "/");
	if (normalizedImportPath.startsWith("/")) {
		return null;
	}

	const baseDirUrl = new URL("./", pathToFileURL(jsFile));
	const resolvedCssUrl = new URL(normalizedImportPath, baseDirUrl);
	const resolvedCssPath = ensurePathInsideRoot(
		appRootPath,
		fileURLToPath(resolvedCssUrl),
		"import CSS",
	);
	const relativeToAppRoot = path.relative(appRootPath, resolvedCssPath);

	if (
		relativeToAppRoot.startsWith("..") ||
		path.isAbsolute(relativeToAppRoot)
	) {
		return null;
	}

	return resolvedCssPath;
}

/**
 * Normalise et valide l'identifiant de module fourni par Rollup/Rolldown
 * (retire les query strings/fragments, résout les URLs file://, etc.)
 * Retourne `null` si l'identifiant n'est pas un chemin absolu exploitable.
 */
export function getSafeModulePath(moduleId) {
	if (typeof moduleId !== "string") {
		return null;
	}

	const normalizedId = moduleId.split("?")[0].split("#")[0];
	if (normalizedId.length === 0 || normalizedId.includes("\0")) {
		return null;
	}

	if (normalizedId.startsWith("file://")) {
		try {
			return fileURLToPath(normalizedId);
		} catch {
			return null;
		}
	}

	if (!path.isAbsolute(normalizedId)) {
		return null;
	}

	return path.normalize(normalizedId);
}
