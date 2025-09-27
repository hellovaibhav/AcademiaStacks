# AcademiaStacks API Documentation

## 🚀 Base URL
- **Development**: `http://localhost:8800`
- **Production**: `https://academiastacks-api.vercel.app`

## 🔐 Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📋 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "branch": "Computer Science",
  "batch": "2024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for OTP verification.",
  "data": {
    "userId": "64a1b2c3d4e5f6789abcdef0"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "name": "John Doe",
      "email": "john@example.com",
      "branch": "Computer Science",
      "batch": "2024",
      "isAdmin": false
    }
  }
}
```

#### Verify OTP
```http
POST /api/auth/verification
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### Resend OTP
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Material Endpoints

#### Get All Materials
```http
GET /api/materials?type=assignment&semester=3&branch=CS&page=1&limit=10
```

**Query Parameters:**
- `type`: Material type (assignment, notes, pyq, handouts)
- `semester`: Semester number
- `branch`: Branch name
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "id": "64a1b2c3d4e5f6789abcdef1",
        "subject": "Data Structures",
        "materialType": "assignment",
        "semester": "3",
        "instructorName": ["Dr. Smith"],
        "materialLink": "https://drive.google.com/file/d/...",
        "thumbnailUrl": "https://drive.google.com/thumbnail/...",
        "contributedBy": "John Doe",
        "upvotes": ["user1@example.com", "user2@example.com"],
        "status": "verified",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Get Material by ID
```http
GET /api/materials/64a1b2c3d4e5f6789abcdef1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "material": {
      "id": "64a1b2c3d4e5f6789abcdef1",
      "subject": "Data Structures",
      "materialType": "assignment",
      "semester": "3",
      "instructorName": ["Dr. Smith"],
      "materialLink": "https://drive.google.com/file/d/...",
      "thumbnailUrl": "https://drive.google.com/thumbnail/...",
      "contributedBy": "John Doe",
      "upvotes": ["user1@example.com", "user2@example.com"],
      "status": "verified",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### Upvote Material
```http
POST /api/materials/64a1b2c3d4e5f6789abcdef1/upvote
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Upvoted successfully"
}
```

### Upload Endpoints

#### Upload Material
```http
POST /api/upload/material
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data

{
  "file": <file>,
  "subject": "Data Structures",
  "materialType": "assignment",
  "semester": "3",
  "instructorName": ["Dr. Smith"],
  "branch": "Computer Science"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Material uploaded successfully",
  "data": {
    "materialId": "64a1b2c3d4e5f6789abcdef2",
    "materialLink": "https://drive.google.com/file/d/...",
    "thumbnailUrl": "https://drive.google.com/thumbnail/..."
  }
}
```

#### Get User's Uploaded Materials
```http
GET /api/upload/materials
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "id": "64a1b2c3d4e5f6789abcdef2",
        "subject": "Data Structures",
        "materialType": "assignment",
        "semester": "3",
        "instructorName": ["Dr. Smith"],
        "materialLink": "https://drive.google.com/file/d/...",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### Delete Material
```http
DELETE /api/upload/material/64a1b2c3d4e5f6789abcdef2
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Material deleted successfully"
}
```

### User Profile Endpoints

#### Get User Profile
```http
GET /api/user-profile/64a1b2c3d4e5f6789abcdef0
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "name": "John Doe",
      "email": "john@example.com",
      "branch": "Computer Science",
      "batch": "2024",
      "isAdmin": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### Get User Statistics
```http
GET /api/user-profile/64a1b2c3d4e5f6789abcdef0/stats
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "uploaded": 15,
      "upvoted": 42,
      "saved": 8,
      "totalUpvotesReceived": 127
    }
  }
}
```

#### Get User's Materials by Type
```http
GET /api/user-profile/64a1b2c3d4e5f6789abcdef0/uploaded
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "id": "64a1b2c3d4e5f6789abcdef2",
        "subject": "Data Structures",
        "materialType": "assignment",
        "semester": "3",
        "instructorName": ["Dr. Smith"],
        "materialLink": "https://drive.google.com/file/d/...",
        "upvotes": ["user1@example.com"],
        "status": "verified",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Admin Endpoints

