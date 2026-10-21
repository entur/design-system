import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { Heading } from '../components/Heading';
import { Link } from '../components/Link';
import { ListItem } from '../components/ListItem';
import { NumberedList } from '../components/NumberedList';
import { Text } from '../components/Text';
import { UnorderedList } from '../components/UnorderedList';

afterEach(cleanup);

describe('ref forwarding', () => {
  test('forwards refs to the rendered element', () => {
    const heading = React.createRef<HTMLHeadingElement>();
    const text = React.createRef<HTMLParagraphElement>();
    const link = React.createRef<HTMLAnchorElement>();
    const ul = React.createRef<HTMLUListElement>();
    const ol = React.createRef<HTMLOListElement>();
    const li = React.createRef<HTMLLIElement>();
    render(
      <>
        <Heading as="h2" ref={heading}>
          Tittel
        </Heading>
        <Text ref={text}>Tekst</Text>
        <Link href="/" ref={link}>
          Lenke
        </Link>
        <UnorderedList ref={ul}>
          <ListItem ref={li}>En</ListItem>
        </UnorderedList>
        <NumberedList ref={ol}>
          <ListItem>To</ListItem>
        </NumberedList>
      </>,
    );
    expect(heading.current?.tagName).toBe('H2');
    expect(text.current?.tagName).toBe('P');
    expect(link.current?.tagName).toBe('A');
    expect(ul.current?.tagName).toBe('UL');
    expect(ol.current?.tagName).toBe('OL');
    expect(li.current?.tagName).toBe('LI');
  });
});
