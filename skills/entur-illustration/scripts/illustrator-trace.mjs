// illustrator-trace — turns a PNG draft into Entur Linje vector strokes in
// Adobe Illustrator, driven from the command line through AppleScript
// `do javascript`. No plugin needed. macOS only.
//
//   node illustrator-trace.mjs <draft.png> [--out dir] [--name Name]
//     [--app "/Applications/Adobe Illustrator 2026/Adobe Illustrator.app"]
//     [--size 360] [--threshold 110] [--max-stroke 20] [--contour 1.5] [--detail 1.0]
//     [--contour-share 0.25] [--min-ink-width 4] [--roughen] [--fill-rough] [--ink-shift]
//     [--construction animals] [--carriers profiles.ai] [--backdrop] [--underlay]
//     [--no-features] [--no-simplify] [--object] [--vehicle]
//
// Two traces of the same PNG on a `--size` pt artboard (360 puts a figure at
// library scale):
//   lines  black-and-white trace, strokes only, abutting: every line a live
//          stroke with round caps and joins, in ink. The thickest share
//          (`--contour-share`) gets the contour weight, the rest the detail
//          weight; by traced width, or by length when widths are all alike.
//   colour colour trace, abutting, smoothed: every area snapped to the exact
//          palette colour; wide ink areas kept (on animals the ink comes
//          from an opened-ink mask instead), thin line-like ink dropped,
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
// It comes in a second pass, cut back to the finished lines so its edge sits
// under them.
// With animals, a small dark eye or nose, too thin for the colour trace and
// too round for the line trace, is put back as an ink ellipse on a Features
// layer (`--no-features` turns it off); none is taken from the ground band.
// `--object` (an object in the animal construction) turns that off too, and
// keeps the disc's pale colour on the object only where it is a face of it
// (discParts): a strip between a line and its paper, or the inside of an
// empty ring on the disc, is the disc showing through.
// `--vehicle` (a bus, train, tram, boat or scooter, people construction)
// gives the dark and contrast files the library's vehicle roles: white areas
// become the `vehicle` body (Ebony 40 in dark mode), and the ink fills of the
// windows (vehicleWindows) the `window` role (Canary 30 in dark mode), with
// the paper glints inside them kept as paper. It turns on `--underlay`: the
// body's white joins the background through the open contour, so the colour
// trace drops it, and the underlay is the body.
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
// globals in Illustrator: assigning to them fails silently. Never name a
// function cut, copy or paste either: the call reaches Illustrator's own
// Edit commands and acts on the selection.

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
const object = flag('object');
const vehicle = flag('vehicle');
// A vehicle's white body joins the background through its open contour, so
// the colour trace drops it: the underlay is its body.
const underlay = flag('underlay') || vehicle;
const features = animals && !object && !flag('no-features');
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
if (img.alpha) params.png = flattened(img);
const disc = findDisc(img);
const groundBand = animals ? findGround(img) : null;
// The ground line, unless the long line is a perch (findGround).
const ground = animals && groundBand && !groundBand.perch ? groundBand : null;
// With an underlay the paper comes in pass two, after the lines exist.
params.linesPng = underlay
  ? path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'illustrator-trace-lines-')),
      'lines.png',
    )
  : '';
// The finished strokes' geometry, for strokeEdge in the underlay.
params.strokesJson = underlay
  ? path.join(path.dirname(params.linesPng), 'strokes.json')
  : '';
params.linesScale = (100 * img.w) / params.size;
const toX = v => (v * params.size) / img.w;
const toY = v => (v * params.size) / img.h;
params.disc = disc
  ? { cx: toX(disc.cx), cy: toY(disc.cy), r: toX(disc.r) }
  : null;
// On an object, which of the disc's pale areas are faces of it (discParts).
const parts = object && disc ? discParts(img, disc) : null;
params.faces = parts ? parts.faces : null;
// On a vehicle, where its windows are (vehicleWindows).
params.windows = vehicle ? vehicleWindows(img) : null;
params.ground = ground
  ? {
      top: toY(ground.top),
      y: toY((ground.top + ground.bottom + 1) / 2),
      x0: toX(ground.x0),
      x1: toX(ground.x1 + 1),
    }
  : null;
// People: the ground line goes behind the figure too, on a layer under the
// fills (pass one). Animals get the plain line instead (simplify).

