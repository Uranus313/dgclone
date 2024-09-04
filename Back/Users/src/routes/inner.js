import express from "express";
import jwt from "jsonwebtoken";
import { innerAuth } from "../authorization/innerAuth.js";
import { getSellers } from "../DB/CRUD/seller.js";
import { getUsers } from "../DB/CRUD/user.js";
import { getAdmins } from "../DB/CRUD/admin.js";
import { getEmployees } from "../DB/CRUD/employee.js";


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
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
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