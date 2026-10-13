import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  SecondaryButton,
  IconButton,
  Paragraph,
} from '@entur/linje';
import { AdjustmentsIcon, ValidationInfoFilledIcon } from '@entur/icons';

// PopoverTrigger clones its child button and wires aria-expanded/click to the Popover.
export const Closed = () => (
  <Popover>
    <PopoverTrigger>
      <SecondaryButton>
        <AdjustmentsIcon aria-hidden="true" /> Filter
      </SecondaryButton>
    </PopoverTrigger>
    <PopoverContent>
      <div style={{ padding: 'var(--space-default)' }}>Filtervalg</div>
    </PopoverContent>
  </Popover>
);

export const Open = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ minHeight: 200 }}>
      <Popover showPopover={open} setShowPopover={setOpen}>
        <PopoverTrigger>
          <IconButton aria-label="Mer informasjon om billetten">
            <ValidationInfoFilledIcon />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ padding: 'var(--space-default)', maxWidth: 260 }}>
            <Paragraph margin="none">
              Billetten må aktiveres før du går om bord.
            </Paragraph>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