params.features = features ? darkFeatures(img, params.size, groundBand) : [];
// Animals take their ink masses from the opened-ink mask, not from the
// colour trace's mean-width rule (inkMasses).
const masses = animals ? inkMasses(img, ground) : null;
params.inkFromMask = animals;
params.inkMask = masses ? masses.file : '';
params.inkMasses = masses ? masses.count : 0;

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
// Illustrator now and then rejects tracing options set right after a
// placement or after opening a file (Error 1200, MRAP), for longer with big
// documents open: try again after a redraw and a pause, up to 20 s.
function retry(fn) {
  for (var t = 0; t < 20; t++) {
    try { return fn(); } catch (e) { if (t === 19) throw e; app.redraw(); $.sleep(1000); }
  }
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
var co = retry(function () { var o = ct.tracing.tracingOptions; o.tracingMode = TracingModeType.TRACINGMODECOLOR; return o; });
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
// Slivers (animals with an underlay): the draft leaves a thin white gap
// between a line and its fill or the background, and the colour trace keeps
// it as paper — a white double line or rim in dark mode. The underlay covers
// the figure, so line-thin paper goes, and so do tiny line-thin tint pieces.
// Thin is a mean width (2·area/perimeter, a compound path measured whole,
// holes included) under 1.5 pt; decided for every path before any goes.
var s320 = P.size / 320, slivers = 0, sliver = [];
function meanWidth(p) {
  var whole = p.parent.typename === 'CompoundPathItem' ? p.parent.pathItems : [p], a = 0, l = 0;
  for (var q = 0; q < whole.length; q++) { a += whole[q].area; l += whole[q].length; }
  return { width: l > 0 ? (2 * Math.abs(a)) / l : 0, area: Math.abs(a) };
}
for (var i0 = 0; i0 < cp.length; i0++) {
  var c0 = cp[i0];
  if (!(P.inkFromMask && P.linesPng && c0.filled)) continue;
  var k0 = nearest(c0.fillColor), m0 = meanWidth(c0);
  if (!(m0.width < 1.5 * s320 && (k0 === 'paper' || (k0 === 'tint' && m0.area < 20 * s320 * s320)))) continue;
  // A compound path goes whole and once: removing its subpaths one by one
  // leaves an empty, invalid compound behind.
  var w0 = c0.parent.typename === 'CompoundPathItem' ? c0.parent : c0, seen0 = false;
  for (var i1 = 0; i1 < sliver.length; i1++) if (sliver[i1] === w0) seen0 = true;
  if (!seen0) sliver.push(w0);
}
for (var i2 = 0; i2 < sliver.length; i2++) { try { sliver[i2].remove(); dropped++; slivers++; } catch (e5) {} }
if (slivers) cp = paths(cg, []);
// Vehicles (P.windows): the share of an area's points that fall on a window
// in the draft. A window's ink fill is named Window and a paper glint inside
// one Glint, so the mode mapping gives them their roles.
function onWindows(item) {
  var M = P.windows, b = item.geometricBounds, poly = [], n = item.pathPoints.length, inside = 0, hits = 0, anchors = 0;
  var cell = function (a) {
    var gx = Math.floor(((a[0] - ab[0]) / (ab[2] - ab[0])) * M.n), gy = Math.floor(((ab[1] - a[1]) / (ab[1] - ab[3])) * M.n);
    return gx >= 0 && gy >= 0 && gx < M.n && gy < M.n && M.cells.charAt(gy * M.n + gx) === '1';
  };
  for (var a0 = 0; a0 < n; a0++) { poly.push(item.pathPoints[a0].anchor); if (cell(poly[a0])) anchors++; }
  for (var sy = 0; sy < 8; sy++)
    for (var sx = 0; sx < 8; sx++) {
      var pt = [b[0] + ((sx + 0.5) / 8) * (b[2] - b[0]), b[1] - ((sy + 0.5) / 8) * (b[1] - b[3])], hit = false;
      for (var e = 0, f = poly.length - 1; e < poly.length; f = e++)
        if ((poly[e][1] > pt[1]) !== (poly[f][1] > pt[1]) && pt[0] < ((poly[f][0] - poly[e][0]) * (pt[1] - poly[e][1])) / (poly[f][1] - poly[e][1]) + poly[e][0]) hit = !hit;
      if (!hit) continue;
      inside++;
      if (cell(pt)) hits++;
    }
  return inside >= 4 ? hits / inside : n ? anchors / n : 0;
}
function nameWhole(item, label) { (item.parent.typename === 'CompoundPathItem' ? item.parent : item).name = label; }
var windowFills = 0, glints = 0;
for (var i = cp.length - 1; i >= 0; i--) {
  var it = cp[i];
  if (!it.filled) { continue; }
  var k = nearest(it.fillColor);
  if (k === 'paper' && !touchesEdge(it)) {
    it.fillColor = rgb(P.palette.paper); it.stroked = false; kept++;
    if (P.windows && onWindows(it) >= 0.5) { nameWhole(it, 'Glint'); glints++; }
    continue;
  }
  // Ink areas: keep the wide ones (uniform, hair, shoes) as fills; drop the
  // thin, line-like ones, which the stroke trace draws. Mean width ≈ 2·area/perimeter.
  var wide = k === 'ink' && it.length > 0 && (2 * Math.abs(it.area)) / it.length > P.minInkWidth;
  if (k === 'paper' || (k === 'ink' && (!wide || P.inkFromMask))) { it.remove(); dropped++; continue; }
  if (k === 'ink') inkAreas++;
  it.fillColor = rgb(P.palette[k]); it.stroked = false; kept++;
  if (P.windows && k === 'ink' && onWindows(it) >= 0.5) { nameWhole(it, 'Window'); windowFills++; }
  // Print misregistration: colour shifts off its line; ink areas stay put.
  if (k !== 'ink') it.translate(P.shift[0], P.shift[1]);
}
log.push('colour areas kept ' + kept + ' (ink ' + inkAreas + '), dropped ' + dropped + (slivers ? ' (slivers ' + slivers + ')' : '') + (P.windows ? ', windows ' + windowFills + ', glints ' + glints : ''));

// Line trace, on top: strokes only. Lines touch the wide ink areas, so a
// fills trace would merge them into one filled region; the wide areas come
// from the colour trace instead.
var lt = placeAndTrace(doc, lineLayer);
var lo = retry(function () { var o = lt.tracing.tracingOptions; o.tracingMode = TracingModeType.TRACINGMODEBLACKANDWHITE; return o; });
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
      // A large piece of the traced disc cut off by a line (below the doves'
      // wire): inside the disc's box, reaching its rim. It is the disc's own
      // colour in standard mode, but a lighter patch in dark mode.
      var reach = Math.max(Math.abs(rb[0] - dcx), Math.abs(rb[2] - dcx), Math.abs(rb[1] - dcy), Math.abs(rb[3] - dcy));
      var inBox = rb[0] >= dcx - 1.05 * r0 && rb[2] <= dcx + 1.05 * r0 && rb[3] >= dcy - 1.05 * r0 && rb[1] <= dcy + 1.05 * r0;
      var piece = rk === 'tint' && inBox && reach >= 0.9 * r0 && Math.abs(ri.area) >= 0.08 * Math.PI * r0 * r0;
      if (!((rk === 'paper' && spans) || rim || piece)) continue;
      var whole = ri.parent.typename === 'CompoundPathItem' ? ri.parent : ri, seen = false;
      for (var b2 = 0; b2 < doomed.length; b2++) if (doomed[b2] === whole) seen = true;
      if (!seen) doomed.push(whole);
    }
    for (var b3 = 0; b3 < doomed.length; b3++) { try { doomed[b3].remove(); cleared++; } catch (e4) {} }
    log.push('backdrop replaced, radius ' + Math.round(r0) + ', traced disc parts cleared ' + cleared);
    // An object (P.faces, discParts): a tint fill inside the circle stays
    // only on a face of the object; elsewhere it is the disc showing through
    // (a strip between a line and its paper, the inside of an empty ring),
    // an opaque grey in dark mode. Judged by points over its area, as the
    // white pieces in pass two; a thin strip by its anchors.
    if (P.faces) {
      var FC = P.faces, tintPaths = paths(cg, []), offFace = [];
      var onFace = function (a) {
        var gx = Math.floor(((a[0] - ab[0]) / (ab[2] - ab[0])) * FC.n), gy = Math.floor(((ab[1] - a[1]) / (ab[1] - ab[3])) * FC.n);
        return gx >= 0 && gy >= 0 && gx < FC.n && gy < FC.n && FC.cells.charAt(gy * FC.n + gx) === '1';
      };
      for (var t0 = 0; t0 < tintPaths.length; t0++) {
        var tp = tintPaths[t0];
        try { if (!tp.filled || nearest(tp.fillColor) !== 'tint') continue; } catch (e8) { continue; }
        var tb = tp.geometricBounds;
        if (dist([(tb[0] + tb[2]) / 2, (tb[1] + tb[3]) / 2], [dcx, dcy]) > r0) continue;
        var tpoly = [], tn = tp.pathPoints.length, tin = 0, ton = 0, tanch = 0;
        for (var t1 = 0; t1 < tn; t1++) { tpoly.push(tp.pathPoints[t1].anchor); if (onFace(tpoly[t1])) tanch++; }
        for (var ty = 0; ty < 8; ty++)
          for (var tx = 0; tx < 8; tx++) {
            var tpt = [tb[0] + ((tx + 0.5) / 8) * (tb[2] - tb[0]), tb[1] - ((ty + 0.5) / 8) * (tb[1] - tb[3])], thit = false;
            for (var te = 0, tf = tpoly.length - 1; te < tpoly.length; tf = te++)
              if ((tpoly[te][1] > tpt[1]) !== (tpoly[tf][1] > tpt[1]) && tpt[0] < ((tpoly[tf][0] - tpoly[te][0]) * (tpt[1] - tpoly[te][1])) / (tpoly[tf][1] - tpoly[te][1]) + tpoly[te][0]) thit = !thit;
            if (!thit) continue;
            tin++;
            if (onFace(tpt)) ton++;
          }
        if (tin >= 4 ? ton >= 0.5 * tin : tn && tanch >= 0.5 * tn) continue;
        var twhole = tp.parent.typename === 'CompoundPathItem' ? tp.parent : tp, tseen = false;
        for (var t2 = 0; t2 < offFace.length; t2++) if (offFace[t2] === twhole) tseen = true;
        if (!tseen) offFace.push(twhole);
      }
      var throughGone = 0;
      for (var t3 = 0; t3 < offFace.length; t3++) { try { offFace[t3].remove(); throughGone++; } catch (e9) {} }
      log.push('object: faces ' + FC.count + ', disc showing through cleared ' + throughGone);
    }
  } else log.push('backdrop: no disc in the draft, none drawn');
}

