# Onyx Home Improvement LLC — website

Static site for [onyxhomeimprovementllc.com](https://onyxhomeimprovementllc.com).
No framework, no JavaScript, no server-side build. GitHub Pages serves the
`.html` files in this repo directly.

---

## Before you launch — 2 things to fill in

Both live in **`content.mjs`**, near the top.

| What | Where | Why it matters |
|---|---|---|
| **Formspree form ID** | `BIZ.formspreeId` | The estimate form will not submit until this is set. See below. |
| **Contractor license #** | `BIZ.license` | Shown in the trust bar, footer, and contact page. Left blank, those lines are omitted entirely — nothing breaks, you just lose a trust signal that competitors display. |

After editing, run `node build.mjs` and commit.

Business hours are already set (`Open 7 days · 9 AM – 6 PM`), taken from your
Google Business Profile. If that is wrong, fix it in both places.

`BIZ.street` is deliberately left blank. The only address I could find publicly
listed for the business is an apartment unit, which I did not want to publish
without you deciding. A service-area business does not need a street address on
the site, so it currently shows "Fairfax, VA" only.

### Setting up the estimate form

GitHub Pages cannot process form submissions, so the form posts to Formspree.

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Create a new form. Set the notification email to `onyxhomeimprovementsllc@gmail.com`.
3. Copy the form ID from the endpoint they give you — the part after `/f/`,
   e.g. `https://formspree.io/f/xdorwkbl` → `xdorwkbl`.
4. Paste it into `BIZ.formspreeId` in `content.mjs`.
5. Run `node build.mjs`, commit, push.

The form already includes a hidden honeypot field for spam, and redirects to
`/thank-you/` on success. Free tier covers 50 submissions/month.

---

## Deploying

### First time

1. Create the repo on GitHub and push this directory.
2. **Settings → Pages → Build and deployment**: source = *Deploy from a branch*,
   branch = `main`, folder = `/ (root)`.
3. **Settings → Pages → Custom domain**: enter `onyxhomeimprovementllc.com`.
   The `CNAME` file in this repo already contains it.
4. At your DNS registrar, point the domain at GitHub:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `<your-github-username>.github.io` |

5. Wait for DNS to propagate, then tick **Enforce HTTPS** in the Pages settings.

⚠️ Point DNS at GitHub only once you are ready to switch off the old WordPress
site — the domain can only serve one of them at a time.

### Every time after

```sh
node build.mjs      # only needed if you changed content.mjs or build.mjs
git add -A
git commit -m "Update site"
git push
```

Pages redeploys in about a minute.

### ⚠️ Two build modes — preview vs production

The site is currently built for a **GitHub Pages project site**, which serves
from a subpath rather than the domain root. Every root-relative URL has been
prefixed to match:

```sh
BASE_PATH=/onyx-home-improvement node build.mjs   # preview (current)
node build.mjs                                    # production, custom domain
```

The preview build also emits `<meta name="robots" content="noindex">` and a
`Disallow: /` robots.txt, so the staging copy cannot be indexed as a duplicate
of the real site. It omits `CNAME` too, since that would force Pages onto the
custom domain and break the preview URL.

**Before you point `onyxhomeimprovementllc.com` at this repo, rebuild without
`BASE_PATH`** — otherwise every link and image will 404 on the real domain:

```sh
node build.mjs && git add -A && git commit -m "Build for custom domain" && git push
```

---

## Editing content

**Everything you would normally want to change is in `content.mjs`** — phone
number, service descriptions, reviews, service areas, FAQ. Edit it, run
`node build.mjs`, commit.

You *can* hand-edit the generated `.html` files, but the next `node build.mjs`
will overwrite them. Prefer `content.mjs`.

| File | What it holds |
|---|---|
| `content.mjs` | All copy and data. **Start here.** |
| `build.mjs` | Page templates and layout. Change this to alter page *structure*. |
| `assets/css/site.css` | All styling. Colours and type are tokens at the top. |
| `assets/img/manifest.json` | Generated image index — do not edit by hand. |
| `assets/service-area-map.svg` | Generated map — do not edit by hand, see below. |
| `tools/map.py` | Regenerates the service-area map. |

### Reviews

`BIZ.ratingCount` is the Google review count and is **hardcoded** — it was 77
at build time and does not update itself. Bump it when it drifts noticeably,
along with `BIZ.altRatingCount` for HomeAdvisor.

The two counts are shown separately rather than added together: HomeAdvisor
syndicates some of the same Google reviews, so summing them would double-count.

The "Leave us a review" link points at your Google Business Profile
(`BIZ.googleReviewUrl`). It is shown to everyone unconditionally — Google
prohibits "review gating", i.e. asking only customers who say they were happy.

### The service-area map

`assets/service-area-map.svg` is generated from US Census county boundaries by
`tools/map.py`. It is inline SVG — no map API, no key, no tiles, no tracking,
and it inherits the site palette.

To change which areas are shaded, edit `SERVED` / `CONTEXT` / `PINS` in
`tools/map.py`, then:

```sh
python3 tools/map.py    # downloads boundary data on first run
node build.mjs
```

Pin labels are positioned by hand via the `dy` value on each entry, because the
DC-area jurisdictions are packed tightly enough that automatic placement
collides. If you add a pin near the Beltway, expect to nudge it.

### Adding photos

Images are pre-generated at several sizes in AVIF and WebP. To add new ones,
drop the originals somewhere and run a resize pass producing
`<slug>-<width>.avif` / `.webp` files into `assets/img/`, then add the slug and
alt text to `assets/img/manifest.json`. Reference the slug from `content.mjs`.

Alt text matters for both accessibility and image search — describe what is
actually in the photo, not "driveway 4".

---

## What was carried over from the old site

- **All service page URLs are unchanged** (`/masonry/brickwork/`,
  `/stone-work/patio-design/`, etc.) so existing Google rankings and inbound
  links keep working without redirects.
- Service area URLs (`/service-areas/fairfax-va/` …) are preserved too, now as
  real pages rather than the old stubs.
- `/about-us/`, `/portfolio/`, `/get-your-free-estimate/`, and `/thank-you/`
  keep their old paths.
- Copy is adapted from the old site; photographs are the genuine job photos
  from the old media library (the stock imagery was left behind).

**Not carried over:** the blog. Old post URLs under `/blog/` will 404. If you
want those preserved, say so and they can be ported.

---

## Notes on the build

- **Zero JavaScript.** The mobile menu and FAQ accordions use native
  `<details>`; scroll reveals use CSS scroll-driven animations and degrade to
  simply being visible in browsers that lack support.
- **Fonts are self-hosted** (Fraunces + DM Sans, latin subset, ~72 KB total) —
  no Google Fonts request, no third-party connection.
- **Images** are AVIF with WebP fallback, sized per role, lazy-loaded below the
  fold. The hero is preloaded with a matching `imagesrcset`.
- **Structured data**: `HomeAndConstructionBusiness` on the home page, `Service`
  on each service page, `FAQPage` where the FAQ appears.

  Review markup is deliberately **not** included. Google's guidelines prohibit
  marking up third-party reviews (Angi/HomeAdvisor/Google) as your own
  `aggregateRating`, and doing it risks a manual penalty. The reviews are shown
  to visitors and linked to the source, which is the safe way to use them.

- A `.nojekyll` file is present so GitHub Pages serves the directory as-is.

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```
