/* ==========================================================================
   Regenerates the logo assets and the favicon set from the source artwork in
   assets/logo-src/. Run after replacing a source file:

       node tools/icons.mjs

   Everything it writes is committed, so a normal `node build.mjs` never needs
   this — build.mjs has no image encoder and does not touch these files.
   ========================================================================== */
import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...a) => path.join(ROOT, ...a);

/* --- minimal PNG codec (8-bit RGBA) -------------------------------------- */
function decode(file) {
  const b = fs.readFileSync(file);
  let q = 8, w, h, depth, ctype, idat = [];
  while (q < b.length) {
    const len = b.readUInt32BE(q), type = b.toString('ascii', q + 4, q + 8);
    const data = b.slice(q + 8, q + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; ctype = data[9]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    q += 12 + len;
  }
  const ch = { 2: 3, 6: 4 }[ctype];
  if (!ch || depth !== 8) throw new Error(`${file}: need 8-bit RGB/RGBA`);
  const raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * ch, out = Buffer.alloc(h * stride);
  let r = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[r++], line = raw.slice(r, r + stride); r += stride;
    const cur = out.slice(y * stride, (y + 1) * stride);
    const prev = y ? out.slice((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0, bb = prev[x], c = x >= ch ? prev[x - ch] : 0, v = line[x];
      let o;
      switch (f) {
        case 0: o = v; break;
        case 1: o = v + a; break;
        case 2: o = v + bb; break;
        case 3: o = v + ((a + bb) >> 1); break;
        case 4: {
          const pa = Math.abs(bb - c), pb = Math.abs(a - c), pc = Math.abs(a + bb - 2 * c);
          o = v + ((pa <= pb && pa <= pc) ? a : (pb <= pc ? bb : c)); break;
        }
        default: throw new Error('bad filter ' + f);
      }
      cur[x] = o & 255;
    }
  }
  if (ch === 4) return { w, h, px: out };
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0, j = 0; i < w * h * 3; i += 3, j += 4) {
    rgba[j] = out[i]; rgba[j + 1] = out[i + 1]; rgba[j + 2] = out[i + 2]; rgba[j + 3] = 255;
  }
  return { w, h, px: rgba };
}

const CRC = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = b => { let c = 0xFFFFFFFF; for (const x of b) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };

function encode({ w, h, px }) {
  const stride = w * 4, raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; px.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride); }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const cr = Buffer.alloc(4); cr.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, cr]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* --- geometry ------------------------------------------------------------ */
const bbox = (img, thr = 8) => {
  const { w, h, px } = img; let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (px[(y * w + x) * 4 + 3] > thr) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
};
const crop = (img, { x0, y0, w: cw, h: ch }) => {
  const out = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++) img.px.copy(out, y * cw * 4, ((y0 + y) * img.w + x0) * 4, ((y0 + y) * img.w + x0 + cw) * 4);
  return { w: cw, h: ch, px: out };
};

/* Box downscale over premultiplied alpha. Averaging straight RGB would drag
   the colour of fully transparent pixels into the edges and ring every stroke
   with grey. */
function resize(img, nw) {
  const nh = Math.max(1, Math.round(img.h * nw / img.w));
  const out = Buffer.alloc(nw * nh * 4), sx = img.w / nw, sy = img.h / nh;
  for (let y = 0; y < nh; y++) for (let x = 0; x < nw; x++) {
    const ax0 = Math.floor(x * sx), ax1 = Math.min(img.w, Math.ceil((x + 1) * sx));
    const ay0 = Math.floor(y * sy), ay1 = Math.min(img.h, Math.ceil((y + 1) * sy));
    let r = 0, g = 0, b = 0, a = 0, n = 0;
    for (let yy = ay0; yy < ay1; yy++) for (let xx = ax0; xx < ax1; xx++) {
      const i = (yy * img.w + xx) * 4, al = img.px[i + 3] / 255;
      r += img.px[i] * al; g += img.px[i + 1] * al; b += img.px[i + 2] * al; a += img.px[i + 3]; n++;
    }
    const o = (y * nw + x) * 4, am = a / n;
    out[o + 3] = Math.round(am);
    const un = am > 0 ? 255 / am : 0;
    out[o] = Math.min(255, Math.round(r / n * un));
    out[o + 1] = Math.min(255, Math.round(g / n * un));
    out[o + 2] = Math.min(255, Math.round(b / n * un));
  }
  return { w: nw, h: nh, px: out };
}

