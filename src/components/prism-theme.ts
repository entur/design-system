import { PrismTheme } from 'prism-react-renderer';
import { colors } from '@entur/tokens';

const theme: PrismTheme = {
  plain: {
    backgroundColor: colors.brand.white,
    borderRadius: '1px',
    color: colors.brand.blue,
    fontFamily: '"Dank Mono", monospace',
  },
  styles: [
    {
      types: ['changed'],
      style: {
        color: 'rgb(162, 191, 252)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['deleted'],
      style: {
        color: 'rgba(239, 83, 80, 0.56)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['inserted', 'attr-name'],
      style: {
        color: colors.greys.grey,
        fontStyle: 'italic',
      },
    },
    {
      types: ['comment'],
      style: {
        color: 'rgb(152, 159, 177)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['string', 'builtin', 'char', 'constant', 'url'],
      style: {
        color: colors.brand.coral,
      },
    },
    {
      types: ['variable'],
      style: {
        color: 'rgb(201, 103, 101)',
      },
    },
    {
      types: ['number'],
      style: {
        color: colors.brand.coral,
      },
    },
    {
      // This was manually added after the auto-generation
      // so that punctuations are not italicised
      types: ['punctuation'],
      style: {
        color: colors.brand.blue,
      },
    },
    {
      types: ['function', 'selector', 'doctype'],
      style: {
        color: 'rgb(153, 76, 195)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['class-name'],
      style: {
        color: 'rgb(17, 17, 17)',
      },
    },
    {
      types: ['tag'],
      style: {
        color: colors.brand.blue,
      },
    },
    {
      types: ['operator', 'property', 'keyword', 'namespace'],
      style: {
        color: colors.brand.blue,
      },
    },
    {
      types: ['boolean'],
      style: {
        color: colors.brand.coral,
      },
    },
  ],
};

export default theme;
