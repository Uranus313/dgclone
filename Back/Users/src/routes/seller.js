import express, { request } from "express"
import { auth } from "../authorization/auth.js";
import validateId from "../functions/validateId.js";
import _ from "lodash";
import { generateRandomString } from "../functions/randomString.js";
import { changeWalletMoney, getWallets, saveWallet, updateWallet } from "../DB/CRUD/wallet.js";
import { getAllUserTransactions, saveTransaction } from "../DB/CRUD/transaction.js";
import { getNotifications, saveNotification } from "../DB/CRUD/notification.js";
import jwt from "jsonwebtoken";
import { innerAuth } from "../authorization/innerAuth.js";
import { validateChangeEmail, validateChangeEmailVerify, validateChangePhoneNumberVerify, validateSellerChangeinfo, validateSellerChangePhoneNumber, validateSellerlogInWithPhoneNumber, validateSellerPost, validateVerificationChange } from "../DB/models/seller.js";
import { changeSellerPassword, logIn, saveSeller, updateSeller } from "../DB/CRUD/seller.js";
import { validateChangePassword, validateUserLogIn } from "../DB/models/user.js";
import { getVerifyRequests, saveVerifyRequest, updateVerifyRequest } from "../DB/CRUD/verifyRequest.js";
import { validateVerifyRequestAnswer } from "../DB/models/verifyRequest.js";
import { levels } from "../authorization/accessLevels.js";
import { roleAuth } from "../authorization/roleAuth.js";
import { sellerSaleInfo } from "../functions/sellerSaleInfo.js";
import { deleteEmailVerification, getEmailVerifications, saveEmailVerification } from "../DB/CRUD/emailVerification.js";
import { sendMail } from "../functions/sendMail.js";
import { deletePhoneNumberVerification, getPhoneNumberVerifications, savePhoneNumberVerification } from "../DB/CRUD/phoneNumberVerification.js";
import { sendSMS } from "../functions/sendSMS.js";
const router = express.Router();

