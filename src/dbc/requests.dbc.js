
import Request from "../models/requests.models.js";
import { ResponseCode } from "../utils/responseList.js"
// Add this once at the top of your file
const logger = {
    log: ({ level, message, requestId }) => {
        console.log(`[${level.toUpperCase()}] [RequestID: ${requestId}] ${message}`);
    }
};


const CreateRequests = async (body, callback) => {
    try {

        console.log("CreateRequests ", body)
        let obj = {
            ...body
        }

        console.log("CreateRequests ", obj)

        const requestData = new Request(obj);
        await requestData.save();
        if(!requestData) {
          return callback(null, ResponseCode.ServerError, null);
        }

        return callback(null, ResponseCode.SuccessCode, requestData);
    } catch (error) {
        logger.log({ level: 'error', message: 'Exit request: ' + error });
        return callback(error, null, null);
    }
};

const GetAllRequests = async (body, callback) => {
    try {
        console.log('Getting all Requests in hostel with ID:Requests', body);
        const requests = await Request.find()
            .populate("hostel")

        if (!requests) {
            throw new Error('Hostel not found');
        }

        if(!requests){
          return callback(null, ResponseCode.ServerError, []);
        }
        console.log('degree in hostel:', requests);
        return callback(null, ResponseCode.SuccessCode, requests);

    } catch (error) {
        console.error('Error getting all requests in hostel:', error.message);
        return callback(error, null, null);
    }
};


const UpdateRequests = async (body, callback) => {
    try {
        console.log(':UpdateRequests body-------->', body)
        const updateRequests = await Request.findOneAndUpdate({ _id: body?._id }, body,
            { new: true, runValidators: true, }
        )

        if(!updateRequests){
          return callback(null, ResponseCode.ServerError, null);
        }

        return callback(null, ResponseCode.SuccessCode, updateRequests)
    } catch (error) {
        return callback(null, ResponseCode.ServerError)
    }
}

const DeleteRequest = async (requestId, callback) => {
    try {
        console.log(':deleteDegreeID-------->', requestId)
        const deleteRequest = await Request.findByIdAndDelete({ _id: requestId },
            { new: true, }
        )

        if(!deleteRequest){
          return callback(null, ResponseCode.ServerError, null);
        }

        return callback(null, ResponseCode.SuccessCode, deleteRequest)
    } catch (error) {

        return callback(null, ResponseCode.ServerError)
    }
}



export {
    CreateRequests,
    GetAllRequests,
    UpdateRequests,
    DeleteRequest,
}

