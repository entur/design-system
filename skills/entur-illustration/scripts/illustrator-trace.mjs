// illustrator-trace — turns a PNG draft into Entur Linje vector strokes in
// Adobe Illustrator, driven from the command line through AppleScript
// `do javascript`. No plugin needed. macOS only.
//
//   node illustrator-trace.mjs <draft.png> [--out dir] [--name Name]
//     [--app "/Applications/Adobe Illustrator 2026/Adobe Illustrator.app"]
//     [--size 360] [--threshold 110] [--max-stroke 20] [--contour 1.5] [--detail 1.0]
//     [--contour-share 0.25] [--min-ink-width 4] [--roughen] [--fill-rough] [--ink-shift]
//     [--construction animals] [--carriers profiles.ai] [--backdrop] [--underlay]
//     [--no-features] [--no-simplify]
//
// Two traces of the same PNG on a `--size` pt artboard (360 puts a figure at
// library scale):
//   lines  black-and-white trace, strokes only, abutting: every line a live
//          stroke with round caps and joins, in ink. The thickest share
//          (`--contour-share`) gets the contour weight, the rest the detail
//          weight; by traced width, or by length when widths are all alike.
//   colour colour trace, abutting, smoothed: every area snapped to the exact
//          palette colour; wide ink areas kept, thin line-like ink dropped,
//          enclosed white kept as paper, the white background removed;
//          colour (not ink) shifted 0.6 pt right and 0.3 pt down; fill
//          edges stay smooth, as in the reference drawings.
// With `--construction animals` (animals and objects) the artboard is 320 pt
// and the weights 2.1 / 1.7; `--carriers` gives every line a live width
// profile copied from the strokes named swell and point in that .ai (short
// lines get point), and `--backdrop` replaces the traced disc with the
// library's: a 4-anchor circle with Roughen 0.65 % on a Circle layer,
// measured in the draft's pixels. `--underlay` adds paper under each figure,
// like the library animals' underlays: without it, white areas the colour
// trace cannot tell from the background (a tail past the disc) stay unfilled.
// With animals, a small dark eye or nose, too thin for the colour trace and
// too round for the line trace, is put back as an ink ellipse on a Features
// layer (`--no-features` turns it off); none is taken from the ground band.
// Animals are also simplified before the weights go on: specks dropped, a
// contour broken into pieces joined end to end, the ground replaced by one
// plain line on a Ground layer under the fills, and short fur marks thinned
// where they lie along a contour or crowd each other (`--no-simplify` turns
// it off).
// The draft already carries the hand tremor, so Roughen is only added with
// `--roughen`. Saved as <Name>.ai and <Name>.svg, plus -darkmode and
// -contrast SVGs by palette mapping (every white becomes paper; the Circle
// layer gets the backdrop colours).
//
// ExtendScript is ES3 (no Array.map), and `name` and `cut` are read-only
// globals in Illustrator: assigning to them fails silently.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import zlib from 'node:zlib';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args.splice(i, 2)[1] : fallback;
};
const flag = name => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? (args.splice(i, 1), true) : false;
};

const app = opt(
  'app',
  '/Applications/Adobe Illustrator 2026/Adobe Illustrator.app',
);
const outDir = path.resolve(opt('out', '.'));
const animals = opt('construction', 'people') === 'animals';
const threshold = Number(opt('threshold', 110));
const maxStroke = Number(opt('max-stroke', 20));
const contour = Number(opt('contour', animals ? 2.1 : 1.5));
const detail = Number(opt('detail', animals ? 1.7 : 1.0));
const carriers = opt('carriers', '');
const backdrop = flag('backdrop');
const underlay = flag('underlay');
const features = animals && !flag('no-features');
const simplify = animals && !flag('no-simplify');
// A traced draft already carries the hand tremor; Roughen on top makes it bumpy.
const roughen = flag('roughen');
flag('no-roughen');
const [pngArg] = args;
if (!pngArg || !fs.existsSync(pngArg)) {
  console.error(
    'Usage: node illustrator-trace.mjs <draft.png> [--out dir] [--name Name] [options]',
  );
  process.exit(1);
}
const png = path.resolve(pngArg);
const name = opt('name', path.basename(png, path.extname(png)));
fs.mkdirSync(outDir, { recursive: true });

// Standard-mode palette, and how each colour maps per mode (palette.md).
const PALETTE = {
  ink: ['#181C56', '#5E5F6C', '#626493'],
  paper: ['#FFFFFF', '#F2F2F5', '#FFFFFF'],
  line2: ['#9EA0BD', '#999AA7', '#9EA0BD'],
  tint: ['#EAEAF1', '#B3B4BD', '#BCBDD2'],
  lavender: ['#AEB7E2', '#AEB7E2', '#AEB7E2'],
  peach: ['#FFBF9E', '#FFBF9E', '#FFBF9E'],
  coral: ['#FF5959', '#FF9494', '#FF5959'],
};

const params = {
  png: png,
  ai: path.join(outDir, `${name}.ai`),
  svg: path.join(outDir, `${name}.svg`),
  threshold,
  maxStroke,
  contour,
  detail,
  roughen,
  minInkWidth: Number(opt('min-ink-width', 4)),
  size: Number(opt('size', animals ? 320 : 360)),
  carriers: carriers ? path.resolve(carriers) : '',
  pointLength: 12,
  backdrop,
  simplify,
  mask: '',
  contourShare: Number(opt('contour-share', 0.25)),
  shift: [0.6, -0.3],
  fillRough: flag('fill-rough'),
  inkShift: flag('ink-shift'),
  palette: Object.fromEntries(
    Object.entries(PALETTE).map(([k, [hex]]) => [k, hexToRgb(hex)]),
  ),
};

// Read the draft once: the disc, the ground line and the silhouette come from
// its pixels, which see them more reliably than the traced shapes do.
const img = readPng(png);
const disc = findDisc(img);
const groundBand = animals ? findGround(img) : null;
const mask = underlay ? writeMask(img, disc, groundBand) : null;
const toX = v => (v * params.size) / img.w;
const toY = v => (v * params.size) / img.h;
params.mask = mask || '';
params.disc = disc
  ? { cx: toX(disc.cx), cy: toY(disc.cy), r: toX(disc.r) }
  : null;
