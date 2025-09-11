import React, { useState } from 'react';
import { TextField } from '../TextField';

/**
 * Test example to demonstrate the unified border styling
 * for TextField with prepend/append elements
 */
export const BorderTestExample: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '500px',
        padding: '20px',
      }}
    >
      <h2>TextField Border Test</h2>
      <p>
        All TextFields now have unified borders around the entire field,
        including prepend/append elements.
      </p>

      {/* TextField with prepend only */}
      <TextField
        label="With Prepend Only"
        placeholder="Enter amount"
        value={value}
        onChange={e => setValue(e.target.value)}
        prepend="$"
        description="Currency input with prepend"
      />

      {/* TextField with append only */}
      <TextField
        label="With Append Only"
        placeholder="Enter domain"
        value={value}
        onChange={e => setValue(e.target.value)}
        append=".com"
        description="Domain input with append"
      />

      {/* TextField with both prepend and append */}
      <TextField
        label="With Both Prepend and Append"
        placeholder="example"
        value={value}
        onChange={e => setValue(e.target.value)}
        prepend="https://"
        append=".com"
        description="URL input with both prepend and append"
      />

      {/* TextField without prepend/append */}
      <TextField
        label="Without Prepend/Append"
        placeholder="Regular input"
        value={value}
        onChange={e => setValue(e.target.value)}
        description="Regular input without prepend/append"
      />

      {/* Different states */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3>Different States</h3>

        <TextField
          label="Success State"
          placeholder="Success input"
          value="test@example.com"
          onChange={() => {}}
          prepend="@"
          variant="success"
          feedback="This looks good!"
        />

        <TextField
          label="Error State"
          placeholder="Error input"
          value="invalid"
          onChange={() => {}}
          prepend="https://"
          append=".com"
          variant="negative"
          feedback="This is invalid"
        />

        <TextField
          label="Disabled State"
          placeholder="Disabled input"
          value="Cannot edit"
          onChange={() => {}}
          prepend="$"
          disabled
          description="This field is disabled"
        />
      </div>
    </div>
  );
};
