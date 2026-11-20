// linje-ink — draws Entur Linje design system illustrations the way the
// source Illustrator files are built (measured from the raw .ai files).
// The library has two constructions:
//
//   people   people, Entur staff, vehicles, scenes and landscapes. Plain live
//            strokes: one uniform width, round caps, round joins, often left
//            open. Roughen on top (Size 0.2 % relative, Detail ~47/in,
//            Smooth points). Fills on the same outline as the line; one to
//            three colour fills per figure shifted ~0.6 off it
//            (misregister: true) for the hand-printed look.
//   animals  animals and objects, the square status motifs. Each stroke
//            carries a width profile: it swells in the middle and ends at
//            about half its width. Heavier weights, and each contour is
//            several short overlapping strokes.
//
// Brush strokes belong to the marketing/print style and are not used.
//
// Here Roughen is baked into the path geometry. Uniform lines stay strokes.
// A line with a width profile cannot be an SVG stroke, so it is written as
// a filled outline, as in the library's own SVG exports; with
// { profiles: 'stroke' } it stays a centre-line stroke named after its
// profile, for illustrator_import_drawing to give it a real width profile.
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
  // Lavender keeps its value in dark mode on people and in scenes (15 of 15
  // and 26 of 26 dark files); only the device illustrations darken it.
  lavender: { standard: '#AEB7E2', dark: '#AEB7E2', contrast: '#AEB7E2' },
  mid: { standard: '#54568C', dark: '#81828F', contrast: '#BCBDD2' },
  peach: { standard: '#FFBF9E', dark: '#FFBF9E', contrast: '#FFBF9E' },
  coral: { standard: '#FF5959', dark: '#FF9494', contrast: '#FF5959' },
  glow: { standard: '#9EA0BD', dark: '#FFEEB3', contrast: '#9EA0BD' },
  // Vehicle windows: navy like ink by day, lit in dark mode (palette.md).
  window: { standard: '#181C56', dark: '#FFEEB3', contrast: '#626493' },
};

// The library's dark-mode disc is Ebony 20 at 30 % opacity, so it sits back
// on the dark surface (Dog, Ducks, Doves and Sheep, -background-darkmode).
const FILL_OPACITY = { backdrop: { dark: 0.3 } };

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

// Animals and objects, at the widest point of each line. Measured in the
// source file of the square motifs (750 pt artboards: 5 / 4 / 3 pt).
export const ANIMAL_WEIGHTS = { contour: 2.1, detail: 1.7, fine: 1.3 };

// Width profiles as [position along the line 0–1, share of the full width]
// pairs: the three most used in the animals source file. `swell` is the
// default for animals; `point` is for spines, whiskers and short marks.
export const PROFILES = {
  swell: [
    [0, 0.47],
    [0.44, 1],
    [0.83, 0.75],
    [1, 0.47],
  ],
  thin: [
    [0, 0.27],
    [0.47, 1],
    [1, 0.27],
  ],
  point: [
    [0, 0],
    [0.5, 1],
    [1, 0],
  ],
};

const CONSTRUCTIONS = {
  people: { weights: WEIGHTS, profile: null, pieces: 1 },
  animals: { weights: ANIMAL_WEIGHTS, profile: 'swell', pieces: 3 },
};

// Illustrator Roughen, baked into the path: size in % of the object's
// diagonal, detail in points per inch of this canvas. The .ai sources use
// 47/in at their larger size; scaled onto the 320 canvas, the Figma strokes
// have an anchor every ~1.15 units (0.85–1.8), which is ~63/in here.
// `max` caps the push in canvas units: 0.2 % of a 260-wide counter or train
// (~0.5) saws a long straight edge, so large objects stop at 0.35.
export const ROUGHEN = { size: 0.2, detail: 63, max: 0.35 };

const MODE_SUFFIX = { standard: '', dark: '-darkmode', contrast: '-contrast' };

// White fills never shift; a colour fill shifts only when its shape asks for it.
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

/** Dense points along an open outline from the Drawing's roughen step. */
function densePoints(outline) {
  if (outline.pts) return outline.pts;
  const segs = outline.segments;
  return [...sample(segs, 0.8), segs[segs.length - 1][3]];
}

