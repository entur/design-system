// Example: square empty-state motif "Ingen avganger" — an arctic fox waiting
// at a bus stop. Run: node example.mjs <out-dir>
// Copy this file as the starting point for a new illustration.
//
// Like the library animals, the fox is paper with ink lines; the bus stop sign
// is the motif's one Peach element.

import { Drawing, WEIGHTS, rect } from './linje-ink.mjs';

const out = process.argv[2] ?? 'out';
const ink = new Drawing({
  format: 'square',
  seed: 11,
  title: 'Fjellrev som venter ved holdeplassen',
});

// 1. Backdrop first, centred a little above the subject; the subject breaks out of it.
ink.backdrop({ cx: 166, cy: 150, r: 104 });

// 2. Background details: thin secondary-colour lines only.
ink.group('background', d => {
  d.cloud({ x: 62, y: 92, w: 46 });
  d.line(
    [
      [48, 262],
      [52, 251],
      [55, 262],
    ],
    { role: 'line2', width: WEIGHTS.detail },
  );
  d.line(
    [
      [268, 262],
      [271, 250],
      [275, 262],
    ],
    { role: 'line2', width: WEIGHTS.detail },
  );
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
    { width: WEIGHTS.detail },
  );
  d.shape(rect(204, 64, 58, 46), { fill: 'peach', corners: true });
  d.group('bus-pictogram', p => {
    p.shape(rect(217, 73, 32, 20), {
      corners: true,
      width: WEIGHTS.detail,
      wobble: 0.3,
    });
    p.line(
      [
        [217, 83],
        [249, 83],
      ],
      { width: WEIGHTS.fine, corners: true, wobble: 0.2 },
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
    { width: WEIGHTS.detail },
  );
  d.line(
    [
      [121, 214],
      [129, 228],
      [132, 246],
    ],
    { width: WEIGHTS.detail },
  );
  d.hatch({ x: 160, y: 190, w: 10, h: 14, angle: 70, spacing: 3.5 });

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
      { width: WEIGHTS.contour, wobble: 0.1 },
    );
    h.line(
      [
        [170, 156],
        [180, 155],
      ],
      { width: WEIGHTS.detail, wobble: 0.1 },
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
    { width: WEIGHTS.detail },
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
