import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import rehypeExternalLinks from './src/plugins/rehype-external-links.mjs';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Build a slug → last-modified map at config time by parsing the blog
// frontmatter directly (astro:content is not available in the config scope).
// Drafts are skipped. Used to set <lastmod> on sitemap entries.
function frontmatterDate(fm, key) {
  const raw = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1];
  if (!raw) return null;
  const date = new Date(raw.replace(/\s+#.*$/, '').trim().replace(/^(['"])(.*)\1$/, '$2'));
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildSlugDateMap() {
  const dir = join(process.cwd(), 'src/content/blog');
  const map = new Map();
  let maxDate = null;
  try {
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;
      const slug = file.replace(/\.(mdx|md)$/, '');
      const fm = readFileSync(join(dir, file), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      if (/^draft:\s*true\b/m.test(fm)) continue;
      const effective = frontmatterDate(fm, 'updatedDate') ?? frontmatterDate(fm, 'pubDate');
      if (!effective) continue;
      if (!maxDate || effective > maxDate) maxDate = effective;
      map.set(slug, effective);
    }
  } catch {
    // Non-fatal: sitemap just won't have lastmod if parsing fails.
  }
  return { map, maxDate };
}

const { map: slugDateMap, maxDate: siteLatest } = buildSlugDateMap();

export default defineConfig({
  site: 'https://workingdevshero.com',
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        // /blog/<slug> and its /blog/<slug>.md mirror → that post's updatedDate || pubDate.
        // Pages that list posts (home, /blog, category/tag indexes, feeds) → newest post.
        // Everything else gets no lastmod rather than a synthetic one.
        const { pathname } = new URL(item.url);
        const slug = pathname.match(/^\/blog\/([^/]+?)(?:\.md)?\/?$/)?.[1];
        const listsPosts = /^\/(?:blog(?:\/(?:category|tag)\/.*)?\/?|rss\.xml|llms(?:-full)?\.txt)?$/.test(pathname);
        const last = slug && slugDateMap.has(slug) ? slugDateMap.get(slug) : listsPosts ? siteLatest : null;
        if (last) item.lastmod = last.toISOString();
        return item;
      },
    }),
    tailwind(),
  ],
  markdown: {
    rehypePlugins: [rehypeExternalLinks],
    shikiConfig: {
      theme: 'dracula',
      wrap: true,
    },
  },
});
