import fs from 'fs';
import path from 'path';

/**
 * Advanced PDF Compression Service
 * This service provides multiple compression strategies for PDF files
 */

/**
 * Get file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Human-readable file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if PDF needs compression based on size and quality
 * @param {string} filePath - Path to PDF file
 * @returns {Object} - Compression recommendation
 */
export const analyzePDF = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    const sizeInMB = stats.size / (1024 * 1024);
    
    const analysis = {
      filePath,
      originalSize: stats.size,
      sizeInMB: parseFloat(sizeInMB.toFixed(2)),
      needsCompression: sizeInMB > 2, // Compress if > 2MB
      compressionLevel: 'none',
      estimatedSavings: 0
    };
    
    if (sizeInMB > 10) {
      analysis.compressionLevel = 'aggressive';
      analysis.estimatedSavings = 30; // 30% estimated savings
    } else if (sizeInMB > 5) {
      analysis.compressionLevel = 'moderate';
      analysis.estimatedSavings = 20; // 20% estimated savings
    } else if (sizeInMB > 2) {
      analysis.compressionLevel = 'light';
      analysis.estimatedSavings = 10; // 10% estimated savings
    }
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing PDF:', error);
    return null;
  }
};

/**
 * Basic PDF compression using file optimization
 * @param {string} inputPath - Input PDF path
 * @param {string} outputPath - Output PDF path
 * @param {string} level - Compression level ('light', 'moderate', 'aggressive')
 * @returns {Promise<Object>} - Compression result
 */
export const compressPDFBasic = async (inputPath, outputPath, level = 'moderate') => {
  try {
    const analysis = analyzePDF(inputPath);
    if (!analysis) {
      throw new Error('Failed to analyze PDF');
    }
    
    console.log(`📄 PDF Analysis: ${formatFileSize(analysis.originalSize)} (${analysis.sizeInMB} MB)`);
    
    // If file is already small, just copy it
    if (!analysis.needsCompression) {
      console.log('📄 File is already small, copying without compression');
      fs.copyFileSync(inputPath, outputPath);
      return {
        success: true,
        originalSize: analysis.originalSize,
        compressedSize: analysis.originalSize,
        compressionRatio: 0,
        method: 'none',
        message: 'File already optimized'
      };
    }
    
    // Read the original file
    const originalBuffer = fs.readFileSync(inputPath);
    
    // Apply compression based on level
    let compressedBuffer = originalBuffer;
    
    switch (level) {
      case 'aggressive':
        // For aggressive compression, we would typically use external tools
        // For now, we'll use basic optimization
        compressedBuffer = await optimizePDFBuffer(originalBuffer, 0.7);
        break;
      case 'moderate':
        compressedBuffer = await optimizePDFBuffer(originalBuffer, 0.8);
        break;
      case 'light':
        compressedBuffer = await optimizePDFBuffer(originalBuffer, 0.9);
        break;
      default:
        compressedBuffer = originalBuffer;
    }
    
    // Write compressed file
    fs.writeFileSync(outputPath, compressedBuffer, { 
      encoding: 'binary',
      flag: 'w'
    });
    
    // Verify compression
    const compressedStats = fs.statSync(outputPath);
    const compressionRatio = ((analysis.originalSize - compressedStats.size) / analysis.originalSize * 100);
    
    const result = {
      success: true,
      originalSize: analysis.originalSize,
      compressedSize: compressedStats.size,
      compressionRatio: parseFloat(compressionRatio.toFixed(2)),
      method: level,
      message: `Compressed by ${compressionRatio.toFixed(2)}%`
    };
    
    console.log(`✅ PDF Compressed: ${formatFileSize(compressedStats.size)} (${result.compressionRatio}% reduction)`);
    
    // If compression didn't help, use original
    if (compressedStats.size >= analysis.originalSize) {
      console.log('📄 Compression didn\'t reduce size, using original file');
      fs.copyFileSync(inputPath, outputPath);
      result.compressedSize = analysis.originalSize;
      result.compressionRatio = 0;
      result.method = 'none';
      result.message = 'Compression not beneficial, using original';
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ PDF compression error:', error);
    return {
      success: false,
      error: error.message,
      fallback: true
    };
  }
};

/**
 * Optimize PDF buffer with basic techniques
 * @param {Buffer} buffer - Original PDF buffer
 * @param {number} quality - Quality factor (0-1)
 * @returns {Promise<Buffer>} - Optimized buffer
 */
const optimizePDFBuffer = async (buffer, quality = 0.8) => {
  try {
    // Basic optimization techniques:
    // 1. Remove unnecessary whitespace
    // 2. Optimize binary data
    // 3. Remove redundant metadata
    
    // This is a simplified approach
    // In production, you would use libraries like:
    // - PDF-lib for programmatic compression
    // - Ghostscript for advanced compression
    // - External services like TinyPDF
    
    // For now, we'll apply basic optimizations
    let optimizedBuffer = Buffer.from(buffer);
    
    // Basic optimization: remove null bytes and optimize structure
    // This is a placeholder - real PDF optimization requires PDF parsing
    
    return optimizedBuffer;
  } catch (error) {
    console.error('Error optimizing PDF buffer:', error);
    return buffer; // Return original if optimization fails
  }
};

/**
 * Advanced PDF compression using external tools (placeholder for future implementation)
 * @param {string} inputPath - Input PDF path
 * @param {string} outputPath - Output PDF path
 * @returns {Promise<Object>} - Compression result
 */
export const compressPDFAdvanced = async (inputPath, outputPath) => {
  try {
    // This would integrate with external compression services:
    // - Ghostscript: gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf
    // - PDF-lib: Programmatic compression
    // - Cloud services: TinyPDF, SmallPDF, etc.
    
    console.log('🚀 Advanced PDF compression not yet implemented');
    console.log('💡 Consider integrating with Ghostscript or PDF-lib for better compression');
    
    // Fallback to basic compression
    return await compressPDFBasic(inputPath, outputPath, 'aggressive');
    
  } catch (error) {
    console.error('❌ Advanced PDF compression error:', error);
    return {
      success: false,
      error: error.message,
      fallback: true
    };
  }
};

/**
 * Get compression recommendations based on file size
 * @param {string} filePath - Path to PDF file
 * @returns {Object} - Compression recommendations
 */
export const getCompressionRecommendations = (filePath) => {
  const analysis = analyzePDF(filePath);
  if (!analysis) {
    return { error: 'Failed to analyze file' };
  }
  
  const recommendations = {
    fileSize: formatFileSize(analysis.originalSize),
    needsCompression: analysis.needsCompression,
    recommendedLevel: analysis.compressionLevel,
    estimatedSavings: analysis.estimatedSavings,
    strategies: []
  };
  
  if (analysis.needsCompression) {
    if (analysis.sizeInMB > 10) {
      recommendations.strategies = [
        'Use Ghostscript with aggressive settings',
        'Consider splitting large PDFs',
        'Remove unnecessary images or reduce quality',
        'Use external compression services'
      ];
    } else if (analysis.sizeInMB > 5) {
      recommendations.strategies = [
        'Use moderate compression settings',
        'Optimize images within the PDF',
        'Remove redundant metadata'
      ];
    } else {
      recommendations.strategies = [
        'Use light compression',
        'Basic file optimization'
      ];
    }
  } else {
    recommendations.strategies = [
      'File is already optimized',
      'No compression needed'
    ];
  }
  
  return recommendations;
};

export default {
  analyzePDF,
  compressPDFBasic,
  compressPDFAdvanced,
  getCompressionRecommendations,
  formatFileSize
};
