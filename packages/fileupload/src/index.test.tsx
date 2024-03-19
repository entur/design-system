import React from 'react';
import { FileUpload } from './';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

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

  await act(async () => {
    dispatchEvt(dropzone, 'dragenter', data);
    await flushPromises(ui, container);
  });

  await waitFor(() => expect(onDragEnter).toHaveBeenCalled());
  rerender(
    <FileUpload
      onDrop={() => console.log('test')}
      files={[file]}
      onDelete={onDelete}
      onDragEnter={onDragEnter}
    />,
  );
  const deleteButton = container.querySelector('button');
  deleteButton && fireEvent.click(deleteButton);
  expect(onDelete).toHaveBeenCalled();

  function flushPromises(
    ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
    container: HTMLElement,
  ) {
    return new Promise(resolve =>
      setTimeout(() => {
        render(ui, { container });
        resolve(container);
      }, 0),
    );
  }

  function dispatchEvt(node: any, type: string, data: any) {
    const event = new Event(type, { bubbles: true });
    Object.assign(event, data);
    fireEvent(node, event);
  }

  function mockData(files: File[]) {
    return {
      dataTransfer: {
        files,
        items: files.map((file: File) => ({
          kind: 'file',
          type: file.type,
          getAsFile: () => file,
        })),
        types: ['Files'],
      },
    };
  }
});
