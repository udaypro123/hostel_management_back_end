import bcrypt from 'bcryptjs';
import User from '../models/User.models.js';
import Warden from '../models/Warden.models.js'
import { authService } from './index.js';
import { ResponseCode } from '../utils/responseList.js';


const CreateWarden = async (wardenData, callback) => {
  try {
    const { phone, email, firstName, lastName, address, gender } = wardenData;

    let obj = {
      phone,
      email,
      firstName,
      lastName,
      password: "Uday@123",
      phoneNumber: phone,
      address,
      role: "warden",
      gender: gender,

    }
    const existingUser = await authService.registerUser(obj)
    const warden = new Warden({
      ...wardenData,
      userId: existingUser?.user?.id,
    });

    const savedWarden = await warden.save();

    if (!savedWarden && existingUser?.user?.id) {
      // Rollback the user if warden creation failed
      await User.findByIdAndDelete(existingUser?.user?.id);
      // console.log("Rolled back newly created user due to warden save failure");
    }
    if (!savedWarden) {
      return callback(null, ResponseCode.ServerError, null);
    }
    return callback(null, ResponseCode.SuccessCode, savedWarden);
  } catch (error) {
    return callback(null, ResponseCode.ServerError, null);
  }
};



export {
  CreateWarden,
};
