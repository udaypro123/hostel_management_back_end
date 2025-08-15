import {
  PaymentTransactionModel,
  CreateOrder,
  VerifyOrder,
  GetStdudentPaymenetById,
} from "../dbc/payment.dbc.js"
import { ResponseCode } from "../utils/responseList.js";


// Add this once at the top of your file
const logger = {
  log: ({ level, message, requestId }) => {
    console.log(`[${level.toUpperCase()}] [RequestID: ${requestId}] ${message}`);
  }
};




const paymentTransaction = function (req, res, next) {
  PaymentTransactionModel(req.body, (err, code, payment) => {
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add Payment Transaction - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "Payment Transaction created successfully", data:payment });
    }

    // handle known errors
    if (code === ResponseCode.degreeAlreadyExits) {
      return res.status(409).json({ code, message: "Payment Transaction already exists" });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while creating payment" });
  });
};

const createOrder = function (req, res, next) {

  const orderId = generateOrderId()
  console.log("orderId---------->", orderId)

  CreateOrder(req.body,orderId, (err, code, payment) => {
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add Payment Transaction - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "Payment Transaction created successfully", data:payment });
    }

    // handle known errors
    if (code === ResponseCode.degreeAlreadyExits) {
      return res.status(409).json({ code, message: "Payment Transaction already exists" });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while creating payment" });
  });
};

const verifyOrder = function (req, res, next) {


  VerifyOrder(req.body, (err, code, payment) => {
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add Payment Transaction - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "Payment Transaction created successfully", data:payment });
    }

    // handle known errors
    if (code === ResponseCode.degreeAlreadyExits) {
      return res.status(409).json({ code, message: "Payment Transaction already exists" });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while creating payment" });
  });
};

const getStdudentPaymenetById = function (req, res, next) {

  GetStdudentPaymenetById(req.body, (err, code, payment) => {
    console.log("degreedegreedegree", payment)
    if (err) {
      // Internal server error
      logger.log({
        level: 'error',
        message: 'add Payment Transaction - Error - ' + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({ code: ResponseCode.ServerError, message: 'Internal server error', error: err.message || err });
    }

    if (code === ResponseCode.SuccessCode) {
      return res.status(200).json({ code, message: "fetch Payment list successfully", data: payment });
    }

    // fallback error
    return res.status(422).json({ code, message: "Error while fetching payment" });
  });
};


export {
  paymentTransaction,
  createOrder,
  verifyOrder,
  getStdudentPaymenetById,
}
