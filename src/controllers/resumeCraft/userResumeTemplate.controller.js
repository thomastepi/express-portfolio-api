const UserResumeTemplate = require("../../models/resumeCraft/userResumeTemplate.model");
const { UserModel } = require("../../models/resumeCraft/resumeUser.model");
const { runResponses } = require("../../lib/resumeCraft/runResponses");
const {
  generateResumeTemplatePrompt,
} = require("../../utils/resumeCraft/prompts");

const MAX_TEMPLATES_PER_USER = 3;

// create new template
async function createUserResumeTemplate(req, res) {
  try {
    const { generatedHTML, templateName } = req.body;
    const user = req.user;

    const currentUser = await UserModel.findById(user.id);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const count = await UserResumeTemplate.countDocuments({ userId: user.id });
    if (count >= MAX_TEMPLATES_PER_USER) {
      return res.status(400).json({
        error: `You can only save up to ${MAX_TEMPLATES_PER_USER} templates. Please delete one before saving a new template.`,
      });
    }

    const prompt = generateResumeTemplatePrompt(generatedHTML, currentUser);

    const templateHtml = await runResponses(prompt);

    const template = await UserResumeTemplate.create({
      userId: user.id,
      name: templateName || "My AI Template",
      html: templateHtml,
      createdAt: new Date(),
    });

    res.status(201).json(template);
  } catch (err) {
    console.log("Error creating template: ", err);
    res.status(500).json({ error: "Failed to save template" });
  }
}

// get all existing templates for a user
async function getAllUserResumeTemplates(req, res) {
  try {
    const user = req.user;
    const templates = await UserResumeTemplate.find({ userId: user.id });
    res.status(200).json(templates);
  } catch (err) {
    console.log("Error fetching templates: ", err);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
}

// delete template by ID
async function deleteTemplate(req, res) {
  try {
    const { id } = req.params;
    const template = await UserResumeTemplate.findByIdAndDelete(id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.status(200).json({ message: "Template deleted successfully" });
  } catch (err) {
    console.log("Error deleting template: ", err);
    res.status(500).json({ error: "Failed to delete template" });
  }
}

module.exports = {
  createUserResumeTemplate,
  getAllUserResumeTemplates,
  deleteTemplate,
};
