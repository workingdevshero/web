#!/usr/bin/env node
/**
 * Builds the site's og:video and og:image from the Midnight Rooftop Flow loop.
 *
 *   node scripts/build-og-video.mjs
 *
 * The loop is scaled to 1200px wide and cropped to 1200x630 (mostly off the
 * empty sky), then scripts/og-video.html is screenshotted with a transparent
 * background and laid over every frame. The og:image is the overlaid first
 * frame, so the still and the video line up when a preview starts playing.
 *
 * The video is silent: iMessage and friends autoplay it muted, and a 6s cut of
 * the song would jump on every loop.
 *
 * Requires ffmpeg on PATH. Set CHROME to override the browser path.
 */
import { createServer } from 'node:http';
import { execFile, spawn } from 'node:child_process';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

const run = promisify(execFile);

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TMP = join(ROOT, '.tmp');
const LOOP = join(ROOT, 'brand/loops/midnight-rooftop-flow-loop.mp4');
const FRAME = join(TMP, 'og-video-frame.png');
const OVERLAY = join(TMP, 'og-video-overlay.png');
const OUT_VIDEO = join(ROOT, 'public/og-video.mp4');
const OUT_IMAGE = join(ROOT, 'public/og-image.jpg');

const WIDTH = 1200;
const HEIGHT = 630;
const CROP_TOP = 30;  // 1280x720 scales to 1200x675; take 30px of sky, 15px of street
const FIT = `scale=${WIDTH}:-2:flags=lanczos,crop=${WIDTH}:${HEIGHT}:0:${CROP_TOP}`;

const CHROME = process.env.CHROME
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const MIME = {
  '.html': 'text/html', '.png': 'image/png', '.woff2': 'font/woff2',
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

function screenshot(url, out) {
  return new Promise((resolve, reject) => {
    const chrome = spawn(CHROME, [
      '--headless', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--default-background-color=00000000',
      '--virtual-time-budget=5000',
      `--window-size=${WIDTH},${HEIGHT}`,
      `--screenshot=${out}`,
      url,
    ], { stdio: 'ignore' });
    chrome.on('error', reject);
    chrome.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`chrome exited ${code}`))));
  });
}

const ffmpeg = (...args) => run('ffmpeg', ['-v', 'error', '-y', ...args]);

await mkdir(TMP, { recursive: true });

// First frame without the overlay, for tuning og-video.html with ?preview.
await ffmpeg('-i', LOOP, '-vf', FIT, '-frames:v', '1', FRAME);

const server = await serve();
try {
  await screenshot(`http://127.0.0.1:${server.address().port}/scripts/og-video.html`, OVERLAY);
} finally {
  server.close();
}

await ffmpeg(
  '-i', LOOP, '-i', OVERLAY,
  '-filter_complex', `[0:v]${FIT}[bg];[bg][1:v]overlay=0:0:format=auto,format=yuv420p[v]`,
  '-map', '[v]', '-an',
  // Plain H.264 High@4.0 in yuv420p, which iMessage, Slack and Discord all play inline.
  '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-preset', 'slow', '-crf', '24',
  '-movflags', '+faststart',
  OUT_VIDEO,
);

// Composite the still from the lossless frame rather than the encoded video.
await sharp(FRAME)
  .composite([{ input: OVERLAY }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(OUT_IMAGE);

for (const out of [OUT_VIDEO, OUT_IMAGE]) {
  const { size } = await stat(out);
  console.log(`${out.replace(ROOT, '')}: ${(size / 1024).toFixed(0)} KB`);
}
