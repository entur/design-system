import { fireEvent, render, screen } from '@testing-library/react';
import { useWindowDimensions } from '.';

function Viewport() {
  const { width, height } = useWindowDimensions();
  return <output aria-label="Viewport">{`${width} × ${height}`}</output>;
}

test('updates rendered dimensions on resize and unsubscribes on unmount', () => {
  const width = Object.getOwnPropertyDescriptor(window, 'innerWidth');
  const height = Object.getOwnPropertyDescriptor(window, 'innerHeight');
  const addListener = jest.spyOn(window, 'addEventListener');
  const removeListener = jest.spyOn(window, 'removeEventListener');
  const { unmount } = render(<Viewport />);
  try {
    expect(screen.getByLabelText('Viewport')).toHaveTextContent(
      `${window.innerWidth} × ${window.innerHeight}`,
    );
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 480,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    });
    // userEvent has no API for resizing the window.
    fireEvent.resize(window);
    expect(screen.getByLabelText('Viewport')).toHaveTextContent('480 × 800');

    const subscription = addListener.mock.calls.find(
      ([event]) => event === 'resize',
    );
    expect(subscription).toBeDefined();
    unmount();
    expect(removeListener).toHaveBeenCalledWith('resize', subscription?.[1]);
  } finally {
    unmount();
    if (width) Object.defineProperty(window, 'innerWidth', width);
    if (height) Object.defineProperty(window, 'innerHeight', height);
    jest.restoreAllMocks();
  }
});
