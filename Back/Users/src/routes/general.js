import express from "express"
import { auth } from "../authorization/auth.js";
import { getUsers } from "../DB/CRUD/user.js";
import validateId from "../functions/validateId.js";
import { validateNotificationPost } from "../DB/models/notification.js";
import { saveNotification } from "../DB/CRUD/notification.js";
import { validateChangeMoney } from "../DB/models/wallet.js";
import { changeWalletMoney } from "../DB/CRUD/wallet.js";
import { getSellers } from "../DB/CRUD/seller.js";
import { getAdmins } from "../DB/CRUD/admin.js";
import { getGiftCards } from "../DB/CRUD/giftCard.js";
import { getTransactions } from "../DB/CRUD/transaction.js";
import { getTransporters } from "../DB/CRUD/transporter.js";


const router = express.Router();

router.get("/allUsers", (req, res,next) => auth(req, res,next, ["admin", "transporter"]) ,async (req, res,next) =>{
    try {
        const result = await getUsers(undefined,req.query);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }

        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/allUsers/:id",(req, res,next) => auth(req, res,next, ["admin", "transporter"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    } 
    try {
        const result = await getUsers(req.params.id);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        delete result.response.password;
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/allSellers", (req, res,next) => auth(req, res,next, ["admin", "transporter"]) ,async (req, res,next) =>{
    try {
        const result = await getSellers(undefined,req.query);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/allSellers/:id",(req, res,next) => auth(req, res,next, ["admin", "transporter"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    } 
    try {
        const result = await getSellers(req.params.id);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        delete result.response.password;
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/allAdmins", (req, res,next) => auth(req, res,next, ["admin"]) ,async (req, res,next) =>{
    try {
        const result = await getAdmins(undefined,req.query);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/allAdmins/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    } 
    try {
        const result = await getAdmins(req.params.id);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        delete result.response.password;
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/allGiftCards", (req, res,next) => auth(req, res,next, ["admin"]) ,async (req, res,next) =>{
    try {
        const result = await getGiftCards(undefined,req.query);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/allGiftCards/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    } 
    try {
        const result = await getGiftCards(req.params.id);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});


router.get("/allTransactions", (req, res,next) => auth(req, res,next, ["admin"]) ,async (req, res,next) =>{
    try {
        const result = await getTransactions(undefined,req.query);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/allTransactions/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    } 
    try {
        const result = await getTransactions(req.params.id);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/allTransporters", (req, res,next) => auth(req, res,next, ["admin"]) ,async (req, res,next) =>{
    try {
        const result = await getTransporters(undefined,req.query);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/allTransporters/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    } 
    try {
        const result = await getTransporters(req.params.id);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        delete result.response.password;
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});
router.post("/notification",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    try {
        await validateNotificationPost(req.body); 
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
        const result = await saveNotification(req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.post("/changeWalletMoney",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    try {
        await validateChangeMoney(req.body); 
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
        const result = await changeWalletMoney(req.body.userID,req.body.amount);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});


export default router;