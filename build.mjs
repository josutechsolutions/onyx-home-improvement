/* ==========================================================================
   Onyx Home Improvement LLC — static site generator
   --------------------------------------------------------------------------
   Reads content.mjs, writes plain .html files to the repo root. GitHub Pages
   serves those files directly; there is no build step on the server and no
   GitHub Action required.

   Usage:  node build.mjs
   ========================================================================== */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  BIZ, NAV, SERVICES, REVIEWS, FEATURED_REVIEWS, AREAS, WARRANTY,
  PORTFOLIO, HOME_PORTFOLIO, FAQ, POINTS, PROJECTS, REDIRECTS,
  BLOG_SETTINGS, BLOG_POSTS,
} from './content.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const IMG = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/img/manifest.json'), 'utf8'));
const AREA_MAP = fs.readFileSync(path.join(ROOT, 'assets/service-area-map.svg'), 'utf8').trim();

/* Serving from a subpath (a GitHub Pages project site, e.g.
   /onyx-home-improvement/) breaks every root-relative URL. Set BASE_PATH to
   prefix them:  BASE_PATH=/onyx-home-improvement node build.mjs
   Leave it unset for the custom domain, where the site sits at the root. */
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');

const warnings = [];
let written = 0;

/* --- helpers ------------------------------------------------------------- */
const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* Curly-quote plain text so body copy sets properly without hand-editing. */
const smart = (s = '') => String(s)
  .replace(/(^|[\s(\[])"/g, '$1“').replace(/"/g, '”')
  .replace(/(^|[\s(\[])'/g, '$1‘');

/* Google truncates meta descriptions around 155-160 characters. Rather than
   hand-tuning every string, append the boilerplate tail only when the result
   still fits, so the sentence that actually describes the page always
   survives intact. Never truncates mid-word. */
function metaDesc(base, tail = '', max = 158) {
  const full = tail ? `${base} ${tail}` : base;
  if (full.length <= max) return full;
  if (base.length <= max) return base;
  return base.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

/* Rewrite root-relative URLs onto BASE. Absolute URLs (https://…) never match
   these patterns, so canonicals, og:url and JSON-LD are left alone. */
function applyBase(s) {
  if (!BASE) return s;
  return s
    .replace(/\b(href|src|action)="\/(?!\/)/g, `$1="${BASE}/`)
    .replace(/\b(srcset|imagesrcset)="([^"]*)"/g,
      (_, attr, val) => `${attr}="${val.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASE}/`)}"`);
}

function write(rel, html) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const out = rel.endsWith('.html') ? applyBase(html) : html;
  fs.writeFileSync(file, out.replace(/\n{3,}/g, '\n\n'));
  written++;
}

const ARROW = '<svg width="15" height="10" viewBox="0 0 15 10" fill="none" aria-hidden="true"><path d="M10 1l4 4-4 4M14 5H0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/**
 * Build a <picture> with AVIF + WebP sources at every generated width.
 * `sizes` must describe the rendered CSS width so the browser can pick the
 * smallest file that still looks sharp.
 */
function picture(slug, { sizes, cls = '', lazy = true, altOverride = null } = {}) {
  const m = IMG[slug];
  if (!m) { warnings.push(`missing image: ${slug}`); return ''; }
  const widths = m.sizes.map(s => s.w);
  const srcset = ext => m.sizes.map(s => `/assets/img/${slug}-${s.w}.${ext} ${s.w}w`).join(', ');
  const fallback = m.sizes[Math.min(1, m.sizes.length - 1)];
  const alt = esc(altOverride ?? m.alt);
  const loading = lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high" decoding="async"';
  return `<picture${cls ? ` class="${cls}"` : ''}>
  <source type="image/avif" srcset="${srcset('avif')}" sizes="${sizes}">
  <source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}">
  <img src="/assets/img/${slug}-${fallback.w}.webp" srcset="${srcset('webp')}" sizes="${sizes}"
       width="${fallback.w}" height="${fallback.h}" alt="${alt}"${loading}>
</picture>`;
}

/* --- chrome -------------------------------------------------------------- */
function header(current) {
  const links = NAV.map(n => {
    const cur = n.href === current ? ' aria-current="page"' : '';
    return `<li><a href="${n.href}"${cur}>${n.label}</a></li>`;
  }).join('\n        ');

  const mobileLinks = [
    ...NAV.map(n => `<li><a href="${n.href}"${n.href === current ? ' aria-current="page"' : ''}>${n.label}</a></li>`),
    ...TOP.map(s => `<li><a href="${s.href}">${esc(s.title)}</a></li>`),
  ].join('\n            ');

  return `<header class="masthead">
  <div class="wrap masthead__inner">
    <a class="wordmark" href="/" aria-label="${esc(BIZ.legal)} — home">
      <img class="wordmark__logo"
           src="/assets/img/logo/onyx-mark-dark-360.png"
           srcset="/assets/img/logo/onyx-mark-dark-180.png 180w, /assets/img/logo/onyx-mark-dark-360.png 360w"
           sizes="88px" width="360" height="185" alt="" decoding="async">
    </a>
    <nav aria-label="Primary">
      <ul class="nav">
        ${links}
      </ul>
    </nav>
    <div class="masthead__cta">
      <a class="callout" href="${BIZ.phoneHref}">
        <span class="callout__label">Call</span>
        <span class="callout__num tel">${BIZ.phone}</span>
      </a>
      <a class="btn btn--solid" href="/get-your-free-estimate/">Free Estimate</a>
    </div>
    <details class="mobile-nav">
      <summary aria-label="Menu"><span></span><span></span><span></span></summary>
      <div class="mobile-nav__panel">
        <nav aria-label="Mobile">
          <ul>
            ${mobileLinks}
          </ul>
        </nav>
        <div class="mobile-nav__cta">
          <a class="btn btn--solid" href="/get-your-free-estimate/">Free Estimate</a>
          <a class="btn btn--ghost tel" href="${BIZ.phoneHref}">${BIZ.phone}</a>
        </div>
      </div>
    </details>
  </div>
</header>`;
}

function ctaBand() {
  return `<section class="section section--dark">
  <div class="wrap cta-close">
    <div>
      <p class="eyebrow eyebrow--ruled reveal">Request</p>
      <h2 class="h-section reveal">Ready to start? Schedule a free estimate.</h2>
      <p class="cta-close__call reveal">Or call <a class="tel" href="${BIZ.phoneHref}">${BIZ.phone}</a></p>
    </div>
    <a class="link-arrow reveal" href="/get-your-free-estimate/">Request an Estimate ${ARROW}</a>
  </div>
</section>`;
}

function footer() {
  const svc = TOP.map(s => `<li><a href="${s.href}">${esc(s.title)}</a></li>`).join('\n        ');
  // These city pages exist, so link them: better for visitors who are checking
  // coverage, and it gives the service-area pages internal links.
  const areaSlug = a => a.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-');
  const areas = AREAS.slice(0, 6)
    .map(a => `<li><a href="/service-areas/${areaSlug(a)}/">${a}</a></li>`).join('\n        ');

  const operating = [
    BIZ.hours,
    BIZ.license ? `License ${esc(BIZ.license)}` : '',
    'Free estimates',
    `<a href="/warranty/">${warrantySpan()}-year workmanship warranty</a>`,
  ].filter(Boolean).map(l => `<li>${l}</li>`).join('\n        ');

  return `<footer class="footer">
  <div class="wrap">
    <img class="footer__logo"
         src="/assets/img/logo/onyx-full-dark-720.png"
         srcset="/assets/img/logo/onyx-full-dark-360.png 360w, /assets/img/logo/onyx-full-dark-720.png 720w"
         sizes="200px" width="720" height="431"
         alt="${esc(BIZ.legal)}" loading="lazy" decoding="async">
    <div class="footer__cols">
      <div>
        <h2>Contact</h2>
        <address>
          <a class="tel" href="${BIZ.phoneHref}">${BIZ.phone}</a>
          <a href="mailto:${BIZ.email}">${BIZ.email}</a>
          <span>${BIZ.street ? esc(BIZ.street) + '<br>' : ''}${BIZ.city}</span>
          <a href="${BIZ.facebook}" rel="noopener">Facebook</a>
          <a href="${BIZ.googleReviewUrl}" rel="noopener">Leave a Google review</a>
        </address>
      </div>
      <div>
        <h2>Services</h2>
        <ul>
        ${svc}
        </ul>
      </div>
      <div>
        <h2>Service Area</h2>
        <ul>
        ${areas}
        <li><a href="/service-areas/">See all areas</a></li>
        </ul>
        ${operating ? `<h2 style="margin-top:1.75rem">Operating</h2>
        <ul style="color:var(--ink-mid);font-size:.925rem">
        ${operating}
        </ul>` : ''}
      </div>
    </div>
    <div class="footer__base">
      <span class="footer__brand">${BIZ.legal}</span>
      <p>&copy; ${new Date().getFullYear()} ${BIZ.legal.toUpperCase()} &middot; Family-operated in ${BIZ.city} since ${BIZ.since}</p>
    </div>
  </div>
</footer>`;
}

/* --- tracking ------------------------------------------------------------
   Search Console verification is safe in every build. Executable tracking is
   production-only so local and BASE_PATH previews do not pollute live data. */
function googleTagManagerHead() {
  if (!BIZ.googleTagManagerId || BASE) return '';
  return `<!-- Google Tag Manager -->
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(BIZ.googleTagManagerId)});
</script>
<!-- End Google Tag Manager -->`;
}

function googleTagManagerBody() {
  if (!BIZ.googleTagManagerId || BASE) return '';
  return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(BIZ.googleTagManagerId)}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
}

function trackingHead() {
  const verification = BIZ.gscVerification
    ? `\n<!-- Google Search Console site verification -->
<meta name="google-site-verification" content="${esc(BIZ.gscVerification)}">`
    : '';

  if (BASE) return verification;

  // One gtag.js loader can configure multiple Google destinations. Load GA4
  // first, then register both GA4 and Google Ads without downloading the same
  // library twice.
  const googleTagIds = [BIZ.ga4Id, BIZ.googleTagId].filter(Boolean);
  const googleTag = googleTagIds.length
    ? `\n<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleTagIds[0])}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${googleTagIds.map(id => `gtag('config', ${JSON.stringify(id)});`).join('\n')}
</script>
<!-- End Google tag (gtag.js) -->`
    : '';

  const clarity = BIZ.clarityId
    ? `\n<!-- Microsoft Clarity -->
<script type="text/javascript">
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(BIZ.clarityId)});
</script>
<!-- End Microsoft Clarity -->`
    : '';

  return verification + googleTag + clarity;
}

/* --- page shell ---------------------------------------------------------- */
function layout({
  title, desc, url, body, current, jsonld = [], heroImage = null,
  trail = null, script = '', robots = '', ogType = 'website', ogImage = '',
}) {
  const canonical = BIZ.origin + url;
  // BASE_PATH builds are staging previews, so they always stay noindex. The
  // optional page-level value lets unfinished sections (such as the sample
  // blog) carry the same protection even in a production-domain build.
  const robotsMeta = BASE
    ? '\n<meta name="robots" content="noindex, nofollow">'
    : robots
      ? '\n<meta name="robots" content="' + esc(robots) + '">'
      : '';
  const socialImage = ogImage || BIZ.origin + '/assets/img/hero-driveway-1200.webp';
  // Preload the hero so the LCP element starts downloading before the CSS has
  // parsed. imagesrcset/imagesizes must mirror the <picture> exactly, or the
  // browser treats the preload as a separate resource and fetches twice.
  const heroPreload = heroImage && IMG[heroImage]
    ? `\n<link rel="preload" as="image" type="image/avif" fetchpriority="high"`
      + ` imagesrcset="${IMG[heroImage].sizes.map(s => `/assets/img/${heroImage}-${s.w}.avif ${s.w}w`).join(', ')}"`
      + ` imagesizes="100vw">`
    : '';

  // BreadcrumbList mirrors the visible crumbs exactly — Google requires the
  // markup to match what the user can see, so both are driven off one array.
  const breadcrumb = trail && trail.length > 1 ? [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.label,
      // The final crumb is the current page, which carries no link in the
      // visible trail; schema.org wants it identified by the canonical URL.
      item: t.href ? BIZ.origin + t.href : canonical,
    })),
  }] : [];

  const graph = [...jsonld, ...breadcrumb];
  const ld = graph.length
    ? `\n<script type="application/ld+json">${JSON.stringify(graph.length === 1 ? graph[0] : graph)}</script>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
${googleTagManagerHead()}
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#14120f">${robotsMeta}${trackingHead()}

<meta property="og:type" content="${esc(ogType)}">
<meta property="og:site_name" content="${esc(BIZ.legal)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${esc(socialImage)}">
<meta name="twitter:card" content="summary_large_image">

<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/fraunces-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/dm-sans-latin.woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">${heroPreload}
<link rel="icon" href="/assets/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">${ld}
</head>
<body>
${googleTagManagerBody()}
<a class="skip" href="#main">Skip to content</a>
${header(current)}
<main id="main">
${body}
</main>
${footer()}${script ? `\n<script>${script}</script>` : ''}
</body>
</html>`;
}

/* --- shared sections ----------------------------------------------------- */
function crumbs(trail) {
  const items = trail.map((t, i) =>
    i === trail.length - 1
      ? `<li aria-current="page">${esc(t.label)}</li>`
      : `<li><a href="${t.href}">${esc(t.label)}</a></li>`
  ).join('\n    ');
  return `<div class="wrap"><ul class="crumbs">\n    ${items}\n  </ul></div>`;
}

function trustbar() {
  const items = [
    `Family-operated since <strong>${BIZ.since}</strong>`,
    `<strong>${BIZ.reviewCount}</strong> five-star reviews on ${BIZ.ratingSource}`,
    `<strong>Free</strong> written estimates`,
    `Open <strong>7 days</strong> a week`,
    BIZ.license ? `Licensed <strong>&amp; insured</strong>` : '',
    `<a href="/warranty/"><strong>${warrantySpan()}-year</strong> warranty</a>`,
  ].filter(Boolean);
  return `<div class="trustbar">
  <div class="wrap">
    <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
  </div>
</div>`;
}

/* Services split into a two-level tree. A service with `parent` set is a
   material-specific page beneath a hub — /masonry/asphalt-driveways/ under
   /masonry/driveway-paving/. Only the hubs go in the nav, the footer, and the
   home grid; the children are surfaced from their parent's page, from the
   services index, and from search. Keeping them out of the top-level lists is
   what stops fourteen services reading as a directory. */
const TOP = SERVICES.filter(s => !s.parent);
const childrenOf = href => SERVICES.filter(s => s.parent === href);
const parentOf = s => (s.parent ? SERVICES.find(x => x.href === s.parent) : null);

function serviceGrid(reveal = true) {
  return TOP.map(s => `<a class="card${reveal ? ' reveal' : ''}" href="${s.href}">
  <div class="card__media">${mediaFor(s.image, { sizes: '(max-width:620px) 92vw, (max-width:900px) 45vw, 30vw' })}</div>
  <h3>${esc(s.title)}</h3>
  <p>${esc(smart(s.card))}</p>
  <span class="card__more">Learn more</span>
</a>`).join('\n');
}

function reviewCard(r) {
  const meta = [r.project, r.date, r.source ? `via ${r.source}` : ''].filter(Boolean).join(' · ');
  return `<div class="quote-card reveal">
  <p class="stars" aria-label="5 out of 5 stars">★★★★★</p>
  <blockquote><p>${esc(smart(r.text))}</p></blockquote>
  <cite>${esc(r.name)}${meta ? ` <span>— ${esc(meta)}</span>` : ''}</cite>
</div>`;
}

/* Invitation to leave a Google review. Deliberately unconditional — it goes to
   the public profile, so it asks everyone rather than screening for happy
   customers, which review-gating rules prohibit. */
function leaveReview() {
  return `<section class="section section--tight">
  <div class="wrap">
    <div class="review-cta reveal">
      <div>
        <p class="eyebrow">Worked with us?</p>
        <h2 class="h-sub">Leave us a review on Google.</h2>
        <p class="lede" style="margin-top:.9rem">Reviews are how most of our customers find us, and we read every one. It takes about a minute.</p>
      </div>
      <div class="review-cta__actions">
        <a class="btn btn--solid" href="${BIZ.googleReviewUrl}" rel="noopener">Write a Google Review</a>
        <a class="link-arrow" href="${BIZ.googleProfileUrl}" rel="noopener">Read our reviews on Google ${ARROW}</a>
      </div>
    </div>
  </div>
</section>`;
}

function processSection(steps, title) {
  if (!steps || !steps.length) return '';
  return `<section class="section section--sunk">
  <div class="wrap">
    <div class="section__head">
      <p class="eyebrow">How the work runs</p>
      <h2 class="h-section reveal">${esc(title)}, step by step</h2>
      <p class="lede reveal">Every job follows the same sequence. You are told which stage you are at and what happens next.</p>
    </div>
    <ol class="process">
${steps.map(([h, d], i) => `      <li class="reveal"><span class="process__n" aria-hidden="true">${i + 1}</span><div><h3>${esc(h)}</h3><p>${esc(smart(d))}</p></div></li>`).join('\n')}
    </ol>
  </div>
</section>`;
}

function serviceReview(name) {
  const r = REVIEWS.find(x => x.name === name && !x.hide);
  if (!r) {
    warnings.push(`reviewFrom "${name}" matches no review in REVIEWS — quote omitted.`);
    return '';
  }
  const meta = [r.project, r.where, r.date].filter(Boolean).join(' · ');
  return `<section class="section section--tight">
  <div class="wrap">
    <figure class="pullquote reveal">
      <p class="stars" aria-label="Five out of five stars">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
      <blockquote><p>${esc(smart(r.text))}</p></blockquote>
      <figcaption>${esc(r.name)}${meta ? ` <span>${esc(meta)}</span>` : ''}${r.source ? ` <span>via ${esc(r.source)}</span>` : ''}</figcaption>
    </figure>
    <p style="text-align:center;margin-top:1.25rem"><a href="/reviews/">Read all ${esc(BIZ.reviewCount)} reviews</a></p>
  </div>
</section>`;
}

/* "3 to 5" across the advertised terms, so the trust bar and the services
   index stay correct if a term in content.mjs changes. */
function warrantySpan() {
  const y = WARRANTY.terms.map(t => t.years);
  const lo = Math.min(...y), hi = Math.max(...y);
  return lo === hi ? `${lo}` : `${lo}\u2013${hi}`;
}

function warrantyTerms(keys) {
  return (keys || []).map(k => {
    const t = WARRANTY.terms.find(x => x.key === k);
    if (!t) warnings.push(`warranty key "${k}" matches nothing in WARRANTY.terms.`);
    return t;
  }).filter(Boolean);
}

/* Sits directly under the page head on a service page, above the fold on most
   screens. Where a service spans materials with different terms (a driveway
   can be asphalt at 3 years or pavers at 5) every applicable term is shown
   rather than the longest one. */
function warrantyBand(keys) {
  const terms = warrantyTerms(keys);
  if (!terms.length) return '';
  const span = [...new Set(terms.map(t => t.years))];
  const head = span.length === 1
    ? `${span[0]}-year workmanship warranty`
    : `${Math.min(...span)} to ${Math.max(...span)}-year workmanship warranty`;
  return `<div class="wband">
  <div class="wrap wband__inner">
    <div class="wband__lead">
      <p class="wband__head">${esc(head)}</p>
      <p class="wband__sub">In writing, on every job we install.</p>
    </div>
    <ul class="wband__list">
      ${terms.map(t => `<li><strong>${t.years} years</strong> <span>${esc(t.label)}</span></li>`).join('\n      ')}
    </ul>
    <a class="wband__link" href="/warranty/">What the warranty covers &rarr;</a>
  </div>
</div>`;
}

function faqSection(items) {
  const rows = items.map(f => `<details>
  <summary>${esc(f.q)}</summary>
  <div>${f.a.map(p => `<p>${esc(smart(p))}</p>`).join('')}</div>
</details>`).join('\n');
  return `<section class="section">
  <div class="wrap">
    <div class="section__head">
      <p class="eyebrow">Questions</p>
      <h2 class="h-section">Frequently asked</h2>
    </div>
    <div class="faq">
${rows}
    </div>
  </div>
</section>`;
}

/* The map is inlined rather than <img>-linked so it inherits the site palette.
   That means each copy carries the same element ids, so they get suffixed per
   instance — two copies on one page would otherwise produce duplicate ids and
   break the aria-labelledby wiring. */
function areaMap(instance, extraClass = '') {
  const svg = AREA_MAP
    .replace(/areamap-t/g, `areamap-t-${instance}`)
    .replace(/areamap-d/g, `areamap-d-${instance}`);
  return extraClass
    ? svg.replace('class="areamap"', `class="areamap ${extraClass}"`)
    : svg;
}

function areasSection() {
  return `<section class="section section--tight areaband-section">
  <div class="wrap areaband">
    <div class="areaband__map">${areaMap('band', 'areamap--quiet')}</div>
    <div>
      <p class="eyebrow">Service area</p>
      <p class="areaband__lede">Estimates are free everywhere on this list. If you are just outside it, call and ask &mdash; we often can.</p>
      <ul class="chips">
        ${AREAS.map(a => `<li><a href="/service-areas/${areaSlugOf(a)}/">${esc(a)}</a></li>`).join('\n        ')}
      </ul>
      <p style="margin-top:1.5rem"><a class="link-arrow" href="/service-areas/">See all service areas ${ARROW}</a></p>
    </div>
  </div>
</section>`;
}


/* --- projects ------------------------------------------------------------ */
const areaSlugOf = a => a.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-');
const projectUrl = p => p.service + p.slug + '/';
/* Projects shown on a service page. A project lives at exactly one URL —
   {service}{slug}/ — but it can be *listed* under more than one service:
   `also` adds the extra hrefs, and a hub page picks up everything filed
   under its children. No page is duplicated, only cross-linked. */
function projectsFor(href) {
  const scope = new Set([href, ...childrenOf(href).map(c => c.href)]);
  return PROJECTS.filter(p => scope.has(p.service) || (p.also || []).some(a => scope.has(a)));
}
const projectsIn = city => PROJECTS.filter(p => p.city === city);

/* A project photo. These are plain JPEGs rather than the AVIF/WebP set the
   rest of the site uses — they came from the Google Business Profile after
   the image pipeline had already run, and there is no encoder on hand to
   regenerate them. Two widths, so the srcset still does its job. */
function projectPicture(p, { sizes, lazy = true } = {}) {
  const base = '/assets/img/projects/' + p.slug;
  return `<img src="${base}-1200.jpg"
       srcset="${base}-760.jpg 760w, ${base}-1200.jpg 1200w" sizes="${sizes}"
       width="${p.w}" height="${p.h}" alt="${esc(p.alt)}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high" decoding="async"'}>`;
}

