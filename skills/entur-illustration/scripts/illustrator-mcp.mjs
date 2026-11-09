#!/usr/bin/env node
// illustrator-bridge — a minimal MCP server (stdio) that drives Adobe
// Illustrator through AppleScript `do javascript`. No Illustrator plugin
// needed. macOS only. Zero dependencies.
//
// Tools:
//   illustrator_status        version and open documents
//   illustrator_run_jsx       run an ExtendScript snippet, return its last value
//   illustrator_trace_draft   PNG draft → Entur Linje strokes (.ai + 3 SVG modes), via illustrator-trace.mjs
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
