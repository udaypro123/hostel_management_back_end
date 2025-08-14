# Hostel Management System - Backend Architecture Summary

## 🏗️ Project Structure

```
hostel_Management_backend/
├── controllers/           # HTTP request handlers (thin layer)
│   ├── authController.js  # Authentication endpoints
│   └── userController.js  # User management endpoints
├── dbc/                  # Database & Business Logic (core logic)
│   ├── authService.js    # Authentication business logic
│   ├── userService.js    # User management business logic
│   └── index.js          # Service exports
├── middleware/           # Express middleware
│   ├── auth.js          # JWT authentication middleware
│   ├── errorHandler.js  # Global error handling
│   ├── fileUpload.js    # File upload middleware
│   ├── notFound.js      # 404 handler
│   └── validation.js    # Input validation
├── models/              # Database models
│   └── User.js          # User model with Mongoose
├── routes/              # API route definitions
│   ├── auth.js          # Authentication routes
│   └── users.js         # User management routes
├── scripts/             # Utility scripts
│   └── setupDatabase.js # Database setup script
├── tests/               # Test files
│   └── auth.test.js     # Authentication tests
├── utils/               # Utility functions
│   ├── emailService.js  # Email sending utilities
│   └── fileUpload.js    # File upload utilities
├── .env                 # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── postman_collection.json # API testing collection
├── README.md           # Project documentation
├── server.js           # Main server file
└── start.bat           # Windows startup script
```

## 🔧 Architecture Overview

### 1. **Separation of Concerns**
- **Controllers**: Handle HTTP requests/responses only
- **DBC (Database/Business Logic)**: Contains all business logic and database operations
- **Models**: Define data structure and validation
- **Middleware**: Handle cross-cutting concerns (auth, validation, etc.)
- **Utils**: Reusable utility functions

### 2. **Clean Controller Pattern**
Controllers are now thin layers that:
- Receive HTTP requests
- Call appropriate service methods
- Return formatted responses
- Handle errors consistently

Example:
```javascript
const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    sendTokenResponse(result.user, result.tokens, 201, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
```

### 3. **Service Layer (DBC)**
All business logic is contained in service classes:
- **AuthService**: Handles authentication, registration, password reset
- **UserService**: Handles user management, profile updates, statistics

## 🔐 Authentication & Authorization

### Features Implemented:
1. **User Registration** with email verification
2. **Secure Login** with JWT tokens
3. **Password Reset** functionality
4. **Email Verification** system
5. **Role-based Access Control** (Student, Warden, Admin)
6. **Account Lockout** protection
7. **Refresh Token** mechanism

### JWT Token Strategy:
- **Access Token**: Short-lived (7 days) for API access
- **Refresh Token**: Long-lived (30 days) for token renewal
- **Cookie Storage**: Secure HTTP-only cookies
- **Token Rotation**: Old refresh tokens removed on logout

## 📊 User Management System

### Features:
1. **User CRUD Operations**
2. **Profile Management** with file upload
3. **Password Management**
4. **User Statistics** and analytics
5. **Advanced Search** and filtering
6. **Role-based Permissions**

### User Roles:
- **Student**: Basic user with limited permissions
- **Warden**: Hostel management permissions
- **Admin**: Full system access and user management

## 🛡️ Security Features

### Implemented Security:
1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Rate Limiting**: Prevent brute force attacks
4. **Input Validation**: Comprehensive validation using express-validator
5. **CORS Protection**: Configured for frontend integration
6. **Helmet.js**: Security headers
7. **File Upload Security**: Type and size validation

### Password Policy:
- Minimum 6 characters
- Must contain uppercase, lowercase, and number
- Account lockout after 5 failed attempts
- Lockout duration: 2 hours

## 📧 Email System

### Email Features:
1. **Welcome Emails** on registration
2. **Email Verification** links
3. **Password Reset** emails
4. **Professional Email Templates**
5. **Error Handling** for email failures

### Email Templates:
- Welcome and verification
- Password reset
- Account notifications
- Responsive HTML design

## 🗄️ Database Design

### User Model Features:
- **Comprehensive User Profile**: Personal info, contact details, address
- **Security Fields**: Password, tokens, lockout data
- **Audit Fields**: Creation date, last login, email verification
- **Relationships**: Refresh tokens, address subdocument
- **Indexes**: Optimized for common queries

### Database Operations:
- **MongoDB** with Mongoose ODM
- **Aggregation Pipelines** for statistics
- **Indexes** for performance
- **Validation** at model level

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env` file with:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostel_management
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
```

### 3. Setup Database
```bash
npm run setup
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test API
Import `postman_collection.json` into Postman for testing.

## 📝 API Endpoints

### Authentication Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email

### User Management Endpoints:
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/password` - Change password
- `POST /api/users/:id/profile-picture` - Upload profile picture
- `PATCH /api/users/:id/status` - Toggle user status (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/stats` - Get user statistics (Admin only)

## 🧪 Testing

### Sample Login Credentials:
- **Admin**: admin@hostelmanagement.com / Admin@123
- **Student**: john.doe@student.com / Student@123
- **Warden**: jane.smith@warden.com / Warden@123

### Testing Tools:
- **Jest**: Unit testing framework
- **Supertest**: API testing
- **Postman Collection**: Manual API testing

## 📊 Key Benefits of This Architecture

1. **Maintainability**: Clean separation of concerns
2. **Scalability**: Easy to add new features
3. **Testability**: Business logic separated from HTTP layer
4. **Reusability**: Services can be used across different endpoints
5. **Security**: Industry-standard authentication and authorization
6. **Performance**: Optimized database queries and caching
7. **Error Handling**: Consistent error responses across the API

This architecture follows industry best practices and provides a solid foundation for a hostel management system with room for future enhancements.
