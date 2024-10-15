import React from 'react';
import { Drawer } from '@entur/modal';
import { ColorDrawer } from '~/components/Colors';

type ColorObject = {
  name: string;
  rgb: string;
  variable: string;
  hex: string;
  cmyk?: string;
  children?: React.ReactNode;
};

const ColorsContext = React.createContext<{
  setChosenColor?: React.Dispatch<React.SetStateAction<ColorObject>>;
}>({});

export const useColorContext: () => {
  setChosenColor?:
    | React.Dispatch<React.SetStateAction<ColorObject>>
    | undefined;
} = () => React.useContext(ColorsContext);

export const ColorsProvider: React.FC = ({ children }) => {
  const [chosenColor, setChosenColor] = React.useState<ColorObject>({
    name: '',
    rgb: '',
    variable: '',
    hex: '',
    children: undefined,
  });
  const colorValue = React.useMemo(
    () => ({
      chosenColor,
      setChosenColor,
    }),
    [chosenColor, setChosenColor],
  );
  return (
    <ColorsContext.Provider value={colorValue}>
      <Drawer
        title={chosenColor.name}
        open={chosenColor.name !== ''}
        overlay
        onDismiss={() =>
          setChosenColor({
            name: '',
            rgb: '',
            variable: '',
            hex: '',
            cmyk: '',
            children: undefined,
          })
        }
      >
        <ColorDrawer
          color={chosenColor}
          description={chosenColor?.children}
        ></ColorDrawer>
      </Drawer>
      {children}
    </ColorsContext.Provider>
  );
};
