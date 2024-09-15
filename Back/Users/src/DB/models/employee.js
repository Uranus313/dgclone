import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
import { RoleModel } from "./role.js";
Joi.objectId = joiObjectid(Joi);

const employeeSchema  = new mongoose.Schema(
    {
        password: {type: String , required : true},
        firstName: {type: String , required : true},
        lastName: {type: String , required : true},
        birthDate: {type: Date, required: true},
        email: {type: String , required : true},
        isCompelete: Boolean,
        phoneNumber: {type: String , required : true},
        nationalID: {type: String , required : true},
        isBanned: {type: Boolean},
        roleID: {type : mongoose.Schema.Types.ObjectId , ref: "roles" }
        // pendingOrders : { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orders" }]},
        // deliveredOrders : { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orders" }]}
    }
);


employeeSchema.virtual("status").get(() => {
    return "employee";
});

employeeSchema.set('toJSON',{virtuals: true});
employeeSchema.set('toObject',{virtuals: true});

export const EmployeeModel = mongoose.model("employees",employeeSchema);

export function validateEmployeePost (data){
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(100).required(),
        lastName: Joi.string().min(1).max(100).required(),
        password : Joi.string().min(8).max(50).required(),
        birthDate : Joi.date().required(),
        phoneNumber : Joi.string().min(11).max(12).external( async (phoneNumber) => {
            const user = await EmployeeModel.find({phoneNumber : phoneNumber}).findOne();
            if(user){
                throw new Error("an account with this phone number already exists");
            }
        }).required(),
        email: Joi.string().email().external( async (email) => {
            const user = await EmployeeModel.find({email : email}).findOne();
            if(user){
                throw new Error("an account with this email already exists");
            }
        }).required(),
        nationalID: Joi.string().length(10).pattern(/^\d+$/).external( async (nationalID) => {
            const user = await EmployeeModel.find({nationalID : nationalID}).findOne();
            if(user){
                throw new Error("an account with this national ID number already exists");
            }
        }).required(),
    });
    return schema.validateAsync(data);
}

export function validateEmployeeChangeinfo (data){
    const schema = Joi.object({
    //     firstName: Joi.string().min(1).max(100),
    //     lastName: Joi.string().min(1).max(100),
    //     birthDate : Joi.date(),
        phoneNumber : Joi.string().min(11).max(12).external( async (phoneNumber) => {
            const user = await EmployeeModel.find({phoneNumber : phoneNumber}).findOne();
            if(user){
                throw new Error("an account with this phone number already exists");
            }
        }),
        email: Joi.string().email().external( async (email) => {
            const user = await EmployeeModel.find({email : email}).findOne();
            if(user){
                throw new Error("an account with this email already exists");
            }
        }),
        // nationalID: Joi.string().length(10).pattern(/^\d+$/).external( async (nationalID) => {
        //     const user = await AdminModel.find({nationalID : nationalID}).findOne();
        //     if(user){
        //         throw new Error("an account with this national ID number already exists");
        //     }
        // }),
    }).min(1);
    return schema.validateAsync(data);
}






export function validateEmployeeChangeRole (data){
    const schema = Joi.object({
        roleID : Joi.objectId().external( async (roleID) => {
            const role = await RoleModel.find({roleID : roleID}).findOne();
            if(!role){
                throw new Error("no role with this id exists");
            }
        }).required(),
        employeeID : Joi.objectId().external( async (employeeID) => {
            const employee = await EmployeeModel.find({_id : employeeID}).findOne();
            if(!employee){
                throw new Error("no employee with this id exists");
            }
        }).required()
    });
    return schema.validateAsync(data);
}
export function validateEmployeeBan (data){
    const schema = Joi.object({
        employeeID : Joi.objectId().external( async (employeeID) => {
            const employee = await EmployeeModel.find({_id : employeeID}).findOne();
            if(!employee){
                throw new Error("employee not found")
            }else if (employee.isBanned){
                throw new Error("employee is already banned")    
            }
        }).required()
    });
    return schema.validateAsync(data);
}

export function validateEmployeeUnban (data){
    const schema = Joi.object({
        employeeID : Joi.objectId().external( async (employeeID) => {
            const employee = await EmployeeModel.find({_id : employeeID}).findOne();
            if(!employee){
                throw new Error("employee not found")
            }else if (!employee.isBanned){
                throw new Error("employee is not banned")    
            }
        }).required()
    });
    return schema.validateAsync(data);
}