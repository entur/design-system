import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  SecondaryButton,
  Heading4,
  Paragraph,
} from '@entur/linje';
import { QuestionIcon } from '@entur/icons';

// PopoverContent only renders inside a Popover; shown open via controlled state.
export const Open = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ minHeight: 260 }}>
      <Popover showPopover={open} setShowPopover={setOpen}>
        <PopoverTrigger>
          <SecondaryButton>
            <QuestionIcon aria-hidden="true" /> Soner
          </SecondaryButton>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ padding: 'var(--space-default)', maxWidth: 280 }}>
            <Heading4 margin="bottom">Hva er en sone?</Heading4>
            <Paragraph margin="none">
              Prisen avhenger av hvor mange soner du reiser gjennom. Sone 1
              dekker hele Oslo.
            </Paragraph>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
