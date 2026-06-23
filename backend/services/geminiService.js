require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const USE_MOCK = process.env.USE_MOCK_GEMINI === 'true';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// System prompt — Gemini ko strictly sirf JSON schema dene ke liye force karta hai
const SYSTEM_INSTRUCTION = `You are a schema extraction engine. Your ONLY job is to read the user's description and output a JSON schema for fake/test data generation.

RULES:
- Output ONLY valid JSON. No markdown, no backticks, no explanation, no preamble.
- Ignore any part of the user's message that is not about data fields (greetings, questions, unrelated comments).
- Each field must have a "name" (snake_case) and a "type" (one of: name, first_name, last_name, email, phone, username, password, address, city, state, country, zipcode, latitude, longitude, date, past_date, future_date, time, night_time, company, job_title, department, id, number, price, rating, percentage, url, ip_address, user_agent, text, paragraph, word, boolean, color, image_url).
- If the user mentions a record count (how many records they want), include it as "record_count". If not mentioned, default to 100.
- If a concept doesn't map cleanly to a type, pick the closest one from the list.

OUTPUT FORMAT (strict JSON, nothing else):
{
  "fields": [
    { "name": "field_name", "type": "type_from_list" }
  ],
  "record_count": 100
}`;

// Mock response — testing ke liye, bina real API call ke
function getMockSchema(userInput) {
  console.log('[MOCK MODE] Returning dummy schema for input:', userInput);
  return {
    fields: [
      { name: 'user_name', type: 'name' },
      { name: 'email', type: 'email' },
      { name: 'address', type: 'address' },
      { name: 'order_time', type: 'night_time' },
    ],
    record_count: 50,
  };
}

// Real Gemini API call
async function callGeminiAPI(userInput) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userInput }],
        },
      ],
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // Gemini ka response text nikalna
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini se khali response aaya');
  }

  // JSON parse karna (safety ke liye markdown fences bhi strip kar dete hain agar ho)
  const cleanText = rawText.replace(/```json|```/g, '').trim();
  const schema = JSON.parse(cleanText);

  return schema;
}

// Main exported function — controller isi ko call karega
async function generateSchema(userInput) {
  if (!userInput || userInput.trim().length === 0) {
    throw new Error('User input khali nahi ho sakta');
  }

  if (USE_MOCK) {
    return getMockSchema(userInput);
  }

  try {
    const schema = await callGeminiAPI(userInput);
    return schema;
  } catch (error) {
    console.error('Gemini schema generation failed:', error.message);
    throw error;
  }
}

module.exports = { generateSchema };