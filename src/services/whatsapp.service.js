import axios from "axios";

const GRAPH_VERSION = "v26.0";

export async function sendWhatsAppMessage(phone, message) {
  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/` +
    `${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const response = await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: {
        body: message
      }
    },
    {
      headers: {
        Authorization:
          `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}