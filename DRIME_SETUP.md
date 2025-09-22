# Drime Cloud Storage Integration Setup

## Overview
This application now uses Drime cloud storage for PDF file management instead of Google Drive. This provides better security, performance, and control over file access.

## Setup Instructions

### 1. Drime API Configuration

1. **Get Drime API Credentials:**
   - Visit [https://app.drime.cloud/api-docs](https://app.drime.cloud/api-docs)
   - Create an account and obtain your API key
   - Create a bucket for storing materials

2. **Environment Variables:**
   Add these to your `.env` file in the `api` directory:

   ```env
   # Drime Cloud Storage Configuration
   DRIME_API_KEY=your_drime_api_key_here
   DRIME_API_BASE_URL=https://api.drime.cloud
   DRIME_BUCKET_ID=your_drime_bucket_id_here
   ```

### 2. Features Implemented

#### Backend Features:
- ✅ **File Upload API** (`/api/upload/material`)
  - PDF file validation and compression
  - Automatic thumbnail generation
  - Metadata storage with Drime
  - File size optimization

- ✅ **File Management**
  - Upload to Drime cloud storage
  - Automatic file cleanup
  - Error handling and validation
  - Progress tracking

- ✅ **Security Features**
  - Authentication required for uploads
  - File type validation (PDF only)
  - Size limits (50MB max)
  - Input sanitization

#### Frontend Features:
- ✅ **Upload Page** (replaces About page)
  - Modern, responsive design
  - Drag-and-drop file upload
  - Real-time upload progress
  - Form validation
  - Material management dashboard

- ✅ **Enhanced PDF Viewer**
  - Support for Drime URLs
  - Fallback to Google Drive URLs
  - Better error handling
  - Improved loading states

### 3. API Endpoints

#### Upload Endpoints:
- `POST /api/upload/material` - Upload new material
- `GET /api/upload/stats` - Get upload statistics
- `DELETE /api/upload/material/:id` - Delete uploaded material

#### Material Endpoints:
- `GET /api/materials` - Get all materials
- `GET /api/materials/:type` - Get materials by type
- `GET /api/materials/pdf-proxy/:id` - Proxy PDF requests

### 4. File Structure

```
api/
├── utils/
│   ├── drime.js          # Drime API integration
│   └── googleDrive.js    # Legacy Google Drive support
├── controllers/
│   └── upload.js         # File upload controller
├── routes/
│   └── upload.js         # Upload routes
└── models/
    └── Material.js       # Updated with Drime fields

client/
├── src/
│   ├── pages/
│   │   └── Upload.jsx    # New upload page
│   ├── components/
│   │   └── PDFViewer.jsx # Enhanced PDF viewer
│   └── config/
│       └── api.js        # Updated API endpoints
```

### 5. Usage

#### For Users:
1. Navigate to the "Upload" page (replaces About)
2. Login to access upload functionality
3. Fill out the material form
4. Select a PDF file (max 50MB)
5. Submit to upload to Drime cloud storage
6. View and manage uploaded materials

#### For Developers:
1. Set up Drime API credentials
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start the server: `npm start`

### 6. Benefits of Drime Integration

- **Better Security**: Files are stored securely in the cloud
- **Improved Performance**: Optimized file delivery
- **Scalability**: Handles large files and high traffic
- **Analytics**: Track file access and usage
- **Cost Effective**: Pay only for what you use
- **Reliability**: 99.9% uptime guarantee

### 7. Migration from Google Drive

The system maintains backward compatibility:
- Existing Google Drive files continue to work
- New uploads use Drime storage
- PDF viewer supports both URL types
- Gradual migration possible

### 8. Troubleshooting

#### Common Issues:
1. **Upload fails**: Check Drime API credentials
2. **PDFs not loading**: Verify CORS settings
3. **File too large**: Check 50MB limit
4. **Authentication errors**: Ensure user is logged in

#### Debug Steps:
1. Check browser console for errors
2. Verify API endpoint responses
3. Confirm Drime API key is valid
4. Test with smaller files first

### 9. Next Steps

- [ ] Set up Drime API credentials
- [ ] Test file upload functionality
- [ ] Configure production environment
- [ ] Monitor file storage usage
- [ ] Implement file analytics dashboard

## Support

For issues with Drime integration:
1. Check the [Drime API documentation](https://app.drime.cloud/api-docs)
2. Review error logs in the console
3. Verify environment configuration
4. Test with the provided sample files