params.ground = groundBand
  ? {
      top: toY(groundBand.top),
      y: toY((groundBand.top + groundBand.bottom + 1) / 2),
      x0: toX(groundBand.x0),
      x1: toX(groundBand.x1 + 1),
    }
  : null;
params.features = features ? darkFeatures(img, params.size, groundBand) : [];

const jsx = `
var P = ${JSON.stringify(params)};
function q(s) { return '"' + String(s).replace(/\\\\/g, '\\\\\\\\').replace(/"/g, '\\\\"') + '"'; }
function rgb(c) { var r = new RGBColor(); r.red = c[0]; r.green = c[1]; r.blue = c[2]; return r; }
function nearest(col) {
  var best = null, bd = 1e9;
  for (var k in P.palette) {
    var p = P.palette[k];
    var d = Math.pow(col.red - p[0], 2) + Math.pow(col.green - p[1], 2) + Math.pow(col.blue - p[2], 2);
    if (d < bd) { bd = d; best = k; }
  }
  return best;
}
function paths(item, out) {
  if (item.typename === 'PathItem') out.push(item);
  else if (item.typename === 'CompoundPathItem') { for (var i = 0; i < item.pathItems.length; i++) out.push(item.pathItems[i]); }
  else if (item.typename === 'GroupItem') { for (var j = 0; j < item.pageItems.length; j++) paths(item.pageItems[j], out); }
  return out;
}
function placeAndTrace(doc, layer) {
  var r = doc.artboards[0].artboardRect;
  var placed = layer.placedItems.add();
  placed.file = new File(P.png);
  placed.width = r[2] - r[0];
  placed.height = r[1] - r[3];
  placed.position = [r[0], r[1]];
  return placed.trace();
}
var log = [];
var doc = app.documents.add(DocumentColorSpace.RGB, P.size, P.size);
var colourLayer = doc.layers[0]; colourLayer.name = 'Fill';
var lineLayer = doc.layers.add(); lineLayer.name = 'Outline';

// Colour trace, underneath.
var ct = placeAndTrace(doc, colourLayer);
var co = ct.tracing.tracingOptions;
co.tracingMode = TracingModeType.TRACINGMODECOLOR;
try { co.tracingColorTypeValue = TracingColorType.TRACINGLIMITEDCOLOR; } catch (e) {}
try { co.maxColors = 8; } catch (e) {}
try { co.colorFidelity = 20; } catch (e) {}
// Keep white: enclosed white areas are paper fills (they turn light grey in
// dark mode); only the white background touching the artboard edge is removed.
co.fills = true; co.strokes = false; co.ignoreWhite = false;
try { co.tracingMethod = TracingMethodType.TRACINGMETHODABUTTING; } catch (e) {}
co.pathFidelity = 30; co.cornerFidelity = 50; co.noiseFidelity = 70;
app.redraw();
var cg = ct.tracing.expandTracing();
var cp = paths(cg, []), kept = 0, dropped = 0, inkAreas = 0;
var ab = doc.artboards[0].artboardRect;
function touchesEdge(item) {
  var b = item.geometricBounds;
  return b[0] <= ab[0] + 1 || b[1] >= ab[1] - 1 || b[2] >= ab[2] - 1 || b[3] <= ab[3] + 1;
}
for (var i = cp.length - 1; i >= 0; i--) {
  var it = cp[i];
  if (!it.filled) { continue; }
  var k = nearest(it.fillColor);
  if (k === 'paper' && !touchesEdge(it)) { it.fillColor = rgb(P.palette.paper); it.stroked = false; kept++; continue; }
  // Ink areas: keep the wide ones (uniform, hair, shoes) as fills; drop the
  // thin, line-like ones, which the stroke trace draws. Mean width ≈ 2·area/perimeter.
  var wide = k === 'ink' && it.length > 0 && (2 * Math.abs(it.area)) / it.length > P.minInkWidth;
  if (k === 'paper' || (k === 'ink' && !wide)) { it.remove(); dropped++; continue; }
  if (k === 'ink') inkAreas++;
  it.fillColor = rgb(P.palette[k]); it.stroked = false; kept++;
  // Print misregistration: colour shifts off its line; ink areas stay put.
  if (k !== 'ink') it.translate(P.shift[0], P.shift[1]);
}
log.push('colour areas kept ' + kept + ' (ink ' + inkAreas + '), dropped ' + dropped);

// Line trace, on top: strokes only. Lines touch the wide ink areas, so a
// fills trace would merge them into one filled region; the wide areas come
// from the colour trace instead.
var lt = placeAndTrace(doc, lineLayer);
var lo = lt.tracing.tracingOptions;
lo.tracingMode = TracingModeType.TRACINGMODEBLACKANDWHITE;
lo.threshold = P.threshold;
lo.fills = false; lo.strokes = true; lo.maxStrokeWeight = P.maxStroke;
lo.ignoreWhite = true;
try { lo.tracingMethod = TracingMethodType.TRACINGMETHODABUTTING; } catch (e) {}
lo.pathFidelity = 55; lo.cornerFidelity = 60; lo.noiseFidelity = 30;
app.redraw();
var lg = lt.tracing.expandTracing();
var lp = paths(lg, []), strokes = 0, fills = 0;

// Simplify (animals): library animals are minimal, and drafts come back with
// more line than they have. Drop specks, join a contour broken into pieces
// end to end, and thin short fur marks: a mark lying along a contour, or one
// crowding another, goes. Marks near an eye or a nose stay (a mouth, an ear).
// Toes, grass and ground (the band just above the lowest line) stay too;
// ground dashes join into one to three long pieces at detail weight, as the
// library draws ground. Grass is left to the review: to the trace a blade
// and a toe look alike.
// Helpers for the simplify step (global: ExtendScript and function
// declarations inside blocks do not mix well).
function dist(a, b) { return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2)); }
function readPts(pi) { var a = []; for (var i = 0; i < pi.pathPoints.length; i++) { var pp = pi.pathPoints[i]; a.push({ a: pp.anchor, l: pp.leftDirection, r: pp.rightDirection, t: pp.pointType }); } return a; }
function reversed(a) { var b = []; for (var i = a.length - 1; i >= 0; i--) b.push({ a: a[i].a, l: a[i].r, r: a[i].l, t: a[i].t }); return b; }
function writePts(pi, a) { var an = []; for (var i = 0; i < a.length; i++) an.push(a[i].a); pi.setEntirePath(an); for (var j = 0; j < a.length; j++) { var pp = pi.pathPoints[j]; pp.leftDirection = a[j].l; pp.rightDirection = a[j].r; pp.pointType = a[j].t; } }
// Unit direction leaving a path at its first (end 0) or last (end 1) anchor.
function outDir(a, end) {
  var n = a.length - 1, p = end ? a[n].a : a[0].a, h = end ? a[n].l : a[0].r;
  if (dist(p, h) < 0.3) h = end ? a[n - 1].a : a[1].a;
  var L = dist(p, h) || 1; return [(p[0] - h[0]) / L, (p[1] - h[1]) / L];
}
function bez(p0, p1, p2, p3, t) { var u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]; }
function samples(a) { var s = [a[0].a]; for (var i = 0; i < a.length - 1; i++) for (var k = 1; k <= 6; k++) s.push(bez(a[i].a, a[i].r, a[i + 1].l, a[i + 1].a, k / 6)); return s; }
function toLine(q, s) {
  var best = 1e9;
  for (var i = 0; i < s.length - 1; i++) {
    var dx = s[i + 1][0] - s[i][0], dy = s[i + 1][1] - s[i][1], L2 = dx * dx + dy * dy;
    var t = L2 ? Math.max(0, Math.min(1, ((q[0] - s[i][0]) * dx + (q[1] - s[i][1]) * dy) / L2)) : 0;
    best = Math.min(best, dist(q, [s[i][0] + t * dx, s[i][1] + t * dy]));
  }
  return best;
}
if (P.simplify) {
  var sc = P.size / 320, specks = 0, joined = 0, ground = 0, thinned = 0;
  var items = [];
  for (var s0 = 0; s0 < lp.length; s0++) {
    var sp = lp[s0];
    if (!sp.stroked) continue;
    if (Number(sp.length) < 3 * sc) { sp.remove(); specks++; continue; }
    items.push({ it: sp, pts: readPts(sp) });
  }
  // Ground marks: flat lines in the band at the ground line (found in the
  // draft's pixels, else the lowest line) — dashes and short grass. They join
  // only each other, into pieces up to half the width.
  var floor = 1e9;
  for (var g0 = 0; g0 < items.length; g0++) floor = Math.min(floor, items[g0].it.geometricBounds[3]);
  var above = 6;
  if (P.ground) { floor = ab[1] - P.ground.top - 2 * sc; above = 8; }
  for (var g1 = 0; g1 < items.length; g1++) { var gb0 = items[g1].it.geometricBounds; items[g1].ground = gb0[1] < floor + above * sc && gb0[3] > floor - 10 * sc; }
  // Join: an end within 4 pt of another end, the line running on within 45°.
  var cosMax = Math.cos(Math.PI / 4), gapMax = 4 * sc;
  for (var guard = 0; guard < 300; guard++) {
    var best = null;
    for (var i1 = 0; i1 < items.length; i1++) {
      if (items[i1].it.closed) continue;
      for (var i2 = i1 + 1; i2 < items.length; i2++) {
        if (items[i2].it.closed || items[i1].ground !== items[i2].ground) continue;
        if (items[i1].ground) {
          var gb1 = items[i1].it.geometricBounds, gb2 = items[i2].it.geometricBounds;
          if (Math.max(gb1[2], gb2[2]) - Math.min(gb1[0], gb2[0]) > 0.5 * P.size) continue;
        }
        for (var e1 = 0; e1 < 2; e1++) for (var e2 = 0; e2 < 2; e2++) {
          var A = items[i1].pts, B = items[i2].pts;
          var pa = e1 ? A[A.length - 1].a : A[0].a, pb = e2 ? B[B.length - 1].a : B[0].a, gap = dist(pa, pb);
          if (gap > gapMax || (best && gap >= best.gap)) continue;
          var da = outDir(A, e1), db = outDir(B, e2);
          if (-(da[0] * db[0] + da[1] * db[1]) < cosMax) continue;
          if (gap > 1 && ((pb[0] - pa[0]) * da[0] + (pb[1] - pa[1]) * da[1]) / gap < 0.3) continue;
          best = { gap: gap, i1: i1, i2: i2, e1: e1, e2: e2 };
        }
      }
    }
    if (!best) break;
    var ia = items[best.i1], ib = items[best.i2];
    var head = best.e1 ? ia.pts : reversed(ia.pts), tail = best.e2 ? reversed(ib.pts) : ib.pts;
    if (best.gap < 0.5) { head[head.length - 1].r = tail[0].r; tail = tail.slice(1); }
    var merged = head.concat(tail);
    writePts(ia.it, merged); ia.pts = merged;
    ib.it.remove(); items.splice(best.i2, 1); joined++;
    if (ia.ground) ground++;
  }
  // Thin fur marks.
  var lens = [], groundY = 1e9;
  for (var t0 = 0; t0 < items.length; t0++) { lens.push(Number(items[t0].it.length)); groundY = Math.min(groundY, items[t0].it.geometricBounds[3]); }
  var longCut = quantile(lens, 0.75), contours = [], eyes = [];
  for (var t1 = 0; t1 < items.length; t1++) if (lens[t1] >= longCut) contours.push({ it: items[t1].it, s: samples(items[t1].pts) });
  for (var t2 = 0; t2 < P.features.length; t2++) eyes.push([ab[0] + P.features[t2].cx, ab[1] - P.features[t2].cy]);
  items.sort(function (x, y) { return Number(y.it.length) - Number(x.it.length); });
  var marks = [];
  for (var t3 = 0; t3 < items.length; t3++) {
    var ti = items[t3].it, tb = ti.geometricBounds, tl = Number(ti.length);
    if (tl >= 20 * sc || tb[3] < groundY + 16 * sc) continue;
    var mid = [(tb[0] + tb[2]) / 2, (tb[1] + tb[3]) / 2], guarded = false;
    for (var t4 = 0; t4 < eyes.length; t4++) if (dist(mid, eyes[t4]) < 20 * sc) guarded = true;
    if (guarded) continue;
    var tp = items[t3].pts, f0 = 1e9, f1 = 1e9;
    for (var t5 = 0; t5 < contours.length; t5++) {
      if (contours[t5].it === ti) continue;
      f0 = Math.min(f0, toLine(tp[0].a, contours[t5].s)); f1 = Math.min(f1, toLine(tp[tp.length - 1].a, contours[t5].s));
    }
    var crowded = false;
    for (var t6 = 0; t6 < marks.length; t6++) if (dist(mid, marks[t6]) < 20 * sc) crowded = true;
    if ((f0 < 4 * sc && f1 < 4 * sc) || crowded) { ti.remove(); items[t3].gone = true; thinned++; } else marks.push(mid);
  }
  // One plain ground line, as under the library animals: the traced dashes
  // and short grass marks go, and one line at detail weight with the line
  // Roughen takes their place, on a Ground layer under the fills, so the
  // figures hide it where they stand. A short mark touching a line above it
  // (a leg) is a foot and stays. Taller grass is left to the review.
  var plain = 0;
  if (P.ground) {
    var others = [];
    for (var p0 = 0; p0 < items.length; p0++) if (!items[p0].ground && !items[p0].gone) others.push(samples(items[p0].pts));
    for (var p1 = 0; p1 < items.length; p1++) {
      var pg = items[p1];
      if (!pg.ground || pg.gone) continue;
      var foot = false, pe = [pg.pts[0].a, pg.pts[pg.pts.length - 1].a];
      if (Number(pg.it.length) < 12 * sc) for (var p2 = 0; p2 < others.length && !foot; p2++) for (var p3 = 0; p3 < 2; p3++) if (toLine(pe[p3], others[p2]) < 2.5 * sc) foot = true;
      if (!foot) { pg.it.remove(); pg.gone = true; plain++; }
    }
    var groundLayer = doc.layers.add(); groundLayer.name = 'Ground';
    groundLayer.move(fillLayerOf(doc), ElementPlacement.PLACEAFTER);
    var gl = groundLayer.pathItems.add(), gy = ab[1] - P.ground.y;
    gl.setEntirePath([[ab[0] + P.ground.x0, gy], [ab[0] + P.ground.x1, gy]]);
    gl.filled = false; gl.stroked = true; gl.strokeColor = rgb(P.palette.ink); gl.strokeWidth = P.detail;
    gl.strokeCap = StrokeCap.ROUNDENDCAP; gl.strokeJoin = StrokeJoin.ROUNDENDJOIN;
    try { gl.applyEffect('<LiveEffect name="Adobe Roughen"><Dict data="R size 0.2 R asiz 0.2 R absoluteness 0 R dtal 63 R roundness 1 "/></LiveEffect>'); } catch (e) {}
  }
  // Ground marks left (feet, or all of them without a found ground line) at
  // detail weight: the ground is never the heaviest line in the drawing.
  var groundLines = [];
  for (var g8 = 0; g8 < items.length; g8++) if (items[g8].ground && !items[g8].gone) groundLines.push(items[g8].it);
  lp = paths(lg, []);
  log.push('simplified: specks ' + specks + ', joined ' + (joined - ground) + ' (ground ' + ground + '), fur marks thinned ' + thinned + (P.ground ? ', ground marks replaced by one line ' + plain : ''));
}
// Contour or detail: by relative traced width when the draft has a weight
// hierarchy, otherwise by length (long outer contours). Note: \`cut\` and \`name\`
// are read-only globals in Illustrator's ExtendScript, so neither is used here.
var widths = [], lengths = [];
for (var w0 = 0; w0 < lp.length; w0++) if (lp[w0].stroked) { widths.push(Number(lp[w0].strokeWidth)); lengths.push(Number(lp[w0].length)); }
function quantile(arr, q) { var a = arr.slice(0); a.sort(function (x, y) { return x - y; }); return a.length ? a[Math.min(a.length - 1, Math.floor(a.length * q))] : 0; }
var byWidth = quantile(widths, 0.9) >= 1.3 * quantile(widths, 0.1);
var contourCut = byWidth ? quantile(widths, 1 - P.contourShare) : quantile(lengths, 1 - P.contourShare);
var ink = rgb(P.palette.ink);
for (var j = 0; j < lp.length; j++) {
  var p = lp[j];
  if (p.stroked) {
    var w = p.strokeWidth;
    p.strokeColor = ink;
    p.strokeWidth = (byWidth ? w : Number(p.length)) >= contourCut ? P.contour : P.detail;
    p.strokeCap = StrokeCap.ROUNDENDCAP;
    p.strokeJoin = StrokeJoin.ROUNDENDJOIN;
    p.filled = false;
    strokes++;
  } else if (p.filled) {
    p.fillColor = ink; fills++;
  }
}
if (P.simplify) for (var g9 = 0; g9 < groundLines.length; g9++) { try { groundLines[g9].strokeWidth = P.detail; } catch (eg2) {} }
log.push('line strokes ' + strokes + ' (contours by ' + (byWidth ? 'width' : 'length') + ', cut ' + Math.round(contourCut * 100) / 100 + '), ink fills ' + fills);

// Width profiles (animals): copy a carrier stroke onto each traced line's
// anchors. Illustrator's scripting cannot create a width profile, but a
// copied stroke keeps its own. Short lines (fur, whiskers) get point.
var profiled = 0;
if (P.carriers) {
  var carDoc = app.open(new File(P.carriers)), car = {};
  for (var c0 = 0; c0 < carDoc.pathItems.length; c0++) car[carDoc.pathItems[c0].name] = carDoc.pathItems[c0];
  app.activeDocument = doc;
  var lines = paths(lg, []);
  for (var c1 = 0; c1 < lines.length; c1++) {
    var ln = lines[c1];
    if (!ln.stroked) continue;
    var src = car[Number(ln.length) < P.pointLength ? 'point' : 'swell'] || car.swell;
    if (!src) continue;
    var dup = src.duplicate(lineLayer, ElementPlacement.PLACEATBEGINNING), anchors = [];
    dup.move(ln, ElementPlacement.PLACEBEFORE);
    for (var c2 = 0; c2 < ln.pathPoints.length; c2++) anchors.push(ln.pathPoints[c2].anchor);
    dup.setEntirePath(anchors);
    for (var c3 = 0; c3 < ln.pathPoints.length; c3++) { var pa = ln.pathPoints[c3], pb = dup.pathPoints[c3]; pb.leftDirection = pa.leftDirection; pb.rightDirection = pa.rightDirection; pb.pointType = pa.pointType; }
    dup.closed = ln.closed; dup.filled = false; dup.stroked = true; dup.strokeColor = ln.strokeColor; dup.strokeWidth = ln.strokeWidth;
    dup.strokeCap = StrokeCap.ROUNDENDCAP; dup.strokeJoin = StrokeJoin.ROUNDENDJOIN;
    ln.remove(); profiled++;
  }
  carDoc.close(SaveOptions.DONOTSAVECHANGES);
  app.activeDocument = doc;
}
log.push('width profiles ' + profiled);

// Backdrop (animals): the library disc is a plain 4-anchor circle whose ragged
// edge comes from Roughen 0.65 %; a traced disc is a lumpy many-anchor shape.
// The circle comes from the draft's pixels (findDisc); the traced disc's area
// says little, since the subject can cover a third of it or more. A draft
// without a disc gets none: the library has animals both ways.
if (P.backdrop) {
  var art = (ab[2] - ab[0]) * (ab[1] - ab[3]);
  var disc = null, discArea = 0, cf = paths(cg, []);
  for (var b0 = 0; b0 < cf.length; b0++) { var bi = cf[b0]; if (bi.filled && nearest(bi.fillColor) === 'tint' && Math.abs(bi.area) > discArea) { disc = bi; discArea = Math.abs(bi.area); } }
  var r0 = 0, dcx = 0, dcy = 0;
  if (P.disc) { r0 = P.disc.r; dcx = ab[0] + P.disc.cx; dcy = ab[1] - P.disc.cy; }
  if (r0) {
    var circleLayer = doc.layers.add(); circleLayer.name = 'Circle'; circleLayer.move(doc, ElementPlacement.PLACEATEND);
    var ring = circleLayer.pathItems.ellipse(dcy + r0, dcx - r0, 2 * r0, 2 * r0);
    ring.stroked = false; ring.filled = true; ring.fillColor = rgb(P.palette.tint);
    try { ring.applyEffect('<LiveEffect name="Adobe Roughen"><Dict data="R size 0.65 R asiz 0.65 R absoluteness 0 R dtal 61 R roundness 1 "/></LiveEffect>'); } catch (e) {}
    if (disc && discArea > 0.25 * Math.PI * r0 * r0) {
      var tdb = disc.geometricBounds;
      if (dist([(tdb[0] + tdb[2]) / 2, (tdb[1] + tdb[3]) / 2], [dcx, dcy]) < r0) (disc.parent.typename === 'CompoundPathItem' ? disc.parent : disc).remove();
    }
    // A pale disc often traces as a white interior inside a grey ragged rim:
    // drop the white area that spans the disc and the rim fragments. Collect
    // first and remove each once: a compound path goes whole, and its other
    // subpaths are dead references after that.
    var cleared = 0, rest = paths(cg, []), doomed = [];
    for (var b1 = 0; b1 < rest.length; b1++) {
      var ri = rest[b1];
      try { if (!ri.filled) continue; } catch (e3) { continue; }
      var rk = nearest(ri.fillColor), rb = ri.geometricBounds;
      var spans = rb[2] - rb[0] >= 1.6 * r0 && rb[1] - rb[3] >= 1.6 * r0;
      var rd = Math.sqrt(Math.pow((rb[0] + rb[2]) / 2 - dcx, 2) + Math.pow((rb[1] + rb[3]) / 2 - dcy, 2));
      var rim = rk === 'tint' && rd > 0.88 * r0 && rd < 1.12 * r0 && Math.abs(ri.area) < 0.02 * Math.PI * r0 * r0;
      if (!((rk === 'paper' && spans) || rim)) continue;
      var whole = ri.parent.typename === 'CompoundPathItem' ? ri.parent : ri, seen = false;
      for (var b2 = 0; b2 < doomed.length; b2++) if (doomed[b2] === whole) seen = true;
      if (!seen) doomed.push(whole);
    }
    for (var b3 = 0; b3 < doomed.length; b3++) { try { doomed[b3].remove(); cleared++; } catch (e4) {} }
    log.push('backdrop replaced, radius ' + Math.round(r0) + ', traced disc parts cleared ' + cleared);
  } else log.push('backdrop: no disc in the draft, none drawn');
}

// Paper underlay under the subject, traced from the silhouette mask: one
// shape per figure (a hen and a chick standing apart each get theirs), with
// the holes the mask has (between legs) kept open.
if (P.mask) {
  var mp = fillLayerOf(doc).placedItems.add();
  mp.file = new File(P.mask);
  mp.width = ab[2] - ab[0]; mp.height = ab[1] - ab[3]; mp.position = [ab[0], ab[1]];
  var mt = mp.trace(), mo = mt.tracing.tracingOptions;
  mo.tracingMode = TracingModeType.TRACINGMODEBLACKANDWHITE; mo.threshold = 128;
  mo.fills = true; mo.strokes = false; mo.ignoreWhite = true;
  mo.pathFidelity = 20; mo.cornerFidelity = 30; mo.noiseFidelity = 80;
  app.redraw();
  var mg = mt.tracing.expandTracing(), underlays = 0, underArea = 0, artArea = (ab[2] - ab[0]) * (ab[1] - ab[3]);
  var tops = mg.typename === 'GroupItem' ? mg.pageItems : [mg], shapes = [];
  for (var u = 0; u < tops.length; u++) shapes.push(tops[u]);
  for (var u1 = 0; u1 < shapes.length; u1++) {
    var mparts = paths(shapes[u1], []), ma = 0;
    for (var u2 = 0; u2 < mparts.length; u2++) ma = Math.max(ma, Math.abs(mparts[u2].area));
    if (ma < 0.004 * artArea) continue;
    var under = shapes[u1].duplicate(fillLayerOf(doc), ElementPlacement.PLACEATEND), ups = paths(under, []);
    for (var u3 = 0; u3 < ups.length; u3++) { ups[u3].filled = true; ups[u3].stroked = false; ups[u3].fillColor = rgb(P.palette.paper); }
    underlays++; underArea += ma;
  }
  mg.remove();
  log.push('underlay ' + underlays + ' shape' + (underlays === 1 ? '' : 's') + ', ' + Math.round(underArea) + ' pt2');
}
function fillLayerOf(d) { for (var fl = 0; fl < d.layers.length; fl++) if (d.layers[fl].name === 'Fill') return d.layers[fl]; return d.layers[0]; }

// Fill finish. Reference drawings keep fill edges smooth and most fills
// exactly under their line; the hand-made look comes from a few fills sitting
// 0.5–0.7 pt off it, which the colour shift above gives. --fill-rough (a faint
// absolute Roughen on fills) and --ink-shift (offset the ink clothing too)
// are opt-in; neither is in the reference drawings.
var fillFx = '<LiveEffect name="Adobe Roughen"><Dict data="R size 0.4 R asiz 0.4 R absoluteness 1 R dtal 20 R roundness 1 "/></LiveEffect>';
var gb = lg.geometricBounds, headLine = gb[1] - 0.2 * (gb[1] - gb[3]);
var fp = paths(cg, []), finished = 0, inkShifted = 0;
for (var f = 0; f < fp.length; f++) {
  var fi = fp[f];
  if (!fi.filled) continue;
  var fk = nearest(fi.fillColor);
  if (fk === 'paper') continue;
  if (P.inkShift && fk === 'ink' && fi.geometricBounds[1] < headLine) { fi.translate(P.shift[0], P.shift[1]); inkShifted++; }
  if (P.fillRough) { try { fi.applyEffect(fillFx); finished++; } catch (e) {} }
}
log.push('fills roughened ' + finished + ', ink clothing shifted ' + inkShifted);

// Eyes and noses (animals), found in the draft by darkFeatures: on top, in ink.
if (P.features.length) {
  var featureLayer = doc.layers.add(); featureLayer.name = 'Features';
  for (var fe = 0; fe < P.features.length; fe++) {
    var ft = P.features[fe];
    var dot = featureLayer.pathItems.ellipse(ab[1] - (ft.cy - ft.ry), ab[0] + (ft.cx - ft.rx), 2 * ft.rx, 2 * ft.ry);
    dot.stroked = false; dot.filled = true; dot.fillColor = rgb(P.palette.ink);
  }
}
log.push('features ' + P.features.length);

// Roughen, as in the library's .ai sources.
var roughened = 0;
if (P.roughen) {
  var fx = '<LiveEffect name="Adobe Roughen"><Dict data="R size 0.2 R asiz 0.2 R absoluteness 0 R dtal 63 R roundness 1 "/></LiveEffect>';
  // Strokes only: on large traced fills a relative Roughen turns the edge hairy.
  var all = paths(lg, []);
  for (var m = 0; m < all.length; m++) {
    if (!all[m].stroked) continue;
    try { all[m].applyEffect(fx); roughened++; } catch (e) {}
  }
}
log.push('roughened ' + roughened);

var saveOpts = new IllustratorSaveOptions();
doc.saveAs(new File(P.ai), saveOpts);
var svgOpts = new ExportOptionsSVG();
svgOpts.embedRasterImages = false;
svgOpts.coordinatePrecision = 2;
try { svgOpts.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES; } catch (e) {}
try { svgOpts.fontType = SVGFontType.OUTLINEFONT; } catch (e) {}
doc.exportFile(new File(P.svg), ExportType.SVG, svgOpts);
log.push('saved ' + P.ai + ' and ' + P.svg);
doc.close(SaveOptions.DONOTSAVECHANGES);
log.join(' | ');
`;