/* A service's card and feature image. Normally a slug from the image
   manifest, but it falls back to a project photo of the same name — some
   services only have a photograph because a job produced one, and there is no
   sense duplicating that file into the manifest set just to reference it. */
function mediaFor(slug, opts = {}) {
  if (IMG[slug]) return picture(slug, opts);
  const p = PROJECTS.find(x => x.slug === slug);
  if (p) return projectPicture(p, opts);
  warnings.push(`image "${slug}" matches neither the image manifest nor a project`);
  return '';
}

/* A photograph is captioned with the job and, where we know it, the city.
   `city` is optional: a job we have the photograph for but not the location is
   still real work, and stating a city we are not sure of would be worse than
   omitting it. Everything city-dependent below degrades to nothing. */
const caption = p => esc(p.title) + (p.city ? ' \u2014 ' + esc(p.city) : '');

/* The "before" shot, where one exists. Same JPEG pair convention as the
   finished photo, with `-before` on the slug. */
function beforePicture(p, { sizes } = {}) {
  const base = '/assets/img/projects/' + p.slug + '-before';
  return `<img src="${base}-1200.jpg"
       srcset="${base}-760.jpg 760w, ${base}-1200.jpg 1200w" sizes="${sizes}"
       width="${p.before.w}" height="${p.before.h}" alt="${esc(p.before.alt)}"
       loading="lazy" decoding="async">`;
}

