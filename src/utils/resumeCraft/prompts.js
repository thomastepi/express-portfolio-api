const generateResumeTemplatePrompt = (generatedHTML, jsonUserObj) => {
  return `You will receive two inputs:

1. The original AI-generated resume HTML.
2. The full list of all possible user fields.

Your task is to transform the HTML into a reusable TEMPLATE version.

TEMPLATE REQUIREMENTS:

1. You MUST preserve the layout, structure, styling, and formatting of the provided HTML exactly as-is.
2. You MUST replace all user-specific content with placeholders.
3. You MUST include placeholders for ALL possible fields, EVEN IF they did not exist in the original HTML.
4. The placeholders must use this exact format:

Scalars:
[[fullName]]
[[firstName]]
[[lastName]]
[[email]]
[[mobileNumber]]
[[address]]
[[portfolio]]
[[summary]]

Array Sections:
[[SKILLS_SECTION]]
[[EXPERIENCE_SECTION]]
[[EDUCATION_SECTION]]
[[PROJECTS_SECTION]]
[[CERTIFICATIONS_SECTION]]
[[LANGUAGES_SECTION]]

5. For each array section, insert only a SECTION placeholder (not individual item placeholders).
   Example:
   Replace the entire Skills section (if any) with:
   [[SKILLS_SECTION]]

6. If the original HTML did not contain a section (like Projects), INSERT a new placeholder block in the correct location in the layout.
   Example:
   <h2>Projects</h2>
   [[PROJECTS_SECTION]]

7. Return ONLY the final HTML template.

INPUT HTML:
${generatedHTML}

USER FIELDS:
${jsonUserObj}

RESPONSE FORMAT:
- Only return valid, self-contained HTML.
- Do NOT include explanations, comments, or additional text.
- Do NOT wrap the response in backticks or markdown.
- The response must start with "<div>" and end with "</div>".`;
};

module.exports = { generateResumeTemplatePrompt };
