/**
 * Cloudflare Worker for workingdevshero.com.
 *
 * The site is static assets; wrangler.jsonc only routes the MP4 paths and the
 * legacy WordPress paths here (run_worker_first), so everything else is served
 * by the asset layer as before.
 *
 * Legacy WordPress URLs get 410 Gone on purpose (not a 301 to home, which is a
 * soft 404). _redirects cannot emit 410, so it has to happen here.
 */
import { withRangeSupport } from './range';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const LEGACY_WP_PATTERN = /^\/(?:wp-content|wp-includes|wp-json|wp-admin)(?:\/|$)|^\/(?:wp-[^/]*|xmlrpc)\.php\/?$/i;

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
