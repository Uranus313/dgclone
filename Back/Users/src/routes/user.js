import express from "express"
import { auth } from "../authorization/auth.js";
import validateId from "../functions/validateId.js";
import _ from "lodash";
import { validateAddress, validateAddToFavoriteList, validateAddToWishList, validateChangePassword, validateCreateWishList, validateLastVisitedPost, validateUserChangeinfo, validateUserLogIn, validateUserPost, validateChangeEmail, validateChangeEmailVerify, validateUserChangePhoneNumber, validateUserlogInWithPhoneNumber, validateChangePhoneNumberVerify, validatePostSellerRating, validateBuyTheCart, validateIncreaseWallet } from "../DB/models/user.js";
import { addBoughtGiftCard, addOrderHistoryToList, addreceivedGiftCard, changeUserPassword, deleteOrderFromCart, emptyTheCart, getUsers, logIn, saveUser, updateUser } from "../DB/CRUD/user.js";
import { GiftCardModel, validateGiftCardPost, validateGiftCardUse } from "../DB/models/giftCard.js";
import { getBoughtGiftCards, getGiftCards, getReceivedGiftCards, saveGiftCard, updateGiftCard } from "../DB/CRUD/giftCard.js";
import { generateRandomString } from "../functions/randomString.js";
import { changeWalletMoney, getWallets, saveWallet, updateWallet } from "../DB/CRUD/wallet.js";
import { getAllUserTransactions, saveTransaction } from "../DB/CRUD/transaction.js";
import { getNotifications, updateNotification } from "../DB/CRUD/notification.js";
import jwt from "jsonwebtoken";
import { innerAuth } from "../authorization/innerAuth.js";
import { levels } from "../authorization/accessLevels.js";
import { roleAuth } from "../authorization/roleAuth.js";
import { deleteEmailVerification, getEmailVerifications, saveEmailVerification } from "../DB/CRUD/emailVerification.js";
import { sendMail } from "../functions/sendMail.js";
import { deletePhoneNumberVerification, getPhoneNumberVerifications, savePhoneNumberVerification } from "../DB/CRUD/phoneNumberVerification.js";
import { sendSMS } from "../functions/sendSMS.js";
import { productURL } from "../consts/consts.js";
import { addRating, updateRating } from "../DB/CRUD/seller.js";

const router = express.Router();

// checked
router.post("/signUp", async (req, res, next) => {
    try {
        await validateUserPost(req.body);
    } catch (error) {
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const result1 = await saveUser(req.body);
        if (result1.error) {
            res.status(400).send({ error: result1.error });
            res.body = { error: result1.error };
            next();
            return;
        }
        const result2 = await saveWallet({ userID: result1.response._id, userType: "user" });
        if (result2.error) {
            res.status(400).send({ error: result2.error });
            res.body = { error: result2.error };
            next();
            return;
        }
        const result3 = await updateUser(result1.response._id, { walletID: result2.response._id, password: "12345678" });
        if (result3.error) {
            res.status(400).send({ error: result3.error });
            res.body = { error: result3.error };
            next();
            return;
        }
        const token = jwt.sign({ _id: result3.response._id, status: "user" }, process.env.JWTSECRET, { expiresIn: '6h' });
        res.cookie('x-auth-token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV == "development"?null : true,
            secure: true,


            sameSite: 'none',
            maxAge: 6 * 60 * 60 * 1000
        });
        res.send(result3.response);
        res.body = result3.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});