// Ink masses (animals): wing and tail tips, a nose, a dark patch, traced from
// the opened-ink mask with their feather gaps, on top of the other fills.
if (P.inkMask) {
  var ip = fillLayerOf(doc).placedItems.add();
  ip.file = new File(P.inkMask);
  ip.width = ab[2] - ab[0]; ip.height = ab[1] - ab[3]; ip.position = [ab[0], ab[1]];
  var itr = ip.trace(), io = retry(function () { var o = itr.tracing.tracingOptions; o.tracingMode = TracingModeType.TRACINGMODEBLACKANDWHITE; return o; });
  io.threshold = 128;
  io.fills = true; io.strokes = false; io.ignoreWhite = true;
  io.pathFidelity = 40; io.cornerFidelity = 50; io.noiseFidelity = 20;
  app.redraw();
  var ig = itr.tracing.expandTracing();
  ig.move(fillLayerOf(doc), ElementPlacement.PLACEATBEGINNING);
  ig.name = 'Ink';
  var ips = paths(ig, []);
  for (var ik = 0; ik < ips.length; ik++) { ips[ik].filled = true; ips[ik].stroked = false; ips[ik].fillColor = rgb(P.palette.ink); }
  log.push('ink masses ' + P.inkMasses);
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
if (P.strokesJson) {
  // The strokes' centre lines (Outline, Ground) and the closed shapes
  // (Features, the Ink group), for the paper's edge in Node (strokeEdge).
  var sj = [];
  var r2 = function (v) { return Math.round(v * 100) / 100; };
  var addPath = function (p, kind) {
    if (p.hidden || p.pathPoints.length < 2) return;
    var a = [];
    for (var k = 0; k < p.pathPoints.length; k++) { var pq = p.pathPoints[k]; a.push('[' + [r2(pq.anchor[0]), r2(pq.anchor[1]), r2(pq.leftDirection[0]), r2(pq.leftDirection[1]), r2(pq.rightDirection[0]), r2(pq.rightDirection[1])].join(',') + ']'); }
    sj.push('{"kind":"' + kind + '","closed":' + (p.closed ? 'true' : 'false') + ',"sw":' + (p.stroked ? r2(p.strokeWidth) : 0) + ',"pts":[' + a.join(',') + ']}');
  };
  var walkPaths = function (it, kind) {
    if (it.hidden) return;
    if (it.typename === 'GroupItem') { for (var j = 0; j < it.pageItems.length; j++) walkPaths(it.pageItems[j], kind); }
    else if (it.typename === 'CompoundPathItem') { for (var j2 = 0; j2 < it.pathItems.length; j2++) addPath(it.pathItems[j2], kind); }
    else if (it.typename === 'PathItem') addPath(it, kind);
  };
  for (var sl = 0; sl < doc.layers.length; sl++) {
    var sly = doc.layers[sl];
    var kindOf = sly.name === 'Outline' ? 'line' : sly.name === 'Ground' ? 'ground' : sly.name === 'Features' ? 'feature' : '';
    for (var sm = 0; sm < sly.pageItems.length; sm++) {
      var sit = sly.pageItems[sm];
      if (kindOf) walkPaths(sit, kindOf);
      else if (sly.name === 'Fill' && sit.name === 'Ink') walkPaths(sit, 'feature');
    }
  }
  var sf = new File(P.strokesJson); sf.encoding = 'UTF-8'; sf.open('w');
  sf.write('{"ab":[' + doc.artboards[0].artboardRect.join(',') + '],"items":[' + sj.join(',') + ']}'); sf.close();
}
if (P.linesPng) {
  // The finished lines alone (Outline, Ground, Features and the Ink group),
  // for the underlay in pass two: everything else is hidden, and the file is
  // closed without saving afterwards.
  for (var hl = 0; hl < doc.layers.length; hl++) {
    var ly = doc.layers[hl];
    if (ly.name === 'Circle') ly.visible = false;
    if (ly.name === 'Fill')
      for (var hi = 0; hi < ly.pageItems.length; hi++) {
        var hit = ly.pageItems[hi];
        if (hit.name === 'Ink') continue;
        // A vehicle's windows close its outline in the drawing, so its ink
        // fills stay in the lines too; only the colour areas go.
        if (P.windows && hit === cg) {
          var cps = paths(cg, []);
          for (var hj = 0; hj < cps.length; hj++) {
            try { if (cps[hj].filled && nearest(cps[hj].fillColor) === 'ink') continue; } catch (eh) {}
            (cps[hj].parent.typename === 'CompoundPathItem' ? cps[hj].parent : cps[hj]).hidden = true;
          }
          continue;
        }
        hit.hidden = true;
      }
  }
  var po = new ExportOptionsPNG24();
  po.horizontalScale = po.verticalScale = P.linesScale;
  po.artBoardClipping = true; po.antiAliasing = true; po.transparency = false;
  doc.exportFile(new File(P.linesPng), ExportType.PNG24, po);
  log.push('saved ' + P.ai + ', lines rendered for the underlay');
} else {
  var svgOpts = new ExportOptionsSVG();
  svgOpts.embedRasterImages = false;
  svgOpts.coordinatePrecision = 2;
  try { svgOpts.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES; } catch (e) {}
  try { svgOpts.fontType = SVGFontType.OUTLINEFONT; } catch (e) {}
  doc.exportFile(new File(P.svg), ExportType.SVG, svgOpts);
  log.push('saved ' + P.ai + ' and ' + P.svg);
}
doc.close(SaveOptions.DONOTSAVECHANGES);
log.join(' | ');
`;

// Pass two (animals with an underlay): paper under each figure, from the
// draft's silhouette cut back to the finished lines (underlaySubject), so it
// ends under the middle of every line — also where simplify removed a fur
// mark the draft's outline still has.
const jsx2 = P => `
var P = ${JSON.stringify(P)};
function rgb(c) { var r = new RGBColor(); r.red = c[0]; r.green = c[1]; r.blue = c[2]; return r; }
function paths(item, out) {
  if (item.typename === 'PathItem') out.push(item);
  else if (item.typename === 'CompoundPathItem') { for (var i = 0; i < item.pathItems.length; i++) out.push(item.pathItems[i]); }
  else if (item.typename === 'GroupItem') { for (var j = 0; j < item.pageItems.length; j++) paths(item.pageItems[j], out); }
  return out;
}
function fillLayerOf(d) { for (var fl = 0; fl < d.layers.length; fl++) if (d.layers[fl].name === 'Fill') return d.layers[fl]; return d.layers[0]; }
function retry(fn) {
  for (var t = 0; t < 20; t++) {
    try { return fn(); } catch (e) { if (t === 19) throw e; app.redraw(); $.sleep(1000); }
  }
}
var log = [], doc = app.open(new File(P.ai)), ab = doc.artboards[0].artboardRect;
app.redraw();
// White pieces from the colour trace that lie outside every figure: most of
// their anchors fall outside the figure map (figureCells). Inside a figure
// white stays (the underlay covers it anyway, and holes stay holes).
if (P.figures) {
  var F = P.figures, whites = [], outsideWhite = [], fillItems = fillLayerOf(doc).pageItems;
  // paths() walks groups and compounds, not a layer: start from its items.
  for (var w9 = 0; w9 < fillItems.length; w9++) paths(fillItems[w9], whites);
  var inFigure = function (a) {
    var gx = Math.floor(((a[0] - ab[0]) / (ab[2] - ab[0])) * F.n), gy = Math.floor(((ab[1] - a[1]) / (ab[1] - ab[3])) * F.n);
    return gx >= 0 && gy >= 0 && gx < F.n && gy < F.n && F.cells.charAt(gy * F.n + gx) === '1';
  };
  for (var w0 = 0; w0 < whites.length; w0++) {
    var wp = whites[w0];
    try { if (!wp.filled || wp.fillColor.typename !== 'RGBColor' || wp.fillColor.red < 250 || wp.fillColor.green < 250 || wp.fillColor.blue < 250) continue; } catch (e6) { continue; }
    // Sample the shape's area, not its corners: a white triangle between a
    // disc's edge, a sign and its post has corners on the figures but lies
    // outside them. Points on a grid over its bounds, kept when inside its
    // anchor polygon, tested against the figure map.
    var poly = [], n0 = wp.pathPoints.length;
    for (var w1 = 0; w1 < n0; w1++) poly.push(wp.pathPoints[w1].anchor);
    var gb = wp.geometricBounds, inside = 0, out = 0;
    for (var sy = 0; sy < 8; sy++)
      for (var sx = 0; sx < 8; sx++) {
        var pt = [gb[0] + ((sx + 0.5) / 8) * (gb[2] - gb[0]), gb[1] - ((sy + 0.5) / 8) * (gb[1] - gb[3])];
        var hit = false;
        for (var e = 0, f = poly.length - 1; e < poly.length; f = e++)
          if ((poly[e][1] > pt[1]) !== (poly[f][1] > pt[1]) && pt[0] < ((poly[f][0] - poly[e][0]) * (pt[1] - poly[e][1])) / (poly[f][1] - poly[e][1]) + poly[e][0]) hit = !hit;
        if (!hit) continue;
        inside++;
        if (!inFigure(pt)) out++;
      }
    // A thin strip catches few grid points: judge it by its anchors.
    var anchorsOut = 0;
    for (var w3 = 0; w3 < n0; w3++) if (!inFigure(poly[w3])) anchorsOut++;
    if (inside >= 4 ? out >= 0.6 * inside : n0 && anchorsOut >= 0.7 * n0) outsideWhite.push(wp);
  }
  var whiteGone = 0;
  for (var w2 = 0; w2 < outsideWhite.length; w2++) { try { outsideWhite[w2].remove(); whiteGone++; } catch (e7) {} }
  log.push('white outside the figures removed ' + whiteGone);
}
// Paper underlay under the subject, traced from the mask: one shape per
// figure (a hen and a chick standing apart each get theirs), with the holes
// the mask has (between legs) kept open.
if (P.mask) {
  var mp = fillLayerOf(doc).placedItems.add();
  mp.file = new File(P.mask);
  mp.width = ab[2] - ab[0]; mp.height = ab[1] - ab[3]; mp.position = [ab[0], ab[1]];
  var mt = mp.trace(), mo = retry(function () { var o = mt.tracing.tracingOptions; o.tracingMode = TracingModeType.TRACINGMODEBLACKANDWHITE; return o; });
  mo.threshold = 128;
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
    under.name = 'Underlay';
    for (var u3 = 0; u3 < ups.length; u3++) { ups[u3].filled = true; ups[u3].stroked = false; ups[u3].fillColor = rgb(P.palette.paper); }
    underlays++; underArea += ma;
  }
  mg.remove();
  log.push('underlay ' + underlays + ' shape' + (underlays === 1 ? '' : 's') + ', ' + Math.round(underArea) + ' pt2');
}
doc.save();
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

