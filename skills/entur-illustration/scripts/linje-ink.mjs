// linje-ink — draws Entur Linje design system illustrations the way the
// source Illustrator files are built (measured from the raw .ai files):
//
//   lines  plain live strokes: one uniform width, round caps, round joins,
//          often left open. Roughen effect on top (Size 0.2 % relative,
//          Detail ~47/in, Smooth points). No brushes, no width profiles —
//          those belong to the marketing/print style, not the design system.
//   fills  flat colour under the lines with the same Roughen edge, and
//          shifted a little off the line so a sliver of paper shows.
//
// Here Roughen is baked into the path geometry; every line stays a stroke.
// Pass { roughen: false } for clean anchors, then apply Effect > Distort &
// Transform > Roughen in Illustrator instead.
//
// Every element stores a colour *role* (ink, paper, lavender, …), not a hex
// value, so one drawing renders to all three library colour modes.
// No filters, masks or gradients: the SVG opens in Illustrator and imports
// into Figma (`figma.createNodeFromSvg`) with strokes still editable.
//
// Zero dependencies. Node 18+.

import fs from 'node:fs';
import path from 'node:path';

/* ---------------------------------------------------------------- palette */

// Measured from the 410 exported SVGs in the Linje illustration library.
export const ROLES = {
  ink: { standard: '#181C56', dark: '#5E5F6C', contrast: '#626493' },
  paper: { standard: '#FFFFFF', dark: '#F2F2F5', contrast: '#FFFFFF' },
  // White clothing and gear on people, and vehicle bodies: white like paper in
  // standard mode, but the library greys them in dark (and contrast) mode.
  cloth: { standard: '#FFFFFF', dark: '#B3B4BD', contrast: '#BCBDD2' },
  vehicle: { standard: '#FFFFFF', dark: '#999AA7', contrast: '#FFFFFF' },
  line2: { standard: '#9EA0BD', dark: '#999AA7', contrast: '#9EA0BD' },
  backdrop: { standard: '#EAEAF1', dark: '#CCCDD4', contrast: '#393D79' },
  tint: { standard: '#EAEAF1', dark: '#B3B4BD', contrast: '#BCBDD2' },
  lavender: { standard: '#AEB7E2', dark: '#81828F', contrast: '#AEB7E2' },
  mid: { standard: '#54568C', dark: '#81828F', contrast: '#BCBDD2' },
  peach: { standard: '#FFBF9E', dark: '#FFBF9E', contrast: '#FFBF9E' },
  coral: { standard: '#FF5959', dark: '#FF9494', contrast: '#FF5959' },
  glow: { standard: '#9EA0BD', dark: '#FFEEB3', contrast: '#9EA0BD' },
};

// Surfaces each mode is designed to sit on (docs site preview backgrounds).
export const SURFACES = {
  standard: '#FFFFFF',
  dark: '#08091C',
  contrast: '#181C56',
};

export const FORMATS = {
  square: { width: 320, height: 320 },
  scene: { width: 356, height: 291 },
  landscape: { width: 1280, height: 360 },
};

// Stroke weights on the 320/356/1280 canvases. The live strokes in the Figma
// Illustration Library use 1.5 for contours, 1.0 for detail and 0.5–0.86 for
// fine lines. Raw .ai figures at ~410 pt tall use 1.88 / 1.22 / 1.0.
export const WEIGHTS = { contour: 1.5, detail: 1.0, fine: 0.85 };

// Illustrator Roughen, baked into the path: size in % of the object's
// diagonal, detail in points per inch of this canvas. The .ai sources use
// 47/in at their larger size; scaled onto the 320 canvas, the Figma strokes
// have an anchor every ~1.15 units (0.85–1.8), which is ~63/in here.
export const ROUGHEN = { size: 0.2, detail: 63 };

const MODE_SUFFIX = { standard: '', dark: '-darkmode', contrast: '-contrast' };

// White fills sit exactly under their line; only coloured fills are misregistered.
const WHITE_ROLES = new Set(['paper', 'cloth', 'vehicle']);

