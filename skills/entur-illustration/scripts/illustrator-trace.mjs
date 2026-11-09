// illustrator-trace — turns a PNG draft into Entur Linje vector strokes in
// Adobe Illustrator, driven from the command line through AppleScript
// `do javascript`. No plugin needed. macOS only.
//
//   node illustrator-trace.mjs <draft.png> [--out dir] [--name Name]
//     [--app "/Applications/Adobe Illustrator 2026/Adobe Illustrator.app"]
//     [--size 360] [--threshold 110] [--max-stroke 20] [--contour 1.5] [--detail 1.0]
//     [--contour-share 0.25] [--min-ink-width 4] [--roughen]
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
//          colour (not ink) shifted 1 pt right and 0.5 pt down.
// The draft already carries the hand tremor, so Roughen is only added with
// `--roughen`. Saved as <Name>.ai and <Name>.svg, plus -darkmode and
// -contrast SVGs by palette mapping (every white becomes paper).
//
// ExtendScript is ES3 (no Array.map), and `name` and `cut` are read-only
// globals in Illustrator: assigning to them fails silently.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

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
const threshold = Number(opt('threshold', 110));
const maxStroke = Number(opt('max-stroke', 14));
const contour = Number(opt('contour', 1.5));
const detail = Number(opt('detail', 1.0));
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
  lavender: ['#AEB7E2', '#81828F', '#AEB7E2'],
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
  size: Number(opt('size', 360)),
  contourShare: Number(opt('contour-share', 0.25)),
  shift: [1, -0.5],
  palette: Object.fromEntries(
    Object.entries(PALETTE).map(([k, [hex]]) => [k, hexToRgb(hex)]),
  ),
};

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
log.push('line strokes ' + strokes + ' (contours by ' + (byWidth ? 'width' : 'length') + ', cut ' + Math.round(contourCut * 100) / 100 + '), ink fills ' + fills);

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
const script = `with timeout of 900 seconds
  tell application ${JSON.stringify(
    app,
  )} to do javascript (read POSIX file ${JSON.stringify(
  jsxFile,
)} as «class utf8»)
end timeout`;
const result = execFileSync('osascript', ['-e', script], {
  encoding: 'utf8',
  timeout: 960000,
}).trim();
console.log(result);

// Dark and contrast versions by exact palette mapping.
const svg = fs.readFileSync(params.svg, 'utf8');
for (const [mode, idx] of [
  ['darkmode', 1],
  ['contrast', 2],
]) {
  let out = svg;
  for (const [, values] of Object.entries(PALETTE)) {
    const from = values[0];
    out = out.replace(new RegExp(from, 'gi'), `__${values[idx].slice(1)}__`);
  }
  out = out.replace(/__([0-9A-F]{6})__/g, '#$1');
  const file = path.join(outDir, `${name}-${mode}.svg`);
  fs.writeFileSync(file, out);
  console.log(file);
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
