#!/usr/bin/env node
// illustrator-bridge — a minimal MCP server (stdio) that drives Adobe
// Illustrator through AppleScript `do javascript`. No Illustrator plugin
// needed. macOS only. Zero dependencies.
//
// Tools:
//   illustrator_status        version and open documents
//   illustrator_run_jsx       run an ExtendScript snippet, return its last value
//   illustrator_trace_draft   PNG draft → Entur Linje strokes (.ai + 3 SVG modes), via illustrator-trace.mjs
//   illustrator_add_details   fold and sheen lines into a Details layer, then re-export the SVG modes
//   illustrator_scale_head    scale a head around the neck, hair inside a silhouette included
//   illustrator_smooth_region smooth and thin traced fill edges in a region (hair)
//   illustrator_import_drawing linje-ink SVG → .ai with live width profiles and Roughen
//
// Register:  claude mcp add -s local illustrator-bridge -- node <this file>
// Set ILLUSTRATOR_APP to target another install (default: Illustrator 2026).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const APP =
  process.env.ILLUSTRATOR_APP ??
  '/Applications/Adobe Illustrator 2026/Adobe Illustrator.app';
const HERE = path.dirname(fileURLToPath(import.meta.url));

function runJsx(code, timeoutSec = 600) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-bridge-'));
  const file = path.join(dir, 'run.jsx');
  fs.writeFileSync(file, code);
  const script = `with timeout of ${timeoutSec} seconds
  tell application ${JSON.stringify(
    APP,
  )} to do javascript (read POSIX file ${JSON.stringify(file)} as «class utf8»)
end timeout`;
  return new Promise((resolve, reject) =>
    execFile(
      'osascript',
      ['-e', script],
      { timeout: (timeoutSec + 30) * 1000 },
      (err, out, errOut) =>
        err
          ? reject(new Error((errOut || err.message).trim()))
          : resolve(out.trim()),
    ),
  );
}

function runNode(args, timeoutSec = 900) {
  return new Promise((resolve, reject) =>
    execFile(
      process.execPath,
      args,
      { timeout: timeoutSec * 1000 },
      (err, out, errOut) =>
        err
          ? reject(new Error((errOut || err.message).trim()))
          : resolve(out.trim()),
    ),
  );
}

// Standard → dark → contrast for the palette the trace snaps to (palette.md).
const PALETTE = {
  ink: ['#181C56', '#5E5F6C', '#626493'],
  paper: ['#FFFFFF', '#F2F2F5', '#FFFFFF'],
  line2: ['#9EA0BD', '#999AA7', '#9EA0BD'],
  tint: ['#EAEAF1', '#B3B4BD', '#BCBDD2'],
  lavender: ['#AEB7E2', '#81828F', '#AEB7E2'],
  peach: ['#FFBF9E', '#FFBF9E', '#FFBF9E'],
  coral: ['#FF5959', '#FF9494', '#FF5959'],
};

