import axios from "axios";

const GEMINI_MODEL = "gemini-2.5-flash";

export async function generateAIResponse(
message,
history = []
) {

const apiKey =
process.env.GEMINI_API_KEY;

if (!apiKey) {
throw new Error(
"GEMINI_API_KEY is missing"
);
}

if (!message) {
return "مرحبًا 👋 كيف يمكنني مساعدتك؟";
}

const conversation =
history
.slice(-10)
.map((item) => {

    const role =
      item.direction === "inbound"
        ? "العميل"
        : "ChatFlow AI";

    return `${role}: ${item.content}`;

  })
  .join("\n");

const prompt = `
أنت ChatFlow AI، مساعد ذكي للمحادثات التجارية عبر واتساب.

مهمتك:

- مساعدة العملاء بسرعة ووضوح.
- الرد باللغة العربية.
- كن ودودًا وطبيعيًا.
- اجعل الرد مختصرًا ومناسبًا لواتساب.
- لا تخترع أسعارًا أو منتجات أو معلومات غير موجودة.
- إذا كانت المعلومات غير متوفرة، اطلب من العميل التفاصيل اللازمة.
- لا تذكر أنك نموذج ذكاء اصطناعي إلا إذا سُئلت مباشرة.
- لا تستخدم Markdown المعقد.

سجل المحادثة السابقة:
${conversation || "لا توجد محادثة سابقة."}

رسالة العميل الحالية:
${message}

اكتب أفضل رد ممكن للعميل.
`;

try {

const response =
  await axios.post(

    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,

    {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],

      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    },

    {
      headers: {
        "Content-Type":
          "application/json"
      },

      timeout: 30000
    }

  );


const reply =
  response.data
    ?.candidates?.[0]
    ?.content?.parts
    ?.map(part => part.text || "")
    .join("")
    .trim();


if (!reply) {

  console.error(
    "Gemini returned no text:",
    response.data
  );

  return "عذرًا، لم أتمكن من إعداد الرد الآن.";
}


return reply;

} catch (error) {

console.error(
  "Gemini API error:",
  error.response?.data ||
  error.message
);


return "عذرًا، حدث خطأ مؤقت. حاول مرة أخرى بعد قليل.";

}
}