const jsxFile = path.join(
  fs.mkdtempSync(path.join(os.tmpdir(), 'illustrator-trace-')),
  'trace.jsx',
);
fs.writeFileSync(jsxFile, jsx);
const script = `with timeout of 1800 seconds
  tell application ${JSON.stringify(
    app,
  )} to do javascript (read POSIX file ${JSON.stringify(
  jsxFile,
)} as «class utf8»)
end timeout`;
const result = execFileSync('osascript', ['-e', script], {
  encoding: 'utf8',
  timeout: 1860000,
}).trim();
console.log(result);

// Dark and contrast versions by exact palette mapping. The Circle layer is
// the backdrop: it shares tint's colour in standard mode, but in the library
// the disc is Ebony 20 at 30 % opacity in dark mode and Blue 90 in contrast
// mode, while small tint fills turn Ebony 30 and Blue 40.
const svg = fs.readFileSync(params.svg, 'utf8');
for (const [mode, idx] of [
  ['darkmode', 1],
  ['contrast', 2],
]) {
  let out = markBackdrop(svg);
  for (const [, values] of Object.entries(PALETTE)) {
    const from = values[0];
    out = out.replace(new RegExp(from, 'gi'), `__${values[idx].slice(1)}__`);
  }
  out = out
    .replace(/__([0-9A-F]{6})__/g, '#$1')
    .replace(/__BACKDROP__/g, backdropFill(mode));
  const file = path.join(outDir, `${name}-${mode}.svg`);
  fs.writeFileSync(file, out);
  console.log(file);
}

