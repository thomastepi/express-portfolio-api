# Projects API

This repository houses the Node.js and Express.js backend API for several projects:

## Portfolio Website:
This API handles contact form submissions from your portfolio website. The form might collect information like name, email, and message content.

## Sawyer Camp Farmers Common Initiative Group Website: 
This API manages functionalities for the Sawyer Camp Farmers website, including:
- **Newsletter signups:** Users can subscribe to receive updates from the organization.
- **Contact form submissions:** Visitors can send inquiries or messages through the website's contact form.
- **Membership Registration:** Users can register to become members of the Sawyer Camp Farmers Common Initiative Group.
- **Member Account Signup/Login:** Registered members can create accounts and log in to access features specific to members (e.g. member directory).

## Resume Craft: AI-powered Resume Builder:
This API provides functionalities for the resume builder application:
- **User Accounts and Profiles:** Users can create accounts and then update their profiles with information like skills, experience, and education. This information is stored in a MongoDB collection.
- **Guest Access:** Users who do not wish to create accounts can explore the application in guest mode. However, guest users cannot update profiles or generate AI resumes.
- **JWT Authentication:** The API utilizes JSON Web Tokens (JWT) for user authentication. Users who create accounts receive a JWT token upon successful login. This token is sent with each HTTP request to the backend, and the API verifies the token to ensure authorized access.
- **AI Resume Generation:** Users can generate AI-powered resumes based on their profile data using OpenAI's chat-completion endpoint.

## BookMart: Book Inventory React Application: 
This API powers the backend functionality for the BookMart application, allowing authorized admin users to perform CRUD (Create, Read, Update, Delete) operations on book entries. Admins can manage the book inventory by adding new books, editing existing entries, and deleting books from the database.
