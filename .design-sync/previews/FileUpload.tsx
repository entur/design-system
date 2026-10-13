import React from 'react';
import { FileUpload } from '@entur/linje';

const makeFile = (name: string, size: number, type: string) =>
  new File([new Uint8Array(size)], name, { type });

export const Default = () => (
  <div style={{ width: 400 }}>
    <FileUpload
      label="Last opp kvittering"
      files={[]}
      accept="image/*,application/pdf"
    />
  </div>
);

export const WithFiles = () => {
  const [files, setFiles] = React.useState<File[]>(() => [
    makeFile('kvittering-taxi.pdf', 245_000, 'application/pdf'),
    makeFile('billett-oslo-bergen.png', 1_380_000, 'image/png'),
  ]);
  return (
    <div style={{ width: 400 }}>
      <FileUpload
        label="Vedlegg til refusjonskrav"
        files={files}
        onDelete={f => setFiles(prev => prev.filter(x => x !== f))}
      />
    </div>
  );
};

export const UploadFailed = () => (
  <div style={{ width: 400 }}>
    <FileUpload label="Last opp dokumentasjon" files={[]} errorUpload />
  </div>
);
