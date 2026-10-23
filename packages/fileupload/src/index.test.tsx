import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from './';

const standbyText = 'Dra fil eller klikk for å laste opp';

function getFileInput() {
  // File inputs have no implicit role; this hidden input is the browser selection boundary.
  const input = screen
    .getByRole('button', { name: new RegExp(standbyText) })
    .querySelector('input[type="file"]');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error('Expected a file input');
  }
  return input;
}

// userEvent has no drag-and-drop API, so drop tests dispatch these
// DataTransfer payloads with fireEvent.
function transferFiles(files: File[]) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
}

function ControlledUpload() {
  const [files, setFiles] = React.useState<File[]>([]);
  return (
    <FileUpload
      files={files}
      onDrop={accepted => setFiles(current => [...current, ...accepted])}
      onDelete={deleted =>
        setFiles(current => current.filter(file => file !== deleted))
      }
    />
  );
}

describe('FileUpload', () => {
  test('selects real files and lets the consumer control the displayed list', async () => {
    const user = userEvent.setup();
    const file = new File(['journey'], 'journey.txt', { type: 'text/plain' });
    const onDrop = jest.fn();
    const { rerender } = render(<FileUpload files={[]} onDrop={onDrop} />);

    await user.upload(getFileInput(), file);

    await waitFor(() =>
      expect(onDrop).toHaveBeenCalledWith([file], [], expect.anything()),
    );
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/journey\.txt/)).not.toBeInTheDocument();
    expect(screen.getByText(standbyText)).toBeVisible();

    rerender(<FileUpload files={[file]} onDrop={onDrop} />);
    expect(screen.getByText(/journey\.txt/)).toBeVisible();
    expect(screen.getByText('Opplasting fullført')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Fjern fil, journey.txt' }),
    ).toBeVisible();
  });

  test('selects multiple accepted files in order', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['one'], 'one.txt', { type: 'text/plain' }),
      new File(['two'], 'two.txt', { type: 'text/plain' }),
    ];
    const onDrop = jest.fn();
    render(
      <FileUpload files={[]} multiple accept="text/plain" onDrop={onDrop} />,
    );

    await user.upload(getFileInput(), files);

    await waitFor(() =>
      expect(onDrop).toHaveBeenCalledWith(files, [], expect.anything()),
    );
    expect(onDrop).toHaveBeenCalledTimes(1);
  });

  test('requests file selection when the upload trigger is clicked', async () => {
    const user = userEvent.setup();
    const onFileDialogOpen = jest.fn();
    const onDrop = jest.fn();
    render(
      <FileUpload
        files={[]}
        onFileDialogOpen={onFileDialogOpen}
        onDrop={onDrop}
      />,
    );

    await user.click(screen.getByRole('button', { name: standbyText }));

    expect(onFileDialogOpen).toHaveBeenCalledTimes(1);
    expect(onDrop).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: standbyText })).toHaveFocus();
  });

  test('ignores selection requests and drops while disabled and skips keyboard focus', async () => {
    const user = userEvent.setup();
    const onFileDialogOpen = jest.fn();
    const onDrop = jest.fn();
    render(
      <>
        <FileUpload
          files={[]}
          disabled
          onDrop={onDrop}
          onFileDialogOpen={onFileDialogOpen}
        />
        <button type="button">Neste felt</button>
      </>,
    );
    const trigger = screen.getByRole('button', { name: standbyText });

    await user.tab();
    expect(screen.getByRole('button', { name: 'Neste felt' })).toHaveFocus();
    await user.click(trigger);
    await user.upload(getFileInput(), new File(['route'], 'route.txt'));
    fireEvent.drop(trigger, transferFiles([new File(['route'], 'route.txt')]));

    expect(onFileDialogOpen).not.toHaveBeenCalled();
    expect(onDrop).not.toHaveBeenCalled();
    expect(screen.queryByText(/route\.txt/)).not.toBeInTheDocument();
  });

  test('rejects an invalid selection even when the picker accept filter is bypassed', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const file = new File(['image'], 'map.png', { type: 'image/png' });
    const onDrop = jest.fn();
    const onDropRejected = jest.fn();
    render(
      <FileUpload
        files={[]}
        accept="text/plain"
        onDrop={onDrop}
        onDropRejected={onDropRejected}
      />,
    );

    await user.upload(getFileInput(), file);

    const rejections = [
      {
        file,
        errors: [expect.objectContaining({ code: 'file-invalid-type' })],
      },
    ];
    await waitFor(() =>
      expect(onDrop).toHaveBeenCalledWith([], rejections, expect.anything()),
    );
    expect(onDropRejected).toHaveBeenCalledWith(rejections, expect.anything());
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/map\.png/)).not.toBeInTheDocument();
  });

  test('accepts a drop after drag enter/leave without uploading during hover', async () => {
    const file = new File(['route'], 'route.txt', { type: 'text/plain' });
    const onDrop = jest.fn();
    const onDragEnter = jest.fn();
    const onDragLeave = jest.fn();
    const onDropAccepted = jest.fn();
    render(
      <FileUpload
        files={[]}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDropAccepted={onDropAccepted}
      />,
    );
    const dropzone = screen.getByRole('button', { name: standbyText });
    const data = transferFiles([file]);

    fireEvent.dragEnter(dropzone, data);
    await waitFor(() => expect(onDragEnter).toHaveBeenCalledTimes(1));
    expect(onDragEnter).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'dragenter' }),
    );
    fireEvent.dragLeave(dropzone, data);
    expect(onDragLeave).toHaveBeenCalledTimes(1);
    expect(onDragLeave).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'dragleave' }),
    );
    expect(onDrop).not.toHaveBeenCalled();

    fireEvent.drop(dropzone, data);
    await waitFor(() =>
      expect(onDrop).toHaveBeenCalledWith(
        [file],
        [],
        expect.objectContaining({ type: 'drop' }),
      ),
    );
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDropAccepted).toHaveBeenCalledWith([file], expect.anything());
  });

  test('separates valid files from invalid files in a mixed drop', async () => {
    const accepted = new File(['route'], 'route.txt', { type: 'text/plain' });
    const rejected = new File(['image'], 'route.png', { type: 'image/png' });
    const onDrop = jest.fn();
    render(
      <FileUpload
        files={[]}
        accept={['text/plain']}
        multiple
        onDrop={onDrop}
      />,
    );

    fireEvent.drop(
      screen.getByRole('button', { name: standbyText }),
      transferFiles([accepted, rejected]),
    );

    await waitFor(() =>
      expect(onDrop).toHaveBeenCalledWith(
        [accepted],
        [
          {
            file: rejected,
            errors: [expect.objectContaining({ code: 'file-invalid-type' })],
          },
        ],
        expect.anything(),
      ),
    );
    expect(onDrop).toHaveBeenCalledTimes(1);
  });

  test('rejects all dropped files when multiple is false', async () => {
    const files = [new File(['one'], 'one.txt'), new File(['two'], 'two.txt')];
    const onDrop = jest.fn();
    render(<FileUpload files={[]} multiple={false} onDrop={onDrop} />);

    fireEvent.drop(
      screen.getByRole('button', { name: standbyText }),
      transferFiles(files),
    );

    await waitFor(() =>
      expect(onDrop).toHaveBeenCalledWith(
        [],
        files.map(file => ({
          file,
          errors: [expect.objectContaining({ code: 'too-many-files' })],
        })),
        expect.anything(),
      ),
    );
    expect(onDrop).toHaveBeenCalledTimes(1);
  });

  test('accepts size boundaries and rejects files outside minSize and maxSize', async () => {
    const user = userEvent.setup();
    const tooSmall = new File(['a'], 'small.txt');
    const minimum = new File(['ab'], 'minimum.txt');
    const maximum = new File(['abcd'], 'maximum.txt');
    const tooLarge = new File(['abcde'], 'large.txt');
    const onDrop = jest.fn();
    render(
      <FileUpload
        files={[]}
        minSize={2}
        maxSize={4}
        multiple
        onDrop={onDrop}
      />,
    );

    await user.upload(getFileInput(), [tooSmall, minimum, maximum, tooLarge]);

    await waitFor(() =>
      expect(onDrop).toHaveBeenCalledWith(
        [minimum, maximum],
        [
          {
            file: tooSmall,
            errors: [expect.objectContaining({ code: 'file-too-small' })],
          },
          {
            file: tooLarge,
            errors: [expect.objectContaining({ code: 'file-too-large' })],
          },
        ],
        expect.anything(),
      ),
    );
  });

  test('removes the requested file only after the consumer updates files', async () => {
    const user = userEvent.setup();
    const first = new File(['first'], 'first.txt');
    const second = new File(['second'], 'second.txt');
    const onDelete = jest.fn();
    const onDrop = jest.fn();
    const { rerender } = render(
      <FileUpload
        files={[first, second]}
        onDelete={onDelete}
        onDrop={onDrop}
        removeFileButtonDescription="Slett vedlegg"
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Slett vedlegg, second.txt' }),
    );

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(second);
    expect(onDrop).not.toHaveBeenCalled();
    expect(screen.getByText(/second\.txt/)).toBeVisible();
    rerender(<FileUpload files={[first]} onDelete={onDelete} />);
    expect(screen.queryByText(/second\.txt/)).not.toBeInTheDocument();
    expect(screen.getByText(/first\.txt/)).toBeVisible();
  });

  test.each(['{Enter}', ' '])(
    'supports keyboard removal with %s without submitting a surrounding form',
    async key => {
      const user = userEvent.setup();
      const file = new File(['route'], 'route.txt');
      const onDelete = jest.fn();
      const onSubmit = jest.fn(event => event.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <FileUpload files={[file]} onDelete={onDelete} />
        </form>,
      );

      await user.tab();
      expect(
        screen.getByRole('button', { name: 'Opplasting fullført' }),
      ).toHaveFocus();
      await user.tab();
      const remove = screen.getByRole('button', {
        name: 'Fjern fil, route.txt',
      });
      expect(remove).toHaveFocus();
      await user.keyboard(key);

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith(file);
      expect(onSubmit).not.toHaveBeenCalled();
      expect(remove).toHaveFocus();
    },
  );

  test('returns to standby after the last selected file is removed', async () => {
    const user = userEvent.setup();
    const file = new File(['route'], 'route.txt');
    render(<ControlledUpload />);

    await user.upload(getFileInput(), file);
    await user.click(
      await screen.findByRole('button', { name: 'Fjern fil, route.txt' }),
    );

    expect(screen.queryByText(/route\.txt/)).not.toBeInTheDocument();
    expect(screen.queryByText('Opplasting fullført')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: standbyText })).toBeVisible();
  });

  test('displays custom standby, error, and success feedback with the label', () => {
    const props = {
      label: 'Vedlegg',
      standbyText: 'Velg vedlegg',
      errorText: 'Kunne ikke laste opp',
      successText: 'Vedlegg lastet opp',
    };
    const { rerender } = render(<FileUpload {...props} files={[]} />);
    expect(
      screen.getByRole('button', { name: 'Vedlegg Velg vedlegg' }),
    ).toBeVisible();

    rerender(<FileUpload {...props} files={[]} errorUpload />);
    expect(
      screen.getByRole('button', { name: 'Vedlegg Kunne ikke laste opp' }),
    ).toBeVisible();
    expect(screen.queryByText('Velg vedlegg')).not.toBeInTheDocument();

    rerender(
      <FileUpload {...props} files={[new File(['route'], 'route.txt')]} />,
    );
    expect(
      screen.getByRole('button', { name: 'Vedlegg Vedlegg lastet opp' }),
    ).toBeVisible();
    expect(screen.queryByText('Kunne ikke laste opp')).not.toBeInTheDocument();
  });

  test.each([
    { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 0 },
    { key: ' ', code: 'Space', keyCode: 32, charCode: 0 },
  ])(
    'requests file selection with $code from the keyboard',
    async keyboardEvent => {
      const user = userEvent.setup();
      const onFileDialogOpen = jest.fn();
      render(<FileUpload files={[]} onFileDialogOpen={onFileDialogOpen} />);
      await user.tab();
      const trigger = screen.getByRole('button', { name: standbyText });
      expect(trigger).toHaveFocus();

      // Supply browser keyCode at the platform boundary: react-dropzone 11
      // requires it, but userEvent does not populate it.
      fireEvent.keyDown(trigger, keyboardEvent);

      expect(onFileDialogOpen).toHaveBeenCalledTimes(1);
    },
  );

  test('upload state selects its dropzone modifier classes', () => {
    const { rerender } = render(<FileUpload files={[]} />);
    const status = screen.getByText(standbyText);
    expect(status).toHaveClass('eds-file-upload__dropzone');
    expect(status).not.toHaveClass(
      'eds-file-upload__dropzone--success',
      'eds-file-upload__dropzone--error',
    );

    rerender(<FileUpload files={[]} errorUpload />);
    expect(screen.getByText('Feil ved opplasting av fil')).toHaveClass(
      'eds-file-upload__dropzone--error',
    );

    rerender(<FileUpload files={[new File(['route'], 'route.txt')]} />);
    expect(screen.getByText('Opplasting fullført')).toHaveClass(
      'eds-file-upload__dropzone--success',
    );
  });

  // Bug: FileUpload spreads style as attributes on its wrapper instead of passing it as style.
  test.failing('forwards style to its wrapper', () => {
    render(<FileUpload files={[]} style={{ marginTop: '7px' }} />);

    expect(
      screen.getByRole('button', { name: standbyText }).parentElement,
    ).toHaveStyle({ marginTop: '7px' });
  });

  // Bug: successText changes in a plain span without a live region.
  test.failing(
    'announces successful selection through a live status',
    async () => {
      const user = userEvent.setup();
      render(<ControlledUpload />);

      await user.upload(getFileInput(), new File(['route'], 'route.txt'));

      expect(await screen.findByRole('status')).toHaveTextContent(
        'Opplasting fullført',
      );
    },
  );

  // Bug: errorUpload updates a plain span, so errors are not announced.
  test.failing('announces upload errors to assistive technology', () => {
    const { rerender } = render(<FileUpload files={[]} />);

    rerender(<FileUpload files={[]} errorUpload />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Feil ved opplasting av fil',
    );
  });

  // Bug: unmounting the focused remove button leaves focus on document.body.
  test.failing(
    'restores focus to the upload trigger after removing the last file',
    async () => {
      const user = userEvent.setup();
      render(<ControlledUpload />);
      await user.upload(getFileInput(), new File(['route'], 'route.txt'));
      await screen.findByRole('button', { name: 'Fjern fil, route.txt' });
      await user.tab();
      expect(
        screen.getByRole('button', { name: 'Fjern fil, route.txt' }),
      ).toHaveFocus();

      await user.keyboard('{Enter}');

      expect(screen.getByRole('button', { name: standbyText })).toHaveFocus();
    },
  );
});
