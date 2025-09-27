# Environment Setup Guide

This guide will help you set up the environment variables for both the API and client sides of AcademiaStacks.

## 📋 Prerequisites

Before setting up environment variables, make sure you have:
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Gmail account for email services
- Google Cloud Console account (for Google Drive integration - optional)

## 🔧 API Environment Setup

### 1. Copy the Example File

```bash
cd api/
cp .env.example .env
```

### 2. Required Environment Variables

The API validates these 5 variables on startup - they are **required**:

#### Database Configuration
```env
MONGODB_URI=mongodb://localhost:27017/academiastacks
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/academiastacks
```

#### Authentication Secrets
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

**Generate secure secrets:**
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate session secret
openssl rand -base64 32
```

#### Email Configuration
```env
MAILID=your-email@gmail.com
MAILPASS=your-app-password
```

**Setup Gmail App Password:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use this app password (not your regular Gmail password)

### 3. Optional Environment Variables

These variables have defaults or are optional:

```env
# Server Configuration
PORT=8800
NODE_ENV=development

# JWT Configuration
JWT_REFRESH=your-jwt-refresh-secret  # Defaults to JWT_SECRET if not provided

# Admin Configuration
ADMIN_EMAIL=admin@example.com  # Defaults to vaves.tech@gmail.com
CLIENT_URL=http://localhost:3000  # For password reset links

# Google Drive Integration (Optional)
GOOGLE_DRIVE_KEY_FILE=./google-drive-key.json
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id
```

## 🎨 Client Environment Setup

### 1. Copy the Example File

```bash
cd client/
cp .env.example .env.local
```

### 2. Required Environment Variables

Only **1 variable is required**:

```env
REACT_APP_API_BASE_URL=http://localhost:8800
```

**For production:**
```env
REACT_APP_API_BASE_URL=https://your-api-domain.com
```

### 3. Optional Environment Variables

```env
# Environment (used for conditional logic)
NODE_ENV=development
```

## 🚀 Quick Start

### 1. API Setup
```bash
cd api/
cp .env.example .env
# Edit .env with your actual values (5 required variables)
npm install
npm run dev
```

### 2. Client Setup
```bash
cd client/
cp .env.example .env.local
# Edit .env.local with your actual API URL
npm install
npm start
```

## 🔒 Security Best Practices

### 1. Never Commit Environment Files
Add these to your `.gitignore`:
```
.env
.env.local
.env.production
.env.staging
```

### 2. Use Strong Secrets
- Generate random, long secrets for JWT and session keys
- Use different secrets for different environments
- Rotate secrets regularly in production

### 3. Environment-Specific Configuration
- Use `.env.local` for local development
- Use `.env.production` for production builds
- Use environment variables in production deployments

### 4. Validate Configuration
The API includes environment validation on startup. Check the console for any missing required variables.

## 🧪 Testing Your Setup

### 1. API Health Check
```bash
curl http://localhost:8800/
# Should return: "The app is up and running"
```

### 2. Database Connection
Check the API console for:
```
✅ Connected to MongoDB Database
```

### 3. Email Service
Check the API console for:
```
✅ Email service is ready to send messages
✅ Email configuration verified
```

### 4. Client Connection
1. Start the client: `npm start`
2. Open http://localhost:3000
3. Check browser console for any errors

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
- Check if MongoDB is running
- Verify the connection string
- Check network access for cloud databases

#### 2. Email Service Failed
- Verify Gmail credentials
- Check if App Password is correct
- Ensure 2FA is enabled

#### 3. Google Drive Integration Failed
- Verify API credentials
- Check if Google Drive API is enabled
- Verify folder ID is correct

#### 4. Client API Connection Failed
- Check if API server is running
- Verify REACT_APP_API_BASE_URL is correct
- Check CORS configuration

### Debug Mode

Enable debug mode for more detailed logs:

**API:**
```env
NODE_ENV=development
```

**Client:**
```env
NODE_ENV=development
```

## 📚 Environment Variables Reference

### API Variables (5 Required)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ | - | MongoDB connection string |
| `JWT_SECRET` | ✅ | - | JWT token signing secret |
| `SESSION_SECRET` | ✅ | - | Session management secret |
| `MAILID` | ✅ | - | Gmail address for sending emails |
| `MAILPASS` | ✅ | - | Gmail app password |

### API Variables (Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8800 | Server port |
| `NODE_ENV` | development | Environment mode |
| `JWT_REFRESH` | JWT_SECRET | JWT refresh token secret |
| `ADMIN_EMAIL` | vaves.tech@gmail.com | Admin email for notifications |
| `CLIENT_URL` | http://localhost:3000 | Client URL for password reset |
| `GOOGLE_DRIVE_KEY_FILE` | ./google-drive-key.json | Google Drive service account key |
| `GOOGLE_DRIVE_FOLDER_ID` | - | Google Drive folder ID |

### Client Variables (1 Required)

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_BASE_URL` | ✅ | Backend API URL |

### Client Variables (Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Environment mode |

## 🤝 Contributing

When contributing to the project:
1. Always use the example files as templates
2. Never commit actual environment files
3. Only add environment variables that are actually used in the code
4. Test your configuration before submitting PRs

---

**Need Help?** Create an issue in the repository or check the [Developer Guide](DEVELOPER_GUIDE.md) for more information.
