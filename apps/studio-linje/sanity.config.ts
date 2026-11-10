import { defineConfig } from 'sanity';
import {
  type DefaultDocumentNodeResolver,
  structureTool,
} from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';
import { PREVIEW_PATH } from './previewPath';
import { OpenInPresentation } from './components/OpenInPresentation';

// Pages always open in Presentation, with the preview next to the editor
const PREVIEWED_TYPES = ['componentDoc', 'page'];
const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) =>
  PREVIEWED_TYPES.includes(schemaType)
    ? S.document().views([
        S.view.component(OpenInPresentation).title('Forhåndsvisning'),
      ])
    : S.document();

export default defineConfig({
  name: 'default',
  title: 'Linje',

  projectId: 'npa0lfls',
  dataset: 'production',

  plugins: [
    structureTool({ title: 'Sider', structure, defaultDocumentNode }),
    presentationTool({
      title: 'Forhåndsvisning',
      previewUrl: { initial: PREVIEW_PATH },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  // Not used by the team. Turning off releases makes Studio show
  // Scheduled Drafts instead, so both are off.
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
});
