import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const repoFile = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url));

const BANNER = repoFile('brand/youtube-banner.png');
const BANNER_SOURCE = repoFile('scripts/youtube-banner.html');
const HERO = repoFile('src/components/home/Hero.astro');

// YouTube's channel art requirements: exact upload size and a hard file-size cap.
const REQUIRED_WIDTH = 2048;
const REQUIRED_HEIGHT = 1152;
const MAX_BYTES = 6 * 1024 * 1024;

/** Reduces markup to its visible text so the two headlines can be compared. */
function headlineText(markup: string, tag: 'h1'): string {
  const match = markup.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!match) throw new Error(`no <${tag}> found`);
  return match[1]
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#8209;/g, '‑')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('YouTube channel banner', () => {
  it('is exactly 2048x1152', async () => {
    const { width, height } = await sharp(BANNER).metadata();
    expect({ width, height }).toEqual({ width: REQUIRED_WIDTH, height: REQUIRED_HEIGHT });
  });

  it('stays under YouTube’s 6 MB upload cap', () => {
    expect(statSync(BANNER).size).toBeLessThanOrEqual(MAX_BYTES);
  });

  it('uses the same headline as the site hero, so the banner cannot go stale', () => {
    const banner = headlineText(readFileSync(BANNER_SOURCE, 'utf8'), 'h1');
    const hero = headlineText(readFileSync(HERO, 'utf8'), 'h1');
    expect(banner).toBe(hero);
  });

  it('keeps the headline inside YouTube’s text-safe box', () => {
    const source = readFileSync(BANNER_SOURCE, 'utf8');
    const left = Number(source.match(/\.headline\s*\{[^}]*?left:\s*(\d+)px/)?.[1]);
    const width = Number(source.match(/\.headline\s*\{[^}]*?width:\s*(\d+)px/)?.[1]);
    expect(Number.isFinite(left) && Number.isFinite(width)).toBe(true);

    // Text-safe box is 1235x338 centred in the 2048x1152 canvas.
    const safeLeft = (REQUIRED_WIDTH - 1235) / 2;
    expect(left).toBeGreaterThanOrEqual(safeLeft);
    expect(left + width).toBeLessThanOrEqual(safeLeft + 1235);
  });
});
