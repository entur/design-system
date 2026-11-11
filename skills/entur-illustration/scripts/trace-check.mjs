#!/usr/bin/env node
// trace-check — compares a traced illustration with the PNG draft it came
// from, so nothing in the draft is lost and nothing is added on the way.
// macOS, zero dependencies (qlmanage renders the SVG, sips decodes PNGs).
//
//   node trace-check.mjs <draft.png> <traced.svg> [--out <dir>] [--json]
//
// The SVG is the standard-mode export of the trace; its artboard covers the
// whole draft, as illustrator-trace.mjs places it. Reports, in artboard
// units (the SVG's viewBox):
//   missing ink     dark marks in the draft with no ink near them in the trace
//                   (an eye, a nose, a dark wing tip, a line)
//   extra ink       ink in the trace where the draft has none (a stray dot)
//   missing colour  peach, coral, lavender or grey areas the trace lost
//   extra colour    such areas the trace added (a backdrop disc the draft
//                   does not have, coral the draft does not have)
//   paper outside   white fill outside the figures (shows only in dark mode)
// and writes <out>/trace-check.png: the draft, faded, with every finding
// boxed (red missing, blue extra, magenta paper outside) and numbered in
// the report. Exit code 0 either way; "ok" in the JSON says whether
// anything was found.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';

const args = process.argv.slice(2);
const flag = name => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const [draftFile, svgFile] = args.filter(
  (a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--out'),
);
if (!draftFile || !svgFile) {
  console.error(
    'Usage: node trace-check.mjs <draft.png> <traced.svg> [--out <dir>] [--json]',
  );
  process.exit(2);
}
const outDir = opt('out', path.dirname(path.resolve(svgFile)));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'trace-check-'));

// ---- images ---------------------------------------------------------------

function readBmp(file) {
  const b = fs.readFileSync(file);
  const off = b.readUInt32LE(10);
  const w = b.readInt32LE(18);
  const hr = b.readInt32LE(22);
  const B = b.readUInt16LE(28) / 8;
  const h = Math.abs(hr);
  const stride = Math.ceil((w * B) / 4) * 4;
  const rgb = new Uint8Array(w * h * 3);
  for (let y = 0; y < h; y++) {
    const row = hr > 0 ? h - 1 - y : y;
    for (let x = 0; x < w; x++) {
      const p = off + row * stride + x * B;
      const clear = B === 4 && b[p + 3] < 20;
      const q = (y * w + x) * 3;
      rgb[q] = clear ? 255 : b[p + 2];
      rgb[q + 1] = clear ? 255 : b[p + 1];
      rgb[q + 2] = clear ? 255 : b[p];
    }
  }
  return { w, h, rgb };
}

function decode(png, size) {
  const bmp = path.join(tmp, `${path.basename(png)}-${size || 0}.bmp`);
  const resize = size ? ['-z', String(size), String(size)] : [];
  execFileSync('sips', ['-s', 'format', 'bmp', ...resize, png, '--out', bmp], {
    stdio: 'ignore',
  });
  return readBmp(bmp);
}

// The SVG over a plain background colour, rendered at the draft's size.
function renderSvg(svg, size, background) {
  const src = fs.readFileSync(svg, 'utf8');
  const withBg = src.replace(
    /(<svg[^>]*>)/,
    `$1<rect x="-10000" y="-10000" width="20000" height="20000" fill="${background}"/>`,
  );
  const file = path.join(tmp, `render-${background.slice(1)}.svg`);
  fs.writeFileSync(file, withBg);
  execFileSync('qlmanage', ['-t', '-s', String(size), '-o', tmp, file], {
    stdio: 'ignore',
  });
  return decode(`${file}.png`, size);
}

const viewBox = (
  fs.readFileSync(svgFile, 'utf8').match(/viewBox="([^"]+)"/)?.[1] ||
  '0 0 320 320'
)
  .split(/[\s,]+/)
  .map(Number);

// ---- classes ----------------------------------------------------------------

// Standard-mode palette (palette.md). Ink is decided by luminance, as the
// trace does; the rest by the nearest palette colour within a distance.
const COLOURS = {
  peach: [0xff, 0xbf, 0x9e],
  coral: [0xff, 0x59, 0x59],
  lavender: [0xae, 0xb7, 0xe2],
  tint: [0xea, 0xea, 0xf1],
  paper: [0xff, 0xff, 0xff],
};
const INK_LUMINANCE = 110;

