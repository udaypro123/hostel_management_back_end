import bcrypt from 'bcryptjs';
import User from '../models/User.models.js';
import Warden from '../models/Warden.models.js'
import { authService } from './index.js';


const createWarden = async (wardenData) => {
  try {
    const { phone, email, firstName , lastName, address, gender} = wardenData;

    let obj={
      phone, 
      email, 
      firstName , 
      lastName,
      password:"Uday@123",
      phoneNumber:phone,
      address,
      role:"warden",
      gender:gender,

    }


    console.log("Incoming data =>", phone, email, wardenData, obj);

    // Check if a user already exists with the email or phone
    const existingUser = await authService.registerUser(obj)

    console.log("existingUser", existingUser?.user, existingUser?.user?._id, existingUser?.user?.id)

    // Link Warden with User ID
    const warden = new Warden({
      ...wardenData,
      userId: existingUser?.user?.id,
    });

    const savedWarden = await warden.save();

    if (!savedWarden && existingUser?.user?.id) {
      // Rollback the user if warden creation failed
      await User.findByIdAndDelete(existingUser?.user?.id);
      console.log("Rolled back newly created user due to warden save failure");
    }
    return savedWarden;
  } catch (error) {
    console.error("Error creating warden:", error);
    throw error;
  }
};

// Get all wardens with filtering and pagination
const getAllWardens = async (filters = {}, options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    if (filters.hostel) {
      query.hostelAssigned = { $regex: filters.hostel, $options: 'i' };
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Execute query
    const wardens = await Warden.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'firstName lastName email');

    const total = await Warden.countDocuments(query);

    return {
      wardens,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw error;
  }
};

// Get warden by ID
const getWardenById = async (id) => {
  try {
    const warden = await Warden.findById(id)
      .populate('createdBy', 'firstName lastName email');
    return warden;
  } catch (error) {
    throw error;
  }
};

// Get warden by email
const getWardenByEmail = async (email) => {
  try {
    return await Warden.findOne({ email });
  } catch (error) {
    throw error;
  }
};

// Update warden
const updateWarden = async (id, updateData) => {
  try {
    const warden = await Warden.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    return warden;
  } catch (error) {
    throw error;
  }
};

// Soft delete warden
const deleteWarden = async (id) => {
  try {
    return await Warden.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

// Hard delete warden (use with caution)
const hardDeleteWarden = async (id) => {
  try {
    return await Warden.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

// Get wardens by hostel
const getWardensByHostel = async (hostelName) => {
  try {
    return await Warden.find({
      hostelAssigned: { $regex: hostelName, $options: 'i' },
      isActive: true
    }).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

// Get active wardens count
const getActiveWardensCount = async () => {
  try {
    return await Warden.countDocuments({ isActive: true });
  } catch (error) {
    throw error;
  }
};

// Get wardens statistics
const getWardenStats = async () => {
  try {
    const totalWardens = await Warden.countDocuments();
    const activeWardens = await Warden.countDocuments({ isActive: true });
    const inactiveWardens = await Warden.countDocuments({ isActive: false });

    // Group by hostel
    const wardensByHostel = await Warden.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$hostelAssigned',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Group by experience range
    const wardensByExperience = await Warden.aggregate([
      { $match: { isActive: true, experience: { $exists: true } } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$experience', 2] }, then: '0-2 years' },
                { case: { $lt: ['$experience', 5] }, then: '2-5 years' },
                { case: { $lt: ['$experience', 10] }, then: '5-10 years' },
                { case: { $gte: ['$experience', 10] }, then: '10+ years' }
              ],
              default: 'Unknown'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      totalWardens,
      activeWardens,
      inactiveWardens,
      wardensByHostel,
      wardensByExperience
    };
  } catch (error) {
    throw error;
  }
};

// Validate warden data
const validateWardenData = (data) => {
  const errors = [];

  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.push('First name is required');
  }

  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.push('Please enter a valid email');
  }

  if (!data.phone || data.phone.trim().length === 0) {
    errors.push('Phone number is required');
  } else if (!/^\+?[\d\s-()]+$/.test(data.phone)) {
    errors.push('Please enter a valid phone number');
  }

  if (data.experience !== undefined && (data.experience < 0 || data.experience > 50)) {
    errors.push('Experience must be between 0 and 50 years');
  }

  if (data.emergencyContact && !/^\+?[\d\s-()]+$/.test(data.emergencyContact)) {
    errors.push('Please enter a valid emergency contact number');
  }

  return errors;
};

export {
  createWarden,
  getAllWardens,
  getWardenById,
  getWardenByEmail,
  updateWarden,
  deleteWarden,
  hardDeleteWarden,
  getWardensByHostel,
  getActiveWardensCount,
  getWardenStats,
  validateWardenData
};
