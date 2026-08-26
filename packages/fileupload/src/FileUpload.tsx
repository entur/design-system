import {
  Accept,
  DropEvent,
  DropzoneOptions,
  FileRejection,
  useDropzone,
} from 'react-dropzone';
import { useMemo } from 'react';
import classNames from 'classnames';

import { DeleteIcon, FileIcon } from '@entur/icons';
import { IconButton } from '@entur/button';
import { Label } from '@entur/typography';

import './FileUpload.scss';

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
  /** Hvilken filtyper som skal aksepteres. Enten MIME-typer og filendelser
   * som tekst, eller et oppslag fra MIME-type til filendelser.
   * @example accept=".pdf, image/png"
   * @example accept={{ 'image/png': ['.png'] }}
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
  ...rest
}: FileUploadProps) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: useMemo(() => toAcceptMap(accept), [accept]),
      ...rest,
    });

  const success = files.length > 0;

  return (
    <div className="eds-file-upload__wrapper" {...style}>
      <div className="eds-file-upload__input" {...getRootProps()}>
        {label && <Label style={{ display: 'flex' }}>{label}</Label>}
        <input {...withoutSentinelAccept(getInputProps())} />
        <span
          className={classNames(
            'eds-file-upload__dropzone',
            {
              'eds-file-upload__dropzone--success': success,
            },
            { 'eds-file-upload__dropzone--active': isDragActive },
            { 'eds-file-upload__dropzone--reject': isDragReject },
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

/** react-dropzone krever at hver filendelse ligger under en MIME-type. Denne
 * finnes ikke, så det er filendelsene under den som filtrerer. */
const EXTENSION_ONLY = 'entur/extension-only';

/** Hjelpe-MIME-typen skal ikke ut i DOM-en. */
function withoutSentinelAccept<T extends { accept?: string }>(props: T): T {
  if (!props.accept?.includes(EXTENSION_ONLY)) return props;
  const accept = props.accept
    .split(',')
    .filter(entry => entry !== EXTENSION_ONLY)
    .join(',');
  return { ...props, accept: accept || undefined };
}

/** react-dropzone tar `accept` som et oppslag fra MIME-type til filendelser.
 * Vi tar imot den flate tekstformen også, slik APIet vårt alltid har gjort. */
function toAcceptMap(
  accept: string | string[] | Accept | undefined,
): Accept | undefined {
  if (accept === undefined) return undefined;
  if (typeof accept !== 'string' && !Array.isArray(accept)) return accept;

  const entries = (Array.isArray(accept) ? accept : accept.split(','))
    .map(entry => entry.trim())
    .filter(Boolean);
  if (entries.length === 0) return undefined;

  return entries.reduce<Record<string, string[]>>((map, entry) => {
    const isMimeType = entry.includes('/');
    const key = isMimeType ? entry : EXTENSION_ONLY;
    map[key] ??= [];
    if (!isMimeType) map[key].push(entry);
    return map;
  }, {});
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
