const openai = require("../../config/openaiClient");

async function runResponses(prompt) {
  const response = await openai.responses.create({
    model: "gpt-5-mini",
    reasoning: { effort: "minimal" },
    input: prompt,
  });
  return response.output_text;
}

module.exports = { runResponses };
