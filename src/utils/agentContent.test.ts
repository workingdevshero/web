import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  postHtmlUrl,
  postMarkdownUrl,
  renderLlmsFullTxt,
  renderLlmsTxt,
  renderPostMarkdown,
  sortByPubDateDesc,
  type AgentPost,
} from './agentContent';

const SITE = 'https://workingdevshero.com/';

function makePost(overrides: Partial<AgentPost> = {}): AgentPost {
  return {
    slug: 'docs-age-of-ai',
    title: 'The Best Way to Write Docs in the Age of AI',
    description: 'Rebuilding the docs site in one session.',
    pubDate: new Date('2026-07-11T19:00:00-04:00'),
    author: 'bobbyg603',
    categories: ['AI', 'Software'],
    tags: ['ai', 'docs'],
    body: 'We rewrote the entire docs site in one working session.',
    ...overrides,
  };
}

describe('absoluteUrl', () => {
  it('joins paths against the site origin', () => {
    expect(absoluteUrl(SITE, '/llms-full.txt')).toBe('https://workingdevshero.com/llms-full.txt');
  });

  it('handles a site URL without a trailing slash', () => {
    expect(absoluteUrl('https://workingdevshero.com', '/blog/foo.md')).toBe(
      'https://workingdevshero.com/blog/foo.md'
    );
  });
});

describe('post URLs', () => {
  it('builds the canonical HTML URL', () => {
    expect(postHtmlUrl(SITE, makePost())).toBe('https://workingdevshero.com/blog/docs-age-of-ai/');
  });

  it('builds the markdown twin URL', () => {
    expect(postMarkdownUrl(SITE, makePost())).toBe(
      'https://workingdevshero.com/blog/docs-age-of-ai.md'
    );
  });
});

describe('sortByPubDateDesc', () => {
  it('sorts newest first without mutating the input', () => {
    const older = makePost({ slug: 'older', pubDate: new Date('2025-01-01') });
    const newer = makePost({ slug: 'newer', pubDate: new Date('2026-01-01') });
    const input = [older, newer];

    expect(sortByPubDateDesc(input).map((p) => p.slug)).toEqual(['newer', 'older']);
    expect(input.map((p) => p.slug)).toEqual(['older', 'newer']);
  });
});

describe('renderPostMarkdown', () => {
  it('includes title, description, metadata, and body', () => {
    const md = renderPostMarkdown(SITE, makePost());

    expect(md).toContain('# The Best Way to Write Docs in the Age of AI');
    expect(md).toContain('> Rebuilding the docs site in one session.');
    expect(md).toContain('- Published: 2026-07-11');
    expect(md).toContain('- Author: bobbyg603');
    expect(md).toContain('- Categories: AI, Software');
    expect(md).toContain('- Tags: ai, docs');
    expect(md).toContain('- Canonical: https://workingdevshero.com/blog/docs-age-of-ai/');
    expect(md).toContain('We rewrote the entire docs site in one working session.');
  });

  it('includes the updated date only when present', () => {
    expect(renderPostMarkdown(SITE, makePost())).not.toContain('- Updated:');
    expect(
      renderPostMarkdown(SITE, makePost({ updatedDate: new Date('2026-07-15T12:00:00Z') }))
    ).toContain('- Updated: 2026-07-15');
  });

  it('keeps the local calendar day for late-evening offset timestamps', () => {
    // 2026-07-11 21:00 EDT is already 2026-07-12 01:00 UTC — must not print 2026-07-12.
    const md = renderPostMarkdown(
      SITE,
      makePost({ pubDate: new Date('2026-07-11T21:00:00-04:00') })
    );
    expect(md).toContain('- Published: 2026-07-11');
    expect(md).not.toContain('- Published: 2026-07-12');
  });

  it('omits empty categories and tags lines', () => {
    const md = renderPostMarkdown(SITE, makePost({ categories: [], tags: [] }));
    expect(md).not.toContain('- Categories:');
    expect(md).not.toContain('- Tags:');
  });
});

describe('renderLlmsTxt', () => {
  it('lists every post as a markdown link with its description, newest first', () => {
    const older = makePost({
      slug: 'older',
      title: 'Older Post',
      description: 'The older one.',
      pubDate: new Date('2025-01-01'),
    });
    const txt = renderLlmsTxt(SITE, [older, makePost()]);

    expect(txt).toContain("# Working Dev's Hero");
    expect(txt.indexOf('docs-age-of-ai.md')).toBeLessThan(txt.indexOf('older.md'));
    expect(txt).toContain(
      '- [Older Post](https://workingdevshero.com/blog/older.md): The older one.'
    );
    expect(txt).toContain('https://workingdevshero.com/llms-full.txt');
  });
});

describe('renderLlmsFullTxt', () => {
  it('concatenates full article markdown separated by horizontal rules', () => {
    const other = makePost({
      slug: 'other',
      title: 'Other Post',
      body: 'Other body text.',
      pubDate: new Date('2025-01-01'),
    });
    const txt = renderLlmsFullTxt(SITE, [makePost(), other]);

    expect(txt).toContain('# The Best Way to Write Docs in the Age of AI');
    expect(txt).toContain('# Other Post');
    expect(txt).toContain('Other body text.');
    expect(txt).toContain('\n\n---\n\n');
  });
});
