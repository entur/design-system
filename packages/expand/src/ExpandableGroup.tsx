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
  const context = React.useContext(ExpandableGroupContext);
  if (!context) {
    return null;
  }
  const [openId, setOpenId] = context;
  const isOpen = openId === id;
  React.useEffect(() => {
    if (defaultOpen) {
      setOpenId(id);
    }
  }, [defaultOpen, id, setOpenId]);
  return {
    isOpen,
    toggle: () => setOpenId(isOpen ? null : id),
  };
};
