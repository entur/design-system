import { render } from '@testing-library/react';
import { TextArea } from './TextArea';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
test('TextField is accessible', async () => {
  const { container } = render(<TextArea label="testing label" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('resize prop sets inline style on textarea', () => {
  const { container } = render(
    <TextArea label="testing label" resize="none" />,
  );
  const textarea = container.querySelector('textarea');
  expect(textarea).toHaveStyle({ resize: 'none' });
});

test('textarea does not override default CSS resize when no resize prop is set', () => {
  const { container } = render(<TextArea label="testing label" />);
  const textarea = container.querySelector('textarea');
  expect(textarea?.style.resize).toBe('');
});