function runJsx(code) {
  const file = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'illustrator-trace-')),
    'trace.jsx',
  );
  fs.writeFileSync(file, code);
  const script = `with timeout of 1800 seconds
  tell application ${JSON.stringify(
    app,
  )} to do javascript (read POSIX file ${JSON.stringify(file)} as «class utf8»)
end timeout`;
  return execFileSync('osascript', ['-e', script], {
    encoding: 'utf8',
    timeout: 1860000,
  }).trim();
}
let result = runJsx(jsx);
if (params.linesPng) {
  const strokes = fs.existsSync(params.strokesJson)
    ? JSON.parse(fs.readFileSync(params.strokesJson, 'utf8'))
    : null;
  const subject = underlaySubject(
    img,
    disc,
    ground,
    readPng(params.linesPng),
    strokes,
    parts ? parts.holes : null,
    vehicle,
  );
  params.mask = savePng(img.w, img.h, k => subject[k], 'underlay.png');
  if (subject.edge)
    result += ` | paper edge: ${subject.edge.chords} chords, ${subject.edge.removed} px off, ${subject.edge.added} px on`;
  params.figures = figureCells(img, subject.interior);
  result += ' | ' + runJsx(jsx2(params));
}
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
  if (vehicle) out = markVehicle(out);
  for (const [, values] of Object.entries(PALETTE)) {
    const from = values[0];
    out = out.replace(new RegExp(from, 'gi'), `__${values[idx].slice(1)}__`);
  }
  out = out
    .replace(/__([0-9A-F]{6})__/g, '#$1')
    .replace(/__BACKDROP__/g, backdropFill(mode))
    .replace(/__VEHICLE__/g, mode === 'darkmode' ? '#999AA7' : '#FFFFFF')
    .replace(/__WINDOW__/g, mode === 'darkmode' ? '#FFEEB3' : '#626493');
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

// On a vehicle (--vehicle), marks the white fills, the underlay among them,
// as the vehicle body and the ink fills named Window as windows, so the mode
// mapping gives them the library's vehicle roles (palette.md: vehicle,
// window). The glints stay paper.
function markVehicle(svg) {
  return svg.replace(/<(?:path|rect|polygon|circle|ellipse)\b[^>]*>/g, tag => {
    const id = (tag.match(/\bid="([^"]*)"/) || [])[1] || '';
    if (/^Window/.test(id))
      return tag.replace(/fill="#181C56"/i, 'fill="__WINDOW__"');
    if (/^Glint/.test(id)) return tag;
    return tag.replace(/fill="#FFFFFF"/i, 'fill="__VEHICLE__"');
  });
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
  const rgb = new Uint8Array(w * h * 3);
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
      // Transparent pixels count as white: flattened onto paper (see below).
      const a = bpp === 4 ? line[x * bpp + 3] / 255 : 1;
      const [r, g, bl] = [0, 1, 2].map(c =>
        Math.round(line[x * bpp + c] * a + 255 * (1 - a)),
      );
      lum[y * w + x] = (r * 3 + g * 6 + bl) / 10;
      blueish[y * w + x] = bl >= r && bl >= g ? 1 : 0;
      rgb.set([r, g, bl], (y * w + x) * 3);
    }
    prev = line;
  }
  return { w, h, lum, blueish, rgb, alpha: type === 6 };
}

// A draft with an alpha channel, written again as plain RGB on white:
// Illustrator's Image Trace reads clear pixels as black, so a transparent
// library PNG traced as one dark square.
function flattened({ w, h, rgb }) {
  const rows = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++)
    Buffer.from(rgb.buffer, y * w * 3, w * 3).copy(rows, y * (w * 3 + 1) + 1);
  return writePng(w, h, rows, 'draft.png');
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
  // A smaller animal in a group has a proportionally smaller eye: a dot down
  // to (0.0045·w)² still counts when it is round, solid and stands free, with
  // no other ink within a few pixels — specks on lines and in hatching do not.
  const free = c => {
    const pad = Math.max(2, Math.round(0.003 * w));
    for (let y = Math.max(0, c.y0 - pad); y <= Math.min(h - 1, c.y1 + pad); y++)
      for (
        let x = Math.max(0, c.x0 - pad);
        x <= Math.min(w - 1, c.x1 + pad);
        x++
      ) {
        const inside = x >= c.x0 && x <= c.x1 && y >= c.y0 && y <= c.y1;
        if (!inside && dark[y * w + x]) return false;
      }
    return true;
  };
  const fill = c => c.n / (box(c)[0] * box(c)[1]);
  const dots = components(dark, w, h).filter(
    c =>
      small(c) &&
      round(c) &&
      ((c.n >= (0.006 * w) ** 2 && fill(c) >= 0.45) ||
        (c.n >= (0.0045 * w) ** 2 &&
          Math.max(...box(c)) / Math.min(...box(c)) <= 1.5 &&
          fill(c) >= 0.6 &&
          free(c))),
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
function draftSubject(img, disc, ground, grow = 5, sides = false) {
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
  // Everything reachable from the image edge without crossing a wall.
  const flood = walls => {
    const reached = new Uint8Array(w * h);
    const stack = [];
    for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
    while (stack.length) {
      const k = stack.pop();
      if (reached[k] || walls[k]) continue;
      const x = k % w;
      const y = (k - x) / w;
      if (
        disc &&
        (x - disc.cx) ** 2 + (y - disc.cy) ** 2 < (disc.r - 6) ** 2 &&
        lum[k] > 238
      )
        continue;
      reached[k] = 1;
      if (x > 0) stack.push(k - 1);
      if (x < w - 1) stack.push(k + 1);
      if (y > 0) stack.push(k - w);
      if (y < h - 1) stack.push(k + w);
    }
    return reached;
  };
  // Walls close gaps up to about 10 px at 1024. Closing wider (16 px) would
  // give a seagull's far wing its paper, but bridges paper between figures
  // standing close (a hen and a chick, two doves), which is worse.
  const wall = growBy(ink, grow);
  if (sides) closeSides(wall, ink, w, h);
  const outside = flood(wall);
  // Shrink back so the underlay sits just inside the lines, then drop thin
  // spurs (a ground dash touching a paw) by shrinking and regrowing the
  // inside: they would show as pale slivers in dark mode.
  // The inside of the figures without their line walls, for removing white
  // pieces that lie outside every figure (pass two).
  const interior = outside.map((v, k) => (!v && !wall[k] ? 1 : 0));
  const shrunk = growBy(outside, Math.max(1, grow - 1));
  const core = growBy(shrunk, grow + 3).map(v => 1 - v);
  const outer = growBy(core, grow + 3).map(v => 1 - v); // 1 = background
  // Pull the edge in under the middle of the line. The trace gives lines a
  // width profile that thins toward the ends; paper reaching the line's outer
  // edge would show past those ends as a white rim in dark mode.
  const pull = Math.max(1, Math.round(0.003 * w));
  const inner = erode(
    outer.map(v => 1 - v),
    w,
    h,
    pull,
  );
  for (let k = 0; k < w * h; k++) outer[k] = inner[k] ? 0 : 1;
  if (ground) {
    // Paper stops at the top of the ground line: below it, it would show as a
    // pale strip under the feet in dark mode. Except inside a closed figure
    // that crosses the line (an egg sitting in the grass): what stays
    // enclosed once the ground line itself is taken out of the walls. A
    // contour crossing the line keeps its pixels in the band — there is ink
    // just above and below it — so only the line goes.
    const lineless = ink.slice();
    const reach = 3;
    const inkNear = (y, x) => {
      if (y < 0 || y >= h) return false;
      for (let dx = -2; dx <= 2; dx++) {
        const xx = x + dx;
        if (xx >= 0 && xx < w && ink[y * w + xx]) return true;
      }
      return false;
    };
    for (let y = ground.top; y <= ground.bottom; y++)
      for (let x = 0; x < w; x++)
        if (
          ink[y * w + x] &&
          !(inkNear(ground.top - reach, x) && inkNear(ground.bottom + reach, x))
        )
          lineless[y * w + x] = 0;
    const open = flood(growBy(lineless, grow));
    for (let k = ground.top * w; k < w * h; k++)
      if (outer[k] || open[k]) outer[k] = 1;
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
  const subject = outer.map(v => 1 - v);
  subject.interior = interior;
  return subject;
}

// Grows a mask by r pixels (square), correct at the image edges.
function dilate(mask, w, h, r) {
  const t = new Uint8Array(w * h);
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0, last = -Infinity; x < w; x++) {
      if (mask[y * w + x]) last = x;
      t[y * w + x] = x - last <= r ? 1 : 0;
    }
    for (let x = w - 1, last = Infinity; x >= 0; x--) {
      if (mask[y * w + x]) last = x;
      if (last - x <= r) t[y * w + x] = 1;
    }
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0, last = -Infinity; y < h; y++) {
      if (t[y * w + x]) last = y;
      out[y * w + x] = y - last <= r ? 1 : 0;
    }
    for (let y = h - 1, last = Infinity; y >= 0; y--) {
      if (t[y * w + x]) last = y;
      if (last - y <= r) out[y * w + x] = 1;
    }
  }
  return out;
}

