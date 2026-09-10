import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { DISCORD_INVITE_URL } from './discord';
import { featuredLinks, latestPublishedPosts } from './links';
import { socialLinks } from './social';
import { squadAgents, squadHumans } from './squad';

const repoFile = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url));

describe('social links', () => {
  it('includes the Working Dev\'s Hero TikTok profile', () => {
    expect(socialLinks).toContainEqual({
      label: 'TikTok',
      href: 'https://www.tiktok.com/@workingdevshero',
      icon: 'tiktok',
    });
  });

  it('includes the Working Dev\'s Hero Instagram profile', () => {
    expect(socialLinks).toContainEqual({
      label: 'Instagram',
      href: 'https://www.instagram.com/workingdevshero/',
      icon: 'instagram',
    });
  });

  it('keeps the existing profiles', () => {
    const hrefs = socialLinks.map((link) => link.href);
    expect(hrefs).toEqual(expect.arrayContaining([
      'https://github.com/workingdevshero',
      'https://twitter.com/workingdevshero',
      'https://linkedin.com/company/workingdevshero',
      'https://youtube.com/@workingdevshero',
    ]));
  });

  it('is rendered from the shared list on the footer and contact page', () => {
    const footer = readFileSync(repoFile('src/components/layout/Footer.astro'), 'utf8');
    const contact = readFileSync(repoFile('src/pages/contact.astro'), 'utf8');
    expect(footer).toContain('SocialIcons');
    expect(contact).toContain('SocialIcons');
  });
});

describe('Discord invite', () => {
  it('uses the never-expire invite from other Working Dev\'s Hero repos', () => {
    expect(DISCORD_INVITE_URL).toBe('https://discord.gg/UxNXrBukjZ');
  });

  it('is the Join Discord destination, not a landing page', () => {
    expect(featuredLinks[0]?.href).toBe(DISCORD_INVITE_URL);
    expect(featuredLinks[0]?.external).toBe(true);
    expect(existsSync(repoFile('src/pages/discord.astro'))).toBe(false);
    const redirects = readFileSync(repoFile('public/_redirects'), 'utf8');
    expect(redirects).toContain('/discord https://discord.gg/UxNXrBukjZ');
  });
});

describe('link-in-bio', () => {
  it('features Discord, Automate It, and the newsletter', () => {
    expect(featuredLinks.map((link) => link.title)).toEqual([
      'Join Discord',
      'Automate It',
      'Newsletter',
    ]);
  });

  it('picks the three newest published posts', () => {
    const posts = [
      { id: 'old', data: { pubDate: new Date('2024-01-01'), draft: false } },
      { id: 'draft', data: { pubDate: new Date('2026-09-01'), draft: true } },
      { id: 'new', data: { pubDate: new Date('2026-08-01'), draft: false } },
      { id: 'mid', data: { pubDate: new Date('2025-06-01'), draft: false } },
      { id: 'newer', data: { pubDate: new Date('2026-09-01'), draft: false } },
    ];
    expect(latestPublishedPosts(posts, 3).map((post) => post.id)).toEqual([
      'newer',
      'new',
      'mid',
    ]);
  });

  it('renders recent posts from the blog collection', () => {
    const page = readFileSync(repoFile('src/pages/links.astro'), 'utf8');
    expect(page).toContain('latestPublishedPosts');
    expect(page).toContain("getCollection('blog'");
    expect(page).toContain('BlogCard');
    expect(page).toContain('heroImage');
    expect(page).not.toContain('productLinks');
    expect(page).not.toContain('siteLinks');
  });

  it('includes Dimitris on the links page', () => {
    expect(squadHumans.map((h) => h.name)).toEqual(['Bobby', 'Dimitris']);
    expect(squadHumans[1]?.role).toBe('Hero in Training');
    expect(squadAgents).toHaveLength(4);
    const links = readFileSync(repoFile('src/pages/links.astro'), 'utf8');
    expect(links).toContain('dimitris.png');
  });
});
