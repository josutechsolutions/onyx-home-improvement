# Onyx Home Improvement LLC — website

Static site for [onyxhomeimprovementllc.com](https://onyxhomeimprovementllc.com).
No framework and no server-side build. GitHub Pages serves the `.html` files in
this repo directly. The only JavaScript on the site is the Google Analytics
snippet, and that is omitted entirely until you set `BIZ.ga4Id`.

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

### Logo and icons

Source artwork lives in `assets/logo-src/` (`Onyx_logo_black.png` and
`Onyx_logo_white.png`). Everything derived from them is regenerated by:

```sh
node tools/icons.mjs
```

Run that only when a source logo changes — the output is committed, and
`node build.mjs` neither needs nor touches it (build.mjs has no image
encoder; `tools/icons.mjs` carries the only PNG codec in the repo).

| Where | Asset |
|---|---|
| Masthead | `onyx-mark-dark-*` — roof + ONYX only |
| Footer | `onyx-full-dark-*` — full lockup |
| Tab icon | `favicon.ico` (16/32/48), `favicon.svg`, `favicon-32.png` |
| iOS home screen | `apple-touch-icon.png` (180px) |

Three things worth knowing before you change any of it:

- **The masthead uses the roof + ONYX crop, not the full logo.** The HOME
  IMPROVEMENTS line is 69px of an 830px-tall logo, so at masthead size it
  renders under 5px and turns to mush.
- **The favicon is the roof alone.** Neither the letterforms nor the tagline
  survive 16px. Its stroke is drawn much heavier than the real logo's, which
  would scale to about a quarter of a pixel and vanish. It sits white on onyx
  so it holds up against light and dark tab bars alike.
- **The dark-background logo is the black artwork recoloured, not
  `assets/logo-src/Onyx_logo_white.png`.** That file stores its glow as RGB luminance over
  black with the alpha channel almost entirely zero, and its artwork sits at a
  different scale (aspect 1.51 against the black file's 1.67) — using it would
  make the logo change proportion between header and footer. The recoloured
  `*-light-*` files are generated and available if a dark surface ever needs
  one; nothing references them today.

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

---

## Projects

Real completed jobs live in `PROJECTS` in **`content.mjs`**. Each one generates
its own page beneath its service — e.g.
`/masonry/driveway-paving/asphalt-driveway-springfield-va/` — and is linked
automatically from three places: the service page, the city page, and
`/portfolio/`. Sitemap entry and `CreativeWork` schema are generated too.

### Adding a job

1. Save two JPEGs into `assets/img/projects/`: `{slug}-1200.jpg` and
   `{slug}-760.jpg`.
2. Add an entry to `PROJECTS` with `slug`, `title`, `city`, `service`
   (must match a `SERVICES` `href`), `material`, `w`/`h`, `alt`,
   `summary`, and `body`.
3. `node build.mjs`.

The build warns if a project's `service` matches nothing, or if its `city` is
not in `AREAS` (which would leave no city page linking to it).

### Two rules that matter

**Every entry must be a job that happened.** These pages are evidence a
homeowner uses to decide who to hire. Inventing a location to fill out
coverage is a false claim about the business, and Google treats
service × city pages generated in bulk as [doorway pages](https://developers.google.com/search/docs/essentials/spam-policies#doorway-pages)
and demotes them. Nine real projects beat sixty invented ones.

**City pages degrade honestly.** A city with its own project shows "Our work in
{city}". A city without one shows recent work from elsewhere, labelled as
being from elsewhere. Nothing implies a job happened where it did not.

### Project photos are JPEG, not AVIF/WebP

The rest of the site uses the AVIF/WebP set built by the image pipeline.
Project photos came from the Google Business Profile after that pipeline had
already run, and there is no AVIF or WebP encoder available here — so they are
plain JPEGs at two widths, served through a `srcset`. If you ever regenerate
the image set, fold these in and switch `projectPicture()` in `build.mjs`
over to `picture()`.

---

## Search Console & Analytics

Both are configured in **`content.mjs`** under `BIZ`, and both are omitted from
the HTML entirely while blank — the site is safe to ship before either account
exists.

| Field | Where to get it |
|---|---|
| `BIZ.gscVerification` | [Search Console](https://search.google.com/search-console) → Add property → **URL prefix** → HTML tag method. Copy only the `content="…"` token, not the whole tag. |
| `BIZ.ga4Id` | [GA4](https://analytics.google.com) → Admin → Data streams → Web → Measurement ID (`G-XXXXXXXXXX`). |

Set them, run `node build.mjs`, commit, and push. Then:

1. **Verify** in Search Console — the tag is live on the deployed page.
2. **Submit the sitemap** at `https://onyxhomeimprovementllc.com/sitemap.xml`.
   This is a separate step; verification alone does not submit it.
3. **Link GA4 to Search Console** (GA4 → Admin → Product links) so search
   queries show up alongside traffic.

Two behaviours worth knowing:

- The **verification tag is emitted on every build**, staging included, so it
  is already in place whenever you get round to verifying.
- The **GA4 snippet is emitted only on a production build** (no `BASE_PATH`).
  A staging preview and a `localhost` run would otherwise be recorded as real
  traffic in the same property.

Search Console reports nothing until the site is indexable — while the staging
build's `noindex` and `Disallow: /` are in place, expect an empty report. See
[Two build modes](#️-two-build-modes--preview-vs-production).

If you add GA4, the site sets analytics cookies, which brings it in scope of
disclosure rules in some jurisdictions. A short privacy notice linked from the
footer is the usual answer; there isn't one yet.

---

## Local preview

The build writes root-relative URLs (`/assets/css/site.css`). A staging build
prefixes them with `BASE_PATH`, so serving the repo directly at
`localhost:8000` gives an **unstyled page with broken links** — the paths
expect a `/onyx-home-improvement/` prefix that isn't there.

For a **staging build** (`BASE_PATH=/onyx-home-improvement`), serve a parent
directory containing a matching symlink:

```sh
mkdir -p /tmp/preview && ln -sfn "$PWD" /tmp/preview/onyx-home-improvement
cd /tmp/preview && python3 -m http.server 8000
# then open http://localhost:8000/onyx-home-improvement/
```

For a **production build** (no `BASE_PATH`), the simple form works:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```
