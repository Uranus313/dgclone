import jwt from "jsonwebtoken";
import { getUsers } from "../DB/CRUD/user.js";
import { getSellers } from "../DB/CRUD/seller.js";
import { getAdmins } from "../DB/CRUD/admin.js";
import { getEmployees } from "../DB/CRUD/transporter.js";
import { RoleModel } from "../DB/models/role.js";
import { getRoles } from "../DB/CRUD/role.js";

export async function auth(req, res, next, acceptedLevels) {
  const token = req.cookies["x-auth-token"];
  if (!token) {
    res.status(401).send({ error: "access denied. no token provided." });
    res.body = { error: "access denied. no token provided." };

    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    if (decoded.status != "admin") {
      
      let checker = false;
      for (let index = 0; index < acceptedLevels.length; index++) {
        if (decoded.status == acceptedLevels[index]) {
          checker = true;
        }
      }
      if (!checker) {
        res.status(401).send({
          error: "access denied. invalid " + acceptedStatuses.join(", "),
        });
        res.body = {
          error: "access denied. invalid " + acceptedStatuses.join(", "),
        };

        return;
      }
    }

    switch (decoded.status) {
      case "admin":
        const admin = (await getAdmins(decoded._id)).response;
        if (!admin) {
          res.status(401).send({ error: "access denied. invalid admin." });
          res.body = { error: "access denied. invalid admin." };

          return;
        }
        req.user = admin;
        next();

        break;
      case "employee":
        const employee = (await getEmployees(decoded._id)).response;
        if (!employee || !employee.roleID) {
          res
            .status(401)
            .send({ error: "access denied. invalid employee." });
          res.body = { error: "access denied. invalid employee." };

          return;
        }
        if (employee.isBanned) {
          res.status(403).send({ error: "access denied. you are banned." });
          res.body = { error: "access denied. you are banned." };

          return;
        }
        let checker = false;
        let role = await getRoles(employee.roleID);
        if(!role.response){
            res.status(401).send({
                error: "access denied. you dont have this access"
              });
              res.body = {
                error: "access denied. you dont have this access"
              };
      
              return;
        }
        let accessLevels = role.accessLevels;
      for (let index = 0; index < accessLevels.length; index++) {
        for (let index2 = 0; index2 < acceptedLevels.length; index2++) {
            if (accessLevels[index].level == acceptedLevels[index2].name) {
                if( !(acceptedLevels[index2].writeAccess && !accessLevels[index].writeAccess)){
                    checker = true;
                }
            }
        }
        
      }
      if (!checker) {
        res.status(401).send({
          error: "access denied. you dont have this access"
        });
        res.body = {
          error: "access denied. you dont have this access"
        };

        return;
      }
        req.user = employee;
        next();
        break;
      default:
        res.status(401).send({
            error: "access denied. invalid employee",
          });
          res.body = {
            error: "access denied. invalid employee",
          };

        return;
        break;
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "invalid token" });
    res.body = { error: "invalid token" };
  }
}
