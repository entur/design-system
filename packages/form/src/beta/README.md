# Beta Form Components

This is the beta version of the new form components, built with modern React patterns and following best practices from major design systems.

## Architecture

The beta form package follows a composable architecture with clear separation of concerns:

- **BaseForm**: Core form wrapper handling layout, states, and accessibility
- **Hooks**: Reusable logic for form field management
- **Components**: Specific form field implementations (TextField, etc.)

## Key Features

### 🎯 **Accessibility First**

- Automatic ID generation and aria connections
- Screen reader support with proper roles and labels
- Keyboard navigation support
- Focus management

### 🎨 **Design System Integration**

- Consistent with existing design tokens
- Support for light/dark themes
- Proper color variants (success, warning, negative, info)
- Size variants (small, medium, large)

### 🔧 **Developer Experience**

- TypeScript support with full type safety
- Composable architecture for easy extension
- Consistent API across all form components
- External validation support (react-hook-form, formik, etc.)

### 🚀 **Performance**

- Optimized re-renders with proper memoization
- Minimal bundle size impact
- Tree-shakeable exports

### ✅ **Validation Philosophy**

The beta form components follow the same pattern as existing form components:

- **No built-in validation logic** - users handle validation themselves
- **Visual state support** - components provide `variant` and `feedback` props
- **Validation library agnostic** - works with any validation solution
- **Infrastructure only** - components display validation results, don't perform validation

## Usage

### Basic Usage

```tsx
import { TextField } from '@entur/form/beta';

function MyForm() {
  const [value, setValue] = useState('');

  return (
    <TextField
      label="Email Address"
      description="We'll never share your email"
      placeholder="Enter your email"
      value={value}
      onChange={e => setValue(e.target.value)}
      required
      clearable
    />
  );
}
```

### With External Validation

```tsx
import { TextField } from '@entur/form/beta';
import { useForm } from 'react-hook-form';

function MyForm() {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <TextField
      label="Email Address"
      placeholder="Enter your email"
      variant={errors.email ? 'negative' : 'default'}
      feedback={errors.email?.message}
      {...register('email', {
        required: 'Email is required',
        pattern: {
          value: /^\S+@\S+$/i,
          message: 'Invalid email address',
        },
      })}
    />
  );
}
```

## Components

### TextField

A versatile text input component with built-in validation states, clear functionality, and accessibility features.

**Props:**

- `label`: Field label
- `description`: Help text below the label
- `feedback`: Error/success message
- `variant`: Visual state (default, success, warning, negative, info)
- `size`: Size variant (small, medium, large)
- `clearable`: Show clear button when field has value
- `prepend`/`append`: Content before/after the input
- `disabled`/`readOnly`: Field states
- `required`: Mark field as required

## Migration from Current Form Components

The beta components are designed to be a drop-in replacement for existing form components with improved APIs and better developer experience.

### Key Differences

1. **Simplified API**: Fewer props, clearer naming
2. **Better TypeScript**: Full type safety with proper generics
3. **Improved Accessibility**: Automatic aria management
4. **Modern Patterns**: Uses React 18+ features and hooks
5. **Consistent Styling**: Unified design system integration
6. **Same Validation Pattern**: No built-in validation, external validation support

## Future Components

Planned components for the beta package:

- TextArea
- Select
- Checkbox
- Radio
- Switch
- DatePicker
- FileUpload

## Contributing

When adding new form components:

1. Follow the established patterns in BaseForm and TextField
2. Use the shared hooks for consistent behavior
3. Add proper TypeScript types
4. Include accessibility features
5. Write comprehensive tests
6. Update documentation
