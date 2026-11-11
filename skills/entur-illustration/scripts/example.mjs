// Example: square empty-state motif "Ingen avganger" — an arctic fox waiting
// at a bus stop. Run: node example.mjs <out-dir>
// Copy this file as the starting point for a new illustration.
//
// Like the library animals, the fox is paper with ink lines; the bus stop sign
// is the motif's one Peach element. It uses the animal construction: every
// line swells in the middle, the weights are heavier than on people, and
// each contour is drawn as a few overlapping strokes.

import { Drawing, rect } from './linje-ink.mjs';

const out = process.argv[2] ?? 'out';
const ink = new Drawing({
  format: 'square',
  seed: 11,
  title: 'Fjellrev som venter ved holdeplassen',
  construction: 'animals',
});
const W = ink.weights; // contour 2.1, detail 1.7, fine 1.3 at the widest point

// 1. Backdrop first: 62 % of the canvas, centred; the subject breaks out of it.
ink.backdrop();

// 2. Background details: thin secondary-colour lines only. No grass tufts
// by habit: the ground stays a bare line unless the scene needs nature.
ink.group('background', d => {
  d.cloud({ x: 62, y: 92, w: 46 });
});

// 3. Props behind the subject. The sign carries the motif's only Peach.
ink.group('bus-stop', d => {
  d.line([
    [232, 266],
    [231, 180],
    [232, 110],
  ]);
  d.line(
    [
      [236, 266],
      [235, 112],
    ],
    { width: W.detail },
  );
  d.shape(rect(204, 64, 58, 46), {
    fill: 'peach',
    corners: true,
    misregister: true,
  });
  d.group('bus-pictogram', p => {
    p.shape(rect(217, 73, 32, 20), {
      corners: true,
      width: W.detail,
      wobble: 0.3,
    });
    p.line(
      [
        [217, 83],
        [249, 83],
      ],
      { width: W.fine, corners: true, wobble: 0.2 },
    );
    p.dot(224, 96, 2.6);
    p.dot(242, 96, 2.6);
  });
});

// 4. Subject: paper fill under live strokes, back to front. Contours left
//    open (gap), interior lines thinner and floating inside the shape.
ink.group('fox', d => {
  const body = [
    [168, 176],
    [177, 214],
    [173, 262],
    [158, 264],
    [151, 236],
    [139, 262],
    [110, 264],
    [103, 234],
    [117, 196],
    [142, 168],
  ];
  d.shape(body, { gap: 2 });
  d.line(
    [
      [160, 224],
      [158, 260],
    ],
    { width: W.detail },
  );
  d.line(
    [
      [121, 214],
      [129, 228],
      [132, 246],
    ],
    { width: W.detail },
  );
  d.hatch({ x: 160, y: 190, w: 10, h: 14, angle: 70, spacing: 3.5 });
  // Fur at the chest: pointed marks with a coarser Roughen, as on the
  // hedgehog's spines and the sheep's wool.
  d.line(
    [
      [139, 176],
      [134, 184],
      [133, 192],
    ],
    { width: W.fine, profile: 'point', roughen: 1 },
  );

  d.group('head', h => {
    h.shape(
      [
        [143, 134],
        [139, 106],
        [157, 127],
      ],
      { corners: true },
    );
    h.shape(
      [
        [156, 129],
        [163, 104],
        [171, 133],
      ],
      { corners: true },
    );
    h.fill(
      [
        [143, 128],
        [141, 113],
        [150, 125],
      ],
      { role: 'ink', corners: true },
    );
    h.shape([
      [141, 169],
      [134, 148],
      [145, 131],
      [166, 133],
      [185, 140],
      [196, 147],
      [183, 154],
      [166, 167],
    ]);
    h.dot(194, 147, 2.6);
    h.line(
      [
        [168, 141],
        [172, 139.5],
        [176, 141.5],
      ],
      { width: W.contour, wobble: 0.1 },
    );
    h.line(
      [
        [170, 156],
        [180, 155],
      ],
      { width: W.detail, wobble: 0.1 },
    );
  });

  // Tail curls around the front, so it is drawn last.
  d.shape(
    [
      [110, 252],
      [86, 258],
      [62, 246],
      [58, 224],
      [72, 210],
      [88, 222],
      [98, 240],
    ],
    { gap: 1 },
  );
  d.line(
    [
      [78, 246],
      [92, 249],
    ],
    { width: W.detail },
  );
});

// 5. Ground on top, extending past the backdrop.
ink.ground({ y: 266, x1: 30, x2: 296 });

ink.marks({
  x: 182,
  y: 112,
  count: 3,
  spread: 60,
  angle: -60,
  inner: 6,
  outer: 13,
});

for (const f of ink.save(out, 'Fox-bus-stop')) console.log(f);
