import express from "express"
import { auth } from "../authorization/auth.js";
import { addNotification, getUsers } from "../DB/CRUD/user.js";
import validateId from "../functions/validateId.js";
import { validateNotificationPost } from "../DB/models/notification.js";
import { saveNotification } from "../DB/CRUD/notification.js";
import { validateChangeMoney } from "../DB/models/wallet.js";
import { changeWalletMoney, getWallets } from "../DB/CRUD/wallet.js";
import { getSellers, sellerAddNotification } from "../DB/CRUD/seller.js";
import { getAdmins } from "../DB/CRUD/admin.js";
import { getGiftCards } from "../DB/CRUD/giftCard.js";
import { getTransactions } from "../DB/CRUD/transaction.js";
import { getEmployees } from "../DB/CRUD/employee.js";
import { UserModel } from "../DB/models/user.js";
import { innerAuth } from "../authorization/innerAuth.js";


const router = express.Router();
//checked
router.get("/allUsers", (req, res,next) => auth(req, res,next, ["admin", "employee"]) ,async (req, res,next) =>{
    try {
        const result = await getUsers(undefined,req.query);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }

        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/allUsers/:id",(req, res,next) => auth(req, res,next, ["admin", "employee"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
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
        delete result.response.password;
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/allSellers", (req, res,next) => auth(req, res,next, ["admin", "employee"]) ,async (req, res,next) =>{
    try {
        const result = await getSellers(undefined,req.query);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/allSellers/:id",(req, res,next) => auth(req, res,next, ["admin", "employee"]) , async (req, res, next) =>{
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
        delete result.response.password;
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
//checked

router.get("/allAdmins", (req, res,next) => auth(req, res,next, ["admin"]) ,async (req, res,next) =>{
    try {
        const result = await getAdmins(undefined,req.query);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/allAdmins/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
    try {
        const result = await getAdmins(req.params.id);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        delete result.response.password;
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/allGiftCards", (req, res,next) => auth(req, res,next, ["admin"]) ,async (req, res,next) =>{
    try {
        const result = await getGiftCards(undefined,req.query);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/allGiftCards/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
    try {
        const result = await getGiftCards(req.params.id);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});


router.get("/allTransactions", (req, res,next) => auth(req, res,next, ["admin"]) ,async (req, res,next) =>{
    try {
        const result = await getTransactions(undefined,req.query);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/allTransactions/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
    try {
        const result = await getTransactions(req.params.id);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/allEmployees", (req, res,next) => auth(req, res,next, ["admin"]) ,async (req, res,next) =>{
    try {
        const result = await getEmployees(undefined,req.query);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/allEmployees/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
    try {
        const result = await getEmployees(req.params.id);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        delete result.response.password;
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

// checked 

router.post("/notification",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    try {
        await validateNotificationPost(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.details[0].message};
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
        if(req.body.userID && result.response._id){
            const user = await addNotification(req.body.userID,result.response._id)
            if (user.error){
                res.status(400).send({error : user.error});
                res.body = {error : user.error};
                next();
                return;
            }
        }else if (result.response._id){
            const seller = await sellerAddNotification(req.body.sellerID,result.response._id)
            if (seller.error){
                res.status(400).send({error : seller.error});
                res.body = {error : seller.error};
                next();
                return;
            }
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.post("/changeWalletMoney",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    try {
        await validateChangeMoney(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.details[0].message};
        }
        next();
        return;
    }
    try {
        let user;
        if (req.body.userType == "user"){
            user = await getUsers(req.body.userID);
        }else{
            user = await getSellers(req.body.userID);
        }
        if(!user.response){
            res.status(400).send("no user found with this ID");
            res.body = "no user found with this ID";
            next();
            return;
        }
        const result = await changeWalletMoney(user.response.walletID,req.body.amount);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/getUserWallet/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
    try {
        const user = await getUsers(req.body.userID);
        if(!user.response){
            res.status(400).send("no user found with this ID");
            res.body = "no user found with this ID";
            next();
            return;
        }
        const result = await getWallets(user.response.walletID);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});


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
router.get("/getSellerWallet/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
    try {
        const seller = await getSellers(req.body.sellerID);
        if(!seller.response){
            res.status(400).send("no seller found with this ID");
            res.body = "no seller found with this ID";
            next();
            return;
        }
        const result = await getWallets(seller.response.walletID);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.body = result.response;
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});


router.get('/logOut',async (req,res,next) =>{
    try {
        res.cookie('x-auth-token',' ',{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(0)
        });
        res.send({message: "successfully logged out"})
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
})

export default router;