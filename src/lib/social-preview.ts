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
export const DEFAULT_IMAGE = '/og-image.jpg';
export const DEFAULT_VIDEO = '/og-video.mp4';

/** Pixel size of both defaults; also the size any page-supplied video should be. */
export const PREVIEW_WIDTH = 1200;
export const PREVIEW_HEIGHT = 630;

export interface SocialPreview {
  image: URL;
  video?: URL;
}

export function socialPreview(site: URL | string, image?: string, video?: string): SocialPreview {
  const imagePath = image ?? DEFAULT_IMAGE;
  const videoPath = video ?? (image === undefined ? DEFAULT_VIDEO : undefined);
  return {
    image: new URL(imagePath, site),
    video: videoPath ? new URL(videoPath, site) : undefined,
  };
}
