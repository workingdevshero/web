# Verifying workingdevshero.com

A static Astro site served by a Cloudflare Worker (`worker/index.ts`). `wrangler.jsonc` sends only
the paths in `run_worker_first` through the Worker. Everything else comes straight from the built
assets in `dist/`. Verify the built site served by wrangler, never `astro dev`: the dev server skips
the Worker and the build-time steps (sitemap, RSS, `llms.txt`), so it can pass a PR that's broken in
production.

## Bringing it up

From the repository root:

```bash
npm ci --no-audit --no-fund
npm run build
npx --yes wrangler@4 dev --port "${JOB_PORT_FIRST:-8787}" --ip 127.0.0.1 > /tmp/wrangler.log 2>&1 &
echo $! > /tmp/wrangler.pid
```

Wait for `http://127.0.0.1:${JOB_PORT_FIRST:-8787}/` to answer before opening the browser (a few
seconds; the first run also downloads wrangler). No account or Cloudflare login is needed: `wrangler dev`
serves `dist/` and runs the Worker locally.

When you're done, stop it by the PID you recorded, children first, then confirm the port is quiet:

```bash
pid=$(cat /tmp/wrangler.pid); pkill -P "$pid"; kill "$pid"
curl -s -o /dev/null "http://127.0.0.1:${JOB_PORT_FIRST:-8787}/" && echo "still up" || echo "down"
```

Never find it by name: `pgrep -f wrangler` and `pkill -f` also match any process whose command line
mentions these notes, and one of those is your own session.

There is nothing else to start: no database, no backend, no login.

## What to verify

Start from what the PR changes, and check it in the browser and with `curl` against the local server:

- **Pages**: every page the diff touches renders, with no console errors, and so do `/` and `/blog/`.
  Check the layout at desktop width and at phone width (390px).
- **Blog posts**: a changed post renders at `/blog/<slug>/` with its title, date, hero image and body.
  Drafts (`draft: true`) must not appear in `/blog/`, `/rss.xml` or the sitemap.
- **Head tags**: for SEO or layout changes, read the served HTML (`curl -s <url>`) for the `<title>`,
  meta description, canonical URL, Open Graph tags and any `application/ld+json` block. JSON-LD has to
  parse as JSON.
- **Build outputs**: `/sitemap-index.xml` and the sitemap it points to, `/rss.xml`, `/llms.txt` and
  `/llms-full.txt` are generated at build time. Check them when the PR touches their sources.
- **Worker routes**: a change to `worker/**` or `run_worker_first` gets `curl -i` checks of the routed
  paths. For example, `/og-video.mp4` with `Range: bytes=0-99` must answer `206` with a
  `Content-Range` header.

## What's a finding

A finding is a difference between what the PR claims and what the local server serves, or something
the PR broke that worked before. Analytics (PostHog) and any third-party embeds may not load locally.
That's expected, not a finding.
