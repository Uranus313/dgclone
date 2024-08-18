import jwt from "jsonwebtoken";
import { getUsers } from "../DB/CRUD/user.js";
import { getSellers } from "../DB/CRUD/seller.js";
import { getAdmins } from "../DB/CRUD/admin.js";
import { getTransporters } from "../DB/CRUD/transporter.js";

export async function auth(req,res,next,acceptedStatuses){
    const token = req.header("x-auth-token");
    if(!token){
        res.status(401).send("access denied. no token provided.");
        res.body = "access denied. no token provided.";
        return 
    }
    try {
        const decoded = jwt.verify(token,process.env.JWTSECRET);
        let checker = false;
        for (let index = 0; index < acceptedStatuses.length; index++) {
            if (decoded.status == acceptedStatuses[index]){
                checker = true
            }  
        }
        if (!checker){
            res.status(401).send("access denied. invalid " + acceptedStatuses.join(', '));
            res.body = "access denied. invalid " + acceptedStatuses.join(', ');
            return 
        }
        if (decoded.isBanned){
            res.status(401).send("access denied. you are banned.");
            res.body = "access denied. you are banned.";
            return 
        }
        switch (decoded.status) {
            case "user":
                const user = (await getUsers(decoded._id)).response;
                // console.log(user.addresses)
                if(!user){
                    res.status(401).send("access denied. invalid user.");
                    res.body = "access denied. invalid user.";
                    return 
                }
                req.user = user;
                break;
            
            case "seller":
                const seller = (await getSellers(decoded._id)).response;
                if(!seller){
                    res.status(401).send("access denied. invalid seller.");
                    res.body = "access denied. invalid seller.";
                    return 
                }
                req.seller = seller;
                break;  
            case "admin":
                const admin = (await getAdmins(decoded._id)).response;
                if(!admin){
                    res.status(401).send("access denied. invalid admin.");
                    res.body = "access denied. invalid admin.";
                    return 
                }
                req.admin = admin;
                break;    
            case "transporter":
                const transporter = (await getTransporters(decoded._id)).response;
                if(!transporter){
                    res.status(401).send("access denied. invalid transporter.");
                    res.body = "access denied. invalid transporter.";
                    return 
                }
                req.transporter = transporter;
                break;               
            default:
                break;
        }
        next();
    } catch (error) {
        res.status(400).send("invalid token");
        res.body = "invalid token";
    }
}
