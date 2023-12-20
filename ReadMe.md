# AI Resume Builder App

This application is an AI-powered resume builder that leverages the OpenAI API's text completion endpoint to generate resumes based on user inputs. The app is built using React on the frontend and an Express backend.

## Features

- **User Authentication:** Users can log in securely to access the resume-building features.
- **Profile Management:** Allows users to update their personal information, skills, education, experience, and projects.
- **AI-Generated Resumes:** Generates resumes in HTML format using the OpenAI API, based on the user's entered information.
- **Multiple Templates:** Offers various resume templates for user selection.

## Usage

1. **Installation**
    - Clone the repository: `git clone https://github.com/thomastepi/resume_builder_with_AI.git`
    - Install dependencies: `npm install`

2. **Running the App**
    - Start the frontend: `npm start`
    - Start the backend: `npm run server`

3. **API Configuration**
    - Set up your OpenAI API credentials in the backend environment variables.

4. **Usage Flow**
    - Register or log in to access profile management.
    - Update personal details, skills, education, experience, and projects.
    - Click on "Generate Resume using AI" to trigger AI-powered resume generation.
    - View and print generated resumes in various templates.

## Technologies Used

- **Frontend:** React, React Router, Ant Design, Axios, react-to-print
- **Backend:** Express.js, Axios
- **External APIs:** OpenAI API (Text Completion Endpoint)
