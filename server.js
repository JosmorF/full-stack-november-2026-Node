import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import mimetypes from "mime-types";

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  const pathname = req.url;
  const PUBLIC_DIR = path.resolve("public");
  const filePath = path.join(PUBLIC_DIR, pathname);
  const extName = path.extname(pathname).toLowerCase();
  const mimetype = mimetypes.lookup(extName);

  if (mimetype) {
    try {
      const data = await readFile(filePath);
      res.writeHead(200, { "Content-Type": mimetype });
      res.end(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.error("Archivo no existe");
      } else {
        console.error("Error inesperado", error.message);
      }
      res.writeHead(400);
      res.end();
    }
  }

  if (pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const html = `
          <!doctype html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vanilla Node Web Server</title>
          <link rel="stylesheet" href="/styles.css" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
          <h1>Bienvenido a Vanilla Node Web Server</h1>
          <section>
            <h2>Prueba la API</h2>
            <ul>
              <li><a href="/api/health">/api/health</a></li>
              <li><a href="/api/time">/api/time</a></li>
            </ul>
          </section>
            <section>
            <h2>Imagen de node.js</h2>
            <img src="/node.jpg" alt="Imagen de node" width="120">
          </section>
      </body>
      </html>
         `;
    res.end(html);
  }

  if (pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    const response = JSON.stringify({ status: "ok" });
    res.end(response);
  }

  if (pathname === "/api/time") {
    res.writeHead(200, { "Content-Type": "application/json" });
    const date = new Date().toISOString();
    const response = JSON.stringify({ time: date });
    res.end(response);
  }
});

server.listen(PORT);
