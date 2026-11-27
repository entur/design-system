import type { ColorMode } from './useGetIllustrations';

export const SCENARIO_BUILDER_ID = 'scenario-builder';

/** Width and height of a scene, as in the Figma component «Scenario 1 person» */
export const SCENE_WIDTH = 355;
export const SCENE_HEIGHT = 288;

export type ScenePlace = { value: string; label: string; offsetX: number };

// Background files in src/downloads/scenario-builder are named after `value`
export const SCENE_PLACES: ScenePlace[] = [
  { value: 'City', label: 'By', offsetX: 1 },
  { value: 'Train station', label: 'Togstasjon', offsetX: 0 },
];

type Placement = { scale: number; x: number; y: number };

// The person is placed like in the Figma component; Man biking was enlarged in the exported scenes
const DEFAULT_PLACEMENT: Placement = { scale: 0.75, x: 0, y: 50.875 };
const PLACEMENTS: Record<string, Placement> = {
  'Man biking': { scale: 0.84375, x: -27.8, y: 21.9 },
};

/** The people in the Figma component's instance swap, in Travellers */
export const SCENE_PEOPLE = [
  'Woman standing by luggage',
  'Woman walking with luggage',
  'Woman walking with phone',
  'Woman walking with phone and headphones',
  'Woman walking with guide dog',
  'Woman on wheelchair',
  'Woman holding package',
  'Woman standing with child',
  'Woman riding scooter',
  'Woman standing on scooter',
  'Man biking',
  'Man checking the time',
  'Man standing with dog',
  'Man and woman hugging',
  'Man and child sitting on a bench',
  'Senior walking with dog',
  'Child reaching up',
  'Person reading newspaper',
];

const parseSvg = (source: string, prefix: string) => {
  const open = source.match(/<svg\b[^>]*>/);
  if (!open) throw new Error('Not an SVG');
  const attribute = (name: string) =>
    open[0].match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
  const viewBox =
    attribute('viewBox') ??
    `0 0 ${attribute('width') ?? 0} ${attribute('height') ?? 0}`;
  const [, , width, height] = viewBox.split(/[\s,]+/).map(Number);
  // Both files come from Figma, so their ids (clip0_1_2, mask0_…) can collide
  const body = source
    .slice(open.index! + open[0].length, source.lastIndexOf('</svg>'))
    .replace(/\bid="([^"]+)"/g, `id="${prefix}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${prefix}$1"`);
  return { viewBox, width, height, body };
};

/** Combines a background and a person into one standalone SVG */
export const composeScene = (
  backgroundSvg: string,
  personSvg: string,
  person: string,
  place: ScenePlace,
) => {
  const background = parseSvg(backgroundSvg, 'bg-');
  const figure = parseSvg(personSvg, 'person-');
  const { scale, x, y } = PLACEMENTS[person] ?? DEFAULT_PLACEMENT;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SCENE_WIDTH}" height="${SCENE_HEIGHT}" viewBox="0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}" fill="none">`,
    `<svg width="${background.width}" height="${background.height}" viewBox="${background.viewBox}">${background.body}</svg>`,
    `<svg x="${x + place.offsetX}" y="${y}" width="${
      figure.width * scale
    }" height="${figure.height * scale}" viewBox="${figure.viewBox}">${
      figure.body
    }</svg>`,
    '</svg>',
  ].join('\n');
};

/** File name in the convention used by the exported scenes */
export const sceneFileName = (
  person: string,
  place: ScenePlace,
  colorMode: ColorMode,
) =>
  `${place.value.replace(' ', '-')}-${person}${
    colorMode === 'standard' ? '' : `-${colorMode}`
  }`;

const download = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadSvg = (svg: string, fileName: string) =>
  download(new Blob([svg], { type: 'image/svg+xml' }), `${fileName}.svg`);

/** Draws the SVG on a canvas at 4x, the scale of the other PNG files */
export const downloadPng = async (svg: string, fileName: string) => {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = SCENE_WIDTH * 4;
    canvas.height = SCENE_HEIGHT * 4;
    canvas
      .getContext('2d')
      ?.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, 'image/png'),
    );
    if (blob) download(blob, `${fileName}.png`);
  } finally {
    URL.revokeObjectURL(url);
  }
};
