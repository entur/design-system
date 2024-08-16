import React from 'react';
import classNames from 'classnames';

import { SegmentedChoice, SegmentedControl, Switch } from '@entur/form';
import { base } from '@entur/tokens';

import {
  IllustrationsQueryType,
  useGetIllustrations,
} from '../gatsby-theme-docz/components/useGetIllustrations';

import { ImageDisplay } from './ImageDisplay';

import './IllustrationList.scss';

type IllustrationListItem = {
  categories: string[];
  name: string;
  uniqueName: string;
  fluidSource: any;
  publicUrl: string;
  publicUrls: Array<{ src: string; format: string }>;
  publicUrlPNG?: string;
  publicUrlSVG?: string;
  isContrast: boolean;
  isDarkmode: boolean;
  hasBackground: boolean;
  extension: string;
};

type ColorModeType = 'standard' | 'darkmode' | 'contrast';

const ACCEPTED_EXTENSIONS = ['png', 'svg', 'pdf'];

const IllustrationList = ({
  categoryFilter,
  excludeListFile,
  includeListFile,
  disableBackgroundSwitch = false,
  disableColorModeSelector = false,
  squareIllustrations = true,
  backgroundSwitchLabel = 'Med bakgrunn',
}: {
  categoryFilter: string;
  excludeListFile?: string[];
  includeListFile?: string[];
  disableBackgroundSwitch: boolean;
  disableColorModeSelector: boolean;
  squareIllustrations: boolean;
  backgroundSwitchLabel: string;
}) => {
  const [colorMode, setColorMode] = React.useState<ColorModeType>('standard');
  const [hasBackground, setHasbackground] = React.useState(false);

  const illustrationsQuery = useGetIllustrations();

  const allIllustrations = React.useMemo(
    () => processIllustrationsQuery(illustrationsQuery),
    [],
  );

  const filteredIllustrations = filterIllustrations({
    illustrations: allIllustrations,
    categoryFilter,
    includeListFile,
    excludeListFile,
    colorMode,
    hasBackground,
  });

  return (
    <div className="illustration-list">
      <div className="illustration-list__filter">
        {!disableColorModeSelector && (
          <SegmentedControl
            label="Fargemodus"
            onChange={selectedValue =>
              setColorMode(selectedValue as ColorModeType)
            }
            selectedValue={colorMode}
            className="illustration-list__color-mode-selector"
          >
            <SegmentedChoice value="standard">Standard</SegmentedChoice>
            <SegmentedChoice value="darkmode">Nattmodus</SegmentedChoice>
            <SegmentedChoice value="contrast">Kontrast</SegmentedChoice>
          </SegmentedControl>
        )}
        {!disableBackgroundSwitch && (
          <Switch
            checked={hasBackground}
            onChange={() => setHasbackground(!hasBackground)}
          >
            {backgroundSwitchLabel}
          </Switch>
        )}
      </div>
      <div
        className={classNames('illustration-list__display-grid', {
          'illustration-list__display-grid--square': squareIllustrations,
        })}
      >
        {filteredIllustrations.map(illustration => (
          <div
            className="illustration-list__display-grid__image-box"
            style={{
              backgroundColor:
                colorMode === 'contrast'
                  ? base.light.baseColors.frame.contrast
                  : colorMode === 'darkmode'
                  ? base.dark.baseColors.frame.default
                  : base.light.baseColors.frame.default,
              border:
                colorMode === 'standard'
                  ? `solid 2px ${base.light.baseColors.stroke.subduedalt}`
                  : '',
            }}
            key={illustration.name + illustration.extension}
          >
            <ImageDisplay
              fluidSource={illustration.fluidSource}
              name={illustration.name}
              downloadSources={illustration.publicUrls}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IllustrationList;

const processIllustrationsQuery = (
  illustrationsQuery: IllustrationsQueryType[],
) =>
  illustrationsQuery
    .filter(illustration =>
      ACCEPTED_EXTENSIONS.includes(illustration.extension.toLowerCase()),
    )
    // Process raw GraphQL-data into info about illustration
    .map(illustration => {
      const illustrationName = illustration.name.replace(/-|_/g, ' ');
      const categories = illustration.absolutePath
        .split('/downloads/illustrations/')?.[1]
        ?.split('/')
        .filter(
          category =>
            // exclude file extension and file name as categories
            !ACCEPTED_EXTENSIONS.includes(category.toLowerCase()) &&
            !category.includes('.'),
        )
        .map(category => category.toLowerCase());
      const publicUrl = illustration.publicURL;
      const fluidSource = illustration.childImageSharp?.fluid;
      const isContrast = illustrationName.toLowerCase().includes('contrast');
      const isDarkmode = illustrationName
        .toLowerCase()
        .replace(/\s+|-|_/g, '')
        .includes('darkmode');
      const hasBackground =
        illustrationName.toLowerCase().includes('circle') ||
        illustrationName.toLowerCase().includes('frame') ||
        illustrationName.toLowerCase().includes('background');

      return {
        name: illustrationName,
        uniqueName: categories?.join('-') + illustrationName,
        categories,
        extension: illustration.extension,
        publicUrl,
        publicUrls: [],
        fluidSource,
        isContrast,
        isDarkmode,
        hasBackground,
      } as IllustrationListItem;
    })
    // Merge svg and png version of the same illustration
    .reduce((mergedIllustrationsList, illustration) => {
      const matchedIllustration = mergedIllustrationsList.find(
        illustrationInList =>
          illustration.uniqueName === illustrationInList.uniqueName,
      );

      const publicUrl = {
        src: illustration.publicUrl,
        format: illustration.extension,
      };
      if (matchedIllustration) {
        matchedIllustration.publicUrls.push(publicUrl);
        if (matchedIllustration.fluidSource === undefined)
          matchedIllustration.fluidSource = illustration.fluidSource;
      } else {
        illustration.publicUrls.push(publicUrl);
        mergedIllustrationsList.push(illustration);
      }

      return mergedIllustrationsList;
    }, [] as IllustrationListItem[]);

const filterIllustrations = ({
  illustrations,
  categoryFilter,
  includeListFile,
  excludeListFile,
  colorMode,
  hasBackground,
}: {
  illustrations: IllustrationListItem[];
  categoryFilter: string;
  includeListFile?: string[];
  excludeListFile?: string[];
  colorMode: ColorModeType;
  hasBackground: boolean;
}) =>
  illustrations // Only include illustrations with categoryFilter in category
    .filter(illustration =>
      categoryFilter !== undefined
        ? illustration.categories.includes(categoryFilter.toLowerCase())
        : true,
    )
    // Either only include files in includeList or exclude those in excludeList
    .filter(illustration => {
      if (includeListFile !== undefined) {
        return includeListFile.find(allowedName =>
          illustration.name.toLowerCase().includes(allowedName.toLowerCase()),
        );
      }
      if (excludeListFile !== undefined) {
        return !excludeListFile.find(notAllowedName =>
          illustration.name
            .toLowerCase()
            .includes(notAllowedName.toLowerCase()),
        );
      }
      return true;
    })
    // Only include illustrations with correct color mode
    .filter(illustration => {
      switch (colorMode) {
        case 'darkmode':
          return illustration.isDarkmode && !illustration.isContrast;
        case 'contrast':
          return illustration.isContrast;
        case 'standard':
          return !(illustration.isDarkmode || illustration.isContrast);
        default:
          return true;
      }
    })
    // Only include illustrations with correct background
    .filter(illustration => illustration.hasBackground === hasBackground)
    .sort((illustrationA, illustrationB) =>
      illustrationA.name < illustrationB.name ? -1 : 1,
    );
