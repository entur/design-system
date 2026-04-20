import { Link } from '@entur/typography';

import React from 'react';
import './SiteFooter.scss';

const SiteFooter: React.FC = () => {
  return (
    <>
      <footer className="site-footer">
        <div>
          Kontakt oss på{' '}
          <Link href="https://entur.slack.com/messages/C899QSPB7">
            #talk-designsystem
          </Link>{' '}
          i Slack, eller send oss en{' '}
          <Link href="mailto:teamdesignsystem@entur.org">e-post</Link>.
        </div>
      </footer>
    </>
  );
};

export default SiteFooter;
