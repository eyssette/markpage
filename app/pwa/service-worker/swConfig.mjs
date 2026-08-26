// CONFIGURATION

// Le service worker est lié à une version : quand on passe à une nouvelle version, les anciens caches sont supprimés à l'activation du nouveau service worker.
export const APP_NAME = "markpage";
// Le numéro de version est automatiquement mis à jour lors d'un bump de version.
// NE PAS MODIFIER MANUELLEMENT
export const APP_VERSION = "4.23.2";
// On peut forcer manuellement le service worker à se réinstaller et à recharger les caches en changeant la version ci-dessous.
export const SW_VERSION = "0";

// Par défaut, le service worker se met à jour automatiquement quand une nouvelle version est disponible.
// C'est plus propre normalement de le faire via l'API "postMessage", mais il faut dans ce cas_là le gérer manuellement dans l'application et envoyer un message avec le type "SKIP_WAITING" pour forcer le service worker à se mettre à jour.
export const UPDATE_SERVICE_WORKER_WITH_POST_MESSAGE = false;

// Page affichée quand la navigation échoue complètement
export const OFFLINE_URL = "pwa/offline.html";

// Fichiers à mettre en cache dès l'installation
export const CRITICAL_PRECACHE_URLS = [
	"./",
	"index.html",
	OFFLINE_URL,
	"css/styles.min.css",
	"css/editor.min.css",
	"css/pad.min.css",
	"css/lightpad.min.css",
	"chunks/main.js",
	"iifeFallback.js",
	"script.min.js",
];

export const NON_CRITICAL_PRECACHE_URLS = [
	"favicon.svg",
	"pwa/manifest.webmanifest",
	"pwa/icon-192x192.png",
	"pwa/icon-512x512.png",
	"pwa/maskable-icon-192x192.png",
	"pwa/maskable-icon-512x512.png",
];

// Extensions considérées comme "assets statiques" → stale-while-revalidate
export const STATIC_ASSETS_EXTENSIONS = new Set([
	"js",
	"mjs",
	"css",
	"png",
	"jpg",
	"jpeg",
	"svg",
	"gif",
	"webp",
	"avif",
	"ico",
	"woff",
	"woff2",
	"ttf",
	"otf",
	"eot",
]);

// Extensions indiquant des fichiers à ne pas mettre en cache (fichiers lourds, vidéos, etc.)
export const NON_CACHEABLE_EXTENSIONS = new Set([
	"mp4",
	"webm",
	"mov",
	"avi",
	"mkv",
	"flv",
	"wmv",
	"ogg",
	"mp3",
	"wav",
	"flac",
	"aac",
	"m4a",
	"pdf",
	"doc",
	"docx",
	"xls",
	"xlsx",
	"ppt",
	"pptx",
	"zip",
	"rar",
	"7z",
	"tar",
	"gz",
	"iso",
	"exe",
	"dmg",
	"msi",
	"apk",
	"bin",
	"dat",
	"raw",
]);

// Extensions indiquant des fichiers de données texte
export const DATA_FILE_EXTENSIONS = new Set([
	"adoc",
	"asciidoc",
	"bib",
	"csv",
	"graphql",
	"handlebars",
	"hbs",
	"j2",
	"jinja",
	"json",
	"latex",
	"liquid",
	"markdown",
	"md",
	"mustache",
	"njk",
	"rmd",
	"sql",
	"sqlite",
	"tex",
	"toml",
	"tsv",
	"text",
	"txt",
	"xml",
	"yaml",
	"yml",
]);

// Applications web qui peuvent fournir des fichiers de données texte
export const APPS_PROVIDING_DATA_FILES = [
	"grist.numerique.gouv.fr",
	"docs.numerique.gouv.fr",
	"codimd.apps.education.fr",
	"pad.numerique.gouv.fr",
	"demo.hedgedoc.org",
	"digipage.app",
	"framapad.org",
	"digidoc.app",
	"gitlab.com",
	"gitlab.io",
	"framagit.org",
	"framagit.io",
	"github.com",
	"github.io",
	"gitlab.com",
	"forge.apps.education.fr",
	".apps.education.fr",
];

// Nombre max d'entrées gardées dans le cache (évite qu'il grossisse
// indéfiniment si l'app fetch beaucoup de fichiers différents).
export const CACHE_MAX_ENTRIES = 100;
// On limite le nombre d'entrées opaques (cross-origin) de manière plus importante pour éviter de saturer le cache avec des ressources externes.
export const MAX_OPAQUE_ENTRIES = 10;
// On limite la taille maximale des fichiers mis en cache pour éviter de saturer le cache avec des fichiers volumineux.
// oxlint-disable-next-line no-magic-numbers
export const MAX_CACHEABLE_SIZE_BYTES = 20 * 1024 * 1024;

// Header permettant au développeur de choisir explicitement une stratégie.
export const STRATEGY_HEADER = "X-Cache-Strategy";
// Paramètre d'URL permettant au développeur de choisir une stratégie.
export const STRATEGY_PARAM = "cache_strategy";

// Valeurs acceptées pour les stratégies.
export const STRATEGIES = new Set([
	"no-cache",
	"cache-first",
	"stale-while-revalidate",
	"network-first",
]);

// Timeout en ms pour la requête réseau avant de retomber sur le cache.
export const DEFAULT_TIMEOUT_MS = 5000;