/** Share of the full width at position t (0–1) along a width profile. */
function profileAt(profile, t) {
  for (let i = 1; i < profile.length; i++) {
    const [t1, w1] = profile[i];
    const [t0, w0] = profile[i - 1];
    if (t <= t1) return w0 + ((w1 - w0) * (t - t0)) / (t1 - t0 || 1);
  }
  return profile[profile.length - 1][1];
}

/**
 * Outline of a stroke whose width follows a profile, with round caps: what
 * Illustrator's Expand Appearance makes of a width-profiled stroke.
 */
function swellD(poly, width, profile) {
  const n = poly.length;
  if (n < 2) return '';
  const len = [0];
  for (let i = 1; i < n; i++)
    len.push(
      len[i - 1] +
        Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]),
    );
  const total = len[n - 1] || 1;
  // Normals over a wider window, so the Roughen tremor does not kink them.
  const nrm = poly.map((_, i) => {
    const a = poly[Math.max(0, i - 2)];
    const b = poly[Math.min(n - 1, i + 2)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  });
  const half = len.map(l => (width / 2) * profileAt(profile, l / total));
  const side = s =>
    poly.map((p, i) => [
      p[0] + s * nrm[i][0] * half[i],
      p[1] + s * nrm[i][1] * half[i],
    ]);
  // Half a circle round an end, from one side to the other.
  const cap = (i, back) => {
    const r = half[i];
    if (r < 0.05) return [];
    const [nx, ny] = nrm[i];
    const [tx, ty] = [ny, -nx];
    const s = back ? -1 : 1;
    return [1, 2, 3, 4, 5].map(k => {
      const a = (k / 6) * Math.PI;
      return [
        poly[i][0] + s * r * (nx * Math.cos(a) + tx * Math.sin(a)),
        poly[i][1] + s * r * (ny * Math.cos(a) + ty * Math.sin(a)),
      ];
    });
  };
  const ring = [
    ...side(1),
    ...cap(n - 1, false),
    ...side(-1).reverse(),
    ...cap(0, true),
  ];
  return bezierD(controls(ring, true), true);
}

/* ---------------------------------------------------------------- drawing */

