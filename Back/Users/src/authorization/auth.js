import jwt from "jsonwebtoken";
import { getUsers } from "../DB/CRUD/user.js";
import { getSellers } from "../DB/CRUD/seller.js";
import { getAdmins } from "../DB/CRUD/admin.js";
import { getEmployees, getEmployeesWithRoles } from "../DB/CRUD/employee.js";

export async function auth(req, res, next, acceptedStatuses) {
  
  let token = req.cookies["x-auth-token"];
  const secret = req.header("inner-secret");
  if(secret == process.env.innerSecret  && secret){
    token = req.header("x-auth-token");
  }
  console.log(token)
  // console.log(process.env.innerSecret)
  // console.log(req.header("x-auth-token"))
  // console.log(secret)
  if (!token) {
    res.status(401).send({ error: "access denied. no token provided." });
    res.body = { error: "access denied. no token provided." };

    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    let checker = false;
    for (let index = 0; index < acceptedStatuses.length; index++) {
      if (decoded.status == acceptedStatuses[index]) {
        checker = true;
      }
    }
    if (!checker) {
      res
        .status(401)
        .send({
          error: "access denied. invalid " + acceptedStatuses.join(", "),
        });
      res.body = {
        error: "access denied. invalid " + acceptedStatuses.join(", "),
      };

      return;
    }

    switch (decoded.status) {
      case "user":
        const user = (await getUsers(decoded._id)).response;
        // console.log(user.addresses)
        if (!user) {
          res.status(401).send({ error: "access denied. invalid user." });
          res.body = { error: "access denied. invalid user." };

          return;
        }
        if (user.isBanned) {
          res.status(403).send({ error: "access denied. you are banned." });
          res.body = { error: "access denied. you are banned." };

          return;
        }
        req.user = user;
        if(next){
        next();
        }
        break;

      case "seller":
        const seller = (await getSellers(decoded._id)).response;
        if (!seller) {
          res.status(401).send({ error: "access denied. invalid seller." });
          res.body = { error: "access denied. invalid seller." };

          return;
        }
        if (seller.isBanned) {
          res.status(403).send({ error: "access denied. you are banned." });
          res.body = { error: "access denied. you are banned." };

          return;
        }
        req.seller = seller;
        if(next){
        next();
        }
        break;
      case "admin":
        const admin = (await getAdmins(decoded._id)).response;
        if (!admin) {
          res.status(401).send({ error: "access denied. invalid admin." });
          res.body = { error: "access denied. invalid admin." };

          return;
        }
        if (admin.isBanned) {
          res.status(403).send({ error: "access denied. you are banned." });
          res.body = { error: "access denied. you are banned." };

          return;
        }
        req.admin = admin;
        if(next){
        next();
        }
        break;
      case "employee":
        const employee = (await getEmployeesWithRoles(decoded._id)).response;
        if (!employee) {
          res.status(401).send({ error: "access denied. invalid employee." });
          res.body = { error: "access denied. invalid employee." };

          return;
        }
        if (employee.isBanned) {
          res.status(403).send({ error: "access denied. you are banned." });
          res.body = { error: "access denied. you are banned." };

          return;
        }
        req.employee = employee;
        if(next){
        next();
        }
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "invalid token" });
    res.body = { error: "invalid token" };
  }
}
