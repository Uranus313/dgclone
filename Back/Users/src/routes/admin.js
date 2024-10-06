import { adminSignUpAuth } from "../authorization/adminSignUpAuth.js";
import { auth } from "../authorization/auth.js";
import { changeAdminPassword, getAdmins, logIn, saveAdmin, updateAdmin } from "../DB/CRUD/admin.js";
import { updateEmployee } from "../DB/CRUD/employee.js";
import { updateSeller } from "../DB/CRUD/seller.js";
import { saveBannedSeller } from "../DB/CRUD/sellerBanList.js";
import { updateUser } from "../DB/CRUD/user.js";
import { saveBannedUser } from "../DB/CRUD/userBanList.js";
import { validateAdminBan, validateAdminChangeinfo, validateAdminChangePhoneNumber, validateAdminlogInWithPhoneNumber, validateAdminPost, validateAdminUnban, validateChangeEmail, validateChangeEmailVerify, validateChangePhoneNumberVerify } from "../DB/models/admin.js";
import { validateEmployeeBan, validateEmployeeChangeRole, validateEmployeeUnban } from "../DB/models/employee.js";
import { validateSellerUnban } from "../DB/models/seller.js";
import { validateSellerBan } from "../DB/models/sellerBanList.js";
import { validateChangePassword, validateUserLogIn, validateUserUnban } from "../DB/models/user.js";
import { validateUserBan } from "../DB/models/userBanList.js";
import express from "express";
import jwt from "jsonwebtoken";
import validateId from "../functions/validateId.js";
import { getWallets } from "../DB/CRUD/wallet.js";
import { levels } from "../authorization/accessLevels.js";
import { roleAuth } from "../authorization/roleAuth.js";
import { updateTicket } from "../DB/CRUD/ticket.js";
import { deleteEmailVerification, getEmailVerifications, saveEmailVerification } from "../DB/CRUD/emailVerification.js";
import { generateRandomString } from "../functions/randomString.js";
import { sendMail } from "../functions/sendMail.js";
import { deletePhoneNumberVerification, getPhoneNumberVerifications, savePhoneNumberVerification } from "../DB/CRUD/phoneNumberVerification.js";
import { sendSMS } from "../functions/sendSMS.js";

