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
  BIZ, NAV, SERVICES, REVIEWS, FEATURED_REVIEWS, AREAS,
  PORTFOLIO, HOME_PORTFOLIO, FAQ, POINTS,
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
    ...SERVICES.map(s => `<li><a href="${s.href}">${s.title}</a></li>`),
  ].join('\n            ');

  return `<header class="masthead">
  <div class="wrap masthead__inner">
    <a class="wordmark" href="/">
      <span class="wordmark__name">Onyx</span>
      <span class="wordmark__sub">Home Improvement</span>
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
        <a class="btn btn--solid" href="/get-your-free-estimate/">Free Estimate</a>
        <a class="btn btn--ghost" href="${BIZ.phoneHref}" style="width:100%;margin-top:.6rem">${BIZ.phone}</a>
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
  const svc = SERVICES.map(s => `<li><a href="${s.href}">${s.title}</a></li>`).join('\n        ');
  // These city pages exist, so link them: better for visitors who are checking
  // coverage, and it gives the service-area pages internal links.
  const areaSlug = a => a.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-');
  const areas = AREAS.slice(0, 6)
    .map(a => `<li><a href="/service-areas/${areaSlug(a)}/">${a}</a></li>`).join('\n        ');

  const operating = [
    BIZ.hours,
    BIZ.license ? `License ${esc(BIZ.license)}` : '',
    'Free estimates',
  ].filter(Boolean).map(l => `<li>${l}</li>`).join('\n        ');

  return `<footer class="footer">
  <div class="wrap">
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

