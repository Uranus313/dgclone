import { adminSignUpAuth } from "../authorization/adminSignUpAuth.js";
import { auth } from "../authorization/auth.js";
import { logIn, saveAdmin } from "../DB/CRUD/admin.js";
import { updateSeller } from "../DB/CRUD/seller.js";
import { saveBannedSeller } from "../DB/CRUD/sellerBanList.js";
import { updateUser } from "../DB/CRUD/user.js";
import { saveBannedUser } from "../DB/CRUD/userBanList.js";
import { validateAdminPost } from "../DB/models/admin.js";
import { validateSellerBan } from "../DB/models/sellerBanList.js";
import { validateUserLogIn } from "../DB/models/user.js";
import { validateUserBan } from "../DB/models/userBanList.js";
import express from "express"


const router = express.Router();

router.post("/signUp",adminSignUpAuth,  async (req, res, next) =>{
    try {
        await validateAdminPost(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send(error.details[0].message);
            res.body = error.details[0].message;
        }else{
            res.status(400).send(error.message);
            res.body = error.message;
        }
        next();
        return;
    }
    try {
        const result = await saveAdmin(req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        const token = jwt.sign({...result.response , status: "admin"},process.env.JWTSECRET,{expiresIn : '6h'});
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.post("/logIn",  async (req, res, next) =>{
    try {
        await validateUserLogIn(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send(error.details[0].message);
            res.body = error.details[0].message;
        }else{
            res.status(400).send(error.message);
            res.body = error.message;
        }
        next();
        return;
    }
    try {
        const result = await logIn(req.body.email,req.body.phoneNumber, req.body.password);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        const token = jwt.sign({...result.response , status: "admin"},process.env.JWTSECRET,{expiresIn : '6h'});
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.post("/banUser",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateUserBan(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send(error.details[0].message);
            res.body = error.details[0].message;
        }else{
            res.status(400).send(error.message);
            res.body = error.message;
        }
        next();
        return;
    }
    try {
        const result1 = await saveBannedUser(req.body);
        if (result1.error){
            res.status(400).send(result1.error);
            res.body = result1.error;
            next();
            return;
        }
        const result2 = await updateUser(req.body.userID , {isBanned : true})
        if (result2.error){
            res.status(400).send(result2.error);
            res.body = result2.error;
            next();
            return;
        }
        res.send(result2.response);
        res.body = result2.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});
router.post("/banSeller",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateSellerBan(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send(error.details[0].message);
            res.body = error.details[0].message;
        }else{
            res.status(400).send(error.message);
            res.body = error.message;
        }
        next();
        return;
    }
    try {
        const result1 = await saveBannedSeller(req.body);
        if (result1.error){
            res.status(400).send(result1.error);
            res.body = result1.error;
            next();
            return;
        }
        const result2 = await updateSeller(req.body.sellerID , {isBanned : true})
        if (result2.error){
            res.status(400).send(result2.error);
            res.body = result2.error;
            next();
            return;
        }
        res.send(result2.response);
        res.body = result2.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});
export default router;
