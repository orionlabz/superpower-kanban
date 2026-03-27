import { createReadStream, createWriteStream, mkdirSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { pipeline } from 'node:stream/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORAGE_DIR = resolve(__dirname, '../storage');
const BRANDS_DIR = resolve(STORAGE_DIR, 'brands');

mkdirSync(BRANDS_DIR, { recursive: true });

export function getBrandsDir() { return BRANDS_DIR; }

export async function saveBrandLogo(stream, originalName) {
  const ext = extname(originalName).toLowerCase();
  if (!['.png', '.svg'].includes(ext)) throw new Error('Only PNG and SVG allowed');
  const filename = `${randomUUID()}${ext}`;
  const dest = resolve(BRANDS_DIR, filename);
  await pipeline(stream, createWriteStream(dest));
  return `/storage/brands/${filename}`;
}

export async function serveStorageFile(pathname, res) {
  const relative = pathname.replace(/^\/storage\//, '');
  const filePath = resolve(STORAGE_DIR, relative);
  // Security: must stay within STORAGE_DIR
  if (!filePath.startsWith(STORAGE_DIR + '/') && filePath !== STORAGE_DIR) {
    res.writeHead(403); res.end(); return;
  }
  const ext = extname(filePath);
  const mime = { '.png': 'image/png', '.svg': 'image/svg+xml' }[ext] || 'application/octet-stream';
  try {
    await import('node:fs/promises').then(m => m.access(filePath));
  } catch {
    res.writeHead(404); res.end(); return;
  }
  res.writeHead(200, { 'Content-Type': mime });
  createReadStream(filePath).pipe(res);
}
