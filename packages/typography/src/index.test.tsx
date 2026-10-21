import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Blockquote,
  BlockquoteFooter,
  CodeText,
  EmphasizedText,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Label,
  LeadParagraph,
  Link,
  ListItem,
  NumberedList,
  Paragraph,
  PreformattedText,
  SmallText,
  StrongText,
  SubLabel,
  SubParagraph,
  UnorderedList,
} from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

expect.extend(toHaveNoViolations);

const contractCases: Array<
  [
    name: string,
    Component: React.ElementType,
    baseClassName: string,
    as?: keyof JSX.IntrinsicElements,
  ]
> = [
  ['Blockquote', Blockquote, 'eds-blockquote'],
  ['BlockquoteFooter', BlockquoteFooter, 'eds-blockquote__footer'],
  ['CodeText', CodeText, 'eds-code-text', 'span'],
  ['EmphasizedText', EmphasizedText, 'eds-emphasized-text', 'span'],
  ['Heading1', Heading1, 'eds-h1', 'h2'],
  ['Heading2', Heading2, 'eds-h2', 'h3'],
  ['Heading3', Heading3, 'eds-h3', 'h4'],
  ['Heading4', Heading4, 'eds-h4', 'h5'],
  ['Heading5', Heading5, 'eds-h5', 'h6'],
  ['Heading6', Heading6, 'eds-h6', 'h5'],
  ['Label', Label, 'eds-label', 'span'],
  ['LeadParagraph', LeadParagraph, 'eds-lead-paragraph', 'div'],
  ['Link', Link, 'eds-link', 'button'],
  ['ListItem', ListItem, 'eds-list-item'],
  ['NumberedList', NumberedList, 'eds-numbered-list'],
  ['Paragraph', Paragraph, 'eds-paragraph', 'div'],
  ['PreformattedText', PreformattedText, 'eds-preformatted-text', 'div'],
  ['SmallText', SmallText, 'eds-small-text', 'p'],
  ['StrongText', StrongText, 'eds-strong-text', 'span'],
  ['SubLabel', SubLabel, 'eds-sub-label', 'p'],
  ['SubParagraph', SubParagraph, 'eds-sub-paragraph', 'div'],
  ['UnorderedList', UnorderedList, 'eds-unordered-list'],
];

contractCases.forEach(([name, Component, baseClassName, as]) => {
  describeComponentContract(name, {
    render: props => <Component {...props}>Content</Component>,
    getElement: () => screen.getByText('Content'),
    baseClassName,
    as,
  });
});

test.each([
  ['Heading1', Heading1, 'eds-h1'],
  ['Label', Label, 'eds-label'],
  ['LeadParagraph', LeadParagraph, 'eds-lead-paragraph'],
  ['Link', Link, 'eds-link'],
  ['SmallText', SmallText, 'eds-small-text'],
  ['StrongText', StrongText, 'eds-strong-text'],
  ['SubLabel', SubLabel, 'eds-sub-label'],
  ['SubParagraph', SubParagraph, 'eds-sub-paragraph'],
] as Array<[string, React.ElementType, string]>)(
  '%s applies the margin modifier for each margin value',
  (_, Component, baseClassName) => {
    const { rerender } = render(<Component margin="top">Content</Component>);
    const element = screen.getByText('Content');
    expect(element).toHaveClass(`${baseClassName}--margin-top`);
    rerender(<Component margin="bottom">Content</Component>);
    expect(element).toHaveClass(`${baseClassName}--margin-bottom`);
    expect(element).not.toHaveClass(`${baseClassName}--margin-top`);
    rerender(<Component margin="none">Content</Component>);
    expect(element).toHaveClass(`${baseClassName}--margin-none`);
    rerender(<Component margin="both">Content</Component>);
    expect(element.className).not.toMatch(/--margin-/);
  },
);

test('preserves heading levels independently of visual hierarchy', () => {
  render(
    <>
      <Heading1>Travel guide</Heading1>
      <Heading2>Tickets</Heading2>
      <Heading3>Single tickets</Heading3>
      <Heading4>Discounts</Heading4>
      <Heading5>Children</Heading5>
      <Heading6>Conditions</Heading6>
      <Heading1 as="h2">Routes</Heading1>
    </>,
  );

  [
    'Travel guide',
    'Tickets',
    'Single tickets',
    'Discounts',
    'Children',
    'Conditions',
  ].forEach((name, index) => {
    expect(
      screen.getByRole('heading', { name, level: index + 1 }),
    ).toBeInTheDocument();
  });
  expect(
    screen.getByRole('heading', { name: 'Routes', level: 2 }),
  ).toBeInTheDocument();
});