function classify(img, { background } = {}) {
  const n = img.w * img.h;
  const ink = new Uint8Array(n);
  const cls = {};
  for (const name of Object.keys(COLOURS)) cls[name] = new Uint8Array(n);
  const bg = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const r = img.rgb[i * 3];
    const g = img.rgb[i * 3 + 1];
    const b = img.rgb[i * 3 + 2];
    if (
      background &&
      Math.abs(r - background[0]) +
        Math.abs(g - background[1]) +
        Math.abs(b - background[2]) <
        60
    ) {
      bg[i] = 1;
      continue;
    }
    if (0.299 * r + 0.587 * g + 0.114 * b < INK_LUMINANCE) {
      ink[i] = 1;
      continue;
    }
    let best = null;
    let bestD = 40;
    for (const [name, c] of Object.entries(COLOURS)) {
      const d = Math.hypot(r - c[0], g - c[1], b - c[2]);
      if (d < bestD) {
        bestD = d;
        best = name;
      }
    }
    if (best) cls[best][i] = 1;
  }
  return { ink, cls, bg };
}

// ---- morphology -------------------------------------------------------------

function distance(src, w, h) {
  const n = w * h;
  const D = new Float32Array(n);
  for (let i = 0; i < n; i++) D[i] = src[i] ? 0 : 1e9;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let v = D[i];
      if (x > 0) v = Math.min(v, D[i - 1] + 3);
      if (y > 0) {
        v = Math.min(v, D[i - w] + 3);
        if (x > 0) v = Math.min(v, D[i - w - 1] + 4);
        if (x < w - 1) v = Math.min(v, D[i - w + 1] + 4);
      }
      D[i] = v;
    }
  for (let y = h - 1; y >= 0; y--)
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      let v = D[i];
      if (x < w - 1) v = Math.min(v, D[i + 1] + 3);
      if (y < h - 1) {
        v = Math.min(v, D[i + w] + 3);
        if (x < w - 1) v = Math.min(v, D[i + w + 1] + 4);
        if (x > 0) v = Math.min(v, D[i + w - 1] + 4);
      }
      D[i] = v;
    }
  for (let i = 0; i < n; i++) D[i] /= 3;
  return D;
}

const near = (mask, w, h, r) => {
  const D = distance(mask, w, h);
  return D.map(v => (v <= r ? 1 : 0));
};

function components(mask, w, h, minArea) {
  const n = w * h;
  const seen = new Uint8Array(n);
  const out = [];
  for (let s = 0; s < n; s++) {
    if (!mask[s] || seen[s]) continue;
    let area = 0;
    let x0 = w;
    let y0 = h;
    let x1 = 0;
    let y1 = 0;
    let sx = 0;
    let sy = 0;
    const stack = [s];
    seen[s] = 1;
    while (stack.length) {
      const i = stack.pop();
      const x = i % w;
      const y = (i / w) | 0;
      area++;
      sx += x;
      sy += y;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      for (const j of [i - 1, i + 1, i - w, i + w])
        if (
          j >= 0 &&
          j < n &&
          mask[j] &&
          !seen[j] &&
          Math.abs((j % w) - x) <= 1
        ) {
          seen[j] = 1;
          stack.push(j);
        }
    }
    if (area >= minArea)
      out.push({ area, box: [x0, y0, x1, y1], centre: [sx / area, sy / area] });
  }
  return out.sort((a, b) => b.area - a.area);
}

// The backdrop disc in the draft, as illustrator-trace.mjs finds it: the
// largest connected area of its pale grey-lavender, if it is a plausible
// disc. Returns { cx, cy, r } in pixels, or null.
function discOf(img) {
  const { w, h, rgb } = img;
  const pale = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const [r, g, b] = [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]];
    const lum = (r * 3 + g * 6 + b) / 10;
    pale[i] = lum >= 212 && lum <= 238 && b >= r && b >= g ? 1 : 0;
  }
  const best = components(pale, w, h, 0)[0];
  if (!best || best.area < 0.03 * w * h) return null;
  const [x0, y0, x1, y1] = best.box;
  const bw = x1 - x0 + 1;
  const bh = y1 - y0 + 1;
  const r = Math.max(bw, bh) / 2;
  const cx = x0 + bw / 2;
  const plausible =
    2 * r >= 0.3 * w &&
    Math.min(bw, bh) >= 0.6 * Math.max(bw, bh) &&
    best.area >= 0.25 * Math.PI * r * r &&
    Math.abs(cx - w / 2) <= 0.2 * w;
  if (!plausible) return null;
  return { cx, cy: bh < 0.95 * bw ? y0 + r : y0 + bh / 2, r };
}

