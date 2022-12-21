import { PrismTheme } from 'prism-react-renderer';
import { colors } from '@entur/tokens';

const theme: PrismTheme = {
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
