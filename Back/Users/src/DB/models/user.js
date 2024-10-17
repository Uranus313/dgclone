import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
import { productURL } from "../../consts/consts.js";
import { SellerModel } from "./seller.js";
Joi.objectId = joiObjectid(Joi);

const userSchema = new mongoose.Schema(
    {
        password: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        birthDate: { type: Date },
        email: { type: String },
        job: { type: String },
        economicCode: { type: String },
        isCompelete: Boolean,
        phoneNumber: { type: String, required: true },
        walletID: { type: mongoose.Schema.Types.ObjectId, ref: "wallets" },
        isBanned: Boolean,
        nationalID: { type: String },
        moneyReturn: {
            type: {
                method: {
                    type: String, enum: ["bankAccount", "wallet"], required: true, default: "wallet", validate: {
                        validator: function (value) {
                            if (value === "bankAccount" && (!this.bankAccount || this.bankAccount.trim() == "")) {
                                return false;
                            }
                            return true;
                        },
                        message: (props) => {
                            return "bankAccount needed";
                        }
                    }
                },
                bankAccount: { type: String }
            }, required: true, default: {
                method: "wallet"
            }
        },
        addresses: [{
            type: {
                country: { type: String, required: true },
                province: { type: String, required: true },
                city: { type: String, required: true },
                postalCode: { type: String, required: true },
                additionalInfo: { type: String },
                number: { type: String, required: true },
                unit: { type: String },
                coordinates: {
                    type: {
                        x: { type: String, required: true },
                        y: { type: String, required: true }
                    }, required: true
                },
                receiver: {
                    type: {
                        firstName: { type: String, required: true },
                        lastName: { type: String, required: true },
                        phoneNumber: { type: String, required: true }
                    }, required: true
                }
            }
        }],
        signUpDate: { type: Date, required: true, default: Date.now() },
        recentNotifications: {
            type: [{
                type: {
                    _id: { type: mongoose.Schema.Types.ObjectId, ref: "notifications", required: true },
                    content: { type: String, required: true },
                    title: { type: String, required: true },
                    teaser: { type: String, required: true },
                    userEmail: { type: String },
                    userPhone: { type: String, required: true },
                    imageUrl: { type: String },
                    orderID: { type: mongoose.Schema.Types.ObjectId },
                    isSeen: Boolean,
                    date: { type: Date, required: true, default: Date.now() },
                    type: { type: String, enum: ["information", "order", "suggestion", "question"], required: true }
                }
            }]
        },
        boughtGiftCards: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "giftCards" }] },
        receivedGiftCards: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "giftCards" }] },
        orderHistories: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "orderHistories" }] ,validate:{
            validator : (value) => {
                return value.length === new Set(value).size
            },
            message: "order Histories cannot contain duplicate values"
        }  },
        ratedSellers: [{
            rate : {type: Number , max: 5 , min : 0 , required : true},
            selledID : { type: mongoose.Schema.Types.ObjectId, ref: "sellers" }
        }],
        socialInteractions: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }] },
        favoriteList: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }] },
        wishLists: { type: [{ title: { type: String, required: true }, products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }] }] },
        notifications: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "notifications" }] },
        lastVisited: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }] },
        shoppingCart: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }] },
        transactionHistory: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "transactions" }] }
    }
);

userSchema.index({phoneNumber : 1 })

