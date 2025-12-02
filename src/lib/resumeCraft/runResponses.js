const openai = require("../../config/openaiClient");

async function runResponses(prompt) {
  const response = await openai.responses.create({
    model: "gpt-5-mini",
    reasoning: { effort: "minimal" },
    input: prompt,
  });
  return response.output_text;
}

async function runResumeAnalyzer(prompt, base64String, filename) {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_file",
            filename: filename,
            file_data: `data:application/pdf;base64,${base64String}`,
          },
          {
            type: "input_text",
            text: prompt,
          },
        ],
      },
    ],
  });

  return response.output_text;
}

module.exports = { runResponses, runResumeAnalyzer };
