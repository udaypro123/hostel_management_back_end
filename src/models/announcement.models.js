import mongoose from "mongoose";

const annoouncementSchema = new mongoose.Schema({

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
    document: [{ name: { type: String }, url: { type: String } }],


}, { timestamps: true })


const Annoouncement = mongoose.model("Annoouncement", annoouncementSchema);

export default Annoouncement;
