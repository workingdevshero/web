import { describe, expect, it } from 'vitest';
import worker from './index';

const env = { ASSETS: { fetch: async () => new Response('asset', { status: 200 }) } };

async function status(path: string): Promise<number> {
  return (await worker.fetch(new Request(`https://workingdevshero.com${path}`), env)).status;
}

describe('legacy WordPress paths', () => {
  it.each([
    '/wp-content/uploads/2023/01/a.png',
    '/wp-includes/js/jquery.js',
    '/wp-json/wp/v2/posts',
    '/wp-admin',
    '/wp-admin/edit.php',
    '/wp-login.php',
    '/wp-login.php/',
    '/xmlrpc.php',
  ])('%s is 410 Gone', async (path) => {
    expect(await status(path)).toBe(410);
  });

  it.each(['/', '/blog/', '/wp-contentious', '/videos/a.mp4'])('%s is served from assets', async (path) => {
    expect(await status(path)).toBe(200);
  });
});