test('composes semantic inline text and preserves preformatted code', () => {
  const code = 'route:\n  Oslo -> Bergen';
  render(
    <>
      <Paragraph>
        <StrongText>Required:</StrongText>{' '}
        <EmphasizedText>bring your ticket</EmphasizedText>.{' '}
        <SmallText>Valid today</SmallText>
      </Paragraph>
      <PreformattedText>
        <CodeText>{code}</CodeText>
      </PreformattedText>
    </>,
  );

  const strong = screen.getByText('Required:');
  expect(strong.tagName).toBe('STRONG');
  expect(strong.parentElement?.tagName).toBe('P');
  expect(screen.getByText('bring your ticket').tagName).toBe('EM');
  expect(screen.getByText('Valid today').parentElement).toBe(
    strong.parentElement,
  );
  const codeElement = screen.getByText('route: Oslo -> Bergen');
  expect(codeElement.tagName).toBe('CODE');
  expect(codeElement.parentElement?.tagName).toBe('PRE');
  expect(codeElement.textContent).toBe(code);
});

test('associates labels and supporting text with a keyboard-editable control', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Label htmlFor="destination">Destination</Label>
      <SubLabel id="destination-help">Choose a station</SubLabel>
      <input id="destination" aria-describedby="destination-help" />
    </>,
  );

  const input = screen.getByRole('textbox', { name: 'Destination' });
  expect(input).toHaveAccessibleDescription('Choose a station');
  await user.click(screen.getByText('Destination'));
  expect(input).toHaveFocus();
  await user.keyboard('Oslo');
  expect(input).toHaveValue('Oslo');
});

test('links can be reached and activated by keyboard', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn(event => event.preventDefault());
  render(
    <Link href="/tickets" onClick={onClick}>
      Buy tickets
    </Link>,
  );

  const link = screen.getByRole('link', { name: 'Buy tickets' });
  expect(link).toHaveAttribute('href', '/tickets');
  await user.tab();
  expect(link).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('includes the default or translated external indicator in the link name', () => {
  const { rerender } = render(
    <Link href="https://entur.no" external>
      Journey planner
    </Link>,
  );
  expect(
    screen.getByRole('link', { name: 'Journey planner (ekstern lenke)' }),
  ).toHaveAttribute('href', 'https://entur.no');

  rerender(
    <Link
      href="https://entur.no"
      external
      ariaLabelExternalIcon="(external link)"
    >
      Journey planner
    </Link>,
  );
  expect(
    screen.getByRole('link', { name: 'Journey planner (external link)' }),
  ).toBeInTheDocument();
});

test('composes ordered and unordered lists with visible item titles', () => {
  render(
    <>
      <NumberedList aria-label="Booking steps" start={3} type="A">
        <ListItem title="Choose a route">Find your destination</ListItem>
        <ListItem>Pay for tickets</ListItem>
      </NumberedList>
      <UnorderedList aria-label="Bring on board">
        <ListItem>Your ticket</ListItem>
      </UnorderedList>
    </>,
  );

  const ordered = screen.getByRole('list', { name: 'Booking steps' });
  expect(ordered.tagName).toBe('OL');
  expect(ordered).toHaveAttribute('start', '3');
  expect(ordered).toHaveAttribute('type', 'A');
  const items = within(ordered).getAllByRole('listitem');
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveTextContent('Choose a route');
  expect(items[0]).toHaveTextContent('Find your destination');
  expect(within(items[0]).getByText('Choose a route').tagName).toBe('STRONG');
  expect(items[1]).toHaveTextContent('Pay for tickets');
  const unordered = screen.getByRole('list', { name: 'Bring on board' });
  expect(unordered.tagName).toBe('UL');
  expect(within(unordered).getAllByRole('listitem')).toHaveLength(1);
});

test('keeps a quotation and its cited source together', () => {
  render(
    <Blockquote cite="https://entur.no">
      <Paragraph>Travel together</Paragraph>
      <BlockquoteFooter>
        <cite>Entur travel guide</cite>
      </BlockquoteFooter>
    </Blockquote>,
  );

  const quote = screen.getByText('Travel together').closest('blockquote');
  expect(quote).toHaveAttribute('cite', 'https://entur.no');
  const citation = screen.getByText('Entur travel guide');
  expect(citation.tagName).toBe('CITE');
  expect(citation.parentElement?.tagName).toBe('FOOTER');
  expect(quote).toContainElement(citation);
});

test('typography composition has no basic accessibility violations', async () => {
  const { container } = render(
    <article>
      <Heading1>Travel guide</Heading1>
      <Paragraph>Plan your next journey.</Paragraph>
      <Heading2>Tickets</Heading2>
      <UnorderedList>
        <ListItem>Single ticket</ListItem>
      </UnorderedList>
      <NumberedList>
        <ListItem title="Book">Choose your route</ListItem>
      </NumberedList>
      <Paragraph>
        <StrongText>Remember</StrongText> your{' '}
        <EmphasizedText>ticket</EmphasizedText>.{' '}
        <Link href="/tickets">Buy tickets</Link>
      </Paragraph>
      <Label htmlFor="email">Email</Label>
      <input id="email" type="email" />
      <Blockquote>Travel together</Blockquote>
    </article>,
  );

  expect(await axe(container)).toHaveNoViolations();
});
