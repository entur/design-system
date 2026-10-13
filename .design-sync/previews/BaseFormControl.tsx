import React from 'react';
import { BaseFormControl } from '@entur/linje';
import { SearchIcon } from '@entur/icons';

type FieldProps = Omit<
  React.ComponentProps<typeof BaseFormControl>,
  'children' | 'isFilled'
> & {
  initialValue?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

// BaseFormControl only positions the label from `isFilled`; it does not watch
// the input, so the value lives here and isFilled follows it.
const Field = ({
  initialValue = '',
  inputProps,
  labelId,
  ...rest
}: FieldProps) => {
  const [value, setValue] = React.useState(initialValue);
  return (
    <BaseFormControl labelId={labelId} isFilled={value !== ''} {...rest}>
      <input
        className="eds-form-control"
        aria-labelledby={labelId}
        value={value}
        onChange={e => setValue(e.target.value)}
        {...inputProps}
      />
    </BaseFormControl>
  );
};

export const Default = () => (
  <div style={{ width: 320 }}>
    <Field
      label="Kundenummer"
      labelId="bfc-kundenummer"
      initialValue="102938"
    />
  </div>
);

export const Empty = () => (
  <div style={{ width: 320 }}>
    <Field label="Kundenummer" labelId="bfc-empty" />
  </div>
);

export const PrependAndAppend = () => (
  <div style={{ width: 320 }}>
    <Field
      label="Pris"
      labelId="bfc-pris"
      initialValue="249"
      prepend={<SearchIcon inline />}
      append="kr"
    />
  </div>
);

export const Feedback = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <Field
      label="Billettnummer"
      labelId="bfc-neg"
      initialValue="AB-1234"
      variant="negative"
      feedback="Fant ingen billett med dette nummeret"
    />
    <Field
      label="Rabattkode"
      labelId="bfc-suc"
      initialValue="STUDENT25"
      variant="success"
      feedback="Rabattkoden er gyldig"
    />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <Field
      label="Organisasjon"
      labelId="bfc-ro"
      initialValue="Entur AS"
      readOnly
      inputProps={{ readOnly: true }}
    />
    <Field
      label="Avtalenummer"
      labelId="bfc-dis"
      initialValue="4471"
      disabled
      inputProps={{ disabled: true }}
    />
  </div>
);
