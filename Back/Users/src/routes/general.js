import express from "express"
import { auth } from "../authorization/auth";
import { getUsers } from "../DB/CRUD/user";
import validateId from "../functions/validateId";
import { validateNotificationPost } from "../DB/models/notification";
import { saveNotification } from "../DB/CRUD/notification";
import { validateChangeMoney } from "../DB/models/wallet";
import { changeWalletMoney } from "../DB/CRUD/wallet";


const router = express.Router();

router.get("/allUsers", (req, res,next) => auth(req, res,next, ["admin", "transporter"]) ,async (req, res,next) =>{
    try {
        const result = await getUsers();
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

router.get("/allusers/:id",(req, res,next) => auth(req, res,next, ["admin", "transporter"]) , async (req, res, next) =>{
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
    const {error} = validateNotificationPost(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
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



export default router;