/* Before and after side by side, or just the finished job when no before
   photograph exists. Both are labelled, because an unlabelled pair is an
   invitation to read them in the wrong order. */
function projectFigures(p) {
  if (!p.before) {
    return `<figure class="pfigure">
      ${projectPicture(p, { sizes: '(min-width:1100px) 1000px, 94vw', lazy: false })}
      <figcaption>${caption(p)}</figcaption>
    </figure>`;
  }
  return `<div class="ba">
      <figure class="pfigure ba__half">
        <p class="ba__tag">Before</p>
        ${beforePicture(p, { sizes: '(min-width:1100px) 490px, 94vw' })}
        <figcaption>${esc(p.before.alt)}</figcaption>
      </figure>
      <figure class="pfigure ba__half">
        <p class="ba__tag ba__tag--after">After</p>
        ${projectPicture(p, { sizes: '(min-width:1100px) 490px, 94vw', lazy: false })}
        <figcaption>${caption(p)}</figcaption>
      </figure>
    </div>`;
}

/* Card grid of projects. `heading` is omitted when the caller supplies its
   own section header. */
function projectGrid(list, { heading = null, intro = null, showService = false, eyebrow = 'Recent work' } = {}) {
  if (!list.length) return '';
  // Built on the site's own .card / .card__media primitives so the tiles
  // inherit the hairline outline, radius, and image-scale hover that every
  // other card on the site uses. .pcard only adjusts the type scale down.
  const cards = list.map(p => {
    const svc = SERVICES.find(s => s.href === p.service);
    return `<a class="card pcard reveal" href="${projectUrl(p)}">
    <div class="card__media">${projectPicture(p, { sizes: '(min-width:1000px) 22vw, (min-width:760px) 30vw, (min-width:460px) 45vw, 92vw' })}</div>
    <p class="pcard__meta">${[showService && svc ? esc(svc.title) : '', p.city ? esc(p.city) : ''].filter(Boolean).join(' &middot; ')}</p>
    <h3>${esc(p.title)}</h3>
    <p class="pcard__mat">${esc(p.material)}</p>
  </a>`;
  }).join('\n  ');

  return `<section class="section">
  <div class="wrap">
    ${heading ? `${eyebrow ? `<p class="eyebrow eyebrow--ruled reveal">${esc(eyebrow)}</p>` : ''}
    <h2 class="h-section reveal">${heading}</h2>` : ''}
    ${intro ? `<p class="lede reveal">${intro}</p>` : ''}
    <div class="pgrid">
  ${cards}
    </div>
  </div>
</section>`;
}

/* Projects shown on a city page. If we have built in that city, show those.
   Otherwise show recent work from elsewhere, labelled as such — a city page
   must never imply a job happened somewhere it did not. */
function areaProjects(area, city) {
  const local = projectsIn(area);
  if (local.length) {
    return projectGrid(local, {
      heading: `Our work in ${city}`,
      intro: `Completed ${local.length === 1 ? 'project' : 'projects'} in ${city}. Every photograph is a job we built.`,
      showService: true,
    });
  }
  return projectGrid(PROJECTS.slice(0, 3), {
    heading: 'Recent work nearby',
    intro: `We have not photographed a ${city} job for the site yet. These are recent projects from elsewhere in the service area &mdash; the same crews and the same standard apply here.`,
    showService: true,
  });
}

/* --- structured data ----------------------------------------------------- */
const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': BIZ.origin + '/#business',
  name: BIZ.legal,
  url: BIZ.origin,
  telephone: BIZ.phone,
  email: BIZ.email,
  foundingDate: BIZ.since,
  description: 'Family-operated masonry and stonework contractor serving Northern Virginia and Washington DC since 2010. Driveways, patios, walkways, retaining walls, stone veneer, chimney and foundation repair.',
  image: BIZ.origin + '/assets/img/hero-driveway-1200.webp',
  address: {
    '@type': 'PostalAddress',
    ...(BIZ.street ? { streetAddress: BIZ.street } : {}),
    // A locality, per schema.org — this is the business address, not the
    // service area. The visible copy says "Northern Virginia"; this field
    // has to name an actual city or Google discards the address.
    addressLocality: 'Fairfax',
    addressRegion: 'VA',
    addressCountry: 'US',
  },
  areaServed: AREAS.map(a => ({ '@type': 'Place', name: a })),
  sameAs: [BIZ.facebook, BIZ.googleProfileUrl, BIZ.ratingUrl].filter(Boolean),
  // schema.org wants the machine format, not the string we show on the page.
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '18:00',
  }],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Masonry and stonework services',
    itemListElement: SERVICES.map(s => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, url: BIZ.origin + s.href },
    })),
  },
};

/* ==========================================================================
   Pages
   ========================================================================== */

/* --- Home ---------------------------------------------------------------- */
function buildHome() {
  const lead = REVIEWS.find(r => r.name === FEATURED_REVIEWS[0]);
  const support = FEATURED_REVIEWS.slice(1).map(n => REVIEWS.find(r => r.name === n)).filter(Boolean);

  const mosaic = HOME_PORTFOLIO.map(slug => {
    const m = IMG[slug];
    if (!m) return '';
    return `<figure class="reveal">${picture(slug, { sizes: '(max-width:560px) 92vw, (max-width:900px) 45vw, 30vw' })}
  <figcaption>${esc(m.alt)}</figcaption>
</figure>`;
  }).join('\n');

  const body = `<section class="hero">
  <div class="hero__media">${picture('hero-driveway', {
    sizes: '100vw', lazy: false,
    altOverride: 'Circular paver driveway with a stone medallion in front of a stone-faced Northern Virginia home',
  })}</div>
  <div class="wrap hero__inner">
    <p class="eyebrow">Family-operated in Northern Virginia since ${BIZ.since}</p>
    <h1 class="h-display" style="max-width:16ch">Northern Virginia&rsquo;s Driveway, Hardscape &amp; Masonry Specialists</h1>
    <p class="hero__lede">Paver, asphalt, and concrete driveways, patios, walkways, retaining walls, and stonework throughout Northern Virginia and Washington DC. Free written estimates, and the owners are on site for every job (<a href="/about-us/">read our story</a>).</p>
    <div class="hero__actions">
      <a class="btn btn--solid" href="/get-your-free-estimate/">Request an Estimate</a>
      <a class="btn btn--on-photo tel" href="${BIZ.phoneHref}">${BIZ.phone}</a>
    </div>
  </div>
</section>

${trustbar()}

<section class="section">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-section reveal">What we do</h2>
      <p class="lede reveal">Masonry and stonework for homes across Northern Virginia — from a single set of front steps to a full driveway replacement.</p>
    </div>
    <div class="grid grid--3">
${serviceGrid()}
    </div>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap split">
    <div>
      <p class="eyebrow reveal">Why Onyx</p>
      <h2 class="h-section reveal">Great craftsmanship starts with listening.</h2>
      <p class="lede reveal" style="margin-top:1.25rem">We take the time to understand your vision, your needs, and your home&rsquo;s character before we ever lift a stone. Our roots are local, and so is our pride in every project we take on.</p>
      <ul class="points">
        ${POINTS.map(([t, d]) => `<li class="reveal"><strong>${esc(t)}</strong><span>${esc(smart(d))}</span></li>`).join('\n        ')}
      </ul>
    </div>
    <div class="split__media reveal">
      ${picture('walkway-bluestone', { sizes: '(max-width:820px) 92vw, 45vw' })}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-section reveal">Recent work</h2>
    </div>
    <div class="mosaic">
${mosaic}
    </div>
    <p style="margin-top:2.5rem;text-align:center">
      <a class="link-arrow" href="/portfolio/">See the rest of the portfolio ${ARROW}</a>
    </p>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-section reveal">What customers say</h2>
      <p class="lede reveal"><strong>${BIZ.reviewCount} five-star reviews</strong> on ${BIZ.ratingSource}.</p>
    </div>
    <div class="quote-feature">
      <div class="quote-lead reveal">
        <blockquote><p>&ldquo;${esc(smart(lead.text.split('.').slice(0, 1).join('.') + '.'))}&rdquo;</p></blockquote>
        <cite>${esc(lead.name)}<span>${esc([lead.project, lead.source ? `via ${lead.source}` : ''].filter(Boolean).join(' · '))}</span></cite>
      </div>
      ${lead.image && IMG[lead.image] ? `<figure class="quote-feature__media reveal">
        ${picture(lead.image, { sizes: '(max-width:820px) 92vw, 45vw' })}
        <figcaption>${esc(IMG[lead.image].alt)}</figcaption>
      </figure>` : ''}
    </div>
    <div class="quote-grid">
${support.map(reviewCard).join('\n')}
    </div>
    <p style="margin-top:2.5rem;text-align:center">
      <a class="link-arrow" href="/reviews/">Read more of what people say ${ARROW}</a>
    </p>
  </div>
</section>

${areasSection()}

${faqSection(FAQ)}

${ctaBand()}`;

  write('index.html', layout({
    title: `Masonry Contractor in Northern Virginia | ${BIZ.legal}`,
    desc: metaDesc(
      `Family-operated masonry and stonework contractor in Northern Virginia since ${BIZ.since}.`
      + ` Driveways, patios, retaining walls, stone veneer, chimney and foundation repair.`,
      'Free estimates.'),
    url: '/',
    current: '/',
    heroImage: 'hero-driveway',
    body,
    jsonld: [
      LOCAL_BUSINESS,
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') },
        })),
      },
    ],
  }));
}

