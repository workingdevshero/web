import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { formatCount, formatLarge, mergedTotal, outcomeShares, pullRequestTotal, supermogStats } from './supermog-stats';

const repoFile = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url));

describe('supermog stats', () => {
  it('adds the outcomes up, and the shares to a whole', () => {
    expect(pullRequestTotal()).toBe(665);
    expect(mergedTotal()).toBe(644);
    const shares = outcomeShares();
    expect(shares).toEqual({ mergedClean: 88.9, mergedAfterEdits: 7.8, closedUnmerged: 3.2, reverted: 0.1 });
    expect(Math.round(Object.values(shares).reduce((a, b) => a + b, 0) * 10) / 10).toBe(100);
  });

  it('rounds shares that would otherwise miss 100', () => {
    const shares = outcomeShares({ mergedClean: 1, mergedAfterEdits: 1, closedUnmerged: 1, reverted: 0 });
    expect(shares).toEqual({ mergedClean: 33.4, mergedAfterEdits: 33.3, closedUnmerged: 33.3, reverted: 0 });
  });

  it('keeps the parts within their totals', () => {
    const { spend, hours, runs, runsByBox } = supermogStats;
    const byStep = spend.byStep.reduce((sum, row) => sum + row.usd, 0);
    // The steps listed are the large ones; the page puts the small ones left over in an "Other steps" row.
    expect(byStep).toBeLessThanOrEqual(spend.totalUsd);
    expect(byStep).toBeGreaterThan(spend.totalUsd * 0.99);
    expect(spend.runsWithCost).toBeLessThan(runs);
    expect(hours.developing + hours.verifying).toBeLessThan(hours.allRuns);
    expect(runsByBox.reduce((sum, row) => sum + row.runs, 0)).toBe(runs);
  });

  it('covers a period that ends on the day it was read', () => {
    expect(Date.parse(supermogStats.since)).toBeLessThan(Date.parse(supermogStats.asOf));
    expect(supermogStats.busiestDay.date >= supermogStats.since && supermogStats.busiestDay.date <= supermogStats.asOf).toBe(true);
  });

  it('formats counts the same on every machine', () => {
    expect(formatCount(284770)).toBe('284,770');
    expect(formatLarge(24_120_000_000)).toBe('24.1 billion');
    expect(formatLarge(780_000_000)).toBe('780 million');
    expect(formatLarge(5357)).toBe('5,357');
  });
});

describe('the supermog case study', () => {
  const page = readFileSync(repoFile('src/pages/portfolio/supermog.astro'), 'utf8');

  it('is listed on the portfolio page', () => {
    expect(readFileSync(repoFile('src/pages/portfolio/index.astro'), 'utf8')).toContain("href: '/portfolio/supermog'");
  });

  it('reads its numbers from the data file instead of repeating them', () => {
    expect(page).toContain("from '@/data/supermog-stats'");
    for (const figure of ['5,357', '665', '10,477', '284,770']) expect(page).not.toContain(figure);
  });

  it('only points at media and posts that exist', () => {
    const media = [...page.matchAll(/(?:src|poster|video|image)="(\/(?:videos|images)\/[^"]+)"/g)].map((m) => m[1]);
    expect(media.length).toBeGreaterThan(3);
    for (const path of media) expect(existsSync(repoFile(`public${path}`)), path).toBe(true);
    const posts = [...page.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)].map((m) => m[1]);
    expect(posts.length).toBeGreaterThan(0);
    for (const slug of posts) expect(existsSync(repoFile(`src/content/blog/${slug}.mdx`)), slug).toBe(true);
  });
});
