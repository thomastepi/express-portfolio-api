const sanitizeInput = (input) => {
  return input.replace(/\n/g, " ");
};

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

const generateResumeAnalyzerPrompt = (jobDescription) => {
  return `You are an expert resume analyst and career coach.  
Your task is to analyze a user's uploaded resume (PDF text will be provided)  
AND the target job description.  
Return your analysis *strictly* in the JSON structure below, with no additional text.

=========================
STRUCTURE TO RETURN
=========================
{
  "matchScore": number (0–100),
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "feedback": [
    {
      "section": string,
      "original": string,
      "suggestion": string
    }
  ]
}

=========================
YOUR INSTRUCTIONS
=========================

1. **Keyword Matching**
   - Extract the most important technical and non-technical keywords from the job description.
   - Compare them to the user's resume.
   - Place overlapping keywords in "matchedKeywords".
   - Place missing but relevant keywords in "missingKeywords".

2. **Match Score**
   - Score the resume from 0–100 based on:
     - keyword alignment
     - clarity of achievements
     - quantifiable impact
     - relevance of past experience
   - Return only a number. No explanation.

3. **Section-by-Section Feedback**
   Provide targeted improvement suggestions for the following (if present in resume):
   - Summary / Profile
   - Experience
   - Skills
   - Education
   - Projects (if applicable)

   For each section:
   - "original": Extract the part from the resume as-is (or summarize if long).
   - "suggestion": Rewrite or recommend improvements to better match the job description.

4. **Formatting Rules**
   - Return ONLY valid JSON.
   - No markdown, no commentary.
   - Do NOT include backticks.
   - Ensure JSON keys always exist even if arrays are empty.

=========================
INPUTS YOU WILL RECEIVE
=========================

JOB_DESCRIPTION: ${sanitizeInput(jobDescription)}

Now analyze the resume and return the final JSON strictly in the required structure.`;
};

const generateTailoredResumePrompt = (jobDescription, prevAnalysis) => {
  return `
   You are an expert resume writer and career coach.

Your job is to generate a tailored resume, in JSON format, based on:
1) The user's current resume text,
2) The target job description,
3) A previous AI analysis (with matchScore, matchedKeywords, missingKeywords, and detailed feedback).

You must:
- Apply the suggestions and guidance from the analysis.
- Align the resume strongly with the job description.
- Keep the content truthful and realistic based on the existing resume (do not invent degrees, companies, or skills that are not implied).
- Use concise, impact-focused, achievement-oriented bullet points.

=========================
OUTPUT FORMAT (IMPORTANT)
=========================

Return ONLY a single JSON object that matches EXACTLY this schema
(using these keys and these types):

{
  "firstName": string,
  "lastName": string,
  "email": string,
  "mobileNumber": string,
  "portfolio": string,
  "summary": string,
  "address": string,
  "education": Array,
  "skills": Array,
  "experience": Array,
  "projects": Array,
  "certifications": Array,
  "languages": Array
}

Rules:
- Do NOT include "username", "password", "googleId" or any other keys.
- All keys above MUST be present.
- If you have no data for a field, use:
  - an empty string for string fields
  - an empty array [] for array fields
- Do NOT wrap the JSON in markdown or backticks.
- Do NOT include any explanation, comments, or extra text outside the JSON.

=========================
CONTENT RULES
=========================

1. SUMMARY
   - Write a 2–4 sentence professional summary tailored to the job description.
   - Reference key technologies, experience level, and impact, using the analysis feedback.

2. SKILLS (Array)
   - A flat array of strings, e.g.:
     ["JavaScript", "React", "Node.js", "TypeScript", "MongoDB", "REST APIs"]
   - Include important matched keywords from the analysis.
   - Add missing but relevant keywords ONLY if they are reasonably supported by the resume content.
   - The skills array should have length <= 10.

3. EXPERIENCE (Array)
   - An array of objects, each representing a job.
   - Each object should look like this (structure example, not enforced by schema):
     {
       "title": "Front-End Developer",
       "company": "Acme Corp",
       "location": "Montreal, QC",
       "startDate": "Jan 2022",
       "endDate": "Present",
       "description": [
         "Built and maintained React-based dashboards used by 500+ users.",
         "Improved page load performance by 30% by optimizing bundle size.",
         "Collaborated with designers and backend engineers using Agile practices."
       ]
     }
   - Use strong action verbs and, when possible, quantifiable achievements.
   - Apply the improvements suggested in the analysis.feedback for Experience.

4. EDUCATION (Array)
   - An array of objects, each representing an education entry, e.g.:
     {
       "degree": "Diploma in Computer Science",
       "institution": "Some College",
       "location": "City, Country",
       "startDate": "2019",
       "endDate": "2021",
       "details": [
         "Specialized in web development and software engineering."
       ]
     }

5. PROJECTS (Array)
   - An array of objects, each representing a project relevant to the job, e.g.:
     {
       "name": "ResumeCraft - AI Resume Builder",
       "link": "https://example.com",
       "technologies": ["React", "Node.js", "MongoDB", "OpenAI API"],
       "description": [
         "Built an AI-powered resume builder that generates tailored, ATS-friendly resumes.",
         "Implemented PDF export and multi-language support."
       ]
     }
   - Focus on projects that are most aligned with the job description.

6. CERTIFICATIONS (Array)
   - An array of strings or objects describing relevant certifications.
   - Leave [] if none are present or implied.

7. LANGUAGES (Array)
   - An array of strings like ["English (Fluent)", "French (Intermediate)"] if known.
   - Otherwise, leave [].

8. ADDRESS
   - A single string summarizing the location, e.g. "Montreal, QC, Canada".

=========================
INPUTS YOU WILL RECEIVE
=========================

JOB_DESCRIPTION:
${sanitizeInput(jobDescription)}

ANALYSIS_RESULT_JSON:
${JSON.stringify(prevAnalysis)}

Use:
- ORIGINAL_RESUME_TEXT as the source of truth about the candidate,
- JOB_DESCRIPTION to align content and keywords,
- ANALYSIS_RESULT_JSON to apply improvements and address missing keywords.

Now generate the tailored resume and return ONLY the final JSON matching the required schema.`;
};

module.exports = {
  generateResumeTemplatePrompt,
  generateResumeAnalyzerPrompt,
  generateTailoredResumePrompt,
};
