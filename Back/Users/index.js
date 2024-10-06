import express from "express";
import DBConnection from "./src/DB/DBConnection.js";
import cors from "cors";
import generalRouter from "./src/routes/general.js"
import userRouter from "./src/routes/user.js"
import adminRouter from "./src/routes/admin.js"
import employeeRouter from "./src/routes/employee.js"
import sellerRouter from "./src/routes/seller.js"
import express_status_monitor from "express-status-monitor"
import innerRouter from "./src/routes/inner.js"
import cookieParser from 'cookie-parser'
import { validateAdminPost } from "./src/DB/models/admin.js";
import { sendMail } from "./src/functions/sendMail.js";
import { sendSMS } from "./src/functions/sendSMS.js";
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
const allowedOrigins = ["http://localhost:8080","http://localhost:3000","http://localhost:5173","http://myapp.local"];
// app.use(cors({
//     origin: (origin, callback) =>{
//         console.log(origin)
//         if(!origin || allowedOrigins.indexOf(origin) !== -1){
//             console.log("allowed")
//             callback(null, true);
//         }else{
//             callback(new Error('origin not allowed'));
//         }
//     }, 
//     credentials: true,
//     methods: true,
//     headers: true,
// }));
app.use(cors({
    origin: true, // Allow all origins
    credentials: true // Allow credentials
}));
app.use(express_status_monitor())
process.env.JWTSECRET = 'mysecret'
console.log(process.env.JWTSECRET)
if(!process.env.NODE_ENV){  process.env.NODE_ENV= "development"}
console.log(process.env.NODE_ENV)
app.use(express.json());
app.use(cookieParser());
app.use("/users/user", userRouter);
app.use("/users/admin", adminRouter);
app.use("/users/general", generalRouter);
app.use("/users/employee", employeeRouter);
app.use("/users/seller", sellerRouter);
app.use("/users/inner", innerRouter);


app.get("/", (req, res, next) => {
    res.send("hello world");
});
app.listen(port, async () => {
    console.log("server is running on port " + port);
});