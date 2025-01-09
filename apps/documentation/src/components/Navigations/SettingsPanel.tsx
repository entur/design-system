import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import {
  CheckFilledIcon,
  EditIcon,
  NightIcon,
  SettingsIcon,
  SunIcon,
} from '@entur/icons';
import { Label, Link, Paragraph, SmallText } from '@entur/typography';
import {
  PrimaryButton,
  ButtonGroup,
  SecondaryButton,
  IconButton,
} from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { ExpandableText } from '@entur/expand';
import { SegmentedChoice, SegmentedControl, TextField } from '@entur/form';
import { Modal } from '@entur/modal';
import { Tag } from '@entur/layout';
import { Tooltip } from '@entur/tooltip';

import {
  useSettings,
  UserType,
  VariableFormat,
  PackageManager,
  usePersistedState,
} from '@providers/SettingsContext';
import { useAnalytics } from '@providers/AnalyticsProvider';
import { ConsentValue } from '@providers/ConsentProvider';

import './SettingsPanel.scss';

const SettingsPanel = () => {
  const [isOpen, setOpen] = React.useState(false);
  const [showBetaSettings, setShowBetaSettings] = React.useState(false);
  const {
    variableFormat,
    setVariableFormat,
    userType,
    setUserType,
    packageManager,
    setPackageManager,
    colorMode,
    setColorMode,
  } = useSettings();
  const { posthog } = useAnalytics();
  const [hasSeenAnalytics, setHasSeenAnalytics] = usePersistedState<boolean>(
    'hide_analytics_tooltip',
    false,
  );

  useEffect(() => {
    document.addEventListener('keydown', e => {
      if (e.key === '/') {
        setShowBetaSettings(prev => !prev);
      }
    });
    return () => {
      document.removeEventListener('keydown', e => {
        if (e.key === '/') {
          setShowBetaSettings(prev => !prev);
        }
      });
    };
  }, []);

  const handleDismissAnalyticsTooltip = () => {
    if (!hasSeenAnalytics) {
      setHasSeenAnalytics(true);
      posthog.capture('Dismissed analytics tooltip', {
        setting_modal_was_open: isOpen,
      });
    }
  };

  const showAnalyticsTooltip = React.useMemo(() => {
    return !hasSeenAnalytics;
  }, [hasSeenAnalytics]);

  return (
    <>
      <div className="settings-panel">
        <Tooltip
          placement={'bottom'}
          content={'Hjelp oss å gjøre designsystemet bedre!'}
          isOpen={showAnalyticsTooltip}
          onClickCloseButton={handleDismissAnalyticsTooltip}
          className="settings-panel__tooltip"
        >
          <IconButton
            aria-label={isOpen ? 'Lukk innstillinger' : 'Vis innstillinger'}
            className="settings-trigger"
            onClick={() => setOpen(prev => !prev)}
          >
            <SettingsIcon
              className="settings-trigger__icon"
              aria-hidden="true"
            />{' '}
            Innstilinger
          </IconButton>
        </Tooltip>
      </div>
      <Modal
        open={isOpen}
        onDismiss={() => {
          handleDismissAnalyticsTooltip();
          setOpen(false);
        }}
        title="Innstillinger"
        size="small"
        className="settings-panel__modal"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            handleDismissAnalyticsTooltip();
            setOpen(false);
          }}
        >
          <SegmentedControl
            label="Fargemodus"
            onChange={selectedValue => {
              switch (selectedValue) {
                case 'light':
                case 'dark':
                case 'system':
                  setColorMode(selectedValue);
                  break;
                default:
                  setColorMode('light');
              }
            }}
            selectedValue={colorMode ?? 'light'}
            style={{ marginBottom: '1rem' }}
          >
            <SegmentedChoice value="light">
              Lys <SunIcon inline />
            </SegmentedChoice>
            <SegmentedChoice value="dark">
              Mørk <NightIcon inline />
            </SegmentedChoice>
            <SegmentedChoice value="system">System</SegmentedChoice>
          </SegmentedControl>
          <Dropdown
            label="Hva slags bruker er du?"
            items={[
              { value: 'developer', label: 'Utvikler' },
              { value: 'designer', label: 'Designer' },
            ]}
            selectedItem={{
              label: userType === 'developer' ? 'Utvikler' : 'Designer',
              value: userType,
            }}
            onChange={selectedItem =>
              setUserType((selectedItem?.value as UserType) ?? 'developer')
            }
            style={{ marginBottom: '1rem', marginTop: '0.5rem' }}
          />
          {userType === 'developer' && (
            <Dropdown
              label="Hvilket pakkehåndteringsverktøy bruker du?"
              items={['yarn', 'npm']}
              selectedItem={{ label: packageManager, value: packageManager }}
              onChange={selectedItem =>
                setPackageManager(
                  selectedItem
                    ? (selectedItem.value as PackageManager)
                    : 'yarn',
                )
              }
              style={{ marginBottom: '1rem' }}
            />
          )}
          <Dropdown
            label="Hva slags variabler vil du se?"
            items={[
              { value: 'css', label: 'CSS' },
              { value: 'scss', label: 'SCSS' },
              { value: 'less', label: 'LESS' },
              { value: 'js', label: 'JavaScript' },
            ]}
            selectedItem={{ label: variableFormat, value: variableFormat }}
            onChange={selectedItem =>
              setVariableFormat((selectedItem?.value as VariableFormat) ?? 'js')
            }
          />

          <AnalyticsSection
            showBetaSettings={showBetaSettings}
            hasSeenAnalytics={hasSeenAnalytics}
            handleDismissAnalyticsTooltip={handleDismissAnalyticsTooltip}
          />
          <PrimaryButton
            className="settings-panel__modal__save-button"
            width="fluid"
          >
            Lagre
          </PrimaryButton>
        </form>
      </Modal>
    </>
  );
};

