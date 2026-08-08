import axios from "axios";


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


  const conversation =
    history
      .map(item => {

        const role =
          item.direction === "inbound"
            ? "العميل"
            : "ChatFlow AI";

        return `${role}: ${item.content}`;

      })
      .join("\n");


  const prompt = `
أنت ChatFlow AI، مساعد ذكي للمحادثات التجارية عبر واتساب.

قواعدك:
- تحدث باللغة العربية بشكل طبيعي.
- كن مختصرًا وودودًا.
- ساعد العميل بشكل عملي.
- لا تخترع معلومات.
- إذا لم تعرف الإجابة، أخبر العميل أنك تحتاج إلى معلومات إضافية.

سجل المحادثة:
${conversation}

الرسالة الجديدة:
العميل: ${message}

اكتب الرد المناسب للعميل.
`;


  const response =
    await axios.post(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,

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
        ]
      },

      {
        headers: {
          "Content-Type":
            "application/json"
        }
      }

    );


  return (
    response.data
      ?.candidates?.[0]
      ?.content?.parts?.[0]
      ?.text
      ?.trim()
    ||
    "عذرًا، لم أتمكن من معالجة رسالتك."
  );
}