const router = express.Router();
//checked
router.post("/signUp",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateAdminPost(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        const result = await saveAdmin(req.body);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        // const token = jwt.sign({_id : result.response._id , status: "admin"},process.env.JWTSECRET,{expiresIn : '6h'});
        // delete result.response.password;
        // res.cookie('x-auth-token',token,{
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV== "development"?false : true,
        //     sameSite: 'none',
        //     maxAge: 6 * 60 * 60 * 1000
        // });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
//checked

router.post("/logIn",  async (req, res, next) =>{
    try {
        await validateUserLogIn(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        const result = await logIn(req.body.email,req.body.phoneNumber, req.body.password);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        const token = jwt.sign({_id : result.response._id , status: "admin"},process.env.JWTSECRET,{expiresIn : '6h'});
        delete result.response.password;
        res.cookie('x-auth-token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV== "development"?false : true,
            sameSite: 'none',
            maxAge: 6 * 60 * 60 * 1000
        });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
//checked
router.patch("/banUser",(req,res,next) => roleAuth(req,res,next,[{level : levels.userManage , writeAccess : true}]),  async (req, res, next) =>{
    try {
        await validateUserBan(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        // const result1 = await saveBannedUser({...req.body , endDate: new Date(Date.now() + 6 * 60 * 60 * 1000 )});
        // if (result1.error){
        //     res.status(400).send({error : result1.error});
        //     res.body = {error : result1.error};
        //     next();
        //     return;
        // }
        const result2 = await updateUser(req.body.userID , {isBanned : true})
        if (result2.error){
            res.status(400).send({error : result2.error});
            res.body = {error : result2.error};
            next();
            return;
        }
        res.send(result2.response);
        res.body = result2.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.patch("/changeEmployeeRole",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateEmployeeChangeRole(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        if(!req.body.roleID){
            req.body.roleID = null;
        }
        const result = await updateEmployee(req.body.employeeID, {roleID: req.body.roleID});
        if (result.error){
            res.status(400).send({error : result1.error});
            res.body = {error : result1.error};
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.patch("/changePassword",(req, res,next) => auth(req, res,next, ["admin"]) ,  async (req, res, next) =>{
    const {error} = validateChangePassword(req.body); 
    console.log("login")
    if (error){
        // console.log({error : error.details[0].message})
        res.status(400).send({error : error.details[0].message});
        res.body = {error : error.details[0].message};
        next();
        return;
    }
    try {

        const result = await changeAdminPassword(req.admin._id,req.body.newPassword,req.body.oldPassword);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.patch("/banSeller",(req,res,next) => roleAuth(req,res,next,[{level : levels.sellerManage , writeAccess : true}]),  async (req, res, next) =>{
    try {
        await validateSellerBan(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        // const result1 = await saveBannedSeller(req.body);
        // if (result1.error){
        //     res.status(400).send({error : result1.error});
        //     res.body = {error : result1.error};
        //     next();
        //     return;
        // }
        const result2 = await updateSeller(req.body.sellerID , {isBanned : true})
        if (result2.error){
            res.status(400).send({error : result2.error});
            res.body = {error : result2.error};
            next();
            return;
        }
        res.send(result2.response);
        res.body = result2.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.patch("/banAdmin",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateAdminBan(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        // const result1 = await saveBannedSeller(req.body);
        // if (result1.error){
        //     res.status(400).send({error : result1.error});
        //     res.body = {error : result1.error};
        //     next();
        //     return;
        // }
        const result2 = await updateAdmin(req.body.adminID , {isBanned : true})
        if (result2.error){
            res.status(400).send({error : result2.error});
            res.body = {error : result2.error};
            next();
            return;
        }
        res.send(result2.response);
        res.body = result2.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.patch("/banEmployee",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateEmployeeBan(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        const result = await updateEmployee(req.body.employeeID , {isBanned : true})
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.patch("/unbanUser",(req,res,next) => roleAuth(req,res,next,[{level : levels.userManage , writeAccess : true}]),  async (req, res, next) =>{
    try {
        await validateUserUnban(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        const result2 = await updateUser(req.body.userID , {isBanned : false})
        if (result2.error){
            res.status(400).send({error : result2.error});
            res.body = {error : result2.error};
            next();
            return;
        }
        res.send(result2.response);
        res.body = result2.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.patch("/unbanSeller",(req,res,next) => roleAuth(req,res,next,[{level : levels.sellerManage , writeAccess : true}]),  async (req, res, next) =>{
    try {
        await validateSellerUnban(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        const result2 = await updateSeller(req.body.sellerID , {isBanned : false})
        if (result2.error){
            res.status(400).send({error : result2.error});
            res.body = {error : result2.error};
            next();
            return;
        }
        res.send(result2.response);
        res.body = result2.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.patch("/unbanEmployee",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateEmployeeUnban(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        const result2 = await updateEmployee(req.body.employeeID , {isBanned : false})
        if (result2.error){
            res.status(400).send({error : result2.error});
            res.body = {error : result2.error};
            next();
            return;
        }
        res.send(result2.response);
        res.body = result2.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.patch("/unbanAdmin",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateAdminUnban(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        const result2 = await updateAdmin(req.body.adminID , {isBanned : false})
        if (result2.error){
            res.status(400).send({error : result2.error});
            res.body = {error : result2.error};
            next();
            return;
        }
        res.send(result2.response);
        res.body = result2.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
//checked
// router.get("/checkToken",(req, res,next) => auth(req, res,next, ["admin"]), async (req,res) =>{
//     try {
//         delete req.admin.password;
//         res.send(req.admin);
//         res.body = req.admin;
//     } catch (err) {
//         console.log("Error",err);
//         res.body = {error:"internal server error"};
//         res.status(500).send({error:"internal server error"});
//     }
// })

router.patch("/changeEmail", (req, res, next) => auth(req, res, next, ["admin"]), async (req, res, next) => {
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
router.patch("/verifyChangeEmail", (req, res, next) => auth(req, res, next, ["admin"]), async (req, res, next) => {
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
        const result = await updateAdmin(req.admin._id, {email : req.body.email});
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const token = jwt.sign({ _id: result.response._id, status: "admin" }, process.env.JWTSECRET, { expiresIn: '6h' });
        res.cookie('x-auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV== "development"?false : true,
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
router.patch("/changeMyinfo",(req, res,next) => auth(req, res,next, ["admin"]) ,  async (req, res, next) =>{
    try {
        await validateAdminChangeinfo(req.body); 
    } catch (error) {
        console.log(error)
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        const result = await updateAdmin(req.admin._id,req.body);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        const token = jwt.sign({_id : result.response._id , status: "admin"},process.env.JWTSECRET,{expiresIn : '6h'});
        res.cookie('x-auth-token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV== "development"?false : true,
            sameSite: 'none',
            maxAge: 6 * 60 * 60 * 1000
        });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/getWallet/:walletID", (req,res,next) => roleAuth(req,res,next,[{level : levels.userManage},{level : levels.sellerManage}]), async (req, res, next) => {
    try {
        const {error} = validateId(req.params.walletID);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
        const result = await getWallets(req.params.walletID);
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
router.patch("/seeTicket/:ticketID",(req,res,next) => roleAuth(req,res,next,[{level : levels.ticketManage , writeAccess : true}]) ,  async (req, res, next) =>{
    const {error} = validateId(req.params.ticketID);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
    try {
        if(req.user.status == "admin"){
            const result = await updateTicket(req.params.ticketID,{adminID : req.user._id , isSeen : true});
            if (result.error){
                res.status(400).send({error : result.error});
                res.body = {error : result.error};
                next();
                return;
            }
            if(!result.response){
                res.body = {error:"ticket not found"};
                res.status(404).send({error:"ticket not found"});
                next();
                return;
            }
            res.send(result.response);
            res.body = result.response;
        }else if(req.user.status == "employee"){
            const result = await updateTicket(req.params.ticketID,{employeeID : req.user._id , isSeen : true});
            if (result.error){
                res.status(400).send({error : result.error});
                res.body = {error : result.error};
                next();
                return;
            }
            if(!result.response){
                res.body = {error:"ticket not found"};
                res.status(404).send({error:"ticket not found"});
                next();
                return;
            }
            res.send(result.response);
            res.body = result.response;
        }else{
            res.body = {error:"internal server error"};
            res.status(500).send({error:"internal server error"}); 
        }
        
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.post("/logInWithPhoneNumber",async (req, res, next) => {
    try {
        await validateAdminlogInWithPhoneNumber(req.body);
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
        await validateAdminChangePhoneNumber(req.body);
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
            await auth(req,res,undefined,["admin"]);
            if(!req.user){
                return;
            }
            result = await updateAdmin(req.admin._id, {phoneNumber : req.body.phoneNumber});
            if (result.error) {
                res.status(400).send({ error: result.error });
                res.body = { error: result.error };
                next();
                return;
            }
        }else if (req.body.mode=="signUp"){
            result = await saveAdmin(req.body);
            if (result.error) {
                res.status(400).send({ error: result.error });
                res.body = { error: result.error };
                next();
                return;
            }
            res.send(result.response);
            res.body = result.response;
            return;
        }else if (req.body.mode=="logIn"){
            result = await getAdmins(undefined,{phoneNumber: req.body.phoneNumber});
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
        
        const token = jwt.sign({ _id: result.response._id, status: "admin" }, process.env.JWTSECRET, { expiresIn: '6h' });
        res.cookie('x-auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV== "development"?false : true,
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
