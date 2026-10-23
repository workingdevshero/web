import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_IMAGE,
  DEFAULT_VIDEO,
  PREVIEW_HEIGHT,
  PREVIEW_WIDTH,
  publicVideoSize,
  socialPreview,
} from './social-preview';
import { topLevelBoxes, videoSize } from './mp4';

const publicFile = (path: string) => fileURLToPath(new URL(`../../public${path}`, import.meta.url));
const SITE = 'https://workingdevshero.com';

describe('socialPreview', () => {
  it('sends the rooftop loop with the default image, at its real size', () => {
    const { image, video } = socialPreview(SITE);
    expect(image.href).toBe('https://workingdevshero.com/og-image.jpg');
    expect(video?.url.href).toBe('https://workingdevshero.com/og-video.mp4');
    expect([video?.width, video?.height]).toEqual([PREVIEW_WIDTH, PREVIEW_HEIGHT]);
  });

  it('leaves out the video when a page brings its own image', () => {
    const { image, video } = socialPreview(SITE, '/og-team.png');
    expect(image.href).toBe('https://workingdevshero.com/og-team.png');
    expect(video).toBeUndefined();
  });

  it('uses a page’s own video, sized from the file', () => {
    const sizeOf = (path: string) => (path === '/clip.mp4' ? { width: 1280, height: 720 } : { width: 0, height: 0 });
    expect(socialPreview(SITE, '/clip.jpg', '/clip.mp4', sizeOf).video).toEqual({
      url: new URL('https://workingdevshero.com/clip.mp4'),
      width: 1280,
      height: 720,
    });
  });
});

describe('videoSize', () => {
  it('reads the video track size from tkhd', () => {
    expect(videoSize(readFileSync(publicFile(DEFAULT_VIDEO)))).toEqual({ width: 1200, height: 630 });
    expect(publicVideoSize('/videos/hero-midnight-wide.mp4')).toEqual({ width: 1280, height: 720 });
  });

  it('returns undefined when there is no video track', () => {
    expect(videoSize(new Uint8Array([0, 0, 0, 8, 0x66, 0x72, 0x65, 0x65]))).toBeUndefined();
  });
});

// Blog posts that set heroVideo send it as their og:video, so each one has to
// meet the same bar as the default: playable by link previewers and small.
const blogDir = fileURLToPath(new URL('../content/blog/', import.meta.url));
const postsWithVideo = readdirSync(blogDir)
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => {
    const frontmatter = readFileSync(join(blogDir, file), 'utf8').split('---')[1] ?? '';
    const field = (name: string) => frontmatter.match(new RegExp(`^${name}:\\s*"?([^"\\n]+)"?`, 'm'))?.[1];
    return { file, image: field('heroImage'), video: field('heroVideo') };
  })
  .filter((post) => post.video);

describe('blog post preview videos', () => {
  it('includes the animated link previews post', () => {
    expect(postsWithVideo.map((post) => post.file)).toContain('animated-link-previews.mdx');
  });

  it.each(postsWithVideo)('$file: silent H.264, moov first, ≤ 1 MB', ({ video }) => {
    const mp4 = readFileSync(publicFile(video!));
    expect(mp4.includes('avc1', 0, 'latin1')).toBe(true);
    expect(mp4.includes('mp4a', 0, 'latin1')).toBe(false);
    const boxes = topLevelBoxes(mp4);
    expect(boxes.indexOf('moov')).toBeLessThan(boxes.indexOf('mdat'));
    expect(mp4.length).toBeLessThanOrEqual(1024 * 1024);
  });

  it.each(postsWithVideo)('$file: heroImage is the same size as the video', async ({ image, video }) => {
    const { width, height } = await sharp(publicFile(image!)).metadata();
    expect({ width, height }).toEqual(publicVideoSize(video!));
  });
});

describe('default preview media', () => {
  it('has an image at the size the meta tags claim', async () => {
    const { width, height, format } = await sharp(publicFile(DEFAULT_IMAGE)).metadata();
    expect({ width, height, format }).toEqual({ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, format: 'jpeg' });
  });

  it('has a video at the size the meta tags claim', async () => {
    // The image is the video's first frame, so its size is the video's size;
    // here we read the H.264 track's dimensions straight out of the tkhd box.
    const mp4 = readFileSync(publicFile(DEFAULT_VIDEO));
    const tkhd = mp4.indexOf('tkhd', 0, 'latin1');
    // It is the only track; width/height are 16.16 fixed point at the end of tkhd.
    const size = mp4.readUInt32BE(tkhd - 4);
    const end = tkhd - 4 + size;
    expect([mp4.readUInt32BE(end - 8) >>> 16, mp4.readUInt32BE(end - 4) >>> 16]).toEqual([PREVIEW_WIDTH, PREVIEW_HEIGHT]);
  });

  it('has an H.264 video with no audio track', () => {
    const mp4 = readFileSync(publicFile(DEFAULT_VIDEO));
    expect(mp4.includes('avc1', 0, 'latin1')).toBe(true);
    expect(mp4.includes('mp4a', 0, 'latin1')).toBe(false);
  });

  it('puts the moov box first so previews can start playing before the download ends', () => {
    const boxes = topLevelBoxes(readFileSync(publicFile(DEFAULT_VIDEO)));
    expect(boxes.indexOf('moov')).toBeGreaterThanOrEqual(0);
    expect(boxes.indexOf('moov')).toBeLessThan(boxes.indexOf('mdat'));
  });

  it('stays small enough for link-preview fetchers', () => {
    expect(statSync(publicFile(DEFAULT_VIDEO)).size).toBeLessThanOrEqual(1024 * 1024);
    expect(statSync(publicFile(DEFAULT_IMAGE)).size).toBeLessThanOrEqual(300 * 1024);
  });
});
