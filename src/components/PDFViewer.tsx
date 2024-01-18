import React from "react";

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {

  const p = `https://chatpdf-gaurav18122001.s3.ap-southeast-1.amazonaws.com/${pdf_url}`
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${p}&embedded=true`}
      className="w-full h-full"
    ></iframe>
  );
};

export default PDFViewer;