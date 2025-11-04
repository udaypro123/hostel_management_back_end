import {
  AddDegree,
  getAllDegees,
  updateDegees,
  DeleteDegree,
  CreateStudent,
  GetAllStudents,
  UpdateStudent,
  DeleteStudent,
  GetStudentsById,
} from "../dbc/student.dbc.js"
import { ResponseCode } from "../utils/responseList.js";
// Add this once at the top of your file
const logger = {
  log: ({ level, message, requestId }) => {
    console.log(`[${level.toUpperCase()}] [RequestID: ${requestId}] ${message}`);
  }
};



const createStudent = function (req, res, next) {
  const ownerId = req?.user?.ownerId
  CreateStudent(req.body, ownerId, (err, code, student) => {
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add Degree - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "Degree created successfully", data: student });
    }

    // handle known errors
    if (code === ResponseCode.degreeAlreadyExits) {
      return res.status(409).json({ code, message: "Degree already exists" });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while creating student" });
  });
};

const getStudents = function (req, res, next) {

  const ownerId = req?.user?.ownerId
  GetAllStudents(req.body, ownerId, (err, code, degree) => {
    console.log("degreedegreedegree", degree)
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add Degree - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "fetch Degree successfully", data: degree });
    }

    // handle known errors
    if (code === ResponseCode.degreeAlreadyExits) {
      return res.status(409).json({ code, message: "Degree already exists" });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while creating degree" });
  });
};

const getStudentById = function (req, res, next) {
  GetStudentsById(req.body, (err, code, degree) => {
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add Degree - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "fetch Degree successfully", data: degree });
    }

    // handle known errors
    if (code === ResponseCode.degreeAlreadyExits) {
      return res.status(409).json({ code, message: "Degree already exists" });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while creating degree" });
  });
};

const updateStudent = function (req, res, next) {

  UpdateStudent(req.body, (err, code, degree) => {
    console.log("degreedegreedegree", degree)
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add student - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "student updated successfully", data: degree });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while updating degree" });
  });
};

const deleteStudent = function (req, res, next) {
  const { studentId } = req.body
  DeleteStudent(studentId, (err, code, student) => {
    console.log("degreedegreedegree", student)
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add student - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "student deleted successfully", data: student });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while deleting student" });
  });
};


const addDegree = function (req, res, next) {
  const ownerId = req?.user?.ownerId
  AddDegree(req.body, ownerId, (err, code, degree) => {
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add Degree - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "Degree created successfully", degree });
    }

    // handle known errors
    if (code === ResponseCode.degreeAlreadyExits) {
      return res.status(409).json({ code, message: "Degree already exists" });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while creating degree" });
  });
};

const getAllDegree = function (req, res, next) {
  const ownerId = req?.user?.ownerId
  getAllDegees(req.body,ownerId,  (err, code, degree) => {
    console.log("degreedegreedegree", degree)
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add Degree - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "fetch Degree successfully", data: degree });
    }

    // handle known errors
    if (code === ResponseCode.degreeAlreadyExits) {
      return res.status(409).json({ code, message: "Degree already exists" });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while creating degree" });
  });
};


const updateDegree = function (req, res, next) {

  updateDegees(req.body, (err, code, degree) => {
    console.log("degreedegreedegree", degree)
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add Degree - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "Degree updated successfully", data: degree });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while updating degree" });
  });
};

const deleteDegree = function (req, res, next) {
  const { deleteDegreeID } = req.body
  DeleteDegree(deleteDegreeID, (err, code, degree) => {
    console.log("degreedegreedegree", degree)
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add Degree - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "Degree deleted successfully", data: degree });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while deleting degree" });
  });
};


export {
  addDegree,
  getAllDegree,
  updateDegees,
  updateDegree,
  deleteDegree,
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  getStudentById,
}
