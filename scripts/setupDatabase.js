import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

// Use __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import User model
import User from '../models/User.models.js';

// Sample users
const sampleUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@hostelmanagement.com',
    password: 'Admin@123',
    phoneNumber: '+1234567890',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    role: 'admin',
    isEmailVerified: true,
    address: {
      street: '123 Admin Street',
      city: 'Admin City',
      state: 'Admin State',
      zipCode: '12345',
      country: 'India'
    }
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@student.com',
    password: 'Student@123',
    phoneNumber: '+1234567891',
    dateOfBirth: '1995-05-15',
    gender: 'male',
    role: 'student',
    isEmailVerified: true,
    address: {
      street: '456 Student Street',
      city: 'Student City',
      state: 'Student State',
      zipCode: '54321',
      country: 'India'
    }
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@warden.com',
    password: 'Warden@123',
    phoneNumber: '+1234567892',
    dateOfBirth: '1985-08-20',
    gender: 'female',
    role: 'warden',
    isEmailVerified: true,
    address: {
      street: '789 Warden Street',
      city: 'Warden City',
      state: 'Warden State',
      zipCode: '67890',
      country: 'India'
    }
  },
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@student.com',
    password: 'Student@123',
    phoneNumber: '+1234567893',
    dateOfBirth: '1996-12-10',
    gender: 'female',
    role: 'student',
    isEmailVerified: false,
    address: {
      street: '321 Student Avenue',
      city: 'Student Town',
      state: 'Student State',
      zipCode: '13579',
      country: 'India'
    }
  },
  {
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob.wilson@student.com',
    password: 'Student@123',
    phoneNumber: '+1234567894',
    dateOfBirth: '1997-03-25',
    gender: 'male',
    role: 'student',
    isEmailVerified: true,
    address: {
      street: '654 Student Road',
      city: 'Student Village',
      state: 'Student State',
      zipCode: '97531',
      country: 'India'
    }
  }
];

const setupDatabase = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear users
    console.log('🧹 Clearing existing user data...');
    await User.deleteMany({});

    // Insert new sample users
    console.log('👥 Creating sample users...');
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📝 Sample Login Credentials:');
    console.log('Admin: admin@hostelmanagement.com / Admin@123');
    console.log('Student: john.doe@student.com / Student@123');
    console.log('Warden: jane.smith@warden.com / Warden@123');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run setup if file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  setupDatabase();
}

export default setupDatabase;
