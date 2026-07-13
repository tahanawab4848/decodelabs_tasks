# Cricket Club Management System API

A RESTful backend API for managing a Cricket Club, built with Node.js and Express.js.

## Tech Stack
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **JWT (JSON Web Tokens)**: Authentication
- **Bcrypt**: Password hashing
- **Express-Validator**: Input validation

## Installation

1. Clone the repository or extract the project folder:
   ```bash
   cd decodelabs-project2
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

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | The port the server runs on | `3000` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_jwt_secret_key_here` |
| `JWT_EXPIRES` | JWT expiration time | `1d` |

## API Documentation

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API health |
| POST | `/api/users` | Register a new user |
| POST | `/api/users/login` | Login user and get JWT |

### Protected Endpoints (Requires JWT)

*Include header: `Authorization: Bearer <your_token>`*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (supports `?page=1&limit=10`) |
| GET | `/api/users/profile` | Get current logged-in user profile |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user (replace) |
| PATCH | `/api/users/:id` | Update user (partial) |
| DELETE | `/api/users/:id` | Delete a user |

## Example Requests

### Register User (POST `/api/users`)
**Body:**
```json
{
    "name": "Rahul Sharma",
    "email": "rahul@cricket.com",
    "password": "Cricket123"
}
```

### Login (POST `/api/users/login`)
**Body:**
```json
{
    "email": "rahul@cricket.com",
    "password": "Cricket123"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 4,
            "name": "Rahul Sharma",
            "email": "rahul@cricket.com"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

## Author
DecodeLabs Full Stack Development Internship
