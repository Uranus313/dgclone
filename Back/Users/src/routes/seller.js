import express, { request } from "express"
import { auth } from "../authorization/auth.js";
import validateId from "../functions/validateId.js";
import _ from "lodash";
import { generateRandomString } from "../functions/randomString.js";
import { changeWalletMoney, getWallets, saveWallet, updateWallet } from "../DB/CRUD/wallet.js";
import { getAllUserTransactions, saveTransaction } from "../DB/CRUD/transaction.js";
import { getNotifications } from "../DB/CRUD/notification.js";
import jwt from "jsonwebtoken";
import { innerAuth } from "../authorization/innerAuth.js";
import { validateSellerChangeinfo, validateSellerPost } from "../DB/models/seller.js";
import { logIn, saveSeller, updateSeller } from "../DB/CRUD/seller.js";
import { validateUserLogIn } from "../DB/models/user.js";
import { getVerifyRequests, saveVerifyRequest, updateVerifyRequest } from "../DB/CRUD/verifyRequest.js";
import { validateVerifyRequestAnswer } from "../DB/models/verifyRequest.js";


const router = express.Router();

router.post("/signUp",  async (req, res, next) =>{
    try {
        await validateSellerPost(req.body); 
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
        const result1 = await saveSeller(req.body);
        if (result1.error){
            res.status(400).send(result1.error);
            res.body = result1.error;
            next();
            return;
        }
        const result2 = await saveWallet({userID : result1.response._id , userType : "seller"});
        if (result2.error){
            res.status(400).send(result2.error);
            res.body = result2.error;
            next();
            return;
        }
        const result3 = await updateSeller(result1.response._id,{walletID: result2.response._id , password : "12345678"});
        if (result3.error){
            res.status(400).send(result3.error);
            res.body = result3.error;
            next();
            return;
        }
        const token = jwt.sign({...result3.response , status: "seller"},process.env.JWTSECRET,{expiresIn : '6h'});
        res.header("x-auth-token",token).send(result3.response);
        res.body = result3.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});



router.patch("/changeMyinfo",(req, res,next) => auth(req, res,next, ["seller"]) ,  async (req, res, next) =>{
    try {
        await validateSellerChangeinfo(req.body); 
    } catch (error) {
        console.log(error)
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
        const result = await updateSeller(req.seller._id,req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        const token = jwt.sign({...result.response , status: "seller"},process.env.JWTSECRET,{expiresIn : '6h'});

        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});
//  checked
router.get("/checkToken",(req, res,next) => auth(req, res,next, ["seller"]), async (req,res) =>{
    try {
        delete req.seller.password;
        res.send(req.seller);
        res.body = req.seller;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
})


router.post("/logIn",  async (req, res, next) =>{
    const {error} = validateUserLogIn(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
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
        const token = jwt.sign({...result.response , status: "seller"},process.env.JWTSECRET,{expiresIn : '6h'});
        
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});



router.post("/verifyRequest",(req, res,next) => auth(req, res,next, ["seller"]),  async (req, res, next) =>{
    try {
        if ( req.seller.isVerified){
            res.status(400).send("you are already verified");
            res.body = "you are already verified";
            next();
            return;
        }
        const oldRequests = await getVerifyRequests(undefined , {sellerID : req.seller._id , state : "pending"});
        if (oldRequests.response.length > 0){
            res.status(400).send("you already have a verify request waiting to be aswered");
            res.body = "you already have a verify request waiting to be aswered";
            next();
            return;
        }
        const result = await saveVerifyRequest({sellerID : req.seller._id});
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.patch("/verifyRequest",(req, res,next) => auth(req, res,next, ["admin"]),  async (req, res, next) =>{
    try {
        await validateVerifyRequestAnswer(req.body); 
    } catch (error) {
        console.log(error)
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
        if (req.body.state == "accepted" ){
            const verifyRequest = await getVerifyRequests(req.body.requestID);
            if (verifyRequest.error){
                res.status(400).send(verifyRequest.error);
                res.body = verifyRequest.error;
                next();
                return;
            }
            const seller = await updateSeller(verifyRequest.response.sellerID , {isVerified : true})
            if (seller.error){
                res.status(400).send(seller.error);
                res.body = seller.error;
                next();
                return;
            }
        }
        
        const result = await updateVerifyRequest(req.body.requestID,{adminID : req.admin._id , state : req.body.state});
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});




router.get("/myNotifications", (req, res,next) => auth(req, res,next, ["seller"]) ,async (req, res,next) =>{
    try {
        
        const result = await getNotifications(undefined,undefined,req.seller.notifications)
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

// half checked 
router.get("/myWallet", (req, res,next) => auth(req, res,next, ["seller"]) ,async (req, res,next) =>{
    try {
        
        const result = await getWallets(req.seller.walletID);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
});

router.get("/myTransactions", (req, res,next) => auth(req, res,next, ["seller"]) ,async (req, res,next) =>{
    
    try {
        
        const result = await getAllUserTransactions(req.seller._id , "seller")
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.post("/lastVisited", (req, res,next) => auth(req, res,next, ["seller"]) ,async (req, res,next) =>{
    try {
        await validateLastVisitedPost(req.body); 
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
        const foundIndex = req.seller.lastVisited.indexOf(req.body.productID);
        if (foundIndex != -1){
            for (let index = foundIndex; index > 0; index--) {
                req.seller.lastVisited[index] = req.seller.lastVisited[index-1];
            }
            req.seller.lastVisited[0] = req.body.productID;
        }else{
            req.seller.lastVisited.pop();
            req.seller.lastVisited.unshift(req.body.productID);
        }
        const result = await updateSeller(req.seller._id,{lastVisited: req.seller.lastVisited})
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

export default router;