import React from 'react';

type Id = string | null;
type AccordionContextType = [Id, React.Dispatch<React.SetStateAction<Id>>];
const AccordionContext = React.createContext<AccordionContextType | null>(null);

export type AccordionProps = {
  /** To eller flere AccordionItem-komponenter */
  children: React.ReactNode;
  [key: string]: any;
};

export const Accordion: React.FC<AccordionProps> = ({ ...rest }) => {
  const currentlyOpenState = React.useState<Id>(null);
  return <AccordionContext.Provider value={currentlyOpenState} {...rest} />;
};

type UseAccordionArgs = {
  id: Id;
  defaultOpen?: boolean;
};

export const useAccordion: ({ id, defaultOpen }: UseAccordionArgs) => {
  isOpen: boolean;
  toggle: () => void;
} = ({ id, defaultOpen }: UseAccordionArgs) => {
  const contextValue = React.useContext(AccordionContext);
  if (!contextValue) {
    throw new Error('You need to wrap your AccordionItem inside an Accordion');
  }

  const [openId, setOpenId] = contextValue;

  React.useEffect(() => {
    if (defaultOpen) {
      setOpenId(id);
    }
  }, [defaultOpen, id, setOpenId]);

  const isOpen = openId === id;

  return {
    isOpen,
    toggle: () => setOpenId(isOpen ? null : id),
  };
};