function writeModes(svgFile) {
  const svg = fs.readFileSync(svgFile, 'latin1');
  const base = svgFile.replace(/\.svg$/, '');
  return [
    ['darkmode', 1],
    ['contrast', 2],
  ].map(([mode, idx]) => {
    let out = svg;
    for (const v of Object.values(PALETTE))
      out = out.replace(new RegExp(v[0], 'gi'), `__${v[idx].slice(1)}__`);
    out = out.replace(/__([0-9A-F]{6})__/g, '#$1');
    fs.writeFileSync(`${base}-${mode}.svg`, out);
    return `${base}-${mode}.svg`;
  });
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Shared ExtendScript fragments for the document tools.
function openDocJsx(ai) {
  return [
    `var target = new File(${JSON.stringify(ai)}), doc = null;`,
    'for (var d = 0; d < app.documents.length; d++) if (app.documents[d].fullName.fsName === target.fsName) doc = app.documents[d];',
    'var opened = !doc;',
    'if (!doc) doc = app.open(target);',
  ].join('\n');
}

function saveExportJsx(ai) {
  return [
    'doc.save();',
    'var eo = new ExportOptionsSVG(); eo.embedRasterImages = false; eo.coordinatePrecision = 2;',
    'try { eo.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES; } catch (e) {}',
    `doc.exportFile(new File(${JSON.stringify(
      ai.replace(/\.ai$/, '.svg'),
    )}), ExportType.SVG, eo);`,
    'if (opened) doc.close(SaveOptions.DONOTSAVECHANGES);',
  ].join('\n');
}

const TOOLS = [
  {
    name: 'illustrator_status',
    description:
      'Report the Illustrator version and the names of open documents.',
    inputSchema: { type: 'object', properties: {} },
    run: () =>
      runJsx(
        'var n=[]; for (var i=0;i<app.documents.length;i++) n.push(app.documents[i].name); "Illustrator " + app.version + " | open: " + (n.length ? n.join(", ") : "none");',
      ),
  },
  {
    name: 'illustrator_run_jsx',
    description:
      'Run ExtendScript (Illustrator JavaScript) in the running Illustrator and return the value of the last expression. Use for inspecting or editing documents.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'ExtendScript source.' },
        timeoutSec: { type: 'number', description: 'Default 600.' },
      },
      required: ['code'],
    },
    run: ({ code, timeoutSec }) => runJsx(code, timeoutSec ?? 600),
  },
  {
    name: 'illustrator_trace_draft',
    description:
      'Turn a PNG illustration draft into Entur Linje vector art in Illustrator: live round-capped strokes with a contour/detail weight hierarchy, smoothed palette-snapped fills, optional Roughen. For animals and objects add construction: animals, carriers (width profiles), backdrop and underlay; animals are simplified (fewer fur marks, joined contours) unless simplify is false. Writes <name>.ai, <name>.svg, <name>-darkmode.svg and <name>-contrast.svg.',
    inputSchema: {
      type: 'object',
      properties: {
        png: { type: 'string', description: 'Absolute path to the PNG draft.' },
        outDir: { type: 'string', description: 'Absolute output folder.' },
        name: {
          type: 'string',
          description: 'File base name, e.g. Customer-service.',
        },
        threshold: {
          type: 'number',
          description: 'Line threshold 0–255, default 110.',
        },
        maxStroke: {
          type: 'number',
          description: 'Widest line traced as a stroke, default 20.',
        },
        size: {
          type: 'number',
          description:
            'Artboard size in pt, default 360 (library scale for a figure).',
        },
        roughen: {
          type: 'boolean',
          description:
            'Add Roughen to strokes, default false: the draft already has the tremor.',
        },
        construction: {
          type: 'string',
          enum: ['people', 'animals'],
          description:
            'animals: 320 pt artboard and weights 2.1 / 1.7, for animals and objects. Default people.',
        },
        carriers: {
          type: 'string',
          description:
            'Absolute path to an .ai with strokes named swell and point: every traced line gets that width profile (short lines get point). For animals.',
        },
        backdrop: {
          type: 'boolean',
          description:
            "Replace the traced disc with the library's 4-anchor circle and Roughen 0.65 %.",
        },
        underlay: {
          type: 'boolean',
          description:
            'Put one paper shape under the whole subject, traced from its silhouette in the draft.',
        },
        simplify: {
          type: 'boolean',
          description:
            'Animals, default true: drop specks, join a contour broken into pieces, and thin short fur marks that lie along a contour or crowd each other. Marks near an eye or nose, toes, grass and ground stay.',
        },
      },
      required: ['png', 'outDir', 'name'],
    },
    run: ({
      png,
      outDir,
      name,
      threshold,
      maxStroke,
      size,
      roughen,
      construction,
      carriers,
      backdrop,
      underlay,
      simplify,
    }) => {
      const a = [
        path.join(HERE, 'illustrator-trace.mjs'),
        png,
        '--out',
        outDir,
        '--name',
        name,
      ];
      a.push('--max-stroke', String(maxStroke ?? 20));
      if (threshold != null) a.push('--threshold', String(threshold));
      if (size != null) a.push('--size', String(size));
      if (roughen === true) a.push('--roughen');
      if (construction) a.push('--construction', construction);
      if (carriers) a.push('--carriers', carriers);
      if (backdrop) a.push('--backdrop');
      if (underlay) a.push('--underlay');
      if (simplify === false) a.push('--no-simplify');
      return runNode(a);
    },
  },
  {
    name: 'illustrator_add_details',
    description:
      'Add fold and sheen marks to a traced Entur illustration (.ai), in a "Details" layer under the outlines. Use 2–5 per figure: more makes clothes busy. Marks taper thin–thick–thin like a brush mark (filled shapes); set taper: false for a plain round-capped stroke. Points are in Illustrator points with y up (the artboard runs from 0 at the bottom). Paper-white marks on ink or colour fills, ink marks on light fills. Saves the .ai and re-exports <name>.svg plus the -darkmode and -contrast SVGs.',
    inputSchema: {
      type: 'object',
      properties: {
        ai: { type: 'string', description: 'Absolute path to the .ai file.' },
        lines: {
          type: 'array',
          description:
            'Lines to draw, 2–5 points each; they should start and end inside the shape.',
          items: {
            type: 'object',
            properties: {
              points: {
                type: 'array',
                items: { type: 'array', items: { type: 'number' } },
              },
              color: {
                type: 'string',
                description:
                  'Palette role (paper, ink, line2, …) or hex. Default paper.',
              },
              width: {
                type: 'number',
                description:
                  'Widest point (tapered) or stroke weight in pt. Default 1.3 tapered, 0.9 plain.',
              },
              taper: {
                type: 'boolean',
                description: 'Thin–thick–thin brush mark. Default true.',
              },
            },
            required: ['points'],
          },
        },
      },
      required: ['ai', 'lines'],
    },
    run: async ({ ai, lines }) => {
      const resolved = lines.map(l => ({
        points: l.points,
        rgb: hexToRgb(PALETTE[l.color ?? 'paper']?.[0] ?? l.color ?? '#FFFFFF'),
        taper: l.taper !== false,
        width: l.width ?? (l.taper === false ? 0.9 : 1.3),
      }));
      const svgFile = ai.replace(/\.ai$/, '.svg');
      const jsx = [
        `var L = ${JSON.stringify(resolved)};`,
        `var target = new File(${JSON.stringify(ai)}), doc = null;`,
        'for (var d = 0; d < app.documents.length; d++) if (app.documents[d].fullName.fsName === target.fsName) doc = app.documents[d];',
        'var opened = !doc;',
        'if (!doc) doc = app.open(target);',
        'var details = null;',
        "for (var i = 0; i < doc.layers.length; i++) if (doc.layers[i].name === 'Details') details = doc.layers[i];",
        'if (!details) {',
        "  details = doc.layers.add(); details.name = 'Details';",
        "  for (var j = 0; j < doc.layers.length; j++) if (doc.layers[j].name === 'Outline') details.move(doc.layers[j], ElementPlacement.PLACEAFTER);",
        '}',
        'function cr(p0, p1, p2, p3, t) { var t2 = t * t, t3 = t2 * t, r = []; for (var d = 0; d < 2; d++) r.push(0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)); return r; }',
        'function taperShape(pts, maxW) {',
        '  var n = pts.length, line = [];',
        '  for (var i = 0; i < n - 1; i++) { var p0 = pts[Math.max(0, i - 1)], p3 = pts[Math.min(n - 1, i + 2)]; for (var j = 0; j < 10; j++) line.push(cr(p0, pts[i], pts[i + 1], p3, j / 10)); }',
        '  line.push(pts[n - 1]);',
        '  var left = [], right = [], m = line.length;',
        '  for (var q = 0; q < m; q++) {',
        '    var a = line[Math.max(0, q - 1)], c = line[Math.min(m - 1, q + 1)], dx = c[0] - a[0], dy = c[1] - a[1], len = Math.sqrt(dx * dx + dy * dy) || 1;',
        '    var hw = (maxW / 2) * Math.pow(Math.sin(Math.PI * q / (m - 1)), 0.8);',
        '    left.push([line[q][0] - dy / len * hw, line[q][1] + dx / len * hw]); right.unshift([line[q][0] + dy / len * hw, line[q][1] - dx / len * hw]);',
        '  }',
        '  return left.concat(right);',
        '}',
        'for (var m = 0; m < L.length; m++) {',
        '  var col = new RGBColor(); col.red = L[m].rgb[0]; col.green = L[m].rgb[1]; col.blue = L[m].rgb[2];',
        '  if (L[m].taper) { var tp = details.pathItems.add(); tp.setEntirePath(taperShape(L[m].points, L[m].width)); tp.closed = true; tp.stroked = false; tp.filled = true; tp.fillColor = col; continue; }',
        '  var pts = L[m].points, n = pts.length, p = details.pathItems.add();',
        '  p.setEntirePath(pts);',
        '  for (var k = 0; k < n; k++) {',
        '    var a = pts[Math.max(0, k - 1)], c = pts[Math.min(n - 1, k + 1)], pp = p.pathPoints[k];',
        '    var dx = (c[0] - a[0]) / 6, dy = (c[1] - a[1]) / 6;',
        '    pp.leftDirection = [pts[k][0] - dx, pts[k][1] - dy];',
        '    pp.rightDirection = [pts[k][0] + dx, pts[k][1] + dy];',
        '    pp.pointType = PointType.SMOOTH;',
        '  }',
        '  p.filled = false; p.stroked = true; p.strokeColor = col; p.strokeWidth = L[m].width;',
        '  p.strokeCap = StrokeCap.ROUNDENDCAP; p.strokeJoin = StrokeJoin.ROUNDENDJOIN;',
        '}',
        'doc.save();',
        'var o = new ExportOptionsSVG(); o.embedRasterImages = false; o.coordinatePrecision = 2;',
        'try { o.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES; } catch (e) {}',
        `doc.exportFile(new File(${JSON.stringify(
          svgFile,
        )}), ExportType.SVG, o);`,
        'if (opened) doc.close(SaveOptions.DONOTSAVECHANGES);',
        "L.length + ' marks added to Details';",
      ].join('\n');
      const result = await runJsx(jsx);
      const modes = writeModes(svgFile);
      return [result, svgFile, ...modes].join('\n');
    },
  },
  {
    name: 'illustrator_scale_head',
    description:
      "Scale a figure's head in a traced Entur illustration (.ai) around the neck, hair included. Items whose centre sits above the neck inside the head column are scaled as wholes; large shapes that run from the head into the body (a hair-and-uniform silhouette) have their head anchors moved with a soft blend so nothing kinks at the shoulders. Stroke weights stay. Points are Illustrator points, y up. Saves the .ai and re-exports the SVG modes.",
    inputSchema: {
      type: 'object',
      properties: {
        ai: { type: 'string', description: 'Absolute path to the .ai file.' },
        neck: {
          type: 'array',
          items: { type: 'number' },
          description: '[x, y] of the neck base.',
        },
        scale: { type: 'number', description: 'e.g. 0.8 for 80 %.' },
        column: {
          type: 'array',
          items: { type: 'number' },
          description:
            '[x0, x1]: the head column; keeps props such as a speech bubble out.',
        },
      },
      required: ['ai', 'neck', 'scale', 'column'],
    },
    run: async ({ ai, neck, scale, column }) => {
      const jsx = [
        openDocJsx(ai),
        `var A = ${JSON.stringify(neck)}, S = ${Number(scale)}, X0 = ${Number(
          column[0],
        )}, X1 = ${Number(column[1])};`,
        'var leaves = []; function leaf(it) { if (it.typename === "GroupItem") { for (var j = 0; j < it.pageItems.length; j++) leaf(it.pageItems[j]); } else if (it.typename === "PathItem" || it.typename === "CompoundPathItem") leaves.push(it); }',
        'for (var l = 0; l < doc.layers.length; l++) for (var k = 0; k < doc.layers[l].pageItems.length; k++) leaf(doc.layers[l].pageItems[k]);',
        'function blend(p) { var t = Math.max(0, Math.min(1, (p[1] - (A[1] - 22)) / 40)), s = 1 - t * (1 - S); return [A[0] + (p[0] - A[0]) * s, A[1] + (p[1] - A[1]) * s]; }',
        'var rigid = 0, blended = 0;',
        'for (var i = 0; i < leaves.length; i++) {',
        '  var it = leaves[i], b = it.geometricBounds, cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;',
        '  if (cy > A[1] + 3 && cx > X0 && cx < X1 && b[3] > A[1] - 30) {',
        '    it.resize(S * 100, S * 100, true, true, true, true, 100, Transformation.CENTER);',
        '    it.translate((A[0] + (cx - A[0]) * S) - cx, (A[1] + (cy - A[1]) * S) - cy); rigid++;',
        '  } else if (b[1] > A[1] + 3 && b[3] < A[1] - 30 && b[0] < X1 && b[2] > X0) {',
        '    var subs = it.typename === "CompoundPathItem" ? it.pathItems : [it];',
        '    for (var s2 = 0; s2 < subs.length; s2++) for (var q = 0; q < subs[s2].pathPoints.length; q++) {',
        '      var pp = subs[s2].pathPoints[q], a = pp.anchor;',
        '      if (a[1] < A[1] - 22 || a[0] < X0 - 10 || a[0] > X1 + 10) continue;',
        '      pp.anchor = blend(a); pp.leftDirection = blend(pp.leftDirection); pp.rightDirection = blend(pp.rightDirection); blended++;',
        '    }',
        '  }',
        '}',
        saveExportJsx(ai),
        '"head items scaled " + rigid + ", anchors blended " + blended;',
      ].join('\n');
      const result = await runJsx(jsx);
      return [result, ...writeModes(ai.replace(/\.ai$/, '.svg'))].join('\n');
    },
  },
  {
    name: 'illustrator_smooth_region',
    description:
      'Smooth and thin the anchors of filled shapes inside a region of a traced Entur illustration (.ai) — for traced hair, whose edge comes out jagged, while reference hair is one smooth shape of 16–24 anchors. Anchors outside the region keep their position and handles. Region in Illustrator points, y up. Saves the .ai and re-exports the SVG modes.',
    inputSchema: {
      type: 'object',
      properties: {
        ai: { type: 'string', description: 'Absolute path to the .ai file.' },
        region: {
          type: 'array',
          items: { type: 'number' },
          description: '[x0, yBottom, x1, yTop].',
        },
        keepEvery: {
          type: 'number',
          description: 'Keep every nth anchor in the region. Default 4.',
        },
        passes: { type: 'number', description: 'Smoothing passes. Default 3.' },
      },
      required: ['ai', 'region'],
    },
    run: async ({ ai, region, keepEvery, passes }) => {
      const jsx = [
        openDocJsx(ai),
        `var R = ${JSON.stringify(region)}, EVERY = ${Number(
          keepEvery ?? 4,
        )}, PASSES = ${Number(passes ?? 3)};`,
        'function inside(a) { return a[0] >= R[0] && a[0] <= R[2] && a[1] >= R[1] && a[1] <= R[3]; }',
        'var paths = []; function leaf(it) { if (it.typename === "GroupItem") { for (var j = 0; j < it.pageItems.length; j++) leaf(it.pageItems[j]); } else if (it.typename === "CompoundPathItem") { for (var c = 0; c < it.pathItems.length; c++) paths.push(it.pathItems[c]); } else if (it.typename === "PathItem" && it.filled) paths.push(it); }',
        'for (var l = 0; l < doc.layers.length; l++) for (var k = 0; k < doc.layers[l].pageItems.length; k++) leaf(doc.layers[l].pageItems[k]);',
        'var touched = 0, before = 0, after = 0;',
        'for (var i = 0; i < paths.length; i++) {',
        '  var P = paths[i], n = P.pathPoints.length; if (n < 8) continue;',
        '  var pts = [], any = false;',
        '  for (var q = 0; q < n; q++) { var pp = P.pathPoints[q]; var ins = inside(pp.anchor); any = any || ins; pts.push({ a: pp.anchor, l: pp.leftDirection, r: pp.rightDirection, r_: ins }); }',
        '  if (!any) continue;',
        '  for (var pass = 0; pass < PASSES; pass++) { var na = []; for (var h = 0; h < n; h++) { var pr = pts[(h - 1 + n) % n], nx = pts[(h + 1) % n], c0 = pts[h]; na.push(c0.r_ && pr.r_ && nx.r_ ? [(pr.a[0] + 2 * c0.a[0] + nx.a[0]) / 4, (pr.a[1] + 2 * c0.a[1] + nx.a[1]) / 4] : c0.a); } for (var h2 = 0; h2 < n; h2++) pts[h2].a = na[h2]; }',
        '  var out = [], run = 0;',
        '  for (var h3 = 0; h3 < n; h3++) { var c1 = pts[h3]; if (!c1.r_) { out.push(c1); run = 0; continue; } var edge = !pts[(h3 - 1 + n) % n].r_ || !pts[(h3 + 1) % n].r_; if (edge || run % EVERY === 0) out.push(c1); run++; }',
        '  var coords = []; for (var o = 0; o < out.length; o++) coords.push(out[o].a);',
        '  P.setEntirePath(coords); var m = out.length;',
        '  for (var t = 0; t < m; t++) { var tp = P.pathPoints[t]; if (out[t].r_) { var pa = out[(t - 1 + m) % m].a, pc = out[(t + 1) % m].a, dx = (pc[0] - pa[0]) / 6, dy = (pc[1] - pa[1]) / 6; tp.leftDirection = [out[t].a[0] - dx, out[t].a[1] - dy]; tp.rightDirection = [out[t].a[0] + dx, out[t].a[1] + dy]; tp.pointType = PointType.SMOOTH; } else { tp.leftDirection = out[t].l; tp.rightDirection = out[t].r; } }',
        '  touched++; before += n; after += m;',
        '}',
        saveExportJsx(ai),
        '"shapes smoothed " + touched + ", anchors " + before + " -> " + after;',
      ].join('\n');
      const result = await runJsx(jsx);
      return [result, ...writeModes(ai.replace(/\.ai$/, '.svg'))].join('\n');
    },
  },
  {
    name: 'illustrator_import_drawing',
    description:
      "Turn SVGs from linje-ink (drawn with roughen: false; for animals also profiles: 'stroke') into Illustrator files with the library's live construction. Strokes named profile-<swell|thin|point>-<n> get a real width profile, copied from the stroke of that name in a carriers .ai; Roughen goes on as a live effect: 0.2 % relative on strokes (and on fills when the drawing has width profiles, as in the animal source file), 0.65 % on the backdrop disc, and the size in a -r<size> name suffix where a line asked for more. Also converts the -darkmode and -contrast siblings when they exist. Writes <name>.ai and an Illustrator-exported <name>.svg per mode into outDir.",
    inputSchema: {
      type: 'object',
      properties: {
        svg: {
          type: 'string',
          description: 'Absolute path to the standard-mode SVG from linje-ink.',
        },
        outDir: { type: 'string', description: 'Absolute output folder.' },
        name: {
          type: 'string',
          description: 'File base name. Default: the SVG file name.',
        },
        carriers: {
          type: 'string',
          description:
            'Absolute path to an .ai holding plain strokes named swell, thin and point, each with its width profile and no effects. Needed for profiled lines.',
        },
        roughen: {
          type: 'boolean',
          description: 'Apply Roughen as a live effect. Default true.',
        },
      },
      required: ['svg', 'outDir'],
    },
    run: async ({ svg, outDir, name, carriers, roughen }) => {
      const base = name ?? path.basename(svg).replace(/\.svg$/, '');
      const jobs = ['', '-darkmode', '-contrast']
        .map(suffix => ({
          src: svg.replace(/\.svg$/, `${suffix}.svg`),
          ai: path.join(outDir, `${base}${suffix}.ai`),
        }))
        .filter(job => fs.existsSync(job.src));
      fs.mkdirSync(outDir, { recursive: true });
      const jsx = [
        `var JOBS = ${JSON.stringify(jobs)}, CARRIERS = ${JSON.stringify(
          carriers ?? '',
        )}, ROUGH = ${roughen !== false};`,
        "function fx(size, detail) { return '<LiveEffect name=\"Adobe Roughen\"><Dict data=\"R size ' + size + ' R asiz ' + size + ' R absoluteness 0 R dtal ' + detail + ' R roundness 1 \"/></LiveEffect>'; }",
        'var car = {}, carDoc = null, log = [];',
        'if (CARRIERS) { carDoc = app.open(new File(CARRIERS)); for (var c = 0; c < carDoc.pathItems.length; c++) car[carDoc.pathItems[c].name] = carDoc.pathItems[c]; }',
        'for (var j = 0; j < JOBS.length; j++) {',
        '  var doc = app.open(new File(JOBS[j].src)), items = [], profiled = 0, missing = 0, rough = 0;',
        '  for (var i = 0; i < doc.pathItems.length; i++) items.push(doc.pathItems[i]);',
        '  var animal = false;',
        '  for (var i2 = 0; i2 < items.length; i2++) if (/^profile-/.test(items[i2].name)) animal = true;',
        '  for (var k = 0; k < items.length; k++) {',
        '    var p = items[k], m = /^profile-([a-z]+)-\\d+/.exec(p.name);',
        '    if (!m) continue;',
        '    var src = car[m[1]]; if (!src) { missing++; continue; }',
        '    var d = src.duplicate(doc.layers[0], ElementPlacement.PLACEATBEGINNING), anchors = [];',
        '    d.move(p, ElementPlacement.PLACEBEFORE);',
        '    for (var q = 0; q < p.pathPoints.length; q++) anchors.push(p.pathPoints[q].anchor);',
        '    d.setEntirePath(anchors);',
        '    for (var q2 = 0; q2 < p.pathPoints.length; q2++) { var a = p.pathPoints[q2], b = d.pathPoints[q2]; b.leftDirection = a.leftDirection; b.rightDirection = a.rightDirection; b.pointType = a.pointType; }',
        '    d.closed = p.closed; d.filled = false; d.stroked = true; d.strokeColor = p.strokeColor; d.strokeWidth = p.strokeWidth;',
        '    d.strokeCap = StrokeCap.ROUNDENDCAP; d.strokeJoin = StrokeJoin.ROUNDENDJOIN; d.name = p.name;',
        '    items[k] = d; p.remove(); profiled++;',
        '  }',
        '  if (ROUGH) for (var r = 0; r < items.length; r++) {',
        '    var it = items[r], size = /-r([\\d.]+)$/.exec(it.name);',
        '    try {',
        "      if (it.name === 'backdrop') it.applyEffect(fx(0.65, 61));",
        '      else if (it.stroked || (animal && it.filled)) it.applyEffect(fx(size ? size[1] : 0.2, 63));',
        '      else continue;',
        '      rough++;',
        '    } catch (e) {}',
        '  }',
        '  doc.saveAs(new File(JOBS[j].ai));',
        '  var eo = new ExportOptionsSVG(); eo.embedRasterImages = false; eo.coordinatePrecision = 2;',
        '  try { eo.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES; } catch (e2) {}',
        "  doc.exportFile(new File(JOBS[j].ai.replace(/\\.ai$/, '.svg')), ExportType.SVG, eo);",
        '  doc.close(SaveOptions.DONOTSAVECHANGES);',
        "  log.push(JOBS[j].ai + ': width profiles ' + profiled + (missing ? ', no carrier for ' + missing : '') + ', roughened ' + rough);",
        '}',
        'if (carDoc) carDoc.close(SaveOptions.DONOTSAVECHANGES);',
        "log.join('\\n');",
      ].join('\n');
      return runJsx(jsx);
    },
  },
];

