// src/FileUploader.js
import React from 'react';
import './styles/FileUploader.css';

function FileUploader({ onFilesSelected, onRemoveFile, files }) {
  return (
    <div className="file-uploader">
      <div className="file-list">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <span className="file-name">{file.name}</span>
            <button onClick={() => onRemoveFile(index)} className="remove-file">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUploader;
