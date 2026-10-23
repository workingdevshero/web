/**
 * Cloudflare Worker for workingdevshero.com.
 *
 * The site is static assets; wrangler.jsonc only routes the MP4 paths here
 * (run_worker_first), so everything else is served by the asset layer as before.
 */
import { withRangeSupport } from './range';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Fetch the whole file; a Range header passed through would be ignored anyway.
    const assetRequest = new Request(request.url, { method: request.method });
    return withRangeSupport(request, await env.ASSETS.fetch(assetRequest));
  },
};