// The fill of the backdrop disc per mode (palette.md, role backdrop).
function backdropFill(mode) {
  return mode === 'darkmode'
    ? 'fill="#CCCDD4" fill-opacity="0.3"'
    : 'fill="#393D79"';
}

// Marks the tint fills inside the exported Circle layer, so the mode mapping
// gives them the backdrop colour instead of tint's.
function markBackdrop(svg) {
  const start = svg.indexOf('<g id="Circle"');
  if (start < 0) return svg;
  const tags = /<g[\s>]|<\/g>/g;
  tags.lastIndex = start;
  let depth = 0;
  for (let m; (m = tags.exec(svg)); ) {
    depth += m[0] === '</g>' ? -1 : 1;
    if (depth) continue;
    const end = m.index + 4;
    return (
      svg.slice(0, start) +
      svg.slice(start, end).replace(/fill="#EAEAF1"/gi, '__BACKDROP__') +
      svg.slice(end)
    );
  }
  return svg;
}

// Luminance and a blue-ish flag per pixel. Pure JS: decodes 8-bit RGB(A) PNGs.
function readPng(file) {
  const buf = fs.readFileSync(file);
  let pos = 8;
  let w = 0;
  let h = 0;
  let type = 2;
  const idat = [];
  while (pos < buf.length) {
    const n = buf.readUInt32BE(pos);
    const kind = buf.toString('latin1', pos + 4, pos + 8);
    const body = buf.subarray(pos + 8, pos + 8 + n);
    if (kind === 'IHDR') {
      w = body.readUInt32BE(0);
      h = body.readUInt32BE(4);
      type = body[9];
    } else if (kind === 'IDAT') idat.push(body);
    pos += 12 + n;
  }
  const bpp = type === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * bpp;
  const lum = new Uint8Array(w * h);
  const blueish = new Uint8Array(w * h);
  let prev = new Uint8Array(stride);
  for (let y = 0, i = 0; y < h; y++) {
    const f = raw[i++];
    const line = new Uint8Array(raw.subarray(i, i + stride));
    i += stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? line[x - bpp] : 0;
      const b = prev[x];
      const c = x >= bpp ? prev[x - bpp] : 0;
      if (f === 1) line[x] = (line[x] + a) & 255;
      else if (f === 2) line[x] = (line[x] + b) & 255;
      else if (f === 3) line[x] = (line[x] + ((a + b) >> 1)) & 255;
      else if (f === 4) {
        const pa = Math.abs(b - c);
        const pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        line[x] =
          (line[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
    }
    for (let x = 0; x < w; x++) {
      const [r, g, bl] = [line[x * bpp], line[x * bpp + 1], line[x * bpp + 2]];
      lum[y * w + x] = (r * 3 + g * 6 + bl) / 10;
      blueish[y * w + x] = bl >= r && bl >= g ? 1 : 0;
    }
    prev = line;
  }
  return { w, h, lum, blueish };
}

// Eyes and noses in the draft, as ellipses in artboard points (y down): dots
// that stand free, and thick spots that remain once the lines are eroded away
// (a nose drawn at the end of a line). Lines, fur marks and ground dashes are
// too thin or too long to pass.
function darkFeatures(img, size, ground) {
  const { w, h, lum } = img;
  const dark = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) dark[k] = lum[k] < 100 ? 1 : 0;
  const box = c => [c.x1 - c.x0 + 1, c.y1 - c.y0 + 1];
  const small = c => Math.max(...box(c)) <= 0.045 * w;
  const round = c => Math.max(...box(c)) / Math.min(...box(c)) <= 2.2;
  const dots = components(dark, w, h).filter(
    c =>
      c.n >= (0.006 * w) ** 2 &&
      small(c) &&
      round(c) &&
      c.n / (box(c)[0] * box(c)[1]) >= 0.45,
  );
  const r = Math.max(2, Math.round(0.0045 * w));
  const spots = components(erode(dark, w, h, r), w, h)
    .filter(c => c.n >= 9)
    .map(c => ({ x0: c.x0 - r, x1: c.x1 + r, y0: c.y0 - r, y1: c.y1 + r }))
    .filter(
      c =>
        small(c) &&
        round(c) &&
        !dots.some(
          d => d.x0 <= c.x1 && c.x0 <= d.x1 && d.y0 <= c.y1 && c.y0 <= d.y1,
        ),
    );
  // Grass clumps on the ground line look like eyes too, also where they sit
  // under the subject's own silhouette, so no spot in the band just above the
  // line counts: an eye or a nose is never that close to the ground.
  const kept = [...dots, ...spots].filter(c => {
    const cy = (c.y0 + c.y1) / 2;
    return !ground || cy < ground.top - 0.03 * h || cy > ground.bottom + 2;
  });
  const [sx, sy] = [size / w, size / h];
  return kept.map(c => ({
    cx: ((c.x0 + c.x1 + 1) / 2) * sx,
    cy: ((c.y0 + c.y1 + 1) / 2) * sy,
    rx: ((c.x1 - c.x0 + 1) / 2) * sx,
    ry: ((c.y1 - c.y0 + 1) / 2) * sy,
  }));
}

function components(mask, w, h) {
  const seen = new Uint8Array(w * h);
  const out = [];
  for (let k = 0; k < w * h; k++) {
    if (!mask[k] || seen[k]) continue;
    const c = { n: 0, x0: w, x1: 0, y0: h, y1: 0 };
    const stack = [k];
    seen[k] = 1;
    while (stack.length) {
      const p = stack.pop();
      const x = p % w;
      const y = (p - x) / w;
      c.n++;
      c.x0 = Math.min(c.x0, x);
      c.x1 = Math.max(c.x1, x);
      c.y0 = Math.min(c.y0, y);
      c.y1 = Math.max(c.y1, y);
      for (const q of [
        x > 0 ? p - 1 : -1,
        x < w - 1 ? p + 1 : -1,
        p - w,
        p + w,
      ])
        if (q >= 0 && q < w * h && mask[q] && !seen[q]) {
          seen[q] = 1;
          stack.push(q);
        }
    }
    out.push(c);
  }
  return out;
}

// Keeps a pixel when the whole square of radius r around it is dark.
function erode(mask, w, h, r) {
  const span = 2 * r + 1;
  const across = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0, run = 0; x < w; x++) {
      run = mask[y * w + x] ? run + 1 : 0;
      if (run >= span) across[y * w + x - r] = 1;
    }
  const out = new Uint8Array(w * h);
  for (let x = 0; x < w; x++)
    for (let y = 0, run = 0; y < h; y++) {
      run = across[y * w + x] ? run + 1 : 0;
      if (run >= span) out[(y - r) * w + x] = 1;
    }
  return out;
}

