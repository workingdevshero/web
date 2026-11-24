import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoFile = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url));
const page = readFileSync(repoFile('src/pages/portfolio/clockwork.astro'), 'utf8');

describe('Clockwork case study', () => {
  it('has a card on the portfolio page', () => {
    expect(readFileSync(repoFile('src/pages/portfolio/index.astro'), 'utf8')).toContain("href: '/portfolio/clockwork'");
  });

  it('links only media that exists', () => {
    const media = [...page.matchAll(/(?:video|image)="(\/[^"]+)"/g)].map((m) => m[1]);
    expect(media).toEqual(['/videos/clockwork-timeline-loop.mp4', '/images/portfolio/clockwork/timeline.png']);
    for (const path of media) expect(existsSync(repoFile(`public${path}`)), path).toBe(true);
  });

  it('links to the product and the Supermog case study', () => {
    expect(page).toContain('href="https://clockwork.am"');
    expect(page).toContain('href="/portfolio/supermog"');
  });

  it('keeps the fleet share within the total', () => {
    const count = (key: string) => Number(page.match(new RegExp(`${key}: (\\d+)`))?.[1]);
    expect(count('pullRequestsBySupermog')).toBeGreaterThan(0);
    expect(count('pullRequestsBySupermog')).toBeLessThanOrEqual(count('pullRequestsMerged'));
  });
});
