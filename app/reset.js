import { writeFileSync, existsSync, readdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const statePath = join(__dirname, 'state.json');
const pagesDir = join(ROOT, 'pages');

const IDLE_STATE = {
  url: null,
  slug: null,
  domain: null,
  status: 'idle',
  startedAt: null
};

let deletedAny = false;
if (existsSync(pagesDir)) {
  for (const entry of readdirSync(pagesDir)) {
    rmSync(join(pagesDir, entry), { recursive: true, force: true });
    console.log(`Deleted: pages/${entry}/`);
    deletedAny = true;
  }
}

writeFileSync(statePath, JSON.stringify(IDLE_STATE, null, 2), 'utf8');
console.log(deletedAny ? 'Clean slate.' : 'Already clean.');
