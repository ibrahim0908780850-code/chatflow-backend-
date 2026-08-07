import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import whatsappRouter from "./routes/whatsapp.js";


dotenv.config();


const app = express();


app.use(cors());
app.use(express.json());


app.get("/", (req,res)=>{

    res.json({
        name:"ChatFlow AI Backend",
        status:"running"
    });

});


app.use(
    "/webhooks/whatsapp",
    whatsappRouter
);


const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        `ChatFlow AI running on port ${PORT}`
    );

});