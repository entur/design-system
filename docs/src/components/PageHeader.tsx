import React from 'react';
import { useCurrentDoc } from 'docz';
import { Heading1, Label, LeadParagraph } from '@entur/typography';

type Props = {
  title?: string;
  category?: string;
};

const PageHeader: React.FC<Props> = ({ title, children, category }) => {
  const currentDoc = useCurrentDoc();
  const categoryToShow = category || currentDoc.parent;
  const titleToShow = title || currentDoc.name;
  return (
    <header>
      {categoryToShow && <Label as="div">{categoryToShow.toUpperCase()}</Label>}
      <Heading1 style={{ marginTop: '0.3em' }}>{titleToShow}</Heading1>
      {children && <LeadParagraph>{children}</LeadParagraph>}
    </header>
  );
};

export default PageHeader;
