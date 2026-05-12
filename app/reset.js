import { existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PAGE_DIR = join(ROOT, 'page');

if (existsSync(PAGE_DIR)) {
  rmSync(PAGE_DIR, { recursive: true, force: true });
  console.log('Deleted page/ — clean slate.');
} else {
  console.log('Nothing to wipe — already clean.');
}
