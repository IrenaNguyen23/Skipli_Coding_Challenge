# Skipli Coding Challenge

This repository contains the solution for the Skipli Coding Challenge, a web application that enables users to authenticate via email, search for GitHub users, like their profiles, and view a list of liked profiles. The project includes both the backend (Node.js/Express) and frontend (React), integrated in a single repository.

## Features
- **Email Authentication**: Users verify their identity by receiving a 6-digit access code via email.
- **GitHub User Search**: Search GitHub users by username with paginated results.
- **Profile Liking**: Like GitHub profiles, with persistent state across sessions.
- **User Profile**: View authenticated user's email and list of liked GitHub profiles.
- **Responsive UI**: Built with Material-UI for a clean, user-friendly interface.
- **Logout**: Users can log out to clear session data.

## Project Structure

The repository is organized as follows:

- **`/skipli-backend`**: Backend source code (Node.js/Express).
  - `/src`: Main source code.
    - `/config/firebase.js`: Firebase configuration for Firestore.
    - `/routes/api.js`: API routes for authentication, GitHub search, and profile management.
    - `/index.js`: Entry point for the Express server.
  - `/.env`: Environment variables (not committed, see `.env.example`).
  - `/package.json`: Backend dependencies and scripts.
- **`/skipli-frontend`**: Frontend source code (React).
  - `/src`: Main source code.
    - `/api/api.js`: Centralized API client for all backend requests.
    - `/components`: React components (`AccessCodeForm.js`, `GitHubSearch.js`).
    - `/pages`: Page components (`Auth.js`, `Search.js`, `Profile.js`, `GitHubUser.js`).
    - `/theme.js`: Material-UI theme configuration.
    - `/App.js`: Main app component with routing.
    - `/App.css`: Global styles.
  - `/.env`: Environment variables (not committed, see `.env.example`).
  - `/package.json`: Frontend dependencies and scripts.
- **`README.md`**: This documentation file.

## Technologies Used

- **Backend**:
  - Node.js, Express
  - Firebase Admin SDK (Firestore)
  - SendGrid (email notifications)
  - Axios (GitHub API requests)
- **Frontend**:
  - React, React Router
  - Material-UI
  - Axios
- **Others**:
  - GitHub API (user search and profile details)
  - dotenv (environment variables)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase project with Firestore enabled
- SendGrid account with API key
- GitHub Personal Access Token (for API rate limits)
- Git (for cloning the repository)

## Setup and Running

### 1. Clone the Repository
```
git clone https://github.com/IrenaNguyen23/Skipli_Coding_Challenge.git
cd Skipli_Coding_Challenge
```

### 2. Backend Setup
Navigate to the backend directory:
```
cd skipli-backend
```

Install dependencies:
```
npm install
```

Create a .env file based on .env.example:
```
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_SENDER_EMAIL=your-verified-sender-email
GITHUB_TOKEN=your-github-personal-access-token
Obtain Firebase credentials from your Firebase Console.
Generate a SendGrid API key and verify a sender email.

```
Create a GitHub Personal Access Token with public_repo and read:user scopes.
Run the backend:
```
npm start
```

The server runs on http://localhost:3000.
### 3. Frontend Setup
Navigate to the frontend directory:
```
cd ../skipli-frontend
```

Install dependencies:
```
npm install
```

Create a .env file based on .env.example:

REACT_APP_API_URL=http://localhost:3000
```
npm start
```
The app runs on http://localhost:3001.

### 4. Testing the application
  POST /api/create-access-code:
  Parameters: { email }
  Response: { message: "Access code sent to email" }
  Description: Generates and sends a 6-digit access code to the provided email.
  
  POST /api/validate-access-code:
  Parameters: { email, accessCode }
  Response: { success: true }
  Description: Verifies the access code and clears it upon success
  
  GET /api/search-github-users:
  Parameters: q (search term), page, per_page
  Response: Array of GitHub users
  Description: Searches GitHub users by username.
  
  GET /api/github-user/:id:
  Parameters: id (GitHub user ID)
  Response: { login, id, avatar_url, html_url, public_repos, followers }
  Description: Retrieves details of a GitHub user.
  
  POST /api/like-github-user:
  Parameters: { email, githubUserId }
  Response: { success: true }
  Description: Likes a GitHub user profile.
  
  GET /api/user-profile/:email:
  Parameters: email
  Response: { favorite_github_users: [user_object, ...] }
  Description: Retrieves the list of liked GitHub users for a user.
  
### Contact
For questions or feedback, please contact Irena Nguyen at nguyenbaohoa02@gmail.com
