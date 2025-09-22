import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
import sharp from 'sharp';

// Google Drive configuration
const KEYFILEPATH = process.env.GOOGLE_DRIVE_KEY_FILE || './google-drive-key.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Initialize Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Upload a file to Google Drive
 * @param {Object} file - Multer file object
 * @param {string} fileName - Name for the file in Drive
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<Object>} - Google Drive file object
 */
export const uploadToGoogleDrive = async (file, fileName, mimeType) => {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [FOLDER_ID],
    };

    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(file.path),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink',
    });

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw new Error('Failed to upload file to Google Drive');
  }
};

/**
 * Generate a direct view URL for a Google Drive file
 * @param {string} fileId - Google Drive file ID
 * @returns {string} - Direct view URL
 */
export const getDirectViewUrl = (fileId) => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

/**
 * Generate a direct download URL for a Google Drive file
 * @param {string} fileId - Google Drive file ID
 * @returns {string} - Direct download URL
 */
export const getDirectDownloadUrl = (fileId) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Compress PDF by converting to images and back (if needed)
 * @param {string} inputPath - Path to input PDF
 * @param {string} outputPath - Path to output compressed PDF
 * @returns {Promise<boolean>} - Success status
 */
export const compressPDF = async (inputPath, outputPath) => {
  try {
    // For now, we'll just copy the file
    // In a production environment, you might want to use a proper PDF compression library
    fs.copyFileSync(inputPath, outputPath);
    return true;
  } catch (error) {
    console.error('Error compressing PDF:', error);
    return false;
  }
};

/**
 * Generate thumbnail for PDF
 * @param {string} pdfPath - Path to PDF file
 * @param {string} outputPath - Path to output thumbnail
 * @returns {Promise<boolean>} - Success status
 */
export const generateThumbnail = async (pdfPath, outputPath) => {
  try {
    // For now, we'll create a placeholder thumbnail
    // In production, you'd use pdf-poppler or similar to extract first page as image
    const placeholderImage = await sharp({
      create: {
        width: 300,
        height: 400,
        channels: 3,
        background: { r: 200, g: 200, b: 200 }
      }
    })
    .png()
    .toFile(outputPath);

    return true;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return false;
  }
};

/**
 * Delete a file from Google Drive
 * @param {string} fileId - Google Drive file ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFromGoogleDrive = async (fileId) => {
  try {
    await drive.files.delete({
      fileId: fileId,
    });
    return true;
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    return false;
  }
};

/**
 * Get file information from Google Drive
 * @param {string} fileId - Google Drive file ID
 * @returns {Promise<Object>} - File information
 */
export const getFileInfo = async (fileId) => {
  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, size, mimeType, webViewLink, webContentLink, createdTime, modifiedTime',
    });
    return response.data;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw new Error('Failed to get file information');
  }
};