/* --- Service pages ------------------------------------------------------- */
function buildService(s) {
  const sections = s.sections.map(sec => {
    const paras = sec.p.map(p => `<p>${esc(smart(p))}</p>`).join('\n      ');
    const list = sec.list
      ? `\n      <div class="grid grid--2" style="margin-top:2rem">
        ${sec.list.map(([t, d]) => `<div><h3 style="font-size:1.05rem;margin-bottom:.5rem">${esc(t)}</h3><p style="color:var(--ink-mid);font-size:.925rem">${esc(smart(d))}</p></div>`).join('\n        ')}
      </div>`
      : '';
    return `<section class="section section--tight">
  <div class="wrap">
    <h2 class="h-sub reveal" style="max-width:24ch">${esc(sec.h)}</h2>
    <div class="prose reveal" style="margin-top:1.25rem">
      ${paras}
    </div>${list}
  </div>
</section>`;
  }).join('\n');

  const gallery = s.gallery.filter(g => IMG[g]);
  const gallerySection = gallery.length > 1 ? `<section class="section section--sunk">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-section reveal">${esc(s.title)} photographs</h2>
    </div>
    <div class="grid grid--3">
      ${gallery.map(g => `<figure class="reveal" style="margin:0">${picture(g, { sizes: '(max-width:620px) 92vw, (max-width:900px) 45vw, 30vw', cls: 'card__media' })}
      <figcaption style="margin-top:.6rem;font-size:.8rem;color:var(--ink-dim)">${esc(IMG[g].alt)}</figcaption></figure>`).join('\n      ')}
    </div>
  </div>
</section>` : '';

  const kids = childrenOf(s.href);
  const parent = parentOf(s);

  /* "Also from Onyx" leads with the pages closest to this one — the material
     pages under a hub, or the siblings under the same hub — then falls back
     to the rest of the top-level list. Three cards, never a duplicate. */
  const near = parent ? [parent, ...childrenOf(parent.href)] : kids;
  const others = [...near, ...TOP]
    .filter(o => o.slug !== s.slug)
    .filter((o, i, a) => a.findIndex(x => x.slug === o.slug) === i)
    .slice(0, 3);

  /* The material pages beneath a hub, shown high on the hub's own page. Two
     or more get the card grid; a lone child gets the same one-line link row
     the child pages carry, because a single card in a three-column grid reads
     as a layout that lost two cards. */
  const childSection = kids.length > 1 ? `<section class="section section--tight">
  <div class="wrap">
    <p class="eyebrow eyebrow--ruled reveal">Choose your material</p>
    <h2 class="h-section reveal">${esc(s.title)} by material</h2>
    <p class="lede reveal">Each one has its own page — what it costs, how it fails, and when it is genuinely the right answer.</p>
    <div class="grid grid--3" style="margin-top:1.75rem">
      ${kids.map(c => `<a class="card reveal" href="${c.href}">
        <div class="card__media">${mediaFor(c.image, { sizes: '(max-width:620px) 92vw, (max-width:900px) 45vw, 30vw' })}</div>
        <h3>${esc(c.title)}</h3>
        <p>${esc(smart(c.card))}</p>
        <span class="card__more">Learn more</span>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>` : '';

  /* A child page says where it sits, so a visitor who landed from search on
     "paver driveways" can still find the other two materials. */
  const siblings = childrenOf(parent ? parent.href : '').filter(c => c.slug !== s.slug);
  const relatedRow = links => `<div class="wrap">
  <p class="svc-parent reveal"><span>${links.label}</span>
    ${links.items.map(c => `<a href="${c.href}">${esc(c.title)}</a>`).join('')}</p>
</div>`;

  const parentNote = parent
    ? relatedRow({
        label: `Also under ${esc(parent.title)}:`,
        items: [...siblings, { href: parent.href, title: `${parent.title} overview` }],
      })
    : kids.length === 1
      ? relatedRow({ label: 'Go deeper:', items: kids })
      : '';

  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/' },
    ...(parent ? [{ label: parent.title, href: parent.href }] : []),
    { label: s.title },
  ];
  const body = `${crumbs(trail)}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">${esc(s.group)}</p>
    <h1 class="h-display" style="max-width:18ch">${esc(s.h1)}</h1>
    <p class="lede">${esc(smart(s.intro))}</p>
    <div class="hero__actions" style="margin-top:2rem">
      <a class="btn btn--solid" href="/get-your-free-estimate/">Get a Free Estimate</a>
      <a class="btn btn--ghost tel" href="${BIZ.phoneHref}">${BIZ.phone}</a>
    </div>
  </div>
</section>

${warrantyBand(s.warranty)}

<div class="wrap" style="margin-bottom:var(--section-y)">
  ${mediaFor(s.feature, { sizes: '(max-width:1180px) 92vw, 1120px' })}
</div>

${parentNote}

${childSection}

${sections}

${processSection(s.process, s.title)}

${projectGrid(projectsFor(s.href), {
  heading: `${esc(s.title)} projects`,
  intro: `Recent ${esc(s.title.toLowerCase())} jobs, each with its own page. Photographs are our own work.`,
})}

${gallerySection}

${s.reviewFrom ? serviceReview(s.reviewFrom) : ''}

${s.faq && s.faq.length ? faqSection(s.faq) : ''}

<section class="section section--tight">
  <div class="wrap">
    <p class="eyebrow">Also from Onyx</p>
    <div class="grid grid--3" style="margin-top:1.5rem">
      ${others.map(o => `<a class="card reveal" href="${o.href}">
        <div class="card__media">${mediaFor(o.image, { sizes: '(max-width:620px) 92vw, 30vw' })}</div>
        <h3>${esc(o.title)}</h3>
        <p>${esc(smart(o.card))}</p>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

${areasSection()}

${ctaBand()}`;

  write(s.href.replace(/^\//, '') + 'index.html', layout({
    title: `${s.title} in Northern Virginia | ${BIZ.legal}`,
    desc: metaDesc(smart(s.card), `Free estimates across Northern Virginia and DC. Call ${BIZ.phone}.`),
    url: s.href,
    current: '/services/',
    trail,
    body,
    jsonld: [{
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.title,
      serviceType: s.title,
      url: BIZ.origin + s.href,
      description: s.card,
      provider: { '@id': BIZ.origin + '/#business' },
      areaServed: AREAS.map(a => ({ '@type': 'Place', name: a })),
    },
    ...(s.faq && s.faq.length ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: s.faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') },
      })),
    }] : []),
    ],
  }));
}

/* --- Services index ------------------------------------------------------ */
function buildServicesIndex() {
  const groups = [...new Set(TOP.map(s => s.group))];

  /* A hub marked `splitOnIndex` hands its slot here to its children: the three
     driveway materials are three different searches with three different
     intents, so the index sells them as three services rather than as one card
     with footnotes. The hub page itself is unchanged and still linked from the
     footer, from each of its children, and from every project filed under it.
     Hubs without the flag keep their card and list their children as chips —
     Patio Installation & Design is far more than its stamped concrete page, so
     promoting that child over the parent would misrepresent the service. */
  const indexCards = TOP.flatMap(s => (s.splitOnIndex ? childrenOf(s.href) : [s]));
  const trail = [{ label: 'Home', href: '/' }, { label: 'Services' }];
  const body = `${crumbs(trail)}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">What we do</p>
    <h1 class="h-display">Masonry and stonework, done properly.</h1>
    <p class="lede">Every job starts underneath — excavation, a compacted base, and a plan for where water goes. What sits on top is the part you see, but the part below it decides how long you get to enjoy it.</p>
  </div>
</section>

${warrantyBand(WARRANTY.terms.map(t => t.key))}

${groups.map(g => `<section class="section section--tight">
  <div class="wrap">
    <h2 class="eyebrow">${esc(g)}</h2>
    <div class="grid grid--3" style="margin-top:1.5rem">
${indexCards.filter(s => s.group === g).map(s => {
  const kids = childrenOf(s.href);
  return `<div class="svc-cell reveal">
  <a class="card" href="${s.href}">
    <div class="card__media">${mediaFor(s.image, { sizes: '(max-width:620px) 92vw, (max-width:900px) 45vw, 30vw' })}</div>
    <h3>${esc(s.title)}</h3>
    <p>${esc(smart(s.card))}</p>
    <span class="card__more">Learn more</span>
  </a>${kids.length ? `
  <ul class="chips svc-cell__kids">
    ${kids.map(c => `<li><a href="${c.href}">${esc(c.title)}</a></li>`).join('\n    ')}
  </ul>` : ''}
</div>`;
}).join('\n')}
    </div>
  </div>
</section>`).join('\n')}

${areasSection()}
${faqSection(FAQ)}
${ctaBand()}`;

  write('services/index.html', layout({
    title: `Masonry & Stonework Services in Northern Virginia | ${BIZ.legal}`,
    desc: 'Asphalt, concrete, and paver driveways, patios, walkways and steps, retaining walls, brickwork, drainage, chimney and foundation repair across Northern Virginia and DC.',
    url: '/services/',
    current: '/services/',
    trail,
    body,
  }));
}

/* --- About --------------------------------------------------------------- */
function buildAbout() {
  const trail = [{ label: 'Home', href: '/' }, { label: 'About' }];
  const body = `${crumbs(trail)}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Since ${BIZ.since}</p>
    <h1 class="h-display" style="max-width:20ch">Great craftsmanship starts with listening.</h1>
    <p class="lede">We take the time to understand your vision, your needs, and your home&rsquo;s character before we ever lift a stone. With years of hands-on experience, we know what it takes to create masonry and stonework that is both beautiful and built to last.</p>
  </div>
</section>

<div class="wrap" style="margin-bottom:var(--section-y)">
  ${picture('walkway-crew', { sizes: '(max-width:1180px) 92vw, 1120px' })}
</div>

<section class="section section--tight">
  <div class="wrap split">
    <div>
      <h2 class="h-sub reveal">A family business, working where we live</h2>
      <div class="prose reveal" style="margin-top:1.25rem">
        <p>Onyx has been serving homeowners across Northern Virginia since ${BIZ.since}. We are family-operated — two brothers and a crew — which means the people who quote your job are the same people on site while it is being built. There is no sales layer between you and the work.</p>
        <p>Our roots are local, and so is our pride in every project we take on. Most of our work comes through word of mouth and repeat customers, which is a standard that keeps us honest: we would rather keep a customer for a decade than win one job.</p>
      </div>
    </div>
    <div class="split__media reveal">${picture('steps-stone', { sizes: '(max-width:820px) 92vw, 45vw' })}</div>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap split split--reverse">
    <div>
      <h2 class="h-sub reveal">Honesty, quality, and genuine care</h2>
      <div class="prose reveal" style="margin-top:1.25rem">
        <p>We believe that honesty, quality, and genuine customer care are the foundation of every successful project. From the first consultation to the final walk-through, we are committed to clear communication, dependable service, and results we can both be proud of.</p>
        <p>Our values guide us, ensuring that every detail reflects our pride in our work and the trust you place in us. Consistency, craftsmanship, and accountability are what define every job we complete.</p>
      </div>
    </div>
    <div class="split__media reveal">${picture('wall-curved', { sizes: '(max-width:820px) 92vw, 45vw' })}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-section reveal">How we work</h2>
      <p class="lede reveal">We have developed a detailed, hands-on approach that produces the same result on a small repair as on a full rebuild.</p>
    </div>
    <ul class="points" style="grid-template-columns:repeat(2,1fr);display:grid;gap:2rem">
      ${POINTS.map(([t, d]) => `<li class="reveal"><strong>${esc(t)}</strong><span>${esc(smart(d))}</span></li>`).join('\n      ')}
      <li class="reveal"><strong>Premium materials, proven technique</strong><span>We use materials that suit the Northern Virginia climate and methods that have earned their place. Beauty never comes at the expense of long-term performance.</span></li>
      <li class="reveal"><strong>Clean sites and kept timelines</strong><span>We prioritize job site cleanliness and realistic scheduling, so a project in progress does not take over your property.</span></li>
    </ul>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-section reveal">Building stronger homes across Northern Virginia</h2>
    </div>
    <div class="prose reveal">
      <p>We do not just build walls, patios, and fireplaces — we build spaces that stand up to time and weather. Using premium materials and proven techniques, we make sure your stonework is not only beautiful the week it is finished, but years afterward.</p>
      <p>We collaborate closely with clients throughout the process so that every detail lines up with what they pictured. And we keep the site clean and the schedule realistic, which turns out to be the part people remember most.</p>
    </div>
    <p style="margin-top:2.5rem"><a class="link-arrow" href="/reviews/">Read what our customers say ${ARROW}</a></p>
  </div>
</section>

${areasSection()}
${ctaBand()}`;

  write('about-us/index.html', layout({
    title: `About Onyx Home Improvement | Masonry in Northern Virginia`,
    desc: `Onyx Home Improvement is a family-operated masonry and stonework contractor serving Northern Virginia since ${BIZ.since}. Meet the team and how we work.`,
    url: '/about-us/',
    current: '/about-us/',
    trail,
    body,
  }));
}

/* --- Portfolio ----------------------------------------------------------- */
/* --- Projects index ------------------------------------------------------
   Every completed job on one page, grouped by the service it sits under. The
   photo gallery stays at /portfolio/ and is linked from here — this page is
   the one with the individual project pages behind it, so it is the one in
   the nav. */
