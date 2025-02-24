const  { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runCompletion(prompt) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo",
    stream: true,
  });
  return chatCompletion;
}

module.exports = runCompletion;
