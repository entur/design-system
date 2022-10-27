import React from 'react';
import { render, cleanup } from '@testing-library/react';
import * as components from '.';
import {
  Heading1,
  Label,
  ListItem,
  NumberedList,
  Paragraph,
  UnorderedList,
  Blockquote,
  Heading2,
  LeadParagraph,
} from '.';
import { SmallText } from './SmallText';
import { axe, toHaveNoViolations } from 'jest-axe';
import { StrongText } from './StrongText';
import { EmphasizedText } from './EmphasizedText';
import { Link } from './Link';
expect.extend(toHaveNoViolations);

afterEach(cleanup);

test('renders its children', () => {
  Object.values(components).forEach((Component: React.ElementType) => {
    const { getByText } = render(<Component>Hello world</Component>);
    expect(getByText('Hello world')).toBeTruthy();
    cleanup();
  });
});

test('passes on all props', () => {
  Object.values(components).forEach((Component: React.ElementType) => {
    const { getByLabelText } = render(
      <Component aria-label="one hundred" className="custom-class">
        one hunned
      </Component>,
    );
    const result = getByLabelText('one hundred');
    expect(result.className.includes('custom-class')).toBe(true);
    cleanup();
  });
});

test('Renders some typography components with as-prop', () => {
  const hrefLink = '#testerLink';
  const { getByText, rerender } = render(
    <Heading1 as="a" href={hrefLink}>
      H1
    </Heading1>,
  );
  const h1Tester = getByText('H1');
  expect(h1Tester.nodeName).toBe('A');
  expect(h1Tester).toHaveAttribute('href', hrefLink);
  rerender(
    <SmallText as="a" href={hrefLink}>
      Smalltext
    </SmallText>,
  );

  const smallTextTest = getByText('Smalltext');
  expect(smallTextTest.nodeName).toBe('A');
  expect(smallTextTest).toHaveAttribute('href', hrefLink);

  rerender(
    <Label as="a" href={hrefLink}>
      labelText
    </Label>,
  );

  const labelTest = getByText('labelText');
  expect(labelTest.nodeName).toBe('A');
  expect(labelTest).toHaveAttribute('href', hrefLink);
});

test('Typography elements should not have basic accessibility issues', async () => {
  const { container } = render(
    <>
      <Heading1>Heading1</Heading1>
      <LeadParagraph>Some text for the lead paragraph</LeadParagraph>
      <Heading2>Heading2</Heading2>
      <UnorderedList>
        <ListItem>Item1</ListItem>
        <ListItem>Item2</ListItem>
      </UnorderedList>
      <NumberedList>
        <ListItem title="TitleItem1">NumberItem1</ListItem>
        <ListItem title="TitleItem2">NumberItem2</ListItem>
      </NumberedList>
      <Paragraph>
        Paragraph with <StrongText>strong text</StrongText>
        <EmphasizedText>emphasized text</EmphasizedText> and a
        <Link href="#">link</Link>.
      </Paragraph>
      <label>A label</label>
      <Blockquote>A block quote</Blockquote>
    </>,
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
