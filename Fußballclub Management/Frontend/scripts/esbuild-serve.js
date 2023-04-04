"use strict";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { serve } from "esbuild";
import { lessLoader } from "esbuild-plugin-less";
import path from "path";

import http from "http";

let serveResult = await serve({
    servedir: path.join(__dirname, "..", "static"),
}, {
    entryPoints: [path.join(__dirname, "..", "src", "app.js")],
    bundle: true,
    splitting: true,
    format: "esm",
    outdir: path.join(__dirname, "..", "static"),
    sourcemap: true,
    plugins: [lessLoader()],
    loader: {
        ".htm": "text",
        ".html": "text",
        ".svg": "text",
        ".ttf": "dataurl",
        ".woff": "dataurl",
        ".woff2": "dataurl",
        ".eot": "dataurl",
        ".jpg": "dataurl",
        ".png": "dataurl",
        ".gif": "dataurl",
    },
});

http.createServer((req, res) => {
    const {host, port} = serveResult;

    const options = {
        hostname: host,
        port: port,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };

    if (req.url === "/api.url") {
        // Sonderbehanldung für /api.url: Inhalt kommt aus $API_URL
        res.writeHead(200);
        res.write(process.env.API_URL);
        res.end();
    } else {
        // HTTP-Anfrage an esbuild weiterleiten
        const proxyReq = http.request(options, proxyRes => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, {end: true});
        });
      
        req.pipe(proxyReq, {end: true});
    }
}).listen(8080, () => {
    console.log("Listening on port 8080.");
    console.log(`API_URL is ${process.env.API_URL}.`);
});