import express from "express"
import { auth } from "../authorization/auth.js";
import { addNotification, getUserCount, getUsers } from "../DB/CRUD/user.js";
import validateId from "../functions/validateId.js";
import { validateNotificationPost } from "../DB/models/notification.js";
import { saveNotification } from "../DB/CRUD/notification.js";
import { validateChangeMoney } from "../DB/models/wallet.js";
import { changeWalletMoney, getWallets } from "../DB/CRUD/wallet.js";
import { getSellerCount, getSellers, sellerAddNotification } from "../DB/CRUD/seller.js";
import { getAdmins } from "../DB/CRUD/admin.js";
import { getGiftCards } from "../DB/CRUD/giftCard.js";
import { getTransactionCount, getTransactions } from "../DB/CRUD/transaction.js";
import { getEmployeeCount, getEmployees, getEmployeesWithRoles } from "../DB/CRUD/employee.js";
import { UserModel } from "../DB/models/user.js";
import { innerAuth } from "../authorization/innerAuth.js";
import { getVerifyRequests } from "../DB/CRUD/verifyRequest.js";
import { levels } from "../authorization/accessLevels.js";
import { roleAuth } from "../authorization/roleAuth.js";
import { getWareHouses } from "../DB/CRUD/wareHouse.js";

const router = express.Router();
//checked
router.get("/allUsers", (req,res,next) => roleAuth(req,res,next,[{level : levels.userManage}]) ,async (req, res,next) =>{
    try {
        let searchParams = {...req.query};
        delete searchParams.floor;
        delete searchParams.limit;
        delete searchParams.nameSearch;
        // console.log(req.query.limit)
        const result = await getUsers(undefined,searchParams,req.query.limit,req.query.floor, req.query.nameSearch);
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

router.get("/allUsers/:id",(req,res,next) => roleAuth(req,res,next,[{level : levels.userManage}]) , async (req, res, next) =>{
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

router.get("/verifyRequests", (req,res,next) => roleAuth(req,res,next,[{level : levels.sellerManage , writeAccess : true}]) ,async (req, res,next) =>{
    try {
        let searchParams = {...req.query};
        delete searchParams.floor;
        delete searchParams.limit;
        // console.log(req.query.limit)
        const result = await getVerifyRequests(undefined,searchParams,undefined,req.query.limit,req.query.floor);
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

router.get("/verifyRequests/:id",(req,res,next) => roleAuth(req,res,next,[{level : levels.sellerManage }]), async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
        res.body = {error : error.details[0].message};
        next();
        return;
    } 
    try {
        const result = await getVerifyRequests(req.params.id);
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
router.get("/allSellers", (req,res,next) => roleAuth(req,res,next,[{level : levels.sellerManage}]) ,async (req, res,next) =>{
    try {
        let searchParams = {...req.query};
        delete searchParams.floor;
        delete searchParams.limit;
        delete searchParams.nameSearch;
        // console.log(req.query.limit)
        const result = await getSellers(undefined,searchParams,undefined,req.query.limit,req.query.floor, req.query.nameSearch);
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

router.get("/allSellers/:id",(req,res,next) => roleAuth(req,res,next,[{level : levels.sellerManage}]), async (req, res, next) =>{
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
        let searchParams = {...req.query};
        delete searchParams.floor;
        delete searchParams.limit;
        delete searchParams.nameSearch;
        // console.log(req.query.limit)
        const result = await getAdmins(undefined,searchParams,req.query.limit,req.query.floor, req.query.nameSearch);
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

router.get("/allGiftCards", (req,res,next) => roleAuth(req,res,next,[{level : levels.productManage }]) ,async (req, res,next) =>{
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

router.get("/allGiftCards/:id",(req,res,next) => roleAuth(req,res,next,[{level : levels.productManage }]), async (req, res, next) =>{
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


router.get("/allTransactions", (req,res,next) => roleAuth(req,res,next,[{level : levels.transactionManage }]),async (req, res,next) =>{
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

router.get("/allTransactions/:id",(req,res,next) => roleAuth(req,res,next,[{level : levels.transactionManage}]) , async (req, res, next) =>{
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
        let searchParams = {...req.query};
        delete searchParams.floor;
        delete searchParams.limit;
        delete searchParams.nameSearch;
        // console.log(req.query.limit)
        const result = await getEmployeesWithRoles(undefined,searchParams,req.query.limit,req.query.floor, req.query.nameSearch);
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
        const result = await getEmployeesWithRoles(req.params.id);
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

router.get("/allWareHouses", (req,res,next) => roleAuth(req,res,next,[{level : levels.wareHouseManage}]) ,async (req, res,next) =>{
    try {
        let searchParams = {...req.query};
        // console.log(req.query.limit)
        const result = await getWareHouses(undefined,searchParams);
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

router.get("/allWareHouses/:id", (req,res,next) => roleAuth(req,res,next,[{level : levels.wareHouseManage}]) , async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
    try {
        const result = await getWareHouses(req.params.id);
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

router.get("/allCount", (req, res,next) => auth(req, res,next, ["admin"]) ,async (req, res,next) =>{
    try {

        // console.log(req.query.limit)
        const employee = await getEmployeeCount();
        if (employee.error){
            res.status(400).send({error : employee.error});
            res.body = {error : employee.error};
            next();
            return;
        }
        const user = await getUserCount();
        if (user.error){
            res.status(400).send({error : user.error});
            res.body = {error : user.error};
            next();
            return;
        }
        const seller = await getSellerCount();
        if (seller.error){
            res.status(400).send({error : seller.error});
            res.body = {error : seller.error};
            next();
            return;
        }
        const transaction = await getTransactionCount();
        if (transaction.error){
            res.status(400).send({error : transaction.error});
            res.body = {error : transaction.error};
            next();
            return;
        }
        let answer = {
            userCount : user.response,
            employeeCount : employee.response,
            sellerCount : seller.response,
            transactionCount : transaction.response
        };
        res.body = answer;
        res.send(answer);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/employeeCount", (req, res,next) => auth(req, res,next, ["admin"]) ,async (req, res,next) =>{
    try {

        // console.log(req.query.limit)
        const result = await getEmployeeCount();
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        let answer = {count : result.response};
        res.body = answer;
        res.send(answer);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/userCount", (req,res,next) => roleAuth(req,res,next,[{level : levels.userManage}]) ,async (req, res,next) =>{
    try {

        // console.log(req.query.limit)
        const result = await getUserCount();
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        let answer = {count : result.response};
        res.body = answer;
        res.send(answer);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.get("/sellerCount", (req,res,next) => roleAuth(req,res,next,[{level : levels.sellerManage}]) ,async (req, res,next) =>{
    try {

        // console.log(req.query.limit)
        const result = await getSellerCount();
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        let answer = {count : result.response};
        res.body = answer;
        res.send(answer);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.get("/transactionCount", (req,res,next) => roleAuth(req,res,next,[{level : levels.transactionManage}]) ,async (req, res,next) =>{
    try {

        // console.log(req.query.limit)
        const result = await getTransactionCount();
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        let answer = {count : result.response};
        res.body = answer;
        res.send(answer);
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.post("/notification",(req,res,next) => roleAuth(req,res,next,[{level : levels.notificationManage}]) , async (req, res, next) =>{
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

router.post("/changeWalletMoney",(req,res,next) => roleAuth(req,res,next,[{level : levels.sellerManage , writeAccess : true}, {level : levels.userManage , writeAccess : true}]) , async (req, res, next) =>{
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

// router.get("/getUserWallet/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
//     const {error} = validateId(req.params.id);
//     if (error){
//         res.status(400).send({error : error.details[0].message});
//             res.body = {error : error.details[0].message};
//         next();
//         return;
//     } 
//     try {
//         const user = await getUsers(req.body.userID);
//         if(!user.response){
//             res.status(400).send("no user found with this ID");
//             res.body = "no user found with this ID";
//             next();
//             return;
//         }
//         const result = await getWallets(user.response.walletID);
//         if (result.error){
//             res.status(400).send({error : result.error});
//             res.body = {error : result.error};
//             next();
//             return;
//         }
//         res.body = result.response;
//         res.send(result.response);
//     } catch (err) {
//         console.log("Error",err);
//         res.body = {error:"internal server error"};
//         res.status(500).send({error:"internal server error"});
//     }
//     next();
// });

router.get("/checkToken",(req, res,next) => auth(req, res,next, ["user","seller","employee","admin"]), async (req,res , next) =>{
    try {
        if(req.user){
            delete req.user.password;
            res.send(req.user);
            res.body = req.user;
            next();
            return;
        }
        if(req.seller){
            delete req.seller.password;
            res.send(req.seller);
            res.body = req.seller;
            next();
            return;
        }
        if(req.employee){
            delete req.employee.password;
            res.send(req.employee);
            res.body = req.employee;
            next();
            return;
        }
        if(req.admin){
            delete req.admin.password;
            res.send(req.admin);
            res.body = req.admin;
            next();
            return;
        }
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
        next();
        return;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
})

// router.get("/getSellerWallet/:id",(req, res,next) => auth(req, res,next, ["admin"]) , async (req, res, next) =>{
//     const {error} = validateId(req.params.id);
//     if (error){
//         res.status(400).send({error : error.details[0].message});
//             res.body = {error : error.details[0].message};
//         next();
//         return;
//     } 
//     try {
//         const seller = await getSellers(req.body.sellerID);
//         if(!seller.response){
//             res.status(400).send("no seller found with this ID");
//             res.body = "no seller found with this ID";
//             next();
//             return;
//         }
//         const result = await getWallets(seller.response.walletID);
//         if (result.error){
//             res.status(400).send({error : result.error});
//             res.body = {error : result.error};
//             next();
//             return;
//         }
//         res.body = result.response;
//         res.send(result.response);
//     } catch (err) {
//         console.log("Error",err);
//         res.body = {error:"internal server error"};
//         res.status(500).send({error:"internal server error"});
//     }
//     next();
// });


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