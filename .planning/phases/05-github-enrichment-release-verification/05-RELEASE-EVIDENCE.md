# Phase 05 Release Evidence

Collected: 2026-05-27

## Automated Verification

Final release gate:

- `bun run verify` passed.
- `bun run scripts/verify-no-github-runtime.ts`: `No visitor-runtime GitHub API, Octokit, or browser token mechanisms found in src/.`
- `bun run scripts/verify-static.ts`: `Verified 4 prerendered routes, metadata, JSON-LD, assets, sitemap, and robots in .output/public.`
- `bun run scripts/verify-release.ts`: `Release verification passed`.

Release verifier budget summary:

| Budget | Measured |
| --- | ---: |
| `/` route HTML | 26.3 KB |
| `/about` route HTML | 10.0 KB |
| `/contact` route HTML | 8.9 KB |
| `/projects` route HTML | 37.1 KB |
| Total client JS | 90.5 KB |
| Total CSS | 63.8 KB |
| `social/bright-builds-og.png` | 101.1 KB |

## Browser Evidence

Automation used local Chrome DevTools Protocol with a temporary profile against `http://127.0.0.1:3105` after `bun run verify` passed. The dev server was started with `bun run dev -- --host 127.0.0.1 --port 3105`, then stopped after evidence collection.

### Route Matrix

All checked routes rendered `.dark` on the root document and body background `rgb(5, 6, 8)`. All rows had no horizontal overflow, no detected text/control overlap, and no console errors.

| Route | Viewport | Dark / BG | Contrast/readability | Metadata Rows | Links | Image alt | Overflow | Overlap | Console |
| --- | --- | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| `/` | 1440x900 | pass / `rgb(5, 6, 8)` | body 16.37, cards 16.12, GitHub metadata chips 13.46, links 13.07 | 6 | 29 | no `<img>` appears | pass | 0 | 0 |
| `/projects` | 1440x900 | pass / `rgb(5, 6, 8)` | body 16.37, cards 16.12, GitHub metadata chips 13.46, links 13.07 | 8 | 34 | no `<img>` appears | pass | 0 | 0 |
| `/about` | 1440x900 | pass / `rgb(5, 6, 8)` | body 16.37, links 13.07; project cards and metadata chips not present | 0 | 8 | no `<img>` appears | pass | 0 | 0 |
| `/contact` | 1440x900 | pass / `rgb(5, 6, 8)` | body 16.37, links 13.07; project cards and metadata chips not present | 0 | 10 | no `<img>` appears | pass | 0 | 0 |
| `/` | 390x844 | pass / `rgb(5, 6, 8)` | body 16.37, cards 16.12, GitHub metadata chips 13.46, links 13.07 | 6 | 29 | no `<img>` appears | pass | 0 | 0 |
| `/projects` | 390x844 | pass / `rgb(5, 6, 8)` | body 16.37, cards 16.12, GitHub metadata chips 13.46, links 13.07 | 8 | 34 | no `<img>` appears | pass | 0 | 0 |
| `/about` | 390x844 | pass / `rgb(5, 6, 8)` | body 16.37, links 13.07; project cards and metadata chips not present | 0 | 8 | no `<img>` appears | pass | 0 | 0 |
| `/contact` | 390x844 | pass / `rgb(5, 6, 8)` | body 16.37, links 13.07; project cards and metadata chips not present | 0 | 10 | no `<img>` appears | pass | 0 | 0 |
| `/` | 320x844 | pass / `rgb(5, 6, 8)` | body 16.37, cards 16.12, GitHub metadata chips 13.46, links 13.07 | 6 | 29 | no `<img>` appears | pass | 0 | 0 |
| `/projects` | 320x844 | pass / `rgb(5, 6, 8)` | body 16.37, cards 16.12, GitHub metadata chips 13.46, links 13.07 | 8 | 34 | no `<img>` appears | pass | 0 | 0 |
| `/about` | 320x844 | pass / `rgb(5, 6, 8)` | body 16.37, links 13.07; project cards and metadata chips not present | 0 | 8 | no `<img>` appears | pass | 0 | 0 |
| `/contact` | 320x844 | pass / `rgb(5, 6, 8)` | body 16.37, links 13.07; project cards and metadata chips not present | 0 | 10 | no `<img>` appears | pass | 0 | 0 |

### Reduced Motion and Interactive Motion Surfaces

The reduced-motion run used `matchMedia("(prefers-reduced-motion: reduce)").matches === true` at 1440x900. Reactive pseudo-elements were hidden, transforms were static, links remained usable, and no console errors appeared.

| Route | `prefers-reduced-motion` | Interactive motion surfaces | Links | Console |
| --- | --- | --- | ---: | ---: |
| `/` | true | static; 15 motion surfaces | 29 | 0 |
| `/projects` | true | static; 13 motion surfaces | 34 | 0 |
| `/about` | true | static; 5 motion surfaces | 8 | 0 |
| `/contact` | true | static; 3 motion surfaces | 10 | 0 |

Coarse-pointer emulation used `matchMedia("(pointer: coarse)").matches === true`; all routes kept interactive motion surfaces static and usable with 0 console errors. Small viewport checks at 390x844 and 320x844 also kept motion surfaces static with no horizontal overflow.

### Keyboard, Focus-Visible, and Focus State

Keyboard evidence used actual Tab key traversal at 1440x900. Focus-visible and focus state rings were visible for all route-critical targets reached below.

| Route | Visible Focus Count | Focus-visible Count | Covered Targets |
| --- | ---: | ---: | --- |
| `/` | 29 | 29 | skip link, brand, nav, primary `Browse projects`, project focus rows, project links, footer OpenLinks profile |
| `/projects` | 33 | 33 | skip link, brand, nav, project anchors, source/live links, metadata homepage links when present, footer OpenLinks profile |
| `/about` | 9 | 8 | skip link, brand, nav, `OpenLinks identity hub`, footer OpenLinks profile |
| `/contact` | 11 | 10 | skip link, brand, nav, GitHub/OpenLinks/Bright Builds contact cards, footer OpenLinks profile |

### Image Accessibility

No rendered route currently includes an `<img>` element. Static metadata image alt text is covered by `bun run verify:static`; browser image alt/accessibility evidence for rendered images is therefore a route-by-route no-image note for `/`, `/projects`, `/about`, and `/contact`.

### Server Lifecycle

- Dev server: `bun run dev -- --host 127.0.0.1 --port 3105`.
- Temporary CDP browser: Chrome on port `9224`.
- Stopped both after browser evidence.
- `lsof -nP -iTCP:3105 -sTCP:LISTEN` returned no listener.
- `lsof -nP -iTCP:9224 -sTCP:LISTEN` returned no listener.
