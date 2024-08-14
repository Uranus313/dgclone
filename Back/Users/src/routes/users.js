import express from "express"
import { auth } from "../authorization/auth";
import validateId from "../functions/validateId";
import _ from "lodash";
import { validateAddress, validateAddToFavoriteList, validateAddToWishList, validateCreateWishList, validateUserChangeinfo, validateUserLogIn, validateUserPost } from "../DB/models/user";
import { logIn, saveUser, updateUser } from "../DB/CRUD/user";
import { GiftCardModel, validateGiftCardPost, validateGiftCardUse } from "../DB/models/giftCard";
import { getGiftCards, saveGiftCard, updateGiftCard } from "../DB/CRUD/giftCard";
import { generateRandomString } from "../functions/randomString";
import { changeWalletMoney, updateWallet } from "../DB/CRUD/wallet";
import { getAllUserTransactions, saveTransaction } from "../DB/CRUD/transaction";
import { getNotifications } from "../DB/CRUD/notification";


const router = express.Router();


router.post("/signUp",  async (req, res, next) =>{
    const {error} = validateUserPost(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    }
    try {
        let result = await saveUser(req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        result = await saveWallet({userID : result.response._id});
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        result = await updateUser({walletID: result.response._id});
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        const token = jwt.sign({...result.response , status: "user"},process.env.JWTSECRET);
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});


router.patch("/changeinfo/:id",(req, res,next) => auth(req, res,next, ["user"]) ,  async (req, res, next) =>{
    const {error} = validateUserChangeinfo(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
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
        const token = jwt.sign({...result.response , status: "user"},process.env.JWTSECRET);
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
        const token = jwt.sign({...result.response , status: "user"},process.env.JWTSECRET);
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
    const {error} = validateAddToWishList(req.body , req.user.wishLists); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
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
    const {error} = validateAddToFavoriteList(req.body , req.user.favoriteList); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
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
        const receivedGiftCards = await getGiftCards(undefined,undefined,req.receivedGiftCards).response;
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
    const {error} = validateGiftCardPost(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
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
    const {error} = validateGiftCardUse(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    }
    try {
        const giftCards = await getGiftCards(undefined,{code : code}).response;
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
                type : "giftCard"
            },
            receiver:{
                method: "wallet",
                type : "user",
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
        
        const result = await getAllUserTransactions(undefined,undefined,req.user._id)
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