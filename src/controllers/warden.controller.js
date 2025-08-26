import Warden from '../models/Warden.models.js'
import {CreateWarden} from "../dbc/warden.dbc.js"
import { validationResult } from 'express-validator'
import { Hostel } from '../models/Hostel.models.js';
import { ResponseCode } from '../utils/responseList.js';



// const createWarden = async (req, res) => {
//   try {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     // Validate warden data using service
//     const validationErrors = wardenService.validateWardenData(req.body);
//     if (validationErrors.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: validationErrors
//       });
//     }

//     // Check if warden with email already exists
//     const existingWarden = await wardenService.getWardenByEmail(req.body.email);
//     if (existingWarden) {
//       return res.status(400).json({
//         success: false,
//         message: 'Warden with this email already exists'
//       });
//     }

//     // Prepare warden data
//     const wardenData = {
//       ...req.body,
//       experience: req.body.experience ? parseInt(req.body.experience) : undefined,
//       joiningDate: req.body.joiningDate ? new Date(req.body.joiningDate) : undefined,
//       createdBy: req.user.id
//     };

//     const warden = await wardenService.createWarden(wardenData);

//     res.status(201).json({
//       success: true,
//       message: 'Warden created successfully',
//       data: warden
//     });
//   } catch (error) {
//     console.error('Create warden error:', error);
    
//     // Handle duplicate key error
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Warden with this email already exists'
//       });
//     }
    
//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: messages
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Error creating warden',
//       error: error.message
//     });
//   }
// };

const createWarden = function (req, res, next) {

    console.log("--------------->req ", req.body)
    CreateWarden(req.body, (err, code, warden) => {
      console.log(warden)
        if (err) {
            // Internal server error
            logger.log({
                level: 'error',
                message: 'add warden - Error - ' + err,
                requestId: req?.id || "Unknown"
            });
            return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
        }

        if (code === ResponseCode.SuccessCode) {
            return res.status(200).json({ code, message: "warden created successfully", data: warden });
        }

        // fallback error
        return res.status(422).json({ code, message: "Error while creating warden" });
    });
};


const getWarden = async (req, res) => {
  try {
    const warden = await Warden.find()

    if (!warden) {
      return res.status(404).json({
        success: false,
        message: 'Warden not found'
      });
    }

    res.status(200).json({
      success: true,
      data: warden
    });
  } catch (error) {
    console.error('Get warden error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid warden ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching warden',
      error: error.message
    });
  }
};

const getWardenById = async (req, res) => {
  try {

    console.log(req.body, "bodyy")
    const {wardenId}= req.body
    const warden = await Hostel.findOne(wardenId)
    .populate("wardenId")
    .populate("rooms")
    // const wardenUser = await Hostel.findOne({wardenId:warden?._id}).populate("rooms")
    console.log("warden", warden)

    if (!warden) {
      return res.status(404).json({
        success: false,
        message: 'Warden not found'
      });
    }

    res.status(200).json({
      success: true,
      data: warden
    });
  } catch (error) {
    console.error('Get warden error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid warden ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching warden',
      error: error.message
    });
  }
};

const updateWarden = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      experience,
      qualification,
      emergencyContact,
      joiningDate,
      isActive
    } = req.body;
    console.log('Update Warden Data:', req.body);
    console.log('Update Warden ID:', req.params.id);
    // Check if warden exists
    let warden = await Warden.findById(req.body.id);
    if (!warden) {
      return res.status(404).json({
        success: false,
        message: 'Warden not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== warden.email) {
      const existingWarden = await Warden.findOne({ email });
      if (existingWarden) {
        return res.status(400).json({
          success: false,
          message: 'Warden with this email already exists'
        });
      }
    }

    // Update warden
    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      address,
      experience: experience ? parseInt(experience) : warden.experience,
      qualification,
      emergencyContact,
      joiningDate: joiningDate ? new Date(joiningDate) : warden.joiningDate,
      isActive: isActive !== undefined ? isActive : warden.isActive
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    warden = await Warden.findByIdAndUpdate(
      req.body.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Warden updated successfully',
      data: warden
    });
  } catch (error) {
    console.error('Update warden error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid warden ID'
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Warden with this email already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating warden',
      error: error.message
    });
  }
};

// @desc    Delete warden
// @route   DELETE /api/wardens/:id
// @access  Private (Admin)
const deleteWarden = async (req, res) => {
  try {
    console.log('Delete Warden ID:', req.body);
    const warden = await Warden.findById(req.body.wardenId);

    if (!warden) {
      return res.status(404).json({
        success: false,
        message: 'Warden not found'
      });
    }

    // Soft delete - just set isActive to false
    await Warden.findByIdAndUpdate(req.body.wardenId, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Warden deleted successfully'
    });
  } catch (error) {
    console.error('Delete warden error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid warden ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting warden',
      error: error.message
    });
  }
};

// @desc    Get wardens by hostel
// @route   GET /api/wardens/hostel/:hostelName
// @access  Private (Admin/Warden)
const getWardensByHostel = async (req, res) => {
  try {
    const hostelName = decodeURIComponent(req.params.hostelName);
    
    const wardens = await Warden.find({
      hostelAssigned: { $regex: hostelName, $options: 'i' },
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: wardens.length,
      data: wardens
    });
  } catch (error) {
    console.error('Get wardens by hostel error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wardens by hostel',
      error: error.message
    });
  }
};



export {
  getWarden,
  createWarden,
  updateWarden,
  deleteWarden,
  getWardensByHostel,
  getWardenById
};
