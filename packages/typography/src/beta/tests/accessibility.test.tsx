import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Blockquote,
  BlockquoteFooter,
  Heading,
  Link,
  ListItem,
  NumberedList,
  Text,
  UnorderedList,
} from '..';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  test('Heading components should not have basic accessibility issues', async () => {
    const { container } = render(
      <>
        <Heading as="h1">Main heading</Heading>
        <Heading as="h2">Sub heading</Heading>
        <Heading as="h3" variant="subtitle-1">
          Subtitle
        </Heading>
      </>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Text components should not have basic accessibility issues', async () => {
    const { container } = render(
      <>
        <Text variant="paragraph">Regular paragraph text</Text>
        <Text variant="leading">Leading text</Text>
        <Text variant="caption">Caption text</Text>
      </>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Link components should not have basic accessibility issues', async () => {
    const { container } = render(
      <>
        <Link href="/internal">Internal link</Link>
        <Link href="/external" external>
          External link
        </Link>
      </>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Blockquote components should not have basic accessibility issues', async () => {
    const { container } = render(
      <Blockquote>
        Quote text
        <BlockquoteFooter>Author name</BlockquoteFooter>
      </Blockquote>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Complex typography composition should not have basic accessibility issues', async () => {
    const { container } = render(
      <article>
        <Heading as="h1" variant="title-1">
          Article Title
        </Heading>
        <Text variant="leading" spacing="md">
          This is a leading paragraph that introduces the article.
        </Text>
        <Heading as="h2" variant="title-2">
          Section Heading
        </Heading>
        <Text variant="paragraph" spacing="sm">
          This is a regular paragraph with some{' '}
          <Link href="/reference" external>
            external reference
          </Link>{' '}
          and{' '}
          <Text variant="emphasized" as="em">
            emphasized text
          </Text>
          .
        </Text>
        <Text variant="label">
          Destination
          <input />
        </Text>
        <NumberedList>
          <ListItem title="Book">Choose a route</ListItem>
        </NumberedList>
        <UnorderedList>
          <ListItem>Bring your ticket</ListItem>
        </UnorderedList>
        <Blockquote>
          <Text>This is an important quote</Text>
          <BlockquoteFooter>
            <cite>Travel guide</cite>
          </BlockquoteFooter>
        </Blockquote>
      </article>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
