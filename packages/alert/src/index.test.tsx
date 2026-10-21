import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BannerAlertBox, SmallAlertBox, ToastAlertBox } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('labels the banner variant and displays its title and content', () => {
  render(
    <BannerAlertBox variant="warning" title="A title">
      Some content
    </BannerAlertBox>,
  );
  expect(
    screen.getByRole('img', { name: 'Varselmelding' }),
  ).toBeInTheDocument();
  expect(screen.getByText('A title')).toBeInTheDocument();
  expect(screen.getByText('Some content')).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('announces the toast title and content as a status', () => {
  render(
    <ToastAlertBox variant="success" title="A title">
      Some content
    </ToastAlertBox>,
  );
  const toast = screen.getByRole('status');
  expect(toast).toHaveTextContent('A title');
  expect(toast).toHaveTextContent('Some content');
  expect(
    within(toast).getByRole('img', { name: 'Suksessmelding' }),
  ).toBeInTheDocument();
  expect(within(toast).queryByRole('button')).not.toBeInTheDocument();
});

test('labels the small alert variant and displays its content', () => {
  render(<SmallAlertBox variant="negative">Some content</SmallAlertBox>);
  expect(screen.getByRole('img', { name: 'Feilmelding' })).toBeInTheDocument();
  expect(screen.getByText('Some content')).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test.each([BannerAlertBox, SmallAlertBox, ToastAlertBox])(
  '%p dismisses the entire alert and calls onClose once',
  async AlertBox => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <AlertBox
        variant="success"
        title="A title"
        onClose={onClose}
        closable
        closeButtonLabel="Click to close"
      >
        Everything went well
      </AlertBox>,
    );

    await user.click(screen.getByRole('button', { name: 'Click to close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('A title')).not.toBeInTheDocument();
    expect(screen.queryByText('Everything went well')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Click to close' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  },
);

describe.each([
  ['BannerAlertBox', BannerAlertBox, 'banner'],
  ['SmallAlertBox', SmallAlertBox, 'small'],
  ['ToastAlertBox', ToastAlertBox, 'toast'],
] as const)('%s', (name, AlertBox, size) => {
  const getAlertBox = () =>
    screen.getByRole('img', { name: 'Infomelding' }).parentElement!;

  describeComponentContract(name, {
    render: props => (
      <AlertBox variant="information" {...props}>
        Some content
      </AlertBox>
    ),
    getElement: getAlertBox,
    baseClassName: 'eds-alert-box',
  });

  test('applies size and variant modifier classes', () => {
    render(<AlertBox variant="information">Some content</AlertBox>);
    expect(getAlertBox()).toHaveClass(
      `eds-alert-box--${size}`,
      'eds-alert-box--information',
    );
  });
});

test('SmallAlertBox only applies the fit-content modifier for width="fit-content"', () => {
  const { rerender } = render(
    <SmallAlertBox variant="information" width="fit-content">
      Some content
    </SmallAlertBox>,
  );
  const alertBox = screen.getByRole('img', { name: 'Infomelding' })
    .parentElement!;
  expect(alertBox).toHaveClass('eds-alert-box--fit-content');
  rerender(
    <SmallAlertBox variant="information" width="fluid">
      Some content
    </SmallAlertBox>,
  );
  expect(alertBox).not.toHaveClass('eds-alert-box--fit-content');
});
