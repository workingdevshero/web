#!/usr/bin/env node
/**
 * Builds blog posts' preview loops (frontmatter heroVideo) from the Heroic Lofi scenes.
 *
 *   node scripts/build-post-videos.mjs
 *
 * Each loop goes to public/videos and its first frame overwrites the post's
 * heroImage, so the still that link previews and cards show first is exactly
 * the frame the video starts on. The loops are silent and must stay under
 * 1 MB for link-preview fetchers (src/lib/social-preview.test.ts checks).
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

const POSTS = [
  {
    source: 'brand/loops/secret-lair-terminal-loop.mp4',
    video: 'public/videos/heroic-lofi-lair-loop.mp4',
    image: 'public/images/blog/heroic-lofi-lair.jpg',
  },
  {
    source: 'brand/loops/rainy-bus-stop-deploy-loop.mp4',
    video: 'public/videos/rainy-bus-stop-deploy-loop.mp4',
    image: 'public/images/blog/art-direction-rainy-bus-stop-deploy.jpg',
  },
];

const ffmpeg = (...args) => run('ffmpeg', ['-v', 'error', '-y', ...args]);

for (const { source, video, image } of POSTS) {
  const input = join(ROOT, source);

  await ffmpeg(
    '-i', input, '-an',
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-pix_fmt', 'yuv420p',
    '-preset', 'slow', '-crf', '26',
    '-movflags', '+faststart',
    join(ROOT, video),
  );
  await ffmpeg('-i', input, '-frames:v', '1', '-q:v', '2', join(ROOT, image));

  for (const out of [video, image]) {
    const { size } = await stat(join(ROOT, out));
    console.log(`${out}: ${(size / 1024).toFixed(0)} KB`);
  }
}
