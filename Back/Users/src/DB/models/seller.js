import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);

const sellerSchema = new mongoose.Schema(
    {
        password: { type: String },
        isBanned: Boolean,
        storeOwner: {
            type: {
                firstName: { type: String },
                lastName: { type: String },
                birthDate: { type: Date, },
                email: { type: String },
                nationalID: { type: String }
            }
        },
        isCompelete: Boolean,
        isVerified: Boolean,
        rating: { type: Number, required: true, default: 0 },
        phoneNumber: { type: String, required: true },
        entityType: {
            type: String, enum: ["individual", "legal"],
            validate: {
                validator: function (value) {
                    if (value === "individual" && (!this.individualInfo)) {
                        return false;
                    } else if (value === "legal" && (!this.legalInfo)) {
                        return false;
                    }
                    return true;
                },
                message: (props) => {
                    return "entity details needed";
                }
            }
        },
        legalInfo: {
            type: {
                companyName: { type: String, required: true },
                companyType: { type: String, enum: ["publicCompany", "privateCompany", "limitedLiability", "cooperative", "jointLiability", "institution", "other"], required: true },
                companyIDNumber: { type: String, required: true },
                companyEconomicNumber: { type: String, required: true },
                shabaNumber: { type: String, required: true },
                signOwners: { type: [String], required: true },
                storeName: { type: String }
            }
        },
        additionalDocuments: { type: [String] },
        individualInfo: {
            type: {
                nationalID: { type: String, required: true },
                bankNumberType: {
                    type: String, enum: ["shaba", "bank"], required: true,
                    validate: {
                        validator: function (value) {
                            if (value === "shaba" && (!this.shabaNumber)) {
                                return false;
                            } else if (value === "bank" && (!this.bankNumber)) {
                                return false;
                            }
                            return true;
                        },
                        message: (props) => {
                            return "bank/shaba number details needed";
                        }
                    }
                },
                shabaNumber: { type: String },
                bankNumber: { type: String }
            }
        },
        storeInfo: {
            type: {
                commercialName: { type: String },
                officePhoneNumber: { type: String },
                workDays: { type: [String] },
                logo: { type: String },
                sellerCode: { type: String },
                aboutSeller: { type: String },
                sellerWebsite: { type: String },
                offDays: { type: [String] }
            }
        },
        walletID: { type: mongoose.Schema.Types.ObjectId, ref: "wallets" },
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
        storeAddress: {
            type: {
                country: { type: String, required: true },
                province: { type: String, required: true },
                city: { type: String, required: true },
                postalCode: { type: String, required: true },
                additionalInfo: { type: String },
                number: { type: String },
                unit: { type: String },
                coordinates: {
                    type: {
                        x: { type: String, required: true },
                        y: { type: String, required: true }
                    }, required: true
                }
            }
        },
        warehouseAddress: {
            type: {
                country: { type: String, required: true },
                province: { type: String, required: true },
                city: { type: String, required: true },
                postalCode: { type: String, required: true },
                number: { type: String },
                unit: { type: String },
                additionalInfo: { type: String },
                coordinates: {
                    type: {
                        x: { type: String, required: true },
                        y: { type: String, required: true }
                    }, required: true
                }
            }
        },
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
        productList: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }] },
        saleHistory: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }] },
        // orderHistories :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orderHistories" }]},
        socialInteractions: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }] },
        // wishLists :  { type :[{title : {type: String, required: true},products:[{type : mongoose.Schema.Types.ObjectId , ref: "products"}] }]},
        notifications: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "notifications" }] },
        lastVisited: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }] },
        // shoppingCart :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orders" }]},
        transactionHistory: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "transactions" }] }
    }
);


sellerSchema.virtual("status").get(() => {
    return "seller";
});

sellerSchema.set('toJSON', { virtuals: true });
sellerSchema.set('toObject', { virtuals: true });

export const SellerModel = mongoose.model("sellers", sellerSchema);

export function validateSellerPost(data) {
    const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(12).external(async (phoneNumber) => {
            const seller = await SellerModel.find({ phoneNumber: phoneNumber }).findOne();
            if (seller) {
                throw new Error("an account with this phone number already exists");
            }
        }).required()
    });
    return schema.validateAsync(data);
}


