import express from "express";
import DBConnection from "./src/DB/DBConnection.js";
import cors from "cors";
DBConnection();
const app = express();
const port = process.env.PORT || 3000;

// winston.add(new winston.transports.File({filename : "C:\\Users\\Hico\\Desktop\\smslogs\\users.log"}));
app.use(cors());
app.use(express.json());

app.get("/",(req,res,next) => {
    res.send("hello world");
});
app.listen(port, () =>{
    console.log("server is running on port "+port);
});