router.post("/logInWithPhoneNumber", async (req, res, next) => {
    try {
        await validateUserlogInWithPhoneNumber(req.body);
    } catch (error) {
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const prevRequest = await getPhoneNumberVerifications(undefined, req.body.phoneNumber);
        if (prevRequest.response) {
            res.status(400).send({ error: "به این شماره کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." });
            res.body = { error: "به این شماره کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." };
            next();
            return;
        }
        const randomCode = generateRandomString(6);
        const result = await savePhoneNumberVerification({ phoneNumber: req.body.phoneNumber, verificationCode: randomCode });
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const sendResult = await sendSMS({ message: "کد تایید دیجیمارکت:" + "\n" + result.response.verificationCode, phoneNumber: req.body.phoneNumber });
        console.log(sendResult)
        if (sendResult.error) {
            res.status(400).send({ error: "در ارسال پیامک اشکالی به وجود آمد" });
            res.body = { error: "در ارسال پیامک اشکالی به وجود آمد" };
            next();
            return;
        }
        res.send({ message: "کد ایجاد شد" });
        res.body = { message: "کد ایجاد شد" };
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
})
router.post("/testPhoneNumber", async (req, res, next) => {
    try {
        await validateUserChangePhoneNumber(req.body);
    } catch (error) {
        console.log(error)
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const prevRequest = await getPhoneNumberVerifications(undefined, req.body.phoneNumber);
        if (prevRequest.response) {
            res.status(400).send({ error: "به این شماره کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." });
            res.body = { error: "به این شماره کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." };
            next();
            return;
        }
        const randomCode = generateRandomString(6);
        const result = await savePhoneNumberVerification({ phoneNumber: req.body.phoneNumber, verificationCode: randomCode });
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const sendResult = await sendSMS({ message: "کد تایید دیجیمارکت:" + "\n" + result.response.verificationCode, phoneNumber: req.body.phoneNumber });
        console.log(sendResult)
        if (sendResult?.error) {
            res.status(400).send({ error: "در ارسال پیامک اشکالی به وجود آمد" });
            res.body = { error: "در ارسال پیامک اشکالی به وجود آمد" };
            next();
            return;
        }
        res.send({ message: "کد ایجاد شد" });
        res.body = { message: "کد ایجاد شد" };
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

router.patch("/verifyPhoneNumber", async (req, res, next) => {
    try {
        await validateChangePhoneNumberVerify(req.body);
    } catch (error) {
        console.log(error)
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const prevRequest = await getPhoneNumberVerifications(undefined, req.body.phoneNumber);
        if (!prevRequest.response) {
            res.status(404).send({ error: "not found" });
            res.body = { error: "not found" };
            next();
            return;
        }
        if (prevRequest.response.verificationCode != req.body.verificationCode) {
            res.status(404).send({ error: "کد اشتباه است" });
            res.body = { error: "کد اشتباه است" };
            next();
            return;
        }
        const deleteresult = await deletePhoneNumberVerification(undefined, req.body.phoneNumber);
        if (deleteresult.error) {
            // res.status(400).send({ error: deleteresult.error });
            // res.body = { error: deleteresult.error };
            console.log(deleteresult.error)
            next();
            return;
        }
        let result = {};
        if (req.body.mode == "change") {
            await auth(req, res, undefined, ["user"]);
            if (!req.user) {
                return;
            }
            result = await updateUser(req.user._id, { phoneNumber: req.body.phoneNumber });
            if (result.error) {
                res.status(400).send({ error: result.error });
                res.body = { error: result.error };
                next();
                return;
            }
        } else if (req.body.mode == "signUp") {
            result = await saveUser(req.body);
            if (result.error) {
                res.status(400).send({ error: result.error });
                res.body = { error: result.error };
                next();
                return;
            }
            const result2 = await saveWallet({ userID: result.response._id, userType: "user" });
            if (result2.error) {
                res.status(400).send({ error: result2.error });
                res.body = { error: result2.error };
                next();
                return;
            }
        } else if (req.body.mode == "logIn") {
            result = await getUsers(undefined, { phoneNumber: req.body.phoneNumber });
            if (result.error) {
                res.status(400).send({ error: result.error });
                res.body = { error: result.error };
                next();
                return;
            }
            if (!result.response[0]) {
                res.status(404).send({ error: "user not found" });
                res.body = { error: "user not found" };
                next();
                return;
            }
            if (result.response[0].isBanned) {
                res.status(404).send({ error: "user is banned" });
                res.body = { error: "user is banned" };
                next();
                return;
            }
            result.response = result.response[0];
        }

        const token = jwt.sign({ _id: result.response._id, status: "user" }, process.env.JWTSECRET, { expiresIn: '6h' });
        res.cookie('x-auth-token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV == "development"?null : true,
            secure: true,


            sameSite: 'none',
            maxAge: 6 * 60 * 60 * 1000
        });
        res.send(result.response);
        res.body = result.response;

    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();

});
// router.patch("/changeinfo/:id", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
//     try {
//         await validateUserChangeinfo(req.body);
//     } catch (error) {
//         if (error.details) {
//             res.status(400).send({ error: error.details[0].message });
//             res.body = { error: error.details[0].message };
//         } else {
//             res.status(400).send({ error: error.message });
//             res.body = { error: error.message };
//         }
//         next();
//         return;
//     }
//     const { error: e } = validateId(req.params.id);
//     if (e) {
//         res.status(400).send({ error: e.details[0].message });
//         res.body = { error: e.details[0].message };
//         next();
//         return;
//     }
//     if (req.params.id != req.user._id) {
//         res.status(400).send("you can not change another user's account");
//         res.body = "you can not change another user's account";
//         next();
//         return;
//     }

//     try {
//         const result = await updateUser(req.params.id, req.body);
//         if (result.error) {
//             res.status(400).send({ error: result.error });
//             res.body = { error: result.error };
//             next();
//             return;
//         }

//         const token = jwt.sign({ _id: result.response._id, status: "user" }, process.env.JWTSECRET, { expiresIn: '6h' });
//         res.cookie('x-auth-token', token, {
//             httpOnly: true,
//                         secure: process.env.NODE_ENV == "development"?null : true,

//             sameSite: 'none',
//             maxAge: 6 * 60 * 60 * 1000
//         });
//         res.send(result.response);
//         res.body = result.response;
//     } catch (err) {
//         console.log("Error", err);
//         res.body = { error: "internal server error" };
//         res.status(500).send({ error: "internal server error" });
//     }
//     next();
// });

router.patch("/changeEmail", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        await validateChangeEmail(req.body);
    } catch (error) {
        console.log(error)
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const prevRequest = await getEmailVerifications(undefined, req.body.email);
        if (prevRequest.response) {
            res.status(400).send({ error: "به این ایمیل کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." });
            res.body = { error: "به این ایمیل کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." };
            next();
            return;
        }
        const randomCode = generateRandomString(6);
        const result = await saveEmailVerification({ email: req.body.email, verificationCode: randomCode });
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const sendResult = await sendMail({ title: "کد تایید ایمیل", text: result.response.verificationCode, targetEmail: req.body.email });
        if (sendResult.error) {
            res.status(400).send({ error: "در ارسال ایمیل اشکالی به وجود آمد" });
            res.body = { error: "در ارسال ایمیل اشکالی به وجود آمد" };
            next();
            return;
        }
        res.send({ message: "کد ایجاد شد" });
        res.body = { message: "کد ایجاد شد" };
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();

});
// checked
router.patch("/verifyChangeEmail", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        await validateChangeEmailVerify(req.body);
    } catch (error) {
        console.log(error)
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const prevRequest = await getEmailVerifications(undefined, req.body.email);
        if (!prevRequest.response) {
            res.status(404).send({ error: "not found" });
            res.body = { error: "not found" };
            next();
            return;
        }
        if (prevRequest.response.verificationCode != req.body.verificationCode) {
            res.status(404).send({ error: "کد اشتباه است" });
            res.body = { error: "کد اشتباه است" };
            next();
            return;
        }
        const deleteresult = await deleteEmailVerification(undefined, req.body.email);
        if (deleteresult.error) {
            // res.status(400).send({ error: deleteresult.error });
            // res.body = { error: deleteresult.error };
            console.log(deleteresult.error)
            next();
            return;
        }
        const result = await updateUser(req.user._id, { email: req.body.email });
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const token = jwt.sign({ _id: result.response._id, status: "user" }, process.env.JWTSECRET, { expiresIn: '6h' });
        res.cookie('x-auth-token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV == "development"?null : true,
            secure: true,


            sameSite: 'none',
            maxAge: 6 * 60 * 60 * 1000
        });
        res.send(result.response);
        res.body = result.response;

    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();

});

router.patch("/changeMyinfo", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        await validateUserChangeinfo(req.body);
    } catch (error) {
        console.log(error)
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const result = await updateUser(req.user._id, req.body);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const token = jwt.sign({ _id: result.response._id, status: "user" }, process.env.JWTSECRET, { expiresIn: '6h' });
        res.cookie('x-auth-token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV == "development"?null : true,
            secure: true,


            sameSite: 'none',
            maxAge: 6 * 60 * 60 * 1000
        });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();

});
router.patch("/changePassword", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    const { error } = validateChangePassword(req.body);
    console.log("login")
    if (error) {
        // console.log({error : error.details[0].message})
        res.status(400).send({ error: error.details[0].message });
        res.body = { error: error.details[0].message };
        next();
        return;
    }
    try {

        const result = await changeUserPassword(req.user._id, req.body.newPassword, req.body.oldPassword);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});
