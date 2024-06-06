import React from 'react';

const downloadFileAtURL = (url: string) => {
  const fileName: string = url.split("/").pop() || "";
  const aTag = document.createElement("a");

  aTag.href = url;
  aTag.setAttribute("download", fileName);
  document.body.appendChild(aTag);
  aTag.click();
  document.body.removeChild(aTag); // Ensure the aTag is removed after the click event
};

const DownloadButton: React.FC<{ fileId: string }> = ({ fileId }) => {
  const CSV_FILE_URL = `${import.meta.env.VITE_BE}/product/csv/${fileId}`;

  return (
    <button
      className="btn"
      onClick={() => {
        downloadFileAtURL(CSV_FILE_URL);
      }}
    >
      Download list of product
    </button>
  );
};

export default DownloadButton;