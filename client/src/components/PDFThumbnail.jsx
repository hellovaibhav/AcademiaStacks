import React, {useState, useEffect} from 'react';
import {generatePdfThumbnail} from '../utils/pdfThumbnail';
import {AiOutlineFilePdf, AiOutlineLoading3Quarters} from 'react-icons/ai';

const PDFThumbnail = ({
  pdfUrl,
  pageNumber = 1,
  width = 200,
  height = 280,
  className = '',
  alt = 'PDF Thumbnail',
  showLoading = true,
  fallbackIcon = true,
  onClick = null
}) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pdfUrl) {
      setLoading(false);
      return;
    }

    const generateThumbnail = async () => {
      try {
        setLoading(true);
        setError(null);
        const thumb = await generatePdfThumbnail(pdfUrl, pageNumber, width, height);
        setThumbnail(thumb);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    generateThumbnail();
  }, [pdfUrl, pageNumber, width, height]);

  const handleClick = () => {
    if (onClick) {
      onClick(pdfUrl);
    }
  };

  if (loading && showLoading) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{width, height}}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center space-y-2">
          <AiOutlineLoading3Quarters className="animate-spin text-gray-400 text-2xl" />
          <span className="text-gray-500 text-xs">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !thumbnail) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors ${className}`}
        style={{width, height}}
        onClick={handleClick}
      >
        {fallbackIcon ? (
          <div className="flex flex-col items-center space-y-2">
            <AiOutlineFilePdf className="text-gray-500 text-3xl" />
            <span className="text-gray-500 text-xs">PDF Preview</span>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">Preview Error</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={thumbnail}
      alt={alt}
      className={`cursor-pointer hover:opacity-90 transition-opacity ${className}`}
      style={{width, height, objectFit: 'cover'}}
      onClick={handleClick}
    />
  );
};

export default PDFThumbnail;
