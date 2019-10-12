import React from 'react';
import { CollapsedIcon, SettingsIcon } from '@entur/icons';
import { Heading2 } from '@entur/typography';
import { FormGroup } from '@entur/form';
import { useSettings, UserType, VariableFormat } from './SettingsContext';
import './SettingsPanel.scss';
import { Contrast } from '@entur/layout';

const SettingsPanel: React.FC = props => {
  const [isOpen, setOpen] = React.useState(false);
  const {
    variableFormat,
    setVariableFormat,
    userType,
    setUserType,
  } = useSettings();

  return (
    <section className="settings-panel">
      <Contrast>
        <button
          aria-label={isOpen ? 'Lukk innstillinger' : 'Vis innstillinger'}
          className="settings-panel__trigger"
          onClick={() => setOpen(prev => !prev)}
          type="button"
        >
          {isOpen ? <CollapsedIcon /> : <SettingsIcon />}
        </button>
        {isOpen && (
          <>
            <Heading2>Innstillinger</Heading2>
            <FormGroup label="Hva slags bruker er du?">
              <select
                className="entur-dropdown"
                onChange={e => setUserType(e.target.value as UserType)}
                value={userType}
              >
                <option value="developer">Utvikler 👩‍💻</option>
                <option value="designer">Designer ‍👨‍🎨</option>
              </select>
            </FormGroup>
            <FormGroup label="Hva slags variabler vil du se?">
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
            </FormGroup>
          </>
        )}
      </Contrast>
    </section>
  );
};

export default SettingsPanel;
