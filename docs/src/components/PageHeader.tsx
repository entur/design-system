import React from 'react';
import { useCurrentDoc } from 'docz';
import {
  Heading1,
  Label,
  LeadParagraph,
  PreformattedText,
} from '@entur/typography';
import { useSettings } from './SettingsContext';

type Props = {
  title?: string;
  category?: string;
};

const PageHeader: React.FC<Props> = ({ title, children, category }) => {
  const currentDoc = useCurrentDoc();
  const enturPackage: string = currentDoc.enturPackage;
  const exported: string = currentDoc.exported;
  const categoryToShow = category || currentDoc.parent;
  const titleToShow = title || currentDoc.name;
  const { packageManager } = useSettings();
  const installText =
    packageManager === 'yarn'
      ? `yarn add @entur/${enturPackage}`
      : `npm install @entur/${enturPackage}`;
  return (
    <header>
      {categoryToShow && <Label as="div">{categoryToShow.toUpperCase()}</Label>}
      <Heading1 style={{ marginTop: '0.3em' }}>{titleToShow}</Heading1>
      {children && <LeadParagraph>{children}</LeadParagraph>}
      {(enturPackage || exported) && (
        <PreformattedText>
          {enturPackage && installText}
          <br />
          {exported !== undefined &&
            `import \{ ${exported} \} from @entur/${enturPackage}`}
        </PreformattedText>
      )}
    </header>
  );
};

export default PageHeader;
