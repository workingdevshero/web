// Opens off-site links in a new tab so readers don't lose their place in a post.
// Relative links, anchors, and links to workingdevshero.com itself stay in the same tab.
// Subdomains such as lofi.workingdevshero.com are separate sites, so they open in a new tab.
const SITE_HOST = 'workingdevshero.com';

export function isExternal(href) {
  if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return false;
  try {
    return new URL(href).hostname.replace(/^www\./, '') !== SITE_HOST;
  } catch {
    return false;
  }
}

export default function rehypeExternalLinks() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'element' && node.tagName === 'a' && isExternal(node.properties?.href)) {
        const rel = new Set([].concat(node.properties.rel ?? []));
        rel.add('noopener');
        rel.add('noreferrer');
        node.properties.target = '_blank';
        node.properties.rel = [...rel];
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
