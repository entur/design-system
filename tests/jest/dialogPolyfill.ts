/**
 * jsdom has no native dialog API, focus restoration or Escape-to-cancel
 * handling. Models only open/close for the enclosing describe block or file;
 * tests dispatch `cancel` explicitly and leave focus to the component.
 */
export function installDialogPolyfill() {
  const descriptors = {
    showModal: Object.getOwnPropertyDescriptor(
      HTMLDialogElement.prototype,
      'showModal',
    ),
    close: Object.getOwnPropertyDescriptor(
      HTMLDialogElement.prototype,
      'close',
    ),
  };

  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = jest.fn(function (
      this: HTMLDialogElement,
    ) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = jest.fn(function (
      this: HTMLDialogElement,
    ) {
      this.removeAttribute('open');
    });
  });

  beforeEach(() => {
    jest.mocked(HTMLDialogElement.prototype.showModal).mockClear();
    jest.mocked(HTMLDialogElement.prototype.close).mockClear();
  });

  afterAll(() => {
    for (const [method, descriptor] of Object.entries(descriptors)) {
      if (descriptor) {
        Object.defineProperty(HTMLDialogElement.prototype, method, descriptor);
      } else {
        Reflect.deleteProperty(HTMLDialogElement.prototype, method);
      }
    }
  });
}
