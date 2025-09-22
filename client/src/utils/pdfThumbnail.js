import React from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
const setupWorker = () => {
  // Use local worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
};

setupWorker();

/**
 * Generate a thumbnail from a PDF URL
 * @param {string} pdfUrl - The URL of the PDF file
 * @param {number} pageNumber - Page number to generate thumbnail from (default: 1)
 * @param {number} width - Width of the thumbnail (default: 200)
 * @param {number} height - Height of the thumbnail (default: 280)
 * @returns {Promise<string>} - Data URL of the thumbnail image
 */
export const generatePdfThumbnail = async (pdfUrl, pageNumber = 1, width = 200, height = 280) => {
  try {
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    
    // Get the specified page
    const page = await pdf.getPage(pageNumber);
    
    // Set up the canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Calculate scale to fit the desired dimensions
    const viewport = page.getViewport({ scale: 1 });
    const scale = Math.min(width / viewport.width, height / viewport.height);
    const scaledViewport = page.getViewport({ scale });
    
    // Set canvas dimensions
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    
    // Render the page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport
    };
    
    await page.render(renderContext).promise;
    
    // Convert canvas to data URL
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error('Error generating PDF thumbnail:', error);
    // Return a placeholder image or null
    return null;
  }
};

/**
 * Generate multiple thumbnails from a PDF (for carousel or preview)
 * @param {string} pdfUrl - The URL of the PDF file
 * @param {number} maxPages - Maximum number of pages to generate thumbnails for
 * @param {number} width - Width of each thumbnail
 * @param {number} height - Height of each thumbnail
 * @returns {Promise<string[]>} - Array of data URLs
 */
export const generatePdfThumbnails = async (pdfUrl, maxPages = 3, width = 200, height = 280) => {
  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const totalPages = Math.min(pdf.numPages, maxPages);
    const thumbnails = [];
    
    for (let i = 1; i <= totalPages; i++) {
      const thumbnail = await generatePdfThumbnail(pdfUrl, i, width, height);
      if (thumbnail) {
        thumbnails.push(thumbnail);
      }
    }
    
    return thumbnails;
  } catch (error) {
    console.error('Error generating PDF thumbnails:', error);
    return [];
  }
};

/**
 * Create a thumbnail component with loading state
 * @param {string} pdfUrl - The URL of the PDF file
 * @param {Object} options - Options for thumbnail generation
 * @returns {Promise<JSX.Element>} - React component
 */
export const createPdfThumbnailComponent = async (pdfUrl, options = {}) => {
  const {
    pageNumber = 1,
    width = 200,
    height = 280,
    className = '',
    alt = 'PDF Thumbnail',
    showLoading = true
  } = options;
  
  try {
    const thumbnail = await generatePdfThumbnail(pdfUrl, pageNumber, width, height);
    
    if (thumbnail) {
      return (
        <img
          src={thumbnail}
          alt={alt}
          className={className}
          style={{ width, height, objectFit: 'cover' }}
        />
      );
    } else {
      return (
        <div 
          className={`bg-gray-200 flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <span className="text-gray-500 text-sm">PDF Preview</span>
        </div>
      );
    }
  } catch (error) {
    console.error('Error creating PDF thumbnail component:', error);
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Preview Error</span>
      </div>
    );
  }
};

/**
 * Hook for generating PDF thumbnails with loading state
 * @param {string} pdfUrl - The URL of the PDF file
 * @param {Object} options - Options for thumbnail generation
 * @returns {Object} - { thumbnail, loading, error }
 */
export const usePdfThumbnail = (pdfUrl, options = {}) => {
  const [thumbnail, setThumbnail] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    if (!pdfUrl) {
      setLoading(false);
      return;
    }
    
    const generateThumbnail = async () => {
      try {
        setLoading(true);
        setError(null);
        const thumb = await generatePdfThumbnail(pdfUrl, options.pageNumber, options.width, options.height);
        setThumbnail(thumb);
      } catch (err) {
        setError(err);
        console.error('Error generating PDF thumbnail:', err);
      } finally {
        setLoading(false);
      }
    };
    
    generateThumbnail();
  }, [pdfUrl, options.pageNumber, options.width, options.height]);
  
  return { thumbnail, loading, error };
};