/* --- page shell ---------------------------------------------------------- */
function layout({ title, desc, url, body, current, jsonld = [], heroImage = null }) {
  const canonical = BIZ.origin + url;
  // Preload the hero so the LCP element starts downloading before the CSS has
  // parsed. imagesrcset/imagesizes must mirror the <picture> exactly, or the
  // browser treats the preload as a separate resource and fetches twice.
  const heroPreload = heroImage && IMG[heroImage]
    ? `\n<link rel="preload" as="image" type="image/avif" fetchpriority="high"`
      + ` imagesrcset="${IMG[heroImage].sizes.map(s => `/assets/img/${heroImage}-${s.w}.avif ${s.w}w`).join(', ')}"`
      + ` imagesizes="100vw">`
    : '';

  const ld = jsonld.length
    ? `\n<script type="application/ld+json">${JSON.stringify(jsonld.length === 1 ? jsonld[0] : jsonld)}</script>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#14120f">${BASE ? '\n<meta name="robots" content="noindex, nofollow">' : ''}

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(BIZ.legal)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${BIZ.origin}/assets/img/hero-driveway-1200.webp">
<meta name="twitter:card" content="summary_large_image">

<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/fraunces-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/dm-sans-latin.woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">${heroPreload}
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">${ld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(current)}
<main id="main">
${body}
</main>
${footer()}
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
  ].filter(Boolean);
  return `<div class="trustbar">
  <div class="wrap">
    <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
  </div>
</div>`;
}

function serviceGrid(reveal = true) {
  return SERVICES.map(s => `<a class="card${reveal ? ' reveal' : ''}" href="${s.href}">
  <div class="card__media">${picture(s.image, { sizes: '(max-width:620px) 92vw, (max-width:900px) 45vw, 30vw' })}</div>
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

function areasSection() {
  return `<section class="section section--tight section--sunk">
  <div class="wrap">
    <p class="eyebrow">Service area</p>
    <ul class="chips">
      ${AREAS.map(a => `<li><a href="/service-areas/">${esc(a)}</a></li>`).join('\n      ')}
    </ul>
  </div>
</section>`;
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
  description: 'Family-operated masonry and stonework contractor serving Fairfax, Northern Virginia, and Washington DC since 2010. Driveways, patios, walkways, retaining walls, stone veneer, chimney and foundation repair.',
  image: BIZ.origin + '/assets/img/hero-driveway-1200.webp',
  address: {
    '@type': 'PostalAddress',
    ...(BIZ.street ? { streetAddress: BIZ.street } : {}),
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
    <p class="eyebrow">Masonry &amp; Stonework · Northern Virginia · Washington DC</p>
    <h1 class="h-display">Onyx Home Improvement</h1>
    <p class="hero__lede">Family-operated in Fairfax since ${BIZ.since} (<a href="/about-us/">read our story</a>). Driveways, patios, walkways, and stone that are built on a base that holds. Free estimates across NoVA and DC.</p>
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
      <p class="lede reveal">Masonry and stonework for homes across Fairfax County and the surrounding area — from a single set of front steps to a full driveway replacement.</p>
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
    title: `Masonry Contractor in Fairfax, VA | ${BIZ.legal}`,
    desc: `Family-operated masonry and stonework contractor in Fairfax, VA since 2010. Driveways, patios, walkways, retaining walls, stone veneer, chimney and foundation repair. Free estimates across Northern Virginia and DC.`,
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
      <h2 class="h-section reveal">${esc(s.title)} projects</h2>
    </div>
    <div class="grid grid--3">
      ${gallery.map(g => `<figure class="reveal" style="margin:0">${picture(g, { sizes: '(max-width:620px) 92vw, (max-width:900px) 45vw, 30vw', cls: 'card__media' })}
      <figcaption style="margin-top:.6rem;font-size:.8rem;color:var(--ink-dim)">${esc(IMG[g].alt)}</figcaption></figure>`).join('\n      ')}
    </div>
  </div>
</section>` : '';

  const others = SERVICES.filter(o => o.slug !== s.slug).slice(0, 3);

  const body = `${crumbs([
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/' },
    { label: s.title },
  ])}

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

<div class="wrap" style="margin-bottom:var(--section-y)">
  ${picture(s.feature, { sizes: '(max-width:1180px) 92vw, 1120px' })}
</div>

${sections}

${gallerySection}

<section class="section section--tight">
  <div class="wrap">
    <p class="eyebrow">Also from Onyx</p>
    <div class="grid grid--3" style="margin-top:1.5rem">
      ${others.map(o => `<a class="card reveal" href="${o.href}">
        <div class="card__media">${picture(o.image, { sizes: '(max-width:620px) 92vw, 30vw' })}</div>
        <h3>${esc(o.title)}</h3>
        <p>${esc(smart(o.card))}</p>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

${areasSection()}

${ctaBand()}`;

  write(s.href.replace(/^\//, '') + 'index.html', layout({
    title: `${s.title} in Fairfax, VA | ${BIZ.legal}`,
    desc: smart(s.card) + ` Free estimates across Northern Virginia and Washington DC. Call ${BIZ.phone}.`,
    url: s.href,
    current: '/services/',
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
    }],
  }));
}

/* --- Services index ------------------------------------------------------ */
function buildServicesIndex() {
  const groups = [...new Set(SERVICES.map(s => s.group))];
  const body = `${crumbs([{ label: 'Home', href: '/' }, { label: 'Services' }])}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">What we do</p>
    <h1 class="h-display">Masonry and stonework, done properly.</h1>
    <p class="lede">Every job starts underneath — excavation, a compacted base, and a plan for where water goes. What sits on top is the part you see, but the part below it decides how long you get to enjoy it.</p>
  </div>
</section>

${groups.map(g => `<section class="section section--tight">
  <div class="wrap">
    <h2 class="eyebrow">${esc(g)}</h2>
    <div class="grid grid--3" style="margin-top:1.5rem">
${SERVICES.filter(s => s.group === g).map(s => `<a class="card reveal" href="${s.href}">
  <div class="card__media">${picture(s.image, { sizes: '(max-width:620px) 92vw, (max-width:900px) 45vw, 30vw' })}</div>
  <h3>${esc(s.title)}</h3>
  <p>${esc(smart(s.card))}</p>
  <span class="card__more">Learn more</span>
</a>`).join('\n')}
    </div>
  </div>
</section>`).join('\n')}

${areasSection()}
${faqSection(FAQ)}
${ctaBand()}`;

  write('services/index.html', layout({
    title: `Masonry & Stonework Services in Fairfax, VA | ${BIZ.legal}`,
    desc: 'Driveway paving, brickwork, retaining walls, foundation repair, chimney repair, patio design, stone veneer, and outdoor fireplaces across Northern Virginia and Washington DC.',
    url: '/services/',
    current: '/services/',
    body,
  }));
}

/* --- About --------------------------------------------------------------- */
function buildAbout() {
  const body = `${crumbs([{ label: 'Home', href: '/' }, { label: 'About' }])}

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
        <p>Onyx has been serving homeowners in and around Fairfax since ${BIZ.since}. We are family-operated — two brothers and a crew — which means the people who quote your job are the same people on site while it is being built. There is no sales layer between you and the work.</p>
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
      <li class="reveal"><strong>Premium materials, proven technique</strong><span>We use materials that suit the Fairfax climate and methods that have earned their place. Beauty never comes at the expense of long-term performance.</span></li>
      <li class="reveal"><strong>Clean sites and kept timelines</strong><span>We prioritize job site cleanliness and realistic scheduling, so a project in progress does not take over your property.</span></li>
    </ul>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-section reveal">Building stronger homes in Fairfax, VA</h2>
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
    title: `About Onyx Home Improvement | Masonry in Fairfax, VA`,
    desc: `Onyx Home Improvement is a family-operated masonry and stonework contractor serving Fairfax and Northern Virginia since ${BIZ.since}. Meet the team and how we work.`,
    url: '/about-us/',
    current: '/about-us/',
    body,
  }));
}

/* --- Portfolio ----------------------------------------------------------- */
function buildPortfolio() {
  const items = PORTFOLIO.filter(s => IMG[s]).map(slug => `<figure class="reveal">${picture(slug, { sizes: '(max-width:560px) 92vw, (max-width:900px) 45vw, 30vw' })}
  <figcaption>${esc(IMG[slug].alt)}</figcaption>
</figure>`).join('\n');

  const body = `${crumbs([{ label: 'Home', href: '/' }, { label: 'Portfolio' }])}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Recent work</p>
    <h1 class="h-display">Portfolio</h1>
    <p class="lede">Driveways, walkways, patios, steps, and stone walls built across Fairfax County, Northern Virginia, and Washington DC. Every photograph here is our own work.</p>
  </div>
</section>

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
    desc: 'Photographs of completed driveway, walkway, patio, step, and retaining wall projects by Onyx Home Improvement across Fairfax and Northern Virginia.',
    url: '/portfolio/',
    current: '/portfolio/',
    body,
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

  const body = `${crumbs([{ label: 'Home', href: '/' }, { label: 'Reviews' }])}

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
    title: `Reviews | ${BIZ.legal} | ${BIZ.rating}/5 in Fairfax, VA`,
    desc: `${BIZ.reviewCount} five-star customer reviews of Onyx Home Improvement on ${BIZ.ratingSource}, for masonry and stonework across Fairfax and Northern Virginia.`,
    url: '/reviews/',
    current: '/reviews/',
    body,
  }));
}

/* --- Estimate / contact -------------------------------------------------- */
function buildContact() {
  const action = BIZ.formspreeId
    ? `https://formspree.io/f/${BIZ.formspreeId}`
    : '';
  if (!BIZ.formspreeId) {
    warnings.push('BIZ.formspreeId is empty — the estimate form will not submit until you set it in content.mjs. See README.');
  }

  const serviceOptions = SERVICES.map(s => `<option value="${esc(s.title)}">${esc(s.title)}</option>`).join('\n            ');
  const areaOptions = AREAS.map(a => `<option value="${esc(a)}">${esc(a)}</option>`).join('\n            ');

  const body = `${crumbs([{ label: 'Home', href: '/' }, { label: 'Free Estimate' }])}

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
      <form class="form" method="POST"${action ? ` action="${action}"` : ''}>
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
    desc: `Request a free, itemized masonry or stonework estimate from Onyx Home Improvement. Serving Fairfax, Northern Virginia, and Washington DC. Call ${BIZ.phone}.`,
    url: '/get-your-free-estimate/',
    current: '/get-your-free-estimate/',
    body,
  }));

  /* Thank-you page that Formspree redirects to after a successful post. */
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
  const body = `${crumbs([{ label: 'Home', href: '/' }, { label: 'Service Areas' }])}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Where we work</p>
    <h1 class="h-display">Service areas</h1>
    <p class="lede">Onyx is based in Fairfax and works throughout Northern Virginia and Washington DC. Estimates are free everywhere on this list — if you are just outside it, call and ask, because we often can.</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap map-grid">
    <div class="reveal">${AREA_MAP}</div>
    <div>
      <h2 class="h-sub reveal">From Fredericksburg to the District</h2>
      <p class="lede reveal" style="margin-top:1rem">Shaded areas are the counties and independent cities we work in. Vienna and Herndon sit inside Fairfax County, so they are marked with pins rather than their own outline.</p>
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
    desc: `Onyx Home Improvement serves ${AREAS.join(', ')} with masonry, paving, and stonework. Free estimates.`,
    url: '/service-areas/',
    current: '',
    body,
  }));

  /* City stubs at the old WordPress URLs. */
  const slugFor = a => a.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-').replace(/-va$/, '-va').replace(/-dc$/, '-dc');
  for (const a of AREAS) {
    const slug = slugFor(a);
    const city = a.split(',')[0];
    write(`service-areas/${slug}/index.html`, layout({
      title: `Masonry & Stonework in ${a} | ${BIZ.legal}`,
      desc: `Onyx Home Improvement provides driveway paving, patios, walkways, retaining walls, and masonry repair in ${a}. Family-operated since ${BIZ.since}. Free estimates.`,
      url: `/service-areas/${slug}/`,
      current: '',
      body: `${crumbs([
        { label: 'Home', href: '/' },
        { label: 'Service Areas', href: '/service-areas/' },
        { label: a },
      ])}

<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Service area</p>
    <h1 class="h-display" style="max-width:18ch">Masonry &amp; Stonework in ${esc(a)}</h1>
    <p class="lede">Onyx Home Improvement has built driveways, patios, walkways, steps, and stone walls for homeowners in ${esc(city)} since ${BIZ.since}. We are family-operated, based in Fairfax, and estimates here are free.</p>
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

${faqSection(FAQ.slice(0, 4))}
${ctaBand()}`,
    }));
  }
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

