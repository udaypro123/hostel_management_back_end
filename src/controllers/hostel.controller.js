import { hostelService } from '../dbc/index.js';
import { Hostel } from '../models/Hostel.models.js'

// @desc    Create a new hostel
// @route   POST /api/hostels
// @access  Private/Admin
const createHostel = async (req, res) => {
  console.log('Creating hostel with data:', req.body, 'by user:', req.user.id);
  const ownerId = req?.user?.ownerId;
  try {
    const hostel = await hostelService.createHostel(req.body, req.user.id, ownerId);

    if (!hostel) {
      return res.status(400).json({
        success: false,
        message: 'Error creating hostel'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Hostel created successfully',
      data: hostel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const updateHostel = async (req, res) => {
  console.log('Updating hostel with data: update hostel controller', req.body);

  try {
    const hostel = await hostelService.updateHostel(req.body);

    if (!hostel) {
      return res.status(400).json({
        success: false,
        message: 'Error updating hostel'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hostel updated successfully',
      data: hostel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const deleteHostel = async (req, res) => {
  console.log('Updating hostel with data: update hostel controller', req.body);

  try {
    const hostel = await hostelService.deleteHostel(req.body);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hostel deleted successfully',
      data: hostel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all hostels
// @route   GET /api/hostels
// @access  Public

const getHostels = async (req, res) => {
  try {
    const ownerId = req?.user?.ownerId
    const hostels = await Hostel.find({ ownerId: ownerId });

    if (!hostels) {
      return res.status(404).json({
        success: false,
        message: 'No hostels found'
      });
    }

    res.status(200).json({
      success: true,
      data: hostels
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


// @desc    Add a room to a hostel
// @route   POST /api/hostels/addRoomToHostel 

const addRoomToHostel = async (req, res) => {
  console.log('Adding room to hostel with data:', req.body);
  const ownerId = req?.user?.ownerId
  console.log("ownerId", ownerId, req.user)


  try {
    const hostel = await hostelService.addRoomToHostel(req.body, ownerId);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room added to hostel successfully',
      data: hostel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }

};
// @desc    Get all rooms in a hostel
const getAllRooms = async (req, res) => {
  try {

    console.log('Getting all rooms in hostel with ID:', req.query, req?.user?.ownerId);
    const rooms = await hostelService.getAllRooms(req.query, req?.user?.ownerId);

    if (!rooms) {
      return res.status(404).json({
        success: false,
        message: 'No rooms found'
      });
    }

    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateRoomInHostel = async (req, res) => {
  console.log('Updating hostel with data: update hostel controller', req.body);

  try {
    const hostel = await hostelService.updateRoomInHostel(req.body);

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: hostel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteRoom = async (req, res) => {
  console.log('Updating hostel with data: update hostel controller', req.body);

  try {
    const room = await hostelService.deleteRoom(req.body);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
      data: room
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export {
  createHostel,
  getHostels,
  updateHostel,
  deleteHostel,
  addRoomToHostel,
  getAllRooms,
  updateRoomInHostel,
  deleteRoom,
};
