import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
import { levels } from "../../authorization/accessLevels.js";
import { EmployeeModel } from "./employee.js";
Joi.objectId = joiObjectid(Joi);

const roleSchema  = new mongoose.Schema(
    {
        name: {type: String , required : true},
        accessLevels: {type: [
            {
                type:{
                    level: {type: String, enum: [levels.categoryManage,levels.commentManage,levels.orderManage,levels.productManage,levels.sellerManage,levels.shipmentManage,levels.transactionManage,levels.userManage], required : true},
                    writeAccess :{type: Boolean, required: true}
                }
            }
        ]},
    }
);

export const RoleModel = mongoose.model("roles",roleSchema);

export function validateRolePost (data){
    const schema = Joi.object({
        name : Joi.string().min(1).max(50).external( async (name) => {
            const user = await RoleModel.find({name : name}).findOne();
            if(user){
                throw new Error("a role with this name already exists");
            }
        }).required(),
        accessLevels : Joi.array().items(Joi.object({
            level : Joi.string().valid(levels.categoryManage,levels.commentManage,levels.orderManage,levels.productManage,levels.sellerManage,levels.shipmentManage,levels.transactionManage,levels.userManage).required(),
            writeAccess : Joi.boolean().required()
        })).required(true)
    });
    return schema.validateAsync(data);
}

export function validateRoleDelete (data){

    const schema = Joi.objectid().external( async (roleID) => {
        const user = await EmployeeModel.find({roleID : roleID}).findOne();
        if(user){
            throw new Error("pls first remove this role from every employee");
        }
    }).required(true);
    return schema.validateAsync(data);
}