//  checked
// router.get("/checkToken",(req, res,next) => auth(req, res,next, ["user"]), async (req,res) =>{
//     try {
//         delete req.user.password;
//         res.send(req.user);
//         res.body = req.user;
//     } catch (err) {
//         console.log("Error",err);
//         res.body = {error:"internal server error"};
//         res.status(500).send({error:"internal server error"});
//     }
// })


// checked
router.post("/logIn", async (req, res, next) => {
    const { error } = validateUserLogIn(req.body);
    console.log("login")
    if (error) {
        // console.log({error : error.details[0].message})
        res.status(400).send({ error: error.details[0].message });
        res.body = { error: error.details[0].message };
        next();
        return;
    }
    console.log(req.body)

    try {
        const result = await logIn(req.body.email, req.body.phoneNumber, req.body.password);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const token = jwt.sign({ _id: result.response._id, status: "user" }, process.env.JWTSECRET, { expiresIn: '6h' });
        res.cookie('x-auth-token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV == "development"?null : true,
            secure: true,


            sameSite: 'none',
            maxAge: 6 * 60 * 60 * 1000
        });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

// half checked


router.get("/myLists", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        const neededProducts = {};
        req.user.favoriteList.forEach(productID => {
            neededProducts[productID] = null
        });
        req.user.wishLists.forEach(list => {
            list.products.forEach(productID => {
                neededProducts[productID] = null
            })
        });
        if (Object.keys(neededProducts).length == 0) {
            const response = {
                favoriteList: req.user.favoriteList,
                wishLists: req.user.wishLists
            }
            res.body = response;
            res.send(response);
            next();
            return;
        }
        const result = await fetch(productURL + "/ProductMapAssign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "inner-secret": process.env.innerSecret
            },
            body: JSON.stringify(neededProducts)
        });
        const products = await result.json();
        req.user.favoriteList.forEach((productID, index) => {
            req.user.favoriteList[index] = products[productID];
        });
        req.user.wishLists.forEach(list => {
            list.products.forEach((productID, index) => {
                list.products[index] = products[productID];
            })
        });
        const response = {
            favoriteList: req.user.favoriteList,
            wishLists: req.user.wishLists
        }
        res.body = response;
        res.send(response);
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});
// half checked

