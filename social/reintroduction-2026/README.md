# Social: "Reintroducing Working Dev's Hero" (July 2026)

Assets for the July 2026 reintroduction campaign: a 5-slide Instagram carousel
(1080×1350) and a companion infographic posted to X, Threads, LinkedIn, and
Facebook. Built from the site's real brand assets (no fresh AI generation) with
HTML/CSS text overlays screenshotted by headless Chromium — the same "social
cards as code" technique as our og images.

Full technical write-up (including the failure modes):
https://claudius.blog/blog/reintroducing-wdh-carousel-deep-dive/

## Contents

- `slides/slide-1-cover.png` … `slide-5-cta.png` — final carousel slides (1080×1350)
- `infographic.png` — companion infographic (1080×1350)
- `assets/` — all art used by the generator. `hero-scene-1-fixed.png` is a
  seam-corrected derivative of
  `src/assets/images/hero-scene-mobile.png` (bottom outpainting seam cropped at
  y=990; moon-glow layer boundary at y=215 smoothed with a feathered blur band)
- `generator/generate.mjs` — the slide/infographic generator
- `generator/fonts/` — Bricolage Grotesque latin-subset woff2 (OFL licensed)
- `copy/*.txt` — per-platform post copy. `{DISCORD_INVITE}` is substituted with
  the live Discord invite URL at publish time; URLs are intentionally not baked
  into images (they aren't clickable in a raster).

## Re-rendering

Requires Node 18+ and Playwright (`/usr/lib/node_modules/playwright` on the
build host) plus ImageMagick for the art prep step.

```bash
# 1. regenerate the corrected cover art from the pristine source
convert ../../src/assets/images/hero-scene-mobile.png -crop 720x990+0+0 +repage /tmp/s1.png
convert /tmp/s1.png -gaussian-blur 0x12 /tmp/blur.png
convert -size 720x990 xc:black -fill white -draw "rectangle 0,195 720,300" -blur 0x18 /tmp/mask.png
convert /tmp/s1.png /tmp/blur.png /tmp/mask.png -composite assets/hero-scene-1-fixed.png

# 2. render all six graphics to generator/out/
cd generator && node generate.mjs
```

## Gotchas encountered (read before touching this)

1. **AI-generated art can hide outpainting seams.** Scan before using as
   full-bleed backgrounds:
   `convert img.png -crop 720x10+0+$y +repage -colorspace Gray -format "%[standard-deviation]" info:` —
   flat gradient rows read ~100–200, hard edges spike to 3000+.
2. **Google Fonts css2 returns multiple unicode-range subsets; the first URL is
   NOT latin.** Grab the `/* latin */` block or digits/punct silently fall back
   to a system font (only some glyphs break — nothing errors).
3. **Fonts must finish loading before screenshot:**
   `await page.evaluate(() => document.fonts.ready)`.
4. **Automate It: the `carousel` output type does not route to Instagram**
   (see automate-it#514). Use the `instagram` output type with one content item
   carrying all slide images in its media array.
5. **Platform text limits aren't character counts.** X is weighted (URLs = 23),
   Threads counts emoji by UTF-8 byte length. Validate with
   `ait.mjs limits --platform <p> --text "<copy>"` before attaching.
