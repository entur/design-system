import {
  Accept,
  DropEvent,
  DropzoneOptions,
  ErrorCode,
  FileError,
  FileRejection,
  useDropzone,
} from 'react-dropzone';
import React from 'react';
import _attrAccept from 'attr-accept';
import classNames from 'classnames';

import { VisuallyHidden } from '@entur/a11y';
import { DeleteIcon, FileIcon } from '@entur/icons';
import { IconButton } from '@entur/button';
import { Label } from '@entur/typography';

import './FileUpload.scss';

// CJS/ESM interop, same as react-dropzone does internally
const attrAccept: (file: File, accept: string | string[]) => boolean =
  typeof _attrAccept === 'function'
    ? _attrAccept
    : (_attrAccept as { default: typeof _attrAccept }).default;

type FileUploadProps = Omit<DropzoneOptions, 'accept'> & {
  /** Tekst som vises ved fullført opplasting
   * @default "Opplasting fullført"
   */
  successText?: string;
  /** Tekst som vises om opplasting feilet
   * @default "Feil ved opplasting av fil"
   */
  errorText?: string;
  /** Tekst som vises før man laster opp noe
   * @default "Dra fil eller klikk for å laste opp"
   */
  standbyText?: string;
  /** Boolean for hvis opplastingen feiler.
   * @default false
   */
  errorUpload?: boolean;
  /** Callback for når en fil legges til */
  onDrop?<T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ): void;
  /** Callback for når en fil slettes fra lista */
  onDelete?: (file: File) => void;
  /** Hvilke filtyper som skal aksepteres, som MIME-typer og/eller filendelser.
   * F.eks. `".csv"`, `['.json', 'application/json']` eller `{ 'application/json': ['.json'] }`
   */
  accept?: string | string[] | Accept;
  /** Filene som er aktive i komponenten */
  files: File[];
  /** Beskrivende tekst som forklarer feltet */
  label?: string;
  /** Mulighet for å laste opp flere filer */
  multiple?: boolean;
  /**Minste filstørrelse */
  minSize?: number;
  /**Største filstørrelse */
  maxSize?: number;
  /**Tekst som leses opp av skjermleser på søppelbøtte-ikonet
   * @default "Fjern fil"
   */
  removeFileButtonDescription?: string;
  [key: string]: any;
};

export const FileUpload = ({
  standbyText = 'Dra fil eller klikk for å laste opp',
  errorText = 'Feil ved opplasting av fil',
  successText = 'Opplasting fullført',
  errorUpload = false,
  onDrop,
  onDelete = file => console.log(file),
  accept = '',
  files = [],
  label,
  removeFileButtonDescription = 'Fjern fil',
  style,
  validator,
  ...rest
}: FileUploadProps) => {
  // Validate file type ourselves: react-dropzone's own `accept` warns on extension-only values
  const acceptList = toAcceptList(accept);
  const validateFile = (file: File): FileError | FileError[] | null => {
    const errors: FileError[] = [];
    if (
      file.type !== 'application/x-moz-file' &&
      !attrAccept(file, acceptList)
    ) {
      errors.push(getInvalidTypeError(accept, acceptList));
    }
    const custom = validator?.(file);
    if (custom) errors.push(...(Array.isArray(custom) ? custom : [custom]));
    return errors.length > 0 ? errors : null;
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      validator: validateFile,
      ...rest,
    });

  const success = files.length > 0;

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  // Index of the file whose focused remove button was pressed
  const deletedWithFocus = React.useRef<number | null>(null);
  const previousFileCount = React.useRef(files.length);
  const [uploadAnnouncement, setUploadAnnouncement] = React.useState('');

  React.useEffect(() => {
    if (files.length > previousFileCount.current) {
      // The file names change the text, so every upload is announced
      const added = files.slice(previousFileCount.current);
      setUploadAnnouncement(
        `${successText}: ${added.map(file => file.name).join(', ')}`,
      );
    } else if (files.length === 0) {
      setUploadAnnouncement('');
    }
    previousFileCount.current = files.length;

    const deletedIndex = deletedWithFocus.current;
    if (deletedIndex === null) return;
    deletedWithFocus.current = null;
    // Only recovers focus the unmounted remove button dropped on body
    if (document.activeElement !== document.body) return;
    // The next file's remove button, or the upload trigger when no files are left
    const removeButtons = wrapperRef.current?.querySelectorAll<HTMLElement>(
      '.eds-file-upload__file-list button',
    );
    const nextButton =
      removeButtons?.[Math.min(deletedIndex, removeButtons.length - 1)];
    (
      nextButton ??
      wrapperRef.current?.querySelector<HTMLElement>('.eds-file-upload__input')
    )?.focus();
  }, [files, successText]);

  return (
    <div className="eds-file-upload__wrapper" style={style} ref={wrapperRef}>
      <div
        className="eds-file-upload__input"
        {...getRootProps({ role: 'button' })}
      >
        {label && <Label style={{ display: 'flex' }}>{label}</Label>}
        {/* Users reach the upload through role="button"; the input is only clicked from code */}
        <input
          {...getInputProps({ accept: acceptList.join(',') })}
          aria-hidden="true"
        />
        <span
          className={classNames(
            'eds-file-upload__dropzone',
            {
              'eds-file-upload__dropzone--success': success,
            },
            { 'eds-file-upload__dropzone--active': isDragActive },
            // react-dropzone 14 keeps isDragReject after drop; only show it while dragging
            {
              'eds-file-upload__dropzone--reject': isDragActive && isDragReject,
            },
            { 'eds-file-upload__dropzone--error': errorUpload },
          )}
        >
          {success ? successText : errorUpload ? errorText : standbyText}
        </span>
      </div>
      {/* Live regions sit outside role="button", whose children are presentational */}
      <VisuallyHidden role="status">{uploadAnnouncement}</VisuallyHidden>
      <VisuallyHidden role="alert">
        {errorUpload && !success ? errorText : ''}
      </VisuallyHidden>
      <div className="eds-file-upload__file-list">
        {files.map((file, index) => (
          <div className="eds-file-upload__file-name" key={index}>
            <FileIcon
              aria-hidden="true"
              className="eds-file-upload__file-name-icon"
            />
            <span className="eds-field-upload__file-name-path">
              {file.name} - {convertSizeToHuman(file.size)}{' '}
            </span>
            <IconButton
              onClick={event => {
                deletedWithFocus.current =
                  event.currentTarget === document.activeElement ? index : null;
                onDelete(file);
              }}
              type="button"
              aria-label={`${removeFileButtonDescription}, ${file.name}`}
            >
              <DeleteIcon aria-hidden="true" />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

function toAcceptList(accept: FileUploadProps['accept']): string[] {
  if (!accept) return [];
  if (typeof accept === 'string') return accept.split(',');
  if (Array.isArray(accept)) return accept;
  return Object.entries(accept).flatMap(([mimeType, exts]) => [
    mimeType,
    ...exts,
  ]);
}

// Same code and message as react-dropzone 11
function getInvalidTypeError(
  accept: FileUploadProps['accept'],
  acceptList: string[],
): FileError {
  let suffix = `one of ${acceptList.join(', ')}`;
  if (typeof accept === 'string') suffix = accept;
  else if (acceptList.length === 1) suffix = acceptList[0];
  return {
    code: ErrorCode.FileInvalidType,
    message: `File type must be ${suffix}`,
  };
}

function convertSizeToHuman(size: number) {
  if (size < 1000) {
    return size + 'bytes;';
  } else if (size < 1000000) {
    return `${size / 1000}  KB`;
  } else {
    return `${(size / 1000000).toPrecision(4)} MB`;
  }
}