router.post("/createWishList", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        await validateCreateWishList(req.body, req.user.wishLists);
    } catch (error) {
        console.log(error)
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const result = await updateUser(req.user._id, {
            wishLists: [...req.user.wishLists, { title: req.body.title, products: [] }]
        });

        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

router.post("/addToWishList", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        await validateAddToWishList(req.body);
    } catch (error) {
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const updatedWishLists = req.user.wishLists.map(list => {
            if (list.title == req.body.title) {
                return { ...list, products: [...list.products, req.body.productID] };
            }
            return list;
        })
        const result = await updateUser(req.user._id, {
            wishLists: updatedWishLists
        });

        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

router.post("/addToFavoriteList", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        await validateAddToFavoriteList(req.body, req.user.favoriteList);
    } catch (error) {
        console.log(error)
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const result = await updateUser(req.user._id, {
            favoriteList: [...req.user.favoriteList, req.body.productID]
        });

        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

// checked
router.put("/addAddress", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    const { error } = validateAddress(req.body);
    if (error) {
        res.status(400).send({ error: error.details[0].message });
        res.body = { error: error.details[0].message };
        next();
        return;
    }
    try {
        let checker = false
        req.user.addresses.forEach(address => {
            if (_.isEqual({ ...address, _id: undefined, coordinates: { ...address.coordinates, _id: undefined } }, { ...req.body, _id: undefined, coordinates: { ...req.body.coordinates, _id: undefined } })) {
                checker = true;
            }
        })
        if (checker) {
            res.status(400).send("this address is already submitted");
            res.body = "this address is already submitted";
            next();
            return;
        }

        const result = await updateUser(req.user._id, {
            addresses: [...req.user.addresses, req.body]
        });

        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});
// checked

router.put("/deleteAddress", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    const { error } = validateAddress(req.body);
    if (error) {
        res.status(400).send({ error: error.details[0].message });
        res.body = { error: error.details[0].message };
        next();
        return;
    }
    try {
        let checker = false;
        for (let index = 0; index < req.user.addresses.length; index++) {
            if (_.isEqual({ ...req.user.addresses[index], _id: undefined, coordinates: { ...req.user.addresses[index].coordinates, _id: undefined } }, { ...req.body, _id: undefined, coordinates: { ...req.body.coordinates, _id: undefined } })) {
                checker = true;
                req.user.addresses.splice(index, 1);
                break;
            }
        }
        if (!checker) {
            res.status(400).send("this address does not submitted");
            res.body = "this address does not submitted";
            next();
            return;
        }
        const result = await updateUser(req.user._id, {
            addresses: req.user.addresses
        });

        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});


// half checked 

router.get("/myGiftCards", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        // console.log()
        const boughtGiftCards = (await getBoughtGiftCards(req.user.boughtGiftCards)).response;
        const receivedGiftCards = (await getReceivedGiftCards(req.user.receivedGiftCards)).response;

        const response = {
            boughtGiftCards: boughtGiftCards,
            receivedGiftCards: receivedGiftCards
        }
        res.body = response;
        res.send(response);
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

router.post("/addGiftCard", innerAuth, async (req, res, next) => {
    try {
        await validateGiftCardPost(req.body);
    } catch (error) {
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        let counter = 0;
        let code;
        while (true) {
            counter++;
            code = generateRandomString(16);
            const result = await getGiftCards(undefined, { code: code })
            console.log(result)
            if (result.response.length == 0) {
                break;
            }
            if (counter > 40) {
                console.log("Error", "couldnt generate unique random code");
                res.body = { error: "internal server error" };
                res.status(500).send({ error: "internal server error" });
                return
            }
        }
        const result = await saveGiftCard({ ...req.body, code: code });
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const user = await addBoughtGiftCard(req.body.buyerID, result.response._id)
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

router.post("/useGiftCard", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        await validateGiftCardUse(req.body);
    } catch (error) {
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        console.log(1)
        const giftCards = (await getGiftCards(undefined, { code: req.body.code })).response;
        if (giftCards.length == 0) {
            res.status(400).send({ error: "invalid code" });
            res.body = { error: "invalid code" };
            next();
            return;
        }
        const giftCard = giftCards[0];
        if (giftCard.isUsed) {
            res.status(400).send({ error: "this gift card is already used" });
            res.body = { error: "this gift card is already used" };
            next();
            return;
        }
        console.log(2)
        if (giftCard.buyerID.toString() != req.user._id) {
            const user = await addreceivedGiftCard(req.user._id, giftCard._id);

        }
        console.log(3)

        const result1 = await updateGiftCard(giftCard._id, { userID: req.user._id, isUsed: true, useDate: Date.now() })
        if (result1.error) {
            res.status(400).send({ error: result1.error });
            res.body = { error: result1.error };
            next();
            return;
        }
        const result2 = await changeWalletMoney(req.user.walletID, giftCard.amount)
        if (result2.error) {
            res.status(400).send({ error: result2.error });
            res.body = { error: result2.error };
            next();
            return;
        }
        const result3 = await saveTransaction({
            money: giftCard.amount,
            title: "استفاده از گیفت کارت",
            sender: {
                method: "wallet",
                entityType: "giftCard"
            },
            receiver: {
                method: "wallet",
                entityType: "user",
                receiverID: req.user._id
            }
        })

        if (result3.error) {
            res.status(400).send({ error: result3.error });
            res.body = { error: result3.error };
            next();
            return;
        }
        res.send(result3.response);
        res.body = result3.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

// checked 

router.patch("/seeNotification/:id", (req, res, next) => auth(req, res, next, ["user", "seller"]), async (req, res, next) => {
    const { error: e } = validateId(req.params.id);
    if (e) {
        res.status(400).send({ error: e.details[0].message });
        res.body = { error: e.details[0].message };
        next();
        return;
    }
    try {


        let result = await getNotifications(req.params.id);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        if (!result.response) {
            res.status(400).send({ error: "notifiction not found" });
            res.body = { error: "notifiction not found" };
            next();
            return;
        }
        if (req.seller) {
            if (req.seller._id != result.response.sellerID.toString()) {
                res.status(400).send({ error: "this is not your notification" });
                res.body = { error: "this is not your notification" };
                next();
                return;
            }
        } else {
            if (req.user._id != result.response.userID.toString()) {
                res.status(400).send({ error: "this is not your notification" });
                res.body = { error: "this is not your notification" };
                next();
                return;
            }
        }
        result = await updateNotification(req.params.id, {
            isSeen: true
        })
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();

})

router.get("/myNotifications", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        let floor = 0;
        let limit = 30;
        if (req.query.floor && Number.isInteger(req.query.floor)) {
            floor == req.query.floor;
        }
        if (req.query.limit && Number.isInteger(req.query.limit) && req.query.limit <= 500) {
            limit = req.query.limit;
        }
        const notifArray = [];
        for (let index = req.user.notifications.length - floor - 1; index >= 0; index--) {
            const element = req.user.notifications[index];
            notifArray.push(element);

        }
        if (notifArray.length == 0) {
            res.send([]);
            res.body = [];
            next();
            return;
        }
        const result = await getNotifications(undefined, undefined, notifArray);
        // console.log(result)
        // console.log(req.user.notifications)
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

// half checked 
router.get("/myWallet", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {

        const result = await getWallets(req.user.walletID);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
});

router.get("/myTransactions", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {

    try {

        const result = await getAllUserTransactions(req.user._id, "user")
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

router.post("/sellerRating", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        await validatePostSellerRating(req.body);
    } catch (error) {
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const oldIndex = null;
        const sameRateChecker = false;
        for (let index = 0; index < req.user.ratedSellers.length; index++) {
            if (req.user.ratedSellers[index].sellerID == req.body.sellerID) {
                oldIndex = index;
                if (oldRate == req.body.rate) {
                    sameRateChecker = true;
                }
            }
        }
        if (sameRateChecker) {
            res.status(400).send({ error: "this rating is the same as the old one" });
            res.body = { error: "this rating is the same as the old one" };
            next();
            return;
        }
        if (oldIndex) {
            const result = await updateRating({ newRating: req.body.rate, oldRating: req.user.ratedSellers[oldIndex], sellerID: req.body.sellerID });
            req.user.ratedSellers[oldIndex].rate = req.body.rate;
            await updateUser(req.user._id, { ratedSellers: req.user.ratedSellers });
            if (result.response) {
                res.send({ result: "your rating is successfully submitted" });
                res.body = { result: "your rating is successfully submitted" };
            }
        } else {
            const result = await addRating({ newRating: req.body.rate, sellerID: req.body.sellerID });
            req.user.ratedSellers.push({
                rate: req.body.rate,
                sellerID: req.body.sellerID
            })
            await updateUser(req.user._id, { ratedSellers: req.user.ratedSellers });
            if (result.response) {
                res.send({ result: "your rating is successfully submitted" });
                res.body = { result: "your rating is successfully submitted" };
            }
        }


    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

router.post("/createWishList", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        await validateCreateWishList(req.body, req.user.wishLists);
    } catch (error) {
        console.log(error)
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const result = await updateUser(req.user._id, {
            wishLists: [...req.user.wishLists, { title: req.body.title, products: [] }]
        });

        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});
router.delete("/shopingCart/:productID", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        const result = await deleteOrderFromCart({ userID: req.user._id, productID: req.params.productID });
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
        next();
        return;

    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

router.post("/buyTheCart", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    const { error } = validateBuyTheCart(req.body);
    if (error) {
        res.status(400).send({ error: error.details[0].message });
        res.body = { error: error.details[0].message };
        next();
        return;
    }
    try {
        let totalPrice = await fetch(productURL + "/orderListTotalPrice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "inner-secret": process.env.innerSecret
            },
            body: JSON.stringify(
                {
                    OrderList: req.user.shoppingCart

                })
        });
        const totalPriceJSON = await totalPrice.json()
        if (!result.ok) {
            res.status(400).send(totalPriceJSON);
            res.body = totalPriceJSON;
            next();
            return;
        }
        const userWallet = await getWallets(req.user.walletID);
        if (userWallet.money < totalPriceJSON.totalPrice) {
            res.status(400).send({ error: "شما در کیف پول خود به اندازه کافی موجودی ندارید" });
            res.body = { error: "شما در کیف پول خود به اندازه کافی موجودی ندارید" };
            next();
            return;
        }
        let result = await fetch(productURL + "/orderHistory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "inner-secret": process.env.innerSecret
            },
            body: JSON.stringify(
                {
                    OrderList: req.user.shoppingCart,
                    UserID: req.user._id,
                    Address: req.body.address,
                    DisscounCode: req.body.discount || ""

                })
        });
        const resultJSON = await result.json()
        if (!result.ok) {
            res.status(400).send(resultJSON);
            res.body = resultJSON;
            next();
            return;
        }
        if (!resultJSON?.orderHistoryID) {
            res.status(400).send({ error: "no order history found" });
            res.body = { error: "no order history found" };
            next();
            return;
        }
        result = await addOrderHistoryToList({ userID: req.user._id, orderHistoryID: resultJSON.orderHistoryID });
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        result = await emptyTheCart(req.user._id);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const updateWallet = await changeWalletMoney(req.user.walletID, totalPriceJSON.totalPrice);
        for (let index = 0; index < resultJSON.orderHistorySellers.length; index++) {
            const element = resultJSON.orderHistorySellers[index];
            await changeWalletMoney(element.sellerID, element.income)

        }
        res.send(result.response);
        res.body = result.response;
        next();
        return;

    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

// router.get("/test", async (req, res, next) => {
//     try {

//         console.log(req.query);
//         res.send("tested");

//     } catch (err) {
//         console.log("Error", err);
//         res.body = { error: "internal server error" };
//         res.status(500).send({ error: "internal server error" });
//     }
//     next();
// });
router.post("/increaseWallet", (req, res, next) => auth(req, res, next, ["user"]), async (req, res, next) => {
    try {
        await validateIncreaseWallet(req.body, req.user.wishLists);
    } catch (error) {
        console.log(error)
        if (error.details) {
            res.status(400).send({ error: error.details[0].message });
            res.body = { error: error.details[0].message };
        } else {
            res.status(400).send({ error: error.message });
            res.body = { error: error.message };
        }
        next();
        return;
    }
    try {
        const result = await changeWalletMoney(req.user.walletID, req.body.amount);

        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});
export default router;