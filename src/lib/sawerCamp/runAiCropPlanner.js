const openai = require("../../config/openaiClient");

async function runAiCropPlanner(prompt) {
  const response = await openai.responses.create({
    model: "gpt-5",
    reasoning: { effort: "low" },
    input: prompt,
    // tools: [
    //   {
    //     type: "web_search",
    //   },
    // ],
  });
  return response.output_text;
}

module.exports = runAiCropPlanner;
