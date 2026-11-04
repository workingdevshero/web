#!/usr/bin/env node
/**
 * Builds the Working Dev's Hero business card from scripts/business-card.html.
 *
 *   node scripts/build-business-card.mjs
 *
 * Writes the print-ready front and back to brand/business-cards/, plus a
 * two-up sheet for quick review. The card is a standard US size (3.5in x 2in)
 * rendered at 2x device scale, so each PNG is 2100x1200 — 600 DPI, which any
 * print shop can take as-is.
 *
 * Requires a Chromium/Chrome binary. Set CHROME to override the path; otherwise
 * the usual macOS, Linux and Windows install locations are searched.
 */
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { access, mkdir, readFile, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = join(ROOT, 'brand/business-cards');

// 3.5in x 2in at 300 DPI, rendered at 2x for a crisp 600 DPI file.
const CARD_W = 1050;
const CARD_H = 600;
const SCALE = 2;

const CHROME_CANDIDATES = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  'google-chrome',
  'google-chrome-stable',
  'chromium',
  'chromium-browser',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);

const MIME = {
  '.html': 'text/html', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml',
};

function serve() {
  const server = createServer(async (req, res) => {
    try {
      const path = join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!path.startsWith(ROOT)) throw new Error('outside repo');
      const body = await readFile(path);
      res.writeHead(200, { 'Content-Type': MIME[extname(path)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    if (candidate.includes('/') || candidate.includes('\\')) {
      try { await access(candidate, constants.X_OK); return candidate; } catch { /* keep looking */ }
    } else {
      const found = await new Promise((resolve) => {
        spawn('which', [candidate], { stdio: 'ignore' })
          .on('exit', (code) => resolve(code === 0))
          .on('error', () => resolve(false));
      });
      if (found) return candidate;
    }
  }
  throw new Error('No Chromium/Chrome found. Set CHROME to the binary path.');
}

function screenshot(chrome, url, out, width, height) {
  return new Promise((resolve, reject) => {
    const proc = spawn(chrome, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars',
      '--no-sandbox', '--disable-dev-shm-usage',
      `--force-device-scale-factor=${SCALE}`,
      '--default-background-color=00000000',
      '--virtual-time-budget=6000',
      `--window-size=${width},${height}`,
      `--screenshot=${out}`,
      url,
    ], { stdio: 'ignore' });
    proc.on('error', reject);
    proc.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`chrome exited ${code}`))));
  });
}

const chrome = await findChrome();
await mkdir(OUT_DIR, { recursive: true });

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}/scripts/business-card.html`;
const jobs = [
  { side: 'front', file: 'business-card-front.png', w: CARD_W, h: CARD_H },
  { side: 'back', file: 'business-card-back.png', w: CARD_W, h: CARD_H },
  // Two-up review sheet: 2 cards + a 40px gap and 20px padding all round.
  { side: 'sheet', file: 'business-card-sheet.png', w: CARD_W * 2 + 80, h: CARD_H + 40 },
];

try {
  for (const { side, file, w, h } of jobs) {
    await screenshot(chrome, `${base}?side=${side}`, join(OUT_DIR, file), w, h);
  }
} finally {
  server.close();
}

for (const { file } of jobs) {
  const out = join(OUT_DIR, file);
  const { size } = await stat(out);
  console.log(`${out.replace(ROOT, '')}: ${(size / 1024).toFixed(0)} KB`);
}
