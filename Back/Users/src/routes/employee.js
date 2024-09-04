import { changeEmployeePassword, saveEmployee, updateEmployee } from "../DB/CRUD/employee";
import { validateEmployeeChangeinfo, validateEmployeePost } from "../DB/models/employee";
import { validateChangePassword } from "../DB/models/user";
import express from "express";
import jwt from "jsonwebtoken";


const router = express.Router();


router.patch("/changePassword",(req, res,next) => auth(req, res,next, ["employee"]) ,  async (req, res, next) =>{
    const {error} = validateChangePassword(req.body); 
    console.log("login")
    if (error){
        // console.log({error : error.details[0].message})
        res.status(400).send({error : error.details[0].message});
        res.body = {error : error.details[0].message};
        next();
        return;
    }
    try {

        const result = await changeEmployeePassword(req.employee._id,req.body.newPassword,req.body.oldPassword);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.post("/signUp",(req, res,next) => auth(req, res,next, ["admin"]),  async (req, res, next) =>{
    try {
        await validateEmployeePost(req.body); 
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
        const result = await saveEmployee(req.body);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        const token = jwt.sign({_id : result.response._id , status: "employee"},process.env.JWTSECRET,{expiresIn : '6h'});
        delete result.response.password;
        res.cookie('x-auth-token',token,{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 6 * 60 * 60 * 1000
        });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});

router.patch("/changeMyinfo",(req, res,next) => auth(req, res,next, ["employee"]) ,  async (req, res, next) =>{
    try {
        await validateEmployeeChangeinfo(req.body); 
    } catch (error) {
        console.log(error)
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
        const result = await updateEmployee(req.employee._id,req.body);
        if (result.error){
            res.status(400).send({error : result.error});
            res.body = {error : result.error};
            next();
            return;
        }
        const token = jwt.sign({_id : result.response._id , status: "employee"},process.env.JWTSECRET,{expiresIn : '6h'});
        res.cookie('x-auth-token',token,{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 6 * 60 * 60 * 1000
        });
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = {error:"internal server error"};
        res.status(500).send({error:"internal server error"});
    }
    next();
});