// Silhouette of the figures in the draft: everything the dark lines enclose,
// gaps up to 2·R closed, the white or pale disc around them left out. Inside
// the disc, white is figure (the background there is the disc's grey), so a
// figure drawn with open contours, like the library doves, stays whole.
function silhouette(ink, w, h, R, img) {
  const wall = near(ink, w, h, R);
  const disc = img && discOf(img);
  const white = i =>
    img.rgb[i * 3] > 238 &&
    img.rgb[i * 3 + 1] > 238 &&
    img.rgb[i * 3 + 2] > 238;
  const n = w * h;
  const bg = new Uint8Array(n);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (bg[i] || wall[i]) continue;
    const x = i % w;
    const y = (i - x) / w;
    if (
      disc &&
      (x - disc.cx) ** 2 + (y - disc.cy) ** 2 < (disc.r - 6) ** 2 &&
      white(i)
    )
      continue;
    bg[i] = 1;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (i >= w) stack.push(i - w);
    if (i < n - w) stack.push(i + w);
  }
  const dBg = distance(bg, w, h);
  return dBg.map((v, i) => (!bg[i] && v > R - 1 ? 1 : 0));
}

// ---- compare ----------------------------------------------------------------

const draftImg = decode(draftFile);
const { w, h } = draftImg;
const size = Math.max(w, h);
const traceImg = renderSvg(svgFile, size, '#FFFFFF');
// On magenta at twice the size: a white rim one or two pixels wide blends
// into pink at the draft's size and would go unseen.
const traceOnColour = renderSvg(svgFile, 2 * size, '#FF00FF');
if (traceImg.w !== w || traceImg.h !== h)
  throw new Error(`Render is ${traceImg.w}×${traceImg.h}, draft ${w}×${h}`);

const D = classify(draftImg);
const T = classify(traceImg);
const P2 = classify(traceOnColour, { background: [255, 0, 255] });
// Back to the draft's size: a pixel is paper when any of its four is.
const P = { cls: { paper: new Uint8Array(w * h) }, bg: new Uint8Array(w * h) };
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++) {
    const W2 = traceOnColour.w;
    const k = 2 * y * W2 + 2 * x;
    P.cls.paper[y * w + x] =
      P2.cls.paper[k] ||
      P2.cls.paper[k + 1] ||
      P2.cls.paper[k + W2] ||
      P2.cls.paper[k + W2 + 1]
        ? 1
        : 0;
    // No fill at all: all four show the magenta background.
    P.bg[y * w + x] =
      P2.bg[k] && P2.bg[k + 1] && P2.bg[k + W2] && P2.bg[k + W2 + 1] ? 1 : 0;
  }

const tol = Math.max(3, Math.round(0.004 * w)); // ~1.3 pt at 320: line offsets and widths
const minInk = Math.round((0.0045 * w) ** 2); // a small eye
const minColour = Math.round((0.01 * w) ** 2);
const minPaper = Math.round((0.02 * w) ** 2);
const scale = viewBox[2] / w;

// Labels of the connected areas in a mask (8-neighbours), with their sizes.
function labels(mask) {
  const n = w * h;
  const lab = new Int32Array(n);
  const sizes = [0];
  for (let s = 0; s < n; s++) {
    if (!mask[s] || lab[s]) continue;
    const id = sizes.length;
    let count = 0;
    const stack = [s];
    lab[s] = id;
    while (stack.length) {
      const i = stack.pop();
      count++;
      const x = i % w;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const j = i + dy * w + dx;
          if (xx < 0 || xx >= w || j < 0 || j >= n || !mask[j] || lab[j])
            continue;
          lab[j] = id;
          stack.push(j);
        }
    }
    sizes.push(count);
  }
  return { lab, sizes };
}

// A missing or extra piece counts when it is big, or when it is most of a
// mark of its own (an eye, a stray dot). A small piece cut from the edge of
// a larger mark is the trace rounding a contour, not a lost or added part.
const minMass = Math.round((0.03 * w) ** 2);
function own(c, source) {
  if (!source || c.area >= minMass) return true;
  const [x0, y0, x1, y1] = c.box;
  const seen = {};
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const id = source.lab[y * w + x];
      if (id) seen[id] = (seen[id] || 0) + 1;
    }
  const id = Object.entries(seen).sort((a, b) => b[1] - a[1])[0]?.[0];
  return !id || c.area >= 0.6 * source.sizes[id];
}

