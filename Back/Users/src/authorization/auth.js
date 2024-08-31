import jwt from "jsonwebtoken";
import { getUsers } from "../DB/CRUD/user.js";
import { getSellers } from "../DB/CRUD/seller.js";
import { getAdmins } from "../DB/CRUD/admin.js";
import { getTransporters } from "../DB/CRUD/transporter.js";

export async function auth(req, res, next, acceptedStatuses) {
    const token = req.cookies["x-auth-token"];
    if (!token) {
        res.status(401).send({ error: "access denied. no token provided." });
        res.body = { error: "access denied. no token provided." };

        return
    }
    try {
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        let checker = false;
        for (let index = 0; index < acceptedStatuses.length; index++) {
            if (decoded.status == acceptedStatuses[index]) {
                checker = true
            }
        }
        if (!checker) {
            res.status(401).send({ error: "access denied. invalid " + acceptedStatuses.join(', ') });
            res.body = { error: "access denied. invalid " + acceptedStatuses.join(', ') };

            return
        }

        switch (decoded.status) {
            case "user":
                const user = (await getUsers(decoded._id)).response;
                // console.log(user.addresses)
                if (!user) {
                    res.status(401).send({ error: "access denied. invalid user." });
                    res.body = { error: "access denied. invalid user." };

                    return
                }
                if (user.isBanned) {
                    res.status(403).send({ error: "access denied. you are banned." });
                    res.body = { error: "access denied. you are banned." };

                    return
                }
                req.user = user;
                break;

            case "seller":
                const seller = (await getSellers(decoded._id)).response;
                if (!seller) {
                    res.status(401).send({ error: "access denied. invalid seller." });
                    res.body = { error: "access denied. invalid seller." };

                    return
                }
                if (seller.isBanned) {
                    res.status(403).send({ error: "access denied. you are banned." });
                    res.body = { error: "access denied. you are banned." };

                    return
                }
                req.seller = seller;
                break;
            case "admin":
                const admin = (await getAdmins(decoded._id)).response;
                if (!admin) {
                    res.status(401).send({ error: "access denied. invalid admin." });
                    res.body = { error: "access denied. invalid admin." };


                    return
                }
                req.admin = admin;
                break;
            case "transporter":
                const transporter = (await getTransporters(decoded._id)).response;
                if (!transporter) {
                    res.status(401).send({ error: "access denied. invalid transporter." });
                    res.body = { error: "access denied. invalid transporter." };


                    return
                }
                req.transporter = transporter;
                break;
            default:
                break;
        }
        next();
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: "invalid token" });
        res.body = { error: "invalid token" };
    }
}
