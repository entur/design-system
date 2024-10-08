import React, { useEffect, useState } from 'react';
import {
  CheckFilledIcon,
  EditIcon,
  NightIcon,
  SettingsIcon,
  SunIcon,
  ViewIcon,
} from '@entur/icons';
import { Label, Paragraph, SmallText } from '@entur/typography';
import {
  PrimaryButton,
  FloatingButton,
  ButtonGroup,
  SecondaryButton,
  IconButton,
} from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { SegmentedChoice, SegmentedControl, TextField } from '@entur/form';
import { Modal } from '@entur/modal';
import {
  useSettings,
  UserType,
  VariableFormat,
  PackageManager,
} from '~/utils/Providers/SettingsContext';
import './SettingsPanel.scss';
import {
  ConsentValue,
  useAnalytics,
} from '~/utils/Providers/AnalyticsProvider';
import { ExpandableText } from '@entur/expand';
import { Tag } from '@entur/layout';

const SettingsPanel: React.FC = () => {
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

  return (
    <>
      <div className="settings-panel">
        <div className="settings-panel__container">
          <ViewIcon aria-hidden="true" className="settings-panel__icon" />
          <Paragraph margin="none">
            Vis som: {userType === 'developer' ? 'Utvikler' : 'Designer'}
          </Paragraph>
        </div>
        <FloatingButton
          aria-label={isOpen ? 'Lukk innstillinger' : 'Vis innstillinger'}
          className="settings-trigger"
          onClick={() => setOpen(prev => !prev)}
        >
          <SettingsIcon aria-hidden="true" />
        </FloatingButton>
      </div>
      <Modal
        open={isOpen}
        onDismiss={() => setOpen(false)}
        title="Innstillinger"
        size="small"
        className="settings-panel__modal"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          <SegmentedControl
            label="Fargemodus"
            onChange={selectedValue => setColorMode(selectedValue ?? 'light')}
            selectedValue={colorMode ?? 'light'}
            style={{ marginBottom: '1rem' }}
          >
            <SegmentedChoice value="light">
              Lys <SunIcon inline />
            </SegmentedChoice>
            <SegmentedChoice value="dark">
              Mørk <NightIcon inline />
            </SegmentedChoice>
            {/* <SegmentedChoice value="system">System</SegmentedChoice> */}
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
          <AnalyticsSection showBetaSettings={showBetaSettings} />
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
}: {
  showBetaSettings: boolean;
}) => {
  const { analyticsConsent, updateAnalyticsConsent, posthog } = useAnalytics();
  const [isEditingUserID, setIsEditingUserID] = useState(false);
  const [isEditingConsent, setIsEditingConsent] = useState(false);
  const [userIDFieldValue, setUserIDFieldValue] = useState(
    posthog?.get_property('$user_id'),
  );

  const handleUpdateConsent = (updatedConsent: ConsentValue) => {
    updateAnalyticsConsent(updatedConsent);
    setIsEditingConsent(false);
    setUserIDFieldValue(posthog?.get_property('$user_id'));
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
        titleElement="Heading3"
        title="Analyseverktøy"
        defaultOpen={notDecided}
        className="settings-panel__modal__analytics"
      >
        <SmallText>
          Hjelp oss å forstå hvordan du bruker designsystemet. Informasjon om
          hvilke sider du bruker og hvordan du bruker dem over tid gjør det
          lettere å ta gode valg når vi forbedrer siden. Vi bruker Posthog når
          vi analyserer denne dataen, les mer på{' '}
          <a href="https://posthog.com/docs/privacy">Posthog sine sider.</a>
        </SmallText>
        <br />
        <Label className="settings-panel__modal__analytics__choice-status-label">
          Kan vi spore bruken din på denne nettsiden?
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
                    if (posthog.get_property('$user_id') !== userIDFieldValue)
                      posthog.identify(userIDFieldValue);
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
