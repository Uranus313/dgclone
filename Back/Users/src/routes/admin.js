import { adminSignUpAuth } from "../authorization/adminSignUpAuth";
import { auth } from "../authorization/auth";
import { logIn, saveAdmin } from "../DB/CRUD/admin";
import { updateSeller } from "../DB/CRUD/seller";
import { saveBannedSeller } from "../DB/CRUD/sellerBanList";
import { updateUser } from "../DB/CRUD/user";
import { saveBannedUser } from "../DB/CRUD/userBanList";
import { validateAdminPost } from "../DB/models/admin";
import { validateSellerBan } from "../DB/models/sellerBanList";
import { validateUserBan } from "../DB/models/userBanList";

router.post("/signUp",adminSignUpAuth,  async (req, res, next) =>{
    const {error} = validateAdminPost(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    }
    try {
        const result = await saveAdmin(req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        const token = jwt.sign({...result.response , status: "admin"},process.env.JWTSECRET,{expiresIn : '6h'});
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

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
        const token = jwt.sign({...result.response , status: "admin"},process.env.JWTSECRET,{expiresIn : '6h'});
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.post("/banUser",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    const {error} = validateUserBan(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    }
    try {
        const result1 = await saveBannedUser(req.body);
        if (result1.error){
            res.status(400).send(result1.error);
            res.body = result1.error;
            next();
            return;
        }
        const result2 = await updateUser(req.body.userID , {isBanned : true})
        if (result2.error){
            res.status(400).send(result2.error);
            res.body = result2.error;
            next();
            return;
        }
        res.send(result2.response);
        res.body = result2.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});
router.post("/banSeller",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    const {error} = validateSellerBan(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    }
    try {
        const result1 = await saveBannedSeller(req.body);
        if (result1.error){
            res.status(400).send(result1.error);
            res.body = result1.error;
            next();
            return;
        }
        const result2 = await updateSeller(req.body.sellerID , {isBanned : true})
        if (result2.error){
            res.status(400).send(result2.error);
            res.body = result2.error;
            next();
            return;
        }
        res.send(result2.response);
        res.body = result2.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});
