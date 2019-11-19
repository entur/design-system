import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Accordion, ExpandablePanel } from '.';

test('renders a group of expandable panels that can be opened and closed', () => {
  const { getByText, queryByTestId } = render(
    <Accordion>
      <ExpandablePanel title="Trains">
        <div data-testid="expanded-trains">Trains go "choo choo"</div>
      </ExpandablePanel>
      <ExpandablePanel title="Boats">
        <div data-testid="expanded-boats">Boats float</div>
      </ExpandablePanel>
      <ExpandablePanel title="Buses">
        <div data-testid="expanded-buses">Buses go "vroom vroom"</div>
      </ExpandablePanel>
    </Accordion>,
  );

  expect(queryByTestId('expanded-trains')).not.toBeInTheDocument();
  expect(queryByTestId('expanded-boats')).not.toBeInTheDocument();
  expect(queryByTestId('expanded-buses')).not.toBeInTheDocument();

  fireEvent.click(getByText('Boats'));

  expect(queryByTestId('expanded-trains')).not.toBeInTheDocument();
  expect(queryByTestId('expanded-boats')).toBeInTheDocument();
  expect(queryByTestId('expanded-buses')).not.toBeInTheDocument();

  fireEvent.click(getByText('Trains'));

  expect(queryByTestId('expanded-trains')).toBeInTheDocument();
  expect(queryByTestId('expanded-boats')).not.toBeInTheDocument();
  expect(queryByTestId('expanded-buses')).not.toBeInTheDocument();

  fireEvent.click(getByText('Trains'));

  expect(queryByTestId('expanded-trains')).not.toBeInTheDocument();
  expect(queryByTestId('expanded-boats')).not.toBeInTheDocument();
  expect(queryByTestId('expanded-buses')).not.toBeInTheDocument();
});

test('works with the defaultOpen option', () => {
  const { getByText, queryByTestId } = render(
    <Accordion>
      <ExpandablePanel title="Trains" defaultOpen>
        <div data-testid="expanded-trains">Trains go "choo choo"</div>
      </ExpandablePanel>
      <ExpandablePanel title="Boats">
        <div data-testid="expanded-boats">Boats float</div>
      </ExpandablePanel>
      <ExpandablePanel title="Buses">
        <div data-testid="expanded-buses">Buses go "vroom vroom"</div>
      </ExpandablePanel>
    </Accordion>,
  );

  expect(queryByTestId('expanded-trains')).toBeInTheDocument();
  expect(queryByTestId('expanded-boats')).not.toBeInTheDocument();
  expect(queryByTestId('expanded-buses')).not.toBeInTheDocument();

  fireEvent.click(getByText('Boats'));

  expect(queryByTestId('expanded-trains')).not.toBeInTheDocument();
  expect(queryByTestId('expanded-boats')).toBeInTheDocument();
  expect(queryByTestId('expanded-buses')).not.toBeInTheDocument();
});
