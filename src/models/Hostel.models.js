import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    required: [true, 'Hostel name is required'],
    trim: true,
    maxLength: [100, 'Hostel name cannot exceed 100 characters'],
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: [true, 'Total capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [10000, 'Capacity cannot exceed 10000']
  },
  Occupancy: {
    type: Number,
    default: 0,
    min: [0, 'Occupancy cannot be negative']
  },
  type: {
    type: String,
    enum: ['Boys', 'Girls', 'Co-ed'],
    required: [true, 'Hostel type is required']
  },
  // fees: {
  //   monthly: {
  //     type: Number,
  //     required: [true, 'Monthly fees is required'],
  //     min: [0, 'Fees cannot be negative']
  //   },
  //   security: {
  //     type: Number,
  //     default: 0,
  //     min: [0, 'Security deposit cannot be negative']
  //   },
  //   admission: {
  //     type: Number,
  //     default: 0,
  //     min: [0, 'Admission fees cannot be negative']
  //   }
  // },
  wardenName: {
    type: String,
    required: [true, 'Warden name is required'],
    trim: true
  },
  wardenId: {
    type: String,
    required: [true, 'Warden ID is required'],
    trim: true
  },
  totalRooms: {
    type: Number,
    required: [true, 'Number of rooms is required'],
  },
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],
});


const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: [1, 'Room capacity must be at least 1']
  },
  occupancy: {
    type: Number,
    default: 0,
    min: [0, 'Occupancy cannot be negative']
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  rent: {
    type: Number,
    required: [true, 'Room rent is required'],
    min: [0, 'Rent cannot be negative']
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  facilities: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    trim: true,
    maxLength: [200, 'Description cannot exceed 200 characters']
  },
  floor: {
    type: String,
    required: [true, 'Floor is required'],
    trim: true
  }

});

const roomModel = mongoose.model('Room', roomSchema);

export const Hostel = mongoose.model('Hostel', hostelSchema);
export const Room = roomModel;
