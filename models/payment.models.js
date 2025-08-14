import mongoose from "mongoose";
import { type } from "os";

const recieptSchema = new mongoose.Schema({
    recieptString: {
        type: String,
        default: "",
    }
}, { timestamps: true })

const paymentTransactionSchema = new mongoose.Schema({
    orderId: {
        type: String,
        default: "",
    },
    recieptString: {
        type: String,
        default: "",
    },
    amount: {
        type: Number
    },
    amountPaid: {
        type: Number,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    feeType: {
        type: String,
        trim: true,
    },
    haspaid: {
        type: Boolean,
        default: false,
    },
    

}, { timestamps: true })

const paymentOrderSchema = new mongoose.Schema({
    amount: {
        type: Number
    },
    amountPaid: {
        type: Number,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    email: {
        type: String,
    },
    feeType: {
        type: String,
        trim: true,
    },
    haspaid: {
        type: Boolean,
        default: false,
    },
    contact: {
        type: String,

    },
    sourceUrl: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true
    },
    paymentLinkId: {
        type: String,
        required: true
    },
    paymentTransactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentTransactionModel"
    },
    roomNumber: {
        type:String,
    },
    hostelName: {
        type:String,
        default:""
    },
   

}, { timestamps: true })

const Reciept = mongoose.model("Reciept", recieptSchema)

const PaymentOrder = mongoose.model("paymentOrderSchema", paymentOrderSchema)
const PaymentTransaction = mongoose.model("PaymentTransactionModel", paymentTransactionSchema)

export {
    PaymentTransaction,
    Reciept,
    PaymentOrder,
}