export default SettingsPanel;

const AnalyticsSection = ({
  showBetaSettings,
  hasSeenAnalytics,
  handleDismissAnalyticsTooltip,
}: {
  showBetaSettings: boolean;
  hasSeenAnalytics: boolean;
  handleDismissAnalyticsTooltip: () => void;
}) => {
  const {
    analyticsConsent,
    updateAnalyticsConsent,
    posthog,
    setUniqueIdLocalStorage,
  } = useAnalytics();
  const [isEditingUserID, setIsEditingUserID] = useState(false);
  const [isEditingConsent, setIsEditingConsent] = useState(false);
  const [userIDFieldValue, setUserIDFieldValue] = useState(
    posthog?.get_property('$user_id'),
  );

  const handleUpdateConsent = (updatedConsent: ConsentValue) => {
    updateAnalyticsConsent(updatedConsent);
    setIsEditingConsent(false);
    setUserIDFieldValue(posthog?.get_property('$user_id'));

    handleDismissAnalyticsTooltip();
  };
  const notDecided =
    analyticsConsent === 'undecided' ||
    analyticsConsent === undefined ||
    isEditingConsent;

  const getDisplayNameForConsentValue = (consentValue: ConsentValue) => {
    switch (consentValue) {
      case 'accepted':
        return 'Godta';
      case 'denied':
        return 'Avslå';
      case 'undecided':
      default:
        return 'Ikke valgt';
    }
  };
  return (
    <>
      <ExpandableText
        // @ts-expect-error does work
        titleElement="Heading3"
        title="Analyseverktøy"
        defaultOpen={notDecided}
        className={classNames('settings-panel__modal__analytics', {
          'settings-panel__modal__analytics--pulse': !hasSeenAnalytics,
        })}
      >
        <SmallText>
          Hjelp oss å forstå hvordan du bruker designsystemet. Informasjon om
          hvilke sider du bruker og hvordan du bruker dem over tid gjør det
          lettere å ta gode valg når vi forbedrer siden. Vi bruker Posthog når
          vi analyserer denne dataen, les mer på{' '}
          <Link href="https://posthog.com/docs/privacy">
            Posthog sine sider.
          </Link>
        </SmallText>
        <br />
        <Label className="settings-panel__modal__analytics__choice-status-label">
          Kan vi spore bruken din på dette nettstedet?
        </Label>
        {notDecided ? (
          <ButtonGroup className="settings-panel__modal__analytics__choice">
            <PrimaryButton
              size="small"
              onClick={() => handleUpdateConsent('accepted')}
            >
              {getDisplayNameForConsentValue('accepted')}
            </PrimaryButton>
            <SecondaryButton
              size="small"
              onClick={() => handleUpdateConsent('denied')}
            >
              {getDisplayNameForConsentValue('denied')}
            </SecondaryButton>
          </ButtonGroup>
        ) : (
          <div className="settings-panel__modal__analytics__status">
            <div className="settings-panel__modal__analytics__status__tag">
              <Paragraph>Nåværende status: </Paragraph>
              <Tag>{getDisplayNameForConsentValue(analyticsConsent)}</Tag>
            </div>
            <SecondaryButton
              size="small"
              onClick={() => setIsEditingConsent(true)}
              className="settings-panel__modal__analytics__status__edit-consent"
            >
              Endre samtykke
            </SecondaryButton>
          </div>
        )}
        {(analyticsConsent === 'accepted' || showBetaSettings) && (
          <div className="settings-panel__modal__analytics__id">
            <TextField
              label="Din enhets-id"
              value={userIDFieldValue}
              onChange={e => setUserIDFieldValue(e.target.value)}
              readOnly={!isEditingUserID}
              style={{ flex: 1 }}
            />
            {showBetaSettings && (
              <IconButton
                type="button"
                onClick={() => {
                  if (isEditingUserID) {
                    if (posthog.get_property('$user_id') !== userIDFieldValue) {
                      posthog.identify(userIDFieldValue);
                      setUniqueIdLocalStorage(userIDFieldValue);
                    }
                    setIsEditingUserID(false);
                  } else {
                    setIsEditingUserID(true);
                  }
                }}
              >
                {isEditingUserID ? <CheckFilledIcon /> : <EditIcon />}
              </IconButton>
            )}
          </div>
        )}
      </ExpandableText>
    </>
  );
};
