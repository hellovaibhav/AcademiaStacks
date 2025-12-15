import React, {useState, useCallback, useEffect} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {motion, AnimatePresence} from 'framer-motion';
import {
  AiOutlineClose,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineFullscreen,
  AiOutlineFullscreenExit
} from 'react-icons/ai';
import {BsChevronUp, BsChevronDown} from 'react-icons/bs';
import PaywallOverlay from './PaywallOverlay';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

const SecurePDFViewer = ({
  isOpen,
  onClose,
  pdfUrl,
  materialId,
  title = 'Document Viewer',
  initialPage = 1,
  isSubscribed = false,
  onSubscribeClick
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Security measures
  useEffect(() => {
    // Prevent right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts for printing, saving, etc.
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'p' || e.key === 's' || e.key === 'c')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent drag and drop
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // Proxy URL for secure PDF serving
  const secureUrl = materialId === 'test123'
    ? pdfUrl  // Use direct URL for test PDF
    : materialId
      ? `${process.env.REACT_APP_API_BASE_URL}/api/materials/secure-pdf/${materialId}`
      : pdfUrl;

  const onDocumentLoadSuccess = useCallback(({numPages}) => {
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
      errorMessage += error.message;
    }
    setError(errorMessage);
    setLoading(false);
  }, []);

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
      case 'ArrowUp':
        changePage(-1);
        break;
      case 'ArrowRight':
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

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        className={`fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center ${
          isFullscreen ? 'p-0' : 'p-4'
        }`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{scale: 0.9}}
          animate={{scale: 1}}
          exit={{scale: 0.9}}
          className={`bg-white rounded-lg shadow-2xl overflow-hidden relative ${
            isFullscreen ? 'w-full h-full rounded-none' : 'max-w-6xl max-h-[90vh] w-full'
          }`}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Controls Header */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{y: -50, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: -50, opacity: 0}}
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
                  <button
                    onClick={() => changePage(-1)}
                    disabled={pageNumber <= 1}
                    className="p-2 hover:bg-gray-700 rounded disabled:opacity-50"
                    title="Previous Page (←)"
                  >
                    <AiOutlineLeft />
                  </button>

                  <button
                    onClick={() => changePage(1)}
                    disabled={pageNumber >= numPages}
                    className="p-2 hover:bg-gray-700 rounded disabled:opacity-50"
                    title="Next Page (→)"
                  >
                    <AiOutlineRight />
                  </button>

                  <button
                    onClick={() => changeScale(-0.1)}
                    disabled={scale <= 0.5}
                    className="p-2 hover:bg-gray-700 rounded disabled:opacity-50"
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
                    className="p-2 hover:bg-gray-700 rounded disabled:opacity-50"
                    title="Zoom In (+)"
                  >
                    <AiOutlineZoomIn />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-gray-700 rounded"
                    title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                  >
                    {isFullscreen ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
                  </button>

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
          <div 
            className={`overflow-auto bg-gray-100 ${
              isFullscreen ? 'h-full' : 'max-h-[calc(90vh-80px)]'
            } flex items-center justify-center p-4 relative`}
            onContextMenu={(e) => e.preventDefault()}
          >
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                <span className="ml-4 text-gray-600">Loading PDF...</span>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading PDF</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            )}

            {!isSubscribed && (
              <PaywallOverlay onSubscribe={onSubscribeClick} />
            )}

            {!loading && !error && secureUrl && (
              <Document
                file={secureUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  className="shadow-lg"
                  renderTextLayer={isSubscribed}
                  renderAnnotationLayer={isSubscribed}
                  loading={
                    <div className="flex items-center justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                  }
                />
              </Document>
            )}
          </div>

          {/* Page Navigation Footer */}
          <AnimatePresence>
            {showControls && numPages > 1 && (
              <motion.div
                initial={{y: 50, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: 50, opacity: 0}}
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

export default SecurePDFViewer;