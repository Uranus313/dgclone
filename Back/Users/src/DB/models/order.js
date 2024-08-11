import mongoose from "mongoose";
// import Joi from "joi";
// import joiObjectid from "joi-objectid";
// Joi.objectId = joiObjectid(Joi);

const orderSchema  = new mongoose.Schema(
    {
        product : {
            type: {
                productID : {type : mongoose.Schema.Types.ObjectId , ref: "products" , required: true },
                price : {type : Number ,required: true},
                color : {type : String ,required: true},
                garantee : {type : Number ,required: true},
                sellerID : {type : mongoose.Schema.Types.ObjectId , ref: "products" , required: true },
                picture : {type : String ,required: true}
            },
            required : true},
        quantity: {type : Number ,required: true , default: 1},
        userID : {type : mongoose.Schema.Types.ObjectId , ref: "products" , required: true },
        rate : {type : Number ,required: true , default: 1},
        state : {type: String, enum: ["delivered" , "pending" , "canceled" , "returned" , "preparingOrder" , "transit" , "notOrdered"], required: true},
        usedDate : {type: Date, required : true, },  
    }
);

export const OrderModel = mongoose.model("orders",orderSchema);

