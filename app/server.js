import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PAGE_DIR = join(ROOT, 'page');
const HTML_PATH = join(PAGE_DIR, 'original.html');
const CHANGES_PATH = join(PAGE_DIR, 'changes.js');
const PORT = parseInt(process.env.PORT || '3000');

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

function broadcast() {
  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'reload' }));
    }
  }
}

const LIVE_RELOAD_SCRIPT = `<script>
(function() {
  var ws = new WebSocket('ws://' + location.host);
  ws.onmessage = function(e) { if (JSON.parse(e.data).type === 'reload') location.reload(); };
  ws.onclose = function() { setTimeout(function() { location.reload(); }, 2000); };
})();
</script>`;

const PLACEHOLDER = `<!DOCTYPE html>
<html>
<head><title>Experiment Builder</title>
<style>body{font-family:sans-serif;max-width:600px;margin:80px auto;padding:0 20px}code{background:#f0f0f0;padding:2px 6px;border-radius:3px}</style>
</head>
<body>
<h2>No page fetched yet</h2>
<p>Run <code>/fetch &lt;url&gt;</code> in Claude Code to get started.</p>
${LIVE_RELOAD_SCRIPT}
</body>
</html>`;

function noCache(res) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
}

app.get('/changes.js', (req, res) => {
  noCache(res);
  if (!existsSync(CHANGES_PATH)) return res.type('js').send('');
  res.type('js').send(readFileSync(CHANGES_PATH, 'utf8'));
});

app.get('/', (req, res) => {
  if (!existsSync(HTML_PATH)) return res.send(PLACEHOLDER);

  let html = readFileSync(HTML_PATH, 'utf8');

  const base = `http://localhost:${PORT}`;
  const injection = `  <script src="${base}/changes.js"></script>
  ${LIVE_RELOAD_SCRIPT}`;

  html = html.replace(/<\/body>/i, `${injection}\n</body>`);

  res.type('html').send(html);
});

chokidar.watch(PAGE_DIR, { ignoreInitial: true }).on('all', () => {
  broadcast();
});

server.listen(PORT, () => {
  console.log(`\n  Local preview: http://localhost:${PORT}`);
  console.log(`  Watching page/ for changes...\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nError: Port ${PORT} is already in use.`);
    console.error(`Kill the process using it or run with PORT=<other> npm start\n`);
    process.exit(1);
  }
  throw err;
});
