# Full Stack Cricket Club Management System (Project 4)

This project integrates a complete Vanilla JS frontend with a Node.js/Express backend (MongoDB).

## Project Structure
- `/frontend` - Contains HTML, CSS, and Vanilla JS
- `/backend` - Contains the Express server, Mongoose models, and API logic.

## Prerequisites
- Node.js installed
- MongoDB installed locally OR a MongoDB Atlas account

## Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Configuration:
   The backend uses port `5000` by default. Update the `.env` if necessary.
   Ensure `MONGO_URI` is correctly pointing to your MongoDB instance.
4. Start the backend server:
   ```bash
   npm run dev
   ```

## Frontend Setup

The frontend consists of static files. You can serve them using any local HTTP server.

**Option 1: Using Node's `serve`**
```bash
npm install -g serve
cd frontend
serve .
```

**Option 2: Using VS Code Live Server**
Right-click on `frontend/index.html` and select "Open with Live Server".

## API Endpoints (Backend)
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Authenticate
- `GET /api/users/profile` - Get logged-in user profile
- `GET /api/players` - Get all players (supports `?search=`)
- `POST /api/players` - Create a player
- `PUT /api/players/:id` - Update a player
- `DELETE /api/players/:id` - Delete a player

## Features
- Complete CRUD operations for Players
- User Authentication (JWT)
- Fetch API wrapper for cleanly making requests
- Toast notifications for user feedback
- Beautiful styling matching the 2025 warm aesthetics
