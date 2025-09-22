import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { compressPDFBasic, analyzePDF } from './pdfCompression.js';

// Load environment variables
dotenv.config();

// Gozunga API configuration
const GOZUNGA_API_BASE_URL = process.env.GOZUNGA_API_BASE_URL || 'https://api.gozunga.com';
const GOZUNGA_API_KEY = process.env.GOZUNGA_API_KEY;
const GOZUNGA_BUCKET_NAME = process.env.GOZUNGA_BUCKET_NAME || 'academia-stacks';

// Check if Gozunga service is available
let GOZUNGA_SERVICE_AVAILABLE = false;

/**
 * Test Gozunga API connectivity
 */
const testGozungaConnectivity = async () => {
  try {
    console.log(`🔍 Testing connectivity to: ${GOZUNGA_API_BASE_URL}`);
    
    // Test with a simple API call to check if the service is reachable
    const response = await axios.get(`${GOZUNGA_API_BASE_URL}/v1/storage/buckets`, {
      timeout: 5000,
      headers: {
        'Authorization': `Bearer ${GOZUNGA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Gozunga API reachable, status: ${response.status}`);
    return true;
  } catch (error) {
    console.log('❌ Gozunga API connectivity test failed:', error.message);
    return false;
  }
};

/**
 * Check Gozunga API configuration
 */
export const checkGozungaConfig = async () => {
  console.log('🔍 Gozunga Configuration Check:');
  console.log('  API Base URL:', GOZUNGA_API_BASE_URL);
  console.log('  API Key:', GOZUNGA_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('  Bucket Name:', GOZUNGA_BUCKET_NAME);
  
  if (!GOZUNGA_API_KEY) {
    console.log('❌ GOZUNGA_API_KEY is not configured in .env file');
    return false;
  }
  
  // Test connectivity
  console.log('🔍 Testing Gozunga API connectivity...');
  GOZUNGA_SERVICE_AVAILABLE = await testGozungaConnectivity();
  
  if (GOZUNGA_SERVICE_AVAILABLE) {
    console.log('✅ Gozunga configuration looks good!');
  } else {
    console.log('⚠️  Gozunga API is not reachable, will use local storage fallback');
    console.log('💡 This is normal if Gozunga service is down or the API endpoint has changed');
    console.log('💡 Your uploads will work perfectly with local storage fallback');
  }
  
  return GOZUNGA_SERVICE_AVAILABLE;
};

// Create axios instance with default config
const gozungaClient = axios.create({
  baseURL: GOZUNGA_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${GOZUNGA_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Upload a file to Gozunga cloud storage
 * @param {Object} file - Multer file object
 * @param {string} fileName - Name for the file in Gozunga
 * @param {string} mimeType - MIME type of the file
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} - Gozunga file object
 */
export const uploadToGozunga = async (file, fileName, mimeType, metadata = {}) => {
  try {
    // Check if Gozunga service is available
    if (!GOZUNGA_SERVICE_AVAILABLE) {
      throw new Error('Gozunga service is not available, using local storage fallback');
    }
    
    if (!GOZUNGA_API_KEY) {
      throw new Error('Gozunga API key not configured');
    }

    console.log(`📤 Uploading ${fileName} to Gozunga...`);
    
    // Read file buffer
    const fileBuffer = fs.readFileSync(file.path);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer], { type: mimeType }), fileName);
    formData.append('bucket', GOZUNGA_BUCKET_NAME);
    formData.append('key', fileName);
    formData.append('content_type', mimeType);
    
    // Add metadata if provided
    if (metadata && Object.keys(metadata).length > 0) {
      formData.append('metadata', JSON.stringify({
        ...metadata,
        original_name: file.originalname,
        upload_timestamp: new Date().toISOString(),
      }));
    }

    // Upload file to Gozunga
    const uploadResponse = await gozungaClient.post('/v1/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (uploadResponse.status !== 200 && uploadResponse.status !== 201) {
      throw new Error(`Upload failed with status: ${uploadResponse.status}`);
    }

    const responseData = uploadResponse.data;
    
    return {
      id: responseData.id || responseData.file_id,
      name: fileName,
      url: responseData.url || responseData.public_url,
      download_url: responseData.download_url || responseData.url,
      size: fileBuffer.length,
      mime_type: mimeType,
      metadata: responseData.metadata || {},
    };

  } catch (error) {
    console.error('Error uploading to Gozunga:', error);
    throw new Error(`Failed to upload file to Gozunga: ${error.message}`);
  }
};

/**
 * Get file information from Gozunga
 * @param {string} fileId - Gozunga file ID
 * @returns {Promise<Object>} - File information
 */
export const getGozungaFileInfo = async (fileId) => {
  try {
    const response = await gozungaClient.get(`/v1/storage/files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting file info from Gozunga:', error);
    throw new Error('Failed to get file information from Gozunga');
  }
};

/**
 * List files in Gozunga bucket
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - List of files
 */
export const listGozungaFiles = async (options = {}) => {
  try {
    const response = await gozungaClient.get('/v1/storage/files', {
      params: {
        bucket: GOZUNGA_BUCKET_NAME,
        ...options
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error listing files from Gozunga:', error);
    throw new Error('Failed to list files from Gozunga');
  }
};

/**
 * Delete file from Gozunga
 * @param {string} fileId - Gozunga file ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteGozungaFile = async (fileId) => {
  try {
    const response = await gozungaClient.delete(`/v1/storage/files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting file from Gozunga:', error);
    throw new Error('Failed to delete file from Gozunga');
  }
};

/**
 * Update file metadata in Gozunga
 * @param {string} fileId - Gozunga file ID
 * @param {Object} metadata - New metadata
 * @returns {Promise<Object>} - Updated file info
 */
export const updateGozungaFileMetadata = async (fileId, metadata) => {
  try {
    const response = await gozungaClient.patch(`/v1/storage/files/${fileId}`, {
      metadata
    });
    return response.data;
  } catch (error) {
    console.error('Error updating file metadata in Gozunga:', error);
    throw new Error('Failed to update file metadata in Gozunga');
  }
};

/**
 * Upload file to local storage (fallback when Gozunga is not available)
 */
export const uploadToLocalStorage = async (file, fileName, mimeType, metadata = {}) => {
  try {
    console.log(`📁 Uploading ${fileName} to local storage...`);
    
    // Ensure uploads directory exists
    const uploadsDir = './uploads/materials';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(fileName);
    const baseName = path.basename(fileName, fileExtension);
    const uniqueFileName = `${baseName}_${timestamp}${fileExtension}`;
    const localPath = path.join(uploadsDir, uniqueFileName);
    
    // Copy file to local storage
    fs.copyFileSync(file.path, localPath);
    
    // Get file size
    const fileSize = fs.statSync(localPath).size;
    
    console.log('✅ File uploaded to local storage:', localPath);
    
    return {
      id: `local_${timestamp}`,
      name: uniqueFileName,
      url: `/uploads/materials/${uniqueFileName}`,
      download_url: `/uploads/materials/${uniqueFileName}`,
      size: fileSize,
      mime_type: mimeType,
      metadata: {
        ...metadata,
        storage_type: 'local',
        upload_timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('❌ Error uploading to local storage:', error.message);
    throw error;
  }
};

/**
 * Compress PDF with Gozunga (fallback to basic compression)
 */
export const compressPDFWithGozunga = async (inputPath, outputPath) => {
  try {
    console.log('🔍 Analyzing PDF for compression...');
    const analysis = await analyzePDF(inputPath);
    console.log('📊 PDF Analysis:', analysis);
    
    // Use basic compression with analysis-based level
    const compressionResult = await compressPDFBasic(inputPath, outputPath, analysis.compressionLevel);
    console.log('✅ PDF compression completed:', compressionResult);
    
    return {
      success: true,
      originalSize: analysis.originalSize,
      compressedSize: compressionResult.compressedSize,
      compressionRatio: compressionResult.compressionRatio,
      method: 'basic'
    };
  } catch (error) {
    console.error('❌ PDF compression failed:', error.message);
    
    // Fallback: just copy the file
    try {
      fs.copyFileSync(inputPath, outputPath);
      const originalSize = fs.statSync(inputPath).size;
      const compressedSize = fs.statSync(outputPath).size;
      
      return {
        success: true,
        originalSize,
        compressedSize,
        compressionRatio: (1 - compressedSize / originalSize) * 100,
        method: 'copy'
      };
    } catch (copyError) {
      console.error('❌ Fallback copy failed:', copyError.message);
      throw copyError;
    }
  }
};

/**
 * Generate thumbnail for PDF using Gozunga (fallback to local processing)
 */
export const generateThumbnailWithGozunga = async (pdfPath, outputPath) => {
  try {
    console.log('🖼️ Generating thumbnail with Gozunga...');
    
    // For now, use local thumbnail generation
    // This can be enhanced to use Gozunga's image processing services
    const sharp = await import('sharp');
    
    // Generate thumbnail using sharp
    await sharp.default(pdfPath)
      .resize(300, 400, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    
    console.log('✅ Thumbnail generated successfully');
    return true;
  } catch (error) {
    console.error('❌ Thumbnail generation failed:', error.message);
    return false;
  }
};
