import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const distDir = join(root, 'dist');
const port = Number(process.env.PORT || 5175);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://127.0.0.1:${port}`).pathname);
  const requested = normalize(join(distDir, pathname));
  if (!requested.startsWith(distDir)) return join(distDir, 'index.html');
  if (existsSync(requested) && statSync(requested).isFile()) return requested;
  return join(distDir, 'index.html');
}

createServer((request, response) => {
  const filePath = resolvePath(request.url || '/');
  const type = types[extname(filePath)] || 'application/octet-stream';
  response.writeHead(200, { 'Content-Type': type });
  createReadStream(filePath).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Landing disponível em http://127.0.0.1:${port}/`);
});
