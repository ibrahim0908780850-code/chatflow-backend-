import axios from "axios";

export async function generateAIResponse(message) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
أنت ChatFlow AI، مساعد ذكي للمحادثات التجارية عبر واتساب.

أجب باللغة العربية بشكل طبيعي ومختصر.
كن ودودًا ومفيدًا.
لا تخترع معلومات غير موجودة.

رسالة العميل:
${message}
`
            }
          ]
        }
      ]
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return (
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "عذرًا، لم أتمكن من معالجة رسالتك الآن."
  );
}