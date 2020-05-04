import React, { EffectCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type FileUploadProps = {
  onDrop: EffectCallback;
};

export const FileUpload: React.FC<FileUploadProps> = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps} />
      {isDragActive && <p>lol</p>}
    </div>
  );
};
