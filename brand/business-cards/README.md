# Business cards

Built from `scripts/business-card.html` by `scripts/build-business-card.mjs`:

```bash
node scripts/build-business-card.mjs
```

Standard US card size (3.5in × 2in) rendered at 2× device scale, so every PNG is
**2100 × 1200** — 600 DPI, print-ready as-is. `CHROME` overrides the browser
path; otherwise the usual macOS/Linux/Windows install locations are searched.

| File | Size | Use |
|---|---|---|
| `business-card-front.png` | 2100 × 1200 | Front (logo + wordmark) |
| `business-card-back.png` | 2100 × 1200 | Back (Bobby, contact details) |
| `business-card-sheet.png` | 4280 × 1240 | Two-up review sheet (front + back) |

Print notes: the artwork has no bleed. Keep ~1/8in of the edge clear (the layout
already pads to ~1/4in), and tell the printer "3.5 × 2in, no bleed" or let them
scale to fit. To preview the source with trim/safe guides, open
`scripts/business-card.html?side=sheet&guides` from a local server.
