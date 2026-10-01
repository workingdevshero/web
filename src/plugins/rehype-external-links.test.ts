import { describe, expect, it } from 'vitest';
import rehypeExternalLinks, { isExternal } from './rehype-external-links.mjs';

const link = (href: string, properties: Record<string, unknown> = {}) => ({
  type: 'element',
  tagName: 'a',
  properties: { href, ...properties },
  children: [{ type: 'text', value: 'link' }],
});

const run = (...children: ReturnType<typeof link>[]) => {
  const tree = { type: 'root', children: [{ type: 'element', tagName: 'p', properties: {}, children }] };
  rehypeExternalLinks()(tree);
  return children;
};

describe('isExternal', () => {
  it('treats other sites as external', () => {
    expect(isExternal('https://youtu.be/Lq1RZYq4caM')).toBe(true);
    expect(isExternal('http://example.com/a')).toBe(true);
  });

  it('treats subdomains as separate sites', () => {
    expect(isExternal('https://lofi.workingdevshero.com')).toBe(true);
  });

  it('keeps our own site, relative links, anchors, and mailto in place', () => {
    expect(isExternal('https://workingdevshero.com/blog/x')).toBe(false);
    expect(isExternal('https://www.workingdevshero.com/')).toBe(false);
    expect(isExternal('/blog/supermog-builds-itself')).toBe(false);
    expect(isExternal('#plan')).toBe(false);
    expect(isExternal('mailto:hi@example.com')).toBe(false);
    expect(isExternal(undefined)).toBe(false);
  });
});

describe('rehypeExternalLinks', () => {
  it('opens external links in a new tab safely', () => {
    const [a] = run(link('https://lofi.workingdevshero.com'));
    expect(a.properties).toMatchObject({ target: '_blank', rel: ['noopener', 'noreferrer'] });
  });

  it('leaves internal links alone', () => {
    const [a] = run(link('/blog/supermog-builds-itself'));
    expect(a.properties).not.toHaveProperty('target');
    expect(a.properties).not.toHaveProperty('rel');
  });

  it('keeps any rel values a link already had', () => {
    const [a] = run(link('https://example.com', { rel: ['sponsored'] }));
    expect(a.properties.rel).toEqual(['sponsored', 'noopener', 'noreferrer']);
  });

  it('finds links nested anywhere in the tree', () => {
    const inner = link('https://example.com');
    const tree = {
      type: 'root',
      children: [{ type: 'element', tagName: 'ul', properties: {}, children: [{ type: 'element', tagName: 'li', properties: {}, children: [inner] }] }],
    };
    rehypeExternalLinks()(tree);
    expect(inner.properties.target).toBe('_blank');
  });
});
