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
      'Turn a PNG illustration draft into Entur Linje vector art in Illustrator: live round-capped strokes with a contour/detail weight hierarchy, smoothed palette-snapped fills, optional Roughen. Writes <name>.ai, <name>.svg, <name>-darkmode.svg and <name>-contrast.svg.',
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
      },
      required: ['png', 'outDir', 'name'],
    },
    run: ({ png, outDir, name, threshold, maxStroke, size, roughen }) => {
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
