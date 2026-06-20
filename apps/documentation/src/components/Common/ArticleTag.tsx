import React from 'react';
import { Tag } from '@entur/layout';
import { isBetaTag } from 'src/utils/utils';

export function ArticleTag({ tag }: { tag: string }) {
  return <Tag variant={isBetaTag(tag) ? 'warning' : 'success'}>{tag}</Tag>;
}
