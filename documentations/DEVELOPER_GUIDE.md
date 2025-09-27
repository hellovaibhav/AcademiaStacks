# AcademiaStacks Developer Guide

## 🚀 Project Overview

AcademiaStacks is a comprehensive educational platform that allows students and educators to share, organize, and access academic materials. The platform is built with a modern tech stack and follows best practices for security, performance, and maintainability.

## 🏗️ Architecture

### Frontend (React.js)
- **Framework**: React 18 with functional components and hooks
- **Routing**: React Router v6 for client-side navigation
- **State Management**: React Context API for global state
- **Styling**: Tailwind CSS for responsive design
- **UI Components**: Custom components with Framer Motion animations
- **HTTP Client**: Axios for API communication
- **PDF Handling**: PDF.js for PDF viewing and thumbnail generation

### Backend (Node.js)
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with refresh token mechanism
- **Security**: Helmet, CORS, Rate Limiting, Input Sanitization
- **File Storage**: Google Drive integration for file storage
- **Email Service**: Nodemailer for OTP verification
- **Environment**: Environment-based configuration

## 📁 Project Structure

```
AcademiaStacks/
├── api/                          # Backend API server
│   ├── controllers/              # Route controllers
│   │   ├── admin.js             # Admin operations
│   │   ├── auth.js              # Authentication logic
│   │   ├── material.js          # Material management
│   │   ├── upload.js            # File upload handling
│   │   └── user.js              # User management
│   ├── models/                   # Database models
│   │   ├── User.js              # User schema
│   │   ├── Material.js          # Material schema
│   │   └── Feedback.js          # Feedback schema
│   ├── routes/                   # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── materials.js         # Material routes
│   │   ├── upload.js            # Upload routes
│   │   └── admin.js             # Admin routes
│   ├── utils/                    # Utility functions
│   │   ├── emailService.js      # Email configuration
│   │   ├── verifyToken.js       # JWT verification
│   │   └── googleDrive.js       # Google Drive integration
│   └── index.js                  # Main server file
├── client/                       # Frontend React application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── NavbarHead.jsx   # Main navigation
│   │   │   ├── PDFViewer.jsx    # PDF viewing component
│   │   │   ├── Toast.jsx        # Notification system
│   │   │   └── Loader.jsx       # Loading indicators
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # User login
│   │   │   ├── User.jsx         # User dashboard
│   │   │   ├── Upload.jsx       # Material upload
│   │   │   └── AdminDashboard.jsx # Admin panel
│   │   ├── context/              # React Context providers
│   │   │   └── AuthContext.js   # Authentication context
│   │   ├── services/             # API services
│   │   │   └── authService.js   # Authentication service
│   │   ├── utils/                # Utility functions
│   │   │   └── pdfThumbnail.js  # PDF thumbnail generation
│   │   └── config/               # Configuration files
│   │       └── api.js           # API endpoints
│   └── public/                   # Static assets
└── documentations/               # Project documentation
```

## 🔧 Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Environment Variables

Create a `.env` file in the `api/` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/academiastacks
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/academiastacks

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key

# Email Configuration
MAILID=your-email@gmail.com
MAILPASS=your-app-password

# Server Configuration
PORT=8800
NODE_ENV=development