// A vehicle drawn in side view is often left open at one end: the last car
// of a train runs off with its lines and no end line, as in the library's
// train, whose body is grey right up to where its lines start. Walls at the
// left and right edge of the ink, from its top to its bottom, close those
// ends; the sky above the roof and the space below the body stay open at the
// top and bottom.
function closeSides(wall, ink, w, h) {
  let x0 = w;
  let x1 = -1;
  let y0 = h;
  let y1 = -1;
  for (let k = 0; k < w * h; k++)
    if (ink[k]) {
      const x = k % w;
      const y = (k - x) / w;
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    }
  if (x1 < 0) return;
  for (let y = y0; y <= y1; y++)
    for (const x of [x0, x0 + 1, x1 - 1, x1]) wall[y * w + x] = 1;
}

// The underlay: the draft's silhouette (draftSubject) cut back to the
// finished lines, rendered in pass one. Inside the lines means: not reached
// from the edge once gaps up to 2 % of the width are closed, and the edge
// then pulled in to about the middle of the line. The draft decides what is
// figure (open contours, the space between two birds); the lines decide
// where its edge is, so paper no longer shows past a fur mark simplify
// removed, or past a line end that thins.
function underlaySubject(
  img,
  disc,
  ground,
  lines,
  strokes,
  holes,
  vehicle = false,
) {
  const { w, h } = img;
  // A vehicle's contour is open in wider gaps than an animal's (a bus's
  // front and back), and a train's last car runs off its open end: close
  // gaps up to 2 % of the width and wall off the vehicle's sides (closeSides).
  const draft = vehicle
    ? draftSubject(img, disc, ground, Math.round(0.01 * w), true)
    : draftSubject(img, disc, ground);
  const ink = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const lx = Math.min(lines.w - 1, Math.floor((x * lines.w) / w));
      const ly = Math.min(lines.h - 1, Math.floor((y * lines.h) / h));
      ink[y * w + x] = lines.lum[ly * lines.w + lx] < 128 ? 1 : 0;
    }
  const gap = Math.max(2, Math.round(0.02 * w));
  const wall = dilate(ink, w, h, gap);
  if (vehicle) closeSides(wall, ink, w, h);
  const outside = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const k = stack.pop();
    if (outside[k] || wall[k]) continue;
    outside[k] = 1;
    const x = k % w;
    if (x > 0) stack.push(k - 1);
    if (x < w - 1) stack.push(k + 1);
    if (k >= w) stack.push(k - w);
    if (k < w * h - w) stack.push(k + w);
  }
  const pull = Math.max(1, Math.round(0.003 * w));
  const beyond = dilate(outside, w, h, gap + pull);
  const subject = draft.map((v, k) => (v && !beyond[k] ? 1 : 0));
  // Inside the disc white counts as figure (draftSubject), but outside it a
  // fluffy outline's gaps let the background in, so the draft's paper can
  // stop exactly at the disc's edge (a white Samoyed: paper on the upper
  // body, none below the circle). Continue it there: from paper on the disc's
  // rim into what the finished lines enclose and is not paper yet. Only a
  // piece that touches such a cut grows, so a pocket between two figures
  // the lines happen to close stays open; below the ground line nothing grows.
  let continued = 0;
  if (disc) {
    const rim = disc.r - 6;
    // Inside the lines closed a little tighter than above: wide closing also
    // fills hollows just outside a contour (beside a dove's tail).
    const tight = Math.max(2, Math.round(0.016 * w));
    const tightWall = dilate(ink, w, h, tight);
    const tightOut = new Uint8Array(w * h);
    const fill = [];
    for (let x = 0; x < w; x++) fill.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) fill.push(y * w, y * w + w - 1);
    while (fill.length) {
      const k = fill.pop();
      if (tightOut[k] || tightWall[k]) continue;
      tightOut[k] = 1;
      const x = k % w;
      if (x > 0) fill.push(k - 1);
      if (x < w - 1) fill.push(k + 1);
      if (k >= w) fill.push(k - w);
      if (k < w * h - w) fill.push(k + w);
    }
    const tightBeyond = dilate(tightOut, w, h, tight + pull);
    // Never across a finished line: growth spreads only through the gaps a
    // fluffy outline leaves, so it stops at a dove's drawn contour.
    const open = k => !tightBeyond[k] && !subject[k] && !ink[k];
    const grown = new Uint8Array(w * h);
    const queue = [];
    const y0 = Math.max(1, Math.floor(disc.cy - rim - 3));
    const y1 = Math.min(h - 2, Math.ceil(disc.cy + rim + 3));
    for (let y = y0; y <= y1; y++)
      for (let x = 1; x < w - 1; x++) {
        const k = y * w + x;
        if (!subject[k]) continue;
        // The paper's edge sits a little inside the rim: the draft's mask is
        // shrunk and pulled under the lines after the flood.
        const d = Math.hypot(x - disc.cx, y - disc.cy);
        if (d < rim - 0.015 * w || d > rim + 3) continue;
        for (const q of [k - 1, k + 1, k - w, k + w]) {
          const qx = q % w;
          const qy = (q - qx) / w;
          if (Math.hypot(qx - disc.cx, qy - disc.cy) < d) continue;
          if (open(q) && !grown[q]) {
            grown[q] = 1;
            queue.push(q);
          }
        }
      }
    // Grow each piece from its own seeds, and keep it only when the cut it
    // continues is long — a body cut by the circle (the Samoyed's) runs for a
    // good stretch of the rim; a white pocket that happens to reach inside
    // the disc touches it for a few pixels.
    const stop = ground ? ground.top * w : w * h;
    const piece = new Int32Array(w * h);
    const seedsOf = [0];
    let id = 0;
    for (const seed of queue) {
      if (piece[seed]) {
        seedsOf[piece[seed]]++;
        continue;
      }
      id++;
      seedsOf.push(1);
      piece[seed] = id;
      const stack = [seed];
      while (stack.length) {
        const k = stack.pop();
        const x = k % w;
        for (const q of [
          x > 0 ? k - 1 : -1,
          x < w - 1 ? k + 1 : -1,
          k - w,
          k + w,
        ])
          if (q >= 0 && q < stop && !piece[q] && open(q)) {
            piece[q] = id;
            stack.push(q);
          }
      }
    }
    const longCut = 0.05 * w;
    for (let k = 0; k < w * h; k++)
      if (piece[k] && seedsOf[piece[k]] >= longCut) {
        grown[k] = 1;
        subject[k] = 1;
        continued++;
      } else grown[k] = 0;
    subject.grown = grown;
    subject.cuts = seedsOf.slice(1);
  }
  subject.continued = continued;
  // The paper's edge along the strokes (rule 21), before the footprint and
  // the smoothing.
  if (strokes) subject.edge = strokeEdge(subject, ink, strokes, ground, w, h);
  // The ground line runs behind the body (animals and people stand in front
  // of it): where the body stands on the line, its paper covers the line's
  // thickness, down to just past its bottom edge — not below, which would
  // show as a pale strip under the feet. The plain ground line is on a layer
  // under the fills, so it disappears behind the body there.
  if (ground) {
    // The drawn ground line is detail weight with a little tremor, thicker
    // than a thin line in the draft: cover about 0.6 % of the width either
    // side of its centre. A body counts as standing on it when its paper
    // comes that close above it.
    const centre = (ground.top + ground.bottom + 1) / 2;
    const reach = Math.max(3, Math.round(0.006 * w));
    const from = Math.max(0, Math.floor(centre - reach));
    const foot = Math.min(h - 1, Math.ceil(centre + reach));
    for (let x = 0; x < w; x++) {
      let stands = false;
      for (let y = Math.max(0, from - reach); y < from; y++)
        if (subject[y * w + x]) stands = true;
      if (!stands) continue;
      for (let y = from; y <= foot; y++) subject[y * w + x] = 1;
    }
  }
  // An object's holes (discParts): no paper inside an empty ring on the disc,
  // nor under its line, so the disc shows there in every mode.
  if (holes) {
    const cut = dilate(holes, w, h, Math.max(2, Math.round(0.012 * w)));
    for (let k = 0; k < w * h; k++) if (cut[k]) subject[k] = 0;
  }
  // Smooth the edge: the square grow and shrink steps leave stairs on a
  // diagonal or ragged edge (a fluffy chest against the disc), which show in
  // both modes. A box blur of about 4 px at 1024, thresholded at half,
  // rounds them off without moving the edge.
  const r = Math.max(2, Math.round(0.004 * w));
  const across = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    let sum = 0;
    for (let x = -r; x < w; x++) {
      if (x + r < w) sum += subject[y * w + x + r];
      if (x - r - 1 >= 0) sum -= subject[y * w + x - r - 1];
      if (x >= 0) across[y * w + x] = sum;
    }
  }
  const side = (2 * r + 1) ** 2;
  const keepGrown = subject.grown;
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let y = -r; y < h; y++) {
      if (y + r < h) sum += across[(y + r) * w + x];
      if (y - r - 1 >= 0) sum -= across[(y - r - 1) * w + x];
      if (y >= 0) subject[y * w + x] = sum * 2 >= side ? 1 : 0;
    }
  }
  if (keepGrown) subject.grown = keepGrown;
  // Inside a figure in both the draft and the finished lines: a cloud that
  // closes against a wing in the draft but stays open in the lines is not.
  subject.interior = draft.interior.map((v, k) =>
    (v && !outside[k]) || (subject[k] && !draft[k] && !beyond[k]) ? 1 : 0,
  );
  return subject;
}

