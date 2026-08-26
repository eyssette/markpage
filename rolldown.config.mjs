// oxlint-disable unicorn/no-null import/no-nodejs-modules

import Raw from "unplugin-raw/rolldown";
import copy from "rollup-plugin-copy";
import { createMinifyStylesPlugin } from "./scripts/build/minify-css.mjs";
import del from "rollup-plugin-delete";
import livereload from "rollup-plugin-livereload";
import path from "node:path";
import { replacePlugin } from "rolldown/plugins";
import serve from "rollup-plugin-serve";
import svelte from "rollup-plugin-svelte";

// Version ECMAScript utilisée pour la compilation
const ECMA_VERSION = "es2020";

const appFolder = "app/";
const distFolder = "dist/";
const mainJsFileName = "main.mjs";
const scriptMinJsFileName = "script.min.js";
const cssFolder = "css/";

const mainJsFile = `${appFolder}js/${mainJsFileName}`;

const minifyStylesPluginOptions = {
	mainJsAbsolutePath: path.resolve(mainJsFile),
	appRootPath: path.resolve(appFolder),
	stylesRootPath: path.resolve(`${appFolder}${cssFolder}`),
	distRootPath: path.resolve(distFolder),
	distStylesFolder: cssFolder,
};

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const development =
	process.env.NODE_ENV &&
	(process.env.NODE_ENV === "development" ||
		process.env.NODE_ENV === "debug" ||
		process.env.NODE_ENV === "development-with-service-worker");
const debug = development && process.env.NODE_ENV === "debug";
const developmentWithServiceWorker =
	process.env.NODE_ENV &&
	process.env.NODE_ENV === "development-with-service-worker";

const PORT_DEV_SERVER = developmentWithServiceWorker ? 20_002 : 10_001;

const analyze = String(process.env.ANALYZE).toLowerCase() === "true";

async function getVisualizerPlugin() {
	if (!analyze) {
		return null;
	}

	const { visualizer } = await import("rollup-plugin-visualizer");
	return visualizer({
		filename: ".report/bundle-size/rollup-visualizer.html",
		title: "Rollup Visualizer",
		sourcemap: true,
	});
}

// Configuration de la compilation en ESM au lieu de IIFE (pour avoir un bundle plus léger et plus moderne) : c'est la configuration utilisée par défaut si le navigateur supporte les modules (ce qui est le cas de tous les navigateurs modernes)
const getEsmConfig = async () => ({
	input: mainJsFile,
	output: {
		dir: `${distFolder}chunks`,
		format: "esm",
		sourcemap: true,
		// En développement, on évite le mangle pour faciliter le débogage.
		minify: debug ? false : { mangle: true },
		comments: false,
	},
	transform: {
		target: ECMA_VERSION,
	},

	// On a déjà minifié les CSS dans le bundle IIFE, donc on ne le fait pas dans le bundle ESM : on rajoute l'option cssAlreadyMinified : true
	plugins: [
		// Supprime le contenu du dossier dist avant de compiler
		del({ targets: "dist/*" }),

		// Copie les fichiers du dossier app vers le dossier dist
		copy({
			targets: [{ src: [`${appFolder}**/*`], dest: distFolder }],
			flatten: false,
		}),
		// Import de fichiers en tant que chaînes de caractères (comme les fichiers Markdown) dans le code JavaScript
		Raw(),
		svelte({
			compilerOptions: {
				customElement: true,
			},
		}),
		await createMinifyStylesPlugin(minifyStylesPluginOptions),

		replacePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		}),
		// En mode développement, lance un serveur de développement et recharge la page automatiquement lorsqu'un fichier est modifié
		development &&
			serve({
				port: PORT_DEV_SERVER,
				contentBase: [distFolder, "./"],
				open: !debug,
			}),
		development && livereload({ port: PORT_DEV_SERVER, delay: 300 }),

		await getVisualizerPlugin(),
	],
});

// Configuration de la compilation en IIFE (utilisé si le navigateur ne supporte pas les modules : ce qui est le cas notamment si l'application est ouverte en local dans un navigateur, sans serveur web)
const getIifeConfig = async () => ({
	input: mainJsFile,
	output: {
		file: distFolder + scriptMinJsFileName,
		format: "iife",
		sourcemap: true,
		// En développement, on évite le mangle pour faciliter le débogage.
		minify: debug ? false : { mangle: true },
		strict: true,
		comments: false,
	},
	transform: {
		target: ECMA_VERSION,
	},
	plugins: [
		// Import de fichiers en tant que chaînes de caractères (comme les fichiers Markdown) dans le code JavaScript
		Raw(),

		svelte({
			compilerOptions: {
				customElement: true,
			},
		}),

		// Concatène et minifie les CSS (importés en JS + fichiers autonomes du dossier styles)
		await createMinifyStylesPlugin({
			...minifyStylesPluginOptions,
			cssAlreadyMinified: true,
		}),

		replacePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		}),
	],
});

// Compilation du script de fallback qui permet de basculer sur le bundle IIFE si le navigateur ne supporte pas les modules
const iifeFallbackConfig = {
	input: `${appFolder}js/iifeFallback.js`,
	output: {
		dir: `${distFolder}`,
		format: "iife",
		sourcemap: false,
		minify: { mangle: true },
		strict: true,
	},
	transform: {
		target: ECMA_VERSION,
	},
};

// Compilation du service worker (sw.mjs)
const swConfig = {
	input: `${appFolder}sw.mjs`,
	output: {
		file: `${distFolder}sw.js`,
		format: "iife",
		sourcemap: false,
		minify: { mangle: true },
		strict: true,
	},
	transform: {
		target: ECMA_VERSION,
	},
	plugins: [
		replacePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		}),
	],
};

const getConfigBasedOnEnvironment = async () => {
	const esmConfig = await getEsmConfig();
	const iifeConfig = await getIifeConfig();

	if (development && !developmentWithServiceWorker) {
		// En mode développement (et sans le mode service worker), on compile seulement en ESM pour que le rechargement de la page fonctionne correctement
		return [esmConfig, iifeFallbackConfig];
	}

	// Sinon, on compile dans les deux formats (ESM et IIFE) pour que l'application fonctionne sur tous les navigateurs, et on compile aussi le service worker [pour que l'application fonctionne hors ligne et pour le caching des ressources (mode PWA : Progressive Web App)]

	return [esmConfig, iifeConfig, iifeFallbackConfig, swConfig];
};

// Configuration de la compilation avec Rolldown
async function createBuildConfig() {
	return await getConfigBasedOnEnvironment();
}

export default await createBuildConfig();
