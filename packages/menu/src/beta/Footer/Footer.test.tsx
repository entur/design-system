import { render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describeComponentContract } from '../../../../../tests/jest/componentContract';
import { Footer } from '.';

expect.extend(toHaveNoViolations);

describeComponentContract('Footer', {
  render: props => <Footer data-testid="footer" {...props} />,
  getElement: () => screen.getByTestId('footer'),
  baseClassName: 'eds-footer',
  refElement: HTMLElement,
});

describeComponentContract('Footer.Brand', {
  render: props => <Footer.Brand data-testid="brand" {...props} />,
  getElement: () => screen.getByTestId('brand'),
  baseClassName: 'eds-footer__brand',
  refElement: HTMLDivElement,
});

describeComponentContract('Footer.LinkGroup', {
  render: props => (
    <Footer.LinkGroup data-testid="group" title="Lenker" {...props} />
  ),
  getElement: () => screen.getByTestId('group'),
  baseClassName: 'eds-footer__link-group',
  refElement: HTMLElement,
});

describe('Footer', () => {
  it('renders a contentinfo landmark', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('is not contrast by default', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).not.toHaveClass('eds-footer--contrast');
    expect(footer).not.toHaveClass('eds-contrast');
  });

  it('adds contrast classes with contrast', () => {
    render(<Footer contrast />);
    expect(screen.getByRole('contentinfo')).toHaveClass(
      'eds-footer--contrast',
      'eds-contrast',
    );
  });

  it('always renders copyright and a link to entur.no', () => {
    render(<Footer />);
    expect(
      screen.getByText(`© ${new Date().getFullYear()} Entur AS`),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entur.no' })).toHaveAttribute(
      'href',
      'https://entur.no',
    );
  });

  it('renders Entur social media links with showSocialMedia', () => {
    render(<Footer showSocialMedia />);
    const list = screen.getByRole('list', { name: 'Entur i sosiale medier' });
    expect(within(list).getAllByRole('link')).toHaveLength(3);
    expect(
      within(list).getByRole('link', { name: 'LinkedIn' }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/company/entur-as/');
  });

  it('hides social media links by default', () => {
    render(<Footer />);
    expect(
      screen.queryByRole('list', { name: 'Entur i sosiale medier' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entur.no' })).toBeInTheDocument();
  });

  it('accepts a custom label for the social media list', () => {
    render(<Footer showSocialMedia socialMediaLabel="Entur on social media" />);
    expect(
      screen.getByRole('list', { name: 'Entur on social media' }),
    ).toBeInTheDocument();
  });
});

describe('Footer.Brand', () => {
  it('renders the small Entur logo with the product name', () => {
    const { container } = render(<Footer.Brand productName="Linje" />);
    expect(
      screen.getByRole('img', { name: 'Entur Linje logo' }),
    ).toBeInTheDocument();
    expect(container.querySelector('.eds-logo')).toHaveClass('eds-logo--small');
  });

  it('renders only the logo without children', () => {
    const { container } = render(<Footer.Brand />);
    expect(screen.getByRole('img', { name: 'Entur logo' })).toBeInTheDocument();
    expect(container.firstElementChild?.children).toHaveLength(1);
  });

  it('renders children below the logo', () => {
    const { container } = render(
      <Footer.Brand>
        Designsystemet til Entur.
        <address>Rådhusgata 5, 0151 Oslo</address>
      </Footer.Brand>,
    );
    const brand = container.firstElementChild as HTMLElement;
    expect(brand.firstElementChild).toHaveClass('eds-logo');
    expect(screen.getByText('Designsystemet til Entur.')).toBeInTheDocument();
    expect(screen.getByText('Rådhusgata 5, 0151 Oslo').tagName).toBe('ADDRESS');
  });
});

describe('Footer.LinkGroup', () => {
  it('is a navigation named by its title', () => {
    render(
      <Footer.LinkGroup title="Om nettstedet">
        <a href="/a">A</a>
        <a href="/b">B</a>
      </Footer.LinkGroup>,
    );
    const nav = screen.getByRole('navigation', { name: 'Om nettstedet' });
    expect(within(nav).getAllByRole('listitem')).toHaveLength(2);
    expect(
      within(nav).getByRole('heading', { level: 2, name: 'Om nettstedet' }),
    ).toBeInTheDocument();
  });

  it('gives each link inside a fragment its own list item', () => {
    render(
      <Footer.LinkGroup title="Lenker">
        <>
          <a href="/a">A</a>
          <a href="/b">B</a>
        </>
        <a href="/c">C</a>
      </Footer.LinkGroup>,
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    items.forEach(item =>
      expect(within(item).getAllByRole('link')).toHaveLength(1),
    );
  });

  it('flattens nested fragments and conditional links', () => {
    const showB = false;
    render(
      <Footer.LinkGroup title="Lenker">
        <>
          <>
            <a href="/a">A</a>
          </>
          {showB && <a href="/b">B</a>}
          {['c', 'd'].map(id => (
            <a key={id} href={`/${id}`}>
              {id}
            </a>
          ))}
        </>
      </Footer.LinkGroup>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('skips empty children', () => {
    render(
      <Footer.LinkGroup title="Lenker">
        <a href="/a">A</a>
        {false}
        {null}
      </Footer.LinkGroup>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});

describe('Footer accessibility', () => {
  it.each([false, true])(
    'has no violations when composed (contrast: %s)',
    async contrast => {
      const { container } = render(
        <Footer contrast={contrast} showSocialMedia>
          <Footer.Brand productName="Navn">
            Entur gjør det enklere å reise kollektivt i hele Norge.
            <address>Rådhusgata 5, 0151 Oslo</address>
          </Footer.Brand>
          <Footer.LinkGroup title="Kontakt">
            <a href="/kundesenter">Kundesenter</a>
            <a href="mailto:test@entur.org">test@entur.org</a>
          </Footer.LinkGroup>
          <Footer.LinkGroup title="Om nettstedet">
            <a href="/tilgjengelighet">Tilgjengelighetserklæring</a>
            <button type="button">Informasjonskapsler</button>
          </Footer.LinkGroup>
        </Footer>,
      );
      expect(await axe(container)).toHaveNoViolations();
    },
  );
});
