import React, { useMemo } from 'react';
import classNames from 'classnames';

import { SegmentedChoice, SegmentedControl, Switch } from '@entur/form';
import { base } from '@entur/tokens';

import {
  IllustrationListItem,
  useGetIllustrations,
} from './useGetIllustrations';

import { ImageDisplay } from '@components/Media/ImageDisplay';

import './IllustrationList.scss';

type ColorModeType = 'standard' | 'darkmode' | 'contrast';

const IllustrationList = ({
  categoryFilter,
  excludeListFile,
  includeListFile,
  showIllustrationName = false,
  disableBackgroundSwitch = false,
  disableColorModeSelector = false,
  squareIllustrations = true,
  backgroundSwitchLabel = 'Med bakgrunn',
}: {
  categoryFilter: string;
  excludeListFile?: string[];
  includeListFile?: string[];
  showIllustrationName?: boolean;
  disableBackgroundSwitch: boolean;
  disableColorModeSelector: boolean;
  squareIllustrations: boolean;
  backgroundSwitchLabel: string;
}) => {
  const [colorMode, setColorMode] = React.useState<ColorModeType>('standard');
  const [hasBackground, setHasbackground] = React.useState(false);

  const allIllustrations = useGetIllustrations();

  const filteredIllustrations = useMemo(
    () =>
      filterIllustrations({
        illustrations: allIllustrations,
        categoryFilter,
        includeListFile,
        excludeListFile,
        colorMode,
        hasBackground,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorMode, hasBackground],
  );

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
            <SegmentedChoice value="darkmode">Mørk</SegmentedChoice>
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
            className={classNames(
              'illustration-list__display-grid__image-box',
              { 'eds-contrast': colorMode === 'contrast' },
            )}
            data-color-mode={colorMode === 'darkmode' ? 'dark' : undefined}
            style={{
              border:
                colorMode === 'standard'
                  ? `solid 2px ${base.light.baseColors.stroke.subduedalt}`
                  : '',
            }}
            key={illustration.name + illustration.extension}
          >
            {showIllustrationName && (
              <div className="eds-label illustration-list__display-grid__image-box__label">
                {illustration.sanitizedName}
              </div>
            )}
            <ImageDisplay
              imgSource={illustration.imgSource}
              name={illustration.name}
              downloadSources={illustration.publicUrls}
              className="illustration-list__display-grid__image-box__image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IllustrationList;

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
