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

// ========================================
// Meta Webhook Verification
// ========================================

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

console.log(
  "WhatsApp webhook verified"
);

return res
  .status(200)
  .send(challenge);

}

return res.sendStatus(403);
});

// ========================================
// WhatsApp Incoming Messages
// ========================================

router.post("/", async (req, res) => {

// Respond to Meta immediately
res.sendStatus(200);

try {

const entry =
  req.body?.entry?.[0];

const change =
  entry?.changes?.[0];

const value =
  change?.value;


// Ignore events without messages

if (!value?.messages) {
  return;
}


const message =
  value.messages[0];


// Currently support text messages only

if (
  !message ||
  message.type !== "text"
) {
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
  "📩 WhatsApp:",
  phone,
  text
);


// ========================================
// 1. Find or create contact
// ========================================

const contact =
  await getOrCreateContact(
    phone
  );


// ========================================
// 2. Save incoming message
// ========================================

await saveMessage(
  contact.id,
  "inbound",
  text
);


// ========================================
// 3. Get conversation history
// ========================================

const history =
  await getConversation(
    contact.id,
    10
  );


// ========================================
// 4. Generate AI response
// ========================================

const reply =
  await generateAIResponse(
    text,
    history
  );


console.log(
  "🤖 AI:",
  reply
);


// ========================================
// 5. Send WhatsApp response
// ========================================

await sendWhatsAppMessage(
  phone,
  reply
);


// ========================================
// 6. Save AI response
// ========================================

await saveMessage(
  contact.id,
  "outbound",
  reply
);


console.log(
  "✅ Reply sent successfully"
);

} catch (error) {

console.error(
  "❌ WhatsApp webhook error:",
  error.response?.data ||
  error.message ||
  error
);

}

});

export default router;