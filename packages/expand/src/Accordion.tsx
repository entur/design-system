import React from 'react';

type Id = string | null;
type AccordionContextType = [Id, React.Dispatch<React.SetStateAction<Id>>];
const AccordionContext = React.createContext<AccordionContextType | null>(null);

type Props = {
  /** To eller flere ExpandablePanel-komponenter */
  children: React.ReactNode;
  [key: string]: any;
};

export const Accordion: React.FC<Props> = ({ ...rest }) => {
  const currentlyOpenState = React.useState<Id>(null);
  return <AccordionContext.Provider value={currentlyOpenState} {...rest} />;
};

type UseAccordionArgs = {
  id: Id;
  defaultOpen?: boolean;
};

export const useAccordion = ({ id, defaultOpen }: UseAccordionArgs) => {
  const contextValue = React.useContext(AccordionContext);
  const isInsideAccordion = !!contextValue;
  const [openId, setOpenId] = contextValue || [-1, () => {}];

  React.useEffect(() => {
    if (defaultOpen && isInsideAccordion) {
      setOpenId(id);
    }
  }, [defaultOpen, id, setOpenId, isInsideAccordion]);

  if (!isInsideAccordion) {
    return null;
  }

  const isOpen = openId === id;

  return {
    isOpen,
    toggle: () => setOpenId(isOpen ? null : id),
  };
};
