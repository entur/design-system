import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FileUpload } from '@entur/fileupload';

import '@entur/tokens/styles';
import '@entur/a11y/styles';
import '@entur/button/styles';
import '@entur/fileupload/styles';
import '@entur/icons/styles';
import '@entur/typography/styles';

function FileUploadFixture() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <main>
      <FileUpload
        label="Attachment"
        files={files}
        onDrop={accepted => setFiles(current => [...current, ...accepted])}
        onDelete={deleted =>
          setFiles(current => current.filter(file => file !== deleted))
        }
      />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<FileUploadFixture />);
