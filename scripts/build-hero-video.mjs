#!/usr/bin/env node
/**
 * Builds the home page hero loops from the Midnight Rooftop Flow animation.
 *
 *   node scripts/build-hero-video.mjs
 *
 * Writes a 16:9 loop for desktop and a 9:16 loop for phones to public/videos,
 * plus each loop's first frame to src/assets/images as its poster, so the still
 * that paints first is exactly the frame the video starts on. The loops are
 * silent: they autoplay muted as a background, and browsers only autoplay
 * muted video anyway.
 *
 * Requires ffmpeg on PATH.
 */
import { execFile } from 'node:child_process';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const ROOT = fileURLToPath(new URL('..', import.meta.url));

const LOOPS = [
  { name: 'wide', source: 'brand/loops/midnight-rooftop-flow-loop.mp4' },
  { name: 'tall', source: 'brand/loops/midnight-rooftop-flow-loop-9x16.mp4' },
];

const ffmpeg = (...args) => run('ffmpeg', ['-v', 'error', '-y', ...args]);

for (const { name, source } of LOOPS) {
  const input = join(ROOT, source);
  const video = join(ROOT, `public/videos/hero-midnight-${name}.mp4`);
  const poster = join(ROOT, `src/assets/images/hero-midnight-${name}-poster.jpg`);

  await ffmpeg(
    '-i', input, '-an',
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-pix_fmt', 'yuv420p',
    '-preset', 'slow', '-crf', '26',
    '-movflags', '+faststart',
    video,
  );
  await ffmpeg('-i', input, '-frames:v', '1', '-q:v', '2', poster);

  for (const out of [video, poster]) {
    const { size } = await stat(out);
    console.log(`${out.replace(ROOT, '')}: ${(size / 1024).toFixed(0)} KB`);
  }
}