// Silhouette of the subject in the draft, black on white, for --underlay. The
// line gaps are closed by growing the dark line pixels; the outside is then
// flooded from the image edge. Inside the backdrop disc only disc-coloured
// pixels let the flood through, so white areas behind a gap in a contour
// stay inside.
function writeMask(img, disc, ground, grow = 5) {
  const { w, h, lum } = img;
  // Grow a mask by r pixels (square kernel, two passes).
  const growBy = (m, r) => {
    const t = new Uint8Array(w * h);
    const out = new Uint8Array(w * h);
    for (let y = 0; y < h; y++)
      for (let x = 0, run = -1; x < w; x++) {
        for (let k = Math.max(0, x - r); k <= Math.min(w - 1, x + r); k++)
          if (m[y * w + k]) {
            run = 1;
            break;
          } else run = 0;
        t[y * w + x] = run;
      }
    for (let x = 0; x < w; x++)
      for (let y = 0; y < h; y++) {
        let v = 0;
        for (let k = Math.max(0, y - r); k <= Math.min(h - 1, y + r); k++)
          if (t[k * w + x]) {
            v = 1;
            break;
          }
        out[y * w + x] = v;
      }
    return out;
  };
  const ink = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) ink[k] = lum[k] < 120 ? 1 : 0;
  const wall = growBy(ink, grow);
  const outside = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const k = stack.pop();
    if (outside[k] || wall[k]) continue;
    const x = k % w;
    const y = (k - x) / w;
    if (
      disc &&
      (x - disc.cx) ** 2 + (y - disc.cy) ** 2 < (disc.r - 6) ** 2 &&
      lum[k] > 238
    )
      continue;
    outside[k] = 1;
    if (x > 0) stack.push(k - 1);
    if (x < w - 1) stack.push(k + 1);
    if (y > 0) stack.push(k - w);
    if (y < h - 1) stack.push(k + w);
  }
  // Shrink back so the underlay sits just inside the lines, then drop thin
  // spurs (a ground dash touching a paw) by shrinking and regrowing the
  // inside: they would show as pale slivers in dark mode.
  const shrunk = growBy(outside, Math.max(1, grow - 1));
  const core = growBy(shrunk, grow + 3).map(v => 1 - v);
  const outer = growBy(core, grow + 3).map(v => 1 - v); // 1 = background
  if (ground) {
    // Paper stops at the top of the ground line: below it, it would show as a
    // pale strip under the feet in dark mode.
    for (let k = ground.top * w; k < w * h; k++) outer[k] = 1;
    // In the band just above the line keep only what hangs down from the
    // subject; pockets closed off between grass blades and the line are not
    // part of it. Widened a little, so feet and paw edges keep their paper.
    const bandTop = Math.max(0, ground.top - Math.round(0.04 * h));
    const hang = new Uint8Array(w * h);
    for (let x = 0; x < w; x++)
      for (let y = bandTop; y < ground.top && !outer[y * w + x]; y++)
        hang[y * w + x] = 1;
    const near = growBy(hang, grow);
    for (let y = bandTop; y < ground.top; y++)
      for (let x = 0; x < w; x++) if (!near[y * w + x]) outer[y * w + x] = 1;
  }
  const rows = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    rows[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const v = outer[y * w + x] ? 255 : 0;
      rows.fill(v, y * (w * 3 + 1) + 1 + x * 3, y * (w * 3 + 1) + 4 + x * 3);
    }
  }
  const chunk = (kind, body) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(body.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(kind), body])));
    return Buffer.concat([len, Buffer.from(kind), body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const out = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'illustrator-trace-mask-')),
    'mask.png',
  );
  fs.writeFileSync(
    out,
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk('IHDR', ihdr),
      chunk('IDAT', zlib.deflateSync(rows)),
      chunk('IEND', Buffer.alloc(0)),
    ]),
  );
  return out;
}

