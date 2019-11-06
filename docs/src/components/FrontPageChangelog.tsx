import React from 'react';
import { Label, Heading4, SubParagraph } from '@entur/typography';
import './FrontPageChangelog.scss';
type Props = {
  date: React.ReactNode;
  heading: React.ReactNode;
  children: React.ReactNode;
};

const FrontPageChangelog: React.FC<Props> = ({ date, heading, children }) => {
  return (
    <div className="front-page-changelog">
      <Label as="span" className="front-page--date">
        {date}
      </Label>
      <Heading4 as="span" className="front-page--heading">
        {heading}
      </Heading4>
      <SubParagraph className="front-page--text">{children}</SubParagraph>
    </div>
  );
};
export default FrontPageChangelog;
