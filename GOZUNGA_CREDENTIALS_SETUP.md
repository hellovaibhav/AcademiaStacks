# Gozunga Cloud Storage Setup

## 🔑 Required API Credentials

To use the Gozunga cloud storage integration, you need to provide the following credentials:

### 1. Get Gozunga API Credentials

1. **Visit Gozunga Support Center**: [https://support.gozunga.com/en/](https://support.gozunga.com/en/)
2. **Create Account**: Sign up for a Gozunga account
3. **Get API Key**: 
   - Go to your Gozunga Cloud Management Portal
   - Navigate to API Keys section
   - Generate a new API key for your application
4. **Create Storage Bucket**: Create a storage bucket for your materials

### 2. Environment Variables Setup

Add these variables to your `.env` file in the `api` directory:

```env
# Gozunga Cloud Storage Configuration
GOZUNGA_API_KEY=your_gozunga_api_key_here
GOZUNGA_API_BASE_URL=https://api.gozunga.com
GOZUNGA_BUCKET_NAME=academia-stacks
```

### 3. Example .env File

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key

# Email Configuration
MAILID=your_email@gmail.com
MAILPASS=your_email_password

# Gozunga Cloud Storage Configuration
GOZUNGA_API_KEY=gozunga_1234567890abcdef
GOZUNGA_API_BASE_URL=https://api.gozunga.com
GOZUNGA_BUCKET_NAME=academia-stacks

# Server Configuration
PORT=8800
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://academia-stacks.vercel.app
```

## 🚀 Features

### ✅ What Gozunga Provides:
- **Reliable API**: Well-documented API endpoints
- **Cloud Storage**: Scalable file storage solution
- **Security**: Built-in security and access management
- **Infrastructure**: Professional cloud infrastructure services
- **Support**: Dedicated support center and documentation

### ✅ Upload Features:
- **File Upload**: Direct file upload to Gozunga cloud storage
- **Metadata Support**: Custom metadata for each file
- **Thumbnail Generation**: Automatic thumbnail creation for PDFs
- **PDF Compression**: Built-in PDF compression
- **Local Fallback**: Automatic fallback to local storage if cloud is unavailable

## 🔧 Configuration

### API Endpoints Used:
- `POST /v1/storage/upload` - Upload files
- `GET /v1/storage/files` - List files
- `GET /v1/storage/files/{id}` - Get file info
- `DELETE /v1/storage/files/{id}` - Delete files
- `PATCH /v1/storage/files/{id}` - Update file metadata

### Authentication:
- **Bearer Token**: `Authorization: Bearer {GOZUNGA_API_KEY}`
- **Content-Type**: `multipart/form-data` for uploads

## 🛠️ Setup Instructions

### Step 1: Create Gozunga Account
1. Visit [https://support.gozunga.com/en/](https://support.gozunga.com/en/)
2. Click "Get Started" or "Sign Up"
3. Complete the registration process

### Step 2: Get API Credentials
1. Login to your Gozunga account
2. Go to Cloud Management Portal
3. Navigate to "API Keys" section
4. Generate a new API key
5. Copy the API key

### Step 3: Create Storage Bucket
1. In the Cloud Management Portal
2. Go to "Storage" section
3. Create a new bucket named "academia-stacks"
4. Note the bucket name

### Step 4: Update Environment Variables
1. Open your `.env` file in the `api` directory
2. Add the Gozunga configuration variables
3. Save the file

### Step 5: Test the Integration
1. Restart your server
2. Check the console logs for Gozunga configuration status
3. Try uploading a material to test the integration

## 🔍 Troubleshooting

### Common Issues:

#### 1. API Key Not Working
- **Check**: API key is correctly copied
- **Check**: API key has proper permissions
- **Check**: Account is active and verified

#### 2. Bucket Not Found
- **Check**: Bucket name is correct
- **Check**: Bucket exists in your Gozunga account
- **Check**: API key has access to the bucket

#### 3. Upload Failures
- **Check**: File size limits
- **Check**: File type restrictions
- **Check**: Network connectivity

### Debug Information:
The server will log detailed information about:
- ✅ Configuration status
- ✅ API connectivity
- ✅ Upload progress
- ✅ Error messages

## 📊 Monitoring

### Upload Status Endpoint:
```
GET /api/upload/status
```

This endpoint provides:
- Gozunga configuration status
- Local storage status
- List of uploaded files
- Storage statistics

## 🔄 Migration from Drime

If you're migrating from Drime:
1. **Keep local storage**: Files will continue to work
2. **Update environment**: Replace Drime variables with Gozunga
3. **Test uploads**: Verify new uploads work with Gozunga
4. **Gradual migration**: Move files from local to Gozunga over time

## 📞 Support

- **Gozunga Support**: [https://support.gozunga.com/en/](https://support.gozunga.com/en/)
- **API Documentation**: Available in Gozunga Cloud Management Portal
- **Community Support**: Check Gozunga community forums

## 🎯 Benefits of Gozunga

- **Reliability**: Established cloud infrastructure provider
- **Performance**: Fast upload and download speeds
- **Scalability**: Handles growing storage needs
- **Security**: Enterprise-grade security features
- **Support**: Professional support and documentation
- **Cost-Effective**: Competitive pricing for cloud storage