function buildProjects() {
  const trail = [{ label: 'Home', href: '/' }, { label: 'Projects' }];

  const body = `${crumbs(trail)}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Recent work</p>
    <h1 class="h-display" style="max-width:16ch">Projects we have built.</h1>
    <p class="lede">Completed jobs across Northern Virginia and Washington DC, each with its own page &mdash; what was built, what it was built from, where it is, and what the work actually involved. Every photograph is our own.</p>
    <div class="hero__actions" style="margin-top:2rem">
      <a class="btn btn--solid" href="/get-your-free-estimate/">Get a Free Estimate</a>
      <a class="btn btn--ghost" href="/portfolio/">Browse the photo gallery</a>
    </div>
  </div>
</section>

${projectGrid(PROJECTS, { showService: true })}

<section class="section section--sunk">
  <div class="wrap">
    <div class="section__head">
      <p class="eyebrow">Photographs</p>
      <h2 class="h-section reveal">More of our work</h2>
      <p class="lede reveal">Not every job has a write-up. The gallery has the rest of the photographs &mdash; driveways, walkways, patios, steps, and stone walls.</p>
    </div>
    <p><a class="link-arrow" href="/portfolio/">See the full photo gallery ${ARROW}</a></p>
  </div>
</section>

${areasSection()}

${ctaBand()}`;

  write('projects/index.html', layout({
    title: `Recent Projects | Masonry & Hardscape in Northern Virginia | ${BIZ.legal}`,
    desc: metaDesc(
      `Completed driveway, patio, walkway, step, and retaining wall projects by ${BIZ.legal} across Northern Virginia and DC.`,
      'Materials, locations, and photographs of the finished work.'),
    url: '/projects/',
    current: '/projects/',
    trail,
    body,
    jsonld: [{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Projects',
      url: BIZ.origin + '/projects/',
      about: { '@id': BIZ.origin + '/#business' },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: PROJECTS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: BIZ.origin + projectUrl(p),
          name: p.city ? `${p.title} — ${p.city}` : p.title,
        })),
      },
    }],
  }));
}

function buildPortfolio() {
  const items = PORTFOLIO.filter(s => IMG[s]).map(slug => `<figure class="reveal">${picture(slug, { sizes: '(max-width:560px) 92vw, (max-width:900px) 45vw, 30vw' })}
  <figcaption>${esc(IMG[slug].alt)}</figcaption>
</figure>`).join('\n');

  const trail = [{ label: 'Home', href: '/' }, { label: 'Portfolio' }];
  const body = `${crumbs(trail)}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Photo gallery</p>
    <h1 class="h-display">Portfolio</h1>
    <p class="lede">Driveways, walkways, patios, steps, and stone walls built across Northern Virginia and Washington DC. Every photograph here is our own work.</p>
    <div class="hero__actions" style="margin-top:2rem">
      <a class="btn btn--solid" href="/projects/">See individual projects</a>
      <a class="btn btn--ghost" href="/get-your-free-estimate/">Get a Free Estimate</a>
    </div>
  </div>
</section>

${projectGrid(PROJECTS.slice(0, 8), { heading: 'Projects with their own page', intro: 'Individual jobs written up in full &mdash; what was built, what it was built from, and where. <a href="/projects/">See all projects</a>.', showService: true })}

<section class="section section--tight">
  <div class="wrap">
    <div class="mosaic">
${items}
    </div>
  </div>
</section>

${ctaBand()}`;

  write('portfolio/index.html', layout({
    title: `Portfolio | Masonry & Stonework in Northern Virginia | ${BIZ.legal}`,
    desc: 'Photographs of completed driveway, walkway, patio, step, and retaining wall projects by Onyx Home Improvement across Northern Virginia.',
    url: '/portfolio/',
    current: '/projects/',
    trail,
    body,
  }));
}

/* --- Blog ---------------------------------------------------------------
   BLOG_POSTS is the single source of truth for both the listing cards and the
   article pages. Client-supplied rich HTML is stored in non-page .source files
   so ordered lists, tables, links, emphasis, and every word survive builds. */
