import {
    CreateAnnoucement,
    GetAllAnouncement,
    UpdateAnouncement,
    DeleteAnouncement,
} from "../dbc/announcement.dbc.js"
import { ResponseCode } from "../utils/responseList.js";
// Add this once at the top of your file
const logger = {
    log: ({ level, message, requestId }) => {
        console.log(`[${level.toUpperCase()}] [RequestID: ${requestId}] ${message}`);
    }
};



const createAnnoucement = function (req, res, next) {

    console.log("--------------->req ", req.body)
    CreateAnnoucement(req.body, (err, code, announcement) => {
        if (err) {
            // Internal server error
            logger.log({
                level: 'error',
                message: 'add announcement - Error - ' + err,
                requestId: req?.id || "Unknown"
            });
            return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
        }

        if (code === ResponseCode.SuccessCode) {
            return res.status(200).json({ code, message: "announcement created successfully", announcement });
        }

        // handle known errors
        if (code === ResponseCode.degreeAlreadyExits) {
            return res.status(409).json({ code, message: "announcement already exists" });
        }

        // fallback error
        return res.status(422).json({ code, message: "Error while creating announcement" });
    });
};

const getAllAnouncement = function (req, res, next) {

    console.log("req--------->getAllAnouncement-", req.body)
    GetAllAnouncement(req.body, (err, code, announcement) => {
        console.log("getAllAnouncement", announcement)
        if (err) {
            // Internal server error
            logger.log({
                level: 'error',
                message: 'add announcement - Error - ' + err,
                requestId: req?.id || "Unknown"
            });
            return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
        }

        if (code === ResponseCode.SuccessCode) {
            return res.status(200).json({ code, message: "fetch announcement successfully", data: announcement });
        }

        // fallback error
        return res.status(422).json({ code, message: "Error while creating announcement" });
    });
};


const updateAnouncement = function (req, res, next) {

    console.log("updateAnouncement----------->", req.body)
    UpdateAnouncement(req.body, (err, code, announcement) => {
        console.log("degreedegreedegree", announcement)
        if (err) {
            // Internal server error
            logger.log({
                level: 'error',
                message: 'add announcement - Error - ' + err,
                requestId: req?.id || "Unknown"
            });
            return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
        }

        if (code === ResponseCode.SuccessCode) {
            return res.status(200).json({ code, message: "announcement updated successfully", data: announcement });
        }

        // fallback error
        return res.status(422).json({ code, message: "Error while updating announcement" });
    });
};

const deleteAnouncement = function (req, res, next) {
    const { studentId } = req.body
    DeleteAnouncement(studentId, (err, code, announcement) => {
        console.log("degreedegreedegree", announcement)
        if (err) {
            // Internal server error
            logger.log({
                level: 'error',
                message: 'add announcement - Error - ' + err,
                requestId: req?.id || "Unknown"
            });
            return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
        }

        if (code === ResponseCode.SuccessCode) {
            return res.status(200).json({ code, message: "announcement deleted successfully", data: announcement });
        }

        // fallback error
        return res.status(422).json({ code, message: "Error while deleting announcement" });
    });
};



export {
    createAnnoucement,
    getAllAnouncement,
    updateAnouncement,
    deleteAnouncement,
}
