import express from "express";
import jwt from "jsonwebtoken";
import { innerAuth } from "../authorization/innerAuth.js";
import { getSellers } from "../DB/CRUD/seller.js";


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