const send = msg => process.stdout.write(`${JSON.stringify(msg)}\n`);

async function handle(msg) {
  const { id, method, params } = msg;
  if (id === undefined) return; // notification
  try {
    if (method === 'initialize') {
      return send({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: params?.protocolVersion ?? '2025-06-18',
          capabilities: { tools: {} },
          serverInfo: { name: 'illustrator-bridge', version: '0.1.0' },
        },
      });
    }
    if (method === 'ping') return send({ jsonrpc: '2.0', id, result: {} });
    if (method === 'tools/list') {
      return send({
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS.map(({ run, ...t }) => t) },
      });
    }
    if (method === 'tools/call') {
      const tool = TOOLS.find(t => t.name === params?.name);
      if (!tool) throw new Error(`Unknown tool ${params?.name}`);
      try {
        const text = await tool.run(params.arguments ?? {});
        return send({
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text }] },
        });
      } catch (e) {
        return send({
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: String(e.message) }],
            isError: true,
          },
        });
      }
    }
    send({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    });
  } catch (e) {
    send({
      jsonrpc: '2.0',
      id,
      error: { code: -32603, message: String(e.message) },
    });
  }
}

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  buffer += chunk;
  let i;
  while ((i = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, i).trim();
    buffer = buffer.slice(i + 1);
    if (!line) continue;
    try {
      handle(JSON.parse(line));
    } catch {
      send({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error' },
      });
    }
  }
});