// The backdrop disc: the largest connected area of its pale grey-lavender.
// Pale fills elsewhere (a grey wing, an egg's shadow) are separate areas and
// no longer stretch it. A subject covering the bottom of the disc shortens
// its bounds there, so the radius comes from the longer side, measured from
// the top.
function findDisc({ w, h, lum, blueish }) {
  const pale = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++)
    pale[k] = lum[k] >= 212 && lum[k] <= 238 && blueish[k] ? 1 : 0;
  let best = null;
  for (const c of components(pale, w, h)) if (!best || c.n > best.n) best = c;
  if (!best || best.n < w * h * 0.03) return null;
  const bw = best.x1 - best.x0 + 1;
  const bh = best.y1 - best.y0 + 1;
  const r = Math.max(bw, bh) / 2;
  const cx = best.x0 + bw / 2;
  // Only a plausible disc counts: wide enough, round enough, filled enough
  // (a subject may cover half of it) and near the middle. Pale wings or a
  // grey coat are none of these, and the library has animals without a disc.
  const disc =
    2 * r >= 0.3 * w &&
    Math.min(bw, bh) >= 0.6 * Math.max(bw, bh) &&
    best.n >= 0.35 * Math.PI * r * r &&
    Math.abs(cx - w / 2) <= 0.2 * w;
  if (!disc) return null;
  return {
    cx,
    cy: bh < 0.95 * bw ? best.y0 + r : best.y0 + bh / 2,
    r,
  };
}

