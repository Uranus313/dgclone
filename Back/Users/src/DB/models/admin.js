import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";

const adminSchema  = new mongoose.Schema(
    {
        password: {type: String , required : true},
        firstName: {type: String , required : true},
        lastName: {type: String , required : true},
        birthDate: {type: Date, required: true},
        email: {type: String , required : true},
        isCompelete: Boolean,
        isBanned : Boolean,
        phoneNumber: {type: String , required : true},
        nationalID: {type: String , required : true},
        signUpDate : {type: Date , required : true , default: Date.now()}
    }
);

adminSchema.virtual("status").get(() => {
    return "admin";
});

adminSchema.set('toJSON',{virtuals: true});
adminSchema.set('toObject',{virtuals: true});

export const AdminModel = mongoose.model("admins",adminSchema);

export function validateAdminPost (data){
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(100).required(),
        lastName: Joi.string().min(1).max(100).required(),
        password : Joi.string().min(8).max(50).required(),
        birthDate : Joi.date().required(),
        phoneNumber : Joi.string().min(11).max(12).external( async (phoneNumber) => {
            const admin = await AdminModel.find({phoneNumber : phoneNumber}).findOne();
            if(admin){
                throw new Error("an account with this phone number already exists");
            }
        }).required(),
        email: Joi.string().email().external( async (email) => {
            const admin = await AdminModel.find({email : email}).findOne();
            if(admin){
                throw new Error("an account with this email already exists");
            }
        }).required(),
        nationalID: Joi.string().length(10).pattern(/^\d+$/).external( async (nationalID) => {
            const admin = await AdminModel.find({nationalID : nationalID}).findOne();
            if(admin){
                throw new Error("an account with this national ID number already exists");
            }
        }).required(),
    });
    return schema.validateAsync(data);
}

export function validateChangeEmail(data) {
    const schema = Joi.object({
        email: Joi.string().email().external(async (email) => {
            if (!email) {
                return
            }
            const admin = await AdminModel.find({ email: email }).findOne();
            if (admin) {
                throw new Error("an account with this email already exists");
            }
        }).required(),
    })
    return schema.validateAsync(data);
}
export function validateChangeEmailVerify(data) {
    const schema = Joi.object({
        email: Joi.string().email().external(async (email) => {
            if (!email) {
                return
            }
            const admin = await AdminModel.find({ email: email }).findOne();
            if (admin) {
                throw new Error("an account with this email already exists");
            }
        }).required(),
        verificationCode : Joi.string().length(6).required()
    })
    return schema.validateAsync(data);
}
export function validateAdminChangeinfo (data){
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(100),
        lastName: Joi.string().min(1).max(100),
        birthDate : Joi.date(),
        phoneNumber : Joi.string().min(11).max(12).external( async (phoneNumber) => {
            const admin = await AdminModel.find({phoneNumber : phoneNumber}).findOne();
            if(admin){
                throw new Error("an account with this phone number already exists");
            }
        }),
        // email: Joi.string().email().external( async (email) => {
        //     const admin = await AdminModel.find({email : email}).findOne();
        //     if(admin){
        //         throw new Error("an account with this email already exists");
        //     }
        // }),
        nationalID: Joi.string().length(10).pattern(/^\d+$/).external( async (nationalID) => {
            const admin = await AdminModel.find({nationalID : nationalID}).findOne();
            if(admin){
                throw new Error("an account with this national ID number already exists");
            }
        }),
    }).min(1);
    return schema.validateAsync(data);
}





export function validateAdminBan (data){
    const schema = Joi.object({
        adminID : Joi.objectId().external( async (adminID) => {
            const admin = await AdminModel.find({_id : adminID}).findOne();
            if(!admin){
                throw new Error("admin not found")
            }else if (admin.isBanned){
                throw new Error("admin is already banned")    
            }
        }).required()
    });
    return schema.validateAsync(data);
}
export function validateAdminUnban (data){
    const schema = Joi.object({
        adminID : Joi.objectId().external( async (adminID) => {
            const admin = await AdminModel.find({_id : adminID}).findOne();
            if(!admin){
                throw new Error("admin not found")
            }else if (!admin.isBanned){
                throw new Error("admin is not banned")    
            }
        }).required()
    });
    return schema.validateAsync(data);
}
export function validateAdminChangePhoneNumber(data) {
    const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(12).external(async (phoneNumber) => {
            const admin = await AdminModel.find({ phoneNumber: phoneNumber }).findOne();
            if (admin) {
                throw new Error("an account with this phone number already exists");
            }
        }).required()
    });
    return schema.validateAsync(data);
}
export function validateChangePhoneNumberVerify(data) {
    const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(12).external(async (phoneNumber) => {
            const admin = await AdminModel.find({ phoneNumber: phoneNumber }).findOne();
            if (admin) {
                throw new Error("an account with this phone number already exists");
            }
        }).required(),
        mode : Joi.string().valid("change","logIn","signUp").required(),
        verificationCode : Joi.string().length(6).required()
    })
    return schema.validateAsync(data);
}
export function validateAdminlogInWithPhoneNumber(data) {
    const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(12).external(async (phoneNumber) => {
            const admin = await AdminModel.find({ phoneNumber: phoneNumber }).findOne();
            if (!admin) {
                throw new Error("no account with this phone number exists");
            }
        }).required()
    });
    return schema.validateAsync(data);
}