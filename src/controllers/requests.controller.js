import e from "express";
import {
    CreateRequests,
    GetAllRequests,
    UpdateRequests,
    DeleteRequest,
} from "../dbc/requests.dbc.js"
import { ResponseCode } from "../utils/responseList.js";
// Add this once at the top of your file
const logger = {
    log: ({ level, message, requestId }) => {
        console.log(`[${level.toUpperCase()}] [RequestID: ${requestId}] ${message}`);
    }
};



const createRequests = function (req, res, next) {

    console.log("--------------->req ", req.body)
    CreateRequests(req.body, (err, code, request) => {
        if (err) {
            // Internal server error
            logger.log({
                level: 'error',
                message: 'add request - Error - ' + err,
                requestId: req?.id || "Unknown"
            });
            return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
        }

        if (code === ResponseCode.SuccessCode) {
            return res.status(200).json({ code, message: "request created successfully", request });
        }

        // fallback error
        return res.status(422).json({ code, message: "Error while creating request" });
    });
};

const getAllRequests = function (req, res, next) {

    console.log("req--------->getAllRequests-", req.body)
    GetAllRequests(req.body, (err, code, request) => {
        console.log("getAllRequests", request)
        if (err) {
            // Internal server error
            logger.log({
                level: 'error',
                message: 'add request - Error - ' + err,
                requestId: req?.id || "Unknown"
            });
            return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
        }

        if (code === ResponseCode.SuccessCode) {
            return res.status(200).json({ code, message: "fetch request successfully", data: request });
        }

        // fallback error
        return res.status(422).json({ code, message: "Error while creating request" });
    });
};


const updateRequests = function (req, res, next) {

    console.log("updateRequests----------->", req.body)
    UpdateRequests(req.body, (err, code, request) => {
        console.log("degreedegreedegree", request)
        if (err) {
            // Internal server error
            logger.log({
                level: 'error',
                message: 'add request - Error - ' + err,
                requestId: req?.id || "Unknown"
            });
            return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
        }

        if (code === ResponseCode.SuccessCode) {
            return res.status(200).json({ code, message: "request updated successfully", data: request });
        }

        // fallback error
        return res.status(422).json({ code, message: "Error while updating request" });
    });
};

const deleteRequest = function (req, res, next) {
    const { requestId } = req.body
    DeleteRequest(requestId, (err, code, request) => {
        console.log("degreedegreedegree", request)
        if (err) {
            // Internal server error
            logger.log({
                level: 'error',
                message: 'add request - Error - ' + err,
                requestId: req?.id || "Unknown"
            });
            return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
        }

        if (code === ResponseCode.SuccessCode) {
            return res.status(200).json({ code, message: "request deleted successfully", data: request });
        }

        // fallback error
        return res.status(422).json({ code, message: "Error while deleting request" });
    });
};




export {
    createRequests,
    getAllRequests,
    updateRequests,
    deleteRequest,
} 