import React, { useEffect } from 'react';

import { CookieIcon, NightIcon, SettingsIcon, SunIcon } from '@entur/icons';
import { Heading5 } from '@entur/typography';
import { PrimaryButton, SecondaryButton, IconButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { SegmentedChoice, SegmentedControl, TextField } from '@entur/form';
import { Modal } from '@entur/modal';

import {
  useSettings,
  UserType,
  VariableFormat,
  PackageManager,
  usePersistedState,
} from '@providers/SettingsContext';

import './SettingsPanel.scss';
import { CopyableText } from '@entur/alert';
import { getCMP } from 'src/utils/cmpUtils';

const SettingsPanel = () => {
  const [isOpen, setOpen] = React.useState(false);
  const [trackingID, setTrackingID] = React.useState<string | undefined>(
    undefined,
  );
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
    async function fetchControllerID() {
      const cmp = await getCMP();
      const controllerID = await cmp?.getControllerId();
      setTrackingID(controllerID);
    }
    fetchControllerID();
  }, []);

  return (
    <>
      <div className="settings-panel">
        <IconButton
          aria-label={isOpen ? 'Lukk innstillinger' : 'Vis innstillinger'}
          className="settings-trigger"
          onClick={() => setOpen(prev => !prev)}
        >
          <SettingsIcon className="settings-trigger__icon" aria-hidden="true" />
          <span className="settings-trigger__button-text">Innstillinger</span>
        </IconButton>
      </div>
      <Modal
        open={isOpen}
        onDismiss={() => {
          setOpen(false);
        }}
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

          <PrimaryButton
            className="settings-panel__modal__save-button"
            width="fluid"
          >
            Lagre
          </PrimaryButton>
        </form>
        <Heading5 as="h3">Informasjonskapsler</Heading5>
        <SecondaryButton
          size="small"
          style={{ marginTop: '0.5rem' }}
          onClick={() => window.__ucCmp.showFirstLayer()}
        >
          <CookieIcon />
          Endre informasjonskapser
        </SecondaryButton>
        <CopyableText
          textToCopy={trackingID || 'Ikke tilgjengelig'}
          successMessage={`Din sporings-ID «${trackingID}» ble kopiert til utklippstavlen.`}
        >
          Hent sporings-ID
        </CopyableText>
      </Modal>
    </>
  );
};

export default SettingsPanel;