const whiten = img => {
  const px = Buffer.from(img.px);
  for (let i = 0; i < img.w * img.h; i++) { px[i * 4] = 255; px[i * 4 + 1] = 255; px[i * 4 + 2] = 255; }
  return { w: img.w, h: img.h, px };
};

const write = (rel, img) => {
  fs.mkdirSync(path.dirname(p(rel)), { recursive: true });
  fs.writeFileSync(p(rel), encode(img));
  console.log('  ' + rel.padEnd(46) + `${img.w}x${img.h}`.padEnd(10) + (fs.statSync(p(rel)).size / 1024).toFixed(1) + ' KB');
};

/* --- icon rasteriser ------------------------------------------------------
   The favicon is the roof mark alone: at 16px the ONYX letterforms and the
   HOME IMPROVEMENTS line are both unreadable, and the roof is the part that
   still reads. Its angle is taken from the source artwork (measured slope
   dx/dy = 1.515), but the stroke is drawn far heavier than the logo's — the
   real one scales to about a quarter of a pixel at 16px and would vanish.
   Drawn onto onyx with a white mark so it holds up on light and dark tab
   bars alike. ------------------------------------------------------------ */
const INK = [0x14, 0x12, 0x0f], PAPER = [0xf6, 0xf4, 0xf1];
const SLOPE = 1.515;

function icon(size, { radius = 0.16, pad = 0.17, stroke = 0.10 } = {}) {
  const S = 4;                       // supersampling factor per axis
  const N = size * S, r = radius * N, half = (stroke * N) / 2;
  const xL = pad * N, xR = N - pad * N, cx = N / 2;
  const dy = (cx - xL) / SLOPE;
  const yB = (N + dy) / 2 + N * 0.02, yA = yB - dy;

  /* Build the stroke outline rather than testing distance-to-segment: a
     distance test gives round caps and a round apex, but the logo's roof is
     mitred with flat ends, and the SVG favicon strokes it that way. Walking
     the offset polygon keeps the raster and the vector identical. */
  const A = [xL, yB], B = [cx, yA], C = [xR, yB];
  const unit = (p, q) => { const dx = q[0] - p[0], dy2 = q[1] - p[1], m = Math.hypot(dx, dy2); return [dx / m, dy2 / m]; };
  const d1 = unit(A, B), d2 = unit(B, C);
  const n1 = [-d1[1], d1[0]], n2 = [-d2[1], d2[0]];
  const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  const miter = h => {
    const p1 = [A[0] + h * n1[0], A[1] + h * n1[1]];
    const p2 = [C[0] + h * n2[0], C[1] + h * n2[1]];
    const t = cross([p2[0] - p1[0], p2[1] - p1[1]], d2) / cross(d1, d2);
    return [p1[0] + t * d1[0], p1[1] + t * d1[1]];
  };
  const poly = [
    [A[0] + half * n1[0], A[1] + half * n1[1]],
    miter(half),
    [C[0] + half * n2[0], C[1] + half * n2[1]],
    [C[0] - half * n2[0], C[1] - half * n2[1]],
    miter(-half),
    [A[0] - half * n1[0], A[1] - half * n1[1]],
  ];
  const inPoly = (x, y) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  const inRounded = (x, y) => {
    const qx = Math.max(r - x, 0, x - (N - r)), qy = Math.max(r - y, 0, y - (N - r));
    return Math.hypot(qx, qy) <= r;
  };

  const acc = new Float64Array(size * size * 2);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const px = x + 0.5, py = y + 0.5;
    if (!inRounded(px, py)) continue;
    const o = ((y / S) | 0) * size + ((x / S) | 0);
    acc[o * 2] += 1;
    if (inPoly(px, py)) acc[o * 2 + 1] += 1;
  }

  const out = Buffer.alloc(size * size * 4), per = S * S;
  for (let i = 0; i < size * size; i++) {
    const cov = acc[i * 2] / per, mark = acc[i * 2 + 1] / per;
    const m = cov > 0 ? Math.min(1, mark / cov) : 0;
    const o = i * 4;
    out[o] = Math.round(INK[0] * (1 - m) + PAPER[0] * m);
    out[o + 1] = Math.round(INK[1] * (1 - m) + PAPER[1] * m);
    out[o + 2] = Math.round(INK[2] * (1 - m) + PAPER[2] * m);
    out[o + 3] = Math.round(cov * 255);
  }
  return { w: size, h: size, px: out };
}

