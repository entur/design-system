// grid — lays a coordinate grid over a reference image, sized to an
// illustration canvas, so anchor points can be read off it in canvas units.
//
//   node grid.mjs <image> [out.svg] [--format square|scene|landscape] [--step 20]
//
// Writes an SVG with the image embedded (fit, centred) under a grid: thin
// lines every `step` units, stronger lines and labels every 2 × step.
// Render it to look at, e.g. `qlmanage -t -s 900 -o <dir> out.svg` on macOS.
// Zero dependencies. Node 18+.

import fs from 'node:fs';
import path from 'node:path';
import { FORMATS } from './linje-ink.mjs';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args.splice(i, 2)[1] : fallback;
};
const format = flag('format', 'square');
const step = Number(flag('step', 20));
const [image, outArg] = args;

if (!image || !FORMATS[format] || !(step > 0)) {
  console.error(
    'Usage: node grid.mjs <image> [out.svg] [--format square|scene|landscape] [--step 20]',
  );
  process.exit(1);
}

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};
const mime = MIME[path.extname(image).toLowerCase()];
if (!mime) {
  console.error(`Unsupported image type: ${path.extname(image)}`);
  process.exit(1);
}

const { width, height } = FORMATS[format];
const data = fs.readFileSync(image).toString('base64');
const lines = [];
for (let x = 0; x <= width; x += step) {
  const major = (x / step) % 2 === 0;
  lines.push(
    `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke-width="${
      major ? 0.6 : 0.3
    }"/>`,
  );
  if (major && x > 0 && x < width)
    lines.push(`<text x="${x + 1.5}" y="7">${x}</text>`);
}
for (let y = 0; y <= height; y += step) {
  const major = (y / step) % 2 === 0;
  lines.push(
    `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke-width="${
      major ? 0.6 : 0.3
    }"/>`,
  );
  if (major && y > 0 && y < height)
    lines.push(`<text x="1.5" y="${y - 1.5}">${y}</text>`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${
  width * 3
}" height="${height * 3}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#FFFFFF"/>
  <image href="data:${mime};base64,${data}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" opacity="0.75"/>
  <g stroke="#FF5959" stroke-opacity="0.7" fill="#181C56" font-family="Arial, sans-serif" font-size="6" font-weight="700" paint-order="stroke">
    ${lines.join('\n    ')}
  </g>
</svg>
`;

const out =
  outArg ?? `${path.basename(image, path.extname(image))}-grid-${format}.svg`;
fs.writeFileSync(out, svg);
console.log(out);
