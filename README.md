# Skipli Project

This is a web application that allows users to verify their email, search for GitHub users, like profiles, and view their liked profiles. The project consists of a Node.js/Express backend and a React frontend, using Firebase for storage and SendGrid for email notifications.

## Project Structure

The repository is organized as follows:

- **`/skipli-backend`**: Backend source code (Node.js/Express).
  - `/src`: Main source code.
    - `/config/firebase.js`: Firebase configuration.
    - `/routes/api.js`: API routes for authentication, GitHub search, and profile management.
    - `/index.js`: Entry point for the Express server.
  - `/.env`: Environment variables (not committed, see `.env.example`).
  - `/package.json`: Backend dependencies and scripts.
- **`/skipli-frontend`**: Frontend source code (React).
  - `/src`: Main source code.
    - `/components`: React components (`AccessCodeForm.js`, `GitHubSearch.js`).
    - `/pages`: Page components (`Auth.js`, `Search.js`, `Profile.js`, `GitHubUser.js`).
    - `/theme.js`: Material-UI theme configuration.
    - `/App.js`: Main app component with routing.
    - `/App.css`: Global styles.
  - `/package.json`: Frontend dependencies and scripts.
- **`/README.md`**: This file.

## Technologies Used

- **Backend**:
  - Node.js, Express
  - Firebase Admin SDK (Firestore)
  - SendGrid (email)
  - Axios (GitHub API)
- **Frontend**:
  - React, React Router
  - Material-UI
  - Axios
- **Others**:
  - GitHub API (search users, user profiles)
  - dotenv (environment variables)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase project with Firestore enabled
- SendGrid account with API key
- GitHub Personal Access Token (for API rate limits)
- Git (for cloning the repo)

## Setup and Running

### 1. Clone the Repository
```bash
git clone https://github.com/IrenaNguyen23/Skipli_Coding_Challenge
cd Skipli_Coding_Challenge```
