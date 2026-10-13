import React from 'react';
import {
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  NegativeButton,
} from '@entur/linje';
import { ForwardIcon, DeleteIcon } from '@entur/icons';

export const PrimaryAndSecondary = () => (
  <ButtonGroup>
    <PrimaryButton>Kjøp billett</PrimaryButton>
    <SecondaryButton>Avbryt</SecondaryButton>
  </ButtonGroup>
);

export const StepNavigation = () => (
  <ButtonGroup>
    <SecondaryButton>Tilbake</SecondaryButton>
    <PrimaryButton>
      Gå til betaling <ForwardIcon />
    </PrimaryButton>
  </ButtonGroup>
);

export const ConfirmDelete = () => (
  <ButtonGroup>
    <NegativeButton>
      <DeleteIcon /> Slett reise
    </NegativeButton>
    <SecondaryButton>Behold</SecondaryButton>
  </ButtonGroup>
);

export const Small = () => (
  <ButtonGroup>
    <SecondaryButton size="small">Endre avgang</SecondaryButton>
    <SecondaryButton size="small">Del reise</SecondaryButton>
    <SecondaryButton size="small">Skriv ut</SecondaryButton>
  </ButtonGroup>
);
