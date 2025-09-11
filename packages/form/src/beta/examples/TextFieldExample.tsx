import React, { useState } from 'react';
import { TextField } from '../TextField';

/**
 * Example usage of the beta TextField component
 * This demonstrates all the key features and props
 *
 * Note: This example shows manual validation for demonstration.
 * In real applications, you would use validation libraries like:
 * - react-hook-form
 * - formik
 * - yup
 * - zod
 */
export const TextFieldExample: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');

  // Simple validation logic (users would typically use a validation library)
  const validateEmail = (value: string) => {
    if (!value)
      return { variant: 'negative' as const, message: 'Email is required' };
    if (!/\S+@\S+\.\S+/.test(value))
      return { variant: 'negative' as const, message: 'Invalid email format' };
    return { variant: 'success' as const, message: 'Email looks good!' };
  };

  const validatePassword = (value: string) => {
    if (!value)
      return { variant: 'negative' as const, message: 'Password is required' };
    if (value.length < 8)
      return {
        variant: 'negative' as const,
        message: 'Password must be at least 8 characters',
      };
    return { variant: 'success' as const, message: 'Password is strong' };
  };

  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '400px',
      }}
    >
      <h2>Beta TextField Examples</h2>

      {/* TextField with external validation */}
      <TextField
        label="Email Address"
        description="We'll never share your email with anyone else"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        variant={email ? emailValidation.variant : 'default'}
        feedback={email ? emailValidation.message : undefined}
        required
      />

      {/* TextField with external validation */}
      <TextField
        label="Password"
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        variant={password ? passwordValidation.variant : 'default'}
        feedback={password ? passwordValidation.message : undefined}
        required
      />

      {/* TextField with clear button - onClear is optional */}
      <TextField
        label="Search"
        placeholder="Search for something..."
        type="search"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        clearable
        variant={search ? 'success' : 'default'}
        feedback={search ? 'Great! We found some results' : undefined}
      />

      {/* TextField with custom onClear behavior */}
      <TextField
        label="Custom Clear"
        placeholder="Type something..."
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        clearable
        onClear={() => {
          setSearch('');
          console.log('Custom clear action executed!');
        }}
        feedback="This has custom clear behavior"
      />

      {/* TextField with prepend/append */}
      <TextField
        label="Website"
        placeholder="example"
        value=""
        onChange={() => {}}
        prepend="https://"
        append=".com"
        variant="info"
        feedback="Enter your website URL"
      />

      {/* Disabled TextField */}
      <TextField
        label="Disabled Field"
        placeholder="This field is disabled"
        value="Cannot edit this"
        disabled
        description="This field is currently disabled"
      />

      {/* Read-only TextField */}
      <TextField
        label="Read-only Field"
        value="This is read-only content"
        readOnly
        description="This field is read-only"
      />

      {/* Different sizes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <TextField
          label="Small Size"
          placeholder="Small input"
          size="small"
          value=""
          onChange={() => {}}
        />
        <TextField
          label="Medium Size (default)"
          placeholder="Medium input"
          size="medium"
          value=""
          onChange={() => {}}
        />
        <TextField
          label="Large Size"
          placeholder="Large input"
          size="large"
          value=""
          onChange={() => {}}
        />
      </div>

      <h3>Horizontal Layout (Label on Left)</h3>

      {/* Label on left - horizontal layout */}
      <TextField
        label="First Name"
        labelPlacement="left"
        placeholder="Enter first name"
        value=""
        onChange={() => {}}
      />

      <TextField
        label="Email"
        labelPlacement="left"
        placeholder="user@example.com"
        type="email"
        value=""
        onChange={() => {}}
        feedback="Label is on the left for compact layouts"
        variant="info"
      />

      {/* Horizontal with required */}
      <TextField
        label="Phone"
        labelPlacement="left"
        placeholder="+47 123 45 678"
        type="tel"
        value=""
        onChange={() => {}}
        required
        requiredIndicator=" *"
      />
    </div>
  );
};
