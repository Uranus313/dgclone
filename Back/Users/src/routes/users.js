import express from "express"
import { auth } from "../authorization/auth";
import validateId from "../functions/validateId";
import _ from "lodash";
import { validateAddress, validateAddToFavoriteList, validateAddToWishList, validateCreateWishList, validateUserChangeinfo, validateUserLogIn, validateUserPost } from "../DB/models/user";
import { logIn, saveUser, updateUser } from "../DB/CRUD/user";


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
        const result = await saveUser(req.body);
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
            favoriteList : req.user.favoriteLis,
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

export default router;