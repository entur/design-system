import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Accordion, AccordionItem } from '.';

// This sucks, but there is some black magic in react-collapse that doesn't play well with jest tests. Please try fixing this
jest.mock('react-collapse', () => ({
  UnmountClosed: ({ children, isOpened }: any) => (isOpened ? children : null),
}));

test('renders a single accordion item', async () => {
  const { getByTestId, queryByText } = render(
    <Accordion>
      <AccordionItem title="Trains" data-testid="trains-button">
        Trains go "choo choo"
      </AccordionItem>
    </Accordion>,
  );

  expect(queryByText('Trains go "choo choo"')).not.toBeInTheDocument();

  fireEvent.click(getByTestId('trains-button'));

  expect(queryByText('Trains go "choo choo"')).toBeInTheDocument();

  fireEvent.click(getByTestId('trains-button'));

  expect(queryByText('Trains go "choo choo"')).not.toBeInTheDocument();
});

test('renders a group of accordion items that can be opened and closed', () => {
  const { getByTestId, queryByText } = render(
    <Accordion>
      <AccordionItem title="Trains" data-testid="trains-button">
        Trains go "choo choo"
      </AccordionItem>
      <AccordionItem title="Boats" data-testid="boats-button">
        Boats float
      </AccordionItem>
      <AccordionItem title="Buses" data-testid="buses-button">
        Buses go "vroom vroom"
      </AccordionItem>
    </Accordion>,
  );

  expect(queryByText('Trains go "choo choo"')).not.toBeInTheDocument();
  expect(queryByText('Boats float')).not.toBeInTheDocument();
  expect(queryByText('Buses go "vroom vroom"')).not.toBeInTheDocument();

  fireEvent.click(getByTestId('boats-button'));

  expect(queryByText('Trains go "choo choo"')).not.toBeInTheDocument();
  expect(queryByText('Boats float')).toBeInTheDocument();
  expect(queryByText('Buses go "vroom vroom"')).not.toBeInTheDocument();

  fireEvent.click(getByTestId('trains-button'));

  expect(queryByText('Trains go "choo choo"')).toBeInTheDocument();
  expect(queryByText('Boats float')).not.toBeInTheDocument();
  expect(queryByText('Buses go "vroom vroom"')).not.toBeInTheDocument();

  fireEvent.click(getByTestId('trains-button'));

  expect(queryByText('Trains go "choo choo"')).not.toBeInTheDocument();
  expect(queryByText('Boats float')).not.toBeInTheDocument();
  expect(queryByText('Buses go "vroom vroom"')).not.toBeInTheDocument();
});

test('works with the defaultOpen option', async () => {
  const { getByTestId, queryByText } = render(
    <Accordion>
      <AccordionItem title="Trains" defaultOpen data-testid="trains-button">
        Trains go "choo choo"
      </AccordionItem>
      <AccordionItem title="Boats" data-testid="boats-button">
        Boats float
      </AccordionItem>
      <AccordionItem title="Buses" data-testid="buses-button">
        Buses go "vroom vroom"
      </AccordionItem>
    </Accordion>,
  );

  expect(queryByText('Trains go "choo choo"')).toBeInTheDocument();
  expect(queryByText('Boats float')).not.toBeInTheDocument();
  expect(queryByText('Buses go "vroom vroom"')).not.toBeInTheDocument();

  fireEvent.click(getByTestId('boats-button'));

  expect(queryByText('Trains go "choo choo"')).not.toBeInTheDocument();
  expect(queryByText('Boats float')).toBeInTheDocument();
  expect(queryByText('Buses go "vroom vroom"')).not.toBeInTheDocument();
});