const findings = [];
function add(kind, what, mask, minArea, source, skip) {
  for (const c of components(mask, w, h, minArea)) {
    if (!own(c, source)) continue;
    if (skip && skip(c)) continue;
    const [x0, y0, x1, y1] = c.box;
    const bw = x1 - x0 + 1;
    const bh = y1 - y0 + 1;
    let shape = '';
    if (what === 'ink') {
      const thick = c.area / Math.max(bw, bh);
      shape =
        Math.max(bw, bh) / Math.min(bw, bh) <= 1.6 && c.area >= 0.5 * bw * bh
          ? c.area < (0.015 * w) ** 2
            ? 'dot'
            : 'mass'
          : thick > 0.012 * w
          ? 'mass'
          : 'line';
    }
    findings.push({
      kind,
      what,
      shape,
      area_px: c.area,
      at: c.centre.map(v => +(v * scale + viewBox[0]).toFixed(1)),
      box: [x0, y0, x1, y1].map(v => +(v * scale).toFixed(1)),
      box_px: c.box,
    });
  }
}

const nearTraceInk = near(T.ink, w, h, tol);
const nearDraftInk = near(D.ink, w, h, tol);
add(
  'missing',
  'ink',
  D.ink.map((v, i) => v && !nearTraceInk[i]),
  minInk,
  labels(D.ink),
);
add(
  'extra',
  'ink',
  T.ink.map((v, i) => v && !nearDraftInk[i]),
  minInk,
  labels(T.ink),
);

for (const colour of ['peach', 'coral', 'lavender', 'tint']) {
  const min = colour === 'tint' ? minPaper : minColour;
  const nearT = near(T.cls[colour], w, h, tol);
  const nearD = near(D.cls[colour], w, h, tol);
  add(
    'missing',
    colour,
    D.cls[colour].map((v, i) => v && !nearT[i]),
    min,
  );
  add(
    'extra',
    colour,
    T.cls[colour].map((v, i) => v && !nearD[i]),
    min,
  );
}

// White fill where the draft has background: invisible on white, a white
// shape on the dark surface. Paper may fill a figure up to about the middle
// of its lines — inside the silhouette, at least a few pixels from any ink
// (so a narrow leg between two lines still counts), and from there just
// past the line's middle. White farther out is a rim along the outside of a
// line, or a double line along an open one (a cloud), or a shape beside the
// figures.
// The ground line in the draft: the lowest row where one dark run spans a
// quarter of the width. The space between legs closes against it and stays
// open on purpose; only paper missing below the line (an egg) counts there.
const groundTop = (() => {
  // Longest dark run in a row, gaps up to 2 % of the width bridged.
  const longest = y => {
    let best = 0;
    let start = -1;
    let last = -w;
    for (let x = 0; x < w; x++) {
      if (!D.ink[y * w + x]) continue;
      if (x - last > 0.02 * w) start = x;
      last = x;
      best = Math.max(best, x - start + 1);
    }
    return best;
  };
  for (let y = h - 1; y >= 0; y--) {
    if (longest(y) <= 0.25 * w) continue;
    let top = y;
    while (top > 0 && longest(top - 1) > 0.25 * w) top--;
    return top;
  }
  return -1;
})();
const silR = Math.round(0.008 * w);
const sil = silhouette(D.ink, w, h, silR, draftImg);
const edge = Math.max(2, Math.round(0.003 * w));
const nearInk = near(D.ink, w, h, edge);
// A body the trace continued past the disc's edge (a fluffy outline the
// draft's silhouette leaks through) is figure too: white in the draft and
// inside the finished lines, closed by 1.6 % of the width as the trace does.
const tracedWide = silhouette(T.ink, w, h, Math.round(0.016 * w));
const interior = sil.map((v, i) =>
  (v || (tracedWide[i] && D.cls.paper[i])) && !nearInk[i] ? 1 : 0,
);
const allowedNear = near(interior, w, h, edge + Math.round(0.004 * w) + 1);
// The ground line runs behind the body: paper covering it where a body
// stands on it (the band of the line, under a column the figure reaches)
// is meant to be there.
const allowed = allowedNear.slice();
if (groundTop >= 0) {
  const foot = Math.min(h - 1, groundTop + Math.round(0.012 * h));
  for (let x = 0; x < w; x++) {
    let stands = false;
    for (
      let y = Math.max(0, groundTop - Math.round(0.01 * h));
      y < groundTop;
      y++
    )
      if (allowedNear[y * w + x]) stands = true;
    if (stands) for (let y = groundTop; y <= foot; y++) allowed[y * w + x] = 1;
  }
}
const figures = near(
  sil.map((v, i) => (v || (tracedWide[i] && D.cls.paper[i]) ? 1 : 0)),
  w,
  h,
  2 * tol,
);
add(
  'extra',
  'paper outside the figures',
  P.cls.paper.map((v, i) => v && !figures[i]),
  minPaper,
);
add(
  'extra',
  'paper along the outside of a line',
  P.cls.paper.map((v, i) => v && figures[i] && !allowed[i]),
  Math.round((0.008 * w) ** 2),
);