userSchema.virtual("status").get(() => {
    return "user";
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export const UserModel = mongoose.model("users", userSchema);

export function validateUserPost(data) {
    const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(12).external(async (phoneNumber) => {
            const user = await UserModel.find({ phoneNumber: phoneNumber }).findOne();
            if (user) {
                throw new Error("an account with this phone number already exists");
            }
        }).required()
    });
    return schema.validateAsync(data);
}
export function validateUserlogInWithPhoneNumber(data) {
    const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(12).external(async (phoneNumber) => {
            const user = await UserModel.find({ phoneNumber: phoneNumber }).findOne();
            if (!user) {
                throw new Error("no account with this phone number exists");
            }
        }).required()
    });
    return schema.validateAsync(data);
}
export function validateLastVisitedPost(data) {
    const schema = Joi.object({
        productID: Joi.objectId().external(async (productID) => {
            const result = await fetch(productURL+"/product/" + productID, {
        method: "GET",
        headers: {
            "inner-secret": process.env.innerSecret
        }});
            const product = await result.json();
            if (!product._id) {
                throw new Error("this product does not exists");
            }
        }).required()
    });
    return schema.validateAsync(data);
}
export function validateChangePassword(data) {
    const schema = Joi.object({
        oldPassword: Joi.string().min(8).max(50),
        newPassword: Joi.string().min(8).max(50).required()
    })
    return schema.validate(data);
}
export function validateUserChangePhoneNumber(data) {
    const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(12).external(async (phoneNumber) => {
            const user = await UserModel.find({ phoneNumber: phoneNumber }).findOne();
            if (user) {
                throw new Error("an account with this phone number already exists");
            }
        }).required()
    });
    return schema.validateAsync(data);
}
export function validateChangePhoneNumberVerify(data) {
    const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(12).external(async (phoneNumber) => {
            const user = await UserModel.find({ phoneNumber: phoneNumber }).findOne();
            if (user) {
                throw new Error("an account with this phone number already exists");
            }
        }).required(),
        mode : Joi.string().valid("change","logIn","signUp").required(),
        verificationCode : Joi.string().length(6).required()
    })
    return schema.validateAsync(data);
}

export function validateChangeEmail(data) {
    const schema = Joi.object({
        email: Joi.string().email().external(async (email) => {

            const user = await UserModel.find({ email: email }).findOne();
            if (user) {
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
            const user = await UserModel.find({ email: email }).findOne();
            if (user) {
                throw new Error("an account with this email already exists");
            }
        }).required(),
        verificationCode : Joi.string().length(6).required()
    })
    return schema.validateAsync(data);
}
export function validateUserChangeinfo(data) {
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(100),
        lastName: Joi.string().min(1).max(100),
        job: Joi.string().min(8).max(200),
        // phoneNumber: Joi.string().min(11).max(12).external(async (phoneNumber) => {
        //     if (!phoneNumber) {
        //         return
        //     }
        //     const user = await UserModel.find({ phoneNumber: phoneNumber }).findOne();
        //     if (user) {
        //         throw new Error("an account with this phone number already exists");
        //     }
        // }),
        birthDate: Joi.date(),
        nationalID: Joi.string().length(10).pattern(/^\d+$/).external(async (nationalID) => {
            if (!nationalID) {
                return
            }
            const user = await UserModel.find({ nationalID: nationalID }).findOne();
            if (user) {
                throw new Error("an account with this national ID number already exists");
            }
        }),
        economicCode: Joi.string().pattern(/^\d+$/).external(async (economicCode) => {
            if (!economicCode) {
                return
            }
            const user = await UserModel.find({ economicCode: economicCode }).findOne();
            if (user) {
                throw new Error("an account with this economic code already exists");
            }
        }),
        moneyReturn: Joi.object({
            method: Joi.string().valid("bankAccount", "wallet").required(),
            bankAccount: Joi.when('method', {
                is: 'bankAccount',
                then: Joi.string().required(),
                otherwise: Joi.string()
            }),
        }),
        address: Joi.array().items(Joi.object({
            country: Joi.string().required(),
            province: Joi.string().required(),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
            additionalInfo: Joi.string(),
            coordinates: Joi.object({
                x: Joi.string().required(),
                y: Joi.string().required()
            }
            ).required(),
        }))
    }).min(1);
    return schema.validateAsync(data);
}

export function validateUserLogIn(data) {
    const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(12),
        email: Joi.string().email(),
        password: Joi.string().min(8).max(50).required()
    }).xor("phoneNumber", "email");
    return schema.validate(data);
}

