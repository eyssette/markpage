import "../css/styles.css";
import { getMarkdownContentAndCreateMarkpage } from "./processMarkdown/getData";
// Gestion du service worker pour que l'application fonctionne hors ligne et pour le caching des ressources (PWA : Progressive Web App)
import { registerServiceWorker } from "../pwa/registerServiceWorker.mjs";

registerServiceWorker();
getMarkdownContentAndCreateMarkpage();