// The paper's edge follows the strokes (rule 21), the way a designer cuts it
// by hand: along each contour stroke, and across a gap between two strokes
// in a straight line. Walking round the paper's outline, each contour stroke
// hands over to the next one: from its free end the edge goes on in the
// stroke's own direction until it meets the next stroke (a back line carries
// on behind the tail, so the notch between them stays background), else
// from end to end, else between the nearest points. Paper past these chords
// goes and a dent short of them fills, but only near the edge: nothing
// changes deeper than 1.5 % of the width, no chord runs to the ground line,
// and the ground band keeps its footprint. Against a designer's own cut of
// a Samoyed this takes the visible difference down by about 40 %.
function strokeEdge(subject, ink, strokes, ground, w, h) {
  const [ax0, ay0, ax1, ay1] = strokes.ab;
  const sx = w / (ax1 - ax0);
  const sy = h / (ay0 - ay1);
  const at = (x, y) => {
    const xx = Math.round(x);
    const yy = Math.round(y);
    return xx >= 0 && yy >= 0 && xx < w && yy < h ? yy * w + xx : -1;
  };
  const bez = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    const f = i =>
      u * u * u * p0[i] +
      3 * u * u * t * p1[i] +
      3 * u * t * t * p2[i] +
      t * t * t * p3[i];
    return [f(0), f(1)];
  };
  // Centre-line points per path, and which path each stroke pixel is.
  const lines = [];
  const sid = new Int32Array(w * h).fill(-1);
  for (const s of strokes.items) {
    const a = s.pts;
    const segs = s.closed ? a.length : a.length - 1;
    const pts = [];
    for (let i = 0; i < segs; i++) {
      const p = a[i];
      const q = a[(i + 1) % a.length];
      const n = Math.max(
        8,
        Math.ceil((Math.hypot(q[0] - p[0], q[1] - p[1]) * sx) / 2),
      );
      for (let k = i ? 1 : 0; k <= n; k++) {
        const [x, y] = bez(
          [p[0], p[1]],
          [p[4], p[5]],
          [q[2], q[3]],
          [q[0], q[1]],
          k / n,
        );
        pts.push([(x - ax0) * sx, (ay0 - y) * sy]);
      }
    }
    if (!pts.length) continue;
    const id =
      lines.push({
        pts,
        free: !s.closed && s.kind === 'line',
        ground: s.kind === 'ground',
      }) - 1;
    const rad = Math.max(1, Math.round(((s.sw || 1) * sx) / 2));
    for (const [x, y] of pts)
      for (let dy = -rad; dy <= rad; dy++)
        for (let dx = -rad; dx <= rad; dx++) {
          if (dx * dx + dy * dy > rad * rad) continue;
          const k = at(x + dx, y + dy);
          if (k >= 0) sid[k] = id;
        }
  }
  if (!lines.length) return { chords: 0, removed: 0, added: 0 };
  // The nearest path to each pixel near the strokes.
  const R = Math.max(2, Math.round(0.012 * w));
  const nid = sid.slice();
  const dist = new Int32Array(w * h).fill(R + 1);
  let front = [];
  for (let k = 0; k < w * h; k++)
    if (sid[k] >= 0) {
      dist[k] = 0;
      front.push(k);
    }
  for (let d = 1; d <= R && front.length; d++) {
    const next = [];
    for (const k of front) {
      const x = k % w;
      for (const n of [
        x > 0 ? k - 1 : -1,
        x < w - 1 ? k + 1 : -1,
        k - w,
        k + w,
      ])
        if (n >= 0 && n < w * h && dist[n] > d) {
          dist[n] = d;
          nid[n] = nid[k];
          next.push(n);
        }
    }
    front = next;
  }
  // The outer outline of each piece of paper, in order (Moore tracing).
  const D = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];
  const outline = start => {
    const loop = [start];
    let c = start;
    let b = start - 1;
    let first = -1;
    for (let step = 0; step < 4 * w * h; step++) {
      const cx = c % w;
      const cy = (c - cx) / w;
      const db = D.findIndex(
        ([dx, dy]) => dx === (b % w) - cx && dy === Math.floor(b / w) - cy,
      );
      let next = -1;
      let nb = b;
      for (let i = 1; i <= 8; i++) {
        const d = (db + i) % 8;
        const x = cx + D[d][0];
        const y = cy + D[d][1];
        if (x >= 0 && y >= 0 && x < w && y < h && subject[y * w + x]) {
          next = y * w + x;
          const pd = (db + i - 1) % 8;
          nb = (cy + D[pd][1]) * w + cx + D[pd][0];
          break;
        }
      }
      if (next < 0 || (c === start && next === first)) break;
      if (first < 0) first = next;
      b = nb;
      c = next;
      loop.push(c);
    }
    loop.pop();
    return loop;
  };
  // Pieces of a mask as pixel lists; the first is the top-left pixel.
  const pieces = mask => {
    const seen = new Uint8Array(w * h);
    const all = [];
    for (let k0 = 0; k0 < w * h; k0++) {
      if (!mask[k0] || seen[k0]) continue;
      const part = [k0];
      seen[k0] = 1;
      for (let i = 0; i < part.length; i++) {
        const p = part[i];
        const x = p % w;
        for (const q of [
          x > 0 ? p - 1 : -1,
          x < w - 1 ? p + 1 : -1,
          p - w,
          p + w,
        ])
          if (q >= 0 && q < w * h && mask[q] && !seen[q]) {
            seen[q] = 1;
            part.push(q);
          }
      }
      all.push(part);
    }
    return all;
  };
  const loops = pieces(subject)
    .filter(part => part.length > 0.002 * w * h)
    .map(part => outline(part[0]));
  // Chords between consecutive contour strokes.
  const E = 0.035 * w;
  const reach = 0.06 * w;
  const cone = Math.cos((35 * Math.PI) / 180);
  const freeEnd = (id, p) => {
    const L = lines[id];
    if (!L.free) return null;
    const n = L.pts.length;
    const d0 = Math.hypot(L.pts[0][0] - p[0], L.pts[0][1] - p[1]);
    const d1 = Math.hypot(L.pts[n - 1][0] - p[0], L.pts[n - 1][1] - p[1]);
    if (Math.min(d0, d1) > E) return null;
    const last = d1 < d0;
    const e = last ? L.pts[n - 1] : L.pts[0];
    // Its direction over the last 1.2 % of the width.
    const step = last ? -1 : 1;
    let j = last ? n - 1 : 0;
    for (
      let acc = 0;
      j + step >= 0 && j + step < n && acc < 0.012 * w;
      j += step
    )
      acc += Math.hypot(
        L.pts[j + step][0] - L.pts[j][0],
        L.pts[j + step][1] - L.pts[j][1],
      );
    const t = [e[0] - L.pts[j][0], e[1] - L.pts[j][1]];
    const tl = Math.hypot(t[0], t[1]) || 1;
    return { e, t: [t[0] / tl, t[1] / tl] };
  };
  const ahead = (f, id) => {
    let best = null;
    let bd = reach;
    for (const q of lines[id].pts) {
      const v = [q[0] - f.e[0], q[1] - f.e[1]];
      const d = Math.hypot(v[0], v[1]);
      if (d < 1 || d > bd || (v[0] * f.t[0] + v[1] * f.t[1]) / d < cone)
        continue;
      bd = d;
      best = q;
    }
    return best;
  };
  const nearestOn = (id, p) => {
    let best = lines[id].pts[0];
    let bd = Infinity;
    for (const q of lines[id].pts) {
      const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
      if (d < bd) {
        bd = d;
        best = q;
      }
    }
    return best;
  };
  const xy = k => [k % w, Math.floor(k / w)];
  const walls = ink.slice();
  let chords = 0;
  for (const loop of loops) {
    const n = loop.length;
    const runs = [];
    for (let i = 0; i < n; i++) {
      const id = dist[loop[i]] <= R ? nid[loop[i]] : -1;
      const r = runs[runs.length - 1];
      if (r && r.id === id) r.end = i;
      else runs.push({ id, start: i, end: i });
    }
    const wrap = list => {
      if (list.length > 1 && list[0].id === list[list.length - 1].id)
        list[0].start = list.pop().start - n;
      return list;
    };
    const kept = [];
    for (const r of wrap(runs)) {
      if (r.id < 0 || r.end - r.start + 1 < 0.006 * w) continue;
      const m = kept[kept.length - 1];
      if (m && m.id === r.id) m.end = r.end;
      else kept.push({ ...r });
    }
    wrap(kept);
    for (let i = 0; i < kept.length; i++) {
      const A = kept[i];
      const B = kept[(i + 1) % kept.length];
      // No chord to or from the ground line: the gap between two feet
      // stays background, and the footprint decides the line itself.
      if (A.id === B.id || lines[A.id].ground || lines[B.id].ground) continue;
      const exit = xy(loop[((A.end % n) + n) % n]);
      const entry = xy(loop[((B.start % n) + n) % n]);
      const fa = freeEnd(A.id, exit);
      const fb = freeEnd(B.id, entry);
      let pa;
      let pb;
      let c;
      if (fa && (c = ahead(fa, B.id))) [pa, pb] = [fa.e, c];
      else if (fb && (c = ahead(fb, A.id))) [pa, pb] = [c, fb.e];
      else if (fa && fb) [pa, pb] = [fa.e, fb.e];
      else {
        pa = fa ? fa.e : nearestOn(A.id, exit);
        pb = fb ? fb.e : nearestOn(B.id, pa);
      }
      const len = Math.ceil(Math.hypot(pb[0] - pa[0], pb[1] - pa[1]));
      if (len <= 2) continue;
      chords++;
      for (let t = 0; t <= len; t++) {
        const k = at(
          pa[0] + ((pb[0] - pa[0]) * t) / len,
          pa[1] + ((pb[1] - pa[1]) * t) / len,
        );
        if (k < 0) continue;
        for (const q of [k, k - 1, k + 1, k - w, k + w])
          if (q >= 0 && q < w * h) walls[q] = 1;
      }
    }
  }
  // Outside the strokes and chords, the edge pulled to the middle of a line.
  const wall = dilate(walls, w, h, 1);
  const out = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const k = stack.pop();
    if (out[k] || wall[k]) continue;
    out[k] = 1;
    const x = k % w;
    if (x > 0) stack.push(k - 1);
    if (x < w - 1) stack.push(k + 1);
    if (k >= w) stack.push(k - w);
    if (k < w * h - w) stack.push(k + w);
  }
  const outside = dilate(out, w, h, 1 + Math.max(1, Math.round(0.003 * w)));
  const depth = Math.max(2, Math.round(0.015 * w));
  const deep = erode(subject, w, h, depth);
  const near = dilate(subject, w, h, depth);
  const centre = ground ? (ground.top + ground.bottom + 1) / 2 : -Infinity;
  const band = Math.round(0.012 * w);
  const free = k => Math.abs(Math.floor(k / w) - centre) > band;
  const before = subject.slice();
  let removed = 0;
  let added = 0;
  for (const part of pieces(before.map((v, k) => (v && outside[k] ? 1 : 0)))) {
    if (part.some(k => deep[k])) continue;
    for (const k of part)
      if (free(k)) {
        subject[k] = 0;
        removed++;
      }
  }
  for (const part of pieces(
    before.map((v, k) => (!v && !outside[k] ? 1 : 0)),
  )) {
    if (!part.every(k => near[k])) continue;
    for (const k of part)
      if (free(k)) {
        subject[k] = 1;
        added++;
      }
  }
  return { chords, removed, added };
}

