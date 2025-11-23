const openai = require("../../config/openaiClient");

async function runAiCropPlanner(prompt) {
  const response = await openai.responses.create({
    model: "gpt-5",
    tools: [
      {
        type: "web_search",
      },
    ],
    input: prompt,
  });
  return response.output_text;
}

module.exports = runAiCropPlanner;
