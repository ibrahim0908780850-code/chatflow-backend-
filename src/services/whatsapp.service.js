import axios from "axios";


export async function sendWhatsAppMessage(
    phone,
    message
){


const url =
`https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;


await axios.post(
url,
{
    messaging_product:"whatsapp",

    to:phone,

    type:"text",

    text:{
        body:message
    }

},
{
headers:{
    Authorization:
    `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,

    "Content-Type":
    "application/json"
}

});


}