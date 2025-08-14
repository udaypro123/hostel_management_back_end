import { Degree, Student } from "../models/Students.models.js";
import { ResponseCode } from "../utils/responseList.js"
import { authService } from "./index.js";
// Add this once at the top of your file
const logger = {
  log: ({ level, message, requestId }) => {
    console.log(`[${level.toUpperCase()}] [RequestID: ${requestId}] ${message}`);
  }
};


const CreateStudent = async (body, callback) => {
  try {
    logger.log({ level: 'debug', message: ` Add studennt  ${JSON.stringify(body)}` });
    console.log("body---------->0", body)

    const { phone, email, firstName, lastName, address, gender } = body;

    let obj = {
      email,
      firstName,
      lastName,
      password: "Uday@123",
      phoneNumber: phone,
      address,
      role: "student",
      gender: gender,
    }

    const existingUser = await authService.registerUser(obj)

    console.log("existingUser", existingUser?.user, existingUser?.user?._id, existingUser?.user?.id)
    const data = await Student.findOne({ $or: [{ status: 1, phone: body.phone }, { email: body.email }] });

    if (data) {
      return callback(null, ResponseCode.StudentAlreadyExits, null);
    }

    // Create new degree
    const degreeObj = {
      firstName,
      lastName,
      dob: body.dob,
      email: body.email,
      phone: body.phone,
      hostelId: body.hostelId,
      roomId: body.roomId,
      joiningDate: body.joiningDate,
      address: body.address,
      enrolledDegree: body.enrolledDegree,
      userId: existingUser?.user?.id,
    };

    const degreeData = new Student(degreeObj);
    if (!degreeData && existingUser?.user?.id) {
      // Rollback the user if warden creation failed
      await User.findByIdAndDelete(existingUser?.user?.id);
      console.log("Rolled back newly created user due to warden save failure");
    }
    await degreeData.save();

    return callback(null, ResponseCode.SuccessCode, degreeData);
  } catch (error) {
    logger.log({ level: 'error', message: 'Exit addDegree: ' + error });
    return callback(error, null, null);
  }
};

const GetAllStudents = async (body, callback) => {
  console.log('Getting all rooms in hostel with ID:dbc', body);
  try {
    const students = await Student.find()
      .populate("hostelId")
      .populate("roomId")
      .populate("enrolledDegree")


    if (!students) {
      throw new Error('Hostel not found');
    }
    console.log('degree in hostel:', students);
    return callback(null, ResponseCode.SuccessCode, students);

  } catch (error) {
    console.error('Error getting all students in hostel:', error.message);
    return callback(error, null, null);
  }
};

const GetStudentsById = async (body, callback) => {
  console.log('Getting all rooms in hostel with ID:dbc', body);
  try {
    const students = await Student.findOne()
      .populate({ path: 'hostelId', select:"hostelName wardenName"})
      .populate({path:"roomId", select:"roomNumber rent"})


    if (!students) {
      throw new Error('Hostel not found');
    }
    console.log('degree in hostel:', students);
    return callback(null, ResponseCode.SuccessCode, students);

  } catch (error) {
    console.error('Error getting all students in hostel:', error.message);
    return callback(error, null, null);
  }
};


const UpdateStudent = async (body, callback) => {
  try {
    console.log(':body-------->', body)
    const updatestudent = await Student.findOneAndUpdate({ _id: body?._id }, body,
      { new: true, runValidators: true, }
    )

    return callback(null, ResponseCode.SuccessCode, updatestudent)
  } catch (error) {

    return callback(null, ResponseCode.ServerError)
  }
}

const DeleteStudent = async (studentId, callback) => {
  try {
    console.log(':deleteDegreeID-------->', studentId)
    const deletestudent = await Student.findByIdAndDelete({ _id: studentId },
      { new: true, }
    )
    return callback(null, ResponseCode.SuccessCode, deletestudent)
  } catch (error) {

    return callback(null, ResponseCode.ServerError)
  }
}

/// below  Degree related databse is 


const AddDegee = async (body, callback) => {
  try {
    logger.log({ level: 'debug', message: ` Add degree ${JSON.stringify(body)}` });

    const data = await Degree.findOne({ status: 1, degreeName: body.degreeName });

    if (data) {
      return callback(null, ResponseCode.degreeAlreadyExits, null);
    }

    // Create new degree
    const degreeObj = {
      degreeName: body.degreeName,
      departmentName: body.departmentName,
      degreeYear: body.degreeYear,
      AdmissionYear: body.AdmissionYear,
    };

    const degreeData = new Degree(degreeObj);
    await degreeData.save();

    return callback(null, ResponseCode.SuccessCode, degreeData);
  } catch (error) {
    logger.log({ level: 'error', message: 'Exit addDegree: ' + error });
    return callback(error, null, null);
  }
};


const getAllDegees = async (body, callback) => {
  console.log('Getting all rooms in hostel with ID:dbc', body);
  try {

    const page = body?.page || 1;
    const limit = body?.limit || 10;
    const skip = (page - 1) * limit;

    console.log("page limit---sskip", page, limit, skip)

    const degree = await Degree.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    if (!degree) {
      throw new Error('Hostel not found');
    }
    console.log('degree in hostel:', degree);
    return callback(null, ResponseCode.SuccessCode, degree);

  } catch (error) {
    console.error('Error getting all degree in hostel:', error.message);
    return callback(error, null, null);
  }
};


const updateDegees = async (body, callback) => {
  try {
    console.log(':body-------->', body)
    const updateRoom = await Degree.findOneAndUpdate({ _id: body?._id }, body,
      { new: true, runValidators: true, }
    )

    return callback(null, ResponseCode.SuccessCode, updateRoom)
  } catch (error) {

    return callback(null, ResponseCode.ServerError)
  }
}

const DeleteDegree = async (deleteDegreeID, callback) => {
  try {
    console.log(':deleteDegreeID-------->', deleteDegreeID)
    const deleteRoom = await Degree.findByIdAndDelete({ _id: deleteDegreeID },
      { new: true, }
    )
    return callback(null, ResponseCode.SuccessCode, deleteRoom)
  } catch (error) {

    return callback(null, ResponseCode.ServerError)
  }
}



export {
  AddDegee,
  getAllDegees,
  updateDegees,
  DeleteDegree,
  CreateStudent,
  GetAllStudents,
  UpdateStudent,
  DeleteStudent,
  GetStudentsById,
}

