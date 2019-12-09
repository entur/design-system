import React from 'react';
import { SettingsIcon } from '@entur/icons';
import { Button } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import {
  useSettings,
  UserType,
  VariableFormat,
  PackageManager,
} from './SettingsContext';
import { Modal } from '@entur/modal';
import './SettingsPanel.scss';

const SettingsPanel: React.FC = () => {
  const [isOpen, setOpen] = React.useState(false);
  const {
    variableFormat,
    setVariableFormat,
    userType,
    setUserType,
    packageManager,
    setPackageManager,
  } = useSettings();

  return (
    <>
      <button
        aria-label={isOpen ? 'Lukk innstillinger' : 'Vis innstillinger'}
        className="settings-trigger"
        onClick={() => setOpen(prev => !prev)}
        type="button"
      >
        <SettingsIcon />
      </button>
      <Modal
        open={isOpen}
        onDismiss={() => setOpen(false)}
        title="Innstillinger"
        size="small"
      >
        <form onSubmit={() => setOpen(false)}>
          <Dropdown
            label="Hva slags bruker er du?"
            onChange={selectedItem =>
              setUserType(
                selectedItem ? (selectedItem.value as UserType) : 'developer',
              )
            }
            items={[
              { value: 'developer', label: 'Utvikler' },
              { value: 'designer', label: 'Designer' },
            ]}
            value={userType}
          />
          {userType === 'developer' && (
            <Dropdown
              label="Hvilket pakkehåndteringsverktøy bruker du?"
              onChange={selectedItem =>
                setPackageManager(
                  selectedItem
                    ? (selectedItem.value as PackageManager)
                    : 'yarn',
                )
              }
              items={['yarn', 'npm']}
              value={packageManager}
            />
          )}
          <Dropdown
            className="eds-dropdown"
            items={[
              { value: 'css', label: 'CSS' },
              { value: 'scss', label: 'SCSS' },
              { value: 'less', label: 'LESS' },
              { value: 'js', label: 'JavaScript' },
            ]}
            label="Hva slags variabler vil du se?"
            onChange={selectedItem =>
              setVariableFormat(
                selectedItem ? (selectedItem.value as VariableFormat) : 'js',
              )
            }
            value={variableFormat}
          />
          <Button variant="primary" width="fluid" style={{ marginTop: '1rem' }}>
            Lagre
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default SettingsPanel;
