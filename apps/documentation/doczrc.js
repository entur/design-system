import path from 'path';

export default {
  typescript: true,
  title: 'Entur Designsystem',
  ignore: ['README.md', 'CHANGELOG.md', '../../packages/*/node_modules'],
  src: 'content',
  docgenConfig: {
    propFilter: prop => {
      return prop.declarations[0].fileName.includes('@entur');
    },
    resolver: (exp, source) => {
      var name = path.basename(source.fileName, path.extname(source.fileName));
      return path.basename(name, path.extname(name));
    },
    searchPath: '../../node_modules/@entur',
  },
  filterComponents: files =>
    files.filter(filepath => /\/[A-Z]\w*.d.ts$/.test(filepath)),
};
