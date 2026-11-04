# Business cards

Built from `scripts/business-card.html` by `scripts/build-business-card.mjs`:

```bash
node scripts/build-business-card.mjs
```

Standard US card size (3.5in × 2in) at **300 DPI**, so every PNG is exactly
**1050 × 600** and prints at true size. `CHROME` overrides the browser path;
otherwise the usual macOS/Linux/Windows install locations are searched.

| File | Size | Use |
|---|---|---|
| `business-card-front.png` | 1050 × 600 | Front — contact details on the brand purple |
| `business-card-back.png` | 1050 × 600 | Back — the homepage hero scene, full bleed, no text |
| `business-card-sheet.png` | 2180 × 640 | Two-up review sheet (front + back) |

The back uses `src/assets/images/hero-scene-wide.png` — the same rooftop art the
homepage hero uses (`src/components/home/Hero.astro`). Tune the crop with the
`--scene-pos` variable in the template (`100%` = right edge flush; lower values
push the hero further right).

Print notes: the artwork has no bleed. Keep ~1/8in of the edge clear (the layout
already pads to ~1/4in), and tell the printer "3.5 × 2in, no bleed" or let them
scale to fit. To preview the source with trim/safe guides, open
`scripts/business-card.html?side=sheet&guides` from a local server.