export function validateSellerChangeinfo(data, sellerID) {
    const schema = Joi.object({
        password: Joi.string().min(8).max(50),
        phoneNumber: Joi.string().min(11).max(12).external(async (phoneNumber) => {
            if (!phoneNumber) {
                return
            }
            const seller = await SellerModel.find({ phoneNumber: phoneNumber }).findOne();
            if (seller) {
                throw new Error("an account with this phone number already exists");
            }
        }),
        storeOwner: Joi.object({
            firstName: Joi.string().min(1).max(100),
            lastName: Joi.string().min(1).max(100),
            birthDate: Joi.date(),
            email: Joi.string().email().external(async (email) => {
                if (!email) {
                    return;
                }
                const seller = await SellerModel.find({ email: email }).findOne();
                if (seller && seller._id.toString() != sellerID.toString()) {
                    throw new Error("an account with this email already exists");
                }
            }),
            nationalID: Joi.string().length(10).pattern(/^\d+$/).external(async (nationalID) => {
                if (!nationalID) {
                    return;
                }
                const seller = await SellerModel.find({ nationalID: nationalID }).findOne();

                if (seller && seller._id.toString() != sellerID.toString()) {
                    throw new Error("an account with this national ID number already exists");
                }
            })
        }),
        entityType: Joi.string().valid("individual", "legal"),
        legalInfo: Joi.when("entityType", {
            is: "legal",
            then: Joi.object({
                companyName: Joi.string().min(2).max(100),
                companyType: Joi.string().valid("publicCompany", "privateCompany", "limitedLiability", "cooperative", "jointLiability", "institution", "other").required(),
                companyIDNumber: Joi.string().length(10).pattern(/^\d+$/),
                companyEconomicNumber: Joi.string().length(10).pattern(/^\d+$/),
                shabaNumber: Joi.string().length(10).pattern(/^\d+$/),
                signOwners: Joi.array().items(Joi.string()).min(1),
                storeName: Joi.string().min(2).max(200)
            }),
            otherwise: Joi.forbidden()
        }),
        individualInfo: Joi.when("entityType", {
            is: "individual",
            then: Joi.object({
                nationalID: Joi.string().length(10).pattern(/^\d+$/).required(),
                bankNumberType: Joi.string().valid("shaba", "bank").required(),
                shabaNumber: Joi.when("bankNumberType", {
                    is: "shaba",
                    then: Joi.string().length(10).pattern(/^\d+$/).required(),
                    otherwise: Joi.forbidden()
                }),
                bankNumber: Joi.when("bankNumberType", {
                    is: "bank",
                    then: Joi.string().length(10).pattern(/^\d+$/).required(),
                    otherwise: Joi.forbidden()
                })
            }),
            otherwise: Joi.forbidden()
        }),
        additionalDocuments: Joi.array().items(Joi.string()),
        storeInfo: Joi.object({
            commercialName: Joi.string().min(2).max(100).external(async (commercialName) => {
                if (!commercialName) {
                    return;
                }
                const seller = await SellerModel.find({
                    "storeInfo.commercialName": {
                        $regex: commercialName,
                        $options: 'i'
                    }
                }).findOne();
                console.log(seller._id);
                console.log(sellerID);
                if (seller && seller._id.toString() != sellerID.toString()) {
                    throw new Error("an store with this commercialName already exists");
                }
            }),
            officePhoneNumber: Joi.string().min(11).max(12),
            workDays: Joi.array().items(Joi.string()),
            logo: Joi.string(),
            sellerCode: Joi.string().length(12),
            aboutSeller: Joi.string().min(50).max(2000),
            sellerWebsite: Joi.string(),
            offDays: Joi.array().items(Joi.string())
        }),
        moneyReturn: Joi.object({
            method: Joi.string().valid("bankAccount", "wallet").required(),
            bankAccount: Joi.when('method', {
                is: 'bankAccount',
                then: Joi.string().required(),
                otherwise: Joi.string()
            }),
        }),
        storeAddress: Joi.object({
            country: Joi.string().required(),
            province: Joi.string().required(),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
            number: Joi.string(),
            unit: Joi.string(),
            additionalInfo: Joi.string(),
            coordinates: Joi.object({
                x: Joi.string().required(),
                y: Joi.string().required()
            }
            ).required(),
        }),
        warehouseAddress: Joi.object({
            country: Joi.string().required(),
            province: Joi.string().required(),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
            number: Joi.string(),
            unit: Joi.string(),
            additionalInfo: Joi.string(),
            coordinates: Joi.object({
                x: Joi.string().required(),
                y: Joi.string().required()
            }
            ).required(),
        })
    }).min(1);
    return schema.validateAsync(data);
}
export function validateSellerUnban(data) {
    const schema = Joi.object({
        sellerID: Joi.objectId().external(async (sellerID) => {
            const seller = await SellerModel.find({ _id: sellerID }).findOne();
            if (!seller) {
                throw new Error("seller not found")
            } else if (!seller.isBanned) {
                throw new Error("seller is not banned")
            }
        }).required()
    });
    return schema.validateAsync(data);
}
export function validateVerificationChange(SellerID) {
    const schema = Joi.objectId().external(async (data) => {
        const Seller = await SellerModel.find({ _id: data }).findOne();
        if (!Seller) {
            throw new Error("Seller not found")
        }
    }).required()
    return schema.validateAsync(SellerID);

}