# Cricket Club Management System API (Project 3)

A RESTful backend API for managing a Cricket Club, built with Node.js, Express.js, and MongoDB (via Mongoose). This project implements real database integration to persist data, replacing the previous in-memory storage.

## Tech Stack
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL Database
- **Mongoose**: MongoDB object modeling tool (ODM)
- **JWT (JSON Web Tokens)**: Authentication
- **Bcrypt**: Password hashing
- **Express-Validator**: Input validation

## Prerequisites
- Node.js installed
- MongoDB installed locally OR a MongoDB Atlas account

## Installation

1. Navigate into the project folder:
   ```bash
   cd decodelabs-project3
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to a new file named `.env` and fill in the values.
   ```bash
   cp .env.example .env
   ```

4. Start the server:
   ```bash
   # Development mode (auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

## Database Setup

By default, the application connects to a local MongoDB instance. You can modify the `MONGO_URI` in `.env` to connect to a cloud instance (e.g., MongoDB Atlas).

Example local URI: `mongodb://localhost:27017/cricket_db`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | The port the server runs on | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/cricket_db` |
| `JWT_SECRET` | Secret key for signing JWTs | `your-super-secret-key-change-this` |
| `JWT_EXPIRES` | JWT expiration time | `24h` |

## API Documentation

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API and DB health |
| POST | `/api/users` | Register a new user |
| POST | `/api/users/login` | Login user and get JWT |

### Protected Endpoints (Requires JWT)

*Include header: `Authorization: Bearer <your_token>`*

#### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (supports `?page=1&limit=10`) |
| GET | `/api/users/profile` | Get current logged-in user profile |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user (replace) |
| PATCH | `/api/users/:id` | Update user (partial) |
| DELETE | `/api/users/:id` | Delete a user |

#### Players
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players` | Get all players |
| POST | `/api/players` | Add new player |
| GET | `/api/players/:id` | Get player by ID |
| PUT | `/api/players/:id` | Update player |
| DELETE | `/api/players/:id` | Delete player |
| GET | `/api/players/search?team=India` | Filter players |

## Example Requests

### Register User (POST `/api/users`)
**Body:**
```json
{
    "name": "Rahul Sharma",
    "email": "rahul@cricket.com",
    "password": "Cricket123",
    "age": 25,
    "city": "Delhi",
    "phone": "9876543210"
}
```

### Create Player (POST `/api/players`)
**Body:**
```json
{
    "name": "Virat Kohli",
    "age": 34,
    "role": "Batsman",
    "team": "India",
    "stats": {
        "matches": 250,
        "runs": 12000,
        "wickets": 5,
        "highestScore": 183
    }
}
```

## Author
DecodeLabs Full Stack Development Internship
