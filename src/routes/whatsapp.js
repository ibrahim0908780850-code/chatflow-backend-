import express from "express";

const router = express.Router();


const VERIFY_TOKEN =
process.env.WHATSAPP_VERIFY_TOKEN;


// Webhook verification

router.get("/",(req,res)=>{


    const mode =
    req.query["hub.mode"];

    const token =
    req.query["hub.verify_token"];

    const challenge =
    req.query["hub.challenge"];


    if(
        mode === "subscribe" &&
        token === VERIFY_TOKEN
    ){

        console.log(
            "Webhook verified"
        );

        return res
        .status(200)
        .send(challenge);

    }


    res.sendStatus(403);

});



// Receive messages

router.post("/",(req,res)=>{


    console.log(
        "Incoming WhatsApp message:"
    );


    console.log(
        JSON.stringify(
            req.body,
            null,
            2
        )
    );


    res.sendStatus(200);


});


export default router;