export class Drawing {
  /**
   * @param {object} opts
   * @param {'square'|'scene'|'landscape'} [opts.format]
   * @param {number} [opts.width]
   * @param {number} [opts.height]
   * @param {number} [opts.seed] same seed, same drawing
   * @param {string} [opts.title] becomes the SVG <title>
   * @param {[number, number]} [opts.misregister] how far a misregistered colour fill sits off its line
   * @param {{size: number, detail: number, max?: number} | false} [opts.roughen] Illustrator
   *   Roughen settings to bake in (size in % of the object, detail per inch, max push in
   *   canvas units); false for clean paths
   * @param {'people'|'animals'} [opts.construction] people, staff, vehicles and scenes
   *   have uniform lines; animals and objects have swelling lines (width profiles)
   * @param {'outline'|'stroke'} [opts.profiles] how a line with a width profile is
   *   written: a filled outline (web, Figma), or a centre-line stroke named
   *   `profile-<name>-<n>` for illustrator_import_drawing
   */
  constructor({
    format = 'square',
    width,
    height,
    seed = 1,
    title = '',
    misregister = [0.6, 0.3],
    roughen = ROUGHEN,
    construction = 'people',
    profiles = 'outline',
  } = {}) {
    const f = FORMATS[format] ?? FORMATS.square;
    const c = CONSTRUCTIONS[construction];
    if (!c) throw new Error(`Unknown construction "${construction}"`);
    this.width = width ?? f.width;
    this.height = height ?? f.height;
    this.title = title;
    this.misregister = misregister;
    this.roughenSettings = roughen;
    this.construction = c;
    /** Line weights for this construction: contour, detail, fine. */
    this.weights = c.weights;
    this.profiles = profiles;
    this.rand = mulberry32(seed);
    this.root = { name: 'illustration', children: [] };
    this.stack = [this.root];
    this.profileCount = 0;
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
  #roughen(segments, closed, corners, size) {
    // A per-line size (fur, wool, spines) replaces the default and its cap.
    const settings =
      this.roughenSettings && size != null
        ? { ...this.roughenSettings, size, max: Infinity }
        : this.roughenSettings;
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
    const amp = Math.min(
      (diag * settings.size) / 100,
      settings.max ?? Infinity,
    );
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
   * Cuts an outline into open strokes, the way animal contours are drawn: a
   * few short strokes that overlap a little. With `corners` it cuts at every
   * corner instead, one stroke per side.
   */
  #pieces(outline, closed, count, corners) {
    if (outline.segments) {
      const segs = outline.segments;
      const m = segs.length;
      if (corners) return segs.map(s => ({ segments: [s] }));
      const k = Math.max(1, Math.min(count, m));
      const start = closed ? Math.floor(this.rand() * m) : 0;
      return Array.from({ length: k }, (_, j) => {
        const a = Math.round((j * m) / k);
        const b = Math.round(((j + 1) * m) / k);
        return {
          segments: Array.from(
            { length: b - a },
            (_, i) => segs[(start + a + i) % m],
          ),
        };
      });
    }
    const { pts } = outline;
    const n = pts.length;
    const at = i => pts[closed ? ((i % n) + n) % n : i];
    let cuts;
    let overlap = 0;
    if (corners && outline.hard.size) {
      cuts = [...outline.hard].sort((x, y) => x - y);
      if (closed) cuts.push(cuts[0] + n);
      else cuts = [...new Set([0, ...cuts, n - 1])];
    } else {
      const k = Math.max(1, Math.min(count, Math.floor(n / 6)));
      const start = closed ? Math.floor(this.rand() * n) : 0;
      const span = closed ? n : n - 1;
      cuts = Array.from(
        { length: k + 1 },
        (_, j) => start + Math.round((j * span) / k),
      );
      overlap = k > 1 ? 2 : 0;
    }
    const runs = [];
    for (let j = 0; j < cuts.length - 1; j++) {
      let a = cuts[j] - overlap;
      let b = cuts[j + 1] + overlap;
      if (!closed) {
        a = Math.max(0, a);
        b = Math.min(n - 1, b);
      }
      const run = [];
      for (let i = a; i <= b; i++) run.push(at(i));
      if (run.length > 1) runs.push({ pts: run, hard: new Set() });
    }
    return runs;
  }

