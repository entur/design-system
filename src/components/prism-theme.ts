import { PrismTheme } from 'prism-react-renderer';
import { colors } from '@entur/tokens';

const theme2: PrismTheme = {
  plain: {
    backgroundColor: colors.greys.grey80,
    color: colors.brand.blue,
    fontFamily: '"Monaco", monospace',
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
        color: colors.greys.grey50,
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
      types: ['tag', 'operator'],
      style: {
        color: colors.validation.sky,
      },
    },
    {
      types: ['property', 'keyword', 'namespace'],
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

var theme: PrismTheme = {
  plain: {
    backgroundColor: colors.greys.grey80,
    color: colors.brand.blue,
    fontFamily: '"Monaco", monospace',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata', 'punctuation'],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ['tag', 'operator', 'number'],
      style: {
        color: colors.validation.sky,
      },
    },
    {
      types: ['property', 'function'],
      style: {
        color: colors.misc.black,
      },
    },
    {
      types: ['tag-id', 'selector', 'atrule-id'],
      style: {
        color: colors.brand.blue,
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: colors.validation.mint,
      },
    },
    {
      types: [
        'boolean',
        'string',
        'entity',
        'url',
        'attr-value',
        'keyword',
        'control',
        'directive',
        'unit',
        'statement',
        'regex',
        'at-rule',
        'placeholder',
        'variable',
      ],
      style: {
        color: colors.validation.sky,
      },
    },
    {
      types: ['deleted'],
      style: {
        textDecorationLine: 'line-through',
      },
    },
    {
      types: ['inserted'],
      style: {
        textDecorationLine: 'underline',
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold',
      },
    },
    {
      types: ['script'],
      style: {
        color: colors.validation.lava,
      },
    },
    {
      types: ['important'],
      style: {
        color: colors.validation.lava,
      },
    },
  ],
};

export default theme;