/* --------------------------------------------------------------- geometry */

const TAU = Math.PI * 2;
const r2 = n => Math.round(n * 100) / 100;
const pt = p => `${r2(p[0])} ${r2(p[1])}`;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Anchor points on an ellipse. 8–12 anchors is how a hand-drawn ellipse looks. */
export function ellipse(cx, cy, rx, ry = rx, n = 10, start = -90) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((start + (i / n) * 360) * Math.PI) / 180;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });
}
export const circle = (cx, cy, r, n) => ellipse(cx, cy, r, r, n);

/** Open arc from angle a0 to a1 in degrees (0 = right, 90 = down). */
export function arc(
  cx,
  cy,
  r,
  a0,
  a1,
  n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 40)),
) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
}

/** Rectangle corners. Draw with corners: true; round joins soften them. */
export function rect(x, y, w, h) {
  return [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
}

/* ----------------------------------------------------------- path building */

/** Catmull-Rom through the anchors, as cubic Bézier segments [p0, c1, c2, p1]. */
function controls(pts, closed) {
  const n = pts.length;
  const get = i =>
    closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  const segs = closed ? n : n - 1;
  return Array.from({ length: segs }, (_, i) => {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    return [
      p1,
      [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
      [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
      p2,
    ];
  });
}

/** Straight edges with a slight hand-drawn bow, corners kept. */
function bowed(pts, closed, bow, rand) {
  const n = pts.length;
  const segs = closed ? n : n - 1;
  return Array.from({ length: segs }, (_, i) => {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, len / 60) * bow;
    const o1 = (rand() - 0.5) * 2 * k;
    const o2 = (rand() - 0.5) * 2 * k;
    return [
      a,
      [a[0] + dx / 3 - (dy / len) * o1, a[1] + dy / 3 + (dx / len) * o1],
      [
        a[0] + (2 * dx) / 3 - (dy / len) * o2,
        a[1] + (2 * dy) / 3 + (dx / len) * o2,
      ],
      b,
    ];
  });
}

function bezierD(segments, closed) {
  if (!segments.length) return '';
  let d = `M${pt(segments[0][0])}`;
  for (const [, c1, c2, p] of segments) d += `C${pt(c1)} ${pt(c2)} ${pt(p)}`;
  return closed ? `${d}Z` : d;
}

/** Samples cubic segments into a polyline, about one point per `step`. */
function sample(segments, step, starts) {
  const out = [];
  for (const [p0, c1, c2, p3] of segments) {
    if (starts) starts.push(out.length);
    const len =
      Math.hypot(c1[0] - p0[0], c1[1] - p0[1]) +
      Math.hypot(c2[0] - c1[0], c2[1] - c1[1]) +
      Math.hypot(p3[0] - c2[0], p3[1] - c2[1]);
    const k = Math.max(1, Math.round(len / step));
    for (let j = 0; j < k; j++) {
      const t = j / k;
      const u = 1 - t;
      out.push(
        [0, 1].map(
          d =>
            u * u * u * p0[d] +
            3 * u * u * t * c1[d] +
            3 * u * t * t * c2[d] +
            t * t * t * p3[d],
        ),
      );
    }
  }
  return out;
}

function normals(poly, closed) {
  const n = poly.length;
  return poly.map((_, i) => {
    const a = poly[closed ? (i - 1 + n) % n : Math.max(0, i - 1)];
    const b = poly[closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return [-dy / len, dx / len];
  });
}

/** Smooth path through the points, with a sharp break at every index in `hard`. */
function runsD(pts, closed, hard) {
  if (!hard.size) return bezierD(controls(pts, closed), closed);
  let order = pts.map((_, i) => i);
  if (closed) {
    const first = order.find(i => hard.has(i));
    order = [...order.slice(first), ...order.slice(0, first), first];
  }
  const segs = [];
  let run = [pts[order[0]]];
  for (let k = 1; k < order.length; k++) {
    run.push(pts[order[k]]);
    if (hard.has(order[k]) || k === order.length - 1) {
      segs.push(...controls(run, false));
      run = [pts[order[k]]];
    }
  }
  return bezierD(segs, closed);
}

/**
 * Path data for an outline from the Drawing's roughen step: either clean
 * Bézier segments, or roughened points with their hard corners.
 */
function outlineD(outline, closed, shift = [0, 0]) {
  const move = p => [p[0] + shift[0], p[1] + shift[1]];
  if (outline.segments)
    return bezierD(
      outline.segments.map(seg => seg.map(move)),
      closed,
    );
  return runsD(outline.pts.map(move), closed, outline.hard);
}

const polyD = (poly, closed = true) =>
  `M${poly.map(pt).join('L')}${closed ? 'Z' : ''}`;

/* ---------------------------------------------------------------- drawing */

export class Drawing {
  /**
   * @param {object} opts
   * @param {'square'|'scene'|'landscape'} [opts.format]
   * @param {number} [opts.width]
   * @param {number} [opts.height]
   * @param {number} [opts.seed] same seed, same drawing
   * @param {string} [opts.title] becomes the SVG <title>
   * @param {[number, number]} [opts.misregister] how far colour fills sit off their lines
   * @param {{size: number, detail: number} | false} [opts.roughen] Illustrator Roughen
   *   settings to bake in (size in % of the object, detail per inch); false for clean paths
   */
  constructor({
    format = 'square',
    width,
    height,
    seed = 1,
    title = '',
    misregister = [1.2, 0.5],
    roughen = ROUGHEN,
  } = {}) {
    const f = FORMATS[format] ?? FORMATS.square;
    this.width = width ?? f.width;
    this.height = height ?? f.height;
    this.title = title;
    this.misregister = misregister;
    this.roughenSettings = roughen;
    this.rand = mulberry32(seed);
    this.root = { name: 'illustration', children: [] };
    this.stack = [this.root];
  }

  #push(el) {
    this.stack[this.stack.length - 1].children.push(el);
    return this;
  }

  /** Named layer. Becomes a group in Illustrator and a layer name in Figma. */
  group(name, draw) {
    const g = { name, children: [] };
    this.#push(g);
    this.stack.push(g);
    draw(this);
    this.stack.pop();
    return this;
  }

  /** Nudges anchors off their ideal position: the hand-drawn hand, before Roughen. */
  #jitter(points, wobble) {
    return points.map(p => [
      p[0] + (this.rand() - 0.5) * 2 * wobble,
      p[1] + (this.rand() - 0.5) * 2 * wobble,
    ]);
  }

  #segments(pts, closed, corners, wobble) {
    return corners
      ? bowed(pts, closed, wobble * 1.6 + 0.4, this.rand)
      : controls(pts, closed);
  }

  /**
   * Bakes Illustrator's Roughen (relative size, smooth points) into an
   * outline: one new point every 72/detail units, pushed a random distance
   * to either side, up to size % of the object's diagonal. Small objects
   * barely move, as in Illustrator. With `corners`, the segment ends stay
   * put and the path breaks there, so corners stay sharp.
   */
  #roughen(segments, closed, corners) {
    const settings = this.roughenSettings;
    if (!settings) return { segments };
    const starts = [];
    const poly = sample(segments, 72 / settings.detail, starts);
    if (!closed) poly.push(segments[segments.length - 1][3]);
    const hard = new Set(
      corners ? [...starts, ...(closed ? [] : [poly.length - 1])] : [],
    );
    const xs = poly.map(p => p[0]);
    const ys = poly.map(p => p[1]);
    const diag = Math.hypot(
      Math.max(...xs) - Math.min(...xs),
      Math.max(...ys) - Math.min(...ys),
    );
    const amp = (diag * settings.size) / 100;
    if (amp < 0.05 || poly.length < 4) return { segments };
    const nrm = normals(poly, closed);
    const pts = poly.map((p, i) => {
      if (hard.has(i)) return p;
      const o = (this.rand() * 2 - 1) * amp;
      return [p[0] + nrm[i][0] * o, p[1] + nrm[i][1] * o];
    });
    return { pts, hard };
  }

  /** Leaves `spans` of the closed outline's anchors out: the open contour. */
  #open(outline, spans, anchors) {
    if (outline.segments) {
      const n = outline.segments.length;
      const start = Math.floor(this.rand() * n);
      return {
        segments: Array.from(
          { length: n - spans },
          (_, k) => outline.segments[(start + spans + k) % n],
        ),
      };
    }
    const n = outline.pts.length;
    const cut = Math.max(1, Math.round((spans / anchors) * n));
    const start = Math.floor(this.rand() * n);
    const order = Array.from(
      { length: n - cut + 1 },
      (_, k) => (start + cut + k) % n,
    );
    return {
      pts: order.map(i => outline.pts[i]),
      hard: new Set(
        order.flatMap((i, k) =>
          outline.hard.has(i) && k > 0 && k < order.length - 1 ? [k] : [],
        ),
      ),
    };
  }

  /**
   * One object: a flat fill under a live ink stroke.
   *
   * fill / stroke   colour role, or null for none
   * corners         straight edges with round joins instead of a smooth curve
   * gap             number of anchor spans left out of the stroke: the open contour
   * misregister     false to sit a colour fill exactly under the line
   */
  shape(points, opts = {}) {
    const {
      fill = 'paper',
      stroke = 'ink',
      width = WEIGHTS.contour,
      corners = false,
      wobble = 0.6,
      gap = 0,
      misregister = true,
    } = opts;
    // One roughened outline serves both the fill and the stroke, so their
    // edges match; misregistration only translates the fill's copy.
    const pts = this.#jitter(points, wobble);
    const outline = this.#roughen(
      this.#segments(pts, true, corners, wobble),
      true,
      corners,
    );
    if (fill) {
      const shift =
        misregister && stroke && !WHITE_ROLES.has(fill)
          ? this.misregister
          : [0, 0];
      this.#push({ d: outlineD(outline, true, shift), fill, stroke: null });
    }
    if (stroke) {
      const open = gap > 0 && pts.length > gap + 2;
      this.#push({
        d: open
          ? outlineD(this.#open(outline, gap, pts.length), false)
          : outlineD(outline, true),
        fill: null,
        stroke,
        width,
      });
    }
    return this;
  }

  /** Flat fill with a Roughen edge and no line (hair, shadow shapes, colour blocks). */
  fill(points, { role = 'ink', corners = false, wobble = 0.5 } = {}) {
    return this.shape(points, { fill: role, stroke: null, corners, wobble });
  }

  /** Open live stroke — the main way to draw. Uniform width, round caps. */
  line(points, opts = {}) {
    const {
      role = 'ink',
      width = WEIGHTS.contour,
      corners = false,
      wobble = 0.5,
      dash,
    } = opts;
    const segs = this.#segments(
      this.#jitter(points, wobble),
      false,
      corners,
      wobble,
    );
    return this.#push({
      d: outlineD(this.#roughen(segs, false, corners), false),
      fill: null,
      stroke: role,
      width,
      dash,
    });
  }

  /** A dot (eye, nostril, button): a tiny filled circle, no line. */
  dot(x, y, r = 1.6, { role = 'ink' } = {}) {
    return this.#push({
      d: bezierD(controls(circle(x, y, r, 6), true), true),
      fill: role,
      stroke: null,
    });
  }

  /**
   * The soft, grainy shape behind the subject: a ragged fill with fine specks
   * at the edge, like dry brush on paper.
   */
  backdrop({ cx, cy, r, rx = r, ry = r, role = 'backdrop', grain = 1 } = {}) {
    const n = Math.round(Math.max(rx, ry) * 3);
    const phase = this.rand() * TAU;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      const lump =
        1 +
        Math.sin(a * 3 + phase) * 0.012 +
        Math.sin(a * 7 + phase * 2) * 0.006;
      const jag = (this.rand() - 0.5) * 2 * grain;
      pts.push([
        cx + Math.cos(a) * (rx * lump + jag),
        cy + Math.sin(a) * (ry * lump + jag),
      ]);
    }
    this.#push({ name: 'backdrop', d: polyD(pts), fill: role, stroke: null });
    if (grain > 0) {
      const specks = [];
      const count = Math.round((rx + ry) * 2 * grain);
      for (let i = 0; i < count; i++) {
        const a = this.rand() * TAU;
        const out = Math.pow(this.rand(), 2.2) * 6 * grain;
        const sr = 0.25 + this.rand() * 0.5;
        const x = cx + Math.cos(a) * (rx + out) - sr;
        const y = cy + Math.sin(a) * (ry + out);
        specks.push(
          `M${r2(x)} ${r2(y)}a${r2(sr)} ${r2(sr)} 0 1 0 ${r2(sr * 2)} 0a${r2(
            sr,
          )} ${r2(sr)} 0 1 0 ${r2(-sr * 2)} 0Z`,
        );
      }
      this.#push({
        name: 'backdrop-grain',
        d: specks.join(''),
        fill: role,
        stroke: null,
      });
    }
    return this;
  }

  /** Broken horizontal ground lines the subject stands on. */
  ground({
    y,
    x1,
    x2,
    rows = 2,
    spacing = 7,
    role = 'ink',
    width = WEIGHTS.contour,
  } = {}) {
    for (let row = 0; row < rows; row++) {
      const inset = row * (x2 - x1) * 0.06;
      let x = x1 + inset + this.rand() * 6;
      const end = x2 - inset - this.rand() * 6;
      const yy = y + row * spacing;
      while (x < end - 6) {
        const len = Math.min(end - x, 40 + this.rand() * 110);
        this.line(
          [
            [x, yy],
            [x + len, yy + (this.rand() - 0.5) * 0.8],
          ],
          {
            role: row === 0 ? role : 'line2',
            width: row === 0 ? width : WEIGHTS.detail,
            corners: true,
            wobble: 0.3,
          },
        );
        x += len + 4 + this.rand() * 10;
      }
    }
    return this;
  }

  /** Short parallel strokes for shade or texture, laid across a box. */
  hatch({
    x,
    y,
    w,
    h,
    angle = 60,
    spacing = 4,
    role = 'ink',
    width = WEIGHTS.fine,
  } = {}) {
    const a = (angle * Math.PI) / 180;
    const count = Math.max(1, Math.floor(w / spacing));
    for (let i = 0; i < count; i++) {
      const len = h * (0.55 + this.rand() * 0.45);
      const bx = x + i * spacing + (this.rand() - 0.5) * 1.2;
      const by = y + h - (h - len) * this.rand();
      this.line(
        [
          [bx, by],
          [bx + Math.cos(a) * len, by - Math.sin(a) * len],
        ],
        {
          role,
          width,
          corners: true,
          wobble: 0.2,
        },
      );
    }
    return this;
  }

  /** Radiating attention/surprise marks, e.g. above a head. */
  marks({
    x,
    y,
    count = 3,
    spread = 70,
    angle = -90,
    inner = 8,
    outer = 17,
    role = 'ink',
    width = WEIGHTS.contour,
  } = {}) {
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const a = ((angle - spread / 2 + spread * t) * Math.PI) / 180;
      const o = outer + (i === Math.floor(count / 2) ? 3 : 0);
      this.line(
        [
          [x + Math.cos(a) * inner, y + Math.sin(a) * inner],
          [x + Math.cos(a) * o, y + Math.sin(a) * o],
        ],
        { role, width, corners: true, wobble: 0.1 },
      );
    }
    return this;
  }

  /** Scalloped cloud outline in the secondary line colour. */
  cloud({ x, y, w = 60, role = 'line2', width = WEIGHTS.detail } = {}) {
    const h = w * 0.32;
    return this.line(
      [
        [x, y],
        [x + w * 0.1, y - h * 0.35],
        [x + w * 0.25, y - h * 0.4],
        [x + w * 0.35, y - h * 0.85],
        [x + w * 0.55, y - h],
        [x + w * 0.68, y - h * 0.6],
        [x + w * 0.85, y - h * 0.55],
        [x + w, y],
      ],
      { role, width, wobble: 0.3 },
    );
  }

  text(
    str,
    { x, y, size = 12, role = 'ink', weight = 600, anchor = 'start' } = {},
  ) {
    return this.#push({ text: str, x, y, size, fill: role, weight, anchor });
  }

  /** Escape hatch for custom path data, still coloured by role. */
  raw(d, { fill = null, stroke = null, width = WEIGHTS.contour } = {}) {
    return this.#push({ d, fill, stroke, width });
  }

  /* ------------------------------------------------------------- output */

  render(mode = 'standard', { background = false } = {}) {
    const color = role => {
      if (!role) return 'none';
      if (role.startsWith('#')) return role;
      const c = ROLES[role]?.[mode];
      if (!c) throw new Error(`Unknown colour role "${role}"`);
      return c;
    };
    const emit = (node, depth) => {
      const pad = '  '.repeat(depth);
      if (node.children) {
        const inner = node.children.map(c => emit(c, depth + 1)).join('\n');
        return depth === 0
          ? inner
          : `${pad}<g id="${esc(node.name)}">\n${inner}\n${pad}</g>`;
      }
      if (node.text !== undefined) {
        return `${pad}<text x="${r2(node.x)}" y="${r2(
          node.y,
        )}" font-family="Nationale, Arial, sans-serif" font-size="${
          node.size
        }" font-weight="${node.weight}" text-anchor="${
          node.anchor
        }" fill="${color(node.fill)}">${esc(node.text)}</text>`;
      }
      const attrs = [];
      if (node.name) attrs.push(`id="${esc(node.name)}"`);
      attrs.push(`d="${node.d}"`, `fill="${color(node.fill)}"`);
      if (node.stroke) {
        attrs.push(
          `stroke="${color(node.stroke)}"`,
          `stroke-width="${node.width}"`,
          'stroke-linecap="round"',
          'stroke-linejoin="round"',
        );
        if (node.dash) attrs.push(`stroke-dasharray="${node.dash.join(' ')}"`);
      }
      return `${pad}<path ${attrs.join(' ')}/>`;
    };
    const bg = background
      ? `  <rect width="${this.width}" height="${this.height}" fill="${SURFACES[mode]}"/>\n`
      : '';
    const title = this.title ? `  <title>${esc(this.title)}</title>\n` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${
      this.width
    }" height="${this.height}" viewBox="0 0 ${this.width} ${
      this.height
    }" fill="none">\n${title}${bg}${emit(this.root, 0)}\n</svg>\n`;
  }

  /**
   * Writes name.svg, name-darkmode.svg and name-contrast.svg (library naming),
   * plus name-preview.html showing each mode on its intended surface.
   */
  save(dir, name, { modes = ['standard', 'dark', 'contrast'] } = {}) {
    fs.mkdirSync(dir, { recursive: true });
    const files = modes.map(mode => {
      const file = path.join(dir, `${name}${MODE_SUFFIX[mode]}.svg`);
      fs.writeFileSync(file, this.render(mode));
      return file;
    });
    const cells = modes
      .map(mode => {
        const src = encodeURI(`${name}${MODE_SUFFIX[mode]}.svg`);
        const ink = mode === 'standard' ? '#181C56' : '#FFFFFF';
        return `<figure style="margin:0;background:${SURFACES[mode]};padding:16px;border-radius:8px"><img src="${src}" style="width:100%;display:block"><figcaption style="color:${ink};font:600 12px Arial;margin-top:8px">${mode}</figcaption></figure>`;
      })
      .join('');
    const preview = path.join(dir, `${name}-preview.html`);
    fs.writeFileSync(
      preview,
      `<!doctype html><meta charset="utf-8"><title>${esc(
        name,
      )}</title><body style="margin:24px;background:#f6f6f9"><div style="display:grid;grid-template-columns:repeat(${
        modes.length
      },minmax(0,1fr));gap:16px;max-width:${
        modes.length * 420
      }px">${cells}</div></body>`,
    );
    return [...files, preview];
  }
}

function esc(s) {
  return String(s).replace(
    /[&<>"]/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]),
  );
}