  /** Writes one open line: a plain stroke, or a stroke with a width profile. */
  #stroke(outline, { role, width, dash, profile, roughen }) {
    const shape = typeof profile === 'string' ? PROFILES[profile] : profile;
    if (profile && !shape) throw new Error(`Unknown profile "${profile}"`);
    if (!shape || dash)
      return this.#push({
        d: outlineD(outline, false),
        fill: null,
        stroke: role,
        width,
        dash,
      });
    if (this.profiles === 'stroke' && typeof profile === 'string') {
      this.profileCount += 1;
      const rough = roughen != null ? `-r${roughen}` : '';
      return this.#push({
        name: `profile-${profile}-${this.profileCount}${rough}`,
        d: outlineD(outline, false),
        fill: null,
        stroke: role,
        width,
      });
    }
    return this.#push({
      d: swellD(densePoints(outline), width, shape),
      fill: role,
      stroke: null,
    });
  }

  /**
   * One object: a flat fill under a live ink stroke.
   *
   * fill / stroke   colour role, or null for none
   * corners         straight edges with round joins instead of a smooth curve
   * gap             number of anchor spans left out of the stroke: the open contour
   * misregister     true to shift this colour fill ~0.6 off its line; use it on
   *                 one to three areas per figure, the rest sit exactly under
   * profile         width profile of the line (animals default: 'swell'); null
   *                 for a uniform stroke
   * pieces          how many overlapping strokes draw the contour (animals: 3)
   * roughen         Roughen size in % for this shape (fur, wool), default 0.2
   */
  shape(points, opts = {}) {
    const {
      fill = 'paper',
      stroke = 'ink',
      width = this.weights.contour,
      corners = false,
      wobble = 0.6,
      gap = 0,
      misregister = false,
      profile = this.construction.profile,
      pieces = this.construction.pieces,
      roughen,
    } = opts;
    // One roughened outline serves both the fill and the stroke, so their
    // edges match; misregistration only translates the fill's copy.
    const pts = this.#jitter(points, wobble);
    const outline = this.#roughen(
      this.#segments(pts, true, corners, wobble),
      true,
      corners,
      roughen,
    );
    if (fill) {
      const shift =
        misregister && stroke && !WHITE_ROLES.has(fill)
          ? this.misregister
          : [0, 0];
      this.#push({ d: outlineD(outline, true, shift), fill, stroke: null });
    }
    if (stroke && profile) {
      const open = gap > 0 && pts.length > gap + 2;
      const run = open ? this.#open(outline, gap, pts.length) : outline;
      for (const piece of this.#pieces(run, !open, pieces, corners))
        this.#stroke(piece, { role: stroke, width, profile, roughen });
    } else if (stroke) {
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

  /**
   * Open live stroke — the main way to draw. Round caps; uniform width for
   * people, a width profile for animals (`profile: 'point'` for spines and
   * whiskers, null for uniform). `roughen` sets the Roughen size in %.
   */
  line(points, opts = {}) {
    const {
      role = 'ink',
      width = this.weights.contour,
      corners = false,
      wobble = 0.5,
      dash,
      profile = this.construction.profile,
      roughen,
    } = opts;
    const segs = this.#segments(
      this.#jitter(points, wobble),
      false,
      corners,
      wobble,
    );
    return this.#stroke(this.#roughen(segs, false, corners, roughen), {
      role,
      width,
      dash,
      profile,
      roughen,
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
   * The disc behind a square motif. In the source file it is a plain circle,
   * 62 % of the canvas wide and centred on it, whose ragged edge comes only
   * from a coarser Roughen: 0.65 % relative, an anchor every ~1.2 units.
   * With { roughen: false } on the Drawing it stays a clean 4-anchor circle
   * for Illustrator to roughen.
   */
  backdrop({
    cx = this.width / 2,
    cy = this.height / 2,
    r = this.width * 0.31,
    role = 'backdrop',
    roughen = 0.65,
  } = {}) {
    const n = Math.round((TAU * r) / 1.2);
    const amp = (2 * r * Math.SQRT2 * roughen) / 100;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * TAU;
      const rr = r + (this.rand() * 2 - 1) * amp;
      return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
    });
    return this.#push({
      name: 'backdrop',
      d:
        roughen > 0 && this.roughenSettings
          ? bezierD(controls(pts, true), true)
          : bezierD(controls(circle(cx, cy, r, 4), true), true),
      fill: role,
      stroke: null,
    });
  }

  /**
   * The ground line the subject stands on: one ink line at detail weight in
   * one to three long pieces, as under the library's people and animals.
   * `rows: 2` adds a shorter Blue 50 line below, for scenes.
   */
  ground({
    y,
    x1,
    x2,
    rows = 1,
    spacing = 7,
    role = 'ink',
    width = this.weights.detail,
  } = {}) {
    for (let row = 0; row < rows; row++) {
      const inset = row * (x2 - x1) * 0.06;
      let x = x1 + inset + this.rand() * 6;
      const end = x2 - inset - this.rand() * 6;
      const yy = y + row * spacing;
      while (x < end - 6) {
        // No short stub at the end: a piece that would leave one runs on.
        let len = 90 + this.rand() * 130;
        if (end - x - len < 40) len = end - x;
        this.line(
          [
            [x, yy],
            [x + len, yy + (this.rand() - 0.5) * 0.8],
          ],
          {
            role: row === 0 ? role : 'line2',
            width: row === 0 ? width : this.weights.detail,
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
    width = this.weights.fine,
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
    width = this.weights.contour,
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
  cloud({ x, y, w = 60, role = 'line2', width = this.weights.detail } = {}) {
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
  raw(d, { fill = null, stroke = null, width = this.weights.contour } = {}) {
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
      const opacity = FILL_OPACITY[node.fill]?.[mode];
      if (opacity) attrs.push(`fill-opacity="${opacity}"`);
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
