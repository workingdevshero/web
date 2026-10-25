/**
 * Cloudflare Worker for workingdevshero.com.
 *
 * The site is static assets; wrangler.jsonc only routes the MP4 paths and the
 * legacy WordPress paths here (run_worker_first), so everything else is served
 * by the asset layer as before.
 *
 * Legacy WordPress asset URLs (/wp-content/**, /wp-includes/**, /wp-json/**,
 * and /wp-*.php) get HTTP 410 Gone. We deliberately use 410 instead of a 301 to
 * the homepage: WordPress uploads were permanently deleted in the migration to
 * Astro, and mass-redirecting to home is a soft-404 anti-pattern that confuses
 * crawlers. 410 tells indexers the resource is gone for good, so they deindex
 * the URLs faster than they would for a 404, and they stop associating the
 * stale 2023 WordPress entry with workingdevshero.com.
 *
 * Cloudflare Pages _redirects only supports 200/301/302/303/307/308 — not 410 —
 * so the Worker is the only correct place to emit this status.
 */
import { withRangeSupport } from './range';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

// Matches /wp-content/**, /wp-includes/**, /wp-json/**, /wp-admin(/**, and any /wp-*.php.
const LEGACY_WP_PATTERN = /^\/(?:wp-content|wp-includes|wp-json|wp-admin)(?:\/|$)|^\/wp-[^/]*\.php(?:\?|$)/i;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Permanently-deleted WordPress uploads/admin paths: 410 Gone.
    if (LEGACY_WP_PATTERN.test(url.pathname)) {
      return new Response('410 Gone\n', {
        status: 410,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    // Fetch the whole file; a Range header passed through would be ignored anyway.
    const assetRequest = new Request(request.url, { method: request.method });
    return withRangeSupport(request, await env.ASSETS.fetch(assetRequest));
  },
};
