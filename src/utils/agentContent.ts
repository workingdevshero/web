import type { CollectionEntry } from 'astro:content';

export interface AgentPost {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  author: string;
  categories: string[];
  tags: string[];
  body: string;
}

export const SITE_NAME = "Working Dev's Hero";
export const SITE_TAGLINE =
  'AI-enabled software development company. We build AI-powered software that ships.';

export function toAgentPost(entry: CollectionEntry<'blog'>): AgentPost {
  return {
    slug: entry.slug,
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.pubDate,
    updatedDate: entry.data.updatedDate,
    author: entry.data.author,
    categories: entry.data.categories,
    tags: entry.data.tags,
    body: entry.body ?? '',
  };
}

export function sortByPubDateDesc(posts: AgentPost[]): AgentPost[] {
  return [...posts].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

export function absoluteUrl(site: string, path: string): string {
  return new URL(path, site).href;
}

export function postHtmlUrl(site: string, post: AgentPost): string {
  return absoluteUrl(site, `/blog/${post.slug}/`);
}

export function postMarkdownUrl(site: string, post: AgentPost): string {
  return absoluteUrl(site, `/blog/${post.slug}.md`);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function renderPostMarkdown(site: string, post: AgentPost): string {
  const meta = [
    `- Published: ${formatDate(post.pubDate)}`,
    ...(post.updatedDate ? [`- Updated: ${formatDate(post.updatedDate)}`] : []),
    `- Author: ${post.author}`,
    ...(post.categories.length ? [`- Categories: ${post.categories.join(', ')}`] : []),
    ...(post.tags.length ? [`- Tags: ${post.tags.join(', ')}`] : []),
    `- Canonical: ${postHtmlUrl(site, post)}`,
  ];

  return [`# ${post.title}`, `> ${post.description}`, meta.join('\n'), post.body.trim()].join(
    '\n\n'
  ) + '\n';
}

export function renderLlmsTxt(site: string, posts: AgentPost[]): string {
  const postList = sortByPubDateDesc(posts)
    .map((post) => `- [${post.title}](${postMarkdownUrl(site, post)}): ${post.description}`)
    .join('\n');

  return `# ${SITE_NAME}

> ${SITE_TAGLINE}

Every blog article is available as plain markdown at the \`.md\` URLs below. The complete text of all articles is in [llms-full.txt](${absoluteUrl(site, '/llms-full.txt')}).

## Blog

${postList}

## Optional

- [About](${absoluteUrl(site, '/about/')}): Who we are and how we work
- [Services](${absoluteUrl(site, '/services/')}): What we build for clients
- [Portfolio](${absoluteUrl(site, '/portfolio/')}): Selected projects and case studies
- [Contact](${absoluteUrl(site, '/contact/')}): Get in touch
`;
}

export function renderLlmsFullTxt(site: string, posts: AgentPost[]): string {
  const articles = sortByPubDateDesc(posts)
    .map((post) => renderPostMarkdown(site, post).trim())
    .join('\n\n---\n\n');

  return `# ${SITE_NAME} — Full Blog Content

> ${SITE_TAGLINE}

${articles}
`;
}
