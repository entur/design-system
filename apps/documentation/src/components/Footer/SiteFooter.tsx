import { Link as LinkText } from '@entur/typography/beta';

import React from 'react';
import './SiteFooter.scss';

const SiteFooter: React.FC = () => {
  return (
    <>
      <footer className="site-footer">
        <div>
          Kontakt oss på{' '}
          <LinkText href="https://entur.slack.com/messages/C899QSPB7">
            #talk-designsystem
          </LinkText>{' '}
          i Slack, eller send oss en{' '}
          <LinkText href="mailto:teamdesignsystem@entur.org">e-post</LinkText>.
        </div>
      </footer>
    </>
  );
};

export default SiteFooter;
