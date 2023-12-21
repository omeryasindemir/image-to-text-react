import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const ImageProcessor = () => {
  const [image, setImage] = useState(null);
  const [processedText, setProcessedText] = useState([]);

  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width * 3;
        canvas.height = img.height * 3;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        setImage(canvas.toDataURL());

        Tesseract.recognize(
          canvas.toDataURL(),
          'eng',
          { logger: (info) => console.log(info) }
        ).then(({ data: { text } }) => {
          const lines = text.split('\n').filter((line) => line.trim() !== '');
          setProcessedText(lines);
        });
      };
    };

    acceptedFiles.forEach((file) => reader.readAsDataURL(file));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <div className="container mt-5">
      <div {...getRootProps()} style={dropzoneStyle} className="text-center p-5 border">
        <input {...getInputProps()} />
        <p className="mb-3">CLICK ME! and select image from computer...</p>
      </div>
      {image && (
        <div className="mt-4">
          <h2 className="mb-4">Image : </h2>
          <img src={image} alt="Processed" style={imageStyle} className="img-fluid mb-4" />
          <h2 className="mb-3">Text : </h2>
          {processedText.map((line, index) => (
            <p key={index} className="mb-2">{line}</p>
          ))}
        </div>
      )}
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  cursor: 'pointer',
};

const imageStyle = {
  maxWidth: '100%',
  maxHeight: '500px',
};

export default ImageProcessor;
