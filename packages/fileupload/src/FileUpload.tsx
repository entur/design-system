import React, { EffectCallback } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { FileIcon, CloseIcon } from '@entur/icons';
import { IconButton } from '@entur/button';
import classNames from 'classnames';
import './FileUpload.scss';

type FileUploadProps = DropzoneOptions & {
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
  onDrop: EffectCallback;
  /** Callback for når en fil slettes fra lista */
  onDelete: (file: File) => void;
  /** Hvilken filtyper som skal aksepteres */
  accept?: string | string[];
  /** Filene som er aktive i komponenten */
  files: File[];
  [key: string]: any;
};

export const FileUpload: React.FC<FileUploadProps> = ({
  standbyText = 'Dra fil eller klikk for å laste opp',
  errorText = 'Feil ved opplasting av fil',
  successText = 'Opplasting fullført',
  errorUpload = false,
  onDrop,
  onDelete = file => console.log(file),
  accept = '',
  files = [],
  options = {},
  style,
  ...rest
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: accept,
    ...rest,
  });

  const success = files.length > 0;

  return (
    <div className="eds-file-upload__wrapper" {...style}>
      <div className="eds-file-upload__input" {...getRootProps()}>
        <input {...getInputProps()} />
        <span
          className={classNames(
            'eds-file-upload__dropzone',
            {
              'eds-file-upload__dropzone--success': success,
            },
            { 'eds-file-upload__dropzone--active': isDragActive },
            { 'eds-file-upload__dropzone--reject': isDragReject },
            { 'eds-file-uploadg__dropzone--error': errorUpload },
          )}
        >
          {success ? successText : errorUpload ? errorText : standbyText}
        </span>
      </div>
      <div className="eds-file-upload__file-list">
        {files.map((file: any) => (
          <div className="eds-file-upload__file-name" key={file.path}>
            <FileIcon className="eds-field-upload__file-name-icon" />
            {file.path} - {convertSizeToHuman(file.size)}{' '}
            <IconButton onClick={() => onDelete(file)}>
              <CloseIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

function convertSizeToHuman(size: number) {
  if (size < 1000) {
    return size + 'bytes;';
  } else if (size < 1000000) {
    return `${size / 1000}  KB`;
  } else {
    return `${(size / 1000000).toPrecision(4)} MB`;
  }
}
