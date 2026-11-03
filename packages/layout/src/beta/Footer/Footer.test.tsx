import { render, screen, within } from '@testing-library/react';
import { describeComponentContract } from '../../../../../tests/jest/componentContract';
import { Footer } from '.';

describeComponentContract('Footer', {
  render: props => <Footer data-testid="footer" {...props} />,
  getElement: () => screen.getByTestId('footer'),
  baseClassName: 'eds-footer',
  refElement: HTMLElement,
  as: 'div',
});

describeComponentContract('Footer.Brand', {
  render: props => <Footer.Brand data-testid="brand" {...props} />,
  getElement: () => screen.getByTestId('brand'),
  baseClassName: 'eds-footer__brand',
  refElement: HTMLDivElement,
  as: 'section',
});

describeComponentContract('Footer.Column', {
  render: props => <Footer.Column data-testid="column" {...props} />,
  getElement: () => screen.getByTestId('column'),
  baseClassName: 'eds-footer__column',
  refElement: HTMLDivElement,
  as: 'section',
});

describeComponentContract('Footer.LinkGroup', {
  render: props => (
    <Footer.LinkGroup data-testid="group" heading="Lenker" {...props} />
  ),
  getElement: () => screen.getByTestId('group'),
  baseClassName: 'eds-footer__link-group',
  refElement: HTMLElement,
  as: 'div',
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

  it('renders Entur social media links', () => {
    render(<Footer />);
    const list = screen.getByRole('list', { name: 'Entur i sosiale medier' });
    expect(within(list).getAllByRole('link')).toHaveLength(3);
    expect(
      within(list).getByRole('link', { name: 'LinkedIn' }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/company/entur-as/');
  });

  it('hides social media links with hideSocialMedia', () => {
    render(<Footer hideSocialMedia />);
    expect(
      screen.queryByRole('list', { name: 'Entur i sosiale medier' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entur.no' })).toBeInTheDocument();
  });

  it('accepts a custom label for the social media list', () => {
    render(<Footer socialMediaLabel="Entur on social media" />);
    expect(
      screen.getByRole('list', { name: 'Entur on social media' }),
    ).toBeInTheDocument();
  });
});

describe('Footer.Brand', () => {
  it('renders the logo and the default Entur description', () => {
    render(
      <Footer.Brand>
        <span>Logo</span>
      </Footer.Brand>,
    );
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Entur gjør det enklere å reise kollektivt i hele Norge.',
      ),
    ).toBeInTheDocument();
  });

  it('renders a custom description', () => {
    render(<Footer.Brand description="Designsystemet til Entur." />);
    expect(screen.getByText('Designsystemet til Entur.')).toBeInTheDocument();
  });
});

describe('Footer.LinkGroup', () => {
  it('is a navigation named by its heading', () => {
    render(
      <Footer.LinkGroup heading="Om nettstedet">
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

  it('renders the heading at headingLevel', () => {
    render(<Footer.LinkGroup heading="Kontakt" headingLevel="h3" />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Kontakt' }),
    ).toBeInTheDocument();
  });

  it('gives each link inside a fragment its own list item', () => {
    render(
      <Footer.LinkGroup heading="Lenker">
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
      <Footer.LinkGroup heading="Lenker">
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
      <Footer.LinkGroup heading="Lenker">
        <a href="/a">A</a>
        {false}
        {null}
      </Footer.LinkGroup>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});
