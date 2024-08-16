import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);

const walletSchema  = new mongoose.Schema(
    {
        money: {type: Number , required : true , default: 0},
        userID: {type : mongoose.Schema.Types.ObjectId,required : true }
    }
);

export const WalletModel = mongoose.model("wallets",walletSchema);


export function validateChangeMoney (data){
    const schema = Joi.object({
        amount: Joi.number().required(),
        userID : Joi.objectId().external( async (userID) => {
            const user = await UserModel.find({_id : userID}).findOne();
            if(!user){
                throw new Error("user not found")
            }
        }).required()
    });
    return schema.validateAsync(data);
}

