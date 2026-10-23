/**
 * Link-preview media for every page's Open Graph tags.
 *
 * The default video is the Midnight Rooftop Flow loop, and the default image is
 * its first frame (both built by scripts/build-og-video.mjs). iMessage, Slack
 * and Discord show the image, then play the video in its place. Because the
 * video is the animated default image, it only goes out with it: a page that
 * brings its own image (a blog post, the team page) gets no video unless it
 * brings one too.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { videoSize } from './mp4';

export const DEFAULT_IMAGE = '/og-image.jpg';
export const DEFAULT_VIDEO = '/og-video.mp4';

/** Pixel size of both defaults. */
export const PREVIEW_WIDTH = 1200;
export const PREVIEW_HEIGHT = 630;

export interface SocialPreview {
  image: URL;
  video?: { url: URL; width: number; height: number };
}

/** Reads a public/ video's pixel size so og:video:width/height match the file. */
export function publicVideoSize(path: string, publicDir = join(process.cwd(), 'public')) {
  const size = videoSize(readFileSync(join(publicDir, path)));
  if (!size) throw new Error(`${path} has no video track`);
  return size;
}

export function socialPreview(
  site: URL | string,
  image?: string,
  video?: string,
  sizeOf: (path: string) => { width: number; height: number } = publicVideoSize,
): SocialPreview {
  const imagePath = image ?? DEFAULT_IMAGE;
  const videoPath = video ?? (image === undefined ? DEFAULT_VIDEO : undefined);
  return {
    image: new URL(imagePath, site),
    video: videoPath ? { url: new URL(videoPath, site), ...sizeOf(videoPath) } : undefined,
  };
}
