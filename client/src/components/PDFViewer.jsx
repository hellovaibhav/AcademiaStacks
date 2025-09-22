import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AiOutlineClose, 
  AiOutlineZoomIn, 
  AiOutlineZoomOut, 
  AiOutlineLeft, 
  AiOutlineRight,
  AiOutlineFullscreen,
  AiOutlineFullscreenExit
} from 'react-icons/ai';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { generatePdfThumbnail } from '../utils/pdfThumbnail';

// Set up PDF.js worker
const setupWorker = () => {
  // Use local worker
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
};

setupWorker();

const PDFViewer = ({ 
  isOpen, 
  onClose, 
  pdfUrl, 
  materialId,
  title = "Document Viewer",
  initialPage = 1 
}) => {
  // Method to generate thumbnail for this PDF
  const generateThumbnail = useCallback(async (pageNumber = 1, width = 200, height = 280) => {
    if (!pdfUrl) return null;
    return await generatePdfThumbnail(pdfUrl, pageNumber, width, height);
  }, [pdfUrl]);
  // Convert various PDF URLs to direct view URLs
  const getDirectPdfUrl = (url) => {
    if (!url) return url;
    
    // Handle Drime URLs
    if (url.includes('api.drime.cloud') || url.includes('drime.cloud')) {
      return url;
    }
    
    // Handle Google Drive share links
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      if (fileId) {
        const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        return directUrl;
      }
    }
    
    // Handle Google Drive view links
    if (url.includes('drive.google.com/uc?export=view')) {
      return url;
    }
    
    // Handle Google Drive download links
    if (url.includes('drive.google.com/uc?export=download')) {
      const directUrl = url.replace('export=download', 'export=view');
      return directUrl;
    }
    return url;
  };

  // Use proxy URL if materialId is provided, otherwise use direct URL
  const directPdfUrl = materialId 
    ? `${process.env.REACT_APP_API_BASE_URL}/materials/pdf-proxy/${materialId}`
    : getDirectPdfUrl(pdfUrl);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error) => {
    
    let errorMessage = 'Failed to load PDF. ';
    if (error.name === 'InvalidPDFException') {
      errorMessage += 'The file is not a valid PDF or is corrupted.';
    } else if (error.name === 'MissingPDFException') {
      errorMessage += 'The PDF file could not be found.';
    } else if (error.message.includes('CORS')) {
      errorMessage += 'CORS restrictions are preventing the PDF from loading.';
    } else {
      errorMessage += 'This might be due to CORS restrictions or the file format.';
    }
    
    setError(errorMessage);
    setLoading(false);
  }, [pdfUrl, directPdfUrl, materialId]);

  const changePage = useCallback((direction) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + direction;
      if (newPage >= 1 && newPage <= numPages) {
        return newPage;
      }
      return prevPageNumber;
    });
  }, [numPages]);

  const changeScale = useCallback((delta) => {
    setScale(prevScale => {
      const newScale = prevScale + delta;
      return Math.max(0.5, Math.min(3.0, newScale));
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Download functionality removed for security

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'Escape':
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
        break;
      case 'ArrowLeft':
        changePage(-1);
        break;
      case 'ArrowRight':
        changePage(1);
        break;
      case 'ArrowUp':
        changePage(-1);
        break;
      case 'ArrowDown':
        changePage(1);
        break;
      case '+':
      case '=':
        changeScale(0.1);
        break;
      case '-':
        changeScale(-0.1);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      default:
        break;
    }
  }, [changePage, changeScale, toggleFullscreen, onClose, isFullscreen]);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  React.useEffect(() => {
    if (isOpen && pdfUrl) {
      setLoading(true);
      setError(null);
    }
  }, [isOpen, pdfUrl]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center ${
          isFullscreen ? 'p-0' : 'p-4'
        }`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className={`bg-white rounded-lg shadow-2xl overflow-hidden ${
            isFullscreen ? 'w-full h-full rounded-none' : 'max-w-6xl max-h-[90vh] w-full'
          }`}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Header */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="bg-gray-800 text-white p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold truncate">{title}</h3>
                  {numPages && (
                    <span className="text-sm text-gray-300">
                      Page {pageNumber} of {numPages}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {/* Navigation Controls */}
                  <button
                    onClick={() => changePage(-1)}
                    disabled={pageNumber <= 1}
                    className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous Page (←)"
                  >
                    <AiOutlineLeft />
                  </button>
                  
                  <button
                    onClick={() => changePage(1)}
                    disabled={pageNumber >= numPages}
                    className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next Page (→)"
                  >
                    <AiOutlineRight />
                  </button>

                  {/* Zoom Controls */}
                  <button
                    onClick={() => changeScale(-0.1)}
                    disabled={scale <= 0.5}
                    className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom Out (-)"
                  >
                    <AiOutlineZoomOut />
                  </button>

                  <span className="text-sm px-2">
                    {Math.round(scale * 100)}%
                  </span>

                  <button
                    onClick={() => changeScale(0.1)}
                    disabled={scale >= 3.0}
                    className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom In (+)"
                  >
                    <AiOutlineZoomIn />
                  </button>

                  {/* Download functionality removed for security */}

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-gray-700 rounded"
                    title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
                  >
                    {isFullscreen ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
                  </button>

                  {/* Close */}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-700 rounded"
                    title="Close (Esc)"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PDF Content */}
          <div className={`overflow-auto bg-gray-100 ${
            isFullscreen ? 'h-full' : 'max-h-[calc(90vh-80px)]'
          } flex items-center justify-center p-4`}>
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-4 text-gray-600">Loading PDF...</span>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading PDF</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open(pdfUrl, '_blank')}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors mr-2"
                  >
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => window.open(directPdfUrl, '_blank')}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Try Direct Link
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && directPdfUrl && (
              <Document
                file={directPdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                }
                error={
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading PDF</h3>
                    <p className="text-gray-600 mb-4">Unable to display this PDF file.</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => window.open(pdfUrl, '_blank')}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors mr-2"
                      >
                        Open in New Tab
                      </button>
                      <button
                        onClick={() => window.open(directPdfUrl, '_blank')}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        Try Direct Link
                      </button>
                    </div>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="shadow-lg"
                />
              </Document>
            )}
          </div>

          {/* Page Navigation Footer */}
          <AnimatePresence>
            {showControls && numPages > 1 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-gray-800 text-white p-2 flex items-center justify-center space-x-4"
              >
                <button
                  onClick={() => changePage(-1)}
                  disabled={pageNumber <= 1}
                  className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
                  title="Previous Page"
                >
                  <BsChevronUp />
                </button>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max={numPages}
                    value={pageNumber}
                    onChange={(e) => {
                      const page = parseInt(e.target.value, 10);
                      if (page >= 1 && page <= numPages) {
                        setPageNumber(page);
                      }
                    }}
                    className="w-16 px-2 py-1 bg-gray-700 text-white text-center rounded"
                  />
                  <span className="text-sm">of {numPages}</span>
                </div>

                <button
                  onClick={() => changePage(1)}
                  disabled={pageNumber >= numPages}
                  className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
                  title="Next Page"
                >
                  <BsChevronDown />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Add generateThumbnail method to the component
PDFViewer.generateThumbnail = async (pdfUrl, pageNumber = 1, width = 200, height = 280) => {
  return await generatePdfThumbnail(pdfUrl, pageNumber, width, height);
};

export default PDFViewer;

