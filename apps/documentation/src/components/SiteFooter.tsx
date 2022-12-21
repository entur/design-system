import { EditIcon } from '@entur/icons';
import { Link } from '@entur/typography';
import { useCurrentDoc } from 'docz';
import React from 'react';
import Divider from '~/components/Divider';
import './SiteFooter.scss';

const SiteFooter: React.FC = () => {
  const {
    filepath,
    //name
  } = useCurrentDoc();
  // WIP
  // const entries = useMenus();
  // const currentIndex = entries?.findIndex(entry => entry.name == name);
  // const nextPage = findNextPage(entries, useCurrentDoc());
  // console.log(nextPage);

  return (
    <>
      <div style={{ margin: '4rem 0 0' }}>
        <EditIcon inline={true} />{' '}
        <Link
          href={`https://bitbucket.org/enturas/design-system/src/master/${filepath.substring(
            8,
          )}?mode=edit&spa=0&at=master&fileviewer=file-view-default`}
        >
          Rediger denne siden på Bitbucket
        </Link>
      </div>
      <Divider />
      <footer className="site-footer">
        <div>
          Kontakt oss på{' '}
          <Link href="https://entur.slack.com/messages/C899QSPB7">
            #talk-designsystem
          </Link>{' '}
          i Slack, eller send oss en{' '}
          <Link href="mailto:magnus.rand@entur.org">mail</Link>.{' '}
        </div>
      </footer>
    </>
  );
};

// function findNextPage(entries, current) {
//   const { order, index, menu, parent, name } = current;
//   // console.log(name, menu, parent);

//   const currentMenuPages = entries.filter(entry => {
//     return entry.menu?.find(e => {
//       return e.parent === parent;
//     });
//   });
//   // console.log(currentMenuPages);

//   if (index) {
//     return currentMenuPages[0].menu.filter(
//       page => page.order === 1 && page.parent === parent,
//     );
//   }

//   return currentMenuPages
//     .filter(collection => {
//       return collection.name === menu;
//     })[0]
//     .menu?.filter(page => {
//       // console.log(page.order, order, page.parent, parent);

//       return page.order === order + 1 && page.parent === parent;
//     });
// }

export default SiteFooter;