#### Get Pending Materials
```http
GET /api/admin/materials?status=pending&page=1&limit=10
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "id": "64a1b2c3d4e5f6789abcdef3",
        "subject": "Algorithms",
        "materialType": "notes",
        "semester": "4",
        "instructorName": ["Dr. Johnson"],
        "materialLink": "https://drive.google.com/file/d/...",
        "contributedBy": "Jane Doe",
        "status": "pending",
        "createdAt": "2024-01-16T09:15:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Approve Material
```http
PUT /api/admin/materials/64a1b2c3d4e5f6789abcdef3/approve
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "adminNotes": "Approved - Good quality material"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Material approved successfully"
}
```

#### Reject Material
```http
PUT /api/admin/materials/64a1b2c3d4e5f6789abcdef3/reject
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "reason": "Poor quality content",
  "adminNotes": "Please improve the material quality and resubmit"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Material rejected and deleted from storage"
}
```

#### Get Admin Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalMaterials": 1250,
      "pendingMaterials": 15,
      "verifiedMaterials": 1200,
      "rejectedMaterials": 35,
      "totalUsers": 500,
      "activeUsers": 450,
      "totalUpvotes": 5000,
      "materialsByType": {
        "assignment": 400,
        "notes": 350,
        "pyq": 300,
        "handouts": 200
      }
    }
  }
}
```

### Feedback Endpoints

#### Submit Feedback
```http
POST /api/feedbacks
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Feature Request",
  "message": "Please add dark mode support",
  "type": "suggestion"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

### Statistics Endpoints

#### Get Platform Statistics
```http
GET /api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalMaterials": 1250,
      "totalUsers": 500,
      "contributorsCount": 200,
      "verifiedMaterials": 1200,
      "materialsByType": {
        "assignment": 400,
        "notes": 350,
        "pyq": 300,
        "handouts": 200
      },
      "materialsByBranch": {
        "Computer Science": 500,
        "Electronics": 300,
        "Mechanical": 250,
        "Civil": 200
      }
    }
  }
}
```

## 🔒 Error Responses

### Standard Error Format
```json
{
  "success": false,
  "status": 400,
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

### Common Error Codes

#### 400 Bad Request
```json
{
  "success": false,
  "status": 400,
  "message": "Validation error: Email is required"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "status": 401,
  "message": "Invalid or expired token"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "status": 403,
  "message": "Access denied. Admin privileges required"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "status": 404,
  "message": "Material not found"
}
```

#### 429 Too Many Requests
```json
{
  "success": false,
  "status": 429,
  "message": "Too many requests. Please try again later"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "status": 500,
  "message": "Internal server error"
}
```

#### 503 Service Unavailable
```json
{
  "success": false,
  "status": 503,
  "message": "Database connection not available. Please try again later"
}
```

## 🔄 Rate Limiting

### Authentication Endpoints
- **Limit**: 5 requests per 15 minutes per IP
- **Endpoints**: `/api/auth/login`, `/api/auth/register`, `/api/auth/verification`, `/api/auth/resend-otp`

### General Endpoints
- **Limit**: 100 requests per 15 minutes per IP
- **Endpoints**: All other API endpoints

## 📝 Request/Response Examples

### Complete Authentication Flow

1. **Register User**
```bash
curl -X POST http://localhost:8800/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "branch": "Computer Science",
    "batch": "2024"
  }'
```

2. **Verify OTP**
```bash
curl -X POST http://localhost:8800/api/auth/verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

3. **Login**
```bash
curl -X POST http://localhost:8800/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

4. **Upload Material**
```bash
curl -X POST http://localhost:8800/api/upload/material \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "file=@document.pdf" \
  -F "subject=Data Structures" \
  -F "materialType=assignment" \
  -F "semester=3" \
  -F "instructorName=Dr. Smith" \
  -F "branch=Computer Science"
```

## 🧪 Testing

### Using Postman
1. Import the API collection
2. Set environment variables for base URL and tokens
3. Run the authentication flow first
4. Use the returned token for protected endpoints

### Using cURL
```bash
# Test server health
curl http://localhost:8800/

# Test authentication
curl -X POST http://localhost:8800/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📊 Monitoring

### Health Check
```http
GET /
```

**Response:**
```json
{
  "message": "The app is up and running",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

### Database Status
The API includes automatic database health checks and will return 503 status if the database is unavailable.

---

**Note**: This API documentation is automatically generated and should be kept up to date with any changes to the endpoints.
