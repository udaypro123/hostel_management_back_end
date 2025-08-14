import Annoouncement from "../models/announcement.models.js";
import { Degree, Student } from "../models/Students.models.js";
import { ResponseCode } from "../utils/responseList.js"
import { authService } from "./index.js";
// Add this once at the top of your file
const logger = {
    log: ({ level, message, requestId }) => {
        console.log(`[${level.toUpperCase()}] [RequestID: ${requestId}] ${message}`);
    }
};


const CreateAnnoucement = async (body, callback) => {
    try {

        console.log("createaaaaaaaaaaaaaaaanoumnet ", body)
        let obj = {
            ...body
        }
        
        console.log("createaaaaaaaaaaaaaaaanoumnet ", obj)

        const announceData = new Annoouncement(obj);
        await announceData.save();

        return callback(null, ResponseCode.SuccessCode, announceData);
    } catch (error) {
        logger.log({ level: 'error', message: 'Exit announcement: ' + error });
        return callback(error, null, null);
    }
};

const GetAllAnouncement = async (body, callback) => {
    try {
        console.log('Getting all Anouncement in hostel with ID:Anouncement', body);
        const annoouncement = await Annoouncement.find()
            .populate("hostel")

        if (!annoouncement) {
            throw new Error('Hostel not found');
        }
        console.log('degree in hostel:', annoouncement);
        return callback(null, ResponseCode.SuccessCode, annoouncement);

    } catch (error) {
        console.error('Error getting all annoouncement in hostel:', error.message);
        return callback(error, null, null);
    }
};


const UpdateAnouncement = async (body, callback) => {
    try {
        console.log(':UpdateAnouncement body-------->', body)
        const updateAnnoouncement = await Annoouncement.findOneAndUpdate({ _id: body?._id }, body,
            { new: true, runValidators: true, }
        )

        return callback(null, ResponseCode.SuccessCode, updateAnnoouncement)
    } catch (error) {
        return callback(null, ResponseCode.ServerError)
    }
}

const DeleteAnouncement = async (studentId, callback) => {
    try {
        console.log(':deleteDegreeID-------->', studentId)
        const deleteAnnoouncement = await Annoouncement.findByIdAndDelete({ _id: studentId },
            { new: true, }
        )
        return callback(null, ResponseCode.SuccessCode, deleteAnnoouncement)
    } catch (error) {

        return callback(null, ResponseCode.ServerError)
    }
}



export {
    CreateAnnoucement,
    GetAllAnouncement,
    UpdateAnouncement,
    DeleteAnouncement,
}

