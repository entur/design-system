import React from 'react';
import { TextField } from '../TextField';

/**
 * Examples showing how to integrate beta form components with popular validation libraries
 *
 * Note: These are examples only - you would need to install the respective libraries
 */

// Example 1: React Hook Form integration
export const ReactHookFormExample: React.FC = () => {
  // This would require: npm install react-hook-form
  /*
  import { useForm } from 'react-hook-form';
  
  const { register, formState: { errors } } = useForm();
  
  return (
    <TextField
      label="Email"
      placeholder="Enter your email"
      variant={errors.email ? 'negative' : 'default'}
      feedback={errors.email?.message}
      {...register('email', {
        required: 'Email is required',
        pattern: {
          value: /^\S+@\S+\.\S+$/,
          message: 'Invalid email format'
        }
      })}
    />
  );
  */

  return (
    <div>
      <h3>React Hook Form Integration</h3>
      <p>
        Install: <code>npm install react-hook-form</code>
      </p>
      <pre>{`
const { register, formState: { errors } } = useForm();

<TextField
  label="Email"
  variant={errors.email ? 'error' : 'default'}
  feedback={errors.email?.message}
  {...register('email', {
    required: 'Email is required',
    pattern: {
      value: /^\\S+@\\S+\\.\\S+$/,
      message: 'Invalid email format'
    }
  })}
/>`}</pre>
    </div>
  );
};

// Example 2: Formik integration
export const FormikExample: React.FC = () => {
  // This would require: npm install formik yup
  /*
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });
  
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: (values) => console.log(values),
  });
  
  return (
    <TextField
      label="Email"
      placeholder="Enter your email"
      value={formik.values.email}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      variant={formik.touched.email && formik.errors.email ? 'negative' : 'default'}
      feedback={formik.touched.email && formik.errors.email}
    />
  );
  */

  return (
    <div>
      <h3>Formik Integration</h3>
      <p>
        Install: <code>npm install formik yup</code>
      </p>
      <pre>{`
const formik = useFormik({
  initialValues: { email: '' },
  validationSchema: Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  }),
  onSubmit: (values) => console.log(values),
});

<TextField
  label="Email"
  value={formik.values.email}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  variant={formik.touched.email && formik.errors.email ? 'error' : 'default'}
  feedback={formik.touched.email && formik.errors.email}
/>`}</pre>
    </div>
  );
};

// Example 3: Zod integration
export const ZodExample: React.FC = () => {
  // This would require: npm install zod
  /*
  import { z } from 'zod';
  
  const schema = z.object({
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
  });
  
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({ email: '' });
  
  const validate = (field: string, value: string) => {
    try {
      schema.pick({ [field]: true }).parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };
  
  return (
    <TextField
      label="Email"
      placeholder="Enter your email"
      value={values.email}
      onChange={(e) => {
        setValues(prev => ({ ...prev, email: e.target.value }));
        validate('email', e.target.value);
      }}
      variant={errors.email ? 'negative' : 'default'}
      feedback={errors.email}
    />
  );
  */

  return (
    <div>
      <h3>Zod Integration</h3>
      <p>
        Install: <code>npm install zod</code>
      </p>
      <pre>{`
const schema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
});

const validate = (field: string, value: string) => {
  try {
    schema.pick({ [field]: true }).parse({ [field]: value });
    setErrors(prev => ({ ...prev, [field]: undefined }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      setErrors(prev => ({ ...prev, [field]: error.errors[0].message }));
    }
  }
};

<TextField
  label="Email"
  value={values.email}
  onChange={(e) => {
    setValues(prev => ({ ...prev, email: e.target.value }));
    validate('email', e.target.value);
  }}
  variant={errors.email ? 'error' : 'default'}
  feedback={errors.email}
/>`}</pre>
    </div>
  );
};

// Example 4: Custom validation
export const CustomValidationExample: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
      return 'negative';
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Invalid email format');
      return 'negative';
    }
    setEmailError('');
    return 'success';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  return (
    <div>
      <h3>Custom Validation</h3>
      <TextField
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
        variant={email ? (emailError ? 'negative' : 'success') : 'default'}
        feedback={
          emailError || (email && !emailError ? 'Email looks good!' : undefined)
        }
        required
      />
    </div>
  );
};

// Main component showing all examples
export const ValidationExamples: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        maxWidth: '800px',
      }}
    >
      <h2>Validation Integration Examples</h2>
      <p>
        The beta form components are designed to work with any validation
        library. They provide the visual infrastructure (variant, feedback)
        while you handle the validation logic.
      </p>

      <ReactHookFormExample />
      <FormikExample />
      <ZodExample />
      <CustomValidationExample />
    </div>
  );
};
