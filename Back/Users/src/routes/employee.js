import { accessLevels } from "../authorization/accessLevels.js";
import { changeEmployeePassword, saveEmployee, updateEmployee } from "../DB/CRUD/employee.js";
import { validateEmployeeChangeinfo, validateEmployeePost } from "../DB/models/employee.js";
import { validateChangePassword } from "../DB/models/user.js";
import express from "express";
import jwt from "jsonwebtoken";
import { roleAuth } from "../authorization/roleAuth.js";
import { deleteRole, getRoles, saveRole } from "../DB/CRUD/role.js";
import { validateRolePost } from "../DB/models/role.js";
import { auth } from "../authorization/auth.js";
import validateId from "../functions/validateId.js";
import { levels } from "../authorization/accessLevels.js";
import { roleAuth } from "../authorization/roleAuth.js";
import { validateWareHousePost } from "../DB/models/wareHouse.js";
import { deleteWareHouse, saveWareHouse } from "../DB/CRUD/wareHouse.js";
const router = express.Router();


router.patch("/changePassword", (req, res, next) => auth(req, res, next, ["employee"]), async (req, res, next) => {
    const { error } = validateChangePassword(req.body);
    console.log("login")
    if (error) {
        // console.log({error : error.details[0].message})
        res.status(400).send({ error: error.details[0].message });
        res.body = { error: error.details[0].message };
        next();
        return;
    }
    try {

        const result = await changeEmployeePassword(req.employee._id, req.body.newPassword, req.body.oldPassword);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

router.post("/signUp", (req, res, next) => auth(req, res, next, ["admin"]), async (req, res, next) => {
    try {
        await validateEmployeePost(req.body);
    } catch (error) {
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
        const result = await saveEmployee(req.body);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        // const token = jwt.sign({ _id: result.response._id, status: "employee" }, process.env.JWTSECRET, { expiresIn: '6h' });
        // delete result.response.password;
        // res.cookie('x-auth-token', token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none',
        //     maxAge: 6 * 60 * 60 * 1000
        // });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

router.patch("/changeMyinfo", (req, res, next) => auth(req, res, next, ["employee"]), async (req, res, next) => {
    try {
        await validateEmployeeChangeinfo(req.body);
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
        const result = await updateEmployee(req.employee._id, req.body);
        if (result.error) {
            res.status(400).send({ error: result.error });
            res.body = { error: result.error };
            next();
            return;
        }
        const token = jwt.sign({ _id: result.response._id, status: "employee" }, process.env.JWTSECRET, { expiresIn: '6h' });
        res.cookie('x-auth-token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 6 * 60 * 60 * 1000
        });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error", err);
        res.body = { error: "internal server error" };
        res.status(500).send({ error: "internal server error" });
    }
    next();
});

router.get("/accessLevels", (req, res, next) => auth(req, res, next, ["admin","employee"]), async (req, res, next) => {
    res.send(accessLevels);
    res.body = accessLevels;
});
router.get("/roles", (req, res, next) => auth(req, res, next, ["admin"]), async (req, res, next) => {
    try {
        // console.log(req.query.limit)
        const result = await getRoles();
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

router.get("/roles/:id", (req, res, next) => auth(req, res, next, ["admin"]), async (req, res, next) => {
    try {
        // console.log(req.query.limit)
        const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
        const result = await getRoles(req.params.id);
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

router.delete("/roles/:id", (req, res, next) => auth(req, res, next, ["admin"]), async (req, res, next) => {
    try {
        // console.log(req.query.limit)
        const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
        const result = await deleteRole(req.params.id);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        if(!result.response){
            res.body = {error:"role not found"};
        res.status(404).send({error:"role not found"});
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
router.post("/roles",(req,res,next) => auth(req,res,next,["admin"]),  async (req, res, next) =>{
    try {
        await validateRolePost(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        const result = await saveRole(req.body);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        // const token = jwt.sign({_id : result.response._id , status: "admin"},process.env.JWTSECRET,{expiresIn : '6h'});
        // delete result.response.password;
        // res.cookie('x-auth-token',token,{
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none',
        //     maxAge: 6 * 60 * 60 * 1000
        // });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});
router.post("/wareHouses",(req,res,next) => roleAuth(req,res,next,[{level : levels.wareHouseManage , writeAccess : true}]),  async (req, res, next) =>{
    try {
        await validateWareHousePost(req.body); 
    } catch (error) {
        if (error.details){
            res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        }else{
            res.status(400).send({error : error.message});
            res.body = {error : error.message};
        }
        next();
        return;
    }
    try {
        const result = await saveWareHouse(req.body);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        // const token = jwt.sign({_id : result.response._id , status: "admin"},process.env.JWTSECRET,{expiresIn : '6h'});
        // delete result.response.password;
        // res.cookie('x-auth-token',token,{
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none',
        //     maxAge: 6 * 60 * 60 * 1000
        // });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.delete("/wareHouses/:id", (req,res,next) => roleAuth(req,res,next,[{level : levels.wareHouseManage , writeAccess : true}]), async (req, res, next) => {
    try {
        // console.log(req.query.limit)
        const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send({error : error.details[0].message});
            res.body = {error : error.details[0].message};
        next();
        return;
    } 
        const result = await deleteWareHouse(req.params.id);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        if(!result.response){
            res.body = {error:"warehouse not found"};
        res.status(404).send({error:"warehouse not found"});
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
export default router;