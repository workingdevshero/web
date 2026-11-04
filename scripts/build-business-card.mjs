#!/usr/bin/env node
/**
 * Builds the Working Dev's Hero business card from scripts/business-card.html.
 *
 *   node scripts/build-business-card.mjs
 *
 * Writes the front, back and a two-up review sheet to brand/business-cards/.
 * The card is a standard US size (3.5in x 2in) at 300 DPI, so each PNG is
 * exactly 1050x600 and prints at true size.
 *
 * Options:
 *   --bleed          add 0.125in bleed on every side (3.75in x 2.25in output)
 *   --out <dir>      write somewhere other than brand/business-cards/
 *   CARD_PHONE=...   add a Cell row. Deliberately an env var, not source, so a
 *                    personal number never lands in the repo.
 *
 * Requires a Chromium/Chrome binary (CHROME overrides the path) and sharp.
 */
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { access, mkdir, readFile, rm, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TMP = join(ROOT, '.tmp');

const CARD_W = 1050;   // 3.5in @ 300dpi
const CARD_H = 600;    // 2in @ 300dpi
const BLEED = 37.5;    // 0.125in @ 300dpi

// Headless Chrome reserves room for browser chrome, so --window-size yields a
// shorter viewport than asked for. We request extra and crop the card back out,
// which keeps the output exact on every platform.
const SLACK = 400;

const argv = process.argv.slice(2);
const hasFlag = (f) => argv.includes(f);
const argValue = (f) => (argv.indexOf(f) >= 0 ? argv[argv.indexOf(f) + 1] : undefined);

const BLEED_ON = hasFlag('--bleed');
const OUT_DIR = resolve(argValue('--out') || join(ROOT, 'brand/business-cards'));
const PHONE = process.env.CARD_PHONE || '';

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
      '--force-device-scale-factor=1',
      '--default-background-color=00000000',
      '--virtual-time-budget=6000',
      `--window-size=${width + SLACK},${height + SLACK}`,
      `--screenshot=${out}`,
      url,
    ], { stdio: 'ignore' });
    proc.on('error', reject);
    proc.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`chrome exited ${code}`))));
  });
}

async function render(chrome, url, out, width, height) {
  const raw = join(TMP, `business-card-${width}x${height}.png`);
  await screenshot(chrome, url, raw, width, height);
  let image = sharp(raw).extract({ left: 0, top: 0, width, height });
  if (BLEED_ON) {
    image = image.extend({
      top: Math.ceil(BLEED), bottom: Math.floor(BLEED),
      left: Math.ceil(BLEED), right: Math.floor(BLEED),
      extendWith: 'copy',
    });
  }
  await image.png().toFile(out);
  await rm(raw, { force: true });
}

const chrome = await findChrome();
await mkdir(OUT_DIR, { recursive: true });
await mkdir(TMP, { recursive: true });

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}/scripts/business-card.html`;
const phoneQuery = PHONE ? `&phone=${encodeURIComponent(PHONE)}` : '';
const jobs = [
  { side: 'front', file: 'business-card-front.png', w: CARD_W, h: CARD_H },
  { side: 'back', file: 'business-card-back.png', w: CARD_W, h: CARD_H },
  // Two-up review sheet: 2 cards, a 40px gap and 20px padding all round.
  { side: 'sheet', file: 'business-card-sheet.png', w: CARD_W * 2 + 80, h: CARD_H + 40 },
];

try {
  for (const { side, file, w, h } of jobs) {
    await render(chrome, `${base}?side=${side}${phoneQuery}`, join(OUT_DIR, file), w, h);
  }
} finally {
  server.close();
}

const suffix = BLEED_ON ? ` + ${BLEED}px bleed` : '';
console.log(`Wrote to ${OUT_DIR.replace(ROOT, '.')}${PHONE ? ' (with cell number)' : ''}${suffix}`);
for (const { file } of jobs) {
  const out = join(OUT_DIR, file);
  const { size } = await stat(out);
  const meta = await sharp(out).metadata();
  console.log(`  ${file}: ${meta.width}x${meta.height} — ${(size / 1024).toFixed(0)} KB`);
}
