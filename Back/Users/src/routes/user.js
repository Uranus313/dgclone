import express from "express"
import { auth } from "../authorization/auth.js";
import validateId from "../functions/validateId.js";
import _ from "lodash";
import { validateAddress, validateAddToFavoriteList, validateAddToWishList, validateCreateWishList, validateLastVisitedPost, validateUserChangeinfo, validateUserLogIn, validateUserPost } from "../DB/models/user.js";
import { logIn, saveUser, updateUser } from "../DB/CRUD/user.js";
import { GiftCardModel, validateGiftCardPost, validateGiftCardUse } from "../DB/models/giftCard.js";
import { getGiftCards, saveGiftCard, updateGiftCard } from "../DB/CRUD/giftCard.js";
import { generateRandomString } from "../functions/randomString.js";
import { changeWalletMoney, saveWallet, updateWallet } from "../DB/CRUD/wallet.js";
import { getAllUserTransactions, saveTransaction } from "../DB/CRUD/transaction.js";
import { getNotifications } from "../DB/CRUD/notification.js";
import jwt from "jsonwebtoken";


const router = express.Router();


router.post("/signUp",  async (req, res, next) =>{
    try {
        await validateUserPost(req.body); 
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
        const result1 = await saveUser(req.body);
        if (result1.error){
            res.status(400).send(result1.error);
            res.body = result1.error;
            next();
            return;
        }
        const result2 = await saveWallet({userID : result1.response._id});
        if (result2.error){
            res.status(400).send(result2.error);
            res.body = result2.error;
            next();
            return;
        }
        const result3 = await updateUser(result1.response._id,{walletID: result2.response._id});
        if (result3.error){
            res.status(400).send(result3.error);
            res.body = result3.error;
            next();
            return;
        }
        const token = jwt.sign({...result3.response , status: "user"},process.env.JWTSECRET,{expiresIn : '6h'});
        res.header("x-auth-token",token).send(result3.response);
        res.body = result3.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});


router.patch("/changeinfo/:id",(req, res,next) => auth(req, res,next, ["user"]) ,  async (req, res, next) =>{
    try {
        await validateUserChangeinfo(req.body); 
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
    const {error : e} = validateId(req.params.id);
    if (e){
        res.status(400).send(e.details[0].message);
        res.body = e.details[0].message;
        next();
        return;
    } 
    if(req.params.id != req.user._id){
        res.status(400).send("you can not change another user's account");
        res.body = "you can not change another user's account";
        next();
        return;
    }

    try {
        const result = await updateUser(req.params.id,req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        const token = jwt.sign({...result.response , status: "user"},process.env.JWTSECRET,{expiresIn : '6h'});
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});
router.patch("/changeMyinfo",(req, res,next) => auth(req, res,next, ["user"]) ,  async (req, res, next) =>{
    console.log(req.user)
    try {
        await validateUserChangeinfo(req.body); 
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
        const result = await updateUser(req.user._id,req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        const token = jwt.sign({...result.response , status: "user"},process.env.JWTSECRET,{expiresIn : '6h'});
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/checkToken",(req, res,next) => auth(req, res,next, ["user"]), async (req,res) =>{
    try {
        res.send(req.user);
        res.body = req.user;
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
        const token = jwt.sign({...result.response , status: "user"},process.env.JWTSECRET,{expiresIn : '6h'});
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/myLists", (req, res,next) => auth(req, res,next, ["user"]) ,async (req, res,next) =>{
    try {
        const neededProducts = {};
        req.user.favoriteList.forEach(productID => {
            neededProducts[productID] = null
        });
        req.user.wishLists.forEach(list => {
            list.forEach(productID => {
             neededProducts[productID] = null
            })
        });
        
        const result = await fetch("http://products/fillList",{
            method : "POST",
            headers: {
                "Content-Type": "application/json",
                "inner-secret" : process.env.innerSecret
            },
            body: JSON.stringify(neededProducts)
        });
        const products = await result.json();
        req.user.favoriteList.forEach((productID,index) => {
            req.user.favoriteList[index] = products[productID]; 
        });
        req.user.wishLists.forEach(list => {
            list.forEach((productID,index) => {
                list[index] = products[productID]; 
            })
        });
        const response = {
            favoriteList : req.user.favoriteList,
            wishLists : req.user.wishLists
        }
        res.body = response;
        res.send(response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.post("/createWishList", (req, res,next) => auth(req, res,next, ["user"]) , async (req, res, next) =>{
    const {error} = validateCreateWishList(req.body , req.user.wishLists); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    }
    try {
        const result = await updateUser(req.user._id,{
            wishLists : [...req.user.wishLists , {title : req.body.title , products: []}]
        });
        
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

router.post("/addToWishList", (req, res,next) => auth(req, res,next, ["user"]) , async (req, res, next) =>{
    try {
        await validateAddToWishList(req.body); 
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
        const updatedWishLists = req.user.wishLists.map(list => {
            if (list.title == req.body.title){
                return {...list , products : [...list.products , req.body.productID]};
            }
            return list;
        })
        const result = await updateUser(req.user._id,{
            wishLists : updatedWishLists
        });
        
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

router.post("/addToFavoriteList", (req, res,next) => auth(req, res,next, ["user"]) , async (req, res, next) =>{
    try {
        await validateAddToFavoriteList(req.body); 
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
        const result = await updateUser(req.user._id,{
            favoriteList : [...req.user.favoriteList , req.body.productID]
        });
        
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


router.put("/addAddress", (req, res,next) => auth(req, res,next, ["user"]) , async (req, res, next) =>{
    const {error} = validateAddress(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    }
    try {
        req.user.addresses.forEach(address => {
            if (_.isEqual(address,req.nody)){
                res.status(400).send("this address is already submitted");
                res.body = "this address is already submitted";
                next();
                return;
            }
        })
        const result = await updateUser(req.user._id,{
            addresses : [...req.user.addresses ,  req.nody]
        });
        
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

router.put("/deleteAddress", (req, res,next) => auth(req, res,next, ["user"]) , async (req, res, next) =>{
    const {error} = validateAddress(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    }
    try {
        let checker = false;
        for (let index = 0; index < req.user.addresses.length; index++) {
            if (_.isEqual(req.user.addresses[index],req.nody)){
                checker = true;
                req.user.addresses.splice(index,1);
                break;
            } 
        }
        if (!checker){
            res.status(400).send("this address does not submitted");
            res.body = "this address does not submitted";
            next();
            return;
        }
        const result = await updateUser(req.user._id,{
            addresses : req.user.addresses
        });
        
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

router.get("/myGiftCards", (req, res,next) => auth(req, res,next, ["user"]) ,async (req, res,next) =>{
    try {
        const sentGiftCards = (await getGiftCards(undefined,undefined,req.sentGiftCards)).response;
        const receivedGiftCards = (await getGiftCards(undefined,undefined,req.receivedGiftCards)).response;
        const response = {
            sentGiftCards : sentGiftCards,
            receivedGiftCards : receivedGiftCards
        }
        res.body = response;
        res.send(response);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.post("/addGiftCard", async (req, res,next) =>{
    try {
        await validateGiftCardPost(req.body); 
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
        let counter = 0;
        let code;
        while(true){
            counter++;
            code = generateRandomString(16);
            const result = await getGiftCards(undefined,{code : code})
            if(result.length==0){
                break;
            }
            if(counter > 40){
                console.log("Error","couldnt generate unique random code");
                res.body = "internal server error";
                res.status(500).send("internal server error");
            }
        }
        const result = await saveGiftCard({...req.body, code: code})
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

router.post("/useGiftCard", (req, res,next) => auth(req, res,next, ["user"]), async (req, res,next) =>{
    try {
        await validateGiftCardUse(req.body); 
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
        const giftCards = (await getGiftCards(undefined,{code : code})).response;
        if(giftCards.length == 0){
            res.status(400).send("invalid code");
            res.body = "invalid code";
            next();
            return;
        }
        const giftCard = giftCards[0];
        if(giftCard.isUsed){
            res.status(400).send("this gift card is already used");
            res.body = "this gift card is already used";
            next();
            return;
        }
        const result1 = await updateGiftCard(giftCard._id,{userID : req.user._id , isUsed : true , useDate : Date.now()})
        if (result1.error){
            res.status(400).send(result1.error);
            res.body = result1.error;
            next();
            return;
        }
        const result2 = await changeWalletMoney(req.user.walletID , giftCard.amount)
        if (result2.error){
            res.status(400).send(result2.error);
            res.body = result2.error;
            next();
            return;
        }
        const result3 = await saveTransaction({
            money : giftCard.amount,
            sender: {
                method: "wallet",
                entityType : "giftCard"
            },
            receiver:{
                method: "wallet",
                entityType : "user",
                receiverID : req.user._id
            }
        })
        if (result3.error){
            res.status(400).send(result3.error);
            res.body = result3.error;
            next();
            return;
        }
        res.send(result3.response);
        res.body = result3.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/myNotifications", (req, res,next) => auth(req, res,next, ["user"]) ,async (req, res,next) =>{
    try {
        
        const result = await getNotifications(undefined,undefined,req.user.notifications)
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

router.get("/myTransactions", (req, res,next) => auth(req, res,next, ["user"]) ,async (req, res,next) =>{
    
    try {
        
        const result = await getAllUserTransactions(req.user._id)
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

router.post("/lastVisited", (req, res,next) => auth(req, res,next, ["user"]) ,async (req, res,next) =>{
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
        const foundIndex = req.user.lastVisited.indexOf(req.body.productID);
        if (foundIndex != -1){
            for (let index = foundIndex; index > 0; index--) {
                req.user.lastVisited[index] = req.user.lastVisited[index-1];
            }
            req.user.lastVisited[0] = req.body.productID;
        }else{
            req.user.lastVisited.pop();
            req.user.lastVisited.unshift(req.body.productID);
        }
        const result = await updateUser(req.user._id,{lastVisited: req.user.lastVisited})
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