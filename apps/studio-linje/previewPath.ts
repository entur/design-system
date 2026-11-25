// The preview app is built into static/preview and served by Studio itself,
// on the same origin, so Presentation can show it behind the Studio login
export const PREVIEW_PATH = '/static/preview/index.html';

export const previewPathFor = (documentId: string) =>
  `${PREVIEW_PATH}?id=${documentId.replace(/^drafts\./, '')}`;
