import React, { useState, useEffect, useRef, createRef } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';

const img = {
  display: 'block',
  width: 'auto',
  height: '300px',
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

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
  }, [file]);

  return (
    <>
      {!file && (
        <>
          <Dropzone
            accept="image/png,image/jpg,image/jpeg,application/pdf"
            onDrop={onDropHandler}
            maxFiles={1}
            validator={customValidator}
          >
            {({ getRootProps, getInputProps, fileRejections }) => (
              <>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                  {fileRejections.length > 0 && (
                    <div>
                      <h4>Rejected files</h4>
                      <ul>
                        {fileRejections.map(({ file, errors }) => (
                          <>
                            {errors.map((e) => (
                              <span key={e.code}>{e.message}</span>
                            ))}
                          </>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </Dropzone>
        </>
      )}
      {file && (
        <aside>
          {file && (
            <div>
              <img src={file.preview} style={img} />
            </div>
          )}
        </aside>
      )}
    </>
  );
};
