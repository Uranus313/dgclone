import mongoose from "mongoose";


const phoneNumberVerificationSchema  = new mongoose.Schema(
    {
        phoneNumber: {type: String , required : true},
        verificationCode: {type: String , required : true},
        createdAt : {type: Date , required : true , default: Date.now() , expires: '1m'}
    }
);

phoneNumberVerificationSchema.index({phoneNumber : 1})

export const PhoneNumberVerificationModel = mongoose.model("phoneNumberVerifications",phoneNumberVerificationSchema);
