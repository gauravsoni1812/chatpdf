import React from 'react';

type Props = {
  pdf_url: string;
};

const PDFViewer = ({ pdf_url }: Props) => {
  return (
    <div className="w-full h-full">    
      <object
        data={`https://docs.google.com/viewer?url=${pdf_url}&embedded=true`}
        type="application/pdf"
        width="100%"
        height="100%"
      >
        <p>
          Your browser does not support PDF viewing. You can download the PDF{' '}
          <a href={pdf_url}>here</a>.
        </p>
      </object>
    </div>
  );
};

export default PDFViewer;
