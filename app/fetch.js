import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STATE_PATH = join(__dirname, 'state.json');

const url = process.argv[2];

if (!url) {
  console.error('\nUsage: node fetch.js <url>\n');
  process.exit(1);
}

function urlToSlug(rawUrl) {
  return rawUrl
    .replace(/^https?:\/\//, '')
    .replace(/[/.?=&#]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

console.log(`\nFetching ${url}...`);

let res;
try {
  res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ExperimentBot/1.0)' }
  });
} catch (err) {
  console.error(`\nFetch failed: ${err.message}\n`);
  process.exit(1);
}

if (!res.ok) {
  const body = await res.text();
  console.error(`\nHTTP ${res.status} from ${url}`);
  console.error(body.slice(0, 500) + '\n');
  process.exit(1);
}

let html = await res.text();

const iframeCount = (html.match(/<iframe/gi) || []).length;
html = html.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
console.log(`Stripping iframes... removed ${iframeCount}`);

const origin = new URL(url).origin;
html = html.replace(/(<head[^>]*>)/i, `$1\n  <base href="${origin}/">`);
console.log(`Injecting base tag: ${origin}`);

const slug = urlToSlug(url);
const dir = join(ROOT, 'pages', slug);
mkdirSync(dir, { recursive: true });

writeFileSync(join(dir, 'original.html'), html, 'utf8');

writeFileSync(join(dir, 'changes.js'), `// Optimizely Custom JS — paste this into the Custom Code box in Optimizely when done.
// ES2015 (ES6) syntax only. AVOID: object spread {...x}, async/await, optional chaining ?., nullish ??.
// Optimizely runs this BEFORE DOMContentLoaded — use waitForElement for DOM changes.
(function() {
  const injectStyles = (css) => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  };

  const waitForElement = (selector, callback, timeout = 5000) => {
    const start = Date.now();
    const tick = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(tick);
        callback(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(tick);
      }
    }, 50);
  };

  // CSS first — fastest, runs synchronously, survives WordPress re-renders.
  injectStyles(\`
    /* .target { display: none !important; } */
  \`);

  // DOM changes via waitForElement.
  // waitForElement('.hero h1', (el) => {
  //   el.textContent = 'New headline';
  // });
})();
`, 'utf8');

const state = {
  url,
  slug,
  domain: origin,
  status: 'fetched',
  startedAt: new Date().toISOString()
};

writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');

const sizeKb = (html.length / 1024).toFixed(1);
console.log(`Saved: pages/${slug}/original.html (${sizeKb} KB)`);
console.log(`Created: pages/${slug}/changes.js`);

const previewUrl = `http://localhost:${process.env.PORT || 3000}`;
try {
  await open(previewUrl);
  console.log(`\nOpened ${previewUrl} in your browser. Tell Claude what to change.\n`);
} catch {
  console.log(`\nOpen ${previewUrl} in your browser. Tell Claude what to change.\n`);
}