function decodeBlogEntities(value = '') {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return String(value).replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, code) => {
    if (code[0] === '#') {
      const point = code[1].toLowerCase() === 'x'
        ? Number.parseInt(code.slice(2), 16)
        : Number.parseInt(code.slice(1), 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

function blogPlainText(html = '') {
  return decodeBlogEntities(String(html)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function blogHeadingId(text, index) {
  const slug = String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';
  return `${slug}-${index + 1}`;
}

function loadBlogPost(seed) {
  const sourcePath = path.join(ROOT, seed.source);
  const raw = fs.readFileSync(sourcePath, 'utf8').replace(/^\uFEFF/, '');
  if (/<\/?(?:script|style|iframe|object|embed|form)\b/i.test(raw) || /\son[a-z]+\s*=/i.test(raw)) {
    throw new Error(`Unsafe markup in blog source: ${seed.source}`);
  }

  const documentBody = raw.match(/<body>([\s\S]*?)<\/body>/i)?.[1];
  if (!documentBody) throw new Error(`Missing <body> in blog source: ${seed.source}`);

  const metadata = documentBody.match(/^<p>([\s\S]*?)<\/p>/i)?.[0];
  if (!metadata) throw new Error(`Missing metadata block in blog source: ${seed.source}`);
  const excerpt = blogPlainText(metadata.match(/<strong>Meta Description:<\/strong>\s*([\s\S]*?)<br/i)?.[1]);
  const slug = blogPlainText(metadata.match(/<strong>URL Slug:<\/strong>\s*<code>([\s\S]*?)<\/code>/i)?.[1]);
  if (!excerpt || !slug) throw new Error(`Incomplete metadata in blog source: ${seed.source}`);

  let content = documentBody.slice(metadata.length);
  const imageTag = content.match(/^<img\b[^>]*>/i)?.[0];
  if (!imageTag) throw new Error(`Missing featured image in blog source: ${seed.source}`);
  const sourceImage = imageTag.match(/\bsrc="([^"]+)"/i)?.[1] || '';
  const alt = decodeBlogEntities(imageTag.match(/\balt="([^"]*)"/i)?.[1] || '');
  content = content.slice(imageTag.length);

  const h1 = content.match(/^<h1>([\s\S]*?)<\/h1>/i);
  if (!h1) throw new Error(`Missing article heading in blog source: ${seed.source}`);
  const title = blogPlainText(h1[1]);
  content = content.slice(h1[0].length);

  const faqMarker = /<h2>\s*Frequently Asked Questions\s*<\/h2>/i;
  const faqMatch = faqMarker.exec(content);
  if (!faqMatch) throw new Error(`Missing FAQ section in blog source: ${seed.source}`);
  let bodyHtml = content.slice(0, faqMatch.index);
  const faqHtml = content.slice(faqMatch.index + faqMatch[0].length);
  const faq = [...faqHtml.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi)]
    .map(match => ({ q: blogPlainText(match[1]), a: [blogPlainText(match[2])] }));
  const faqRemainder = faqHtml
    .replace(/<h3>[\s\S]*?<\/h3>\s*<p>[\s\S]*?<\/p>/gi, '')
    .replace(/<p>\s*<\/p>/gi, '')
    .trim();
  if (!faq.length || faqRemainder) throw new Error(`Unparsed FAQ content in blog source: ${seed.source}`);

  const headings = [];
  bodyHtml = bodyHtml.replace(/<(h2|h3)>([\s\S]*?)<\/\1>/gi, (heading, tag, inner) => {
    const text = blogPlainText(inner);
    const id = blogHeadingId(text, headings.length);
    headings.push({ type: tag.toLowerCase(), text, id });
    return `<${tag.toLowerCase()} id="${id}">${inner}</${tag.toLowerCase()}>`;
  });
  bodyHtml = bodyHtml
    .replace(/<table>/gi, '<div class="blog-table-wrap"><table>')
    .replace(/<\/table>/gi, '</table></div>');

  return { ...seed, slug, title, excerpt, alt, sourceImage, bodyHtml, headings, faq };
}

const BLOGS = BLOG_POSTS.map(loadBlogPost);
const blogUrl = post => `/blog/${post.slug}/`;
const BLOG_PAGE_SIZE = 9;
const blogPageCount = () => Math.max(1, Math.ceil(BLOGS.length / BLOG_PAGE_SIZE));
const blogPageUrl = page => page === 1 ? '/blog/' : `/blog/page/${page}/`;
const blogDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

function blogDate(date) {
  return blogDateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function blogImageUrl(post) {
  if (post.image && typeof post.image === 'object') return BIZ.origin + post.image.src;
  const image = IMG[post.image];
  if (!image) return BIZ.origin + '/assets/img/hero-driveway-1200.webp';
  const largest = image.sizes[image.sizes.length - 1];
  return `${BIZ.origin}/assets/img/${post.image}-${largest.w}.webp`;
}

function blogPicture(post, { cls = '', lazy = true, altOverride = null, sizes = '' } = {}) {
  if (typeof post.image === 'string') {
    return picture(post.image, { cls, lazy, altOverride, sizes });
  }
  const image = post.image;
  const alt = esc(altOverride ?? post.alt ?? '');
  const loading = lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high" decoding="async"';
  return `<picture${cls ? ` class="${cls}"` : ''}>
  <img src="${esc(image.src)}" width="${image.width}" height="${image.height}" alt="${alt}"${loading}>
</picture>`;
}

function blogCard(post, headingLevel = 2) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return `<article class="blog-card reveal">
  <a class="blog-card__media" href="${blogUrl(post)}" tabindex="-1" aria-hidden="true">
    ${blogPicture(post, {
      sizes: '(max-width:700px) 92vw, (max-width:1180px) 44vw, 540px',
      altOverride: post.alt,
    })}
  </a>
  <div class="blog-card__body">
    <${Heading}><a href="${blogUrl(post)}">${esc(post.title)}</a></${Heading}>
    <p class="blog-card__excerpt">${esc(post.excerpt)}</p>
    <a class="blog-card__more" href="${blogUrl(post)}" aria-label="Read ${esc(post.title)}">Read More ${ARROW}</a>
  </div>
</article>`;
}

function blogArticleContent(post) {
  return post.bodyHtml;
}

function blogTableOfContents(post) {
  const contentLinks = post.headings.map(heading => {
    return `<li${heading.type === 'h3' ? ' class="blog-toc__sub"' : ''}>
      <a href="#${heading.id}">${esc(heading.text)}</a>
    </li>`;
  });
  const faqLink = post.faq && post.faq.length
    ? '<li><a href="#frequently-asked-questions">Frequently Asked Questions</a></li>'
    : '';
  const links = [...contentLinks, faqLink].filter(Boolean).join('\n    ');

  if (!links) return '';
  // A native disclosure keeps the contents usable without adding JavaScript.
  return `<details class="blog-side-card blog-toc" open>
  <summary>
    <span id="blog-toc-title" class="blog-side-card__title">Table of Contents</span>
    <span class="blog-toc__toggle" aria-hidden="true">
      <svg viewBox="0 0 16 16"><path d="m3 10 5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
  </summary>
  <nav aria-labelledby="blog-toc-title">
    <ol>
      ${links}
    </ol>
  </nav>
</details>`;
}

function blogFaqSection(post) {
  if (!post.faq || !post.faq.length) return '';
  const rows = post.faq.map((item, index) => `<details${index === 0 ? ' open' : ''}>
  <summary>${esc(item.q)}</summary>
  <div>${item.a.map(answer => `<p>${esc(answer)}</p>`).join('')}</div>
</details>`).join('\n');
  return `<section class="blog-faq" aria-labelledby="frequently-asked-questions">
  <h2 id="frequently-asked-questions">Frequently Asked Questions</h2>
  <div class="faq">
${rows}
  </div>
</section>`;
}

function blogShareTools(post) {
  const articleUrl = `${BIZ.origin}${blogUrl(post)}`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(post.title);
  const gptPrompt = encodeURIComponent(`Summarize this article: ${post.title} ${articleUrl}`);

  return `<div class="blog-article__actions">
  <div class="blog-share" role="group" aria-label="Share this article">
    <span class="blog-share__label">Share</span>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" title="Share on Facebook">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6H17V3.3c-.8-.1-1.7-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.4v2.4H7.5V13h2.8v8h3.2Z" fill="currentColor"/></svg>
    </a>
    <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&amp;text=${encodedTitle}" target="_blank" rel="noopener noreferrer" aria-label="Share on X" title="Share on X">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 3H22l-6.8 7.8L23 21h-6.1l-4.8-6.2L6.7 21H3.6l7-8L3 3h6.3l4.3 5.7L18.9 3Zm-1.1 16h1.7L8.4 4.9H6.6L17.8 19Z" fill="currentColor"/></svg>
    </a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" title="Share on LinkedIn">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.1H3.2V21h3.3V8.1ZM4.8 3A1.9 1.9 0 1 0 4.8 6.8 1.9 1.9 0 0 0 4.8 3ZM21 13.6c0-3.9-2.1-5.8-4.9-5.8-2.3 0-3.3 1.2-3.8 2.1V8.1H9V21h3.3v-6.4c0-1.7.3-3.4 2.5-3.4 2.2 0 2.2 2 2.2 3.5V21H21v-7.4Z" fill="currentColor"/></svg>
    </a>
  </div>
  <a class="blog-summarize" href="https://chatgpt.com/?q=${gptPrompt}" target="_blank" rel="noopener noreferrer">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.45 4.05L17.5 8.5l-4.05 1.45L12 14l-1.45-4.05L6.5 8.5l4.05-1.45L12 3Zm6 10 .9 2.1L21 16l-2.1.9L18 19l-.9-2.1L15 16l2.1-.9L18 13ZM6 14l1.1 2.9L10 18l-2.9 1.1L6 22l-1.1-2.9L2 18l2.9-1.1L6 14Z" fill="currentColor"/></svg>
    <span>Summarize in GPT</span>
  </a>
</div>`;
}

function blogLatestPosts(currentPost) {
  const latest = [...BLOGS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  if (!latest.length) return '';

  return `<section class="blog-side-card blog-latest" aria-labelledby="blog-latest-title">
  <h2 id="blog-latest-title" class="blog-side-card__title">Latest Blogs</h2>
  <ul>
    ${latest.map(post => `<li>
      <a href="${blogUrl(post)}"${post.slug === currentPost.slug ? ' aria-current="page"' : ''}>
        <span class="blog-latest__media">
          ${blogPicture(post, { sizes: '84px', altOverride: '' })}
        </span>
        <span>
          <strong>${esc(post.title)}</strong>
          <time datetime="${esc(post.date)}">${esc(blogDate(post.date))}</time>
        </span>
      </a>
    </li>`).join('\n    ')}
  </ul>
</section>`;
}

function blogContactCard() {
  return `<section class="blog-side-card blog-contact" aria-labelledby="blog-contact-title">
  <p class="eyebrow">Contact us</p>
  <h2 id="blog-contact-title" class="blog-side-card__title">Book Your Free Estimate</h2>
  <p>Tell us what you are planning. We will review the site and provide a free, written estimate.</p>
  <a class="btn btn--solid" href="/get-your-free-estimate/">Contact Us</a>
  <a class="blog-contact__phone tel" href="${BIZ.phoneHref}">${BIZ.phone}</a>
</section>`;
}

function blogPagination(currentPage, totalPages) {
  if (totalPages <= 1) return '';
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return `<nav class="blog-pagination" aria-label="Blog pagination">
  ${currentPage > 1
    ? `<a class="blog-pagination__direction" href="${blogPageUrl(currentPage - 1)}" rel="prev">&larr; Previous</a>`
    : '<span aria-hidden="true"></span>'}
  <ol>
    ${pages.map(page => `<li>
      <a href="${blogPageUrl(page)}"${page === currentPage ? ' aria-current="page"' : ''} aria-label="Blog page ${page}">${page}</a>
    </li>`).join('\n    ')}
  </ol>
  ${currentPage < totalPages
    ? `<a class="blog-pagination__direction" href="${blogPageUrl(currentPage + 1)}" rel="next">Next &rarr;</a>`
    : '<span aria-hidden="true"></span>'}
</nav>`;
}

function buildBlogIndex(currentPage, totalPages) {
  const pageUrl = blogPageUrl(currentPage);
  const start = (currentPage - 1) * BLOG_PAGE_SIZE;
  const posts = [...BLOGS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(start, start + BLOG_PAGE_SIZE);
  const trail = currentPage === 1
    ? [{ label: 'Home', href: '/' }, { label: 'Blogs' }]
    : [{ label: 'Home', href: '/' }, { label: 'Blogs', href: '/blog/' }, { label: `Page ${currentPage}` }];
  const body = `${crumbs(trail)}

<section class="blog-hero">
  ${picture('hero-driveway', {
    sizes: '100vw',
    cls: 'blog-hero__media',
    lazy: false,
    altOverride: '',
  })}
  <div class="blog-hero__shade" aria-hidden="true"></div>
  <div class="wrap blog-hero__content">
    <p class="eyebrow">${esc(BLOG_SETTINGS.title)}</p>
    <h1 class="h-display">${esc(BLOG_SETTINGS.heading)}</h1>
    <p class="lede">${esc(smart(BLOG_SETTINGS.intro))}</p>
  </div>
</section>

<section class="section section--tight blog-listing">
  <div class="wrap">
    <div class="blog-grid">
      ${posts.map(post => blogCard(post)).join('\n      ')}
    </div>
    ${blogPagination(currentPage, totalPages)}
  </div>
</section>`;

  write(currentPage === 1 ? 'blog/index.html' : `blog/page/${currentPage}/index.html`, layout({
    title: currentPage === 1
      ? `Blogs | Home Improvement Tips | ${BIZ.legal}`
      : `Blogs — Page ${currentPage} | ${BIZ.legal}`,
    desc: 'Home improvement planning ideas, material guidance, and maintenance advice from Onyx Home Improvement in Northern Virginia.',
    url: pageUrl,
    current: '/blog/',
    trail,
    body,
    robots: BLOG_SETTINGS.noindex ? 'noindex, nofollow' : '',
    heroImage: 'hero-driveway',
    jsonld: [{
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: currentPage === 1 ? `${BIZ.legal} Blog` : `${BIZ.legal} Blog — Page ${currentPage}`,
      url: BIZ.origin + pageUrl,
      publisher: { '@id': BIZ.origin + '/#business' },
      blogPost: posts.map(post => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: BIZ.origin + blogUrl(post),
        datePublished: post.date,
      })),
    }],
  }));
}

function buildBlogIndexes() {
  // The blog directory contains generated HTML only. Recreate it on every
  // build so removing a post or reducing the page count cannot leave an old
  // article or /page/N/ URL live.
  const blogDir = path.join(ROOT, 'blog');
  if (fs.existsSync(blogDir)) fs.rmSync(blogDir, { recursive: true, force: true });

  const totalPages = blogPageCount();
  for (let page = 1; page <= totalPages; page++) {
    buildBlogIndex(page, totalPages);
  }
}

function buildBlogPost(post) {
  const url = blogUrl(post);
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Blogs', href: '/blog/' },
    { label: post.title },
  ];
  const body = `${crumbs(trail)}

<article class="blog-article">
  <div class="wrap blog-article__layout">
    <div class="blog-article__main">
      <div class="blog-article__hero">
        ${blogPicture(post, {
          sizes: '(max-width:900px) 92vw, 760px',
          lazy: false,
          altOverride: post.alt,
        })}
      </div>

      <header class="blog-article__head">
      <div class="blog-article__utility">
        <p class="blog-article__meta">
          <svg class="blog-article__date-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v3m10-3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <time datetime="${esc(post.date)}">${esc(blogDate(post.date))}</time>
        </p>
        ${blogShareTools(post)}
      </div>
      <h1 class="h-display">${esc(post.title)}</h1>
      </header>

      <div class="blog-article__content prose">
        ${blogArticleContent(post)}
      </div>
      ${blogFaqSection(post)}
    </div>
    <aside class="blog-sidebar" aria-label="Article navigation and contact">
      ${blogTableOfContents(post)}
      ${blogContactCard()}
      ${blogLatestPosts(post)}
    </aside>
  </div>
</article>
`;

  write(`blog/${post.slug}/index.html`, layout({
    title: `${post.title} | ${BIZ.legal}`,
    desc: metaDesc(post.excerpt),
    url,
    current: '/blog/',
    trail,
    body,
    robots: BLOG_SETTINGS.noindex ? 'noindex, nofollow' : '',
    ogType: 'article',
    ogImage: blogImageUrl(post),
    heroImage: typeof post.image === 'string' ? post.image : null,
    jsonld: [{
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: blogImageUrl(post),
      datePublished: post.date,
      dateModified: post.date,
      author: { '@type': 'Organization', name: post.author },
      publisher: { '@id': BIZ.origin + '/#business' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': BIZ.origin + url },
    }, ...(post.faq && post.faq.length ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a.join(' '),
        },
      })),
    }] : [])],
  }));
}

/* --- Reviews ------------------------------------------------------------- */
function buildReviews() {
  const list = REVIEWS.filter(r => !r.hide).map(r => {
    const meta = [r.project, r.date, r.source ? `via ${r.source}` : ''].filter(Boolean).join(' · ');
    return `<li class="reveal">
  <div class="review__meta">
    <span class="review__name">${esc(r.name)}</span>
    <span class="stars" aria-label="5 out of 5 stars">★★★★★</span>
    ${meta ? `<span class="review__detail">${esc(meta)}</span>` : ''}
  </div>
  <p>${esc(smart(r.text))}</p>
</li>`;
  }).join('\n');

  const trail = [{ label: 'Home', href: '/' }, { label: 'Reviews' }];
  const body = `${crumbs(trail)}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Reviews</p>
    <h1 class="h-display">What customers say</h1>
    <p class="lede">Onyx has <strong>${BIZ.reviewCount} five-star reviews on ${BIZ.ratingSource}</strong> — a straight ${BIZ.rating} on both. A selection is reproduced below, as written by the customers who left them.</p>
    <div class="hero__actions" style="margin-top:2rem">
      <a class="btn btn--solid" href="${BIZ.googleProfileUrl}" rel="noopener">Read our reviews on Google</a>
      <a class="btn btn--ghost" href="${BIZ.ratingUrl}" rel="noopener">Verify on HomeAdvisor</a>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <ul class="review-list">
${list}
    </ul>
  </div>
</section>

${leaveReview()}

${ctaBand()}`;

  write('reviews/index.html', layout({
    title: `Reviews | ${BIZ.legal} | ${BIZ.rating}/5 in Northern Virginia`,
    desc: `${BIZ.reviewCount} five-star customer reviews of Onyx Home Improvement on ${BIZ.ratingSource}, for masonry and stonework across Northern Virginia.`,
    url: '/reviews/',
    current: '/reviews/',
    trail,
    body,
  }));
}

/* Estimate form: post in the background and swap the form for a confirmation,
   so the visitor never leaves the page. Progressive enhancement — without it
   the form posts normally and _next sends the browser to /thank-you/.
   Formspree returns JSON rather than redirecting when we ask for it. */
const FORM_SCRIPT = `(function(){
var form=document.getElementById('estimate-form'),done=document.getElementById('form-done'),err=document.getElementById('form-error');
if(!form||!done||!form.action||!window.fetch||!window.FormData)return;
var btn=form.querySelector('button[type=submit]'),label=btn?btn.textContent:'';
form.addEventListener('submit',function(e){
e.preventDefault();
if(form.reportValidity&&!form.reportValidity())return;
if(err){err.hidden=true}
if(btn){btn.disabled=true;btn.textContent='Sending\\u2026'}
fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}})
.then(function(r){
if(!r.ok)throw new Error(r.status);
form.hidden=true;done.hidden=false;
/* Move focus, or a screen reader is left on a form no longer in the page. */
done.focus();
done.scrollIntoView({block:'center'});
})
.catch(function(){
if(err){err.textContent='Something went wrong sending that. Please try again, or call ${BIZ.phone}.';err.hidden=false}
if(btn){btn.disabled=false;btn.textContent=label}
});
});
})();`;

