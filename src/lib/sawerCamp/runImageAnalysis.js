const openai = require("../../config/openaiClient");

async function runImageAnalysis(base64Image, mimeType, description) {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: description || "Analyze the following image.",
          },
          {
            type: "input_image",
            image_url: `data:${mimeType};base64,${base64Image}`,
          },
        ],
      },
    ],
  });
  return response.output;
}

module.exports = runImageAnalysis;
