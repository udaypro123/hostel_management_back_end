import mongoose from "mongoose";

const degreeSchema = new mongoose.Schema({

    degreeName: {
        type: String,
        required: true,
        trim: true,
    },
    AdmissionYear: {
        type: Date,
        required: true,
    },
    departmentName: {
        type: String,
        required: true,
        trim: true,
    },
    degreeYear: {
        type: Date,
        required: true,
    },
    status: { type: Number, default: 1 },

}, { timestamps: true })

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    enrolledDegree: { type: mongoose.Schema.Types.ObjectId, ref: 'Degree', required: true },
    joiningDate: { type: Date, default: new Date(), required: true, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'], },
}, { timestamps: true });


const Degree = mongoose.model("Degree", degreeSchema);
const Student = mongoose.model("Student", studentSchema);
export { Student, Degree };
