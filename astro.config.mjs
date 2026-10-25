import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import rehypeExternalLinks from './src/plugins/rehype-external-links.mjs';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Build a slug → { pubDate, updatedDate } map at config time by parsing the
// blog frontmatter directly. We avoid importing astro:content here (not
// available in the config scope) and add no new dependencies: a minimal
// regex pulls the first occurrence of pubDate / updatedDate from each file.
// Used to set <lastmod> on sitemap entries so indexers see freshness signals.
function buildSlugDateMap() {
  const dir = join(process.cwd(), 'src/content/blog');
  const map = new Map();
  let maxDate = new Date(0);
  try {
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;
      const slug = file.replace(/\.(mdx|md)$/, '');
      const text = readFileSync(join(dir, file), 'utf8');
      const fm = text.split('---\n', 2)[1] ?? '';
      const pub = fm.match(/^pubDate:\s*(.+)$/m)?.[1]?.trim();
      const upd = fm.match(/^updatedDate:\s*(.+)$/m)?.[1]?.trim();
      const pubDate = pub ? new Date(pub) : null;
      const updatedDate = upd ? new Date(upd) : null;
      const effective = updatedDate ?? pubDate;
      if (effective && effective > maxDate) maxDate = effective;
      map.set(slug, { pubDate, updatedDate, effective });
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
        // /blog/<slug> → updatedDate || pubDate for that post; everything else
        // (homepage, /blog index, category/tag pages, etc.) → site-wide latest.
        const match = item.url.match(/\/blog\/([^/]+)\/?$/);
        if (match && slugDateMap.has(match[1])) {
          const entry = slugDateMap.get(match[1]);
          const last = entry.updatedDate ?? entry.pubDate;
          if (last) item.lastmod = last.toISOString();
        } else if (siteLatest > new Date(0)) {
          item.lastmod = siteLatest.toISOString();
        }
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
