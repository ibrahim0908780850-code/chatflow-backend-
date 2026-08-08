import express from "express";

import {
  generateAIResponse
} from "../services/ai.service.js";

import {
  sendWhatsAppMessage
} from "../services/whatsapp.service.js";


const router = express.Router();

const VERIFY_TOKEN =
  process.env.WHATSAPP_VERIFY_TOKEN;


// Meta Webhook Verification

router.get("/", (req, res) => {

  const mode =
    req.query["hub.mode"];

  const token =
    req.query["hub.verify_token"];

  const challenge =
    req.query["hub.challenge"];


  if (
    mode === "subscribe" &&
    token === VERIFY_TOKEN
  ) {

    console.log("Webhook verified");

    return res
      .status(200)
      .send(challenge);
  }


  return res.sendStatus(403);
});


// Incoming WhatsApp messages

router.post("/", async (req, res) => {

  // Respond immediately to Meta
  res.sendStatus(200);


  try {

    const entry =
      req.body?.entry?.[0];

    const changes =
      entry?.changes?.[0];

    const value =
      changes?.value;

    const message =
      value?.messages?.[0];


    if (!message) {
      return;
    }


    // We currently support text messages
    if (message.type !== "text") {
      return;
    }


    const phone =
      message.from;

    const userMessage =
      message.text?.body;


    console.log(
      "User:",
      phone
    );

    console.log(
      "Message:",
      userMessage
    );


    // Generate AI response

    const aiResponse =
      await generateAIResponse(
        userMessage
      );


    console.log(
      "AI:",
      aiResponse
    );


    // Send response

    await sendWhatsAppMessage(
      phone,
      aiResponse
    );


    console.log(
      "Reply sent successfully"
    );


  } catch (error) {

    console.error(
      "WhatsApp webhook error:",
      error.response?.data ||
      error.message
    );

  }

});


export default router;