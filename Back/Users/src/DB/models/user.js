import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);

const userSchema  = new mongoose.Schema(
    {
        password: {type: String },
        firstName: {type: String },
        lastName: {type: String },
        birthDate: {type: Date},
        email: {type: String },
        isCompelete: Boolean,
        phoneNumber: {type: String , required : true},
        walletID: {type : mongoose.Schema.Types.ObjectId , ref: "jobs" },
        isBanned : Boolean,
        nationalID: {type: String},
        moneyReturn:{type : {
            method : {type: String,enum: ["bankAccount" , "wallet"], required: true , default : "wallet" ,  validate: {
                validator : function(value){
                    if(value === "bankAccount" && (!this.bankAccount || this.bankAccount.trim() == "")){
                        return false;
                    }
                    return true;
                },
                message : (props) => {
                    return "bankAccount needed";
                }
            }},
            bankAccount : {type: String }
        }, required : true , default : {
            method : "wallet"
        }},
        addresses:[{type:{
            country: {type: String , required : true},
            province: {type: String, required : true},
            city: {type: String, required : true},
            postalCode : {type: String, required : true},
            additionalInfo : {type: String},
            coordinates : {type:{
                x : {type: String, required : true},
                y : {type: String, required : true}
            } , required: true}
        }}],
        sentGiftCards : {type : [{type : mongoose.Schema.Types.ObjectId , ref: "giftCards"}]},
        receivedGiftCards : {type : [{type : mongoose.Schema.Types.ObjectId , ref: "giftCards"}]},
        orderHistories :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orderHistories" }]},
        socialInteractions :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "comments" }]},
        favoriteList : {type : [{type : mongoose.Schema.Types.ObjectId , ref: "products"}]},
        wishLists :  { type :[{title : {type: String, required: true},products:[{type : mongoose.Schema.Types.ObjectId , ref: "products"}] }]},
        notifications :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "notifications" }]},
        lastVisited :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "products" }]},
        shoppingCart :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orders" }]},
        transactionHistory : { type :[{type : mongoose.Schema.Types.ObjectId , ref: "transactions" }]}
    }
);

export const UserModel = mongoose.model("users",userSchema);

export function validateUserPost (data){
    const schema = Joi.object({
        phoneNumber : Joi.string().min(11).max(12).external( async (phoneNumber) => {
            const user = await UserModel.find({phoneNumber : phoneNumber}).findOne();
            if(user){
                throw new Error("an account with this phone number already exists");
            }
        }).required()
    });
    return schema.validateAsync(data);
}

export function validateLastVisitedPost (data){
    const schema = Joi.object({
        productID : Joi.objectId().external( async (productID) => {
            const result = await fetch("http://getProduct/"+productID);
            const product = await result.json();
            if (!product._id){
                throw new Error("this product does not exists");
            }
        }).required()
    });
    return schema.validateAsync(data);
}
export function validateUserChangeinfo (data){
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(100),
        lastName: Joi.string().min(1).max(100),
        password : Joi.string().min(8).max(50),
        phoneNumber : Joi.string().min(11).max(12).external( async (phoneNumber) => {
            if(!phoneNumber){
                return
            }
            const user = await UserModel.find({phoneNumber : phoneNumber}).findOne();
            if(user){
                throw new Error("an account with this phone number already exists");
            }
        }),
        birthDate : Joi.date(),
        email: Joi.string().email().external( async (email) => {
            if(!email){
                return
            }
            const user = await UserModel.find({email : email}).findOne();
            if(user){
                throw new Error("an account with this email already exists");
            }
        }),
        nationalID: Joi.string().length(10).pattern(/^\d+$/).external( async (nationalID) => {
            if(!nationalID){
                return
            }
            const user = await UserModel.find({nationalID : nationalID}).findOne();
            if(user){
                throw new Error("an account with this national ID number already exists");
            }
        }),
        moneyReturn:Joi.object({
            method : Joi.string().valid("bankAccount" , "wallet").required(),
            bankAccount : Joi.when('method', {
                is: 'bankAccount',
                then: Joi.string().required(),
                otherwise: Joi.string()
            }),
        }),
        address: Joi.array().items(Joi.object({
            country: Joi.string().required(),
            province: Joi.string().required(),
            city: Joi.string().required(),
            postalCode : Joi.string().required(),
            additionalInfo : Joi.string(),
            coordinates : Joi.object({
                    x : Joi.string().required(),
                    y : Joi.string().required()
                }
            ).required(),
        }))
    }).min(1);
    return schema.validateAsync(data);
}

export function validateUserLogIn(data){
    const schema = Joi.object({
        phoneNumber : Joi.string().min(11).max(12),
        email: Joi.string().email(),
        password : Joi.string().min(8).max(50).required()
    }).xor("phoneNumber","email");
    return schema.validateAsync(data);
}

export function validateCreateWishList(data , wishLists){
    const schema = Joi.object({
        title : Joi.string().min(1).max(100).external( (title) => {
            wishLists.forEach(wishList => {
                if (wishList.title == title ){
                    throw new Error("an wish list with this title already exists");
                }
            })
        }).required()
    })
    return schema.validateAsync(data);
}
export function validateAddToWishList(data , wishLists){
    const schema = Joi.object({
        title : Joi.string().min(1).max(100).external( (title) => {
            let checker = false;
            wishLists.forEach(wishList => {
                if (wishList.title == title ){
                    checker = true;
                }
            });
            if (!checker){
                throw new Error("no wish list with this title exists");
            }
        }).required(),
        productID : Joi.objectId().external( async (productID) => {
            wishLists.forEach(wishList => {
                if (wishList.title == title ){
                    wishList.forEach(listProductID => {
                        if(listProductID == productID){
                            throw new Error("this product is already in your wishlist");
                        }
                    })
                }
            });
            const result = await fetch("http://getProduct/"+productID);
            const product = await result.json();
            if (!product._id){
                throw new Error("this product does not exists");
            }
        }).required()
    })
    return schema.validateAsync(data);
}
export function validateAddToFavoriteList(data , favoriteList){
    const schema = Joi.object({
        productID : Joi.objectId().external( async (productID) => {
            favoriteList.forEach(listProductID => {
                    if(listProductID == productID){
                    throw new Error("this product is already in your favorite List");
                }
            })
            const result = await fetch("http://getProduct/"+productID);
            const product = await result.json();
            if (!product._id){
                throw new Error("this product does not exists");
            }
        }).required()
    })
    return schema.validateAsync(data);
}

export function validateAddress(data ){
    const schema = Joi.object({
        country: Joi.string().required(),
        province: Joi.string().required(),
        city: Joi.string().required(),
        postalCode : Joi.string().required(),
        additionalInfo : Joi.string(),
        coordinates : Joi.object({
                x : Joi.string().required(),
                y : Joi.string().required()
            }
        ).required(),
    })
    return schema.validate(data);
}