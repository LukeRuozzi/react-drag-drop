import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const img = {
  display: 'block',
  width: 'auto',
  height: '100px',
};

export const FileUpload = () => {
  const [file, setFile] = useState(null);

  const onDropHandler = (files) => {
    const tmpFile = files[0];
    console.log(tmpFile.path, tmpFile.size, tmpFile.type);

    setFile(
      Object.assign(tmpFile, {
        preview: URL.createObjectURL(tmpFile),
      })
    );

    console.log(file);
  };

  const customValidator = (file) => {
    const maxSize = 5000000;
    if (file.size > maxSize) {
      return {
        code: 'size-too-large',
        message: `Size is larger than ${maxSize} bytes`,
      };
    }
    return null;
  };

  const props = {
    accept: 'image/png,image/jpg,image/jpeg,application/pdf',
    onDrop: onDropHandler,
    maxFiles: 1,
    validator: customValidator,
  };

  const { fileRejections, getRootProps, getInputProps } = useDropzone(props);

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      {errors.map((e) => (
        <div key={e.code}>{e.message}</div>
      ))}
    </li>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
  }, [file]);

  return (
    <section className="drag-drop">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        {file && (
          <div>
            {file.path} - {file.size}
            <img src={file.preview} style={img} />
          </div>
        )}
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside>
    </section>
  );
};
