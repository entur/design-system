import {
  DropEvent,
  DropzoneOptions,
  ErrorCode,
  FileError,
  FileRejection,
  useDropzone,
} from 'react-dropzone';
import _attrAccept from 'attr-accept';
import classNames from 'classnames';

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
  /** Hvilken filtyper som skal aksepteres */
  accept?: string | string[];
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

  return (
    <div className="eds-file-upload__wrapper" {...style}>
      <div
        className="eds-file-upload__input"
        {...getRootProps({ role: 'button' })}
      >
        {label && <Label style={{ display: 'flex' }}>{label}</Label>}
        <input {...getInputProps({ accept: acceptList.join(',') })} />
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
      <div className="eds-file-upload__file-list">
        {files.map((file, index) => (
          <div className="eds-file-upload__file-name" key={index}>
            <FileIcon
              aria-label="File icon"
              className="eds-file-upload__file-name-icon"
            />
            <span className="eds-field-upload__file-name-path">
              {file.name} - {convertSizeToHuman(file.size)}{' '}
            </span>
            <IconButton
              onClick={() => onDelete(file)}
              type="button"
              aria-label={`${removeFileButtonDescription}, ${file.name}`}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

function toAcceptList(accept: FileUploadProps['accept']): string[] {
  if (!accept) return [];
  return typeof accept === 'string' ? accept.split(',') : accept;
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
