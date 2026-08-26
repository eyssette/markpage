// oxlint-disable import/no-nodejs-modules no-console
import fs, { createReadStream } from "node:fs";
import crypto from "node:crypto";
import http from "node:http";
import path from "node:path";

const PORT = process.argv[2] || 8888;

const DIST_FOLDER = "/dist";

// Type MIME sécurisé
const MIME_TYPES = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".svg": "image/svg+xml",
	".json": "application/json; charset=utf-8",
	".txt": "text/plain; charset=utf-8",
	".ico": "image/x-icon",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
};

// Serveur HTTP sécurisé
const server = http.createServer((request, response) => {
	// Limite la taille maximale des requêtes pour éviter le DoS
	if (request.headers["content-length"] > 1024) {
		response.writeHead(413, { "Content-Type": "text/plain" });
		response.end("413 Payload Too Large");
		return;
	}

	const parsedUrl = new URL(
		request.url || "/",
		`http://${request.headers.host || "localhost"}`,
	);
	const publicPath = decodeURIComponent(
		parsedUrl.pathname === "/" ? "/index.html" : parsedUrl.pathname,
	);
	const requestedPath = path.normalize(path.join(DIST_FOLDER, publicPath));

	// Vérifie que le chemin demandé est dans le répertoire autorisé
	if (!requestedPath.startsWith(DIST_FOLDER + path.sep)) {
		response.writeHead(403, { "Content-Type": "text/plain" });
		response.end(`403 Forbidden: Access Denied / ${requestedPath}`);
		return;
	}

	const filePath = path.join(process.cwd(), requestedPath);

	// Déterminer le type MIME
	const extension = path.extname(filePath);
	const contentType = MIME_TYPES[extension] || "application/octet-stream";

	// Lecture sécurisée du fichier
	fs.access(filePath, fs.constants.F_OK, (errorFileNotFound) => {
		if (errorFileNotFound) {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.end("404 Not Found: File does not exist");
			return;
		}

		if (requestedPath === `${DIST_FOLDER}/index.html`) {
			fs.readFile(filePath, "utf8", (errorInternalServer, data) => {
				if (errorInternalServer) {
					response.writeHead(500, { "Content-Type": "text/plain" });
					response.end("500 Internal Server Error");
					return;
				}

				const nonce = crypto.randomBytes(16).toString("base64");

				response.writeHead(200, {
					"Content-Type": contentType,
					"X-Content-Type-Options": "nosniff",
					"Content-Security-Policy": `script-src 'self' 'nonce-${nonce}'`,
					"Strict-Transport-Security":
						"max-age=63072000; includeSubDomains; preload",
					"Cache-Control": "no-cache, no-store, must-revalidate",
					Pragma: "no-cache",
					Expires: "0",
				});
				response.end(data);
			});
		} else {
			// Diffusion du fichier en streaming pour les autres fichiers
			response.writeHead(200, {
				"Content-Type": contentType,
				"X-Content-Type-Options": "nosniff",
				"Content-Security-Policy": "script-src 'self'",
				"Strict-Transport-Security":
					"max-age=63072000; includeSubDomains; preload",
				"Cache-Control": "no-cache, no-store, must-revalidate",
				Pragma: "no-cache",
				Expires: "0",
			});

			const stream = createReadStream(filePath);
			stream.on("error", (errorFileRead) => {
				console.error("File read error:", errorFileRead);
				response.writeHead(500, { "Content-Type": "text/plain" });
				response.end("500 Internal Server Error");
			});
			stream.pipe(response);
		}
	});
});

// Démarrage du serveur
server.listen(PORT, () => {
	console.log(
		`Static file server running at:\n  => http://localhost:${PORT}/index.html\nCTRL + C to shutdown`,
	);
});
