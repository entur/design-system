import React from 'react';
import { FileUpload } from './';
import { fireEvent, render } from '@testing-library/react';

test('invoke onDragEnter when dragenter event occurs', async () => {
  const file = new File([JSON.stringify({ ping: true })], 'ping.json', {
    type: 'application/json',
  });
  const data = mockData([file]);
  const onDragEnter = jest.fn();
  const onDelete = jest.fn();

  const ui = (
    <FileUpload
      onDrop={() => console.log('test')}
      files={[]}
      onDelete={onDelete}
      onDragEnter={onDragEnter}
    ></FileUpload>
  );
  const { container, rerender } = render(ui);
  const dropzone = container.querySelector('.eds-file-upload__input');

  dispatchEvt(dropzone, 'dragenter', data);
  await flushPromises(ui, container);

  expect(onDragEnter).toHaveBeenCalled();
  rerender(
    <FileUpload
      onDrop={() => console.log('test')}
      files={[file]}
      onDelete={onDelete}
      onDragEnter={onDragEnter}
    />,
  );
  const deleteButton = container.querySelector('button');
  fireEvent.click(deleteButton!);
  expect(onDelete).toHaveBeenCalled();
  //@ts-ignore
  function flushPromises(ui, container) {
    return new Promise(resolve =>
      setImmediate(() => {
        render(ui, { container });
        resolve(container);
      }),
    );
  }

  //@ts-ignore
  function dispatchEvt(node, type, data) {
    const event = new Event(type, { bubbles: true });
    Object.assign(event, data);
    fireEvent(node, event);
  }

  //@ts-ignore
  function mockData(files) {
    return {
      dataTransfer: {
        files,
        //@ts-ignore
        items: files.map(file => ({
          kind: 'file',
          type: file.type,
          getAsFile: () => file,
        })),
        types: ['Files'],
      },
    };
  }
});