// A coarse map of where figures are: their insides without the line walls,
// grown back over the lines. White outside it is never wanted — a sliver
// along an open line (a cloud), a crescent beside a figure.
function figureCells(img, interior, n = 256) {
  const { w, h } = img;
  const near = dilate(interior, w, h, Math.max(2, Math.round(0.008 * w)));
  let cells = '';
  for (let gy = 0; gy < n; gy++)
    for (let gx = 0; gx < n; gx++) {
      let on = 0;
      for (
        let y = Math.floor((gy * h) / n);
        y < Math.floor(((gy + 1) * h) / n) && !on;
        y++
      )
        for (
          let x = Math.floor((gx * w) / n);
          x < Math.floor(((gx + 1) * w) / n);
          x++
        )
          if (near[y * w + x]) {
            on = 1;
            break;
          }
      cells += on ? '1' : '0';
    }
  return { n, cells };
}

// Writes a black-on-white 8-bit RGB PNG to a temporary folder: black where
// black(k) holds. Illustrator's black-and-white trace turns it into fills.
function savePng(w, h, black, name) {
  const rows = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    rows[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const v = black(y * w + x) ? 0 : 255;
      rows.fill(v, y * (w * 3 + 1) + 1 + x * 3, y * (w * 3 + 1) + 4 + x * 3);
    }
  }
  return writePng(w, h, rows, name);
}

// An 8-bit RGB PNG from filtered rows (filter byte 0), in a temporary folder.
function writePng(w, h, rows, name) {
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
    name,
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

// Solid ink masses (animals): wing and tail tips, hooves, a dark patch. The
// colour trace keeps an ink area only when its mean width is large, and
// white streaks between feathers pull that under, so a feathered tip goes.
// Here the ink is opened instead — what survives an erosion of about 4 px
// at 1024, grown back and cut with the ink again so the gaps stay white —
// and pieces of at least 400 px at 1024 are kept. Lines are too thin to
// survive, and so do pieces lying wholly in the band of the ground line (a
// thick dash), which the ground step replaces. Returns the mask's file and
// how many masses it holds, or null.
function inkMasses({ w, h, lum }, ground) {
  const ink = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) ink[k] = lum[k] < 110 ? 1 : 0;
  const r = Math.max(2, Math.round(0.004 * w));
  const core = erode(ink, w, h, r);
  const near = erode(
    core.map(v => 1 - v),
    w,
    h,
    r + 2,
  ).map(v => 1 - v);
  const mass = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) mass[k] = near[k] && ink[k] ? 1 : 0;
  const keep = new Uint8Array(w * h);
  const seen = new Uint8Array(w * h);
  const min = (400 / (1024 * 1024)) * w * h;
  let count = 0;
  for (let k = 0; k < w * h; k++) {
    if (!mass[k] || seen[k]) continue;
    const part = [k];
    seen[k] = 1;
    for (let i = 0; i < part.length; i++) {
      const p = part[i];
      const x = p % w;
      for (const q of [
        x > 0 ? p - 1 : -1,
        x < w - 1 ? p + 1 : -1,
        p - w,
        p + w,
      ])
        if (q >= 0 && q < w * h && mass[q] && !seen[q]) {
          seen[q] = 1;
          part.push(q);
        }
    }
    if (part.length < min) continue;
    if (ground) {
      let y0 = h;
      let y1 = 0;
      for (const p of part) {
        const y = Math.floor(p / w);
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
      const pad = 0.012 * h;
      if (y0 >= ground.top - pad && y1 <= ground.bottom + pad) continue;
    }
    count++;
    for (const p of part) keep[p] = 1;
  }
  return count ? { file: savePng(w, h, k => keep[k], 'ink.png'), count } : null;
}

