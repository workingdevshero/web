import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_IMAGE,
  DEFAULT_VIDEO,
  PREVIEW_HEIGHT,
  PREVIEW_WIDTH,
  socialPreview,
} from './social-preview';
import { topLevelBoxes } from './mp4';

const publicFile = (path: string) => fileURLToPath(new URL(`../../public${path}`, import.meta.url));
const SITE = 'https://workingdevshero.com';

describe('socialPreview', () => {
  it('sends the rooftop loop with the default image', () => {
    const { image, video } = socialPreview(SITE);
    expect(image.href).toBe('https://workingdevshero.com/og-image.jpg');
    expect(video?.href).toBe('https://workingdevshero.com/og-video.mp4');
  });

  it('leaves out the video when a page brings its own image', () => {
    const { image, video } = socialPreview(SITE, '/og-team.png');
    expect(image.href).toBe('https://workingdevshero.com/og-team.png');
    expect(video).toBeUndefined();
  });

  it('uses a page’s own video when given one', () => {
    expect(socialPreview(SITE, '/clip.jpg', '/clip.mp4').video?.href).toBe('https://workingdevshero.com/clip.mp4');
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