/* --- ICO container -------------------------------------------------------
   ICO entries carry PNG payloads, which every browser back to IE11 reads. */
function ico(images) {
  const pngs = images.map(encode);
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const dir = images.map((img, i) => {
    const e = Buffer.alloc(16);
    e[0] = img.w >= 256 ? 0 : img.w;
    e[1] = img.h >= 256 ? 0 : img.h;
    e[2] = 0; e[3] = 0;
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(pngs[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += pngs[i].length;
    return e;
  });
  return Buffer.concat([head, ...dir, ...pngs]);
}

/* --- run ----------------------------------------------------------------- */
console.log('Regenerating logo + icons…\n');

const black = decode(p('assets/logo-src/Onyx_logo_black.png'));
const bb = bbox(black, 8);

/* Bands in the source artwork: roof 38-445, ONYX 481-752, tagline 798-866. */
const ROOF_TOP = 38, LETTERS_BOTTOM = 752;
const full = crop(black, bb);
const lockup = crop(black, { x0: bb.x0, y0: ROOF_TOP, w: bb.w, h: LETTERS_BOTTOM - ROOF_TOP + 1 });

/* The dark-background logo is the same artwork recoloured, not the supplied
   white PNG. That file stores its glow as RGB luminance over black with the
   alpha channel almost entirely zero, and its artwork sits at a different
   scale (aspect 1.51 against 1.67) — using it would make the logo visibly
   change proportion between the header and the footer. */
console.log('logo:');
write('assets/img/logo/onyx-mark-dark-360.png', resize(lockup, 360));
write('assets/img/logo/onyx-mark-dark-180.png', resize(lockup, 180));
write('assets/img/logo/onyx-mark-light-360.png', resize(whiten(lockup), 360));
write('assets/img/logo/onyx-mark-light-180.png', resize(whiten(lockup), 180));
write('assets/img/logo/onyx-full-dark-720.png', resize(full, 720));
write('assets/img/logo/onyx-full-dark-360.png', resize(full, 360));
write('assets/img/logo/onyx-full-light-720.png', resize(whiten(full), 720));
write('assets/img/logo/onyx-full-light-360.png', resize(whiten(full), 360));

console.log('\nicons:');
write('assets/favicon-16.png', icon(16, { stroke: 0.13 }));
write('assets/favicon-32.png', icon(32, { stroke: 0.11 }));
write('assets/favicon-48.png', icon(48, { stroke: 0.10 }));
write('assets/apple-touch-icon.png', icon(180, { radius: 0, pad: 0.20, stroke: 0.085 }));

fs.writeFileSync(p('assets/favicon.ico'), ico([icon(16, { stroke: 0.13 }), icon(32, { stroke: 0.11 }), icon(48, { stroke: 0.10 })]));
console.log('  assets/favicon.ico'.padEnd(48) + '16/32/48  ' + (fs.statSync(p('assets/favicon.ico')).size / 1024).toFixed(1) + ' KB');

/* Vector favicon, same geometry as the raster ones. */
const N = 64, pad = 0.17 * N, cx = N / 2, xL = pad, xR = N - pad;
const dy = (cx - xL) / SLOPE, yB = (N + dy) / 2 + N * 0.02, yA = yB - dy;
fs.writeFileSync(p('assets/favicon.svg'),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="10" fill="#14120f"/>
<path d="M${xL.toFixed(1)} ${yB.toFixed(1)}L${cx} ${yA.toFixed(1)}L${xR.toFixed(1)} ${yB.toFixed(1)}"
      fill="none" stroke="#f6f4f1" stroke-width="${(0.11 * N).toFixed(1)}"
      stroke-linejoin="miter" stroke-linecap="butt"/>
</svg>
`);
console.log('  assets/favicon.svg'.padEnd(48) + '64x64     ' + (fs.statSync(p('assets/favicon.svg')).size / 1024).toFixed(1) + ' KB');
console.log('\nDone.');