// A vehicle's windows in the draft: solid dark areas left once the ink is
// opened (lines are too thin to survive), at least 1.5 % of the width
// across, filling most of their box, and centred in the upper three quarters
// of the vehicle. Wheels, tyres and small dark details sit lower or are
// smaller. On the library's bus, train, tram, boat and scooter this finds
// exactly the fills that turn Canary 30 in their dark files. Returned as a
// cell map for pass one.
function vehicleWindows(img, n = 256) {
  const { w, h, lum } = img;
  const ink = new Uint8Array(w * h);
  let vy0 = h;
  let vy1 = 0;
  for (let k = 0; k < w * h; k++)
    if (lum[k] < 120) {
      ink[k] = 1;
      const y = Math.floor(k / w);
      vy0 = Math.min(vy0, y);
      vy1 = Math.max(vy1, y);
    }
  const r = Math.max(2, Math.round(0.0045 * w));
  const opened = dilate(erode(ink, w, h, r), w, h, r);
  const masses = opened.map((v, k) => (v && ink[k] ? 1 : 0));
  const windows = new Uint8Array(w * h);
  const seen = new Uint8Array(w * h);
  let count = 0;
  for (let k0 = 0; k0 < w * h; k0++) {
    if (!masses[k0] || seen[k0]) continue;
    const part = [k0];
    seen[k0] = 1;
    let x0 = w;
    let x1 = 0;
    let y0 = h;
    let y1 = 0;
    for (let i = 0; i < part.length; i++) {
      const p = part[i];
      const x = p % w;
      const y = (p - x) / w;
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
      for (const q of [
        x > 0 ? p - 1 : -1,
        x < w - 1 ? p + 1 : -1,
        p - w,
        p + w,
      ])
        if (q >= 0 && q < w * h && masses[q] && !seen[q]) {
          seen[q] = 1;
          part.push(q);
        }
    }
    const box = (x1 - x0 + 1) * (y1 - y0 + 1);
    if (
      part.length >= (0.015 * w) ** 2 &&
      part.length >= 0.55 * box &&
      (y0 + y1) / 2 < vy0 + 0.75 * (vy1 - vy0)
    ) {
      count++;
      for (const k of part) windows[k] = 1;
    }
  }
  const map = figureCells(img, windows, n);
  map.count = count;
  return map;
}

// On an object (`--object`), the disc's pale grey-lavender inside the disc
// is the disc showing through, except where it is a face of the object: a
// pale area closed in by lines (most of its edge is ink) that lies on the
// object (paper takes up 40 % or more of the ring just beyond its line), such
// as a card's chip. The others are not faces: a strip between a line and its
// paper, where the draft's paper sits a little off the line (it touches the
// paper directly), and the inside of an empty ring or another pocket closed
// off on the disc. The trace kept them as tint, an opaque grey in dark mode
// and a light rim in contrast mode. Returns the faces as a cell map for pass
// one, which keeps only tint fills lying on them, and the holes (pockets
// that neither touch the paper nor lie on the object), which get no paper.
function discParts(img, disc, n = 256) {
  const { w, h, lum, blueish } = img;
  const pale = new Uint8Array(w * h);
  const ink = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) {
    pale[k] = lum[k] >= 212 && lum[k] <= 238 && blueish[k] ? 1 : 0;
    ink[k] = lum[k] < 120 ? 1 : 0;
  }
  const seen = new Uint8Array(w * h);
  const parts = [];
  for (let k0 = 0; k0 < w * h; k0++) {
    if (!pale[k0] || seen[k0]) continue;
    const part = [k0];
    seen[k0] = 1;
    for (let i = 0; i < part.length; i++) {
      const p = part[i];
      const x = p % w;
      for (const q of [
        x > 0 ? p - 1 : -1,
        x < w - 1 ? p + 1 : -1,
        p - w,
        p + w,
      ])
        if (q >= 0 && q < w * h && pale[q] && !seen[q]) {
          seen[q] = 1;
          part.push(q);
        }
    }
    parts.push(part);
  }
  // The largest is the disc itself (findDisc).
  parts.sort((a, b) => b.length - a.length);
  const faces = new Uint8Array(w * h);
  const holes = new Uint8Array(w * h);
  const edge = Math.max(2, Math.round(0.003 * w));
  const beyond = Math.round(0.016 * w);
  let faceCount = 0;
  let holeCount = 0;
  for (const part of parts.slice(1)) {
    if (part.length < 30) continue;
    let x0 = w;
    let x1 = 0;
    let y0 = h;
    let y1 = 0;
    let inDisc = 0;
    for (const k of part) {
      const x = k % w;
      const y = (k - x) / w;
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
      if ((x - disc.cx) ** 2 + (y - disc.cy) ** 2 < disc.r ** 2) inDisc++;
    }
    if (inDisc < 0.5 * part.length) continue;
    // The ring around it: its edge (ink or paper it touches) and, beyond the
    // line, what it sits on. Measured in its own box.
    const bx0 = Math.max(0, x0 - beyond - 1);
    const by0 = Math.max(0, y0 - beyond - 1);
    const bw = Math.min(w - 1, x1 + beyond + 1) - bx0 + 1;
    const bh = Math.min(h - 1, y1 + beyond + 1) - by0 + 1;
    const local = new Uint8Array(bw * bh);
    for (const k of part)
      local[(Math.floor(k / w) - by0) * bw + (k % w) - bx0] = 1;
    const near = dilate(local, bw, bh, edge);
    const far = dilate(local, bw, bh, beyond);
    let edgeAll = 0;
    let edgeInk = 0;
    let edgePaper = 0;
    let farAll = 0;
    let farPaper = 0;
    for (let y = 0; y < bh; y++)
      for (let x = 0; x < bw; x++) {
        const j = y * bw + x;
        if (local[j] || !far[j]) continue;
        const k = (y + by0) * w + x + bx0;
        if (near[j]) {
          edgeAll++;
          if (ink[k]) edgeInk++;
          else if (lum[k] > 238) edgePaper++;
        } else if (!ink[k]) {
          farAll++;
          if (lum[k] > 238) farPaper++;
        }
      }
    const touchesPaper = edgePaper > 0.15 * edgeAll;
    const face =
      !touchesPaper && edgeInk >= 0.6 * edgeAll && farPaper >= 0.4 * farAll;
    if (face) {
      faceCount++;
      for (const k of part) faces[k] = 1;
    } else if (!touchesPaper) {
      holeCount++;
      for (const k of part) holes[k] = 1;
    }
  }
  const map = figureCells(img, faces, n);
  map.count = faceCount;
  holes.count = holeCount;
  return { faces: map, holes };
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
  // (two doves cover two thirds of theirs) and near the middle. Pale wings or a
  // grey coat are none of these, and the library has animals without a disc.
  const disc =
    2 * r >= 0.3 * w &&
    Math.min(bw, bh) >= 0.6 * Math.max(bw, bh) &&
    best.n >= 0.25 * Math.PI * r * r &&
    Math.abs(cx - w / 2) <= 0.2 * w;
  if (!disc) return null;
  return {
    cx,
    cy: bh < 0.95 * bw ? best.y0 + r : best.y0 + bh / 2,
    r,
  };
}

// The ground line: the lowest rows where one dark run (gaps up to 2 % of the
// width) spans a quarter of the width, with little ink below it. Returns its top and bottom row and
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
    // A perch is not ground: birds on a wire hang tails and feet below it
    // (1.1 % of the Doves image), while under a ground line there is at most
    // a dipping contour (0.2 % under the fox). A perch stays as drawn.
    let below = 0;
    for (let k = (y + 3) * w; k < w * h; k++) if (lum[k] < 120) below++;
    return { top, bottom: y, x0, x1, perch: below > 0.005 * w * h };
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