export function validateCreateWishList(data, wishLists) {
    const schema = Joi.object({
        title: Joi.string().min(1).max(100).external((title) => {
            wishLists.forEach(wishList => {
                if (wishList.title == title) {
                    throw new Error("an wish list with this title already exists");
                }
            })
        }).required()
    })
    return schema.validateAsync(data);
}

export function validateIncreaseWallet(data) {
    const schema = Joi.object({
        amount: Joi.string().min(10000).max(1000000000).required()
    })
    return schema.validateAsync(data);
}
export function validateAddToWishList(data, wishLists) {
    const schema = Joi.object({
        title: Joi.string().min(1).max(100).external((title) => {
            let checker = false;
            wishLists.forEach(wishList => {
                if (wishList.title == title) {
                    checker = true;
                }
            });
            if (!checker) {
                throw new Error("no wish list with this title exists");
            }
        }).required(),
        productID: Joi.objectId().external(async (productID) => {
            wishLists.forEach(wishList => {
                if (wishList.title == title) {
                    wishList.forEach(listProductID => {
                        if (listProductID == productID) {
                            throw new Error("this product is already in your wishlist");
                        }
                    })
                }
            });
            const result = await fetch(productURL+"/product/" + productID, {
        method: "GET",
        headers: {
            "inner-secret": process.env.innerSecret
        }});
            const product = await result.json();
            if (!product._id) {
                throw new Error("this product does not exists");
            }
        }).required()
    })
    return schema.validateAsync(data);
}
export function validateAddToFavoriteList(data, favoriteList) {
    const schema = Joi.object({
        productID: Joi.objectId().external(async (productID) => {
            favoriteList.forEach(listProductID => {
                if (listProductID == productID) {
                    throw new Error("this product is already in your favorite List");
                }
            })
            const result = await fetch(productURL+"/product/" + productID, {
        method: "GET",
        headers: {
            "inner-secret": process.env.innerSecret
        }});
            const product = await result.json();
            if (!product._id) {
                throw new Error("this product does not exists");
            }
        }).required()
    })
    return schema.validateAsync(data);
}

export function validateAddress(data) {
    const schema = Joi.object({
        country: Joi.string(),
        province: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
        additionalInfo: Joi.string(),
        number: Joi.string(),
        unit: Joi.string(),
        coordinates: Joi.object({
            x: Joi.string().required(),
            y: Joi.string().required()
        }
        ).required(),
        receiver: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phoneNumber: Joi.string().min(11).max(12).required()
        }
        ).required(),
    })
    return schema.validate(data);
}
export function validateUserUnban(data) {
    const schema = Joi.object({
        userID: Joi.objectId().external(async (userID) => {
            const user = await UserModel.find({ _id: userID }).findOne();
            if (!user) {
                throw new Error("user not found")
            } else if (!user.isBanned) {
                throw new Error("user is not banned")
            }
        }).required()
    });
    return schema.validateAsync(data);
}
export function validatePostSellerRating(data) {
    const schema = Joi.object({
        sellerID: Joi.objectId().external(async (sellerID) => {
            const seller = await SellerModel.find({ _id: sellerID }).findOne();
            if (!seller) {
                throw new Error("seller not found")
            }
        }).required(),
        rate : Joi.number().max(5).min(0).required()
    })
    return schema.validateAsync(data);
}
export function validateBuyTheCart(data) {
    const schema = Joi.object({
        
        address: Joi.object({
            country: Joi.string(),
            province: Joi.string().required(),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
            additionalInfo: Joi.string(),
            number: Joi.string(),
            unit: Joi.string(),
            coordinates: Joi.object({
                x: Joi.string().required(),
                y: Joi.string().required()
            }
            ).required(),
            receiver: Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                phoneNumber: Joi.string().min(11).max(12).required()
            }
            ).required(),
        }).required(),
        discount : Joi.string().max(200)
    })
    return schema.validate(data);
}