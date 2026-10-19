import { cleanup, render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Heading } from '../components/Heading';
import { Text } from '../components/Text';
import { Link } from '../components/Link';

expect.extend(toHaveNoViolations);

afterEach(cleanup);

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

  test('A quote with its source should not have basic accessibility issues', async () => {
    const { container } = render(
      <figure>
        <Text variant="quote">Quote text</Text>
        <figcaption>
          <Text variant="caption">Author name</Text>
        </figcaption>
      </figure>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Complex typography composition should not have basic accessibility issues', async () => {
    const { container } = render(
      <div>
        <Heading as="h1" variant="title-1">
          Article Title
        </Heading>
        <Text variant="leading" spacing="m">
          This is a leading paragraph that introduces the article.
        </Text>
        <Heading as="h2" variant="title-2">
          Section Heading
        </Heading>
        <Text variant="paragraph" spacing="s">
          This is a regular paragraph with some{' '}
          <Link href="/reference" external>
            external reference
          </Link>{' '}
          and{' '}
          <Text variant="emphasized" as="span">
            emphasized text
          </Text>
          .
        </Text>
        <figure>
          <Text variant="quote">This is an important quote</Text>
          <figcaption>
            <Text variant="caption">Famous Author</Text>
          </figcaption>
        </figure>
      </div>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