# Google Drive Configuration (for file storage)
GOOGLE_DRIVE_CLIENT_ID=your-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-client-secret
GOOGLE_DRIVE_REDIRECT_URI=your-redirect-uri
GOOGLE_DRIVE_REFRESH_TOKEN=your-refresh-token
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AcademiaStacks
   ```

2. **Install backend dependencies**
   ```bash
   cd api
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd api
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm start
   ```

## 🔐 Authentication System

### JWT Token Management
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal
- **Automatic Refresh**: Tokens are automatically refreshed before expiration
- **Secure Storage**: Tokens stored in localStorage with httpOnly cookies

### User Roles
- **Student**: Can upload, view, and organize materials
- **Admin**: Can moderate content, manage users, and view analytics

### Authentication Flow
1. User registers with email and password
2. OTP sent to email for verification
3. After verification, user can login
4. JWT tokens issued for authenticated requests
5. Tokens automatically refreshed as needed

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  branch: String,
  batch: String,
  isAdmin: Boolean,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Material Model
```javascript
{
  subject: String,
  materialType: String, // 'assignment', 'notes', 'pyq', 'handouts'
  semester: String,
  instructorName: [String],
  materialLink: String, // Google Drive URL
  thumbnailUrl: String,
  contributedBy: String,
  upvotes: [String], // Array of user emails
  status: String, // 'pending', 'verified', 'rejected'
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ Security Features

### API Security
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Input Sanitization**: Prevents NoSQL injection
- **JWT Verification**: All protected routes require valid tokens

### Frontend Security
- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: SameSite cookies
- **Secure Storage**: Sensitive data properly handled
- **Error Handling**: No sensitive information in error messages

## 🚀 Deployment

### Backend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Frontend Deployment (Vercel)
1. Build the React app: `npm run build`
2. Deploy the `build` folder to Vercel
3. Configure environment variables for API endpoints

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Configure network access and database users
3. Update `MONGODB_URI` in environment variables

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd api
npm test

# Frontend tests
cd client
npm test
```

### Test Coverage
- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests for React components

## 📝 Code Style and Standards

### ESLint Configuration
- React-specific rules
- JavaScript best practices
- Consistent code formatting
- No console.log statements in production

### Code Organization
- **Components**: Reusable UI components
- **Pages**: Full page components
- **Services**: API communication logic
- **Utils**: Helper functions
- **Context**: Global state management

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)
- **Files**: camelCase for components, kebab-case for utilities

## 🔧 Common Development Tasks

### Adding a New Page
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.js`
3. Add navigation link if needed
4. Implement authentication if required

### Adding a New API Endpoint
1. Create controller function in `api/controllers/`
2. Add route in `api/routes/`
3. Update API endpoints in `client/src/config/api.js`
4. Test with frontend integration

### Database Changes
1. Update model schema in `api/models/`
2. Create migration if needed
3. Update API endpoints to handle new fields
4. Update frontend to display new data

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Issues
- Check `MONGODB_URI` in environment variables
- Ensure MongoDB is running
- Verify network access for cloud databases

#### Authentication Problems
- Check JWT secret configuration
- Verify token expiration settings
- Clear localStorage and cookies

#### File Upload Issues
- Verify Google Drive credentials
- Check file size limits
- Ensure proper MIME type validation

### Debug Mode
Set `NODE_ENV=development` to enable:
- Detailed error messages
- Stack traces in API responses
- Console logging for debugging

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verification` - OTP verification
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

### Material Endpoints
- `GET /api/materials` - Get all materials
- `POST /api/materials` - Create new material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material
- `POST /api/materials/:id/upvote` - Upvote material

### Admin Endpoints
- `GET /api/admin/materials` - Get pending materials
- `PUT /api/admin/materials/:id/approve` - Approve material
- `PUT /api/admin/materials/:id/reject` - Reject material
- `GET /api/admin/stats` - Get platform statistics

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Make changes with proper commits
3. Test thoroughly
4. Create pull request
5. Code review and merge

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📞 Support

For questions or issues:
- Create an issue in the GitHub repository
- Check existing documentation
- Review code comments for implementation details

## 🔄 Updates and Maintenance

### Regular Maintenance
- Update dependencies monthly
- Monitor error logs
- Review security configurations
- Backup database regularly

### Performance Monitoring
- Monitor API response times
- Track database query performance
- Monitor memory usage
- Check error rates

---

**Happy Coding! 🚀**

This guide should help new developers understand the project structure, setup, and development workflow. For specific implementation details, refer to the code comments and inline documentation.
