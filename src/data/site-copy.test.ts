import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { socialLinks } from './social';

const repoFile = (path: string) => readFileSync(fileURLToPath(new URL(`../../${path}`, import.meta.url)), 'utf8');

describe('newsletter copy', () => {
  const surfaces = {
    homepage: repoFile('src/components/home/NewsletterCTA.astro'),
    page: repoFile('src/pages/newsletter.astro'),
  };

  it.each(Object.entries(surfaces))('makes no cadence or subscriber-count promise on the %s', (_, text) => {
    expect(text).not.toMatch(/weekly/i);
    expect(text).not.toMatch(/\d+\+/);
  });

  it('describes the build log on the homepage and newsletter page', () => {
    expect(surfaces.homepage).toContain("What we're building with AI agents");
    expect(surfaces.page).toContain("What we're building with AI agents");
  });
});

describe('navigation', () => {
  it('links the blog from the header', () => {
    expect(repoFile('src/components/layout/Navigation.astro')).toContain("{ label: 'Blog', href: '/blog' }");
  });
});

describe('contact form', () => {
  it('offers every service listed on the site', () => {
    const contact = repoFile('src/pages/contact.astro');
    for (const value of ['full-stack', 'operations-ai', 'custom-automations', 'consulting']) {
      expect(contact).toContain(`<option value="${value}">`);
    }
  });
});

describe('X profile', () => {
  it('uses the X name and x.com URL', () => {
    expect(socialLinks).toContainEqual({ label: 'X', href: 'https://x.com/workingdevshero', icon: 'twitter' });
    expect(socialLinks.map((link) => link.label)).not.toContain('Twitter');
    expect(repoFile('src/layouts/BlogPost.astro')).toContain('aria-label="Share on X"');
  });
});
