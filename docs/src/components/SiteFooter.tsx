import React from 'react';
import { useCurrentDoc } from 'docz';
import Divider from 'src/components/Divider';
import { Link } from '@entur/typography';
import { EditIcon } from '@entur/icons';
import './SiteFooter.scss';

const SiteFooter: React.FC = () => {
  const { filepath } = useCurrentDoc();
  return (
    <>
      <Divider />
      <footer className="site-footer">
        <div>
          Kontakt oss på{' '}
          <Link href="https://entur.slack.com/messages/C899QSPB7">
            #talk-designsystem
          </Link>{' '}
          i Slack, eller send oss en{' '}
          <Link href="mailto:nicolai.fredriksen@entur.org">mail</Link>.{' '}
        </div>
        <div>
          <EditIcon />{' '}
          <Link
            href={`https://bitbucket.org/enturas/design-system/src/master/docs/${filepath}?mode=edit&spa=0&at=master&fileviewer=file-view-default`}
          >
            Endre siden
          </Link>
        </div>
      </footer>
    </>
  );
};

export default SiteFooter;
