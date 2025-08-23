import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({

    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel"
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    solution: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'Approved', 'Rejected'],
        default: 'pending'
    },
    document: [{ name: { type: String }, url: { type: String } }],
    createdBy:{
        type: String,
        default:""
    },
    updatedBy:{
        type: String,
        default:""
    }


}, { timestamps: true })


const Request = mongoose.model("Request", requestSchema);

export default Request;