/* --- Estimate / contact -------------------------------------------------- */
function buildContact() {
  const action = BIZ.formspreeId
    ? `https://formspree.io/f/${BIZ.formspreeId}`
    : '';
  if (!BIZ.formspreeId) {
    warnings.push('BIZ.formspreeId is empty — the estimate form will not submit until you set it in content.mjs. See README.');
  }

  /* Grouped so the material pages sit under their hub rather than reading as
     four unrelated driveway entries in a flat list. */
  const serviceOptions = TOP.map(s => {
    const kids = childrenOf(s.href);
    const opt = t => `<option value="${esc(t)}">${esc(t)}</option>`;
    return kids.length
      ? `<optgroup label="${esc(s.title)}">${[opt(s.title), ...kids.map(c => opt(c.title))].join('')}</optgroup>`
      : opt(s.title);
  }).join('\n            ');
  const areaOptions = AREAS.map(a => `<option value="${esc(a)}">${esc(a)}</option>`).join('\n            ');

  const trail = [{ label: 'Home', href: '/' }, { label: 'Free Estimate' }];
  const body = `${crumbs(trail)}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Request</p>
    <h1 class="h-display" style="max-width:20ch">Want to create something great together?</h1>
    <p class="lede">Tell us what you have in mind and we will come out, look at the site, and give you a written estimate. Free, itemized, and no obligation.</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap contact-grid">
    <div>
      <div class="formdone" id="form-done" hidden tabindex="-1" role="status" aria-live="polite">
        <p class="formdone__mark" aria-hidden="true">&check;</p>
        <p class="formdone__head">Submitted</p>
        <p class="formdone__sub">Thanks &mdash; we have your request and will be in touch, usually the same day. If it is urgent, call <a class="tel" href="${BIZ.phoneHref}">${BIZ.phone}</a>.</p>
      </div>
      <form class="form" id="estimate-form" method="POST"${action ? ` action="${action}"` : ''}>
        <input type="hidden" name="_subject" value="New estimate request — onyxhomeimprovementllc.com">
        <input type="hidden" name="_next" value="${BIZ.origin}/thank-you/">
        <div class="hp" aria-hidden="true">
          <label for="company">Company (leave blank)</label>
          <input id="company" type="text" name="_gotcha" tabindex="-1" autocomplete="off">
        </div>

        <div class="field-row">
          <div class="field">
            <label for="name">Name <abbr class="req" title="required">*</abbr></label>
            <input id="name" name="name" type="text" autocomplete="name" required>
          </div>
          <div class="field">
            <label for="phone">Phone <abbr class="req" title="required">*</abbr></label>
            <input id="phone" name="phone" type="tel" autocomplete="tel" required>
          </div>
        </div>

        <div class="field">
          <label for="email">Email <abbr class="req" title="required">*</abbr></label>
          <input id="email" name="email" type="email" autocomplete="email" required>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="service">What do you need?</label>
            <select id="service" name="service">
            <option value="">Select a service</option>
            ${serviceOptions}
            <option value="Something else">Something else</option>
            </select>
          </div>
          <div class="field">
            <label for="area">Where is the property?</label>
            <select id="area" name="area">
            <option value="">Select an area</option>
            ${areaOptions}
            <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label for="message">Tell us about the project <span class="hint">Size, condition, timing — whatever you know so far.</span></label>
          <textarea id="message" name="message" rows="6"></textarea>
        </div>

        <p class="form__note"><abbr class="req" title="required">*</abbr> Required &mdash; everything else is optional.</p>
        <p class="form__error" id="form-error" hidden role="alert"></p>
        <button class="btn btn--solid" type="submit" style="justify-self:start;padding-inline:2rem">Request My Free Estimate</button>
        <p class="form__note">We reply to every request, usually the same day. We never share your details.</p>
      </form>
    </div>

    <aside class="contact-block">
      <div>
        <h2>Call or text</h2>
        <p><a class="tel" href="${BIZ.phoneHref}" style="font-size:1.35rem;font-weight:700;text-decoration:none">${BIZ.phone}</a></p>
      </div>
      <div>
        <h2>Email</h2>
        <p><a href="mailto:${BIZ.email}">${BIZ.email}</a></p>
      </div>
      ${BIZ.hours ? `<div><h2>Hours</h2><p>${esc(BIZ.hours)}</p></div>` : ''}
      <div>
        <h2>Service area</h2>
        <p style="color:var(--ink-mid);font-size:.925rem">${AREAS.join(' · ')}</p>
      </div>
      <div>
        <h2>Rated</h2>
        <p style="color:var(--ink-mid);font-size:.925rem"><span class="stars">★★★★★</span><br>${BIZ.reviewCount} five-star reviews on ${BIZ.ratingSource}</p>
        <p style="margin-top:.75rem"><a href="${BIZ.googleReviewUrl}" rel="noopener" style="font-size:.875rem">Leave us a Google review</a></p>
      </div>
      ${BIZ.license ? `<div><h2>Licensing</h2><p style="color:var(--ink-mid);font-size:.925rem">License ${esc(BIZ.license)} · Licensed &amp; insured</p></div>` : ''}
    </aside>
  </div>
</section>`;

  write('get-your-free-estimate/index.html', layout({
    title: `Get Your Free Estimate | ${BIZ.legal}`,
    desc: `Request a free, itemized masonry or stonework estimate from Onyx Home Improvement. Serving Northern Virginia and Washington DC. Call ${BIZ.phone}.`,
    url: '/get-your-free-estimate/',
    current: '/get-your-free-estimate/',
    trail,
    body,
    script: FORM_SCRIPT,
  }));

  /* Thank-you page. Only reached without JavaScript now: the handler above
     posts in the background and swaps in the confirmation instead. Kept as
     the no-JS fallback, since _next still points here. */
  write('thank-you/index.html', layout({
    title: `Thank You | ${BIZ.legal}`,
    desc: 'Your estimate request has been received. We will be in touch shortly.',
    url: '/thank-you/',
    current: '',
    body: `<section class="pagehead" style="padding-block:clamp(5rem,12vw,9rem)">
  <div class="wrap">
    <p class="eyebrow">Request received</p>
    <h1 class="h-display" style="max-width:18ch">Thanks — we&rsquo;ll be in touch.</h1>
    <p class="lede">We reply to every request, usually the same day. If it is urgent, call us directly at <a class="tel" href="${BIZ.phoneHref}">${BIZ.phone}</a>.</p>
    <div class="hero__actions" style="margin-top:2rem">
      <a class="btn btn--solid" href="/">Back to home</a>
      <a class="btn btn--ghost" href="/portfolio/">See our work</a>
    </div>
  </div>
</section>`,
  }));
}

/* --- Service areas ------------------------------------------------------- */
/* The old site had a page per city. We keep one index at the same parent URL
   and leave lightweight stubs at each city URL so existing search results and
   inbound links land somewhere useful instead of a 404. */