// Paper missing inside a figure: white in the draft, inside closed lines in
// both the draft and the trace (an open cloud is no figure), and no fill in
// the trace — the bottom of an egg below the ground line, a body the
// underlay missed. It shows as the dark surface inside an outline.
const traceInterior = (() => {
  const t = silhouette(T.ink, w, h, silR);
  const nearT = near(T.ink, w, h, edge);
  return t.map((v, i) => (v && !nearT[i] ? 1 : 0));
})();

add(
  'missing',
  'paper inside a figure',
  D.cls.paper.map((v, i) => v && interior[i] && traceInterior[i] && P.bg[i]),
  Math.round((0.01 * w) ** 2),
  null,
  c =>
    groundTop >= 0 &&
    c.box[3] <= groundTop + 2 &&
    c.box[3] >= groundTop - 0.02 * h,
);

// Paper that stops at the disc's edge: inside the circle the trace has paper,
// just outside it has none, and the draft is white on both sides — a white
// body the circle cut (a Samoyed with no paper below the disc). Reported when
// such a cut runs for 5 % of the width or more.
const circle = discOf(draftImg);
if (circle) {
  const at = (r, a) => {
    const x = Math.round(circle.cx + r * Math.cos(a));
    const y = Math.round(circle.cy + r * Math.sin(a));
    return x >= 0 && y >= 0 && x < w && y < h ? y * w + x : -1;
  };
  const steps = Math.round(2 * Math.PI * circle.r);
  const cut = [];
  for (let s = 0; s < steps; s++) {
    const a = (2 * Math.PI * s) / steps;
    const inner = at(circle.r - 0.02 * w, a);
    const outer = at(circle.r + 0.004 * w, a);
    cut.push(
      inner >= 0 &&
        outer >= 0 &&
        P.cls.paper[inner] &&
        P.bg[outer] &&
        D.cls.paper[inner] &&
        D.cls.paper[outer],
    );
  }
  for (let s = 0; s < steps; s++) {
    if (!cut[s] || cut[(s - 1 + steps) % steps]) continue;
    let e = s;
    while (cut[(e + 1) % steps] && e - s < steps) e++;
    if (e - s + 1 < 0.05 * w) continue;
    const xs = [];
    const ys = [];
    for (let k = s; k <= e; k++) {
      const a = (2 * Math.PI * (k % steps)) / steps;
      xs.push(circle.cx + circle.r * Math.cos(a));
      ys.push(circle.cy + circle.r * Math.sin(a));
    }
    const box = [
      Math.min(...xs),
      Math.min(...ys),
      Math.max(...xs),
      Math.max(...ys),
    ].map(Math.round);
    findings.push({
      kind: 'missing',
      what: 'paper beyond the edge of the circle',
      shape: '',
      area_px: e - s + 1,
      at: [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2].map(
        v => +(v * scale).toFixed(1),
      ),
      box: box.map(v => +(v * scale).toFixed(1)),
      box_px: box,
    });
  }
}

findings.forEach((f, i) => (f.n = i + 1));

// ---- picture ----------------------------------------------------------------

const COLOUR = {
  missing: [220, 30, 30],
  extra: [20, 90, 230],
  paper: [210, 0, 210],
};
const pic = new Uint8Array(w * h * 3);
for (let i = 0; i < w * h; i++)
  for (let k = 0; k < 3; k++)
    pic[i * 3 + k] = 255 - (255 - draftImg.rgb[i * 3 + k]) * 0.35;
