# Business cards

Built from `scripts/business-card.html` by `scripts/build-business-card.mjs`:

```bash
node scripts/build-business-card.mjs
```

Styled after the homepage hero (`src/components/home/Hero.astro`): the rooftop
night scene, the "We Build AI-Powered Software That Ships" headline, and the
white bottom wave.

Standard US card size (3.5in × 2in) at **300 DPI**, so every PNG is exactly
**1050 × 600** and prints at true size. `CHROME` overrides the browser path;
otherwise the usual macOS/Linux/Windows install locations are searched.

| File | Size | Use |
|---|---|---|
| `business-card-front.png` | 1050 × 600 | Front (hero scene + headline) |
| `business-card-back.png` | 1050 × 600 | Back (Bobby, contact details) |
| `business-card-sheet.png` | 2180 × 640 | Two-up review sheet (front + back) |

Print notes: the artwork has no bleed. Keep ~1/8in of the edge clear (the layout
already pads to ~1/4in), and tell the printer "3.5 × 2in, no bleed" or let them
scale to fit. To preview the source with trim/safe guides, open
`scripts/business-card.html?side=sheet&guides` from a local server.
