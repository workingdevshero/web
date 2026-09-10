import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { DISCORD_INVITE_URL } from './discord';
import { featuredLinks, productLinks, watchLinks } from './links';
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

  it('is wired into the Discord landing page', () => {
    const page = readFileSync(repoFile('src/pages/discord.astro'), 'utf8');
    expect(page).toContain('DISCORD_INVITE_URL');
    expect(page).toContain('Hero in Training');
    expect(page).toContain('Two humans + 4 agents');
  });
});

describe('link-in-bio', () => {
  it('features Discord, Automate It, and the newsletter', () => {
    expect(featuredLinks.map((link) => link.title)).toEqual([
      'Join Discord',
      'Automate It',
      'Newsletter',
    ]);
    expect(featuredLinks[0]?.href).toBe('/discord');
  });

  it('includes Instagram and TikTok under watch & read', () => {
    const hrefs = watchLinks.map((link) => link.href);
    expect(hrefs).toEqual(expect.arrayContaining([
      'https://www.instagram.com/workingdevshero/',
      'https://www.tiktok.com/@workingdevshero',
    ]));
  });

  it('labels WDH.sh as Agent Shell Toolkit', () => {
    expect(productLinks).toContainEqual(expect.objectContaining({
      title: 'Agent Shell Toolkit',
      href: 'https://wdh.sh',
    }));
  });

  it('includes Dimitris on the links and Discord pages', () => {
    expect(squadHumans.map((h) => h.name)).toEqual(['Bobby', 'Dimitris']);
    expect(squadHumans[1]?.role).toBe('Hero in Training');
    expect(squadAgents).toHaveLength(4);
    const links = readFileSync(repoFile('src/pages/links.astro'), 'utf8');
    expect(links).toContain('dimitris.png');
  });
});