router.post("/signUp", async (req, res, next) => {
    try {
        await validateSellerPost(req.body);
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
        const result1 = await saveSeller(req.body);
        if (result1.error) {
            res.status(400).send({ error: result1.error });
            res.body = { error: result1.error };
            next();
            return;
        }
        const result2 = await saveWallet({ userID: result1.response._id, userType: "seller" });
        if (result2.error) {
            res.status(400).send({ error: result2.error });
            res.body = { error: result2.error };
            next();
            return;
        }
        const result3 = await updateSeller(result1.response._id, { walletID: result2.response._id, password: "12345678" });
        if (result3.error) {
            res.status(400).send({ error: result3.error });
            res.body = { error: result3.error };
            next();
            return;
        }
        const token = jwt.sign({ _id: result3.response._id, status: "seller" }, process.env.JWTSECRET, { expiresIn: '6h' });
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


router.patch("/changeEmail", (req, res, next) => auth(req, res, next, ["seller"]), async (req, res, next) => {
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
        const prevRequest = await getEmailVerifications(undefined,req.body.email);
        if(prevRequest.response){
            res.status(400).send({ error: "به این ایمیل کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." });
            res.body = { error: "به این ایمیل کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." };
            next();
            return;
        }
        const randomCode = generateRandomString(6);
        const result = await saveEmailVerification( {email :req.body.email , verificationCode : randomCode});
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const sendResult = await sendMail({title:"کد تایید ایمیل",text:result.response.verificationCode,targetEmail :req.body.email});
        if(sendResult.error){
            res.status(400).send({ error: "در ارسال ایمیل اشکالی به وجود آمد" });
            res.body = { error: "در ارسال ایمیل اشکالی به وجود آمد" };
            next();
            return;
        }
        res.send({message:"کد ایجاد شد"});
        res.body = {message:"کد ایجاد شد"};
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();

});
// checked
router.patch("/verifyChangeEmail", (req, res, next) => auth(req, res, next, ["seller"]), async (req, res, next) => {
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
        const prevRequest = await getEmailVerifications(undefined,req.body.email);
        if(!prevRequest.response){
            res.status(404).send({ error: "not found" });
            res.body = { error: "not found" };
            next();
            return;
        }
        if(prevRequest.response.verificationCode != req.body.verificationCode){
            res.status(404).send({ error: "کد اشتباه است" });
            res.body = { error: "کد اشتباه است" };
            next();
            return;
        }
        const deleteresult = await deleteEmailVerification( undefined , req.body.email);
        if (deleteresult.error) {
            // res.status(400).send({ error: deleteresult.error });
            // res.body = { error: deleteresult.error };
            console.log(deleteresult.error)
            next();
            return;
        }
        const result = await updateSeller(req.seller._id, {storeOwner:{...req.seller.storeOwner,email : req.body.email} });
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const token = jwt.sign({ _id: result.response._id, status: "seller" }, process.env.JWTSECRET, { expiresIn: '6h' });
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
router.patch("/changeMyinfo", (req, res, next) => auth(req, res, next, ["seller"]), async (req, res, next) => {
    try {
        await validateSellerChangeinfo(req.body, req.seller._id);
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
        const result = await updateSeller(req.seller._id, req.body);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const saleinfo = await sellerSaleInfo(req.seller._id);
        if(saleinfo.status == 200){
            const saleinfoJson = await saleinfo.json();
            result.response = {...result.response ,saleinfoJson}
        }
        const token = jwt.sign({ _id: result.response._id, status: "seller" }, process.env.JWTSECRET, { expiresIn: '6h' });
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
//  checked
// router.get("/checkToken",(req, res,next) => auth(req, res,next, ["seller"]), async (req,res) =>{
//     try {
//         delete req.seller.password;
//         res.send(req.seller);
//         res.body = req.seller;
//     } catch (err) {
//         console.log("Error",err);
//         res.body = {error:"internal server error"};
//         res.status(500).send({error:"internal server error"});
//     }
// })

router.patch("/changePassword", (req, res, next) => auth(req, res, next, ["seller"]), async (req, res, next) => {
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

        const result = await changeSellerPassword(req.seller._id, req.body.newPassword, req.body.oldPassword);
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
router.post("/logIn", async (req, res, next) => {
    const { error } = validateUserLogIn(req.body);
    if (error) {
        res.status(400).send({ error: error.details[0].message });
        res.status(400).send({ error: error.message });
        next();
        return;
    }
    try {
        const result = await logIn(req.body.email, req.body.phoneNumber, req.body.password);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const saleinfo = await sellerSaleInfo(result.response._id);
        if(saleinfo.status == 200){
            const saleinfoJson = await saleinfo.json();
            result.response = {...result.response ,saleinfoJson}
        }
        const token = jwt.sign({_id : result.response._id , status: "seller"},process.env.JWTSECRET,{expiresIn : '6h'});
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



router.post("/verifyRequest", (req, res, next) => auth(req, res, next, ["seller"]), async (req, res, next) => {
    try {
        if (req.seller.isVerified) {
            res.status(400).send("you are already verified");
            res.body = "you are already verified";
            next();
            return;
        }
        if (!req.seller.storeInfo || !req.seller.warehouseAddress) {
            res.status(400).send("pls first fill out your store information and warehouse address");
            res.body = "pls first fill out your store information and warehouse address";
            next();
            return;
        }
        const oldRequests = await getVerifyRequests(undefined, { sellerID: req.seller._id, state: "pending" });
        if (oldRequests.response.length > 0) {
            res.status(400).send("you already have a verify request waiting to be aswered");
            res.body = "you already have a verify request waiting to be aswered";
            next();
            return;
        }
        const result = await saveVerifyRequest({ sellerID: req.seller._id });
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

router.patch("/verifyRequest", (req, res, next) => roleAuth(req, res, next, [{ level: levels.sellerManage, writeAccess: true }]), async (req, res, next) => {
    try {
        await validateVerifyRequestAnswer(req.body);
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
        if (req.body.state == "accepted") {
            const verifyRequest = await getVerifyRequests(req.body.requestID);
            if (verifyRequest.error) {
                res.status(400).send(verifyRequest.error);
                res.body = verifyRequest.error;
                next();
                return;
            }
            const seller = await updateSeller(verifyRequest.response.sellerID, { isVerified: true })
            if (seller.error) {
                res.status(400).send(seller.error);
                res.body = seller.error;
                next();
                return;
            }

        }
        if (req.user.status == "admin") {
            const result = await updateVerifyRequest(req.body.requestID, { adminID: req.user._id, state: req.body.state });
            if (result.error) {
                res.status(400).send({ error: result.error });
                res.body = { error: result.error };
                next();
                return;
            }
            saveNotification({ content: (req.body.state == "accepted")? " درخواست تایید شما قبول شد و از حالا می توانید کار خود را شروع کنید، موفق باشید.": "درخواست تایید شما رد شد، لطفا بعد از مرور دوباره مدارک خود تلاش کنید.",
                title: (req.body.state == "accepted")? " درخواست تایید شما قبول شد." :"درخواست تایید شما رد شد." ,
                teaser:(req.body.state == "accepted")? " درخواست تایید شما قبول شد." :"درخواست تایید شما رد شد.",
                userType:"seller",
                sellerID: result.response.sellerID
            })
            res.send(result.response);
            res.body = result.response;
        } else {
            const result = await updateVerifyRequest(req.body.requestID, { employeeID: req.user._id, state: req.body.state });
            if (result.error) {
                res.status(400).send({ error: result.error });
                res.body = { error: result.error };
                next();
                return;
            }
            res.send(result.response);
            res.body = result.response;
        }

    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});


router.patch("/verifySeller/:sellerID", (req, res, next) => roleAuth(req, res, next, [{ level: levels.sellerManage, writeAccess: true }]), async (req, res, next) => {
    try {
        await validateVerificationChange(req.params.sellerID);
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
        const result = await updateSeller(req.params.sellerID, { isVerified: true });
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        if (req.user.status == "admin") {
            await updateVerifyRequest(undefined, req.params.sellerID, { adminID: req.user._id, state: "accepted" })

        } else {
            await updateVerifyRequest(undefined, req.params.sellerID, { employeeID: req.user._id, state: "accepted" })

        }
        saveNotification({  content: " اکانت شما تایید شد و از حالا می توانید کار خود را شروع کنید، موفق باشید.",
            title:" اکانت شما تایید شد."  ,
            teaser:" اکانت شما تایید شد.",
            userType:"seller",
            sellerID: result.response.sellerID
        })

        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});
router.patch("/refuteSeller/:sellerID", (req, res, next) => roleAuth(req, res, next, [{ level: levels.sellerManage, writeAccess: true }]), async (req, res, next) => {
    try {
        await validateVerificationChange(req.params.sellerID);
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
        const result = await updateSeller(req.params.sellerID, { isVerified: false });
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        if (req.user.status == "admin") {
            await updateVerifyRequest(undefined, req.params.sellerID, { adminID: req.user._id, state: "rejected" })

        } else {
            await updateVerifyRequest(undefined, req.params.sellerID, { employeeID: req.user._id, state: "rejected" })

        }
        saveNotification({  content: " تاییدیه اکانت شما باطل شد ",
            title:" تاییدیه اکانت شما باطل شد "  ,
            teaser:" تاییدیه اکانت شما باطل شد ",
            userType:"seller",
            sellerID: result.response.sellerID
        })
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});
router.get("/myNotifications", (req, res, next) => auth(req, res, next, ["seller"]), async (req, res, next) => {
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
        for (let index = req.seller.notifications.length - floor - 1; index >= 0; index--) {
            const element = req.seller.notifications[index];
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
        // console.log(req.seller.notifications)
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
router.get("/myWallet", (req, res, next) => auth(req, res, next, ["seller"]), async (req, res, next) => {
    try {

        const result = await getWallets(req.seller.walletID);
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

router.get("/myTransactions", (req, res, next) => auth(req, res, next, ["seller"]), async (req, res, next) => {

    try {

        const result = await getAllUserTransactions(req.seller._id, "seller")
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

router.post("/lastVisited", (req, res, next) => auth(req, res, next, ["seller"]), async (req, res, next) => {
    try {
        await validateLastVisitedPost(req.body);
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
        const foundIndex = req.seller.lastVisited.indexOf(req.body.productID);
        if (foundIndex != -1) {
            for (let index = foundIndex; index > 0; index--) {
                req.seller.lastVisited[index] = req.seller.lastVisited[index - 1];
            }
            req.seller.lastVisited[0] = req.body.productID;
        } else {
            req.seller.lastVisited.pop();
            req.seller.lastVisited.unshift(req.body.productID);
        }
        const result = await updateSeller(req.seller._id, { lastVisited: req.seller.lastVisited })
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
router.post("/logInWithPhoneNumber",async (req, res, next) => {
    try {
        await validateSellerlogInWithPhoneNumber(req.body);
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
        const prevRequest = await getPhoneNumberVerifications(undefined,req.body.phoneNumber);
        if(prevRequest.response){
            res.status(400).send({ error: "به این شماره کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." });
            res.body = { error: "به این شماره کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." };
            next();
            return;
        }
        const randomCode = generateRandomString(6);
        const result = await savePhoneNumberVerification( {phoneNumber :req.body.phoneNumber , verificationCode : randomCode});
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const sendResult = await sendSMS({message:"کد تایید دیجیمارکت:" + "\n" + result.response.verificationCode,phoneNumber :req.body.phoneNumber});
        console.log(sendResult)
        if(sendResult.error){
            res.status(400).send({ error: "در ارسال پیامک اشکالی به وجود آمد" });
            res.body = { error: "در ارسال پیامک اشکالی به وجود آمد" };
            next();
            return;
        }
        res.send({message:"کد ایجاد شد"});
        res.body = {message:"کد ایجاد شد"};
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
})
router.post("/testPhoneNumber", async (req, res, next) => {
    try {
        await validateSellerChangePhoneNumber(req.body);
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
        const prevRequest = await getPhoneNumberVerifications(undefined,req.body.phoneNumber);
        if(prevRequest.response){
            res.status(400).send({ error: "به این شماره کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." });
            res.body = { error: "به این شماره کدی ارسال شده است. لطفا برای درخواست مجدد صبر کنید." };
            next();
            return;
        }
        const randomCode = generateRandomString(6);
        const result = await savePhoneNumberVerification( {phoneNumber :req.body.phoneNumber , verificationCode : randomCode});
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const sendResult = await sendSMS({message:"کد تایید دیجیمارکت:" + "\n" + result.response.verificationCode,phoneNumber :req.body.phoneNumber});
        console.log(sendResult)
        if(sendResult?.error){
            res.status(400).send({ error: "در ارسال پیامک اشکالی به وجود آمد" });
            res.body = { error: "در ارسال پیامک اشکالی به وجود آمد" };
            next();
            return;
        }
        res.send({message:"کد ایجاد شد"});
        res.body = {message:"کد ایجاد شد"};
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
        const prevRequest = await getPhoneNumberVerifications(undefined,req.body.phoneNumber);
        if(!prevRequest.response){
            res.status(404).send({ error: "not found" });
            res.body = { error: "not found" };
            next();
            return;
        }
        if(prevRequest.response.verificationCode != req.body.verificationCode){
            res.status(404).send({ error: "کد اشتباه است" });
            res.body = { error: "کد اشتباه است" };
            next();
            return;
        }
        const deleteresult = await deletePhoneNumberVerification( undefined , req.body.phoneNumber);
        if (deleteresult.error) {
            // res.status(400).send({ error: deleteresult.error });
            // res.body = { error: deleteresult.error };
            console.log(deleteresult.error)
            next();
            return;
        }
        let result = {};
        if(req.body.mode=="change"){
            await auth(req,res,undefined,["seller"]);
            if(!req.user){
                return;
            }
            result = await updateSeller(req.seller._id, {phoneNumber : req.body.phoneNumber});
            if (result.error) {
                res.status(400).send({ error: result.error });
                res.body = { error: result.error };
                next();
                return;
            }
        }else if (req.body.mode=="signUp"){
            result = await saveSeller(req.body);
            if (result.error) {
                res.status(400).send({ error: result.error });
                res.body = { error: result.error };
                next();
                return;
            }
            const result2 = await saveWallet({ userID: result.response._id, userType: "seller" });
            if (result2.error) {
                res.status(400).send({ error: result2.error });
                res.body = { error: result2.error };
                next();
                return;
            }
        }else if (req.body.mode=="logIn"){
            result = await getWallets(undefined,{phoneNumber: req.body.phoneNumber});
            if (result.error) {
                res.status(400).send({ error: result.error });
                res.body = { error: result.error };
                next();
                return;
            }
            if (!result.response[0]){
                res.status(404).send({ error: "user not found" });
                res.body = { error: "user not found" };
                next();
                return;
            }
            if(result.response[0].isBanned){
                res.status(404).send({ error: "user is banned" });
                res.body = { error: "user is banned" };
                next();
                return;
            }
            result.response = result.response[0];
        }
        
        const token = jwt.sign({ _id: result.response._id, status: "seller" }, process.env.JWTSECRET, { expiresIn: '6h' });
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
export default router;