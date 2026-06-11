import { Badge } from '@entur/layout';
import { isBetaTag } from 'src/utils/utils';

export function ArticleTag({ tag }: { tag: string }) {
  return (
    <Badge type="status" variant={isBetaTag(tag) ? 'warning' : 'success'}>
      {tag}
    </Badge>
  );
}