// The ground line: the lowest rows where one dark run (gaps up to 2 % of the
// width) spans a quarter of the width. Returns its top and bottom row and
// the extent of its dark pieces.
function findGround({ w, h, lum }) {
  const run = y => {
    let best = null;
    let start = -1;
    let last = -w;
    for (let x = 0; x < w; x++) {
      if (lum[y * w + x] >= 120) continue;
      if (x - last > 0.02 * w) start = x;
      last = x;
      if (!best || x - start > best.x1 - best.x0) best = { x0: start, x1: x };
    }
    return best && best.x1 - best.x0 > 0.25 * w ? best : null;
  };
  for (let y = h - 1; y >= 0; y--) {
    const first = run(y);
    if (!first) continue;
    let top = y;
    let x0 = first.x0;
    let x1 = first.x1;
    for (let yy = y - 1; yy >= 0; yy--) {
      const r = run(yy);
      if (!r) break;
      top = yy;
      x0 = Math.min(x0, r.x0);
      x1 = Math.max(x1, r.x1);
    }
    // The line may come in pieces: take every dark run in the band that is
    // at least 3 % of the width, not just the longest.
    for (let yy = top; yy <= y; yy++) {
      let start = -1;
      let last = -w;
      for (let x = 0; x <= w; x++) {
        const dark = x < w && lum[yy * w + x] < 120;
        if (dark && x - last > 0.02 * w) start = x;
        if (!dark && start >= 0 && x - last > 0.02 * w) {
          if (last - start >= 0.03 * w) {
            x0 = Math.min(x0, start);
            x1 = Math.max(x1, last);
          }
          start = -1;
        }
        if (dark) last = x;
      }
      if (start >= 0 && last - start >= 0.03 * w) {
        x0 = Math.min(x0, start);
        x1 = Math.max(x1, last);
      }
    }
    return { top, bottom: y, x0, x1 };
  }
  return null;
}

function crc32(bytes) {
  let c = 0xffffffff;
  for (const byte of bytes) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
