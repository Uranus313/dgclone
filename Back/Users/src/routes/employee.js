import { accessLevels } from "../authorization/accessLevels.js";
import { changeEmployeePassword, logIn, saveEmployee, updateEmployee } from "../DB/CRUD/employee.js";
import { validateChangeEmail, validateChangeEmailVerify, validateEmployeeChangeinfo, validateEmployeeChangePhoneNumber, validateEmployeelogInWithPhoneNumber, validateEmployeePost } from "../DB/models/employee.js";
import { validateChangePassword, validateUserLogIn } from "../DB/models/user.js";
import express from "express";
import jwt from "jsonwebtoken";
import { roleAuth } from "../authorization/roleAuth.js";
import { deleteRole, getRoles, saveRole } from "../DB/CRUD/role.js";
import { validateRolePost } from "../DB/models/role.js";
import { auth } from "../authorization/auth.js";
import validateId from "../functions/validateId.js";
import { levels } from "../authorization/accessLevels.js";
// import { roleAuth } from "../authorization/roleAuth.js";
import { validateWareHousePost } from "../DB/models/wareHouse.js";
import { deleteWareHouse, saveWareHouse } from "../DB/CRUD/wareHouse.js";
import { deleteEmailVerification, getEmailVerifications, saveEmailVerification } from "../DB/CRUD/emailVerification.js";
import { generateRandomString } from "../functions/randomString.js";
import { sendMail } from "../functions/sendMail.js";
import { deletePhoneNumberVerification, getPhoneNumberVerifications, savePhoneNumberVerification } from "../DB/CRUD/phoneNumberVerification.js";
import { sendSMS } from "../functions/sendSMS.js";
import { validateAdminChangePhoneNumber, validateChangePhoneNumberVerify } from "../DB/models/admin.js";
const router = express.Router();


router.patch("/changePassword", (req, res, next) => auth(req, res, next, ["employee"]), async (req, res, next) => {
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

        const result = await changeEmployeePassword(req.employee._id, req.body.newPassword, req.body.oldPassword);
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

router.post("/signUp", (req, res, next) => auth(req, res, next, ["admin"]), async (req, res, next) => {
    try {
        await validateEmployeePost(req.body);
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
        const result = await saveEmployee(req.body);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        // const token = jwt.sign({ _id: result.response._id, status: "employee" }, process.env.JWTSECRET, { expiresIn: '6h' });
        // delete result.response.password;
        // res.cookie('x-auth-token', token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none',
        //     maxAge: 6 * 60 * 60 * 1000
        // });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});
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
        const token = jwt.sign({_id : result.response._id , status: "employee"},process.env.JWTSECRET,{expiresIn : '6h'});
        delete result.response.password;
        res.cookie('x-auth-token',token,{
            httpOnly: true,
            secure: true,
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

router.patch("/changeEmail", (req, res, next) => auth(req, res, next, ["employee"]), async (req, res, next) => {
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
router.patch("/verifyChangeEmail", (req, res, next) => auth(req, res, next, ["employee"]), async (req, res, next) => {
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
        const result = await updateEmployee(req.employee._id, {email : req.body.email});
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const token = jwt.sign({ _id: result.response._id, status: "employee" }, process.env.JWTSECRET, { expiresIn: '6h' });
        res.cookie('x-auth-token', token, {
            httpOnly: true,
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


router.patch("/changeMyinfo", (req, res, next) => auth(req, res, next, ["employee"]), async (req, res, next) => {
    try {
        await validateEmployeeChangeinfo(req.body);
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
        const result = await updateEmployee(req.employee._id, req.body);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const token = jwt.sign({ _id: result.response._id, status: "employee" }, process.env.JWTSECRET, { expiresIn: '6h' });
        res.cookie('x-auth-token', token, {
            httpOnly: true,
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

router.get("/accessLevels", (req, res, next) => auth(req, res, next, ["admin","employee"]), async (req, res, next) => {
    res.send(accessLevels);
    res.body = accessLevels;
});
router.get("/roles", (req, res, next) => auth(req, res, next, ["admin"]), async (req, res, next) => {
    try {
        // console.log(req.query.limit)
        const result = await getRoles();
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/roles/:id", (req, res, next) => auth(req, res, next, ["admin"]), async (req, res, next) => {
    try {
        // console.log(req.query.limit)
        const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
        const result = await getRoles(req.params.id);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.delete("/roles/:id", (req, res, next) => auth(req, res, next, ["admin"]), async (req, res, next) => {
    try {
        // console.log(req.query.limit)
        const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
        const result = await deleteRole(req.params.id);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        if(!result.response){
            res.body = {error:"role not found"};
        res.status(404).send({error:"role not found"});
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.post("/roles",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateRolePost(req.body); 
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
        const result = await saveRole(req.body);
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
        //     secure: true,
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
router.post("/wareHouses",(req,res,next) => roleAuth(req,res,next,[{level : levels.wareHouseManage , writeAccess : true}]),  async (req, res, next) =>{
    try {
        await validateWareHousePost(req.body); 
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
        const result = await saveWareHouse(req.body);
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
        //     secure: true,
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

router.delete("/wareHouses/:id", (req,res,next) => roleAuth(req,res,next,[{level : levels.wareHouseManage , writeAccess : true}]), async (req, res, next) => {
    try {
        // console.log(req.query.limit)
        const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
        const result = await deleteWareHouse(req.params.id);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        if(!result.response){
            res.body = {error:"warehouse not found"};
        res.status(404).send({error:"warehouse not found"});
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.post("/logInWithPhoneNumber",async (req, res, next) => {
    try {
        await validateEmployeelogInWithPhoneNumber(req.body);
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
        await validateEmployeeChangePhoneNumber(req.body);
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
            await auth(req,res,undefined,["employee"]);
            if(!req.user){
                return;
            }
            result = await updateEmployee(req.employee._id, {phoneNumber : req.body.phoneNumber});
            if (result.error) {
                res.status(400).send({ error: result.error });
                res.body = { error: result.error };
                next();
                return;
            }
        }else if (req.body.mode=="signUp"){
            result = await saveEmployee(req.body);
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
            result = await getEmployees(undefined,{phoneNumber: req.body.phoneNumber});
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
        
        const token = jwt.sign({ _id: result.response._id, status: "employee" }, process.env.JWTSECRET, { expiresIn: '6h' });
        res.cookie('x-auth-token', token, {
            httpOnly: true,
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