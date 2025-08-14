# Hostel Management System - Backend API

A comprehensive RESTful API for hostel management system built with Node.js, Express.js, MongoDB, and JWT authentication.

## Features

### 🔐 Authentication & Authorization
- User registration with email verification
- Secure login with JWT tokens
- Password reset functionality
- Role-based access control (Student, Warden, Admin)
- Account lockout protection
- Refresh token mechanism

### 👤 User Management
- Complete user profiles with file upload
- User statistics and analytics
- Account activation/deactivation
- Profile picture upload
- Password change functionality

### 🛡️ Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting for authentication routes
- Input validation and sanitization
- Helmet.js for security headers
- CORS protection
- File upload validation

### 📧 Email Services
- Welcome emails
- Email verification
- Password reset emails
- Custom email templates

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Email Service**: Nodemailer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: Nodemon, Morgan

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hostel_Management_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/hostel_management
   
   # JWT Secrets
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   
   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=noreply@hostelmanagement.com
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1995-01-15",
  "gender": "male",
  "role": "student"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "Password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john.doe@example.com"
}
```

#### Reset Password
```http
PUT /api/auth/reset-password/:resettoken
Content-Type: application/json

{
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

#### Verify Email
```http
GET /api/auth/verify-email/:token
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### User Management Endpoints

#### Get All Users (Admin Only)
```http
GET /api/users?page=1&limit=10&role=student&search=john
Authorization: Bearer <admin_token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "phoneNumber": "+1234567891"
}
```

#### Change Password
```http
PUT /api/users/:id/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

#### Upload Profile Picture
```http
POST /api/users/:id/profile-picture
Authorization: Bearer <token>
Content-Type: multipart/form-data

profilePicture: [file]
```

#### Toggle User Status (Admin Only)
```http
PATCH /api/users/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "isActive": false
}
```

#### Delete User (Admin Only)
```http
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

#### Get User Statistics (Admin Only)
```http
GET /api/users/stats
Authorization: Bearer <admin_token>
```

## Data Models

### User Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['student', 'warden', 'admin']),
  phoneNumber: String (required),
  dateOfBirth: Date (required),
  gender: String (enum: ['male', 'female', 'other']),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  profilePicture: String,
  isEmailVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date,
  refreshTokens: [{ token: String, createdAt: Date }],
  loginAttempts: Number,
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

### Password Security
- Minimum 6 characters
- Must contain uppercase, lowercase, and number
- Hashed using bcrypt with salt rounds of 12
- Password reset tokens expire in 10 minutes

### Account Security
- Account lockout after 5 failed login attempts
- Lockout duration: 2 hours
- Email verification required for new accounts
- JWT tokens expire in 7 days
- Refresh tokens expire in 30 days

### API Security
- Rate limiting: 100 requests per 15 minutes
- Auth rate limiting: 5 requests per 15 minutes
- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- File upload size limits (5MB max)

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | development |
| `PORT` | Server port | No | 5000 |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | Yes | - |
| `JWT_EXPIRE` | Access token expiry | No | 7d |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry | No | 30d |
| `EMAIL_SERVICE` | Email service provider | Yes | gmail |
| `EMAIL_USERNAME` | Email username | Yes | - |
| `EMAIL_PASSWORD` | Email app password | Yes | - |
| `EMAIL_FROM` | From email address | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:3000 |
| `MAX_FILE_SIZE` | Max upload file size | No | 5242880 (5MB) |

## Development

### Scripts
```bash
npm start         # Start production server
npm run dev       # Start development server with nodemon
npm test          # Run tests
npm run test:watch # Run tests in watch mode
```

### Project Structure
```
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
├── models/           # Database models
├── routes/           # API routes
├── utils/            # Utility functions
├── uploads/          # File uploads directory
├── .env             # Environment variables
├── server.js        # Main server file
└── package.json     # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.