function buildAreas() {
  const trail = [{ label: 'Home', href: '/' }, { label: 'Service Areas' }];
  const body = `${crumbs(trail)}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Where we work</p>
    <h1 class="h-display">Service areas</h1>
    <p class="lede">Onyx works throughout Northern Virginia and Washington DC. Estimates are free everywhere on this list — if you are just outside it, call and ask, because we often can.</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap map-grid">
    <div class="reveal areamap-col">${areaMap('hero')}</div>
    <div>
      <h2 class="h-sub reveal">From Clifton to the District</h2>
      <p class="lede reveal" style="margin-top:1rem">Shaded areas are the counties and independent cities we work in. Towns like Vienna, Burke, and Fairfax Station sit inside Fairfax County, so they are marked with pins rather than their own outline.</p>
      <ul class="map-legend reveal">
        <li><i></i>Jurisdictions we serve</li>
        <li><i class="is-pin"></i>Cities and towns</li>
      </ul>
      <p style="margin-top:2rem"><a class="link-arrow reveal" href="/get-your-free-estimate/">Check if we cover your address ${ARROW}</a></p>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="grid grid--3">
      ${AREAS.map(a => `<div class="reveal" style="border-top:1px solid var(--line);padding-top:1.25rem">
        <h2 style="font-size:1.15rem">${esc(a)}</h2>
        <p style="color:var(--ink-mid);font-size:.925rem;margin-top:.5rem">Masonry, paving, and stonework across ${esc(a.split(',')[0])} and the surrounding neighborhoods.</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap">
    <div class="section__head"><h2 class="h-section reveal">What we build</h2></div>
    <div class="grid grid--3">
${serviceGrid()}
    </div>
  </div>
</section>

${ctaBand()}`;

  write('service-areas/index.html', layout({
    title: `Service Areas | Masonry in Northern Virginia & DC | ${BIZ.legal}`,
    desc: 'Onyx Home Improvement covers Fairfax, Arlington, Alexandria, Vienna, Falls Church, Burke, Fairfax Station, Springfield, and Washington DC. Free estimates.',
    url: '/service-areas/',
    current: '',
    trail,
    body,
  }));

  /* City stubs at the old WordPress URLs. */
  const slugFor = a => a.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-').replace(/-va$/, '-va').replace(/-dc$/, '-dc');
  for (const a of AREAS) {
    const slug = slugFor(a);
    const city = a.split(',')[0];
    const trail = [
      { label: 'Home', href: '/' },
      { label: 'Service Areas', href: '/service-areas/' },
      { label: a },
    ];
    write(`service-areas/${slug}/index.html`, layout({
      title: `Masonry & Stonework in ${a} | ${BIZ.legal}`,
      desc: metaDesc(
        `Onyx Home Improvement provides driveway paving, patios, walkways, retaining walls,`
        + ` and masonry repair in ${a}. Family-operated since ${BIZ.since}.`,
        'Free estimates.'),
      url: `/service-areas/${slug}/`,
      current: '',
      trail,
      // City landing pages carry the same service list as /services/, but with
      // areaServed narrowed to this one city — that pairing is what tells
      // Google the page is about masonry *in this place*. provider points at
      // the LocalBusiness node on the home page rather than restating it, so
      // there is exactly one business entity across the site.
      jsonld: TOP.map(s => ({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `${s.title} in ${a}`,
        serviceType: s.title,
        url: BIZ.origin + s.href,
        provider: { '@id': BIZ.origin + '/#business' },
        areaServed: { '@type': 'Place', name: a },
      })),
      body: `${crumbs(trail)}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Service area</p>
    <h1 class="h-display" style="max-width:18ch">Masonry &amp; Stonework in ${esc(a)}</h1>
    <p class="lede">Onyx Home Improvement has built driveways, patios, walkways, steps, and stone walls for homeowners in ${esc(city)} since ${BIZ.since}. We are family-operated, work throughout Northern Virginia, and estimates here are free.</p>
    <div class="hero__actions" style="margin-top:2rem">
      <a class="btn btn--solid" href="/get-your-free-estimate/">Get a Free Estimate</a>
      <a class="btn btn--ghost tel" href="${BIZ.phoneHref}">${BIZ.phone}</a>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="section__head"><h2 class="h-section reveal">What we build in ${esc(city)}</h2></div>
    <div class="grid grid--3">
${serviceGrid()}
    </div>
  </div>
</section>

${areaProjects(a, city)}
${faqSection(FAQ.slice(0, 4))}
${ctaBand()}`,
    }));
  }
}

/* --- Project pages ------------------------------------------------------- */
function buildProject(p) {
  const svc = SERVICES.find(s => s.href === p.service);
  if (!svc) { warnings.push(`project ${p.slug}: no service matches ${p.service}`); return; }
  if (!p.city) warnings.push(`project ${p.slug}: no city set \u2014 add one to link it from a service-area page`);
  else if (!AREAS.includes(p.city)) warnings.push(`project ${p.slug}: city "${p.city}" is not in AREAS, so no city page links to it`);

  const url = projectUrl(p);
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/' },
    { label: svc.title, href: svc.href },
    { label: p.title },
  ];

  const siblings = projectsFor(svc.href).filter(o => o.slug !== p.slug);
  const cityPage = p.city && AREAS.includes(p.city) ? `/service-areas/${areaSlugOf(p.city)}/` : null;

  const body = `${crumbs(trail)}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">${[esc(svc.title), p.city ? esc(p.city) : ''].filter(Boolean).join(' &middot; ')}</p>
    <h1 class="h-display">${esc(p.title)}</h1>
    <p class="lede">${esc(p.summary)}</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    ${projectFigures(p)}
  </div>
</section>

<section class="section section--tight">
  <div class="wrap prose">
    <dl class="pspec">
      <div><dt>Service</dt><dd><a href="${svc.href}">${esc(svc.title)}</a></dd></div>
      <div><dt>Material</dt><dd>${esc(p.material)}</dd></div>
      ${p.city ? `<div><dt>Location</dt><dd>${cityPage ? `<a href="${cityPage}">${esc(p.city)}</a>` : esc(p.city)}</dd></div>` : ''}
    </dl>
    ${p.scope && p.scope.length ? `<div class="pscope">
      <h2>What the job involved</h2>
      <ul>${p.scope.map(t => `<li>${esc(smart(t))}</li>`).join('')}</ul>
    </div>` : ''}
    ${p.body.map(t => `<p>${smart(t)}</p>`).join('\n    ')}
  </div>
</section>

${projectGrid(siblings, { heading: `More ${esc(svc.title.toLowerCase())} work` })}

${ctaBand()}`;

  write(url.replace(/^\//, '') + 'index.html', layout({
    title: p.city ? `${p.title} in ${p.city} | ${BIZ.legal}` : `${p.title} | ${BIZ.legal}`,
    desc: metaDesc(smart(p.summary), `${svc.title} in ${p.city || 'Northern Virginia'}. Free estimates &mdash; call ${BIZ.phone}.`),
    url,
    current: '/projects/',
    trail,
    body,
    // A completed job is a CreativeWork about the service, not a Service
    // offer in its own right — marking it up as an Offer would tell Google
    // this single driveway is purchasable. about/ locationCreated are what
    // tie it to the service and the city.
    jsonld: [{
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': BIZ.origin + url + '#project',
      name: p.city ? `${p.title} — ${p.city}` : p.title,
      headline: p.title,
      description: p.summary,
      url: BIZ.origin + url,
      image: BIZ.origin + '/assets/img/projects/' + p.slug + '-1200.jpg',
      creator: { '@id': BIZ.origin + '/#business' },
      ...(p.city ? { locationCreated: { '@type': 'Place', name: p.city } } : {}),
      about: { '@type': 'Service', name: svc.title, url: BIZ.origin + svc.href },
      material: p.material,
    }],
  }));
}

/* --- 404 ----------------------------------------------------------------- */
function build404() {
  write('404.html', layout({
    title: `Page Not Found | ${BIZ.legal}`,
    desc: 'That page could not be found.',
    url: '/404.html',
    current: '',
    body: `<section class="pagehead" style="padding-block:clamp(5rem,12vw,9rem)">
  <div class="wrap">
    <p class="eyebrow">404</p>
    <h1 class="h-display" style="max-width:18ch">We couldn&rsquo;t find that page.</h1>
    <p class="lede">It may have moved when we rebuilt the site. Try one of these instead, or call us at <a class="tel" href="${BIZ.phoneHref}">${BIZ.phone}</a>.</p>
    <div class="hero__actions" style="margin-top:2rem">
      <a class="btn btn--solid" href="/">Home</a>
      <a class="btn btn--ghost" href="/services/">All services</a>
      <a class="btn btn--ghost" href="/portfolio/">Portfolio</a>
    </div>
  </div>
</section>`,
  }));
}


/* --- Warranty ------------------------------------------------------------
   The terms here are contractual. Everything on this page comes from
   WARRANTY in content.mjs, so there is one place to correct if the contract
   changes — and nothing is written into the template that the contract does
   not say. */
function buildWarranty() {
  const trail = [{ label: 'Home', href: '/' }, { label: 'Warranty' }];

  const rows = WARRANTY.terms.map(t => {
    const svc = SERVICES.filter(x => (x.warranty || []).includes(t.key));
    const links = svc.length
      ? `<p class="wtable__svc">${svc.map(x => `<a href="${x.href}">${esc(x.title)}</a>`).join(', ')}</p>`
      : '';
    return `<div class="wtable__row reveal">
      <p class="wtable__term"><strong>${t.years}</strong><span>year${t.years === 1 ? '' : 's'}</span></p>
      <div>
        <h3>${esc(t.label)}</h3>
        ${links}
      </div>
    </div>`;
  }).join('\n    ');

  const body = `${crumbs(trail)}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Warranty</p>
    <h1 class="h-display" style="max-width:16ch">${esc(WARRANTY.headline)}</h1>
    <p class="lede">${esc(smart(WARRANTY.lede))}</p>
    <div class="hero__actions" style="margin-top:2rem">
      <a class="btn btn--solid" href="/get-your-free-estimate/">Get a Free Estimate</a>
      <a class="btn btn--ghost tel" href="${BIZ.phoneHref}">${BIZ.phone}</a>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="wtable">
    ${rows}
    </div>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap split">
    <div>
      <h2 class="h-section reveal">What a workmanship warranty covers</h2>
      <div class="prose reveal" style="margin-top:1.25rem">
        <p>A workmanship warranty covers our installation — the work we did and the way we did it. If something fails because of how it was built, we come back and put it right.</p>
        <p>That is a different thing from the products themselves. Materials carry whatever terms their manufacturer sets, and those run separately from ours. It is also different from damage caused by something other than the installation.</p>
        <p>What is and is not covered is set out in full in your written contract. The warranty is part of the agreement you sign rather than a separate certificate that arrives later, so you can read the exact terms before you commit to anything.</p>
      </div>
    </div>
    <div>
      <h2 class="h-section reveal">Why the terms differ</h2>
      <div class="prose reveal" style="margin-top:1.25rem">
        <p>Asphalt and drainage carry three years; concrete, pavers, masonry, and retaining walls carry five. The difference is not a judgment about how carefully each is built — it reflects how each system behaves over time and how much of its performance depends on ground conditions that keep moving after we leave.</p>
        <p>A driveway can also fall into more than one category. An asphalt driveway carries the three-year term and a paver driveway carries five, so the term that applies to your job depends on what you actually build, and it is stated on your estimate.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap" style="max-width:70ch">
    <h2 class="h-section reveal">Making a claim</h2>
    <div class="prose reveal" style="margin-top:1.25rem">
      <p>Call ${BIZ.phone} or email <a href="mailto:${BIZ.email}">${BIZ.email}</a> and tell us what you are seeing. We come out and look at it — there is no form to complete and no portal to sign into.</p>
      <p>The same people who quoted and built the job are the ones who come back to it. That is the practical advantage of a family-operated business over a company that may have subcontracted your installation to a crew it no longer works with.</p>
    </div>
  </div>
</section>

${ctaBand()}`;

  write('warranty/index.html', layout({
    title: `Workmanship Warranty | ${BIZ.legal}`,
    desc: metaDesc(
      'Written workmanship warranties on every installation — five years on concrete, pavers, masonry, and retaining walls, three years on asphalt and drainage.',
      `Free estimates across Northern Virginia and DC. Call ${BIZ.phone}.`),
    url: '/warranty/',
    current: '/warranty/',
    trail,
    body,
  }));
}

/* --- Retired URLs --------------------------------------------------------
   GitHub Pages serves static files and has no redirect configuration, so a
   real 301 is not available to us here. Each retired URL gets a stub instead:
   an instant client-side redirect that Google treats as equivalent to a 301
   for indexing, and that Google Ads follows without complaint.

   The stub deliberately carries the only inline script on the site. A meta
   refresh alone would drop the query string, taking the `gclid` with it and
   breaking Ads conversion attribution on every click. The script preserves
   the query and hash; the meta refresh below it is the no-JavaScript
   fallback, and the visible link is the fallback for both.

   Also emits a `_redirects` file. GitHub Pages ignores it, but it is the
   native format for Netlify and Cloudflare Pages — moving the site to either
   turns all of these into genuine 301s with no further work. */
function buildRedirects() {
  for (const [from, to] of REDIRECTS) {
    const hop = `${BASE}${to}`;
    write(`${from.replace(/^\/+|\/+$/g, '')}/index.html`, `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting&hellip;</title>
<link rel="canonical" href="${BIZ.origin}${to}">
<meta name="robots" content="noindex">
<script>location.replace(${JSON.stringify(hop)} + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=${hop}">
</head>
<body>
<p>This page has moved to <a href="${to}">${BIZ.origin}${to}</a>.</p>
</body>
</html>
`);
  }

  const width = Math.max(...REDIRECTS.map(([from]) => from.length));
  write('_redirects', REDIRECTS
    .map(([from, to]) => `${from.padEnd(width)}  ${to}  301`)
    .join('\n') + '\n');
}

/* --- sitemap / robots / misc --------------------------------------------- */
function buildMeta() {
  const urls = [
    ['/', '1.0'],
    ['/services/', '0.9'],
    ...SERVICES.map(s => [s.href, '0.8']),
    ['/projects/', '0.8'],
    ...PROJECTS.map(p => [projectUrl(p), '0.6']),
    ['/portfolio/', '0.7'],
    ['/reviews/', '0.7'],
    // Keep blog pages out of the sitemap until publication is approved.
    // Changing BLOG_SETTINGS.noindex to false publishes the whole section
    // here as part of the same rebuild.
    ...(!BLOG_SETTINGS.noindex ? [
      ['/blog/', '0.7'],
      ...Array.from({ length: blogPageCount() - 1 }, (_, index) => [blogPageUrl(index + 2), '0.5']),
      ...BLOGS.map(post => [blogUrl(post), '0.6']),
    ] : []),
    ['/about-us/', '0.7'],
    ['/get-your-free-estimate/', '0.9'],
    ['/warranty/', '0.7'],
    ['/service-areas/', '0.6'],
    ...AREAS.map(a => [`/service-areas/${a.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-')}/`, '0.5']),
  ];
  const today = new Date().toISOString().slice(0, 10);
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p]) => `  <url><loc>${BIZ.origin}${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join('\n')}
</urlset>
`);

  write('robots.txt', BASE
    ? `# Staging preview — not for indexing.\nUser-agent: *\nDisallow: /\n`
    : `User-agent: *
Allow: /

Sitemap: ${BIZ.origin}/sitemap.xml
`);

  // A CNAME forces GitHub Pages onto the custom domain, which would break a
  // project-site preview. Only emit it for a root-domain build.
  if (BASE) {
    const cname = path.join(ROOT, 'CNAME');
    if (fs.existsSync(cname)) fs.unlinkSync(cname);
    warnings.push(`BASE_PATH=${BASE} — CNAME omitted. Rebuild without BASE_PATH before pointing the custom domain here.`);
  } else {
    write('CNAME', BIZ.origin.replace(/^https?:\/\//, '') + '\n');
  }
  write('.nojekyll', '');

  /* Icons and logo files are NOT generated here. They are rasterised from
     the source artwork by tools/icons.mjs, which owns the only PNG encoder in
     the repo; build.mjs has none. Run that script after replacing a logo. */
}

/* --- run ----------------------------------------------------------------- */
console.log('Building ' + BIZ.legal + '…\n');
buildHome();
buildServicesIndex();
SERVICES.forEach(buildService);
PROJECTS.forEach(buildProject);
buildAbout();
buildProjects();
buildPortfolio();
buildReviews();
buildBlogIndexes();
BLOGS.forEach(buildBlogPost);
buildContact();
buildWarranty();
buildAreas();
build404();
buildRedirects();
buildMeta();

console.log(`  ${written} files written`);
if (warnings.length) {
  console.log('\n  ⚠ ' + warnings.length + ' warning(s):');
  warnings.forEach(w => console.log('    · ' + w));
}
console.log('\nDone. Commit and push to publish.');
