import { adminSignUpAuth } from "../authorization/adminSignUpAuth.js";
import { auth } from "../authorization/auth.js";
import { changeAdminPassword, logIn, saveAdmin } from "../DB/CRUD/admin.js";
import { updateSeller } from "../DB/CRUD/seller.js";
import { saveBannedSeller } from "../DB/CRUD/sellerBanList.js";
import { updateUser } from "../DB/CRUD/user.js";
import { saveBannedUser } from "../DB/CRUD/userBanList.js";
import { validateAdminPost } from "../DB/models/admin.js";
import { validateSellerBan } from "../DB/models/sellerBanList.js";
import { validateChangePassword, validateUserLogIn } from "../DB/models/user.js";
import { validateUserBan } from "../DB/models/userBanList.js";
import express from "express";
import jwt from "jsonwebtoken";


const router = express.Router();
//checked
router.post("/signUp",adminSignUpAuth,  async (req, res, next) =>{
    try {
        await validateAdminPost(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
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
        const token = jwt.sign({_id : result.response._id , status: "admin"},process.env.JWTSECRET,{expiresIn : '6h'});
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
//checked

router.post("/logIn",  async (req, res, next) =>{
    try {
        await validateUserLogIn(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
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
//checked
router.post("/banUser",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateUserBan(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }
        next();
        return;
    }
    try {
        const result1 = await saveBannedUser({...req.body , endDate: new Date(Date.now() + 6 * 60 * 60 * 1000 )});
        if (result1.error){
            res.status(400).send({error : result1.error});
            res.body = {error : result1.error};
            next();
            return;
        }
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

        const result = await changeAdminPassword(req.user._id,req.body.newPassword,req.body.oldPassword);
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
router.post("/banSeller",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateSellerBan(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }
        next();
        return;
    }
    try {
        const result1 = await saveBannedSeller(req.body);
        if (result1.error){
            res.status(400).send({error : result1.error});
            res.body = {error : result1.error};
            next();
            return;
        }
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
//checked
router.get("/checkToken",(req, res,next) => auth(req, res,next, ["admin"]), async (req,res) =>{
    try {
        delete req.admin.password;
        res.send(req.admin);
        res.body = req.admin;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
})

export default router;
