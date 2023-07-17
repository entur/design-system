import React from 'react';
import { SettingsIcon, ViewIcon } from '@entur/icons';
import { Paragraph } from '@entur/typography';
import { PrimaryButton, FloatingButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import {
  useSettings,
  UserType,
  VariableFormat,
  PackageManager,
} from './SettingsContext';
import { Modal } from '@entur/modal';
import './SettingsPanel.scss';
import { Switch } from '@entur/form';

const SettingsPanel: React.FC = () => {
  const [isOpen, setOpen] = React.useState(false);
  const {
    variableFormat,
    setVariableFormat,
    userType,
    setUserType,
    packageManager,
    setPackageManager,
    theme,
    setTheme,
  } = useSettings();

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
        {false && (
          <Switch
            checked={theme === 'dark'}
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          ></Switch>
        )}
      </div>
      <Modal
        open={isOpen}
        onDismiss={() => setOpen(false)}
        title="Innstillinger"
        size="small"
        className="settings-panel__modal"
      >
        <form onSubmit={() => setOpen(false)}>
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
            style={{ marginBottom: '1rem', marginTop: '0.5rem;' }}
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
            className="eds-dropdown"
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
          <PrimaryButton width="fluid" style={{ marginTop: '1rem' }}>
            Lagre
          </PrimaryButton>
        </form>
      </Modal>
    </>
  );
};

export default SettingsPanel;
