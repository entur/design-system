import React from 'react';
import { SettingsIcon } from '@entur/icons';
import { Button } from '@entur/button';
import { Heading4 } from '@entur/typography';
import { InputGroup } from '@entur/form';
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
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        style={{ minWidth: '22rem' }}
      >
        <form onSubmit={() => setOpen(false)}>
          <Heading4 as="h2">Innstillinger</Heading4>
          <InputGroup label="Hva slags bruker er du?">
            <select
              className="entur-dropdown"
              onChange={e => setUserType(e.target.value as UserType)}
              value={userType}
            >
              <option value="developer">Utvikler 👩‍💻</option>
              <option value="designer">Designer ‍👨‍🎨</option>
            </select>
          </InputGroup>
          {userType === 'developer' && (
            <InputGroup label="Hvilket pakkehåndteringsverktøy bruker du?">
              <select
                className="entur-dropdown"
                onChange={e =>
                  setPackageManager(e.target.value as PackageManager)
                }
                value={packageManager}
              >
                <option value="yarn">yarn ‍🧶</option>
                <option value="npm">npm ⬢</option>
              </select>
            </InputGroup>
          )}
          <InputGroup label="Hva slags variabler vil du se?">
            <select
              className="entur-dropdown"
              onChange={e =>
                setVariableFormat(e.target.value as VariableFormat)
              }
              value={variableFormat}
            >
              <option value="css">CSS</option>
              <option value="scss">SCSS</option>
              <option value="less">LESS</option>
              <option value="js">JavaScript</option>
            </select>
          </InputGroup>
          <Button variant="primary" width="fluid" style={{ marginTop: '1rem' }}>
            Lagre
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default SettingsPanel;
