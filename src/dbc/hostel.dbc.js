import { Hostel, Room } from '../models/Hostel.models.js'
import { Student } from '../models/Students.models.js';
import User from '../models/User.models.js'

// Create a new hostel
const createHostel = async (hostelData, createdBy, ownerId) => {
  try {
    console.log('Creating hostel with data:', hostelData, 'by user:', createdBy);
    const hostel = new Hostel({
      ...hostelData,
      createdBy,
      ownerId
    });

    if (!hostel) {
      throw new Error('Hostel creation failed');
    }

    await hostel.save();
    return hostel;
  } catch (error) {
    throw error;
  }
};

const updateHostel = async (hostelData) => {
  console.log('Updating hostel with data:', hostelData);
  try {
    const { formData, hostelId } = hostelData;
    console.log('Updating hostel with data:', formData, hostelId);

    // ✅ Correct logic: run update if hostelId exists
    if (hostelId) {
      const hostel = await Hostel.findByIdAndUpdate(
        hostelId,
        { ...formData },
        { new: true, runValidators: true }
      );

      console.log('Updated hostel:', hostel);

      if (!hostel) {
        throw new Error('Hostel not found');
      }

      return hostel;
    } else {
      throw new Error('hostelId missing');
    }
  } catch (error) {
    console.error('Update hostel failed:', error.message);
    throw error;
  }
};


const deleteHostel = async (hostelData) => {
  console.log('Deleting hostel with data: delete dbc', hostelData);
  try {
    if (hostelData) {
      const hostel = await Hostel.findByIdAndDelete(hostelData?.hostelId);
      if (!hostel) {
        throw new Error('Hostel not found');
      }
      return hostel;
    }
  } catch (error) {
    throw error;
  }
};


const addRoomToHostel = async (roomData, ownerId) => {
  console.log('Adding room to hostel with data:', roomData, ownerId);
  try {
    const { hostelId, room } = roomData;

    let roomToAdd = new Room({...room,ownerId});
    const resdata = await roomToAdd.save();

    if (!hostelId || !room) {
      throw new Error('Hostel ID and room data are required');
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      throw new Error('Hostel not found');
    }

    hostel.rooms.push(resdata?._id);
    await hostel.save();

    return hostel;
  } catch (error) {
    console.error('Error adding room to hostel:', error.message);
    throw error;
  }
};


const getAllRooms = async (body, userId) => {
  console.log('Getting all rooms in hostel with ID:dbc', body, userId);
  try {

    const page = body?.page || 1;
    const limit = body?.limit || 10;
    const skip = page * limit;

    const rooms = await Room.find({ ownerId: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('hostelId');

    if (!rooms) {
      throw new Error('Hostel not found');
    }
    console.log('Rooms in hostel:', rooms);
    return rooms;

  } catch (error) {
    console.error('Error getting all rooms in hostel:', error.message);
    throw error;
  }
};

const updateRoomInHostel = async (roomData) => {
  console.log('Updating room in hostel with data:', roomData);
  try {
    const { room } = roomData;
    let formData = room;
    console.log('Updating room with data:', formData);

    // ✅ Correct logic: run update if roomId exists
    if (roomData?.room?._id) {
      const room = await Room.findByIdAndUpdate(
        roomData?.room?._id,
        { ...formData },
        { new: true, runValidators: true }
      );

      console.log('Updated room:', room);

      if (!room) {
        throw new Error('Room not found');
      }

      return room;
    } else {
      throw new Error('roomId missing');
    }
  } catch (error) {
    console.error('Update room failed:', error.message);
    throw error;
  }
};

const deleteRoom = async (roomData) => {
  console.log('Deleting room with data: delete dbc', roomData);
  try {
    if (roomData) {
      const room = await Room.findByIdAndDelete(roomData?.deleteRoomID);

      const student = await Student.updateMany(
        { roomId: roomData?.deleteRoomID },
        { $set: { roomId: "" } }
      );

      if (!student) {
        throw new Error('Student not found');
      }

      if (!room) {
        throw new Error('Room not found');
      }
      return room;
    }
  } catch (error) {
    throw error;
  }
};



export {
  createHostel,
  updateHostel,
  deleteHostel,
  addRoomToHostel,
  getAllRooms,
  updateRoomInHostel,
  deleteRoom
};
