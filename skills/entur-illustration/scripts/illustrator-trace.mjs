// illustrator-trace — turns a PNG draft into Entur Linje vector strokes in Adobe
// Illustrator, driven from the command line through AppleScript `do javascript`.
// No plugin needed. macOS only.
//
//   node illustrator-trace.mjs <draft.png> [--out dir] [--name Name] [--app "/Applications/Adobe Illustrator 2026/Adobe Illustrator.app"]
//                    [--threshold 110] [--max-stroke 14] [--contour 1.5] [--detail 1.0] [--no-roughen]
//
// Two traces of the same PNG on a 320 pt artboard:
//   lines  black-and-white trace, strokes and fills: thin lines become live
//          strokes (round caps and joins, contour/detail weight, ink colour),
//          wide dark areas (uniform, hair, shoes) become ink fills.
//   colour colour trace, every area snapped to the exact palette colour,
//          white and ink dropped (the line trace has them), put underneath.
// Then Effect > Roughen (size 0.2 %, detail 63/in, smooth) on everything,
// saved as <Name>.ai and exported as <Name>.svg, plus -darkmode and
// -contrast SVGs by palette mapping.

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
const roughen = !flag('no-roughen');
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
var doc = app.documents.add(DocumentColorSpace.RGB, 320, 320);
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
co.pathFidelity = 60; co.cornerFidelity = 70; co.noiseFidelity = 40;
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
lo.pathFidelity = 70; lo.cornerFidelity = 70; lo.noiseFidelity = 20;
app.redraw();
var lg = lt.tracing.expandTracing();
var lp = paths(lg, []), strokes = 0, fills = 0;
var ink = rgb(P.palette.ink);
for (var j = 0; j < lp.length; j++) {
  var p = lp[j];
  if (p.stroked) {
    var w = p.strokeWidth;
    p.strokeColor = ink;
    p.strokeWidth = w > (P.contour + P.detail) / 2 ? P.contour : P.detail;
    p.strokeCap = StrokeCap.ROUNDENDCAP;
    p.strokeJoin = StrokeJoin.ROUNDENDJOIN;
    p.filled = false;
    strokes++;
  } else if (p.filled) {
    p.fillColor = ink; fills++;
  }
}
log.push('line strokes ' + strokes + ', ink fills ' + fills);

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
