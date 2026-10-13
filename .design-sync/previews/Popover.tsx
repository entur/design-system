import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  SecondaryButton,
  IconButton,
  Heading4,
  Checkbox,
  Paragraph,
  PrimaryButton,
} from '@entur/linje';
import { AdjustmentsIcon, CloseIcon } from '@entur/icons';

// Controlled open (showPopover + setShowPopover) so the popover renders open statically.
const Room = ({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) => (
  <div
    style={{
      minHeight: 320,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: center ? 'center' : 'flex-start',
    }}
  >
    {children}
  </div>
);

export const Open = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Room>
      <Popover showPopover={open} setShowPopover={setOpen}>
        <PopoverTrigger>
          <SecondaryButton>
            <AdjustmentsIcon aria-hidden="true" /> Filter
          </SecondaryButton>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ padding: 'var(--space-default)', width: 260 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Heading4 margin="none">Transportmiddel</Heading4>
              <PopoverCloseButton>
                <IconButton aria-label="Lukk filter">
                  <CloseIcon aria-hidden="true" />
                </IconButton>
              </PopoverCloseButton>
            </div>
            <Checkbox defaultChecked>Tog</Checkbox>
            <Checkbox defaultChecked>Buss</Checkbox>
            <Checkbox>Trikk</Checkbox>
            <Checkbox>Båt</Checkbox>
          </div>
        </PopoverContent>
      </Popover>
    </Room>
  );
};

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

export const PlacementBottom = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Room center>
      <Popover showPopover={open} setShowPopover={setOpen} placement="bottom">
        <PopoverTrigger>
          <PrimaryButton>Hva er honnørbillett?</PrimaryButton>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ padding: 'var(--space-default)', maxWidth: 280 }}>
            <Paragraph margin="none">
              Honnørbillett gjelder for reisende over 67 år og personer med
              uføretrygd. Husk gyldig legitimasjon.
            </Paragraph>
          </div>
        </PopoverContent>
      </Popover>
    </Room>
  );
};
