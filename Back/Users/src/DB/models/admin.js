import mongoose from "mongoose";
// import Joi from "joi";
// import joiObjectid from "joi-objectid";

const adminSchema  = new mongoose.Schema(
    {
        password: {type: String , required : true},
        firstName: {type: String , required : true},
        lastName: {type: String , required : true},
        birthDate: {type: Date, required: true},
        email: {type: String , required : true},
        isCompelete: Boolean,
        phoneNumber: {type: String , required : true},
        nationalID: {type: String , required : true}
    }
);

export const AdminModel = mongoose.model("admins",adminSchema);


