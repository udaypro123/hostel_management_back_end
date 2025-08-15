
import { PaymentOrder, PaymentTransaction } from "../models/payment.models.js";
import { Degree, Student } from "../models/Students.models.js";
import { ResponseCode } from "../utils/responseList.js"
import { authService } from "./index.js";
import Razorpay from "razorpay"
import crypto from 'crypto';
import { generateHostelReceiptHTML } from "../utils/reciptsUtils.js";

const logger = {
  log: ({ level, message, requestId }) => {
    console.log(`[${level.toUpperCase()}] [RequestID: ${requestId}] ${message}`);
  }
};

function generateOrderId() {
  const hash = crypto
    .createHash('sha256')
    .update(Date.now() + Math.random().toString())
    .digest('hex')
    .slice(0, 5); // 12 chars
  return `HOSTEL-${hash.toUpperCase()}`;
}


const razorpayInstance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

const PaymentTransactionModel = async (body, callback) => {
  try {
    logger.log({ level: 'debug', message: ` Add studennt  ${JSON.stringify(body)}` });
    console.log("body---------->0", body)
    const { amount, amountPaid, studentId, feeType, recieptId } = body;

    let obj = {
      amount,
      amountPaid,
      studentId,
      feeType,
      recieptId
    }
    const createTransaction = new PaymentTransaction(obj)
    console.log("createTransaction", createTransaction)

    await createTransaction.save();

    return callback(null, ResponseCode.SuccessCode, createTransaction);
  } catch (error) {
    logger.log({ level: 'error', message: 'Exit createTransaction: ' + error });
    return callback(error, null, null);
  }
};

const CreateOrder = async (body, orderId, callback) => {
  try {
    console.log("bodyyy--- create Order", body);
    const { amount, amountPaid, studentId, feeType, paymentTransactionId, email, contact, sourceUrl, roomNumber } = body;

    // Create a Razorpay Payment Link
    const paymentLinkOptions = {
      amount: amountPaid * 100,
      currency: "INR",
      description: `Payment for ${feeType}`,
      customer: {
        name: studentId,
        email: email || "",
        contact: contact || ""
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true,
      callback_url: `http://${sourceUrl}/payment/status?orderId=${orderId}&amount=${amountPaid}`,
      callback_method: "get"
    };

    const paymentLink = await razorpayInstance.paymentLink.create(paymentLinkOptions);

    console.log("paymentLink", paymentLink)

    // Save transaction/order details if needed
    let obj = {
      amount,
      amountPaid,
      studentId,
      feeType,
      haspaid: false,
      paymentTransactionId,
      sourceUrl,
      paymentLinkId: paymentLink.id,
      orderId,
      roomNumber,
    };

    if (!paymentLink) {
      await PaymentTransaction.findByIdAndDelete(paymentTransactionId)
    }

    if (paymentLink) {
      const orderdata = new PaymentOrder(obj)
      await PaymentTransaction.findByIdAndUpdate({_id:paymentTransactionId}, {$set:{
        orderId:orderdata?._id
      }})
      await orderdata.save()
    }


    // Return the payment link URL to the frontend
    return callback(null, ResponseCode.SuccessCode, { payment_url: paymentLink.short_url });
  } catch (err) {
    return callback(err, null, null);
  }
};

const VerifyOrder = async (body, callback) => {
  try {
    console.log("bodyyy--- verify order", body);
    const receiptNumber = generateOrderId()
    const { paymentLinkId, orderId } = body;
    const paymentdata = await razorpayInstance.paymentLink.fetch(paymentLinkId);
    console.log("paymentLink verify order ", paymentdata)
    let orderData = await PaymentOrder.findOne({
      $or: [
        { orderId: orderId },
        { paymentLinkId: paymentLinkId },
      ]
    }).populate("studentId");

    console.log("paymentLink orderData ", orderData)

    if (paymentdata?.payments[0]?.status === 'captured') {
      let obj = {
        receiptNumber,
        name: `${orderData?.studentId?.firstName} ${orderData?.studentId?.lastName}`,
        roomNumber: orderData?.roomNumber,
        totalAmount: orderData?.amount,
        paymentMethod: paymentdata?.payments[0]?.method,
        hostelName: orderData?.hostelName,
        paymentDate: new Date(),
      }
      const htmlReceipt = await generateHostelReceiptHTML(obj)
      await PaymentTransaction.findByIdAndUpdate({ _id: orderData?.paymentTransactionId?._id }, {
        $set: { haspaid: true, recieptString: htmlReceipt },
      },
        { new: true }
      )
      await PaymentOrder.findOneAndUpdate(
        { $or: [{ orderId: orderId }, { paymentLinkId: paymentLinkId }] },
        { $set: { haspaid: true } },
        { new: true }
      );
    }
    // Return the payment link URL to the frontend
    return callback(null, ResponseCode.SuccessCode, true);

  } catch (err) {
    return callback(err, null, null);
  }
};

const GetStdudentPaymenetById = async (body, callback) => {
  try {

    const studentdata = await PaymentTransaction.find( body.studentId ).populate("studentId")
    if (studentdata) {
      return callback(null, ResponseCode.SuccessCode, studentdata);
    } else {
      return callback(null, ResponseCode.SuccessCode, []);
    }
  } catch (error) {
    return callback(error, null, null);
  }
}



export {
  PaymentTransactionModel,
  CreateOrder,
  VerifyOrder,
  GetStdudentPaymenetById,
}

