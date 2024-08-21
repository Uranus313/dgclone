import express from "express";
import DBConnection from "./src/DB/DBConnection.js";
import cors from "cors";
import generalRouter from "./src/routes/general.js"
import userRouter from "./src/routes/user.js"
import adminRouter from "./src/routes/admin.js"

import { validateAdminPost } from "./src/DB/models/admin.js";
// async function asynctest(){
//     try {
//         const result = await validateAdminPost({phoneNumber : "11"})
//     } catch (error) {
//         if (error.details){
//             console.log(error.details[0].message)
//         }else{
//             console.log(error.message)
//         }
//     }
// } 
// asynctest();
DBConnection();
const app = express();
const port = process.env.PORT || 3005;
// winston.add(new winston.transports.File({filename : "C:\\Users\\Hico\\Desktop\\smslogs\\users.log"}));
app.use(cors());
app.use(express.json());
app.use("/users/user",userRouter);
app.use("/users/admin",adminRouter);
app.use("/users/general",generalRouter);

app.get("/",(req,res,next) => {
    res.send("hello world");
});
app.listen(port, () =>{
    console.log("server is running on port "+port);
});