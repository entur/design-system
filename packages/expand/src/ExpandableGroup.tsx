import React from 'react';
type Id = string | null;
type ExpandableGroupContextType = [
  Id,
  React.Dispatch<React.SetStateAction<Id>>,
];
const ExpandableGroupContext = React.createContext<ExpandableGroupContextType | null>(
  null,
);

type Props = {
  /** To eller flere ExpandablePanel-komponenter */
  children: React.ReactNode;
  [key: string]: any;
};

export const ExpandableGroup: React.FC<Props> = ({ ...rest }) => {
  const currentlyOpenState = React.useState<Id>(null);
  return (
    <ExpandableGroupContext.Provider value={currentlyOpenState} {...rest} />
  );
};

type UseExpandableGroupArgs = {
  id: Id;
  defaultOpen?: boolean;
};

export const useExpandableGroup = ({
  id,
  defaultOpen,
}: UseExpandableGroupArgs) => {
  const contextValue = React.useContext(ExpandableGroupContext);
  const isInsideExpandableGroup = !!contextValue;
  const [openId, setOpenId] = contextValue || [-1, () => {}];

  React.useEffect(() => {
    if (defaultOpen && isInsideExpandableGroup) {
      setOpenId(id);
    }
  }, [defaultOpen, id, setOpenId, isInsideExpandableGroup]);

  if (!isInsideExpandableGroup) {
    return null;
  }

  const isOpen = openId === id;

  return {
    isOpen,
    toggle: () => setOpenId(isOpen ? null : id),
  };
};
