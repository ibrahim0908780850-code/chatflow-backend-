import express from "express";

import {
  generateAIResponse
} from "../services/ai.service.js";

import {
  sendWhatsAppMessage
} from "../services/whatsapp.service.js";

import {
  getOrCreateContact,
  saveMessage,
  getConversation
} from "../services/supabase.service.js";


const router = express.Router();


const VERIFY_TOKEN =
  process.env.WHATSAPP_VERIFY_TOKEN;



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

    return res
      .status(200)
      .send(challenge);

  }


  return res.sendStatus(403);

});



router.post("/", async (req, res) => {

  // Respond to Meta immediately
  res.sendStatus(200);


  try {

    const message =
      req.body
        ?.entry?.[0]
        ?.changes?.[0]
        ?.value
        ?.messages?.[0];


    if (!message) {
      return;
    }


    if (message.type !== "text") {
      return;
    }


    const phone =
      message.from;

    const text =
      message.text?.body?.trim();


    if (!phone || !text) {
      return;
    }


    console.log(
      "Incoming:",
      phone,
      text
    );


    // Get/create customer

    const contact =
      await getOrCreateContact(
        phone
      );


    // Save customer message

    await saveMessage(
      contact.id,
      "inbound",
      text
    );


    // Get conversation history

    const history =
      await getConversation(
        contact.id,
        10
      );


    // Generate AI response

    const reply =
      await generateAIResponse(
        text,
        history
      );


    console.log(
      "AI:",
      reply
    );


    // Send WhatsApp reply

    await sendWhatsAppMessage(
      phone,
      reply
    );


    // Save AI response

    await saveMessage(
      contact.id,
      "outbound",
      reply
    );


    console.log(
      "Reply sent successfully"
    );


  } catch (error) {

    console.error(
      "Webhook error:",
      error.response?.data ||
      error.message ||
      error
    );

  }

});


export default router;