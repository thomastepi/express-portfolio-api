# Projects API – Centralized Backend for Multiple Applications

This repository contains a **Node.js and Express.js** backend API that powers various projects, handling requests from multiple frontend applications. The API is deployed on **Heroku** and interacts with a **MongoDB database**.

---

## Portfolio Website:

The API supports contact form submissions from my portfolio website, collecting essential user details:

- Name & Email – User identification.
- Type of Inquiry – Categorized as "Freelance," "Feedback," or "Other."
- Message Content – Inquiry details submitted via the contact form.

---

## Sawyer Camp Farmers Common Initiative Group Website: 

This API manages functionalities for the Sawyer Camp Farmers website, including:
- **Newsletter signups:** Users can subscribe to receive updates from the organization.
- **Contact form submissions:** Visitors can send inquiries or messages through the website's contact form.
- **Membership Registration:** Users can register to become members of the Sawyer Camp Farmers Common Initiative Group.
- **Member Account Signup/Login:** Registered members can create accounts and log in to access features specific to members (e.g. member directory).

---

## Resume Craft: AI-powered Resume Builder:

The API powers the Resume Craft web app, enabling:

- **User Accounts & Profiles** – Users create profiles with skills, experience, and education details (stored in MongoDB).
- **Guest Mode** – Allows browsing but restricts profile updates & AI resume generation.
- **JWT Authentication** – Secure user login using JSON Web Tokens (JWT).
- **AI Resume Generation** – Generates professional resumes using OpenAI's Chat Completion API (GPT-3.5 Turbo).

---

## BookMart: Book Inventory React Application: 

This API handles book inventory for the BookMart React app, allowing admin users to:

- Create new book entries.
- Read and view book details.
- Update existing records.
- Delete books from the inventory.