function rect([x0, y0, x1, y1], c, pad = 4) {
  x0 = Math.max(0, x0 - pad);
  y0 = Math.max(0, y0 - pad);
  x1 = Math.min(w - 1, x1 + pad);
  y1 = Math.min(h - 1, y1 + pad);
  for (let t = 0; t < 3; t++)
    for (let x = x0; x <= x1; x++)
      for (const y of [y0 + t, y1 - t])
        if (y >= 0 && y < h) pic.set(c, (y * w + x) * 3);
  for (let t = 0; t < 3; t++)
    for (let y = y0; y <= y1; y++)
      for (const x of [x0 + t, x1 - t])
        if (x >= 0 && x < w) pic.set(c, (y * w + x) * 3);
}
// Number tags in a 3×5 pixel font, scaled, so the picture and the report
// line up.
const DIGITS = [
  '111101101101111',
  '010110010010111',
  '111001111100111',
  '111001111001111',
  '101101111001001',
  '111100111001111',
  '111100111101111',
  '111001001001001',
  '111101111101111',
  '111101111001111',
];
function tag(n, x, y, c) {
  const s = Math.max(3, Math.round(w / 256));
  const text = String(n);
  const top = Math.max(0, y - 6 * s);
  // a white plate behind the digits
  for (let py = top - s; py < top + 6 * s; py++)
    for (let px = x - s; px < x + text.length * 4 * s; px++)
      if (px >= 0 && px < w && py >= 0 && py < h)
        pic.set([255, 255, 255], (py * w + px) * 3);
  [...text].forEach((d, k) => {
    const bits = DIGITS[Number(d)];
    for (let r = 0; r < 5; r++)
      for (let col = 0; col < 3; col++)
        if (bits[r * 3 + col] === '1')
          for (let dy = 0; dy < s; dy++)
            for (let dx = 0; dx < s; dx++) {
              const px = x + k * 4 * s + col * s + dx;
              const py = top + r * s + dy;
              if (px >= 0 && px < w && py >= 0 && py < h)
                pic.set(c, (py * w + px) * 3);
            }
  });
}
for (const f of findings) {
  const c = f.what.startsWith('paper') ? COLOUR.paper : COLOUR[f.kind];
  rect(f.box_px, c);
  tag(f.n, Math.max(0, f.box_px[0] - 4), Math.max(10, f.box_px[1] - 4), c);
}
// zlib.crc32 needs Node 22; the skill's scripts run on Node 18.
function crc32(bytes) {
  let c = 0xffffffff;
  for (const byte of bytes) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}
function writePng(file, rgb) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++)
    Buffer.from(rgb.buffer, y * w * 3, w * 3).copy(raw, y * (w * 3 + 1) + 1);
  const chunk = (t, d) => {
    const l = Buffer.alloc(4);
    l.writeUInt32BE(d.length);
    const td = Buffer.concat([Buffer.from(t), d]);
    const c = Buffer.alloc(4);
    c.writeUInt32BE(crc32(td));
    return Buffer.concat([l, td, c]);
  };
  const ih = Buffer.alloc(13);
  ih.writeUInt32BE(w, 0);
  ih.writeUInt32BE(h, 4);
  ih[8] = 8;
  ih[9] = 2;
  fs.writeFileSync(
    file,
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk('IHDR', ih),
      chunk('IDAT', zlib.deflateSync(raw)),
      chunk('IEND', Buffer.alloc(0)),
    ]),
  );
}
fs.mkdirSync(outDir, { recursive: true });
const picture = path.join(outDir, 'trace-check.png');
writePng(picture, pic);
fs.rmSync(tmp, { recursive: true, force: true });

const report = {
  ok: findings.length === 0,
  draft: path.resolve(draftFile),
  svg: path.resolve(svgFile),
  picture,
  units: `viewBox ${viewBox.join(' ')}`,
  thresholds_px: {
    tolerance: tol,
    ink: minInk,
    colour: minColour,
    paper: minPaper,
  },
  findings: findings.map(({ box_px, ...f }) => f),
};
fs.writeFileSync(
  path.join(outDir, 'trace-check.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);
if (flag('json')) console.log(JSON.stringify(report));
else {
  console.log(
    report.ok
      ? 'trace-check: nothing lost or added'
      : `trace-check: ${findings.length} finding${
          findings.length > 1 ? 's' : ''
        }`,
  );
  for (const f of report.findings)
    console.log(
      `  ${f.n}. ${f.kind} ${f.what}${
        f.shape ? ` (${f.shape})` : ''
      } at ${f.at.join(', ')}, ${f.area_px} px`,
    );
  console.log(`  picture: ${picture}`);
}
