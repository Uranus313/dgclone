import mongoose from "mongoose";


const emailVerificationSchema  = new mongoose.Schema(
    {
        email: {type: String , required : true},
        verificationCode: {type: String , required : true},
        createdAt : {type: Date , required : true , default: Date.now() , expires: '2m'}
    }
);


export const EmailVerificationModel = mongoose.model("emailVerifications",emailVerificationSchema);
