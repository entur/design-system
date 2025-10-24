import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'npa0lfls',
    dataset: 'production',
  },
  deployment: {
    appId: 'xmuw8s0v9ledey19ci7eyij5',
    autoUpdates: process.env.CI ? false : true,
  },
  graphql: [
    {
      tag: process.env.CI === 'true' ? 'default' : 'development',
      playground: process.env.CI === 'true' ? false : true,
    },
  ],
});
