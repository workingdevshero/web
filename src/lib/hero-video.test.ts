import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { describe, expect, it, vi } from 'vitest';
import { syncHeroVideos, type HeroVideo } from './hero-video';
import { topLevelBoxes } from './mp4';

const repoFile = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url));

function fakeVideo(visible: boolean, play = () => Promise.resolve()) {
  return {
    offsetParent: visible ? ({} as Element) : null,
    muted: false,
    play: vi.fn(play),
    pause: vi.fn(),
  } satisfies HeroVideo;
}

describe('syncHeroVideos', () => {
  it('plays only the loop that is on screen, muted', () => {
    const shown = fakeVideo(true);
    const hidden = fakeVideo(false);
    syncHeroVideos([shown, hidden], false);

    expect(shown.play).toHaveBeenCalledOnce();
    expect(shown.muted).toBe(true);
    expect(hidden.play).not.toHaveBeenCalled();
    expect(hidden.pause).toHaveBeenCalledOnce();
  });

  it('keeps the poster for people who ask for reduced motion', () => {
    const shown = fakeVideo(true);
    syncHeroVideos([shown], true);

    expect(shown.play).not.toHaveBeenCalled();
    expect(shown.pause).toHaveBeenCalledOnce();
  });

  it('swallows a blocked autoplay so the poster just stays', async () => {
    const blocked = fakeVideo(true, () => Promise.reject(new DOMException('blocked', 'NotAllowedError')));
    expect(() => syncHeroVideos([blocked], false)).not.toThrow();
    await expect(blocked.play.mock.results[0].value).rejects.toThrow();
  });
});

describe('hero loops', () => {
  const HERO = readFileSync(repoFile('src/components/home/Hero.astro'), 'utf8');

  for (const { name, width, height } of [
    { name: 'wide', width: 1280, height: 720 },
    { name: 'tall', width: 720, height: 1280 },
  ]) {
    const video = `public/videos/hero-midnight-${name}.mp4`;
    const poster = `src/assets/images/hero-midnight-${name}-poster.jpg`;

    it(`${name}: the hero uses it, with preload="none" so it costs nothing until played`, () => {
      const tag = HERO.match(new RegExp(`<video[^>]*src="/videos/hero-midnight-${name}\\.mp4"[^>]*>`))?.[0];
      expect(tag).toBeDefined();
      expect(tag).toMatch(/\bmuted\b/);
      expect(tag).toMatch(/\bloop\b/);
      expect(tag).toMatch(/\bplaysinline\b/);
      expect(tag).toContain('preload="none"');
      expect(HERO).toContain(`@assets/images/hero-midnight-${name}-poster.jpg`);
    });

    it(`${name}: is silent H.264 that starts playing before it finishes downloading`, () => {
      const mp4 = readFileSync(repoFile(video));
      expect(mp4.includes('avc1', 0, 'latin1')).toBe(true);
      expect(mp4.includes('mp4a', 0, 'latin1')).toBe(false);
      const boxes = topLevelBoxes(mp4);
      expect(boxes.indexOf('moov')).toBeLessThan(boxes.indexOf('mdat'));
      expect(mp4.length).toBeLessThanOrEqual(512 * 1024);
    });

    it(`${name}: has a poster the same size as the video`, async () => {
      const meta = await sharp(repoFile(poster)).metadata();
      expect({ width: meta.width, height: meta.height }).toEqual({ width, height });
    });
  }
});
