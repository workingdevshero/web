import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import rehypeExternalLinks from './src/plugins/rehype-external-links.mjs';

export default defineConfig({
  site: 'https://workingdevshero.com',
  integrations: [
    mdx(),
    sitemap(),
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
