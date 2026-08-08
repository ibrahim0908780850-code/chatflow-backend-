import axios from "axios";

const GRAPH_VERSION = "v26.0";

export async function sendWhatsAppMessage(
phone,
message
) {

const phoneNumberId =
process.env.WHATSAPP_PHONE_NUMBER_ID;

const accessToken =
process.env.WHATSAPP_ACCESS_TOKEN;

if (!phoneNumberId) {
throw new Error(
"WHATSAPP_PHONE_NUMBER_ID is missing"
);
}

if (!accessToken) {
throw new Error(
"WHATSAPP_ACCESS_TOKEN is missing"
);
}

if (!phone) {
throw new Error(
"WhatsApp recipient phone is missing"
);
}

if (!message) {
throw new Error(
"WhatsApp message is empty"
);
}

const url =
"https://graph.facebook.com/${GRAPH_VERSION}/" +
"${phoneNumberId}/messages";

try {

const response =
  await axios.post(

    url,

    {
      messaging_product: "whatsapp",

      recipient_type: "individual",

      to: phone,

      type: "text",

      text: {
        preview_url: false,
        body: message
      }
    },

    {
      headers: {
        Authorization:
          `Bearer ${accessToken}`,

        "Content-Type":
          "application/json"
      }
    }

  );


console.log(
  "WhatsApp message sent:",
  response.data?.messages?.[0]?.id ||
  "success"
);


return response.data;

} catch (error) {

console.error(
  "WhatsApp API error:",
  error.response?.data ||
  error.message
);

throw error;

}
}