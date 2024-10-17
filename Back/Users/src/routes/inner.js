import express from "express";
import jwt from "jsonwebtoken";
import { innerAuth } from "../authorization/innerAuth.js";
import { addProductToList, getSellers } from "../DB/CRUD/seller.js";
import { addcommentToList, addOrderHistoryToList, addOrderToCart, getUsers, removeOrderFromCart } from "../DB/CRUD/user.js";
import { getAdmins } from "../DB/CRUD/admin.js";
import { getEmployees } from "../DB/CRUD/employee.js";

import { roleAuth } from "../authorization/roleAuth.js";
import validateId from "../functions/validateId.js";
import { validateNotificationPost } from "../DB/models/notification.js";
import { saveNotification } from "../DB/CRUD/notification.js";

const router = express.Router();

router.get("sellerCard/:id",innerAuth,async (req, res, next) => {
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
    try {
        const result = await getSellers(req.params.id);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        const seller = result.response;
        if(!seller){
            res.status(404).send({error : "seller not found"});
            res.body = {error : "seller not found"};
            next();
            return;
        }
        if(seller.isBanned){
            res.status(403).send({error : "seller is banned"});
            res.body = {error : "seller is banned"};
            next();
            return;
        }if(!seller.isVerified){
            res.status(403).send({error : "seller is not verified"});
            res.body = {error : "seller is not verified"};
            next();
            return;
        }

        const sellerCard = {
            title : seller.storeInfo.commercialName,
            rating : seller.rating
        }
        res.body = sellerCard;
        res.send(sellerCard)
    } catch (err) {
        console.log("Error",err);
        res.body = {err:"internal server error"};
        res.status(500).send({err:"internal server error"});
    }
})
router.get("/checkToken/:token",innerAuth,async (req, res, next) => {
    try {
        const decoded = jwt.verify(req.params.token,process.env.JWTSECRET);
        switch (decoded.status) {
            case "user":
                const user = (await getUsers(decoded._id)).response;
                // console.log(user.addresses)
                if(!user){
                    res.status(401).send({error:"access denied. invalid user."});
                    res.body = {error:"access denied. invalid user."};
                    next()
                    return 
                }
                if (user.isBanned){
                    res.status(403).send({error:"access denied. you are banned."});
                    res.body = {error:"access denied. you are banned."};
                    next();
                    return 
                }
                
                res.body = {
                    status : decoded.status,
                    entity: user
                };
                res.send({
                    status : decoded.status,
                    entity: user
                });
                next();

                break;
            
            case "seller":
                const seller = (await getSellers(decoded._id)).response;
                if(!seller){
                    res.status(401).send({error:"access denied. invalid seller."});
                    res.body = {error:"access denied. invalid seller."};
                    next();
                    return 
                }
                if (seller.isBanned){
                    res.status(403).send({error:"access denied. you are banned."});
                    res.body = {error:"access denied. you are banned."};
                    next();
                    return 
                }
                res.body = {
                    status : decoded.status,
                    entity: seller
                };
                res.send({
                    status : decoded.status,
                    entity: seller
                });
                next();
                break;  
            case "admin":
                const admin = (await getAdmins(decoded._id)).response;
                if(!admin){
                    res.status(401).send({error:"access denied. invalid admin."});
                    res.body = {error:"access denied. invalid admin."};
                    next();
                    return 
                }
                res.body = {
                    status : decoded.status,
                    entity: admin
                };
                res.send({
                    status : decoded.status,
                    entity: admin
                });
                next();
                break;    
            case "employee":
                const employee = (await getEmployees(decoded._id)).response;
                if(!employee){
                    res.status(401).send({error:"access denied. invalid employee."});
                    res.body = {error:"access denied. invalid employee."};
                    next();
                    return 
                }
                res.body = {
                    status : decoded.status,
                    entity: employee
                };
                res.send({
                    status : decoded.status,
                    entity: employee
                });
                next();
                break;               
            default:
                break;
        }
        next();
    } catch (error) {
        console.log(error)
        res.status(400).send({error:"invalid token"});
        res.body = {error:"invalid token"};
    }
})


router.get("/checkUser/:id",innerAuth, async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    console.log(error)
    if (error){
        res.status(400).send({error : error.details[0].message});
        res.body = {error : error.details[0].message};
        next();
        return;
    } 
    try {
        const result = await getUsers(req.params.id);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        if(!result.response){
            res.send({result : false});
            res.body = {result : false};
            next();
            return;
        }else if(result.response.isBanned){
            res.send({result : false});
            res.body = {result : false};
            next();
            return;
        }else{
            res.send({result : true});
            res.body = {result : true};
            next();
            return;
        }
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.post("/notification",innerAuth, async (req, res, next) =>{
    try {
        await validateNotificationPost(req.body);
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
        const result = await saveNotification(req.body);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        
        res.send(result.response);
        res.body = result.response;
        next();
        return;
        
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.put("/sellerProduct",innerAuth, async (req, res, next) =>{
    try {
        const result = await addProductToList(req.query);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
        next();
        return;
        
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.put("/comment",innerAuth, async (req, res, next) =>{
    try {
        const result = await addcommentToList(req.query);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
        next();
        return;
        
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.put("/shopingCart",innerAuth, async (req, res, next) =>{
    try {
        const result = await addOrderToCart(req.query);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
        next();
        return;
        
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.put("/orderHistory",innerAuth, async (req, res, next) =>{
    try {
        const result = await addOrderHistoryToList(req.query);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
        next();
        return;
        
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.patch("/shopingCartDelete",innerAuth, async (req, res, next) =>{
    try {
        const result = await removeOrderFromCart(req.query);
        
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
        next();
        return;
        
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});


export default router