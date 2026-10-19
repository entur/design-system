import { render } from '@testing-library/react';
import { Label } from '../components/Label';

describe('Label Component', () => {
  test('renders a label with the label text style', () => {
    const { getByText } = render(<Label htmlFor="navn">Navn</Label>);
    const label = getByText('Navn');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'navn');
    expect(label).toHaveClass('eds-text', 'eds-text--label');
  });

  test('labels the field it points to', () => {
    const { getByLabelText } = render(
      <>
        <Label htmlFor="epost">E-post</Label>
        <input id="epost" />
      </>,
    );
    expect(getByLabelText('E-post').tagName).toBe('INPUT');
  });

  test('applies spacing and forwards the ref', () => {
    const ref = { current: null as HTMLLabelElement | null };
    const { getByText } = render(
      <Label ref={ref} spacing={{ bottom: 'xs' }}>
        Telefon
      </Label>,
    );
    const label = getByText('Telefon');
    expect(label).toHaveStyle({
      '--eds-text-spacing-bottom': 'var(--spacing-xs)',
    });
    expect(ref.current).toBe(label);
  });
});
