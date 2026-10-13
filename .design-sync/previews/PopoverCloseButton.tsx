import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  SecondaryButton,
  PrimaryButton,
  IconButton,
  Heading4,
  Paragraph,
  ButtonGroup,
} from '@entur/linje';
import { CloseIcon } from '@entur/icons';

// PopoverCloseButton wraps a button inside PopoverContent and closes the Popover on click.
export const IconClose = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ minHeight: 240 }}>
      <Popover showPopover={open} setShowPopover={setOpen}>
        <PopoverTrigger>
          <SecondaryButton>Varsler</SecondaryButton>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ padding: 'var(--space-default)', width: 280 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Heading4 margin="none">Forsinkelse</Heading4>
              <PopoverCloseButton>
                <IconButton aria-label="Lukk">
                  <CloseIcon aria-hidden="true" />
                </IconButton>
              </PopoverCloseButton>
            </div>
            <Paragraph margin="none">
              Toget til Drammen er 12 minutter forsinket.
            </Paragraph>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const ButtonClose = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ minHeight: 240 }}>
      <Popover showPopover={open} setShowPopover={setOpen}>
        <PopoverTrigger>
          <SecondaryButton>Lagre reise</SecondaryButton>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ padding: 'var(--space-default)', width: 280 }}>
            <Paragraph>
              Vil du lagre Oslo S – Lillehammer som favoritt?
            </Paragraph>
            <ButtonGroup>
              <PopoverCloseButton>
                <PrimaryButton size="small">Lagre</PrimaryButton>
              </PopoverCloseButton>
              <PopoverCloseButton>
                <SecondaryButton size="small">Avbryt</SecondaryButton>
              </PopoverCloseButton>
            </ButtonGroup>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
