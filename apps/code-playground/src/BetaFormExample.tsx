import React, { useState } from 'react';
import { TextField as BetaTextField } from '@entur/form/src/beta';
import {
  EmailIcon,
  SearchIcon,
  ClosedLockIcon,
  PhoneIcon,
  CheckIcon,
  WarningIcon,
  EuroIcon,
} from '@entur/icons';

/**
 * Comprehensive example demonstrating all TextField scenarios
 * This will be available in the code-playground app
 */
export const BetaFormExample: React.FC = () => {
  // State for interactive examples
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [currency, setCurrency] = useState('');
  const [domain, setDomain] = useState('');
  const [url, setUrl] = useState('');
  const [replaceTest, setReplaceTest] = useState('');
  const [appendTest, setAppendTest] = useState('');

  // Validation logic for demonstration
  const validateEmail = (value: string) => {
    if (!value) {
      return { variant: 'negative' as const, message: 'Email is required' };
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      return { variant: 'negative' as const, message: 'Invalid email format' };
    }
    return { variant: 'success' as const, message: 'Email looks good!' };
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return { variant: 'negative' as const, message: 'Password is required' };
    }
    if (value.length < 8) {
      return {
        variant: 'negative' as const,
        message: 'Password must be at least 8 characters',
      };
    }
    return { variant: 'success' as const, message: 'Password is strong' };
  };

  const validatePhone = (value: string) => {
    if (!value) {
      return { variant: 'default' as const, message: '' };
    }
    if (!/^\d{8}$/.test(value)) {
      return {
        variant: 'warning' as const,
        message: 'Phone should be 8 digits',
      };
    }
    return { variant: 'success' as const, message: 'Valid phone number' };
  };

  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const phoneValidation = validatePhone(phone);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        maxWidth: '800px',
        padding: '20px',
      }}
    >
      <div>
        <h1>Beta TextField Comprehensive Test</h1>
        <p>
          This demonstrates all TextField scenarios including states, props, and
          edge cases.
        </p>
      </div>

      {/* Interactive Examples with Validation */}
      <section>
        <h2>Interactive Examples with Validation</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <BetaTextField
            label="Email Address"
            labelIcon={<EmailIcon />}
            description="We'll never share your email with anyone else"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            variant={email ? emailValidation.variant : 'default'}
            feedback={email ? emailValidation.message : undefined}
            required
          />

          <BetaTextField
            label="Password"
            labelIcon={<ClosedLockIcon />}
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            variant={password ? passwordValidation.variant : 'default'}
            feedback={password ? passwordValidation.message : undefined}
            required
          />

          <BetaTextField
            label="Phone Number"
            labelIcon={<PhoneIcon />}
            placeholder="12345678"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            variant={phone ? phoneValidation.variant : 'default'}
            feedback={phone ? phoneValidation.message : undefined}
            clearable
          />

          <BetaTextField
            label="Search"
            labelIcon={<SearchIcon />}
            placeholder="Search for something..."
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            clearable
            onClear={() => setSearch('')}
            variant={search ? 'success' : 'default'}
            feedback={search ? 'Great! We found some results' : undefined}
          />
        </div>
      </section>

      {/* Prepend/Append Examples */}
      <section>
        <h2>Prepend/Append Examples</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <BetaTextField
            label="Currency Input"
            placeholder="0.00"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            prepend="$"
            description="Enter amount in dollars"
          />

          <BetaTextField
            label="Domain Input"
            placeholder="example"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            append=".com"
            description="Enter your domain name"
          />

          <BetaTextField
            label="Full URL Input"
            placeholder="example"
            value={url}
            onChange={e => setUrl(e.target.value)}
            prepend="https://"
            append=".com"
            description="Complete URL with both prepend and append"
          />

          <BetaTextField
            label="Website with Icon"
            labelIcon={<EuroIcon />}
            placeholder="example"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            prepend="https://"
            append=".com"
            variant="info"
            feedback="Enter your website URL"
          />
        </div>
      </section>

      {/* Size Variants */}
      <section>
        <h2>Size Variants</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="Small Size"
            placeholder="Small input field"
            size="small"
            description="Compact size for dense layouts"
          />
          <BetaTextField
            label="Medium Size (Default)"
            placeholder="Medium input field"
            size="medium"
            description="Standard size for most use cases"
          />
          <BetaTextField
            label="Large Size"
            placeholder="Large input field"
            size="large"
            description="Larger size for better accessibility"
          />
        </div>
      </section>

      {/* State Variants */}
      <section>
        <h2>State Variants</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="Success State"
            labelIcon={<CheckIcon />}
            defaultValue="Valid input"
            variant="success"
            feedback="This looks good!"
            description="Indicates successful validation"
          />
          <BetaTextField
            label="Warning State"
            labelIcon={<WarningIcon />}
            defaultValue="Warning input"
            variant="warning"
            feedback="Please review this"
            description="Indicates a warning or caution"
          />
          <BetaTextField
            label="Negative State"
            labelIcon={<EuroIcon />}
            defaultValue="Invalid input"
            variant="negative"
            feedback="This field has an negative"
            description="Indicates an negative that needs attention"
          />
          <BetaTextField
            label="Info State"
            labelIcon={<EuroIcon />}
            defaultValue="Info input"
            variant="info"
            feedback="Additional information"
            description="Provides additional context or information"
          />
        </div>
      </section>

      {/* Disabled and Read-only States */}
      <section>
        <h2>Disabled and Read-only States</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="Disabled State"
            defaultValue="Cannot edit this"
            disabled
            description="This field is currently disabled"
            prepend="$"
            append=".00"
          />
          <BetaTextField
            label="Read-only State"
            defaultValue="This is read-only content"
            readOnly
            description="This field is read-only"
            prepend="https://"
            append=".com"
          />
        </div>
      </section>

      {/* Input Types */}
      <section>
        <h2>Input Types</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="Text Input"
            type="text"
            placeholder="Enter text"
            defaultValue="Test value"
            description="Standard text input"
          />
          <BetaTextField
            label="Email Input"
            type="email"
            placeholder="user@example.com"
            description="Email input with validation"
          />
          <BetaTextField
            label="Password Input"
            type="password"
            placeholder="Enter password"
            description="Password input (hidden text)"
          />
          <BetaTextField
            label="Tel Input"
            type="tel"
            placeholder="12345678"
            description="Telephone number input"
          />
          <BetaTextField
            label="URL Input"
            type="url"
            placeholder="https://example.com"
            description="URL input with validation"
          />
          <BetaTextField
            label="Search Input"
            type="search"
            placeholder="Search..."
            clearable
            description="Search input with clear button"
          />
        </div>
      </section>

      {/* Edge Cases and Special Props */}
      <section>
        <h2>Edge Cases and Special Props</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="Required Field (Accessibility Only)"
            placeholder="This field is required"
            required
            description="Required for accessibility (no visual indicator unless you add requiredIndicator prop)"
          />
          <BetaTextField
            label="With Custom ID"
            id="custom-textfield-id"
            placeholder="Custom ID field"
            description="Field with custom ID for testing"
          />
          <BetaTextField
            label="With Custom Class"
            className="custom-textfield-class"
            placeholder="Custom class field"
            description="Field with custom CSS class"
          />
          <BetaTextField
            label="With Custom Style"
            placeholder="Custom style field"
            style={{ border: '2px dashed #ccc' }}
            description="Field with custom inline styles"
          />
          <BetaTextField
            label="With Input Props"
            placeholder="Field with additional input props"
            inputProps={{
              maxLength: 10,
              autoComplete: 'off',
              spellCheck: false,
            }}
            description="Field with additional HTML input attributes"
          />
        </div>
      </section>

      {/* Required Indicator Examples */}
      <section>
        <h2>Required Indicator (Custom Placement)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="Required with Custom Badge (Label Placement)"
            placeholder="Enter your name"
            required
            requiredIndicator={
              <span
                style={{
                  backgroundColor: '#e60000',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginLeft: '8px',
                }}
              >
                Required
              </span>
            }
            requiredIndicatorPlacement="label"
            description="The required indicator appears after the label"
          />
          <BetaTextField
            label="Required with Custom Badge (Description Placement)"
            placeholder="Enter your email"
            description="We need your email for account recovery"
            required
            requiredIndicator={
              <span
                style={{
                  backgroundColor: '#e60000',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginLeft: '8px',
                }}
              >
                Required
              </span>
            }
            requiredIndicatorPlacement="description"
          />
          <BetaTextField
            label="Required with Custom Text (Label)"
            placeholder="Enter phone number"
            required
            requiredIndicator={
              <span style={{ color: '#e60000', fontSize: '0.875rem' }}>
                (obligatorisk)
              </span>
            }
            requiredIndicatorPlacement="label"
            description="Custom text can be used instead of chips"
          />
          <BetaTextField
            label="Required with Custom Badge (Norwegian)"
            placeholder="Enter address"
            description="Please provide your full address"
            required
            requiredIndicator={
              <span
                style={{
                  backgroundColor: '#ff9800',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginLeft: '8px',
                }}
              >
                Påkrevd
              </span>
            }
            requiredIndicatorPlacement="description"
          />
          <BetaTextField
            label="Required without Custom Indicator"
            placeholder="Still marked as required for accessibility"
            required
            description="No visual indicator, but still marked as required for screen readers"
          />
        </div>
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <p>
            <strong>Required Indicator Feature:</strong>
          </p>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>
              <strong>requiredIndicator:</strong> Custom content (badge, text,
              or any React node)
            </li>
            <li>
              <strong>requiredIndicatorPlacement:</strong> &apos;label&apos;
              (after label) or &apos;description&apos; (under description)
            </li>
            <li>
              The &apos;required&apos; prop still sets aria-required for
              accessibility
            </li>
            <li>No automatic asterisk - you control the visual indicator</li>
          </ul>
        </div>
      </section>

      {/* Clearable + Append Examples */}
      <section>
        <h2>Clearable with Append/Prepend</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="Clearable with Append"
            placeholder="Type something..."
            value={appendTest}
            onChange={e => setAppendTest(e.target.value)}
            clearable
            onClear={() => setAppendTest('')}
            append=".com"
            description="Both append content and clear button are shown side by side"
          />
          <BetaTextField
            label="Clearable with Prepend"
            placeholder="Type something..."
            value={replaceTest}
            onChange={e => setReplaceTest(e.target.value)}
            clearable
            onClear={() => setReplaceTest('')}
            prepend="$"
            description="Prepend + clearable work together without conflict"
          />
          <BetaTextField
            label="Clearable Only"
            placeholder="Type something..."
            defaultValue=""
            clearable
            description="Clearable without any prepend/append content"
          />
        </div>
      </section>

      {/* Complex Example */}
      <section>
        <h2>Complex Example: All Features Together</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="URL Input"
            placeholder="example"
            value={appendTest}
            onChange={e => setAppendTest(e.target.value)}
            clearable
            onClear={() => setAppendTest('')}
            prepend="https://"
            append=".com"
            description="Prepend, append, and clear button all work together"
          />
        </div>
      </section>

      {/* Accessibility Features */}
      <section>
        <h2>Accessibility Features</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="With Aria Alert"
            placeholder="Field with aria alert"
            feedback="This feedback will be announced to screen readers"
            ariaAlertOnFeedback
            description="Feedback is announced as an alert to screen readers"
          />
          <BetaTextField
            label="With Tooltip"
            labelIcon={<EuroIcon />}
            tooltip="This is a helpful tooltip that provides additional information about this field. It appears when you click the question mark icon."
            tooltipPlacement="top"
            tooltipAriaLabel="Help for With Tooltip field"
            placeholder="Field with tooltip"
            description="This field has a tooltip icon for additional help"
          />
        </div>
      </section>

      {/* Visually Hidden Label */}
      <section>
        <h2>Visually Hidden Label</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="Search"
            visuallyHiddenLabel={true}
            labelIcon={<SearchIcon />}
            placeholder="Search..."
            type="search"
            clearable
            description="Label is visually hidden but accessible to screen readers"
          />
          <BetaTextField
            label="Email"
            visuallyHiddenLabel={true}
            placeholder="user@example.com"
            type="email"
            description="Useful for compact UIs where placeholder provides visual context"
          />
          <div
            style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            <p>
              <strong>Visually Hidden Label Feature:</strong>
            </p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>
                <strong>visuallyHiddenLabel:</strong> Hides label from sight but
                keeps it for screen readers
              </li>
              <li>
                Useful for search inputs, icon-only designs, and compact UIs
              </li>
              <li>Label is still connected to input via htmlFor attribute</li>
              <li>
                Maintains accessibility while providing visual flexibility
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Horizontal Layout (Label on Left) */}
      <section>
        <h2>Horizontal Layout (Label on Left)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="First Name"
            labelPlacement="left"
            placeholder="Enter first name"
            defaultValue=""
          />
          <BetaTextField
            label="Last Name"
            labelPlacement="left"
            placeholder="Enter last name"
            defaultValue=""
          />
          <BetaTextField
            label="Email"
            labelPlacement="left"
            labelIcon={<EmailIcon />}
            placeholder="user@example.com"
            type="email"
            defaultValue=""
            feedback="Label is on the left for compact layouts"
            variant="info"
          />
          <BetaTextField
            label="Phone"
            labelPlacement="left"
            labelIcon={<PhoneIcon />}
            placeholder="+47 123 45 678"
            type="tel"
            defaultValue=""
            required
            requiredIndicator=" *"
          />
          <BetaTextField
            label="Website"
            labelPlacement="left"
            placeholder="example"
            prepend="https://"
            append=".com"
            defaultValue=""
            clearable
          />
          <BetaTextField
            label="Amount"
            labelPlacement="left"
            placeholder="0.00"
            prepend="$"
            defaultValue=""
            variant="success"
            feedback="Valid amount"
          />
          <div
            style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            <p>
              <strong>Horizontal Layout Feature:</strong>
            </p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>
                <strong>labelPlacement:</strong> &apos;top&apos; (default) or
                &apos;left&apos; (horizontal)
              </li>
              <li>
                When set to &apos;left&apos;, label appears beside the input
              </li>
              <li>
                Description is not displayed with &apos;left&apos; placement
                (dev warning shown if provided)
              </li>
              <li>
                Useful for compact forms, data entry screens, and filter panels
              </li>
              <li>
                Works with all features: feedback, icons, prepend/append,
                clearable
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Horizontal + Small Size (Compact Form) */}
      <section>
        <h2>Compact Form Example (Horizontal + Small)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <BetaTextField
            label="Name"
            labelPlacement="left"
            size="small"
            placeholder="Enter name"
            defaultValue=""
          />
          <BetaTextField
            label="Age"
            labelPlacement="left"
            size="small"
            placeholder="Enter age"
            defaultValue=""
          />
          <BetaTextField
            label="City"
            labelPlacement="left"
            size="small"
            placeholder="Enter city"
            defaultValue=""
          />
          <div
            style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            <p>
              <strong>Combining horizontal layout with small size</strong>{' '}
              creates very compact forms ideal for:
            </p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Filter panels and sidebars</li>
              <li>Dense data entry forms</li>
              <li>Modal dialogs with limited space</li>
              <li>Settings and configuration screens</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Custom Label Width */}
      <section>
        <h2>Custom Label Width</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BetaTextField
            label="Short"
            labelPlacement="left"
            labelWidth="80px"
            placeholder="Narrow label"
            defaultValue=""
          />
          <BetaTextField
            label="Default Width"
            labelPlacement="left"
            placeholder="Default 150px width"
            defaultValue=""
          />
          <BetaTextField
            label="Longer Label Text"
            labelPlacement="left"
            labelWidth="200px"
            placeholder="Wider label to fit text"
            defaultValue=""
          />
          <BetaTextField
            label="Very Long Label Name"
            labelPlacement="left"
            labelWidth="250px"
            placeholder="Extra wide label"
            defaultValue=""
          />
          <div
            style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            <p>
              <strong>Custom Label Width Feature:</strong>
            </p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>
                <strong>labelWidth:</strong> Customize the label width (default:
                150px)
              </li>
              <li>
                All labels in a form should use the same width for alignment
              </li>
              <li>Choose width based on your longest label text</li>
              <li>Labels are right-aligned for a clean, professional look</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