/* --- sitemap / robots / misc --------------------------------------------- */
function buildMeta() {
  const urls = [
    ['/', '1.0'],
    ['/services/', '0.9'],
    ...SERVICES.map(s => [s.href, '0.8']),
    ['/portfolio/', '0.7'],
    ['/reviews/', '0.7'],
    ['/about-us/', '0.7'],
    ['/get-your-free-estimate/', '0.9'],
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

  /* Monogram favicon — an "O" cut from an onyx-black square. */
  write('assets/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="10" fill="#14120f"/>
<path d="M32 14c9.94 0 18 8.06 18 18s-8.06 18-18 18-18-8.06-18-18 8.06-18 18-18zm0 7c-6.08 0-11 4.92-11 11s4.92 11 11 11 11-4.92 11-11-4.92-11-11-11z" fill="#f6f4f1"/>
</svg>
`);
}

/* --- run ----------------------------------------------------------------- */
console.log('Building ' + BIZ.legal + '…\n');
buildHome();
buildServicesIndex();
SERVICES.forEach(buildService);
buildAbout();
buildPortfolio();
buildReviews();
buildContact();
buildAreas();
build404();
buildMeta();

console.log(`  ${written} files written`);
if (warnings.length) {
  console.log('\n  ⚠ ' + warnings.length + ' warning(s):');
  warnings.forEach(w => console.log('    · ' + w));
}
console.log('\nDone. Commit and push to publish.');
