export default {
  typescript: true,
  title: 'Entur Designsystem',
  ignore: ['README.md', 'CHANGELOG.md', 'packages/*/node_modules'],
  src: 'content',
  docgenConfig: {
    searchPath: 'packages/*/dist',
  },
};
